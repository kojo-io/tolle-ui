import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-card-api',
    standalone: true,
    imports: [PropTableComponent],
    template: `
    <section class="mb-16" id="api">
      <h2 class="text-2xl font-bold mb-6">API Reference</h2>
      
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold mb-4">Card Inputs (tolle-card)</h3>
          <app-prop-table [props]="cardProps"></app-prop-table>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-4">Other Sub-components (header, footer, etc.)</h3>
          <app-prop-table [props]="subComponentProps"></app-prop-table>
        </div>
      </div>
    </section>
  `
})
export class CardApiComponent {
    cardProps = [
        { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes for the card container.' }
    ];

    subComponentProps = [
        { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes for the sub-component container.' }
    ];
}
