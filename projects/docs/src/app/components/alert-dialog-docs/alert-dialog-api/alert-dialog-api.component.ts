import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-alert-dialog-api',
    imports: [PropTableComponent, CommonModule],
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>

      <div class="space-y-12">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-foreground">AlertDialog</h3>
          <app-prop-table [props]="alertDialogProps" />
        </div>

        <div>
           <h3 class="text-xl font-semibold mb-4 text-foreground">AlertDialogContent</h3>
           <app-prop-table [props]="contentProps" />
        </div>
      </div>
    </section>
  `
})
export class AlertDialogApiComponent {
    alertDialogProps: PropEntry[] = [
        {
            name: 'open',
            type: 'boolean',
            default: 'false',
            description: 'The controlled open state of the dialog.'
        },
        {
            name: 'openChange',
            type: 'EventEmitter<boolean>',
            default: '-',
            description: 'Event emitted when the open state changes.'
        }
    ];

    contentProps: PropEntry[] = [
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the content panel.'
        }
    ];
}
