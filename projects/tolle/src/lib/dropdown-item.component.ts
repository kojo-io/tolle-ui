import {Component, Input} from '@angular/core';

@Component({
  selector: 'tolle-dropdown-item',
  standalone: true,
  imports: [],
  template: `
    <div [class]="cn('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', class)">
      <ng-content></ng-content>
    </div>
  `,
  styles: ``
})
export class DropdownItemComponent {
  @Input() class: string = '';
  protected readonly cn = (c1: string, c2: string) => `${c1} ${c2}`;
}
