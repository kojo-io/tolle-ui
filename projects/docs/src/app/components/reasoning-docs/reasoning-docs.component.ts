import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicReasoningComponent } from '../../docs-examples/reasoning/basic-reasoning/basic-reasoning.component';
import { ReasoningStreamingComponent } from '../../docs-examples/reasoning/reasoning-streaming/reasoning-streaming.component';
import { ReasoningCustomComponent } from '../../docs-examples/reasoning/reasoning-custom/reasoning-custom.component';


@Component({
  selector: 'app-reasoning-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicReasoningComponent,
    ReasoningStreamingComponent,
    ReasoningCustomComponent
  ],
  templateUrl: './reasoning-docs.component.html',
  styleUrl: './reasoning-docs.component.css'
})
export class ReasoningDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  ReasoningComponent,
  ReasoningTriggerComponent,
  ReasoningContentComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [ReasoningComponent, ReasoningTriggerComponent, ReasoningContentComponent]
})`;

  anatomy = `<tolle-reasoning [streaming]="isThinking" [duration]="seconds">
  <tolle-reasoning-trigger />
  <tolle-reasoning-content [text]="trace" />
</tolle-reasoning>`;

  basicCode = `<tolle-reasoning [duration]="4">
  <tolle-reasoning-trigger />
  <tolle-reasoning-content [text]="trace" />
</tolle-reasoning>`;

  streamingCode = `<tolle-button variant="outline" size="sm" (click)="start()">
  {{ streaming ? 'Streaming…' : 'Stream a reasoning trace' }}
</tolle-button>

<tolle-reasoning [(open)]="open" [streaming]="streaming" [duration]="duration">
  <tolle-reasoning-trigger />
  <tolle-reasoning-content [text]="text" />
</tolle-reasoning>`;

  streamingTs = `export class ReasoningStreamingComponent {
  text = '';
  streaming = false;
  duration = 0;
  open = true;

  private startedAt = 0;

  start(): void {
    this.text = '';
    this.duration = 0;
    this.streaming = true;
    this.startedAt = Date.now();
    // …append each chunk to \`text\` as it arrives…
  }

  private finish(): void {
    this.streaming = false;
    // The trigger switches from "Thinking…" to "Thought for N seconds".
    this.duration = (Date.now() - this.startedAt) / 1000;
  }
}`;

  customCode = `<tolle-reasoning size="sm" [open]="open" [duration]="12" (openChange)="onOpenChange($event)">
  <tolle-reasoning-trigger
    icon="ri-sparkling-2-line"
    thinkingLabel="Working on it…"
    fallbackLabel="Thought about the request" />

  <tolle-reasoning-content>
    <p class="mb-2">Projected markup renders instead of a plain paragraph…</p>
    <ul class="list-disc space-y-1 pl-5">
      <li>Read the failing test and the component under it.</li>
      <li>Reproduced the timing bug with a fake clock.</li>
    </ul>
  </tolle-reasoning-content>
</tolle-reasoning>`;

  reasoningProps: PropEntry[] = [
    { name: 'open', type: 'boolean', default: 'false', description: 'Whether the trace is expanded. Supports two-way binding with [(open)].' },
    { name: 'streaming', type: 'boolean', default: 'false', description: 'True while the model is still producing the trace; the trigger reads "Thinking…".' },
    { name: 'duration', type: 'number', default: '0', description: 'Seconds the model spent reasoning, shown by the trigger once streaming finishes.' },
    { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Text scale of the trace.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the trace (last-wins).' }
  ];

  reasoningOutputs: PropEntry[] = [
    { name: 'openChange', type: 'EventEmitter<boolean>', description: 'Emitted with the new state whenever the user expands or collapses the trace. Mounting never emits.' }
  ];

  triggerProps: PropEntry[] = [
    { name: 'icon', type: 'string', default: "'ri-brain-line'", description: 'Remixicon class shown before the label. Pulses while streaming.' },
    { name: 'thinkingLabel', type: 'string', default: "'Thinking…'", description: 'Label shown while the trace is streaming.' },
    { name: 'fallbackLabel', type: 'string', default: "'Thought for a few seconds'", description: 'Label used when the trace finished without a measured duration (duration under 1s).' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the trigger (last-wins).' }
  ];

  contentProps: PropEntry[] = [
    { name: 'text', type: 'string', default: "''", description: 'Reasoning text to render, with newlines preserved. Project your own markup instead when it is richer.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the content (last-wins).' }
  ];
}
