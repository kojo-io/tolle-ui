import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
  selector: 'app-breadcrumb-api',
  standalone: true,
  imports: [PropTableComponent],
  templateUrl: './breadcrumb-api.component.html'
})
export class BreadcrumbApiComponent {
  breadcrumbProps: PropEntry[] = [
    { name: 'class', type: 'string', description: 'Additional CSS classes for the nav container.' }
  ];

  linkProps: PropEntry[] = [
    { name: 'active', type: 'boolean', default: 'false', description: 'Whether the link is the current page (disables clicking).' }
  ];
}
