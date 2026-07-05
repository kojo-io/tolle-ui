import {
  Component,
  input,
} from '@angular/core';

import { cn } from './utils/cn';

@Component({
  selector: 'tolle-popover-content',
  standalone: true,
  imports: [],
  template: `
    <div
      [class]="cn(
        'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
        'animate-in fade-in zoom-in-95 duration-200',
        class()
      )"
      role="dialog"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class PopoverContentComponent {
  class = input<string>('');
  protected cn = cn;
}
