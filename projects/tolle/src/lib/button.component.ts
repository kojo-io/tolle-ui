import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
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
        icon: "h-10 w-10",
      },
      // 1. Add boolean-like variants
      fullWidth: {
        true: "w-full flex",
        false: "inline-flex",
      },
      readonly: {
        true: "pointer-events-none cursor-default opacity-80", // Visual feedback for readonly
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
      readonly: false,
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
      [disabled]="disabled"
      [attr.aria-readonly]="readonly"
    >
     <span class="flex items-center justify-center gap-2 w-full h-full">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    :host {
      /* Ensure the custom element itself behaves like a block if needed */
      display: inline-block;
    }
    :host.is-block {
      display: block;
      width: 100%;
    }
    :host ::ng-deep i {
      display: inline-flex;
      align-items: center;
      line-height: 1;
      font-size: 1.25em;
    }
  `]
})
export class ButtonComponent {
  @Input() class: string = '';
  @Input() variant: ButtonProps['variant'] = 'default';
  @Input() size: ButtonProps['size'] = 'default';

  // 2. New Boolean Inputs
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  @Input()
  @HostBinding('class.is-block') // Binds class to the <tolle-button> tag itself
  block: boolean = false;

  get computedClass() {
    return cn(
      buttonVariants({
        variant: this.variant,
        size: this.size,
        fullWidth: this.block,
        readonly: this.readonly
      }),
      this.class
    );
  }
}
