import { Component } from '@angular/core';

@Component({
  selector: 'tolle-dropdown-separator',
  standalone: true,
  imports: [],
  template: `<div role="separator" aria-hidden="true" class="-mx-1 my-1 h-px bg-border"></div>`,
  styles: `:host { display: block; }`
})
export class DropdownSeparatorComponent {

}
