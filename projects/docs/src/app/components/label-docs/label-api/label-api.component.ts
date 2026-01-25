import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-label-api',
    standalone: true,
    imports: [PropTableComponent],
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>

      <div class="space-y-10">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-foreground">Label</h3>
          <app-prop-table [props]="labelProps" />
        </div>
      </div>
    </section>
  `
})
export class LabelApiComponent {
    labelProps: PropEntry[] = [
        {
            name: 'for',
            type: 'string',
            default: 'undefined',
            description: 'The id of the form element the label is associated with.'
        },
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the label.'
        }
    ];
}
