import { Component } from '@angular/core';

import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-toaster-api',
    imports: [PropTableComponent],
    templateUrl: './toaster-api.component.html'
})
export class ToasterApiComponent {
  serviceProps = [
    { name: 'title', type: 'string', description: 'The title displayed at the top of the toast.' },
    { name: 'description', type: 'string', required: true, description: 'The main message content.' },
    { name: 'variant', type: "'default' | 'success' | 'destructive'", default: "'default'", description: 'Determines the color scheme and icon theme.' },
    { name: 'duration', type: 'number', default: '3000', description: 'Display time in milliseconds before auto-dismissal.' }
  ];

  componentProps = [
    {
      name: 'position',
      type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'",
      default: "'bottom-right'",
      description: 'The fixed quadrant where notifications will accumulate.'
    }
  ];
}
