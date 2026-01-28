import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-multi-select-api',
    imports: [PropTableComponent],
    templateUrl: './multi-select-api.component.html'
})
export class MultiSelectApiComponent {
    props: PropEntry[] = [
        {
            name: 'placeholder',
            description: 'Placeholder text to display when no option is selected.',
            type: 'string',
            default: "'Select options...'"
        },
        {
            name: 'size',
            description: 'The size of the input trigger.',
            type: "'xs' | 'sm' | 'default' | 'lg'",
            default: "'default'"
        },
        {
            name: 'searchable',
            description: 'Whether to show a search input within the dropdown.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'disabled',
            description: 'When true, prevents interaction with the component.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'maxSelections',
            description: 'Maximum number of items that can be selected. Disables unselected options when reached.',
            type: 'number | undefined',
            default: 'undefined'
        },
        {
            name: 'maxDisplayItems',
            description: 'Number of selected items to show as badges before truncating.',
            type: 'number',
            default: '3'
        },
        {
            name: 'error',
            description: 'Whether to show error styling (red border).',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'class',
            description: 'Optional CSS class for the wrapper element.',
            type: 'string',
            default: "''"
        }
    ];
}
