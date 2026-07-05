import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-check-box-api',
    imports: [PropTableComponent],
    templateUrl: './check-box-api.component.html'
})
export class CheckBoxApiComponent {
    checkboxProps: PropEntry[] = [
        {
            name: 'checked',
            type: 'boolean',
            default: 'false',
            description: 'The controlled checked state of the checkbox.'
        },
        {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            description: 'When true, prevents the user from interacting with the checkbox.'
        },
        {
            name: 'size',
            type: "'xs' | 'sm' | 'default' | 'lg'",
            default: "'default'",
            description: 'The size of the checkbox.'
        },
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes for the checkbox.'
        }
    ];
}
