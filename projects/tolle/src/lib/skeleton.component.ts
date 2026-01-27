import { Component, input, computed } from '@angular/core';

import { cn } from './utils/cn';

@Component({
  selector: 'tolle-skeleton',
  standalone: true,
  imports: [],
  template: `
    <div [class]="computedClass()"></div>
  `
})
export class SkeletonComponent {
  variant = input<'rect' | 'circle' | 'pill'>('rect');
  class = input<string>('');

  protected readonly cn = cn;

  computedClass = computed(() => {
    return cn(
      // The background matches the Google Dark Mode "Muted" color
      'animate-pulse bg-muted dark:bg-secondary rounded-md',

      this.variant() === 'circle' && 'rounded-full',
      this.variant() === 'pill' && 'rounded-full',

      this.class()
    );
  });
}
