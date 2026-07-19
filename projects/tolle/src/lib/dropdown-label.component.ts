import { Component } from '@angular/core';

@Component({
  selector: 'tolle-dropdown-label',
  standalone: true,
  imports: [],
  template: `
    <div class="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
      <ng-content></ng-content>
    </div>
  `,
  styles: `:host { display: block; }`
})
export class DropdownLabelComponent {

}
