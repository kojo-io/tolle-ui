import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tabs-api',
    imports: [PropTableComponent, CommonModule],
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>

      <div class="space-y-12">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-foreground">Tabs</h3>
          <app-prop-table [props]="tabsProps" />
        </div>

        <div>
           <h3 class="text-xl font-semibold mb-4 text-foreground">TabsList</h3>
           <app-prop-table [props]="tabsListProps" />
        </div>

        <div>
           <h3 class="text-xl font-semibold mb-4 text-foreground">TabsTrigger</h3>
           <app-prop-table [props]="tabsTriggerProps" />
        </div>

        <div>
           <h3 class="text-xl font-semibold mb-4 text-foreground">TabsContent</h3>
           <app-prop-table [props]="tabsContentProps" />
        </div>
      </div>
    </section>
  `
})
export class TabsApiComponent {
    tabsProps: PropEntry[] = [
        {
            name: 'defaultValue',
            type: 'string',
            default: 'undefined',
            description: 'The value of the tab that should be active by default.'
        },
        {
            name: 'value',
            type: 'string',
            default: 'undefined',
            description: 'The controlled value of the active tab.'
        },
        {
            name: 'valueChange',
            type: 'EventEmitter<string>',
            default: '-',
            description: 'Event emitted when the active tab changes.'
        },
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the container.'
        }
    ];

    tabsListProps: PropEntry[] = [
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the list.'
        }
    ];

    tabsTriggerProps: PropEntry[] = [
        {
            name: 'value',
            type: 'string',
            default: 'undefined',
            description: 'A unique value for the tab.'
        },
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the trigger.'
        }
    ];

    tabsContentProps: PropEntry[] = [
        {
            name: 'value',
            type: 'string',
            default: 'undefined',
            description: 'A unique value that associates the content with a trigger.'
        },
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the content panel.'
        }
    ];
}
