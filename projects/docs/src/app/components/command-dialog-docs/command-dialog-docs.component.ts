import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicCommandDialogComponent } from '../../docs-examples/command-dialog/basic-command-dialog/basic-command-dialog.component';
import { CommandDialogShortcutComponent } from '../../docs-examples/command-dialog/command-dialog-shortcut/command-dialog-shortcut.component';


@Component({
  selector: 'app-command-dialog-docs',
  standalone: true,
  imports: [
    RouterLink,
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicCommandDialogComponent,
    CommandDialogShortcutComponent
  ],
  templateUrl: './command-dialog-docs.component.html',
  styleUrl: './command-dialog-docs.component.css'
})
export class CommandDialogDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  CommandDialogComponent,
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandItemComponent,
  CommandSeparatorComponent,
  CommandShortcutComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [CommandDialogComponent, CommandComponent, CommandInputComponent]
})`;

  basicCode = `<tolle-button variant="outline" (click)="paletteOpen = true">
  <i class="ri-search-line mr-2"></i>
  Search…
  <tolle-kbd-group class="ml-4">
    <tolle-kbd size="sm">⌘</tolle-kbd>
    <tolle-kbd size="sm">K</tolle-kbd>
  </tolle-kbd-group>
</tolle-button>

<p>Last command: {{ lastCommand || 'none yet' }}</p>

<tolle-command-dialog [(open)]="paletteOpen">
  <tolle-command (selected)="onSelected($event)">
    <tolle-command-input placeholder="Type a command or search…" />

    <tolle-command-list>
      <tolle-command-empty>No results found.</tolle-command-empty>

      <tolle-command-group heading="Suggestions">
        <tolle-command-item value="calendar" label="Calendar">
          <i class="ri-calendar-line"></i>
          <span>Calendar</span>
        </tolle-command-item>
        <tolle-command-item value="new-document" label="New document">
          <i class="ri-file-add-line"></i>
          <span>New document</span>
          <tolle-command-shortcut>
            <tolle-kbd size="sm">⌘</tolle-kbd>
            <tolle-kbd size="sm">N</tolle-kbd>
          </tolle-command-shortcut>
        </tolle-command-item>
      </tolle-command-group>

      <tolle-command-separator />

      <tolle-command-group heading="Settings">
        <tolle-command-item value="profile" label="Profile">
          <i class="ri-user-3-line"></i>
          <span>Profile</span>
          <tolle-command-shortcut>
            <tolle-kbd size="sm">⌘</tolle-kbd>
            <tolle-kbd size="sm">P</tolle-kbd>
          </tolle-command-shortcut>
        </tolle-command-item>
      </tolle-command-group>
    </tolle-command-list>
  </tolle-command>
</tolle-command-dialog>`;

  basicTs = `export class BasicCommandDialogComponent {
  paletteOpen = false;
  lastCommand = '';

  onSelected(value: string): void {
    this.lastCommand = value;
    this.paletteOpen = false;
  }
}`;

  shortcutCode = `<tolle-button variant="outline" (click)="paletteOpen = true">
  <i class="ri-flashlight-line mr-2"></i>
  Quick actions
  <tolle-kbd-group class="ml-4">
    <tolle-kbd size="sm">⌘</tolle-kbd>
    <tolle-kbd size="sm">J</tolle-kbd>
  </tolle-kbd-group>
</tolle-button>

<p>Status: {{ status }} — Last action: {{ lastAction || 'none yet' }}</p>

<tolle-command-dialog
  [(open)]="paletteOpen"
  shortcut="mod+j"
  [closeOnBackdrop]="false"
  ariaLabel="Quick actions"
  (opened)="status = 'opened'"
  (closed)="status = 'closed'">
  <tolle-command (selected)="onSelected($event)">
    <tolle-command-input placeholder="Search actions…" />

    <tolle-command-list>
      <tolle-command-empty>Nothing matches that.</tolle-command-empty>

      <tolle-command-group heading="Actions">
        <tolle-command-item value="deploy" label="Deploy to production">
          <i class="ri-rocket-line"></i>
          <span>Deploy to production</span>
          <tolle-command-shortcut>
            <tolle-kbd size="sm">⌘</tolle-kbd>
            <tolle-kbd size="sm">D</tolle-kbd>
          </tolle-command-shortcut>
        </tolle-command-item>
        <tolle-command-item value="invite" label="Invite teammate">
          <i class="ri-user-add-line"></i>
          <span>Invite teammate</span>
        </tolle-command-item>
      </tolle-command-group>
    </tolle-command-list>
  </tolle-command>

  <div class="flex items-center justify-between border-t border-border px-3 py-2">
    <span class="text-xs text-muted-foreground">Backdrop clicks are ignored.</span>
    <tolle-button variant="ghost" size="sm" (click)="paletteOpen = false">Close</tolle-button>
  </div>
</tolle-command-dialog>`;

  dialogProps: PropEntry[] = [
    { name: 'open', type: 'boolean', default: 'false', description: 'Whether the palette is visible. Supports two-way binding via [(open)].' },
    { name: 'shortcut', type: 'string', default: "'mod+k'", description: "Global hotkey that toggles the palette, written as mod+key — mod maps to ⌘ on macOS and Ctrl elsewhere. Set to '' to disable the binding." },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close the palette when the backdrop behind the panel is clicked.' },
    { name: 'ariaLabel', type: 'string', default: "'Command palette'", description: 'Accessible name for the dialog.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the panel via cn() (last-wins).' }
  ];

  dialogOutputs: PropEntry[] = [
    { name: 'openChange', type: 'EventEmitter<boolean>', description: 'Two-way binding partner for open. Emitted whenever the dialog opens or closes itself.' },
    { name: 'opened', type: 'EventEmitter<void>', description: 'Emitted when the palette opens.' },
    { name: 'closed', type: 'EventEmitter<void>', description: 'Emitted when the palette closes.' }
  ];
}
