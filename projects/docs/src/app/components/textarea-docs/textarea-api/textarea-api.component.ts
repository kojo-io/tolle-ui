import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

const textareaProps: PropEntry[] = [
    {
        name: 'id',
        type: 'string',
        default: 'random',
        description: 'Unique identifier for the textarea.'
    },
    {
        name: 'label',
        type: 'string',
        default: "''",
        description: 'Text label displayed above the textarea.'
    },
    {
        name: 'placeholder',
        type: 'string',
        default: "''",
        description: 'Placeholder text displayed when empty.'
    },
    {
        name: 'value',
        type: 'string',
        default: "''",
        description: 'Current value of the textarea.'
    },
    {
        name: 'hint',
        type: 'string',
        default: "''",
        description: 'Helper text displayed below the textarea.'
    },
    {
        name: 'errorMessage',
        type: 'string',
        default: "''",
        description: 'Error message displayed when in error state.'
    },
    {
        name: 'rows',
        type: 'number',
        default: '3',
        description: 'Number of visible text lines.'
    },
    {
        name: 'maxLength',
        type: 'number | undefined',
        default: 'undefined',
        description: 'Maximum number of characters allowed.'
    },
    {
        name: 'showCharacterCount',
        type: 'boolean',
        default: 'false',
        description: 'Whether to show the character count.'
    },
    {
        name: 'autoGrow',
        type: 'boolean',
        default: 'false',
        description: 'Whether the textarea should auto-resize based on content.'
    },
    {
        name: 'error',
        type: 'boolean',
        default: 'false',
        description: 'Whether the textarea is in an error state.'
    },
    {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Whether the textarea is disabled.'
    },
    {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        description: 'Whether the textarea is read-only.'
    },
    {
        name: 'hideHintOnFocus',
        type: 'boolean',
        default: 'true',
        description: 'Whether to hide the hint text when focused.'
    },
    {
        name: 'hideCharacterCountOnFocus',
        type: 'boolean',
        default: 'false',
        description: 'Whether to hide the character count when focused.'
    },
    {
        name: 'className',
        type: 'string',
        default: "''",
        description: 'Additional CSS classes to apply.'
    }
];

@Component({
    selector: 'app-textarea-api',
    imports: [CommonModule, PropTableComponent],
    templateUrl: './textarea-api.component.html'
})
export class TextareaApiComponent {
    props = textareaProps;
}
