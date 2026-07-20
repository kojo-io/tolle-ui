import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

/**
 * Radial counterpart to `tolle-progress`: a ring that fills clockwise from
 * 12 o'clock. Project content to label the centre — a percentage, an icon,
 * whatever the caller wants; the ring renders nothing there on its own.
 * @new
 */
@Component({
  selector: 'tolle-progress-circle',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="computedClass"
      [style.width.px]="size"
      [style.height.px]="size"
      role="progressbar"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="100"
      [attr.aria-valuenow]="clampedValue"
    >
      <svg [attr.width]="size" [attr.height]="size" [attr.viewBox]="viewBox" class="block">
        <svg:circle
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="radius"
          fill="none"
          [attr.stroke-width]="strokeWidth"
          class="stroke-primary/20"
        ></svg:circle>
        <svg:circle
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="radius"
          fill="none"
          [attr.stroke-width]="strokeWidth"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="dashOffset"
          [attr.transform]="'rotate(-90 ' + center + ' ' + center + ')'"
          class="stroke-primary transition-[stroke-dashoffset] duration-300 ease-in-out"
        ></svg:circle>
      </svg>
      <div class="absolute inset-0 flex items-center justify-center text-sm font-medium tabular-nums text-foreground">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class ProgressCircleComponent implements OnChanges {
  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Percent complete, 0-100. @default 0 */
  @Input() value: number | null = 0;
  /** Diameter of the ring in px. @default 120 */
  @Input() size = 120;
  /** Thickness of the ring in px. @default 8 */
  @Input() strokeWidth = 8;
  /** Extra Tailwind classes merged onto the ring via `cn()` (last-wins). */
  @Input() class = '';

  private readonly cdr = inject(ChangeDetectorRef);

  get clampedValue(): number {
    return Math.min(100, Math.max(0, this.value ?? 0));
  }

  get viewBox(): string {
    return '0 0 ' + this.size + ' ' + this.size;
  }

  get center(): number {
    return this.size / 2;
  }

  /** Leaves half the stroke width as margin so the ring never clips the frame. */
  get radius(): number {
    return Math.max(0, (this.size - this.strokeWidth) / 2);
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get dashOffset(): number {
    return this.circumference * (1 - this.clampedValue / 100);
  }

  get computedClass() {
    return cn('relative inline-flex shrink-0 items-center justify-center', this.class);
  }
}
