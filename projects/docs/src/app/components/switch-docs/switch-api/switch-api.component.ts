import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

const switchProps: PropEntry[] = [
    {
        name: 'size',
        type: "'xs' | 'sm' | 'default' | 'lg'",
        default: "'default'",
        description: 'The size of the switch.'
    },
    {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Whether the switch is disabled.'
    },
    {
        name: 'class',
        type: 'string',
        default: "''",
        description: 'Additional CSS classes to apply to the switch track.'
    }
];

@Component({
    selector: 'app-switch-api',
    imports: [CommonModule, PropTableComponent],
    templateUrl: './switch-api.component.html'
})
export class SwitchApiComponent {
    props = switchProps;
}
