import { Component, Input } from '@angular/core';

import { cn } from './utils/cn';

@Component({
  selector: 'tolle-popover-content',
  styles: [':host { display: block; }'],
  imports: [],
  template: `
    <div
      [class]="
        cn(
          'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
          'duration-200 animate-in fade-in zoom-in-95',
          class
        )
      "
      role="dialog">
      <ng-content></ng-content>
    </div>
  `,
})
export class PopoverContentComponent {
  @Input() class = '';
  protected cn = cn;
}
