import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

/** One resolved row: its label, its value, and its share of the list's largest value. */
export interface BarListRow {
  label: string;
  value: number;
  percent: number;
  formattedValue: string;
}

/**
 * A ranked list of horizontal bars — label left, value right, bar width
 * scaled to each row's share of the list's largest value. Unlike a chart
 * series or a category bar's segments, every bar is the same accent: rank is
 * carried by length, not by a categorical palette.
 * @new
 */
@Component({
  selector: 'tolle-bar-list',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <div
        *ngFor="let row of rows; trackBy: trackByIndex"
        class="relative flex items-center overflow-hidden rounded-sm"
      >
        <div class="absolute inset-y-0 left-0 rounded-sm bg-primary/15" [style.width.%]="row.percent"></div>
        <span class="relative z-10 truncate px-2 py-1.5 text-sm text-foreground">{{ row.label }}</span>
        <span class="relative z-10 ml-auto shrink-0 px-2 py-1.5 text-sm font-medium tabular-nums text-foreground">
          {{ row.formattedValue }}
        </span>
      </div>
    </div>
  `,
})
export class BarListComponent implements OnChanges {
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

  /** Rows to rank, in the order they should be drawn. @default [] */
  @Input() data: Record<string, any>[] = [];
  /** Row key holding each row's label. @default 'label' */
  @Input() labelKey = 'label';
  /** Row key holding each row's numeric value. @default 'value' */
  @Input() valueKey = 'value';
  /** Extra Tailwind classes merged onto the list via `cn()` (last-wins). */
  @Input() class = '';

  private readonly cdr = inject(ChangeDetectorRef);

  get rows(): BarListRow[] {
    const rows = this.data ?? [];
    const values = rows.map((row) => {
      const num = Number(row?.[this.valueKey]);
      return Number.isFinite(num) ? num : 0;
    });
    const max = values.reduce((m, v) => Math.max(m, v), 0);

    return rows.map((row, i) => {
      const raw = row?.[this.labelKey];
      const value = values[i];
      return {
        label: raw == null ? '' : String(raw),
        value,
        percent: max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0,
        formattedValue: value.toLocaleString('en-US'),
      };
    });
  }

  get computedClass() {
    return cn('flex w-full flex-col gap-1', this.class);
  }
}
