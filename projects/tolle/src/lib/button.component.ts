import {Component, HostBinding, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 px-2 py-1 text-xs",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        // RESTORED: Square icon button variants
        "icon-xs": "h-8 w-8",
        "icon-sm": "h-9 w-9",
        icon: "h-10 w-10",
        "icon-lg": "h-11 w-11",
      },
      block: { true: "w-full flex" },
      busy: { true: "relative !cursor-wait !pointer-events-none" }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      block: false,
    },
  }
);

export type ButtonProps = VariantProps<typeof buttonVariants>;

@Component({
  selector: 'tolle-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="computedClass"
      [disabled]="disabled || busy"
      [attr.aria-busy]="busy"
    >
      <div *ngIf="busy" class="absolute inset-0 flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <span class="flex items-center justify-center w-full h-full" [class.invisible]="busy">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
    :host(.w-full) { display: block; }

    /* Centering and Resetting for icons */
    :host ::ng-deep i {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    /* MATCHING YOUR theme.css LOGIC: Responsive icon sizing */
    :host-context(.size-xs) ::ng-deep i,
    :host-context(.size-icon-xs) ::ng-deep i,
    :host-context(.size-sm) ::ng-deep i,
    :host-context(.size-icon-sm) ::ng-deep i {
      font-size: 1rem; /* 16px */
    }

    :host-context(.size-default) ::ng-deep i,
    :host-context(.size-icon) ::ng-deep i,
    :host-context(.size-lg) ::ng-deep i,
    :host-context(.size-icon-lg) ::ng-deep i {
      font-size: 1.2rem; /* ~19-20px */
    }
  `]
})
export class ButtonComponent {
  /** * Additional CSS classes to apply to the button element.
   * Useful for custom margins or absolute positioning.
   */
  @Input() class: string = '';

  /** * The visual style of the button.
   * @default 'default'
   */
  @Input() variant: ButtonProps['variant'] = 'default';

  /** * The vertical and horizontal padding/scaling of the button.
   * @default 'default'
   */
  @Input() size: ButtonProps['size'] = 'default';

  /** * If true, the button will take up the full width of its container.
   */
  @Input() block: boolean = false;

  /** * Disables all user interactions and applies grayed-out styling.
   */
  @Input() disabled: boolean = false;

  /** * Shows a loading state. Disables interaction and typically triggers a spinner.
   */
  @Input() busy: boolean = false;

  /** * If true, the button is focusable but not clickable.
   */
  @Input() readonly: boolean = false;

  @HostBinding('class.w-full')
  get isBlock() {
    return this.block;
  }

  /**
   * Internal getter that merges variant logic with custom classes.
   * @internal
   */
  get computedClass() {
    return cn(
      buttonVariants({
        variant: this.variant,
        size: this.size,
        block: this.block,
        busy: this.busy
      }),
      'size-' + this.size,
      this.class
    );
  }
}
