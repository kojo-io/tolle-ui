import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartComponent,
  ChartLineComponent,
  ChartAreaComponent,
  ChartBarComponent,
  type ChartMargin,
  type ChartSeries,
} from './chart.component';

/**
 * A minimal inline chart: one series, no grid, no axes, no legend — sized to
 * sit next to a number in a table cell or a stat card. A thin composition
 * over `tolle-chart`; it draws nothing of its own and inherits `--chart-1`
 * the same way any other single-series chart in this library does.
 * @new
 */
@Component({
  selector: 'tolle-chart-spark',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, ChartComponent, ChartLineComponent, ChartAreaComponent, ChartBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tolle-chart
      [class]="class"
      [data]="data"
      [series]="series"
      [xKey]="xKey"
      [height]="height"
      [margin]="margin"
      [hover]="hover"
      [showTable]="showTable"
      [ariaLabel]="ariaLabel"
      [description]="description"
    >
      <svg:g *ngIf="type === 'line'" tolle-chart-line [seriesKey]="valueKey" [curve]="curve"></svg:g>
      <svg:g *ngIf="type === 'area'" tolle-chart-area [seriesKey]="valueKey" [curve]="curve"></svg:g>
      <svg:g *ngIf="type === 'bar'" tolle-chart-bar [seriesKey]="valueKey" [maxWidth]="maxBarWidth"></svg:g>
    </tolle-chart>
  `,
})
export class ChartSparkComponent implements OnChanges {
  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Rows to plot, in x order. @default [] */
  @Input() data: Record<string, any>[] = [];
  /** Row key holding each row's numeric value. @default 'value' */
  @Input() valueKey = 'value';
  /** Row key holding each row's x position. Only matters once `hover` is on. @default '' */
  @Input() xKey = '';
  /** Which mark to draw. @default 'line' */
  @Input() type: 'line' | 'area' | 'bar' = 'line';
  /** Interpolation for line/area. @default 'linear' */
  @Input() curve: 'linear' | 'smooth' = 'linear';
  /** Largest bar thickness in px, used when `type` is 'bar'. @default 6 */
  @Input() maxBarWidth = 6;
  /** Height in px. @default 32 */
  @Input() height = 32;
  /** Renders the crosshair, hit layer and tooltip. @default false */
  @Input() hover = false;
  /** Shows the data table instead of leaving it visually hidden. @default false */
  @Input() showTable = false;
  /** Accessible name, used as the svg <title>. @default '' */
  @Input() ariaLabel = '';
  /** Longer summary used as the svg <desc>. Falls back to `ariaLabel`. @default '' */
  @Input() description = '';
  /** Space reserved around the plot — a sparkline has no axis labels to fit. @default { top: 2, right: 2, bottom: 2, left: 2 } */
  @Input() margin: ChartMargin = { top: 2, right: 2, bottom: 2, left: 2 };
  /** Extra Tailwind classes merged onto the chart via `cn()` (last-wins). */
  @Input() class = '';

  private readonly cdr = inject(ChangeDetectorRef);

  /** Always exactly one series, reading `valueKey` off each row. */
  get series(): ChartSeries[] {
    return [{ key: this.valueKey, label: this.ariaLabel || this.valueKey }];
  }
}
