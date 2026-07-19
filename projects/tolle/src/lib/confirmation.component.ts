import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

/** Whether the user has answered the prompt yet, and how. */
export type ConfirmationState = 'pending' | 'confirmed' | 'cancelled';

const confirmationVariants = cva('w-full rounded-lg border p-3 text-sm transition-colors', {
  variants: {
    state: {
      pending: 'border-border bg-card text-card-foreground',
      confirmed: 'border-success/40 bg-success/5 text-card-foreground',
      cancelled: 'border-destructive/40 bg-destructive/5 text-card-foreground',
    },
  },
  defaultVariants: { state: 'pending' },
});

const confirmationIconVariants = cva('mt-0.5 shrink-0 text-base leading-none', {
  variants: {
    state: {
      pending: 'text-warning',
      confirmed: 'text-success',
      cancelled: 'text-destructive',
    },
  },
  defaultVariants: { state: 'pending' },
});

const confirmationResolvedVariants = cva(
  'inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      state: {
        pending: 'border-border text-muted-foreground',
        confirmed: 'border-success/40 bg-success/10 text-success',
        cancelled: 'border-destructive/40 bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: { state: 'pending' },
  }
);

export type ConfirmationProps = VariantProps<typeof confirmationVariants>;

/** Remixicon class shown beside the prompt for each state. */
const CONFIRMATION_ICONS: Record<ConfirmationState, string> = {
  pending: 'ri-shield-check-line',
  confirmed: 'ri-checkbox-circle-fill',
  cancelled: 'ri-close-circle-fill',
};

/**
 * An inline approve / deny prompt for an agent action that needs a human to
 * sign off. While `state` is `'pending'` it shows both buttons; once the user
 * answers — or the host sets `state` — the buttons collapse into a compact
 * resolved row.
 *
 * ```html
 * <tolle-confirmation
 *   title="Delete 12 rows from the orders table?"
 *   description="This cannot be undone."
 *   (confirmed)="run()"
 *   (cancelled)="skip()"
 * ></tolle-confirmation>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-confirmation',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass" [attr.data-state]="currentState" role="group" [attr.aria-label]="title">
      <div class="flex items-start gap-3">
        <i [class]="iconClass" aria-hidden="true"></i>

        <div class="min-w-0 flex-1">
          <p class="font-medium text-foreground">{{ title }}</p>
          <p *ngIf="description" class="mt-0.5 text-sm text-muted-foreground">{{ description }}</p>

          <div class="empty:hidden"><ng-content></ng-content></div>

          <div *ngIf="currentState === 'pending'" class="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" [disabled]="disabled" [class]="confirmButtonClass" (click)="confirm()">
              <i class="ri-check-line" aria-hidden="true"></i>
              {{ confirmLabel }}
            </button>
            <button type="button" [disabled]="disabled" [class]="cancelButtonClass" (click)="cancel()">
              <i class="ri-close-line" aria-hidden="true"></i>
              {{ cancelLabel }}
            </button>
          </div>
        </div>

        <span *ngIf="currentState !== 'pending'" [class]="resolvedClass">
          <i [class]="iconName" aria-hidden="true"></i>
          {{ resolvedLabel }}
        </span>
      </div>
    </div>
  `,
})
export class ConfirmationComponent implements OnChanges {
  private readonly cdr = inject(ChangeDetectorRef);

  /** Headline describing the action awaiting approval. @default '' */
  @Input() title = '';
  /** Supporting detail shown under the title. @default '' */
  @Input() description = '';
  /** Label of the approve button. @default 'Approve' */
  @Input() confirmLabel = 'Approve';
  /** Label of the deny button. @default 'Deny' */
  @Input() cancelLabel = 'Deny';
  /** Text shown in the resolved row after approval. @default 'Approved' */
  @Input() confirmedLabel = 'Approved';
  /** Text shown in the resolved row after denial. @default 'Denied' */
  @Input() cancelledLabel = 'Denied';
  /** Whether the prompt is still open, and how it was answered. @default 'pending' */
  @Input() state: ConfirmationState = 'pending';
  /** Blocks both buttons without resolving the prompt. @default false */
  @Input() disabled = false;
  /** Extra Tailwind classes merged onto the prompt via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted when the user approves the action. */
  @Output() confirmed = new EventEmitter<void>();
  /** Emitted when the user denies the action. */
  @Output() cancelled = new EventEmitter<void>();

  /**
   * Set when the user answers, so the prompt resolves on its own without the
   * host having to bind `state` back. Cleared whenever `state` is pushed in.
   */
  private answer: ConfirmationState | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['state']) this.answer = null;
  
    // A bound `class` input is written through Angular's styling path,
    // which does not mark an OnPush view dirty on its own.
    this.cdr.markForCheck();
  }

  /** The state actually rendered: the user's answer if there is one, else `state`. */
  get currentState(): ConfirmationState {
    return this.answer ?? this.state;
  }

  get resolvedLabel(): string {
    return this.currentState === 'confirmed' ? this.confirmedLabel : this.cancelledLabel;
  }

  get iconName(): string {
    return CONFIRMATION_ICONS[this.currentState];
  }

  get computedClass() {
    return cn(confirmationVariants({ state: this.currentState }), this.class);
  }

  get iconClass() {
    return cn(confirmationIconVariants({ state: this.currentState }), this.iconName);
  }

  get resolvedClass() {
    return cn(confirmationResolvedVariants({ state: this.currentState }));
  }

  get confirmButtonClass() {
    return cn(
      'inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors',
      'hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
    );
  }

  get cancelButtonClass() {
    return cn(
      'inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors',
      'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
    );
  }

  confirm(): void {
    if (this.disabled || this.currentState !== 'pending') return;
    this.answer = 'confirmed';
    this.confirmed.emit();
  }

  cancel(): void {
    if (this.disabled || this.currentState !== 'pending') return;
    this.answer = 'cancelled';
    this.cancelled.emit();
  }
}
