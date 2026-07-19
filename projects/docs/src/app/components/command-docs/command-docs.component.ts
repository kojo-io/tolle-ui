import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicCommandComponent } from '../../docs-examples/command/basic-command/basic-command.component';
import { CommandKeywordsComponent } from '../../docs-examples/command/command-keywords/command-keywords.component';
import { CommandManualFilterComponent } from '../../docs-examples/command/command-manual-filter/command-manual-filter.component';


@Component({
  selector: 'app-command-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicCommandComponent,
    CommandKeywordsComponent,
    CommandManualFilterComponent
  ],
  templateUrl: './command-docs.component.html',
  styleUrl: './command-docs.component.css'
})
export class CommandDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
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
  imports: [
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandEmptyComponent,
    CommandGroupComponent,
    CommandItemComponent,
    CommandSeparatorComponent,
    CommandShortcutComponent
  ]
})`;

  basicCode = `<tolle-command ariaLabel="Quick actions" class="w-full max-w-md rounded-lg border border-border"
  (selected)="onSelected($event)">
  <tolle-command-input placeholder="Type a command or search…" />
  <tolle-command-list>
    <tolle-command-empty>No results found.</tolle-command-empty>

    <tolle-command-group heading="Suggestions">
      <tolle-command-item value="new-project" label="New project">
        <i class="ri-add-line" aria-hidden="true"></i>
        New project
        <tolle-command-shortcut>⌘P</tolle-command-shortcut>
      </tolle-command-item>
      <tolle-command-item value="search-docs" label="Search docs">
        <i class="ri-book-2-line" aria-hidden="true"></i>
        Search docs
        <tolle-command-shortcut>⌘K</tolle-command-shortcut>
      </tolle-command-item>
    </tolle-command-group>

    <tolle-command-separator />

    <tolle-command-group heading="Settings">
      <tolle-command-item value="profile" label="Profile">
        <i class="ri-user-3-line" aria-hidden="true"></i>
        Profile
        <tolle-command-shortcut>⌘⇧P</tolle-command-shortcut>
      </tolle-command-item>
      <tolle-command-item value="appearance" label="Appearance">
        <i class="ri-palette-line" aria-hidden="true"></i>
        Appearance
        <tolle-command-shortcut>⌘T</tolle-command-shortcut>
      </tolle-command-item>
    </tolle-command-group>
  </tolle-command-list>
</tolle-command>

<p class="text-sm text-muted-foreground">Selected: {{ chosen ?? 'nothing yet' }}</p>`;

  keywordsCode = `// billingKeywords = ['invoice', 'payment', 'receipt'];
// membersKeywords = ['team', 'people', 'seats'];

<tolle-command ariaLabel="Workspace settings" class="w-full max-w-md rounded-lg border border-border">
  <tolle-command-input placeholder="Try typing “invoice”…" />
  <tolle-command-list>
    <tolle-command-empty>No results found.</tolle-command-empty>

    <tolle-command-group heading="Workspace">
      <tolle-command-item value="billing" label="Billing" [keywords]="billingKeywords">
        <i class="ri-bank-card-line" aria-hidden="true"></i>
        Billing
      </tolle-command-item>
      <tolle-command-item value="members" label="Members" [keywords]="membersKeywords">
        <i class="ri-team-line" aria-hidden="true"></i>
        Members
      </tolle-command-item>
      <tolle-command-item value="audit-log" label="Audit log" [disabled]="true">
        <i class="ri-file-list-3-line" aria-hidden="true"></i>
        Audit log
        <span class="ml-auto text-xs text-muted-foreground">Enterprise</span>
      </tolle-command-item>
    </tolle-command-group>
  </tolle-command-list>
</tolle-command>`;

  manualCode = `<tolle-command ariaLabel="Repository search" [shouldFilter]="false"
  class="w-full max-w-md rounded-lg border border-border" (queryChange)="onQueryChange($event)">
  <tolle-command-input placeholder="Search repositories…" />
  <tolle-command-list>
    <div *ngIf="results.length === 0" class="py-6 text-center text-sm text-muted-foreground">
      No repositories found.
    </div>

    <tolle-command-group heading="Repositories">
      <tolle-command-item *ngFor="let repo of results" [value]="repo.owner + '/' + repo.name"
        [label]="repo.name">
        <i class="ri-git-repository-line" aria-hidden="true"></i>
        <span>{{ repo.owner }}/{{ repo.name }}</span>
      </tolle-command-item>
    </tolle-command-group>
  </tolle-command-list>
</tolle-command>`;

  commandProps: PropEntry[] = [
    { name: 'shouldFilter', type: 'boolean', default: 'true', description: 'Set false to keep every item visible and filter the list yourself — for server-side or fuzzy search.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name for the command menu.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the menu.' },
    { name: 'selected', type: 'EventEmitter<any>', description: "Emits the chosen item's value when the user selects one." },
    { name: 'queryChange', type: 'EventEmitter<string>', description: 'Emits the query text whenever the search input changes.' }
  ];

  subComponents: PropEntry[] = [
    { name: 'tolle-command-input', type: 'component — placeholder, ariaLabel, class, inputClass', description: "Search box that drives the filtering. placeholder defaults to 'Type a command or search…'; inputClass targets the <input> itself." },
    { name: 'tolle-command-list', type: 'component — ariaLabel', description: 'Scrolling listbox container for the items.' },
    { name: 'tolle-command-empty', type: 'component', description: 'Renders its content only when the query matches nothing, so it can live in the template permanently.' },
    { name: 'tolle-command-group', type: 'component — heading', description: 'A labelled section of items. The heading hides itself when filtering removes every item in the group.' },
    { name: 'tolle-command-item', type: 'component — value, label, keywords, disabled, selected', description: 'A selectable row. value is emitted on selection; label is the text matched against the query; keywords add synonyms that match without being displayed; disabled makes the row unselectable and skipped by the arrow keys.' },
    { name: 'tolle-command-separator', type: 'component', description: 'Divider between command groups.' },
    { name: 'tolle-command-shortcut', type: 'component', description: 'Right-aligned shortcut hint inside an item. Pairs with tolle-kbd.' }
  ];
}
