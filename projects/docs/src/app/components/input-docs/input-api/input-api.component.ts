import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-input-api',
    imports: [PropTableComponent],
    templateUrl: './input-api.component.html'
})
export class InputApiComponent {
    inputProps: PropEntry[] = [
        {
            name: 'id',
            description: 'Unique identifier for the input element. Auto-generated if not provided.',
            type: 'string',
            default: 'auto-generated'
        },
        {
            name: 'label',
            description: 'Text label displayed above the input.',
            type: 'string',
            default: "''"
        },
        {
            name: 'placeholder',
            description: 'Placeholder text displayed when input is empty.',
            type: 'string',
            default: "''"
        },
        {
            name: 'type',
            description: 'HTML Input type (text, email, password, etc.).',
            type: 'string',
            default: "'text'"
        },
        {
            name: 'value',
            description: 'Current value of the input. Supports bidirectional binding (ngModel).',
            type: 'any',
            default: "''"
        },
        {
            name: 'hint',
            description: 'Helper text displayed below the input.',
            type: 'string',
            default: "''"
        },
        {
            name: 'errorMessage',
            description: 'Error message displayed when [error] is true.',
            type: 'string',
            default: "''"
        },
        {
            name: 'size',
            description: 'Size of the input component.',
            type: "'xs' | 'sm' | 'default' | 'lg'",
            default: "'default'"
        },
        {
            name: 'disabled',
            description: 'Disables the input.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'readonly',
            description: 'Makes the input read-only.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'error',
            description: 'Sets the input state to error, changing border color and showing errorMessage if present.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'hideHintOnFocus',
            description: 'If true, hides the hint text when the input is focused.',
            type: 'boolean',
            default: 'true'
        },
        {
            name: 'containerClass',
            description: 'CSS class applied to the input container.',
            type: 'string',
            default: "''"
        },
        {
            name: 'class',
            description: 'CSS class applied to the inner input element.',
            type: 'string',
            default: "''"
        }
    ];
}
