import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** One plotted series: which key to read off each row, and how to name it. */
export interface ChartSeries {
  key: string;
  label: string;
}

/** Space reserved around the plot area for axes and labels. */
export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** A y-axis tick: its data value, its resolved svg y, and its formatted label. */
export interface ChartTick {
  value: number;
  y: number;
  label: string;
}

/** A horizontal slice of the plot belonging to one x position. */
export interface ChartBand {
  start: number;
  centre: number;
  width: number;
}

/** How x positions are resolved: discrete bands (bars) or points (line/area). */
export type ChartScaleMode = 'point' | 'band';

/**
 * Which physical axis carries the category vs the value. Only the band scale
 * (bars) supports 'horizontal' — line/area stay point-scale and vertical,
 * same as Tremor never offers a horizontal line/area chart either.
 */
export type ChartOrientation = 'vertical' | 'horizontal';

/** Number of chart palette steps that exist. A 6th series does not get a colour. */
export const CHART_COLOR_LIMIT = 5;

/**
 * The paint used for a series past `CHART_COLOR_LIMIT`.
 *
 * The palette is validated for lightness, chroma and colour-blind separation at
 * exactly five steps; generating a sixth would land outside that validation, and
 * wrapping back to step 1 would make two series share an identity. Both are
 * worse than dropping to a neutral, so the overflow is explicitly uncoloured.
 */
export const CHART_OVERFLOW_COLOR = 'rgb(var(--muted-foreground))';

/**
 * Hands out palette steps by entity key rather than by position.
 *
 * A key keeps its slot for the lifetime of the scale, which is what makes
 * colour follow the entity: filtering a series out and back in, or removing an
 * earlier one, must never repaint the survivors. Past the fifth distinct key
 * the scale stops colouring rather than inventing a step or wrapping around.
 */
export class ChartColorScale {
  private readonly slots = new Map<string, number>();
  private next = 0;

  /** Reserves slots for `keys` in order, leaving already-known keys alone. */
  register(keys: string[]): void {
    for (const key of keys) {
      if (!this.slots.has(key)) this.slots.set(key, this.next++);
    }
  }

  /** Paint for `key`, registering it on first sight. */
  colorFor(key: string): string {
    let slot = this.slots.get(key);
    if (slot === undefined) {
      slot = this.next++;
      this.slots.set(key, slot);
    }
    if (slot >= CHART_COLOR_LIMIT) return CHART_OVERFLOW_COLOR;
    return 'rgb(var(--chart-' + (slot + 1) + '))';
  }

  /** True when `key` fell past the palette and renders neutral. */
  isOverflow(key: string): boolean {
    const slot = this.slots.get(key);
    return slot !== undefined && slot >= CHART_COLOR_LIMIT;
  }

  /** Slot index assigned to `key`, or undefined when it is unknown. */
  slotOf(key: string): number | undefined {
    return this.slots.get(key);
  }
}

/**
 * Owns layout, scales and colour assignment for one `tolle-chart`, so every
 * child draws into the same coordinate space. Renders nothing itself.
 *
 * Provided on `ChartComponent`, so each chart gets its own instance.
 */
@Injectable()
export class ChartService {
  /** Rows being plotted, in x order. */
  data: Record<string, any>[] = [];
  /** Series definitions, in the order they should take palette steps. */
  series: ChartSeries[] = [];
  /** Row key holding the x category/label. */
  xKey = '';
  /** Whether marks stack on a shared baseline rather than sitting side by side. */
  stacked = false;
  /** Full svg width in px, tracked from the container's ResizeObserver. */
  width = 0;
  /** Full svg height in px. */
  height = 260;
  /** Space reserved around the plot area. */
  margin: ChartMargin = { top: 8, right: 8, bottom: 24, left: 40 };
  /** Fraction of a band's step spent on padding, split either side. */
  bandPadding = 0.2;
  /**
   * Which physical axis is the category axis. Bars flip this via `configure()`;
   * every other geometry getter branches on it internally, defaulting to the
   * exact vertical formula when unset, so existing vertical charts are unaffected.
   */
  orientation: ChartOrientation = 'vertical';

  private scaleMode: ChartScaleMode = 'point';
  private zeroRequired = false;

  private domainMin = 0;
  private domainMax = 1;
  private tickValues: number[] = [];
  private tickStep = 1;

  /** Palette assignment, keyed by series identity. */
  private readonly colors = new ChartColorScale();

  private readonly layoutSubject = new BehaviorSubject<number>(0);
  /** Emits a version number whenever scales, dimensions or data change. */
  readonly layout$ = this.layoutSubject.asObservable();

  private readonly activeIndexSubject = new BehaviorSubject<number | null>(null);
  /** Index of the x position under the pointer, or null when not hovering. */
  readonly activeIndex$ = this.activeIndexSubject.asObservable();

  private layoutVersion = 0;
  private emitScheduled = false;

  // ---------------------------------------------------------------- geometry

  get plotLeft(): number {
    return this.margin.left;
  }

  get plotTop(): number {
    return this.margin.top;
  }

  get plotWidth(): number {
    return Math.max(0, this.width - this.margin.left - this.margin.right);
  }

  get plotHeight(): number {
    return Math.max(0, this.height - this.margin.top - this.margin.bottom);
  }

  get plotRight(): number {
    return this.plotLeft + this.plotWidth;
  }

  get plotBottom(): number {
    return this.plotTop + this.plotHeight;
  }

  /** Number of x positions. */
  get count(): number {
    return this.data.length;
  }

  /** How x is currently resolved. Bars flip this to 'band'. */
  get mode(): ChartScaleMode {
    return this.scaleMode;
  }

  /** Resolved y ticks, with svg coordinates and formatted labels. */
  get ticks(): ChartTick[] {
    return this.tickValues.map((value) => ({
      value,
      y: this.yFor(value),
      label: this.formatValue(value),
    }));
  }

  /** Current y domain as [min, max]. */
  get domain(): [number, number] {
    return [this.domainMin, this.domainMax];
  }

  /** The x-axis category labels, one per row. */
  get xLabels(): string[] {
    return this.data.map((row) => {
      const raw = row?.[this.xKey];
      return raw == null ? '' : String(raw);
    });
  }

  // ------------------------------------------------------------ registration

  /**
   * Replaces the chart's configuration and recomputes the scales.
   * Called by the container on input changes and on resize.
   */
  configure(config: Partial<Pick<ChartService,
    'data' | 'series' | 'xKey' | 'stacked' | 'width' | 'height' | 'margin' | 'bandPadding' | 'orientation'>>): void {
    Object.assign(this, config);
    if (config.series) this.syncColorSlots(config.series);
    this.recompute();
  }

  /** Switches x to a band scale. Bars call this; it also forces zero into the domain. */
  useBandScale(): void {
    if (this.scaleMode === 'band' && this.zeroRequired) return;
    this.scaleMode = 'band';
    this.zeroRequired = true;
    this.recompute();
  }

  /** Forces zero into the y domain, for marks anchored to a baseline. */
  requireZero(): void {
    if (this.zeroRequired) return;
    this.zeroRequired = true;
    this.recompute();
  }

  /** Reserves palette slots in series order, leaving known keys untouched. */
  private syncColorSlots(series: ChartSeries[]): void {
    this.colors.register(series.map((item) => item.key));
  }

  /**
   * Paint for a series, keyed by identity rather than by index in the visible
   * array. Past the fifth distinct key this returns the neutral overflow colour.
   */
  colorFor(seriesKey: string): string {
    return this.colors.colorFor(seriesKey);
  }

  /** True when this series fell past the palette and renders neutral. */
  isOverflowSeries(seriesKey: string): boolean {
    return this.colors.isOverflow(seriesKey);
  }

  // -------------------------------------------------------------- the scales

  /** Reads a series value off a row, or null when it is missing/non-numeric. */
  valueAt(seriesKey: string, index: number): number | null {
    const raw = this.data[index]?.[seriesKey];
    if (raw == null || raw === '') return null;
    const num = Number(raw);
    return Number.isFinite(num) ? num : null;
  }

  /** Sum of every series below `seriesKey` at `index`, for stacked marks. */
  stackBase(seriesKey: string, index: number): number {
    if (!this.stacked) return 0;
    let base = 0;
    for (const item of this.series) {
      if (item.key === seriesKey) break;
      base += this.valueAt(item.key, index) ?? 0;
    }
    return base;
  }

  /** Sum of every series at `index`. */
  stackTotal(index: number): number {
    let total = 0;
    for (const item of this.series) total += this.valueAt(item.key, index) ?? 0;
    return total;
  }

  /**
   * Maps a data value to a position along the *value* axis — svg y when
   * vertical (svg y grows downward, so the domain maximum lands on `plotTop`),
   * svg x when horizontal (the domain maximum lands on `plotRight`).
   */
  yFor(value: number): number {
    const span = this.domainMax - this.domainMin;
    if (this.orientation === 'horizontal') {
      if (span <= 0) return this.plotLeft;
      const ratio = (value - this.domainMin) / span;
      return this.plotLeft + ratio * this.plotWidth;
    }
    if (span <= 0) return this.plotBottom;
    const ratio = (value - this.domainMin) / span;
    return this.plotBottom - ratio * this.plotHeight;
  }

  /** The value-axis position of the zero line, clamped into the plot. */
  get baselineY(): number {
    const zero = Math.min(Math.max(0, this.domainMin), this.domainMax);
    return this.yFor(zero);
  }

  /** Length of the plot along the category axis: `plotHeight` when horizontal, else `plotWidth`. */
  private get categoryAxisLength(): number {
    return this.orientation === 'horizontal' ? this.plotHeight : this.plotWidth;
  }

  /** Origin of the plot along the category axis: `plotTop` when horizontal, else `plotLeft`. */
  private get categoryAxisOrigin(): number {
    return this.orientation === 'horizontal' ? this.plotTop : this.plotLeft;
  }

  /** Width of one band, excluding its padding. Meaningful in band mode. */
  get bandWidth(): number {
    if (this.count === 0) return 0;
    return this.bandStep * (1 - this.bandPadding);
  }

  /** Distance between adjacent band starts. Bands tile the plot exactly. */
  get bandStep(): number {
    if (this.count === 0) return 0;
    return this.categoryAxisLength / this.count;
  }

  /**
   * Geometry of the band at `index`, along the category axis — x when
   * vertical (today's meaning), y when horizontal.
   */
  bandFor(index: number): ChartBand {
    const step = this.bandStep;
    const width = this.bandWidth;
    const start = this.categoryAxisOrigin + index * step + (step - width) / 2;
    return { start, centre: start + width / 2, width };
  }

  /** x of the data point at `index` on the point scale. */
  pointX(index: number): number {
    if (this.count === 0) return this.plotLeft;
    if (this.count === 1) return this.plotLeft + this.plotWidth / 2;
    return this.plotLeft + (index * this.plotWidth) / (this.count - 1);
  }

  /** x of `index` under whichever scale the chart is currently using. */
  xFor(index: number): number {
    return this.scaleMode === 'band' ? this.bandFor(index).centre : this.pointX(index);
  }

  /**
   * The pointer catchment area for `index` — deliberately wider than the mark.
   * In band mode it is the whole band step; on the point scale it runs to the
   * midpoints of the neighbouring points, so the pointer only has to be nearest.
   */
  hitBandFor(index: number): ChartBand {
    if (this.scaleMode === 'band') {
      const step = this.bandStep;
      const start = this.categoryAxisOrigin + index * step;
      return { start, centre: start + step / 2, width: step };
    }
    const x = this.pointX(index);
    const prev = index > 0 ? this.pointX(index - 1) : this.plotLeft - (this.plotRight - this.plotLeft);
    const next =
      index < this.count - 1 ? this.pointX(index + 1) : this.plotRight + (this.plotRight - this.plotLeft);
    const start = Math.max(this.plotLeft, (prev + x) / 2);
    const end = Math.min(this.plotRight, (x + next) / 2);
    return { start, centre: x, width: Math.max(0, end - start) };
  }

  // --------------------------------------------------------------- hovering

  /** Index currently under the pointer, or null. */
  get activeIndex(): number | null {
    return this.activeIndexSubject.value;
  }

  setActiveIndex(index: number | null): void {
    if (this.activeIndexSubject.value === index) return;
    this.activeIndexSubject.next(index);
  }

  // ----------------------------------------------------------------- domains

  private recompute(): void {
    const values: number[] = [];

    if (this.stacked) {
      for (let i = 0; i < this.count; i++) values.push(this.stackTotal(i));
      // A stack still has to show its own floor when a series goes negative.
      for (const item of this.series) {
        for (let i = 0; i < this.count; i++) {
          const v = this.valueAt(item.key, i);
          if (v != null && v < 0) values.push(v);
        }
      }
    } else {
      for (const item of this.series) {
        for (let i = 0; i < this.count; i++) {
          const v = this.valueAt(item.key, i);
          if (v != null) values.push(v);
        }
      }
    }

    if (this.zeroRequired) values.push(0);

    const [min, max, step, ticks] = niceScale(values);
    this.domainMin = min;
    this.domainMax = max;
    this.tickStep = step;
    this.tickValues = ticks;

    // Only tell subscribers when something they would draw differently actually
    // changed. `configure()` is called from ngOnChanges, and an app binding
    // `[data]="items.filter(...)"` hands us a fresh array reference on every
    // change-detection pass — an ordinary thing to write. Emitting on every call
    // made subscribers markForCheck, which scheduled another pass, which called
    // configure again: the cycle never closed and the page locked up.
    const signature = this.layoutSignature(values);
    if (signature === this.lastSignature) return;
    this.lastSignature = signature;

    this.scheduleEmit();
  }

  /** Everything a subscriber would render differently, flattened for comparison. */
  private lastSignature = '';

  private layoutSignature(values: number[]): string {
    return [
      this.count,
      this.xKey,
      this.stacked,
      this.width,
      this.height,
      this.bandPadding,
      this.scaleMode,
      this.orientation,
      this.zeroRequired,
      this.margin.top, this.margin.right, this.margin.bottom, this.margin.left,
      this.domainMin, this.domainMax, this.tickStep,
      this.tickValues.join(','),
      this.series.map((s) => s.key + ':' + s.label).join(','),
      this.xLabels.join(''),
      values.join(','),
    ].join(' ');
  }

  /**
   * Coalesces layout notifications into a microtask, so several children
   * registering in the same change-detection pass produce one emission after
   * they have all settled rather than one each mid-pass.
   */
  private scheduleEmit(): void {
    this.layoutVersion++;
    if (this.emitScheduled) return;
    this.emitScheduled = true;
    queueMicrotask(() => {
      this.emitScheduled = false;
      this.layoutSubject.next(this.layoutVersion);
    });
  }

  /** Formats a value for a tick label at the current tick step's precision. */
  formatValue(value: number): string {
    const decimals = decimalsFor(this.tickStep);
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  // ------------------------------------------------------------------- paths

  /** Straight-segment path through the series' defined points. */
  linePath(seriesKey: string): string {
    return buildPath(this.pointsFor(seriesKey), false);
  }

  /** Monotone-cubic path through the series' defined points. */
  smoothPath(seriesKey: string): string {
    return buildPath(this.pointsFor(seriesKey), true);
  }

  /**
   * Filled-area path: the series' line, closed back along its baseline. When
   * stacked, the floor is the top of the series below rather than zero.
   */
  areaPath(seriesKey: string, smooth: boolean): string {
    const points = this.pointsFor(seriesKey);
    if (points.length === 0) return '';

    const top = buildPath(points, smooth);
    const floor = points
      .map((p) => {
        const base = this.stacked ? this.stackBase(seriesKey, p.index) : 0;
        return { x: p.x, y: this.yFor(base), index: p.index };
      })
      .reverse();
    const bottom = buildPath(floor, smooth);
    // Re-enter the reversed floor with a line, then close.
    return top + ' L ' + floor[0].x + ' ' + floor[0].y + ' ' + bottom.replace(/^M/, 'L') + ' Z';
  }

  /** Resolved svg points for a series, skipping rows where it has no value. */
  pointsFor(seriesKey: string): { x: number; y: number; index: number }[] {
    const points: { x: number; y: number; index: number }[] = [];
    for (let i = 0; i < this.count; i++) {
      const v = this.valueAt(seriesKey, i);
      if (v == null) continue;
      const stacked = this.stacked ? this.stackBase(seriesKey, i) + v : v;
      points.push({ x: this.xFor(i), y: this.yFor(stacked), index: i });
    }
    return points;
  }
}

// ------------------------------------------------------------- pure helpers

/** Decimal places worth showing for a given tick step. */
export function decimalsFor(step: number): number {
  if (!Number.isFinite(step) || step <= 0) return 0;
  return Math.max(0, Math.min(6, -Math.floor(Math.log10(step))));
}

/**
 * Rounds a raw step up to the next 1/2/5 x 10^n.
 *
 * Dividing the range by a tick count instead would produce steps like 19.4 and
 * so axis labels like 19.4 / 38.8 / 58.2, which nobody can read a value off.
 */
export function niceStep(rawStep: number): number {
  if (!Number.isFinite(rawStep) || rawStep <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalised = rawStep / magnitude;
  let multiplier: number;
  if (normalised <= 1) multiplier = 1;
  else if (normalised <= 2) multiplier = 2;
  else if (normalised <= 5) multiplier = 5;
  else multiplier = 10;
  return multiplier * magnitude;
}

/**
 * Builds a readable y scale over `values`: returns `[min, max, step, ticks]`
 * with the domain snapped outward to whole steps.
 *
 * Degenerate inputs (empty, all-identical) still produce a usable one-unit
 * domain rather than a zero-height plot.
 */
export function niceScale(values: number[], targetTicks = 5): [number, number, number, number[]] {
  const finite = values.filter((v) => Number.isFinite(v));

  let min = finite.length ? Math.min(...finite) : 0;
  let max = finite.length ? Math.max(...finite) : 1;

  if (min === max) {
    // A flat or single-point domain has no span to divide; open it to one unit
    // around the value so the mark sits on a real axis instead of on the floor.
    if (min === 0) {
      min = 0;
      max = 1;
    } else if (min > 0) {
      min = Math.min(0, min);
      max = max === 0 ? 1 : max;
      if (min === max) max = min + 1;
    } else {
      max = Math.max(0, max);
      if (min === max) min = max - 1;
    }
  }

  const step = niceStep((max - min) / targetTicks);
  // Nudge before rounding outward: 100/20 lands a hair above 5 in binary
  // floating point, which would otherwise add a phantom tick at 120.
  const epsilon = 1e-9;
  const niceMin = Math.floor(min / step + epsilon) * step;
  const niceMax = Math.ceil(max / step - epsilon) * step;
  const decimals = decimalsFor(step);

  const ticks: number[] = [];
  const total = Math.round((niceMax - niceMin) / step);
  for (let i = 0; i <= total; i++) {
    ticks.push(Number((niceMin + i * step).toFixed(decimals)));
  }

  return [Number(niceMin.toFixed(decimals)), Number(niceMax.toFixed(decimals)), step, ticks];
}

/**
 * Monotone-cubic tangents (Fritsch-Carlson). Limiting each tangent to the
 * neighbouring secants is what stops the curve overshooting: a plain
 * Catmull-Rom spline bulges past the data and invents peaks that were never
 * measured, which on a chart is a false statement about the numbers.
 */
export function monotoneTangents(xs: number[], ys: number[]): number[] {
  const n = xs.length;
  if (n < 2) return new Array(n).fill(0);

  const secants: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = xs[i + 1] - xs[i];
    secants.push(dx === 0 ? 0 : (ys[i + 1] - ys[i]) / dx);
  }

  const m: number[] = new Array(n);
  m[0] = secants[0];
  m[n - 1] = secants[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = (secants[i - 1] + secants[i]) / 2;

  for (let i = 0; i < n - 1; i++) {
    if (secants[i] === 0) {
      // Flat segment: both ends must be flat or the curve leaves the data range.
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / secants[i];
    const b = m[i + 1] / secants[i];
    // Negative ratios mean the tangent points away from the secant.
    if (a < 0) m[i] = 0;
    if (b < 0) m[i + 1] = 0;
    const sum = a * a + b * b;
    if (sum > 9) {
      const t = 3 / Math.sqrt(sum);
      m[i] = t * a * secants[i];
      m[i + 1] = t * b * secants[i];
    }
  }

  return m;
}

/** Turns resolved points into an svg path, optionally monotone-smoothed. */
export function buildPath(points: { x: number; y: number }[], smooth: boolean): string {
  if (points.length === 0) return '';
  if (points.length === 1) return 'M ' + points[0].x + ' ' + points[0].y;

  const head = 'M ' + points[0].x + ' ' + points[0].y;
  if (!smooth) {
    return head + points.slice(1).map((p) => ' L ' + p.x + ' ' + p.y).join('');
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const m = monotoneTangents(xs, ys);

  let d = head;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = xs[i + 1] - xs[i];
    const c1x = xs[i] + dx / 3;
    const c1y = ys[i] + (m[i] * dx) / 3;
    const c2x = xs[i + 1] - dx / 3;
    const c2y = ys[i + 1] - (m[i + 1] * dx) / 3;
    d += ' C ' + c1x + ' ' + c1y + ' ' + c2x + ' ' + c2y + ' ' + xs[i + 1] + ' ' + ys[i + 1];
  }
  return d;
}
