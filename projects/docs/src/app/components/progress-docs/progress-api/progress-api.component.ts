import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-progress-api',
    imports: [PropTableComponent],
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>

      <div class="space-y-10">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-foreground">Progress</h3>
          <app-prop-table [props]="progressProps" />
        </div>
      </div>
    </section>
  `
})
export class ProgressApiComponent {
    progressProps: PropEntry[] = [
        {
            name: 'value',
            type: 'number',
            default: '0',
            description: 'The progress value.'
        },
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the progress bar container.'
        }
    ];
}
