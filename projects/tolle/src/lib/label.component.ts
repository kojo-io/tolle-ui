import { Component, input, computed } from '@angular/core';

import { cn } from './utils/cn';

@Component({
  selector: 'tolle-label',
  standalone: true,
  imports: [],
  template: `
    <label
      [attr.for]="for()"
      [class]="computedClass()"
    >
      <ng-content></ng-content>
    </label>
  `
})
export class LabelComponent {
  for = input<string | undefined>();
  class = input<string>('');

  computedClass = computed(() => {
    return cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      this.class()
    );
  });
}
