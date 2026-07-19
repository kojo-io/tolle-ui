import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const spinnerVariants = cva('inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em]', {
  variants: {
    size: {
      xs: 'h-3 w-3 border-[1.5px]',
      sm: 'h-4 w-4 border-2',
      default: 'h-5 w-5 border-2',
      lg: 'h-8 w-8 border-[3px]',
      xl: 'h-12 w-12 border-4',
    },
    variant: {
      default: 'text-foreground',
      primary: 'text-primary',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: { size: 'default', variant: 'default' },
});

export type SpinnerProps = VariantProps<typeof spinnerVariants>;

/**
 * An indeterminate loading indicator. Renders as `role="status"` with a
 * visually-hidden label so screen readers announce the loading state.
 * @new
 */
@Component({
  selector: 'tolle-spinner',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span role="status" [attr.aria-label]="label" [class]="computedClass">
      <span class="sr-only">{{ label }}</span>
    </span>
  `,
})
export class SpinnerComponent implements OnChanges {
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Diameter of the spinner. @default 'default' */
  @Input() size: SpinnerProps['size'] = 'default';
  /** Colour of the spinner, inherited from the theme tokens. @default 'default' */
  @Input() variant: SpinnerProps['variant'] = 'default';
  /** Accessible label announced while the spinner is visible. @default 'Loading' */
  @Input() label = 'Loading';
  /** Extra Tailwind classes merged onto the spinner via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(spinnerVariants({ size: this.size, variant: this.variant }), this.class);
  }
}
