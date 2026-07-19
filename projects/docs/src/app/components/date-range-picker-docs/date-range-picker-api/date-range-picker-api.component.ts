import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-date-range-picker-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './date-range-picker-api.component.html'
})
export class DateRangePickerApiComponent {
    componentProps: PropEntry[] = [
        { name: 'ngModel', description: 'The selected range. Supports two-way binding.', type: 'DateRange', default: '{ start: null, end: null }' },
        { name: 'placeholder', description: 'Text shown on the trigger when no range is selected.', type: 'string', default: "'Pick a date range'" },
        { name: 'disabled', description: 'Disables the trigger and prevents the panel opening.', type: 'boolean', default: 'false' },
        { name: 'disablePastDates', description: 'Whether to visually disable and prevent selection of past dates.', type: 'boolean', default: 'false' },
        { name: 'numberOfMonths', description: 'Consecutive months shown in the popover (e.g. 2 for a two-month picker).', type: 'number', default: '1' },
        { name: 'size', description: 'Height and text size of the trigger.', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'" },
        { name: 'invalid', description: 'Applies the destructive border and focus ring.', type: 'boolean', default: 'false' },
        { name: 'ariaLabel', description: 'Accessible name when there is no associated visible label.', type: 'string', default: "''" },
        { name: 'class', description: 'Extra Tailwind classes merged onto the trigger.', type: 'string', default: "''" }
    ];

    componentOutputs: PropEntry[] = [
        { name: 'valueChange', type: 'EventEmitter<DateRange>', description: 'Emitted with the selected range, including the half-made { start, end: null } state.' },
        { name: 'opened', type: 'EventEmitter<void>', description: 'Emitted when the calendar panel opens.' },
        { name: 'closed', type: 'EventEmitter<void>', description: 'Emitted when the calendar panel closes.' }
    ];
}
