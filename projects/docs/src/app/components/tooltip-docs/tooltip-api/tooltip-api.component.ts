import { Component } from '@angular/core';

import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-tooltip-api',
    imports: [PropTableComponent],
    templateUrl: './tooltip-api.component.html'
})
export class TooltipApiComponent {
    tooltipProps = [
        {
            name: 'tolleTooltip',
            type: 'string',
            required: true,
            description: 'The content to be displayed within the tooltip.'
        },
        {
            name: 'placement',
            type: "'top' | 'bottom' | 'left' | 'right'",
            default: "'top'",
            description: 'The preferred placement of the tooltip relative to its trigger.'
        }
    ];
}
