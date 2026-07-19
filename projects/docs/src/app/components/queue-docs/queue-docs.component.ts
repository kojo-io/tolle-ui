import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicQueueComponent } from '../../docs-examples/queue/basic-queue/basic-queue.component';
import { QueueStatusesComponent } from '../../docs-examples/queue/queue-statuses/queue-statuses.component';

@Component({
  selector: 'app-queue-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicQueueComponent,
    QueueStatusesComponent
  ],
  templateUrl: './queue-docs.component.html',
  styleUrl: './queue-docs.component.css'
})
export class QueueDocsComponent {
  baseService = inject(BaseService);

  installation = `import { QueueComponent, QueueItemComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [QueueComponent, QueueItemComponent]
})`;

  basicCode = `<tolle-queue title="Queued prompts">
  @for (item of items; track item.id) {
    <tolle-queue-item [label]="item.label" (remove)="remove(item.id)" />
  }
</tolle-queue>`;

  statusesCode = `<tolle-queue title="Batch run" size="sm">
  <tolle-queue-item label="Fetch changelog" status="done" [removable]="false" />
  <tolle-queue-item label="Generate release notes" status="running" [removable]="false" />
  <tolle-queue-item label="Post to Slack" status="queued" />
</tolle-queue>

<tolle-queue title="Empty queue" emptyMessage="Nothing queued — send a prompt to get started." />`;

  queueProps: PropEntry[] = [
    { name: 'title', type: 'string', default: "'Queue'", description: 'Heading shown above the list, beside the item count.' },
    { name: 'emptyMessage', type: 'string', default: "'Nothing queued.'", description: 'Shown when the queue holds no items.' },
    { name: 'size', type: "'sm' | 'default'", default: "'default'", description: 'Density of the queue rows.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the queue.' }
  ];

  queueEvents: PropEntry[] = [
    { name: 'countsChange', type: 'EventEmitter<QueueCounts>', description: 'Emitted with the per-status tallies whenever the queue changes.' }
  ];

  queueItemProps: PropEntry[] = [
    { name: 'label', type: 'string', default: "''", description: 'Text describing the queued work.' },
    { name: 'status', type: "'queued' | 'running' | 'done'", default: "'queued'", description: 'Drives the row icon and colour.' },
    { name: 'removable', type: 'boolean', default: 'true', description: 'Shows the remove control. Turn it off for work already in flight.' },
    { name: 'removeLabel', type: 'string', default: "'Remove from queue'", description: 'Accessible label for the remove control.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the item.' }
  ];

  queueItemEvents: PropEntry[] = [
    { name: 'remove', type: 'EventEmitter<void>', description: 'Emitted when the user removes this item.' }
  ];
}
