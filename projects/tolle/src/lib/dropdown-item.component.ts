import {Component, Input} from '@angular/core';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-dropdown-item',
  standalone: true,
  imports: [],
  template: `
    <div
      role="menuitem"
      tabindex="-1"
      [attr.data-disabled]="disabled ? '' : null"
      [attr.aria-disabled]="disabled || null"
      [class]="cn('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50', class)">
      <ng-content></ng-content>
    </div>
  `,
  styles: `:host { display: block; }`
})
export class DropdownItemComponent {
  @Input() class: string = '';
  @Input() disabled = false;
  protected readonly cn = cn;
}
