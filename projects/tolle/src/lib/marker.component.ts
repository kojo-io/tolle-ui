import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const markerVariants = cva('flex w-full items-center gap-2 text-xs', {
  variants: {
    variant: {
      // System notes and tool activity — centred, quiet.
      default: 'justify-center py-1 text-muted-foreground',
      // A labelled rule between two stretches of transcript.
      separator: 'py-3 text-muted-foreground',
      // Live status such as "Thinking…", aligned with the transcript's leading edge.
      status: 'justify-start py-1 text-muted-foreground',
      // A failed send or a tool error.
      error: 'justify-center py-1 font-medium text-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type MarkerProps = VariantProps<typeof markerVariants>;

/**
 * An inline row in a chat transcript that is not a message: a system note, a
 * streaming status, tool activity, or a labelled date separator.
 * @new
 */
@Component({
  selector: 'tolle-marker',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="computedClass"
      [attr.role]="variant === 'separator' ? 'separator' : isLive ? 'status' : null"
      [attr.aria-live]="isLive ? 'polite' : null">
      <span *ngIf="variant === 'separator'" aria-hidden="true" class="h-px flex-1 bg-border"></span>

      <i *ngIf="icon" [class]="iconClass" aria-hidden="true"></i>

      <span [class]="labelClass">
        <span *ngIf="label">{{ label }}</span>
        <ng-content></ng-content>
      </span>

      <span *ngIf="variant === 'separator'" aria-hidden="true" class="h-px flex-1 bg-border"></span>
    </div>
  `,
})
export class MarkerComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Kind of transcript marker this row represents. @default 'default' */
  @Input() variant: MarkerProps['variant'] = 'default';
  /** Text for the marker — the date on a separator, or the status wording. */
  @Input() label = '';
  /** Remixicon class for a leading icon, e.g. 'ri-tools-line'. */
  @Input() icon = '';
  /** Applies the shimmer text sweep, for live status such as "Thinking…". @default false */
  @Input() shimmer = false;
  /** Extra Tailwind classes merged onto the row via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass(): string {
    return cn(markerVariants({ variant: this.variant }), this.class);
  }

  /** Whether this marker announces a change to assistive technology. */
  get isLive(): boolean {
    return this.variant === 'status' || this.variant === 'error';
  }

  get iconClass(): string {
    return cn('shrink-0', this.icon, this.shimmer && 'animate-pulse');
  }

  get labelClass(): string {
    return cn(
      'inline-flex items-center gap-1 whitespace-nowrap',
      this.variant === 'separator' && 'shrink-0 px-1 font-medium',
      this.shimmer && 'shimmer'
    );
  }
}

/**
 * Groups related markers — a run of tool calls, say — into one indented block so
 * they read as a single step in the transcript.
 */
@Component({
  selector: 'tolle-marker-group',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="cn('flex w-full flex-col gap-0.5', class)" role="group"><ng-content></ng-content></div>`,
})
export class MarkerGroupComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Extra Tailwind classes merged onto the group via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}
