import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-button-api',
    imports: [PropTableComponent],
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>

      <div class="space-y-10">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-foreground">Button</h3>
          <app-prop-table [props]="buttonProps" />
        </div>
      </div>
    </section>
  `
})
export class ButtonApiComponent {
    buttonProps: PropEntry[] = [
        {
            name: 'variant',
            type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
            default: "'default'",
            description: 'The visual style of the button.'
        },
        {
            name: 'size',
            type: "'default' | 'xs' | 'sm' | 'lg' | 'icon-xs' | 'icon-sm' | 'icon' | 'icon-lg'",
            default: "'default'",
            description: 'The size of the button.'
        },
        {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            description: 'Whether the button is disabled.'
        },
        {
            name: 'busy',
            type: 'boolean',
            default: 'false',
            description: 'Whether the button is in a loading state. Disables interaction and shows a spinner.'
        },
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the button.'
        }
    ];
}
