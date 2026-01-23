import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-badge-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './badge-api.component.html'
})
export class BadgeApiComponent {
    badgeProps: PropEntry[] = [
        { name: 'variant', type: "'default' | 'secondary' | 'outline' | 'destructive'", default: "'default'", description: 'The visual variant of the badge.' },
        { name: 'size', type: "'xs' | 'sm' | 'default'", default: "'default'", description: 'The size of the badge.' },
        { name: 'removable', type: 'boolean', default: 'false', description: 'Whether the badge shows a remove button.' },
        { name: 'class', type: 'string', description: 'Additional CSS classes for the badge container.' }
    ];

    badgeEvents: PropEntry[] = [
        { name: 'onRemove', type: 'EventEmitter<MouseEvent>', description: 'Fired when the remove button is clicked.' }
    ];
}
