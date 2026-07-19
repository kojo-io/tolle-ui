import { Component, Directive, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, OnInit, OnChanges, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import { ChartService, type ChartSeries, type ChartMargin } from './chart.service';

export type { ChartSeries, ChartMargin, ChartTick, ChartBand } from './chart.service';

let chartId = 0;

/**
 * Base for every chart part that has to redraw when the shared scales change.
 * Parts subscribe to the service rather than reading the container component,
 * so an OnPush child still updates when the container's inputs or width change.
 */
@Directive()
export abstract class ChartChild implements OnChanges, OnInit, OnDestroy {
  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook subclasses keep
   * rendering the class they were born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  protected readonly chart = inject(ChartService);
  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly subscriptions = new Subscription();

  /**
   * Identity for the mark `*ngFor`s. The collections behind them are rebuilt on
   * every read, so without this `*ngFor` sees new identities each pass and
   * replaces every node instead of patching it. Marks are positional, so the
   * index IS the identity.
   */
  trackByIndex = (index: number): number => index;

  ngOnInit(): void {
    this.register();
    this.subscriptions.add(this.chart.layout$.subscribe(() => this.cdr.markForCheck()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** Hook for parts that need to influence the shared scales before first paint. */
  protected register(): void {}
}

/**
 * The floating readout for the hovered x position. Lists every series at that
 * x, so the pointer never has to land on a particular line to get a value.
 * Rendered automatically by `tolle-chart` when `hover` is on.
 */
@Component({
  selector: 'tolle-chart-tooltip',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      *ngIf="index !== null"
      role="status"
      aria-live="polite"
      [class]="computedClass"
      [style.left.px]="left"
      [style.top.px]="top"
    >
      <p class="mb-1 text-xs font-medium text-foreground">{{ xLabel }}</p>
      <div *ngFor="let row of rows; trackBy: trackByIndex" class="flex items-center gap-2 text-xs">
        <span class="h-0.5 w-3 shrink-0 rounded-full" [style.background]="row.color"></span>
        <span class="text-muted-foreground">{{ row.label }}</span>
        <span class="ml-auto font-medium tabular-nums text-foreground">{{ row.value }}</span>
      </div>
    </div>
  `,
})
export class ChartTooltipComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Identity for `*ngFor`, so a redraw patches nodes instead of replacing them. */
  trackByIndex = (index: number): number => index;

  /** Distance in px the tooltip sits from the crosshair. @default 12 */
  @Input() offset = 12;
  /** Assumed tooltip width in px, used to flip it near the right edge. @default 160 */
  @Input() estimatedWidth = 160;
  /** Extra Tailwind classes merged onto the tooltip via `cn()` (last-wins). */
  @Input() class = '';

  private readonly chart = inject(ChartService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  /** Row index the tooltip is describing, or null when nothing is hovered. */
  index: number | null = null;

  ngOnInit(): void {
    this.subscriptions.add(
      this.chart.activeIndex$.subscribe((index) => {
        this.index = index;
        this.cdr.markForCheck();
      })
    );
    this.subscriptions.add(this.chart.layout$.subscribe(() => this.cdr.markForCheck()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get xLabel(): string {
    return this.index === null ? '' : this.chart.xLabels[this.index] ?? '';
  }

  /** One row per series: colour key, label, and the formatted value. */
  get rows(): { label: string; value: string; color: string }[] {
    const index = this.index;
    if (index === null) return [];
    return this.chart.series.map((item) => {
      const value = this.chart.valueAt(item.key, index);
      return {
        label: item.label,
        value: value == null ? '—' : this.chart.formatValue(value),
        color: this.chart.colorFor(item.key),
      };
    });
  }

  get left(): number {
    if (this.index === null) return 0;
    const x = this.chart.xFor(this.index);
    // Flip to the left of the crosshair rather than overflow the container.
    if (x + this.offset + this.estimatedWidth > this.chart.width) {
      return Math.max(0, x - this.offset - this.estimatedWidth);
    }
    return x + this.offset;
  }

  get top(): number {
    return this.chart.plotTop;
  }

  get computedClass() {
    return cn(
      'pointer-events-none absolute z-10 min-w-[8rem] rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md',
      this.class
    );
  }
}

const chartLegendVariants = cva('flex flex-wrap items-center gap-x-4 gap-y-1 pt-2', {
  variants: {
    align: { start: 'justify-start', center: 'justify-center', end: 'justify-end' },
    size: { sm: 'text-[11px]', default: 'text-xs' },
  },
  defaultVariants: { align: 'center', size: 'default' },
});

export type ChartLegendProps = VariantProps<typeof chartLegendVariants>;

/**
 * Swatch and label per series. Rendered automatically by `tolle-chart` whenever
 * there are two or more series, so identity is never carried by colour alone.
 * A single series gets no legend — the chart's own label already names it.
 */
@Component({
  selector: 'tolle-chart-legend',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul [class]="computedClass">
      <li *ngFor="let entry of entries; trackBy: trackByIndex" class="flex items-center gap-1.5">
        <span class="h-2 w-2 shrink-0 rounded-[2px]" [style.background]="entry.color"></span>
        <span class="text-muted-foreground">{{ entry.label }}</span>
      </li>
    </ul>
  `,
})
export class ChartLegendComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Identity for `*ngFor`, so a redraw patches nodes instead of replacing them. */
  trackByIndex = (index: number): number => index;

  /** Horizontal alignment of the legend row. @default 'center' */
  @Input() align: ChartLegendProps['align'] = 'center';
  /** Text size of the legend. @default 'default' */
  @Input() size: ChartLegendProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the legend via `cn()` (last-wins). */
  @Input() class = '';

  private readonly chart = inject(ChartService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(this.chart.layout$.subscribe(() => this.cdr.markForCheck()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** One entry per series, coloured by series identity. */
  get entries(): { label: string; color: string }[] {
    return this.chart.series.map((item) => ({
      label: item.label,
      color: this.chart.colorFor(item.key),
    }));
  }

  get computedClass() {
    return cn(chartLegendVariants({ align: this.align, size: this.size }), this.class);
  }
}

const chartTableVariants = cva('w-full text-left text-xs', {
  variants: {
    visible: {
      true: 'mt-4 border-collapse',
      false: 'sr-only',
    },
  },
  defaultVariants: { visible: false },
});

export type ChartTableProps = VariantProps<typeof chartTableVariants>;

/**
 * The chart's data as a real `<table>`. Visually hidden by default and pointed
 * at by the svg's `aria-describedby`, so every value the chart encodes in
 * colour stays reachable without seeing or hovering it. Set `visible` to show it.
 */
@Component({
  selector: 'tolle-chart-table',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [attr.id]="tableId || null">
      <table [class]="computedClass">
        <caption class="sr-only">{{ caption }}</caption>
        <thead>
          <tr>
            <th scope="col" class="border-b border-border px-2 py-1 font-medium text-muted-foreground">
              {{ xHeader }}
            </th>
            <th
              *ngFor="let item of chart.series; trackBy: trackByIndex"
              scope="col"
              class="border-b border-border px-2 py-1 font-medium text-muted-foreground"
            >
              {{ item.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of rows; trackBy: trackByIndex">
            <th scope="row" class="border-b border-border px-2 py-1 font-normal text-foreground">
              {{ row.label }}
            </th>
            <td
              *ngFor="let cell of row.cells; trackBy: trackByIndex"
              class="border-b border-border px-2 py-1 tabular-nums text-foreground"
            >
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class ChartTableComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Identity for `*ngFor`, so a redraw patches nodes instead of replacing them. */
  trackByIndex = (index: number): number => index;

  /** Shows the table instead of hiding it from sighted readers. @default false */
  @Input() visible = false;
  /** Id applied to the wrapper, for the chart's `aria-describedby`. @default '' */
  @Input() tableId = '';
  /** Column header for the x category. @default 'Category' */
  @Input() xHeader = 'Category';
  /** Accessible caption for the table. @default 'Chart data' */
  @Input() caption = 'Chart data';
  /** Extra Tailwind classes merged onto the table via `cn()` (last-wins). */
  @Input() class = '';

  protected readonly chart = inject(ChartService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(this.chart.layout$.subscribe(() => this.cdr.markForCheck()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** One row per x position, with a formatted cell per series. */
  get rows(): { label: string; cells: string[] }[] {
    return this.chart.xLabels.map((label, i) => ({
      label,
      cells: this.chart.series.map((item) => {
        const value = this.chart.valueAt(item.key, i);
        return value == null ? '—' : this.chart.formatValue(value);
      }),
    }));
  }

  get computedClass() {
    return cn(chartTableVariants({ visible: this.visible }), this.class);
  }
}

const chartVariants = cva('relative w-full', {
  variants: {
    variant: {
      default: '',
      card: 'rounded-lg border border-border bg-background p-4',
    },
    density: {
      default: '',
      compact: 'text-xs',
    },
  },
  defaultVariants: { variant: 'default', density: 'default' },
});

export type ChartProps = VariantProps<typeof chartVariants>;

/**
 * Container for a hand-rolled SVG chart. Owns the responsive `<svg>`, the
 * shared scales (via the `ChartService` it provides), the hover layer, the
 * legend and the accessible table fallback.
 *
 * Marks and axes are projected as SVG children. They use attribute selectors on
 * `svg:g` rather than element selectors, because a custom element is created in
 * the HTML namespace and an HTML element inside an `<svg>` never renders its
 * SVG subtree:
 *
 * ```html
 * <tolle-chart [data]="rows" [series]="series" xKey="month" ariaLabel="Revenue">
 *   <svg:g tolle-chart-grid></svg:g>
 *   <svg:g tolle-chart-y-axis></svg:g>
 *   <svg:g tolle-chart-x-axis></svg:g>
 *   <svg:g tolle-chart-line seriesKey="revenue" curve="smooth"></svg:g>
 * </tolle-chart>
 * ```
 *
 * There is deliberately no secondary y-axis: two measures on two scales in one
 * frame let the author choose where the lines cross, so the reader sees a
 * relationship the data does not contain. Use two charts, small multiples, or
 * index both series to a common base instead.
 * @new
 */
@Component({
  selector: 'tolle-chart',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, ChartTooltipComponent, ChartLegendComponent, ChartTableComponent],
  providers: [ChartService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <div class="relative w-full" #plot>
        <svg
          role="img"
          width="100%"
          [attr.height]="height"
          [attr.viewBox]="viewBox"
          [attr.aria-label]="ariaLabel || null"
          [attr.aria-describedby]="tableId"
          class="block w-full overflow-visible"
          (pointerleave)="onPointerLeave()"
        >
          <title>{{ ariaLabel }}</title>
          <desc>{{ description || ariaLabel }}</desc>

          <svg:g>
            <ng-content></ng-content>
          </svg:g>

          <svg:line
            *ngIf="crosshairX !== null"
            [attr.x1]="crosshairX"
            [attr.x2]="crosshairX"
            [attr.y1]="chart.plotTop"
            [attr.y2]="chart.plotBottom"
            class="pointer-events-none stroke-border"
            stroke-width="1"
          ></svg:line>

          <svg:rect
            *ngFor="let band of hitBands; let i = index; trackBy: trackByIndex"
            [attr.x]="band.start"
            [attr.y]="chart.plotTop"
            [attr.width]="band.width"
            [attr.height]="chart.plotHeight"
            fill="transparent"
            (pointerenter)="onEnterBand(i)"
          ></svg:rect>
        </svg>

        <tolle-chart-tooltip *ngIf="hover"></tolle-chart-tooltip>
      </div>

      <tolle-chart-legend *ngIf="series.length > 1"></tolle-chart-legend>

      <tolle-chart-table [tableId]="tableId" [visible]="showTable" [xHeader]="xHeader"></tolle-chart-table>
    </div>
  `,
})
export class ChartComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  /** Identity for `*ngFor`, so a redraw patches nodes instead of replacing them. */
  trackByIndex = (index: number): number => index;

  /** Rows to plot, in x order. @default [] */
  @Input() data: Record<string, any>[] = [];
  /** Series to draw, in the order they take palette steps `--chart-1`..`--chart-5`. @default [] */
  @Input() series: ChartSeries[] = [];
  /** Row key holding each row's x category label. @default '' */
  @Input() xKey = '';
  /** Height of the chart in px. @default 260 */
  @Input() height = 260;
  /** Space reserved around the plot for axis labels. @default { top: 8, right: 8, bottom: 24, left: 44 } */
  @Input() margin: ChartMargin = { top: 8, right: 8, bottom: 24, left: 44 };
  /** Accessible name for the chart, used as the svg `<title>`. @default '' */
  @Input() ariaLabel = '';
  /** Longer summary used as the svg `<desc>`. Falls back to `ariaLabel`. @default '' */
  @Input() description = '';
  /** Stacks marks on a shared baseline instead of grouping them. @default false */
  @Input() stacked = false;
  /** Renders the crosshair, hit layer and shared tooltip. @default true */
  @Input() hover = true;
  /** Shows the data table instead of leaving it visually hidden. @default false */
  @Input() showTable = false;
  /** Column header the table fallback gives the x category. @default 'Category' */
  @Input() xHeader = 'Category';
  /** Visual treatment of the chart frame. @default 'default' */
  @Input() variant: ChartProps['variant'] = 'default';
  /** Text density of the chart chrome. @default 'default' */
  @Input() density: ChartProps['density'] = 'default';
  /** Extra Tailwind classes merged onto the chart via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the hovered row index, or null when the pointer leaves. */
  @Output() activeIndexChange = new EventEmitter<number | null>();

  @ViewChild('plot') plotRef?: ElementRef<HTMLElement>;

  protected readonly chart = inject(ChartService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();
  private resizeObserver?: ResizeObserver;

  /** Width used until the container has been measured. */
  static readonly fallbackWidth = 600;

  /** Id of the table fallback, referenced by the svg's `aria-describedby`. */
  readonly tableId = 'chart-table-' + chartId++;

  /** X of the crosshair, or null when nothing is hovered or the scale is banded. */
  crosshairX: number | null = null;

  ngOnInit(): void {
    this.push();
    this.subscriptions.add(this.chart.layout$.subscribe(() => this.cdr.markForCheck()));
    this.subscriptions.add(
      this.chart.activeIndex$.subscribe((index) => {
        // Bars carry their own hover state; a crosshair belongs to point scales.
        this.crosshairX =
          index != null && this.chart.mode === 'point' ? this.chart.xFor(index) : null;
        this.activeIndexChange.emit(index);
        this.cdr.markForCheck();
      })
    );
  }

  ngOnChanges(): void {
    this.push();
  
    // A bound `class` input is written through Angular's styling path,
    // which does not mark an OnPush view dirty on its own.
    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    const host = this.plotRef?.nativeElement;
    if (!host) return;
    this.measure(host);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.measure(host);
        this.cdr.markForCheck();
      });
      this.resizeObserver.observe(host);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.subscriptions.unsubscribe();
  }

  private measure(host: HTMLElement): void {
    const width = host.clientWidth || ChartComponent.fallbackWidth;
    if (width === this.chart.width) return;
    this.chart.configure({ width });
  }

  private push(): void {
    this.chart.configure({
      data: this.data ?? [],
      series: this.series ?? [],
      xKey: this.xKey,
      stacked: this.stacked,
      height: this.height,
      margin: this.margin,
      width: this.chart.width || ChartComponent.fallbackWidth,
    });
  }

  get viewBox(): string {
    return '0 0 ' + (this.chart.width || ChartComponent.fallbackWidth) + ' ' + this.height;
  }

  /**
   * One catchment rect per x position, deliberately wider than the marks it
   * covers — readers aim at a category, never at a 2px line or an 8px dot.
   */
  get hitBands() {
    if (!this.hover) return [];
    return this.data.map((_, i) => this.chart.hitBandFor(i));
  }

  onEnterBand(index: number): void {
    this.chart.setActiveIndex(index);
  }

  onPointerLeave(): void {
    this.chart.setActiveIndex(null);
  }

  get computedClass() {
    return cn(chartVariants({ variant: this.variant, density: this.density }), this.class);
  }
}

/** Horizontal rules at the y ticks, with optional vertical rules at the x positions. */
@Component({
  selector: 'svg:g[tolle-chart-grid]',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg:line
      *ngFor="let tick of chart.ticks; trackBy: trackByIndex"
      [attr.x1]="chart.plotLeft"
      [attr.x2]="chart.plotRight"
      [attr.y1]="tick.y"
      [attr.y2]="tick.y"
      [class]="lineClass"
      stroke-width="1"
    ></svg:line>
    <svg:line
      *ngFor="let x of verticalXs; trackBy: trackByIndex"
      [attr.x1]="x"
      [attr.x2]="x"
      [attr.y1]="chart.plotTop"
      [attr.y2]="chart.plotBottom"
      [class]="lineClass"
      stroke-width="1"
    ></svg:line>
  `,
})
export class ChartGridComponent extends ChartChild {
  /** Also draws a rule at every x position. @default false */
  @Input() vertical = false;
  /** Extra Tailwind classes merged onto each rule via `cn()` (last-wins). */
  @Input() class = '';

  get verticalXs(): number[] {
    if (!this.vertical) return [];
    return this.chart.xLabels.map((_, i) => this.chart.xFor(i));
  }

  get lineClass(): string {
    // Recessive by design: a grid is a reading aid, never a mark.
    return cn('stroke-border opacity-60', this.class);
  }
}

/** X-axis tick labels, thinned so they never collide. */
@Component({
  selector: 'svg:g[tolle-chart-x-axis]',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg:text
      *ngFor="let tick of visibleTicks; trackBy: trackByIndex"
      [attr.x]="tick.x"
      [attr.y]="labelY"
      text-anchor="middle"
      dominant-baseline="hanging"
      [class]="labelClass"
    >{{ tick.label }}</svg:text>
  `,
})
export class ChartXAxisComponent extends ChartChild {
  /** Approximate px per character, used to decide when labels would collide. @default 7 */
  @Input() charWidth = 7;
  /** Extra Tailwind classes merged onto each label via `cn()` (last-wins). */
  @Input() class = '';

  /**
   * Draw every nth label. Derived from the widest label and the space each one
   * gets, so a dense axis thins out instead of overprinting itself.
   */
  get stride(): number {
    const labels = this.chart.xLabels;
    if (labels.length === 0) return 1;
    const widest = labels.reduce((max, label) => Math.max(max, label.length), 0);
    const needed = widest * this.charWidth + 8;
    const perLabel = this.chart.plotWidth / labels.length;
    if (perLabel <= 0) return 1;
    return Math.max(1, Math.ceil(needed / perLabel));
  }

  get visibleTicks(): { x: number; label: string }[] {
    const stride = this.stride;
    return this.chart.xLabels
      .map((label, i) => ({ label, x: this.chart.xFor(i), i }))
      .filter((tick) => tick.i % stride === 0);
  }

  get labelY(): number {
    return this.chart.plotBottom + 8;
  }

  get labelClass(): string {
    // Text wears a text token, never the series colour.
    return cn('fill-muted-foreground text-xs', this.class);
  }
}

/** Y-axis tick labels at the nice tick values. */
@Component({
  selector: 'svg:g[tolle-chart-y-axis]',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg:text
      *ngFor="let tick of chart.ticks; trackBy: trackByIndex"
      [attr.x]="labelX"
      [attr.y]="tick.y"
      text-anchor="end"
      dominant-baseline="middle"
      [class]="labelClass"
    >{{ tick.label }}</svg:text>
  `,
})
export class ChartYAxisComponent extends ChartChild {
  /** Gap in px between the labels and the plot edge. @default 8 */
  @Input() offset = 8;
  /** Extra Tailwind classes merged onto each label via `cn()` (last-wins). */
  @Input() class = '';

  get labelX(): number {
    return this.chart.plotLeft - this.offset;
  }

  get labelClass(): string {
    return cn('fill-muted-foreground text-xs tabular-nums', this.class);
  }
}

/** A line mark for one series, optionally monotone-smoothed and dotted. */
@Component({
  selector: 'svg:g[tolle-chart-line]',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg:path
      [attr.d]="path"
      fill="none"
      [attr.stroke]="color"
      stroke-width="2"
      stroke-linejoin="round"
      stroke-linecap="round"
      [class]="class"
    ></svg:path>
    <svg:circle
      *ngFor="let point of dots; trackBy: trackByIndex"
      [attr.cx]="point.x"
      [attr.cy]="point.y"
      [attr.r]="dotRadius"
      [attr.fill]="color"
      class="stroke-background"
      stroke-width="2"
    ></svg:circle>
  `,
})
export class ChartLineComponent extends ChartChild {
  /** Key of the series to draw. @default '' */
  @Input() seriesKey = '';
  /** Interpolation between points; smooth is monotone cubic, so it never overshoots. @default 'linear' */
  @Input() curve: 'linear' | 'smooth' = 'linear';
  /** Draws a marker at every point. @default false */
  @Input() showDots = false;
  /** Marker radius in px; 4 gives the 8px minimum diameter. @default 4 */
  @Input() dotRadius = 4;
  /** Extra Tailwind classes merged onto the path via `cn()` (last-wins). */
  @Input() class = '';

  get path(): string {
    return this.curve === 'smooth'
      ? this.chart.smoothPath(this.seriesKey)
      : this.chart.linePath(this.seriesKey);
  }

  get color(): string {
    return this.chart.colorFor(this.seriesKey);
  }

  get dots(): { x: number; y: number; index: number }[] {
    return this.showDots ? this.chart.pointsFor(this.seriesKey) : [];
  }
}

/** A filled area for one series: a low-opacity wash under a 2px stroke. */
@Component({
  selector: 'svg:g[tolle-chart-area]',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg:path
      [attr.d]="areaPath"
      [attr.fill]="color"
      [attr.fill-opacity]="fillOpacity"
      stroke="none"
    ></svg:path>
    <svg:path
      [attr.d]="linePath"
      fill="none"
      [attr.stroke]="color"
      stroke-width="2"
      stroke-linejoin="round"
      stroke-linecap="round"
      [class]="class"
    ></svg:path>
  `,
})
export class ChartAreaComponent extends ChartChild {
  /** Key of the series to draw. @default '' */
  @Input() seriesKey = '';
  /** Interpolation between points. @default 'linear' */
  @Input() curve: 'linear' | 'smooth' = 'linear';
  /** Opacity of the fill — a wash, never a saturated block. @default 0.1 */
  @Input() fillOpacity = 0.1;
  /** Extra Tailwind classes merged onto the stroke via `cn()` (last-wins). */
  @Input() class = '';

  /** An area is anchored to a baseline, so zero has to be in the domain. */
  protected override register(): void {
    this.chart.requireZero();
  }

  get areaPath(): string {
    return this.chart.areaPath(this.seriesKey, this.curve === 'smooth');
  }

  get linePath(): string {
    return this.curve === 'smooth'
      ? this.chart.smoothPath(this.seriesKey)
      : this.chart.linePath(this.seriesKey);
  }

  get color(): string {
    return this.chart.colorFor(this.seriesKey);
  }
}

/**
 * Builds a bar whose data end is rounded and whose baseline end stays square.
 * Handles both directions, so a negative value rounds downward.
 */
export function barPath(
  x: number,
  width: number,
  yBase: number,
  yValue: number,
  radius: number
): string {
  const height = Math.abs(yBase - yValue);
  const r = Math.max(0, Math.min(radius, width / 2, height));
  const right = x + width;
  // Which way the corner curves depends on which side of the baseline we are.
  const sign = yValue <= yBase ? 1 : -1;
  const corner = yValue + sign * r;

  return (
    'M ' + x + ' ' + yBase +
    ' L ' + x + ' ' + corner +
    ' Q ' + x + ' ' + yValue + ' ' + (x + r) + ' ' + yValue +
    ' L ' + (right - r) + ' ' + yValue +
    ' Q ' + right + ' ' + yValue + ' ' + right + ' ' + corner +
    ' L ' + right + ' ' + yBase + ' Z'
  );
}

/**
 * A bar mark for one series. Grouped beside its siblings by default, stacked
 * when the container's `stacked` is set. The data end carries a 4px radius, the
 * baseline end stays square, and neighbours are separated by surface, not ink.
 */
@Component({
  selector: 'svg:g[tolle-chart-bar]',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg:path
      *ngFor="let bar of bars; trackBy: trackByIndex"
      [attr.d]="bar.d"
      [attr.fill]="color"
      [attr.fill-opacity]="bar.active ? 1 : 0.85"
    ></svg:path>
  `,
})
export class ChartBarComponent extends ChartChild {
  /** Key of the series to draw. @default '' */
  @Input() seriesKey = '';
  /** Corner radius on the data end in px. @default 4 */
  @Input() radius = 4;
  /** Largest bar thickness in px; a wider band becomes air, not a fatter bar. @default 24 */
  @Input() maxWidth = 24;
  /** Gap in px between adjacent bars and between stacked segments. @default 2 */
  @Input() gap = 2;
  /** Extra Tailwind classes merged onto each bar via `cn()` (last-wins). */
  @Input() class = '';

  /** Index currently hovered, so the bar under the pointer can lift. */
  activeIndex: number | null = null;

  /** Bars need a band scale and a zero baseline; both belong to the whole chart. */
  protected override register(): void {
    this.chart.useBandScale();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions.add(
      this.chart.activeIndex$.subscribe((index) => {
        this.activeIndex = index;
        this.cdr.markForCheck();
      })
    );
  }

  get color(): string {
    return this.chart.colorFor(this.seriesKey);
  }

  /** Geometry for every bar this series contributes. */
  get bars(): {
    d: string;
    active: boolean;
    x: number;
    width: number;
    yBase: number;
    yValue: number;
  }[] {
    const out: {
      d: string;
      active: boolean;
      x: number;
      width: number;
      yBase: number;
      yValue: number;
    }[] = [];
    const seriesCount = Math.max(1, this.chart.series.length);
    const found = this.chart.series.findIndex((item) => item.key === this.seriesKey);
    const slotIndex = found < 0 ? 0 : found;

    for (let i = 0; i < this.chart.count; i++) {
      const value = this.chart.valueAt(this.seriesKey, i);
      if (value == null) continue;

      const band = this.chart.bandFor(i);
      let x: number;
      let width: number;

      if (this.chart.stacked) {
        width = Math.min(this.maxWidth, band.width);
        x = band.centre - width / 2;
      } else {
        const slot = band.width / seriesCount;
        width = Math.min(this.maxWidth, Math.max(1, slot - this.gap));
        x = band.start + slot * slotIndex + (slot - width) / 2;
      }

      const base = this.chart.stacked ? this.chart.stackBase(this.seriesKey, i) : 0;
      const yBase = this.chart.yFor(base);
      let yValue = this.chart.yFor(base + value);

      // The gap between stacked segments comes off the data end, so what
      // separates them is surface showing through rather than a stroke.
      if (this.chart.stacked && Math.abs(yBase - yValue) > this.gap) {
        yValue += value >= 0 ? this.gap : -this.gap;
      }

      out.push({
        d: barPath(x, width, yBase, yValue, this.radius),
        active: this.activeIndex === i,
        x,
        width,
        yBase,
        yValue,
      });
    }
    return out;
  }
}
