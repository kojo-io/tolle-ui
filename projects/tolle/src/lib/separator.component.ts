import { Component, input, computed } from '@angular/core';

import { cn } from './utils/cn';

@Component({
  selector: 'tolle-separator',
  standalone: true,
  imports: [],
  template: `
    <div
      [class]="computedClass()"
      role="separator"
      [attr.aria-orientation]="orientation()"
    ></div>
  `
})
export class SeparatorComponent {
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  decorative = input<boolean>(true);
  class = input<string>('');

  computedClass = computed(() => {
    return cn(
      "shrink-0 bg-neutral-200 dark:bg-neutral-800",
      this.orientation() === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      this.class()
    );
  });
}
