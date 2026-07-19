import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const badgeVariants = cva(
  'inline-flex w-fit items-center justify-center rounded-md border px-2 py-0.5 font-medium transition-colors gap-1 whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground border-border bg-transparent',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
      },
      size: {
        xs: 'px-1.5 py-0 text-[10px]',
        sm: 'px-2 py-0 text-[11px]',
        default: 'text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type BadgeProps = VariantProps<typeof badgeVariants>;

@Component({
  selector: 'tolle-badge',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClass">
      <ng-content select="[prefix]"></ng-content>

      <span class="truncate">
        <ng-content></ng-content>
      </span>

      <button
        *ngIf="removable"
        type="button"
        [attr.aria-label]="removeLabel"
        (click)="onRemove.emit($event)"
        class="ml-1 -mr-1 rounded-md transition-colors hover:bg-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
    </div>
  `,
})
export class BadgeComponent {
  /** Visual style of the badge. @default 'default' */
  @Input() variant: BadgeProps['variant'] = 'default';
  /** Size of the badge. @default 'default' */
  @Input() size: BadgeProps['size'] = 'default';
  /** Shows a trailing dismiss (×) button that emits `onRemove`. @default false */
  @Input() removable = false;
  /** Accessible label for the dismiss button. @default 'Remove' */
  @Input() removeLabel = 'Remove';
  /** Extra Tailwind classes merged onto the badge via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the click event when the dismiss button is pressed. */
  @Output() onRemove = new EventEmitter<MouseEvent>();

  get computedClass() {
    return cn(
      badgeVariants({ variant: this.variant, size: this.size }),
      this.class
    );
  }
}
