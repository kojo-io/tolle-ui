import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const checkpointPillVariants = cva(
  'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      active: {
        true: 'border-primary/50 bg-primary/10 text-primary',
        false: 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px]',
        default: 'px-2.5 py-1 text-xs',
      },
    },
    defaultVariants: { active: false, size: 'default' },
  }
);

export type CheckpointProps = VariantProps<typeof checkpointPillVariants>;

/**
 * A labelled marker in a conversation that the user can rewind to. Renders as a
 * horizontal rule with a centred, clickable pill.
 *
 * ```html
 * <tolle-checkpoint label="Before refactor" timestamp="14:02" (restore)="rewind()"></tolle-checkpoint>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-checkpoint',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass" [attr.data-active]="active ? '' : null">
      <span class="h-px flex-1 bg-border" aria-hidden="true"></span>

      <button
        type="button"
        [disabled]="disabled"
        [attr.aria-label]="ariaLabel || restoreLabel + ': ' + label"
        [attr.aria-current]="active ? 'step' : null"
        [class]="pillClass"
        (click)="restore.emit()"
      >
        <i [class]="icon + ' shrink-0'" aria-hidden="true"></i>
        <span class="truncate">{{ label }}</span>
        <span *ngIf="timestamp" class="shrink-0 text-muted-foreground">{{ timestamp }}</span>
        <ng-content></ng-content>
      </button>

      <span class="h-px flex-1 bg-border" aria-hidden="true"></span>
    </div>
  `,
})
export class CheckpointComponent {
  /** Name of the checkpoint shown in the pill. @default 'Checkpoint' */
  @Input() label = 'Checkpoint';
  /** Pre-formatted time shown after the label. @default '' */
  @Input() timestamp = '';
  /** Highlights this checkpoint as the one currently restored to. @default false */
  @Input() active = false;
  /** Prevents the pill from being activated. @default false */
  @Input() disabled = false;
  /** Verb used to build the pill's accessible name. @default 'Restore checkpoint' */
  @Input() restoreLabel = 'Restore checkpoint';
  /** Overrides the pill's accessible name entirely. @default '' */
  @Input() ariaLabel = '';
  /** Remixicon class shown before the label. @default 'ri-history-line' */
  @Input() icon = 'ri-history-line';
  /** Size of the pill. @default 'default' */
  @Input() size: CheckpointProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the row via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted when the user asks to restore this checkpoint. */
  @Output() restore = new EventEmitter<void>();

  get computedClass() {
    return cn('flex w-full items-center gap-3', this.class);
  }

  get pillClass() {
    return cn(checkpointPillVariants({ active: this.active, size: this.size }));
  }
}
