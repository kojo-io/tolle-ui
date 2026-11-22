import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-sidebar-api',
    imports: [PropTableComponent],
    templateUrl: './sidebar-api.component.html'
})
export class SidebarApiComponent {
    componentProps: PropEntry[] = [
        { name: 'items', description: 'Array of sidebar groups and items.', type: 'SidebarGroup[]', default: '[]' },
        { name: 'collapsed', description: 'Whether the sidebar is in collapsed (mini) mode.', type: 'boolean', default: 'false' },
        { name: 'variant', description: 'Visual style for active and hover states.', type: "'default' | 'secondary' | 'ghost' | 'outline'", default: "'default'" },
        { name: 'class', description: 'Additional CSS classes for the container.', type: 'string', default: "''" }
    ];

    groupProps: PropEntry[] = [
        { name: 'title', description: 'Display label for the group section.', type: 'string', default: '-' },
        { name: 'items', description: 'List of individual items within the group.', type: 'SidebarItem[]', default: '-' },
        { name: 'id', description: 'Optional unique identifier.', type: 'string', default: 'undefined' }
    ];

    itemProps: PropEntry[] = [
        { name: 'title', description: 'Display text for the item.', type: 'string', default: '-' },
        { name: 'url', description: 'Router link path.', type: 'string', default: 'undefined' },
        { name: 'icon', description: 'Icon class string (Remix Icon).', type: 'string', default: "'ri-circle-fill'" },
        { name: 'expanded', description: 'Initial expansion state for submenus.', type: 'boolean', default: 'false' },
        { name: 'items', description: 'Nested children items for submenus.', type: 'SidebarItem[]', default: 'undefined' },
        { name: 'id', description: 'Optional unique identifier.', type: 'string', default: 'undefined' }
    ];
}
