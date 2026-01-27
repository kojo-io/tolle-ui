import { Component } from '@angular/core';

import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-aspect-ratio-api',
    imports: [PropTableComponent],
    templateUrl: './aspect-ratio-api.component.html'
})
export class AspectRatioApiComponent {
  aspectRatioProps = [
    {
      name: 'ratio',
      type: 'string | number',
      default: "'16 / 9'",
      description: 'The preferred aspect ratio for the container. Can be a string (e.g., "16 / 9") or a decimal number (e.g., 1.777).'
    },
    {
      name: 'class',
      type: 'string',
      default: "''",
      description: 'Additional CSS classes for styling the container.'
    }
  ];
}
