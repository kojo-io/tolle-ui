import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-date-range-picker-api',
    imports: [PropTableComponent],
    templateUrl: './date-range-picker-api.component.html'
})
export class DateRangePickerApiComponent {
    componentProps: PropEntry[] = [
        { name: 'placeholder', description: 'The text to display when no date is selected.', type: 'string', default: "'Pick a date range'" },
        { name: 'disabled', description: 'Whether the input is disabled.', type: 'boolean', default: 'false' },
        { name: 'disablePastDates', description: 'Whether to visually disable and prevent selection of past dates.', type: 'boolean', default: 'false' },
        { name: 'size', description: 'The size of the input.', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'" },
        { name: 'class', description: 'Additional CSS classes for the input.', type: 'string', default: "''" }
    ];
}
