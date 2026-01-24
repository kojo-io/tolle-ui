import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-radio-group-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './radio-group-api.component.html'
})
export class RadioGroupApiComponent {
    radioGroupProps: PropEntry[] = [
        {
            name: 'name',
            description: 'The name of the radio group. Submitted with its owning form as part of a name/value pair.',
            type: 'string',
            default: 'Generated ID'
        },
        {
            name: 'disabled',
            description: 'When true, prevents the user from interacting with the radio group.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'class',
            description: 'Optional CSS class to add to the container.',
            type: 'string',
            default: "''"
        }
    ];

    radioItemProps: PropEntry[] = [
        {
            name: 'value',
            description: 'The value to be emitted when this item is selected.',
            type: 'any',
            default: '-'
        },
        {
            name: 'disabled',
            description: 'When true, prevents the user from interacting with this specific radio item.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'class',
            description: 'Optional CSS class to add to the item container.',
            type: 'string',
            default: "''"
        }
    ];
}
