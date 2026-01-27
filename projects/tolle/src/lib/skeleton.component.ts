import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-skeleton',
    imports: [CommonModule],
    template: `
    <div [class]="computedClass"></div>
  `
})
export class SkeletonComponent {
  @Input() variant: 'rect' | 'circle' | 'pill' = 'rect';
  @Input() class = '';

  protected readonly cn = cn;

  get computedClass() {
    return cn(
      // The background matches the Google Dark Mode "Muted" color
      'animate-pulse bg-muted dark:bg-secondary rounded-md',

      this.variant === 'circle' && 'rounded-full',
      this.variant === 'pill' && 'rounded-full',

      this.class
    );
  }
}
