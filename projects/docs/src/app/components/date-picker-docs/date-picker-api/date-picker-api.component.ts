import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-date-picker-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './date-picker-api.component.html'
})
export class DatePickerApiComponent {
    datePickerProps: PropEntry[] = [
        {
            name: 'ngModel',
            description: 'The selected date value. Supports two-way binding.',
            type: 'Date | null',
            default: 'null'
        },
        {
            name: 'placeholder',
            description: 'Text shown on the trigger when no date is selected.',
            type: 'string',
            default: "'Pick a date'"
        },
        {
            name: 'disabled',
            description: 'Disables the trigger and prevents the panel opening.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'disablePastDates',
            description: 'Prevents selection of dates before today.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'showClear',
            description: "Shows the panel footer's Clear button.",
            type: 'boolean',
            default: 'true'
        },
        {
            name: 'showQuickActions',
            description: "Shows the panel's Clear / Done footer.",
            type: 'boolean',
            default: 'true'
        },
        {
            name: 'minDate',
            description: 'The minimum allowable date.',
            type: 'Date',
            default: 'undefined'
        },
        {
            name: 'maxDate',
            description: 'The maximum allowable date.',
            type: 'Date',
            default: 'undefined'
        },
        {
            name: 'mode',
            description: 'The selection mode of the picker.',
            type: "'date' | 'month' | 'year'",
            default: "'date'"
        },
        {
            name: 'formatMonthFn',
            description: 'Custom function to format month display in header.',
            type: '(date: Date) => string',
            default: 'undefined'
        },
        {
            name: 'formatYearFn',
            description: 'Custom function to format year display in header.',
            type: '(date: Date) => string',
            default: 'undefined'
        },
        {
            name: 'displayFormat',
            description: 'Overrides how the selected date is rendered on the trigger.',
            type: '(date: Date, mode: CalendarMode) => string',
            default: 'undefined'
        },
        {
            name: 'size',
            description: 'Height and text size of the trigger.',
            type: "'xs' | 'sm' | 'default' | 'lg'",
            default: "'default'"
        },
        {
            name: 'invalid',
            description: 'Applies the destructive border and focus ring.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'ariaLabel',
            description: 'Accessible name when there is no associated visible label.',
            type: 'string',
            default: "''"
        },
        {
            name: 'class',
            description: 'Extra Tailwind classes merged onto the trigger.',
            type: 'string',
            default: "''"
        }
    ];

    datePickerOutputs: PropEntry[] = [
        { name: 'valueChange', type: 'EventEmitter<Date | null>', description: 'Emitted with the chosen date, or null when the value is cleared.' },
        { name: 'opened', type: 'EventEmitter<void>', description: 'Emitted when the calendar panel opens.' },
        { name: 'closed', type: 'EventEmitter<void>', description: 'Emitted when the calendar panel closes.' }
    ];
}
