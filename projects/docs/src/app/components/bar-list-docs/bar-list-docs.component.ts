import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicBarListComponent } from '../../docs-examples/bar-list/basic-bar-list/basic-bar-list.component';
import { BarListInACardComponent } from '../../docs-examples/bar-list/bar-list-in-a-card/bar-list-in-a-card.component';

@Component({
  selector: 'app-bar-list-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicBarListComponent,
    BarListInACardComponent
  ],
  templateUrl: './bar-list-docs.component.html',
  styleUrl: './bar-list-docs.component.css'
})
export class BarListDocsComponent {
  baseService = inject(BaseService);

  installation = `import { BarListComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [BarListComponent]
})`;

  anatomyCode = `<tolle-bar-list [data]="traffic" labelKey="source" valueKey="sessions" />`;

  basicCode = `<tolle-bar-list [data]="traffic" labelKey="source" valueKey="sessions" />`;

  dataCode = `traffic = [
  { source: 'Organic search', sessions: 4820 },
  { source: 'Direct',         sessions: 2140 },
  { source: 'Referral',       sessions: 1275 },
  { source: 'Social',         sessions: 640 }
];`;

  inACardCode = `<div class="rounded-lg border border-border p-4">
  <div class="mb-3 flex justify-between text-xs font-medium text-muted-foreground">
    <span>Page</span>
    <span>Views</span>
  </div>
  <tolle-bar-list [data]="pages" labelKey="path" valueKey="views" />
</div>`;

  barListProps: PropEntry[] = [
    { name: 'data', type: 'Record<string, any>[]', default: '[]', description: 'Rows to rank, in the order they should be drawn — sort your data before passing it in.' },
    { name: 'labelKey', type: 'string', default: "'label'", description: "Row key holding each row's label." },
    { name: 'valueKey', type: 'string', default: "'value'", description: "Row key holding each row's numeric value. A missing or non-numeric value is treated as zero." },
    { name: 'class', type: 'string', description: 'Additional CSS classes, merged with cn() (last-wins).' }
  ];

  barListTypes: PropEntry[] = [
    { name: 'BarListRow', type: '{ label: string; value: number; percent: number; formattedValue: string }', description: 'One resolved row: its label, its value, and its share (0-100) of the list’s largest value.' }
  ];
}
