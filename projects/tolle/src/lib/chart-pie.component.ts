import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import { ChartService, ChartColorScale } from './chart.service';
import { ChartTableComponent } from './chart.component';

let chartPieId = 0;

/** One resolved slice: its geometry, its paint, and the numbers behind it. */
export interface ChartPieSlice {
  label: string;
  value: number;
  percent: number;
  color: string;
  /** The arc path, already padded for the surface gap. */
  d: string;
  /** Mid-angle point on the outer edge, used to place the tooltip. */
  anchorX: number;
  anchorY: number;
}

/** Converts an angle measured clockwise from 12 o'clock into svg coordinates. */
export function polarPoint(cx: number, cy: number, r: number, angle: number): [number, number] {
  return [cx + r * Math.sin(angle), cy - r * Math.cos(angle)];
}

/**
 * Builds one slice. `innerRadius` above zero produces a donut segment; a span
 * covering the full circle is drawn as two half arcs, because an SVG arc whose
 * start and end points coincide renders nothing at all.
 */
export function arcPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  start: number,
  end: number
): string {
  const span = end - start;
  if (span <= 0) return '';

  if (span >= Math.PI * 2 - 1e-6) {
    const mid = start + Math.PI;
    return arcPath(cx, cy, outer, inner, start, mid) + ' ' + arcPath(cx, cy, outer, inner, mid, end);
  }

  const large = span > Math.PI ? 1 : 0;
  const [ox0, oy0] = polarPoint(cx, cy, outer, start);
  const [ox1, oy1] = polarPoint(cx, cy, outer, end);

  if (inner > 0) {
    const [ix1, iy1] = polarPoint(cx, cy, inner, end);
    const [ix0, iy0] = polarPoint(cx, cy, inner, start);
    return (
      'M ' + ox0 + ' ' + oy0 +
      ' A ' + outer + ' ' + outer + ' 0 ' + large + ' 1 ' + ox1 + ' ' + oy1 +
      ' L ' + ix1 + ' ' + iy1 +
      ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + ix0 + ' ' + iy0 +
      ' Z'
    );
  }

  return (
    'M ' + cx + ' ' + cy +
    ' L ' + ox0 + ' ' + oy0 +
    ' A ' + outer + ' ' + outer + ' 0 ' + large + ' 1 ' + ox1 + ' ' + oy1 +
    ' Z'
  );
}

const chartPieVariants = cva('relative w-full', {
  variants: {
    variant: {
      default: '',
      card: 'rounded-lg border border-border bg-background p-4',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type ChartPieProps = VariantProps<typeof chartPieVariants>;

/**
 * A pie or donut drawn from hand-written SVG arcs.
 *
 * Slices are separated by a real 2px angular gap rather than a stroke, so what
 * divides them is surface rather than added ink. Colour is assigned by slice
 * label, so re-sorting or filtering the data never repaints a slice, and a
 * sixth slice falls back to a neutral rather than reusing `--chart-1`.
 *
 * Renders its own legend at two or more slices, a per-slice hover tooltip, and
 * the same accessible `tolle-chart-table` fallback as `tolle-chart`.
 * @new
 */
@Component({
  selector: 'tolle-chart-pie',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, ChartTableComponent],
  providers: [ChartService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <div class="relative w-full">
        <svg
          role="img"
          width="100%"
          [attr.height]="size"
          [attr.viewBox]="viewBox"
          [attr.aria-label]="ariaLabel || null"
          [attr.aria-describedby]="tableId"
          class="block w-full"
          (pointerleave)="onLeave()"
        >
          <title>{{ ariaLabel }}</title>
          <desc>{{ description || ariaLabel }}</desc>

          <svg:path
            *ngFor="let slice of slices; let i = index; trackBy: trackSlice"
            [attr.d]="slice.d"
            [attr.fill]="slice.color"
            [attr.fill-opacity]="activeIndex === i ? 1 : 0.85"
            (pointerenter)="onEnter(i)"
          ></svg:path>
        </svg>

        <div
          *ngIf="activeSlice"
          role="status"
          aria-live="polite"
          class="pointer-events-none absolute z-10 min-w-[8rem] rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md"
          [style.left.px]="tooltipLeft"
          [style.top.px]="tooltipTop"
        >
          <div class="flex items-center gap-2 text-xs">
            <span class="h-2 w-2 shrink-0 rounded-[2px]" [style.background]="activeSlice.color"></span>
            <span class="text-muted-foreground">{{ activeSlice.label }}</span>
            <span class="ml-auto font-medium tabular-nums text-foreground">
              {{ formatValue(activeSlice.value) }}
            </span>
          </div>
          <p class="mt-0.5 text-right text-xs text-muted-foreground tabular-nums">
            {{ formatPercent(activeSlice.percent) }}
          </p>
        </div>
      </div>

      <ul *ngIf="slices.length > 1" class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-2 text-xs">
        <li *ngFor="let slice of slices; trackBy: trackSlice" class="flex items-center gap-1.5">
          <span class="h-2 w-2 shrink-0 rounded-[2px]" [style.background]="slice.color"></span>
          <span class="text-muted-foreground">{{ slice.label }}</span>
        </li>
      </ul>

      <tolle-chart-table
        [tableId]="tableId"
        [visible]="showTable"
        [xHeader]="labelHeader"
        [caption]="ariaLabel || 'Chart data'"
      ></tolle-chart-table>
    </div>
  `,
})
export class ChartPieComponent implements OnChanges {
  /** Rows to plot, one slice each. @default [] */
  @Input() data: Record<string, any>[] = [];
  /** Row key holding each slice's numeric value. @default 'value' */
  @Input() valueKey = 'value';
  /** Row key holding each slice's label. @default 'label' */
  @Input() labelKey = 'label';
  /** Cuts a hole in the middle, making it a donut. @default false */
  @Input() donut = false;
  /** Hole size as a fraction of the outer radius, used when `donut` is set. @default 0.6 */
  @Input() innerRadius = 0.6;
  /** Width and height of the square plot in px. @default 240 */
  @Input() size = 240;
  /** Angular gap between slices, expressed in px of arc at the outer edge. @default 2 */
  @Input() gap = 2;
  /** Accessible name for the chart, used as the svg `<title>`. @default '' */
  @Input() ariaLabel = '';
  /** Longer summary used as the svg `<desc>`. Falls back to `ariaLabel`. @default '' */
  @Input() description = '';
  /** Shows the data table instead of leaving it visually hidden. @default false */
  @Input() showTable = false;
  /** Column header the table fallback gives the label column. @default 'Category' */
  @Input() labelHeader = 'Category';
  /** Column header the table fallback gives the value column. @default 'Value' */
  @Input() valueHeader = 'Value';
  /** Visual treatment of the chart frame. @default 'default' */
  @Input() variant: ChartPieProps['variant'] = 'default';
  /** Extra Tailwind classes merged onto the chart via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the hovered slice index, or null when the pointer leaves. */
  @Output() activeIndexChange = new EventEmitter<number | null>();

  private readonly cdr = inject(ChangeDetectorRef);
  /** Only used to feed the shared table fallback; the pie owns its own colours. */
  private readonly tableSource = inject(ChartService);
  private readonly colors = new ChartColorScale();

  /** Id of the table fallback, referenced by the svg's `aria-describedby`. */
  readonly tableId = 'chart-pie-table-' + chartPieId++;

  /** Index of the hovered slice, or null. */
  activeIndex: number | null = null;

  ngOnChanges(): void {
    // Reserve palette slots in data order, so a slice keeps its colour when the
    // data is later re-sorted or filtered.
    this.colors.register(this.labels);
    this.tableSource.configure({
      data: this.data ?? [],
      xKey: this.labelKey,
      series: [{ key: this.valueKey, label: this.valueHeader }],
    });
    this._slices = this.computeSlices();
  
    // A bound `class` input is written through Angular's styling path,
    // which does not mark an OnPush view dirty on its own.
    this.cdr.markForCheck();
  }

  private get labels(): string[] {
    return (this.data ?? []).map((row) => {
      const raw = row?.[this.labelKey];
      return raw == null ? '' : String(raw);
    });
  }

  get viewBox(): string {
    return '0 0 ' + this.size + ' ' + this.size;
  }

  private get outerRadius(): number {
    return this.size / 2;
  }

  /**
   * Resolved slices in data order, each already padded for the surface gap.
   *
   * Computed once per input change, NOT per read. Three template bindings read
   * this each pass; when it rebuilt the array every time, `*ngFor` saw fresh
   * identities and tore down every `<path>` on every change-detection run.
   * Destroying the node under the pointer re-fires `pointerenter`, which calls
   * `markForCheck`, which schedules another pass — the chart locked the page up.
   */
  get slices(): ChartPieSlice[] {
    return this._slices;
  }

  private _slices: ChartPieSlice[] = [];

  /** Identity for `*ngFor`, so a redraw patches attributes instead of replacing nodes. */
  trackSlice = (_: number, slice: ChartPieSlice): string => slice.label;

  private computeSlices(): ChartPieSlice[] {
    const rows = this.data ?? [];
    const values = rows.map((row) => {
      const num = Number(row?.[this.valueKey]);
      // A pie divides a whole; a negative share has no meaning in one.
      return Number.isFinite(num) && num > 0 ? num : 0;
    });
    const total = values.reduce((sum, v) => sum + v, 0);
    if (total <= 0) return [];

    const cx = this.size / 2;
    const cy = this.size / 2;
    const outer = this.outerRadius;
    const inner = this.donut ? outer * Math.min(0.95, Math.max(0, this.innerRadius)) : 0;
    // Turn a px gap at the rim into the angle that subtends it.
    const pad = outer > 0 ? this.gap / outer : 0;

    const out: ChartPieSlice[] = [];
    let cursor = 0;

    for (let i = 0; i < rows.length; i++) {
      const value = values[i];
      if (value <= 0) continue;

      const span = (value / total) * Math.PI * 2;
      const start = cursor;
      const end = cursor + span;
      cursor = end;

      // Never let the gap eat a slice: a sliver keeps a hairline of itself.
      const usable = Math.max(span * 0.2, span - pad);
      const inset = (span - usable) / 2;
      const label = this.labels[i];
      const mid = start + span / 2;
      const [anchorX, anchorY] = polarPoint(cx, cy, (outer + inner) / 2, mid);

      out.push({
        label,
        value,
        percent: value / total,
        color: this.colors.colorFor(label),
        d: arcPath(cx, cy, outer, inner, start + inset, end - inset),
        anchorX,
        anchorY,
      });
    }

    return out;
  }

  get activeSlice(): ChartPieSlice | null {
    if (this.activeIndex === null) return null;
    return this.slices[this.activeIndex] ?? null;
  }

  get tooltipLeft(): number {
    const slice = this.activeSlice;
    if (!slice) return 0;
    // Flip toward the centre rather than let the readout leave the frame.
    return slice.anchorX > this.size / 2
      ? Math.max(0, slice.anchorX - 140)
      : Math.min(this.size, slice.anchorX + 8);
  }

  get tooltipTop(): number {
    return this.activeSlice ? this.activeSlice.anchorY : 0;
  }

  formatValue(value: number): string {
    return value.toLocaleString('en-US');
  }

  formatPercent(percent: number): string {
    return (percent * 100).toFixed(1) + '%';
  }

  onEnter(index: number): void {
    if (this.activeIndex === index) return;
    this.activeIndex = index;
    this.activeIndexChange.emit(index);
    this.cdr.markForCheck();
  }

  onLeave(): void {
    if (this.activeIndex === null) return;
    this.activeIndex = null;
    this.activeIndexChange.emit(null);
    this.cdr.markForCheck();
  }

  get computedClass() {
    return cn(chartPieVariants({ variant: this.variant }), this.class);
  }
}
