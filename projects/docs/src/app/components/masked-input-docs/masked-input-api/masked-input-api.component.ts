import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-masked-input-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './masked-input-api.component.html'
})
export class MaskedInputApiComponent {
    props: PropEntry[] = [
        {
            name: 'mask',
            description: 'Pattern string. Use 0 for digits, a for letters, * for alphanumeric.',
            type: 'string',
            default: "''"
        },
        {
            name: 'placeholder',
            description: 'Placeholder text displayed when empty.',
            type: 'string',
            default: "''"
        },
        {
            name: 'label',
            description: 'Label text displayed above the input.',
            type: 'string',
            default: "''"
        },
        {
            name: 'hint',
            description: 'Helper text displayed below the input.',
            type: 'string',
            default: "''"
        },
        {
            name: 'size',
            description: 'The size of the input.',
            type: "'xs' | 'sm' | 'default' | 'lg'",
            default: "'default'"
        },
        {
            name: 'error',
            description: 'Whether the input is in an error state.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'errorMessage',
            description: 'Message to display when error is true.',
            type: 'string',
            default: "''"
        },
        {
            name: 'returnRaw',
            description: 'If true, ngModel receives unmasked value.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'hideHintOnFocus',
            description: 'If true, hides the hint text when input is focused.',
            type: 'boolean',
            default: 'true'
        }
    ];
}
