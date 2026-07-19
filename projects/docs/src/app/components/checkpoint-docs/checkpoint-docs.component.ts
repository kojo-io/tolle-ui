import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicCheckpointComponent } from '../../docs-examples/checkpoint/basic-checkpoint/basic-checkpoint.component';
import { CheckpointActiveComponent } from '../../docs-examples/checkpoint/checkpoint-active/checkpoint-active.component';

@Component({
  selector: 'app-checkpoint-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicCheckpointComponent,
    CheckpointActiveComponent
  ],
  templateUrl: './checkpoint-docs.component.html',
  styleUrl: './checkpoint-docs.component.css'
})
export class CheckpointDocsComponent {
  baseService = inject(BaseService);

  installation = `import { CheckpointComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [CheckpointComponent]
})`;

  basicCode = `<tolle-checkpoint
  label="Before refactor"
  timestamp="14:32"
  (restore)="rewindTo('before-refactor')" />`;

  activeCode = `@for (point of checkpoints; track point.label) {
  <tolle-checkpoint
    [label]="point.label"
    [timestamp]="point.timestamp"
    [active]="point.label === activeLabel"
    size="sm"
    (restore)="restore(point.label)" />
}`;

  checkpointProps: PropEntry[] = [
    { name: 'label', type: 'string', default: "'Checkpoint'", description: 'Text shown in the centred pill.' },
    { name: 'timestamp', type: 'string', default: "''", description: 'Optional time or date shown beside the label.' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Marks this as the checkpoint the conversation currently sits on.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents restoring from this checkpoint.' },
    { name: 'restoreLabel', type: 'string', default: "'Restore checkpoint'", description: 'Accessible label for the restore control.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name for the checkpoint row.' },
    { name: 'icon', type: 'string', default: "'ri-history-line'", description: 'Remix icon class shown in the pill.' },
    { name: 'size', type: "'sm' | 'default'", default: "'default'", description: 'Density of the checkpoint row.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the checkpoint.' }
  ];

  checkpointEvents: PropEntry[] = [
    { name: 'restore', type: 'EventEmitter<void>', description: 'Emitted when the user asks to rewind to this checkpoint.' }
  ];
}
