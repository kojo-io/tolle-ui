import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
  selector: 'app-dropdown-menu-api',
  standalone: true,
  imports: [PropTableComponent],
  templateUrl: './dropdown-menu-api.component.html'
})
export class DropdownMenuApiComponent {
  directiveProps: PropEntry[] = [
    { name: 'tolleDropdownTrigger', description: 'The dropdown menu instance to trigger.', type: 'DropdownMenuComponent', default: '-' }
  ];

  componentProps: PropEntry[] = [
    { name: 'templateRef', description: 'Internal reference to the menu template.', type: 'TemplateRef<any>', default: '-' }
  ];
}
