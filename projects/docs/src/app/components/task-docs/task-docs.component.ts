import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicTaskComponent } from '../../docs-examples/task/basic-task/basic-task.component';
import { TaskFilesComponent } from '../../docs-examples/task/task-files/task-files.component';

@Component({
  selector: 'app-task-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicTaskComponent,
    TaskFilesComponent
  ],
  templateUrl: './task-docs.component.html',
  styleUrl: './task-docs.component.css'
})
export class TaskDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  TaskComponent,
  TaskTriggerComponent,
  TaskContentComponent,
  TaskItemComponent,
  TaskItemFileComponent
} from '@tolle_/tolle-ui';`;

  basicCode = `<tolle-task title="Searching the codebase" status="completed" [open]="true">
  <tolle-task-trigger />
  <tolle-task-content>
    <tolle-task-item>Scanned 1,204 files</tolle-task-item>
    <tolle-task-item>Found 3 matches for "generateChartRamp"</tolle-task-item>
  </tolle-task-content>
</tolle-task>`;

  filesCode = `<tolle-task title="Edited 3 files" status="completed" [(open)]="open">
  <tolle-task-trigger />
  <tolle-task-content>
    <tolle-task-item>
      Rewrote the ramp generator in OKLCH
      <tolle-task-item-file icon="ri-typescript-line">utils/color.ts</tolle-task-item-file>
    </tolle-task-item>
  </tolle-task-content>
</tolle-task>`;

  taskProps: PropEntry[] = [
    { name: 'title', type: 'string', default: "''", description: 'What the task is doing.' },
    { name: 'status', type: "'pending' | 'in-progress' | 'completed' | 'error'", default: "'pending'", description: 'Drives the header icon and colour.' },
    { name: 'open', type: 'boolean', default: 'false', description: 'Whether the detail is expanded. Supports two-way binding.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the task.' }
  ];

  taskEvents: PropEntry[] = [
    { name: 'openChange', type: 'EventEmitter<boolean>', description: 'Two-way binding partner for open.' }
  ];

  fileProps: PropEntry[] = [
    { name: 'icon', type: 'string', default: "'ri-file-line'", description: 'Remix icon class for the file chip.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the file chip.' }
  ];
}
