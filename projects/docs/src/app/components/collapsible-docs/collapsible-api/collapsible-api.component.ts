import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
  selector: 'app-collapsible-api',
  imports: [PropTableComponent],
  template: `
    <section class="mb-16" id="api-reference">
      <h2 class="mb-6 text-2xl font-bold text-foreground">API Reference</h2>

      <div class="space-y-12">
        <div>
          <h3 class="mb-4 text-xl font-semibold text-foreground">Collapsible</h3>
          <app-prop-table [props]="collapsibleProps" />
        </div>

        <div>
          <h3 class="mb-4 text-xl font-semibold text-foreground">CollapsibleTrigger</h3>
          <app-prop-table [props]="triggerProps" />
        </div>

        <div>
          <h3 class="mb-4 text-xl font-semibold text-foreground">CollapsibleContent</h3>
          <app-prop-table [props]="contentProps" />
        </div>
      </div>
    </section>
  `,
})
export class CollapsibleApiComponent {
  collapsibleProps: PropEntry[] = [
    {
      name: 'open',
      type: 'boolean',
      default: 'false',
      description: 'The controlled open state of the collapsible.',
    },
    {
      name: 'openChange',
      type: 'EventEmitter<boolean>',
      default: '-',
      description: 'Event emitted when the open state changes.',
    },
    {
      name: 'class',
      type: 'string',
      default: "''",
      description: 'Additional CSS classes to apply to the container.',
    },
  ];

  triggerProps: PropEntry[] = [
    {
      name: 'class',
      type: 'string',
      default: "''",
      description: 'Additional CSS classes to apply to the trigger.',
    },
  ];

  contentProps: PropEntry[] = [
    {
      name: 'class',
      type: 'string',
      default: "''",
      description: 'Additional CSS classes to apply to the content panel.',
    },
  ];
}
