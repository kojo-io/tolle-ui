import { Component, input, computed } from '@angular/core';

import { cn } from './utils/cn';

@Component({
  selector: 'tolle-progress',
  standalone: true,
  imports: [],
  template: `
    <div
      [class]="computedClass()"
      role="progressbar"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="100"
      [attr.aria-valuenow]="value()"
    >
      <div
        class="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
        [style.transform]="'translateX(-' + (100 - (value() || 0)) + '%)'"
      ></div>
    </div>
  `
})
export class ProgressComponent {
  value = input<number | null>(0);
  class = input<string>('');

  computedClass = computed(() => {
    return cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      this.class()
    );
  });
}
