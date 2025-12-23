import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn'; // Importing the helper we made in Phase 2

// 1. Define Component Variants (The "Recipe")
const buttonVariants = cva(
  // Base styles applied to ALL buttons
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
        "icon-xs": "h-8 w-8",
        "icon-sm": "h-9 w-9",
        icon: "h-10 w-10",
        "icon-lg": "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Helper type for Intellisense
export type ButtonProps = VariantProps<typeof buttonVariants>;

@Component({
  selector: 'tolle-button', // Usage: <tolle-button variant="destructive">
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [class]="computedClass">
     <span class="flex items-center justify-center gap-2 w-full h-full">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    /* Ensure Remix Icons align vertically with text */
    :host ::ng-deep i {
      display: inline-flex;
      align-items: center;
      line-height: 1;
      font-size: 1.25em; /* Scales relative to the button text size */
    }

    /* Specific spacing if icon is next to text */
    :host ::ng-deep i:not(:only-child) {
      margin-right: 0.5rem;
    }
  `]
})
export class ButtonComponent {
  // Allow consumers to pass a custom class to override styles
  @Input() class: string = '';

  // Expose the variants as Inputs
  @Input() variant: ButtonProps['variant'] = 'default';
  @Input() size: ButtonProps['size'] = 'default';

  // Calculate the final string of classes
  get computedClass() {
    return cn(buttonVariants({ variant: this.variant, size: this.size }), this.class);
  }
}
