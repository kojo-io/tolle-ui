import { Component } from '@angular/core';

import { ContextMenuItem } from '../../../../../../tolle/src/lib/context-menu.service';
import { ContextMenuTriggerDirective } from '../../../../../../tolle/src/lib/context-menu-trigger.directive';

@Component({
    selector: 'app-basic-context-menu-example',
    imports: [ContextMenuTriggerDirective],
    template: `
    <div 
      [tolleContextMenuTrigger]="menuItems" 
      (action)="onAction($event)"
      class="flex h-[200px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm transition-colors hover:bg-muted/50 cursor-context-menu"
    >
      <i class="ri-mouse-line text-4xl mb-3 text-muted-foreground"></i>
      <span class="font-medium text-foreground">Right click here</span>
      <span class="text-xs text-muted-foreground mt-1">To see the context menu</span>
    </div>
    
    <div class="mt-6 flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
      <span class="text-sm font-semibold text-foreground">Last Action:</span>
      <code class="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground font-mono">
        {{ lastAction }}
      </code>
    </div>
  `
})
export class BasicContextMenuExampleComponent {
  lastAction = 'None';

  menuItems: ContextMenuItem[] = [
    { id: 'back', label: 'Back', icon: 'ri-arrow-left-line', shortcut: '⌘[' },
    { id: 'forward', label: 'Forward', icon: 'ri-arrow-right-line', disabled: true, shortcut: '⌘]' },
    { id: 'reload', label: 'Reload', icon: 'ri-refresh-line', shortcut: '⌘R' },
    { separator: true },
    { id: 'save', label: 'Save As...', icon: 'ri-save-line', shortcut: '⌘S' },
    { id: 'print', label: 'Print...', icon: 'ri-printer-line', shortcut: '⌘P' },
    { separator: true },
    { id: 'statusbar', label: 'Show Status Bar', type: 'checkbox', checked: true },
    { id: 'inspect', label: 'Inspect', icon: 'ri-command-line' }
  ];

  onAction(id: string) {
    this.lastAction = id;
  }
}
