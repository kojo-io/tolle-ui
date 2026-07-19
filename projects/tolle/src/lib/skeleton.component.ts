import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const skeletonVariants = cva(
  // The background matches the Google Dark Mode "Muted" color
  'animate-pulse bg-muted dark:bg-secondary rounded-md',
  {
    variants: {
      variant: {
        rect: '',
        circle: 'rounded-full',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'rect',
    },
  }
);

export type SkeletonProps = VariantProps<typeof skeletonVariants>;

@Component({
  selector: 'tolle-skeleton',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClass"></div>
  `,
})
export class SkeletonComponent {
  /** Shape of the skeleton placeholder. @default 'rect' */
  @Input() variant: SkeletonProps['variant'] = 'rect';
  /** Extra Tailwind classes merged onto the skeleton via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(skeletonVariants({ variant: this.variant }), this.class);
  }
}
