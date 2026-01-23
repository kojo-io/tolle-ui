import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-calendar-api',
    standalone: true,
    imports: [PropTableComponent],
    template: `
    <section class="mb-16" id="api">
      <h2 class="text-2xl font-bold mb-6">API Reference</h2>
      
      <div class="space-y-8">
        <div>
          <h3 class="text-xl font-semibold mb-4">Inputs</h3>
          <app-prop-table [props]="calendarProps"></app-prop-table>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-4">Outputs</h3>
          <app-prop-table [props]="calendarOutputs"></app-prop-table>
        </div>
      </div>
    </section>
  `
})
export class CalendarApiComponent {
    calendarProps = [
        { name: 'mode', type: "'date' | 'month' | 'year'", default: "'date'", description: 'The selection mode of the calendar.' },
        { name: 'disablePastDates', type: 'boolean', default: 'false', description: 'Prevents selection of dates before today.' },
        { name: 'showQuickActions', type: 'boolean', default: 'true', description: 'Shows/hides "Today" and "Clear" buttons.' },
        { name: 'minDate', type: 'Date', default: 'undefined', description: 'Minimum selectable date.' },
        { name: 'maxDate', type: 'Date', default: 'undefined', description: 'Maximum selectable date.' },
        { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes for the container.' }
    ];

    calendarOutputs = [
        { name: 'dateSelect', type: 'EventEmitter<Date | null>', description: 'Fires when a date is selected or cleared.' }
    ];
}
