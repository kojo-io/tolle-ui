import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicSourcesComponent } from '../../docs-examples/sources/basic-sources/basic-sources.component';
import { SourcesVariantsComponent } from '../../docs-examples/sources/sources-variants/sources-variants.component';
import { SourcesControlledComponent } from '../../docs-examples/sources/sources-controlled/sources-controlled.component';


@Component({
  selector: 'app-sources-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicSourcesComponent,
    SourcesVariantsComponent,
    SourcesControlledComponent
  ],
  templateUrl: './sources-docs.component.html',
  styleUrl: './sources-docs.component.css'
})
export class SourcesDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  SourcesComponent,
  SourcesTriggerComponent,
  SourcesContentComponent,
  SourceComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [SourcesComponent, SourcesTriggerComponent, SourcesContentComponent, SourceComponent]
})`;

  anatomy = `<tolle-sources [(open)]="open">
  <tolle-sources-trigger />
  <tolle-sources-content>
    <tolle-source href="https://example.com" title="Example" />
  </tolle-sources-content>
</tolle-sources>`;

  basicCode = `<tolle-sources>
  <tolle-sources-trigger />
  <tolle-sources-content>
    <tolle-source href="https://angular.dev/guide/components" title="Angular — Component overview" />
    <tolle-source href="https://tailwindcss.com/docs/theme" title="Tailwind CSS — Theme configuration" />
    <tolle-source href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value" title="MDN — CSS color values" />
  </tolle-sources-content>
</tolle-sources>`;

  variantsCode = `<tolle-sources variant="card" [open]="true">
  <tolle-sources-trigger />
  <tolle-sources-content>
    <tolle-source *ngFor="let source of sources"
      [href]="source.href" [title]="source.title" [favicon]="source.favicon" />
  </tolle-sources-content>
</tolle-sources>

<tolle-sources variant="muted" [open]="true">
  <tolle-sources-trigger />
  <tolle-sources-content>
    <tolle-source *ngFor="let source of sources" size="sm" [href]="source.href" [title]="source.title" />
  </tolle-sources-content>
</tolle-sources>`;

  controlledCode = `<tolle-button variant="outline" size="sm" (click)="open = !open">
  {{ open ? 'Collapse' : 'Expand' }} from outside
</tolle-button>

<tolle-sources variant="card" [(open)]="open" (openChange)="onOpenChange($event)">
  <tolle-sources-trigger />
  <tolle-sources-content>
    <tolle-source href="https://angular.dev/guide/forms" title="Angular — Forms overview" />
    <tolle-source href="https://angular.dev/api/forms/ControlValueAccessor" title="Angular — ControlValueAccessor" />
  </tolle-sources-content>
</tolle-sources>`;

  controlledTs = `export class SourcesControlledComponent {
  open = false;
  lastEvent = '';

  onOpenChange(open: boolean): void {
    // Only user toggles land here — mounting the list never emits.
    this.lastEvent = \`openChange emitted \${open}\`;
  }
}`;

  sourcesProps: PropEntry[] = [
    { name: 'open', type: 'boolean', default: 'false', description: 'Whether the citation list is expanded. Supports two-way binding with [(open)].' },
    { name: 'variant', type: "'default' | 'card' | 'muted'", default: "'default'", description: 'Visual treatment of the list container.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the list (last-wins).' }
  ];

  sourcesOutputs: PropEntry[] = [
    { name: 'openChange', type: 'EventEmitter<boolean>', description: 'Emitted with the new state whenever the user expands or collapses the list. Mounting never emits.' }
  ];

  triggerProps: PropEntry[] = [
    { name: 'count', type: 'number | null', default: 'null', description: 'Overrides the counted number of sources. Leave unset to let the trigger count the projected tolle-source elements.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the trigger (last-wins).' }
  ];

  contentProps: PropEntry[] = [
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the content (last-wins).' }
  ];

  sourceProps: PropEntry[] = [
    { name: 'href', type: 'string', default: "''", description: 'URL the citation points at. Opens in a new tab.' },
    { name: 'title', type: 'string', default: "''", description: 'Human-readable title; falls back to the href when empty.' },
    { name: 'favicon', type: 'string', default: "''", description: 'URL of a favicon shown instead of the numbered chip.' },
    { name: 'index', type: 'number | null', default: 'null', description: 'Overrides the auto-numbered position chip.' },
    { name: 'size', type: "'sm' | 'default'", default: "'default'", description: 'Text scale of the citation.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the citation (last-wins).' }
  ];
}
