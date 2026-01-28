import { Component, input } from '@angular/core';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-dropdown-item',
  standalone: true,
  imports: [],
  template: `
    <div [class]="cn('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', class())">
      <ng-content></ng-content>
    </div>
  `
})
export class DropdownItemComponent {
  class = input('');
  protected readonly cn = cn;
}
