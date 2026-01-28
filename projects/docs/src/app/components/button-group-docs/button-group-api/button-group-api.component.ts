import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-button-group-api',
    imports: [PropTableComponent],
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>

      <div class="space-y-10">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-foreground">Button Group</h3>
          <app-prop-table [props]="buttonGroupProps" />
        </div>
      </div>
    </section>
  `
})
export class ButtonGroupApiComponent {
    buttonGroupProps: PropEntry[] = [
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the button group container.'
        }
    ];
}
