import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';
import { TooltipDirective } from './tooltip.directive';

/** Health of one period in the strip. Maps to the theme's semantic status tokens, not the chart palette. */
export type TrackerStatus = 'success' | 'warning' | 'error' | 'neutral';

/** One block: its health, an optional per-block colour override, and the tooltip naming it. */
export interface TrackerBlock {
  status?: TrackerStatus;
  color?: string;
  tooltip?: string;
}

const STATUS_COLOR: Record<TrackerStatus, string> = {
  success: 'rgb(var(--success))',
  warning: 'rgb(var(--warning))',
  error: 'rgb(var(--destructive))',
  neutral: 'rgb(var(--muted))',
};

/**
 * A row of equal-width blocks, one per period — an uptime or activity strip.
 * Each block is a real `<button>` so its tooltip is reachable by keyboard and
 * has a screen-reader name of its own, not just a hover affordance.
 * @new
 */
@Component({
  selector: 'tolle-tracker',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass" role="group" [attr.aria-label]="ariaLabel || null">
      <button
        *ngFor="let block of data; let i = index; trackBy: trackByIndex"
        type="button"
        class="flex-1 rounded-[2px] transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        [style.height.px]="blockHeight"
        [style.background]="colorFor(block)"
        [tolleTooltip]="block.tooltip || ''"
        [attr.aria-label]="block.tooltip || 'Period ' + (i + 1)"
      ></button>
    </div>
  `,
})
export class TrackerComponent implements OnChanges {
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

  /** One block per period, in chronological order. @default [] */
  @Input() data: TrackerBlock[] = [];
  /** Height of each block in px. @default 32 */
  @Input() blockHeight = 32;
  /** Accessible name for the whole strip. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the strip via `cn()` (last-wins). */
  @Input() class = '';

  private readonly cdr = inject(ChangeDetectorRef);

  colorFor(block: TrackerBlock): string {
    return block.color || STATUS_COLOR[block.status ?? 'neutral'];
  }

  get computedClass() {
    return cn('flex w-full items-stretch gap-0.5', this.class);
  }
}
