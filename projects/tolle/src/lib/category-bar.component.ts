import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

/** One resolved segment: its share of the bar's width, its paint, and the numbers behind it. */
export interface CategoryBarSegment {
  label: string;
  value: number;
  percent: number;
  color: string;
}

/**
 * A single bar split into proportional, labelled ranges — for showing where
 * one value falls against a scale made of categories (a credit score inside
 * "Poor / Fair / Good / Excellent", latency inside "Fast / OK / Slow").
 *
 * Segments take the chart palette by position, since a category bar has no
 * stable per-render identity to key colour off the way a chart series does —
 * pass `colors` to override.
 * @new
 */
@Component({
  selector: 'tolle-category-bar',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <div class="relative flex w-full gap-0.5">
        <div
          *ngFor="let segment of segments; let i = index; trackBy: trackByIndex"
          class="h-2 first:rounded-l-full last:rounded-r-full"
          [style.width.%]="segment.percent"
          [style.background]="segment.color"
          [attr.title]="segment.label || null"
        ></div>

        <span
          *ngIf="clampedMarker !== null"
          class="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground shadow"
          [style.left.%]="clampedMarker"
        ></span>
      </div>

      <p class="sr-only">{{ summary }}</p>
    </div>
  `,
})
export class CategoryBarComponent implements OnChanges {
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

  /** Width of each segment. Values that are not finite and greater than zero are dropped. @default [] */
  @Input() values: number[] = [];
  /** Name for each segment, used in the accessible summary and as a title tooltip. @default [] */
  @Input() labels: string[] = [];
  /** Paint for each segment, by index. Falls back to the chart palette --chart-1 through --chart-5. @default [] */
  @Input() colors: string[] = [];
  /** Position of the pointer, 0-100 on the same scale the segments sum to. Omit to draw no pointer. @default null */
  @Input() markerValue: number | null = null;
  /** Accessible name, prefixed onto the sr-only summary of segments and marker. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the bar via `cn()` (last-wins). */
  @Input() class = '';

  private readonly cdr = inject(ChangeDetectorRef);

  private get total(): number {
    return this.values.reduce((sum, v) => (Number.isFinite(v) && v > 0 ? sum + v : sum), 0);
  }

  get segments(): CategoryBarSegment[] {
    const total = this.total;
    if (total <= 0) return [];

    return this.values
      .map((value, i) => ({ value, i }))
      .filter(({ value }) => Number.isFinite(value) && value > 0)
      .map(({ value, i }) => ({
        label: this.labels[i] ?? '',
        value,
        percent: (value / total) * 100,
        color: this.colors[i] || 'rgb(var(--chart-' + ((i % 5) + 1) + '))',
      }));
  }

  get clampedMarker(): number | null {
    if (this.markerValue == null || !Number.isFinite(this.markerValue)) return null;
    return Math.min(100, Math.max(0, this.markerValue));
  }

  get summary(): string {
    const parts = this.segments.map((s) => (s.label ? s.label + ': ' : '') + s.percent.toFixed(0) + '%');
    const marker = this.clampedMarker !== null ? ', current position ' + this.clampedMarker.toFixed(0) + '%' : '';
    const prefix = this.ariaLabel ? this.ariaLabel + '. ' : '';
    return prefix + parts.join(', ') + marker;
  }

  get computedClass() {
    return cn('w-full', this.class);
  }
}
