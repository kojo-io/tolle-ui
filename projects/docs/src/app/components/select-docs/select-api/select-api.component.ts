import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-select-api',
    imports: [PropTableComponent],
    templateUrl: './select-api.component.html'
})
export class SelectApiComponent {
    props: PropEntry[] = [
        {
            name: 'placeholder',
            description: 'The placeholder text to display when no option is selected.',
            type: 'string',
            default: "'Select an option'"
        },
        {
            name: 'size',
            description: 'The size of the select trigger.',
            type: "'xs' | 'sm' | 'default' | 'lg'",
            default: "'default'"
        },
        {
            name: 'searchable',
            description: 'Whether to show a search input inside the dropdown.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'disabled',
            description: 'When true, prevents interaction.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'readonly',
            description: 'When true, the select cannot be opened.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'class',
            description: 'Optional CSS class for the wrapper.',
            type: 'string',
            default: "''"
        }
    ];
}
