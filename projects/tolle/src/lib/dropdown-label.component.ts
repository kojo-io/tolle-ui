import { Component } from '@angular/core';

@Component({
  selector: 'tolle-dropdown-label',
  standalone: true,
  imports: [],
  template: `
    <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      <ng-content></ng-content>
    </div>
  `,
  styles: ``
})
export class DropdownLabelComponent {

}
