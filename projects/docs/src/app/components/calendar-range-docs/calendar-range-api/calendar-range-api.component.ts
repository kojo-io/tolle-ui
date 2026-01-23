import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-calendar-range-api',
    standalone: true,
    imports: [PropTableComponent],
    template: `
    <section class="mb-16" id="api">
      <h2 class="text-2xl font-bold mb-6">API Reference</h2>
      
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold mb-4">Inputs</h3>
          <app-prop-table [props]="rangeProps"></app-prop-table>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-4">Outputs</h3>
          <app-prop-table [props]="rangeOutputs"></app-prop-table>
        </div>
      </div>
    </section>
  `
})
export class CalendarRangeApiComponent {
    rangeProps = [
        { name: 'disablePastDates', type: 'boolean', default: 'false', description: 'Prevents selection of dates before today.' },
        { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes for the container.' }
    ];

    rangeOutputs = [
        { name: 'rangeSelect', type: 'EventEmitter<DateRange>', description: 'Fires when the start or end date of the range changes.' }
    ];
}
