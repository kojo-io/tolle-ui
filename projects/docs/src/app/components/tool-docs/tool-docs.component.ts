import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicToolComponent } from '../../docs-examples/tool/basic-tool/basic-tool.component';
import { ToolStatesComponent } from '../../docs-examples/tool/tool-states/tool-states.component';
import { ToolLifecycleComponent } from '../../docs-examples/tool/tool-lifecycle/tool-lifecycle.component';


@Component({
  selector: 'app-tool-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicToolComponent,
    ToolStatesComponent,
    ToolLifecycleComponent
  ],
  templateUrl: './tool-docs.component.html',
  styleUrl: './tool-docs.component.css'
})
export class ToolDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  ToolComponent,
  ToolHeaderComponent,
  ToolInputComponent,
  ToolOutputComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [ToolComponent, ToolHeaderComponent, ToolInputComponent, ToolOutputComponent]
})`;

  anatomy = `<tolle-tool [state]="state" [(open)]="open">
  <tolle-tool-header name="search_docs" />
  <tolle-tool-input [payload]="args" />
  <tolle-tool-output [payload]="result" />
</tolle-tool>`;

  basicCode = `<tolle-tool state="success" [open]="true">
  <tolle-tool-header name="search_docs" />
  <tolle-tool-input [payload]="input" />
  <tolle-tool-output [payload]="output" />
</tolle-tool>`;

  basicTs = `export class BasicToolComponent {
  // Objects are pretty-printed as JSON by the panels; strings render as-is.
  readonly input = { query: 'context window', limit: 3, section: 'ai' };

  readonly output = {
    results: [
      { slug: 'context', title: 'Context' },
      { slug: 'reasoning', title: 'Reasoning' },
      { slug: 'sources', title: 'Sources' }
    ]
  };
}`;

  statesCode = `<tolle-tool state="pending">
  <tolle-tool-header name="read_file" icon="ri-file-text-line" />
  <tolle-tool-input [payload]="{ path: 'src/app/app.config.ts' }" />
</tolle-tool>

<tolle-tool state="running">
  <tolle-tool-header name="run_tests" icon="ri-flask-line" />
  <tolle-tool-input [payload]="{ project: 'tolle' }" />
</tolle-tool>

<tolle-tool state="success" [open]="true">
  <tolle-tool-header name="write_file" icon="ri-quill-pen-line" />
  <tolle-tool-output payload="Wrote 42 lines to src/app/app.config.ts" />
</tolle-tool>

<tolle-tool state="error" [open]="true">
  <tolle-tool-header name="fetch_url" icon="ri-global-line" />
  <tolle-tool-output [error]="true" payload="TimeoutError: request exceeded 30s" />
</tolle-tool>`;

  lifecycleCode = `<tolle-button variant="outline" size="sm" (click)="run()">
  {{ state === 'running' ? 'Running…' : 'Run the tool call' }}
</tolle-button>

<tolle-tool [state]="state" [(open)]="open">
  <tolle-tool-header name="query_database" icon="ri-database-2-line" />
  <tolle-tool-input [payload]="input" />
  <tolle-tool-output *ngIf="output" [payload]="output" label="Rows" />
</tolle-tool>`;

  lifecycleTs = `import { ToolState } from '@tolle_/tolle-ui';

export class ToolLifecycleComponent {
  // Drives the header chip and the tool's border colour.
  state: ToolState = 'pending';
  open = false;
  output: unknown = null;

  readonly input = { table: 'sessions', where: { active: true }, limit: 2 };

  run(): void {
    this.state = 'running';
    this.open = true;
    // …when the call returns…
    // this.output = rows;
    // this.state = 'success';
  }
}`;

  toolProps: PropEntry[] = [
    { name: 'state', type: "'pending' | 'running' | 'success' | 'error'", default: "'pending'", description: 'Lifecycle of the call, driving the header chip and the border colour.' },
    { name: 'open', type: 'boolean', default: 'false', description: "Whether the call's input and output are expanded. Supports two-way binding with [(open)]." },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the tool (last-wins).' }
  ];

  toolOutputs: PropEntry[] = [
    { name: 'openChange', type: 'EventEmitter<boolean>', description: 'Emitted with the new state whenever the user expands or collapses the call. Mounting never emits.' }
  ];

  headerProps: PropEntry[] = [
    { name: 'name', type: 'string', default: "''", description: 'Name of the tool that was called.' },
    { name: 'icon', type: 'string', default: "'ri-tools-line'", description: 'Remixicon class shown before the tool name.' },
    { name: 'stateLabelOverride', type: 'string', default: "''", description: 'Overrides the chip text; defaults to a label derived from the state (Pending, Running, Completed, Error).' },
    { name: 'chipClassName', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the state chip (last-wins).' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the header (last-wins).' }
  ];

  inputProps: PropEntry[] = [
    { name: 'payload', type: 'unknown', default: 'null', description: 'Arguments passed to the tool. Objects are pretty-printed as JSON, strings render as-is. Project your own markup instead when you leave it unset.' },
    { name: 'label', type: 'string', default: "'Parameters'", description: 'Heading above the payload. Pass an empty string to drop it.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the panel (last-wins).' }
  ];

  outputProps: PropEntry[] = [
    { name: 'payload', type: 'unknown', default: 'null', description: 'Result the tool returned. Objects are pretty-printed as JSON, strings render as-is.' },
    { name: 'label', type: 'string', default: "'Result'", description: 'Heading above the payload. Pass an empty string to drop it.' },
    { name: 'error', type: 'boolean', default: 'false', description: 'Styles the payload as a failure, using the destructive tokens.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the panel (last-wins).' }
  ];
}
