import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-separator-api',
    imports: [PropTableComponent],
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>

      <div class="space-y-10">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-foreground">Separator</h3>
          <app-prop-table [props]="separatorProps" />
        </div>
      </div>
    </section>
  `
})
export class SeparatorApiComponent {
    separatorProps: PropEntry[] = [
        {
            name: 'orientation',
            type: "'horizontal' | 'vertical'",
            default: "'horizontal'",
            description: 'The orientation of the separator.'
        },
        {
            name: 'decorative',
            type: 'boolean',
            default: 'true',
            description: 'Whether the element is purely decorative and should be hidden from assistive technology.'
        },
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the separator.'
        }
    ];
}
