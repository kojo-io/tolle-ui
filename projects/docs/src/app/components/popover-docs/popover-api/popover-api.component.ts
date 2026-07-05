import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-popover-api',
    imports: [PropTableComponent],
    templateUrl: './popover-api.component.html'
})
export class PopoverApiComponent {
    popoverProps: PropEntry[] = [
        { name: 'placement', description: 'Desired placement of the popover relative to the trigger.', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'" }
    ];

    popoverEvents: PropEntry[] = [
        { name: 'onOpen', description: 'Emitted when the popover is opened.', type: 'EventEmitter<void>', default: '-' },
        { name: 'onClose', description: 'Emitted when the popover is closed.', type: 'EventEmitter<void>', default: '-' }
    ];

    contentProps: PropEntry[] = [
        { name: 'class', description: 'Additional CSS classes for the content container.', type: 'string', default: "''" }
    ];
}
