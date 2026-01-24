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
            description: 'Placeholder text for the input.',
            type: 'string',
            default: "'MM/DD/YYYY' (varies by mode)"
        },
        {
            name: 'disabled',
            description: 'Disables the input and prevents popup opening.',
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
            description: 'Shows a clear button when a value is selected.',
            type: 'boolean',
            default: 'true'
        },
        {
            name: 'showQuickActions',
            description: 'Shows quick action buttons (Today, Yesterday, etc.) in the calendar.',
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
            description: 'Custom function to format the displayed value in the input.',
            type: '(date: Date, mode: CalendarMode) => string',
            default: 'undefined'
        }
    ];
}
