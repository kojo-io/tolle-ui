import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-toggle-api',
    standalone: true,
    imports: [PropTableComponent],
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>

      <div class="space-y-10">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-foreground">Toggle</h3>
          <app-prop-table [props]="toggleProps" />
        </div>
      </div>
    </section>
  `
})
export class ToggleApiComponent {
    toggleProps: PropEntry[] = [
        {
            name: 'pressed',
            type: 'boolean',
            default: 'false',
            description: 'The pressed state of the toggle.'
        },
        {
            name: 'variant',
            type: "'default' | 'outline'",
            default: "'default'",
            description: 'The visual style of the toggle.'
        },
        {
            name: 'size',
            type: "'default' | 'sm' | 'lg'",
            default: "'default'",
            description: 'The size of the toggle.'
        },
        {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            description: 'Whether the toggle is disabled.'
        },
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the toggle container.'
        }
    ];
}
