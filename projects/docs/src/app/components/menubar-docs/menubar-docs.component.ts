import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicMenubarComponent } from '../../docs-examples/menubar/basic-menubar/basic-menubar.component';
import { MenubarSizesComponent } from '../../docs-examples/menubar/menubar-sizes/menubar-sizes.component';
import { MenubarWithIconsComponent } from '../../docs-examples/menubar/menubar-with-icons/menubar-with-icons.component';


@Component({
  selector: 'app-menubar-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicMenubarComponent,
    MenubarSizesComponent,
    MenubarWithIconsComponent
  ],
  templateUrl: './menubar-docs.component.html',
  styleUrl: './menubar-docs.component.css'
})
export class MenubarDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  MenubarComponent,
  MenubarMenuComponent,
  MenubarTriggerComponent,
  MenubarContentComponent,
  MenubarItemComponent,
  MenubarLabelComponent,
  MenubarSeparatorComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [
    MenubarComponent,
    MenubarMenuComponent,
    MenubarTriggerComponent,
    MenubarContentComponent,
    MenubarItemComponent,
    MenubarLabelComponent,
    MenubarSeparatorComponent
  ]
})`;

  basicCode = `<tolle-menubar>
  <tolle-menubar-menu>
    <tolle-menubar-trigger>File</tolle-menubar-trigger>
    <tolle-menubar-content>
      <tolle-menubar-label>Document</tolle-menubar-label>
      <tolle-menubar-item (select)="run('New File')">New File</tolle-menubar-item>
      <tolle-menubar-item (select)="run('Open…')">Open…</tolle-menubar-item>
      <tolle-menubar-item (select)="run('Save')">Save</tolle-menubar-item>
      <tolle-menubar-separator />
      <tolle-menubar-item variant="destructive" (select)="run('Delete File')">
        Delete File
      </tolle-menubar-item>
    </tolle-menubar-content>
  </tolle-menubar-menu>

  <tolle-menubar-menu>
    <tolle-menubar-trigger>Edit</tolle-menubar-trigger>
    <tolle-menubar-content>
      <tolle-menubar-item (select)="run('Undo')">Undo</tolle-menubar-item>
      <tolle-menubar-item (select)="run('Redo')">Redo</tolle-menubar-item>
      <tolle-menubar-separator />
      <tolle-menubar-item (select)="run('Cut')">Cut</tolle-menubar-item>
      <tolle-menubar-item (select)="run('Copy')">Copy</tolle-menubar-item>
      <tolle-menubar-item (select)="run('Paste')">Paste</tolle-menubar-item>
    </tolle-menubar-content>
  </tolle-menubar-menu>

  <tolle-menubar-menu>
    <tolle-menubar-trigger>View</tolle-menubar-trigger>
    <tolle-menubar-content>
      <tolle-menubar-item (select)="run('Zoom In')">Zoom In</tolle-menubar-item>
      <tolle-menubar-item (select)="run('Zoom Out')">Zoom Out</tolle-menubar-item>
      <tolle-menubar-item (select)="run('Toggle Sidebar')">Toggle Sidebar</tolle-menubar-item>
    </tolle-menubar-content>
  </tolle-menubar-menu>
</tolle-menubar>

<p class="text-sm text-muted-foreground">Last action: {{ lastAction }}</p>`;

  sizesCode = `<tolle-menubar size="sm"> ... </tolle-menubar>
<tolle-menubar size="default"> ... </tolle-menubar>
<tolle-menubar size="lg"> ... </tolle-menubar>`;

  iconsCode = `<tolle-menubar>
  <tolle-menubar-menu>
    <tolle-menubar-trigger>File</tolle-menubar-trigger>
    <tolle-menubar-content class="min-w-[16rem]">
      <tolle-menubar-label>Document</tolle-menubar-label>
      <tolle-menubar-item>
        <i prefix class="ri-file-add-line"></i>
        New File
        <span shortcut class="ml-auto text-xs text-muted-foreground">⌘N</span>
      </tolle-menubar-item>
      <tolle-menubar-item>
        <i prefix class="ri-folder-open-line"></i>
        Open…
        <span shortcut class="ml-auto text-xs text-muted-foreground">⌘O</span>
      </tolle-menubar-item>
      <tolle-menubar-item>
        <i prefix class="ri-save-line"></i>
        Save
        <span shortcut class="ml-auto text-xs text-muted-foreground">⌘S</span>
      </tolle-menubar-item>
      <tolle-menubar-separator />
      <tolle-menubar-item [inset]="true">Save As…</tolle-menubar-item>
      <tolle-menubar-item [disabled]="true">
        <i prefix class="ri-printer-line"></i>
        Print
        <span shortcut class="ml-auto text-xs text-muted-foreground">⌘P</span>
      </tolle-menubar-item>
    </tolle-menubar-content>
  </tolle-menubar-menu>

  <tolle-menubar-menu>
    <tolle-menubar-trigger>Edit</tolle-menubar-trigger>
    <tolle-menubar-content class="min-w-[16rem]">
      <tolle-menubar-item>
        <i prefix class="ri-arrow-go-back-line"></i>
        Undo
        <span shortcut class="ml-auto text-xs text-muted-foreground">⌘Z</span>
      </tolle-menubar-item>
      <tolle-menubar-item>
        <i prefix class="ri-arrow-go-forward-line"></i>
        Redo
        <span shortcut class="ml-auto text-xs text-muted-foreground">⇧⌘Z</span>
      </tolle-menubar-item>
    </tolle-menubar-content>
  </tolle-menubar-menu>
</tolle-menubar>`;

  menubarProps: PropEntry[] = [
    { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Height and padding scale of the bar, inherited by every trigger in it.' },
    { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes for the bar.' },
    { name: 'openChange', type: 'EventEmitter<string | null>', description: 'Output emitting the id of the menu that opened, or null when the bar closes.' }
  ];

  subComponents: PropEntry[] = [
    { name: 'tolle-menubar-menu', type: 'component', description: 'One menu in the bar — wraps a trigger and its content panel. Input id: string (generated when omitted).' },
    { name: 'tolle-menubar-trigger', type: 'component', description: "Button that opens its menu. Inputs disabled: boolean (default false), size: 'sm' | 'default' | 'lg' (overrides the bar's size), class: string." },
    { name: 'tolle-menubar-content', type: 'component', description: "The dropdown panel, rendered only while its menu is open. Inputs placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' (default 'bottom-start'), sideOffset: number (default 4), class: string." },
    { name: 'tolle-menubar-item', type: 'component', description: "A selectable row. Inputs variant: 'default' | 'destructive' (default 'default'), inset: boolean (default false), disabled: boolean (default false), class: string. Output select: EventEmitter<Event>. Projects [prefix] and [shortcut] slots." },
    { name: 'tolle-menubar-label', type: 'component', description: 'A non-interactive heading inside a menu. Inputs inset: boolean (default false), class: string.' },
    { name: 'tolle-menubar-separator', type: 'component', description: 'A horizontal rule between groups of items. Input class: string.' }
  ];
}
