import { Component } from '@angular/core';

import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-context-menu-api',
    imports: [PropTableComponent],
    templateUrl: './context-menu-api.component.html'
})
export class ContextMenuApiComponent {
    triggerProps = [
        {
            name: 'tolleContextMenuTrigger',
            type: 'ContextMenuItem[]',
            required: true,
            description: 'The array of menu items to display.'
        },
        {
            name: '(action)',
            type: 'EventEmitter<string>',
            description: 'Emitted when a menu item is clicked. The payload is the item ID.'
        }
    ];

    itemProps = [
        { name: 'id', type: 'string', description: 'Unique identifier for the item. Optional if separator is true.' },
        { name: 'label', type: 'string', description: 'The text to display. Optional if separator is true.' },
        { name: 'icon', type: 'string', description: 'Optional icon class (e.g., "ri-home-line").' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the item is interactable.' },
        { name: 'destructive', type: 'boolean', default: 'false', description: 'Styles the item with a destructive color (red).' },
        { name: 'separator', type: 'boolean', default: 'false', description: 'If true, renders a separator line instead of an item.' },
        { name: 'submenu', type: 'ContextMenuItem[]', description: 'Nested array of items to display in a submenu.' }
    ];
}
