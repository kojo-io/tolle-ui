import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ContextMenuItem } from '../../../../../../tolle/src/lib/context-menu.service';
import { ContextMenuTriggerDirective } from '../../../../../../tolle/src/lib/context-menu-trigger.directive';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';

@Component({
    selector: 'app-context-menu-interactive',
    imports: [FormsModule, ContextMenuTriggerDirective, PlaygroundComponent, CheckboxComponent],
    templateUrl: './context-menu-interactive.component.html'
})
export class ContextMenuInteractiveComponent {
    showIcons = true;
    includeSubmenu = true;
    disableDelete = false;

    get menuItems(): ContextMenuItem[] {
        const items: ContextMenuItem[] = [
            { id: 'edit', label: 'Edit', icon: this.showIcons ? 'ri-edit-line' : undefined },
            { id: 'copy', label: 'Copy', icon: this.showIcons ? 'ri-file-copy-line' : undefined },
        ];

        if (this.includeSubmenu) {
            items.push({
                id: 'share',
                label: 'Share',
                icon: this.showIcons ? 'ri-share-line' : undefined,
                submenu: [
                    { id: 'email', label: 'Email', icon: this.showIcons ? 'ri-mail-line' : undefined },
                    { id: 'message', label: 'Message', icon: this.showIcons ? 'ri-chat-3-line' : undefined }
                ]
            });
        }

        items.push({ separator: true });
        items.push({
            id: 'delete',
            label: 'Delete',
            icon: this.showIcons ? 'ri-delete-bin-line' : undefined,
            destructive: true,
            disabled: this.disableDelete
        });

        return items;
    }

    get playgroundCode(): string {
        return `
const menuItems: ContextMenuItem[] = [
  { id: 'edit', label: 'Edit', icon: ${this.showIcons ? "'ri-edit-line'" : 'undefined'} },
  { id: 'copy', label: 'Copy', icon: ${this.showIcons ? "'ri-file-copy-line'" : 'undefined'} },
  ${this.includeSubmenu ? `{ 
    id: 'share', 
    label: 'Share', 
    submenu: [
      { id: 'email', label: 'Email' },
      { id: 'message', label: 'Message' }
    ] 
  },` : ''}
  { separator: true },
  { id: 'delete', label: 'Delete', destructive: true, disabled: ${this.disableDelete} }
];

// In template
<div [tolleContextMenuTrigger]="menuItems">
  Right click here
</div>`;
    }
}
