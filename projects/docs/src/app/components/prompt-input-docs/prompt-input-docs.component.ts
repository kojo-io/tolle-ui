import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicPromptInputComponent } from '../../docs-examples/prompt-input/basic-prompt-input/basic-prompt-input.component';
import { PromptInputStreamingComponent } from '../../docs-examples/prompt-input/prompt-input-streaming/prompt-input-streaming.component';
import { PromptInputReactiveFormComponent } from '../../docs-examples/prompt-input/prompt-input-reactive-form/prompt-input-reactive-form.component';


@Component({
  selector: 'app-prompt-input-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicPromptInputComponent,
    PromptInputStreamingComponent,
    PromptInputReactiveFormComponent
  ],
  templateUrl: './prompt-input-docs.component.html',
  styleUrl: './prompt-input-docs.component.css'
})
export class PromptInputDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  PromptInputComponent,
  PromptInputToolbarComponent,
  PromptInputToolsComponent,
  PromptInputSubmitComponent
} from '@tolle_/tolle-ui';`;

  anatomy = `<tolle-prompt-input [(ngModel)]="message" (submitted)="send($event)">
  <tolle-prompt-input-toolbar>
    <tolle-prompt-input-tools>
      <!-- attachment, model picker, anything -->
    </tolle-prompt-input-tools>

    <tolle-prompt-input-submit />
  </tolle-prompt-input-toolbar>
</tolle-prompt-input>`;

  basicCode = `<tolle-prompt-input [(ngModel)]="message" placeholder="Ask anything…" (submitted)="onSubmitted($event)">
  <tolle-prompt-input-toolbar>
    <tolle-prompt-input-tools>
      <tolle-button variant="ghost" size="icon-xs">
        <i class="ri-attachment-2" aria-hidden="true"></i>
        <span class="sr-only">Attach a file</span>
      </tolle-button>
    </tolle-prompt-input-tools>

    <tolle-prompt-input-submit />
  </tolle-prompt-input-toolbar>
</tolle-prompt-input>`;

  basicTs = `export class BasicPromptInputComponent {
  message = '';
  sent: string[] = [];

  // Emitted with the trimmed text; the composer clears itself afterwards.
  onSubmitted(text: string): void {
    this.sent = [...this.sent, text];
  }
}`;

  streamingCode = `<tolle-prompt-input
  [(ngModel)]="message"
  [status]="status"
  placeholder="Ask a question, then hit stop…"
  (submitted)="onSubmitted($event)"
  (stopped)="onStopped()">

  <tolle-prompt-input-toolbar>
    <tolle-prompt-input-tools>
      <span class="text-xs">Status: {{ status }}</span>
    </tolle-prompt-input-tools>

    <tolle-prompt-input-submit />
  </tolle-prompt-input-toolbar>
</tolle-prompt-input>`;

  streamingTs = `import { PromptInputStatus } from '@tolle_/tolle-ui';

export class PromptInputStreamingComponent {
  message = '';
  status: PromptInputStatus = 'ready';
  response = '';

  onSubmitted(text: string): void {
    this.response = '';
    // The submit button flips to a red stop button while this holds.
    this.status = 'streaming';
    // …append each chunk to \`response\`, then set status back to 'ready'…
  }

  // Emitted when the user presses the stop button mid-flight.
  onStopped(): void {
    this.status = 'ready';
  }
}`;

  reactiveCode = `<form [formGroup]="form">
  <tolle-prompt-input
    formControlName="message"
    [status]="status"
    [submitOnEnter]="false"
    [clearOnSubmit]="false"
    [maxRows]="4"
    placeholder="Enter starts a new line here…"
    (submitted)="onSubmitted($event)">

    <tolle-prompt-input-toolbar>
      <tolle-prompt-input-tools>
        <span class="text-xs">{{ remaining }} characters left</span>
      </tolle-prompt-input-tools>

      <tolle-prompt-input-submit [showLabel]="true" size="sm" submitLabel="Send" />
    </tolle-prompt-input-toolbar>
  </tolle-prompt-input>
</form>`;

  reactiveTs = `export class PromptInputReactiveFormComponent {
  form = new FormGroup({
    message: new FormControl<string>('Draft a release note for the composer.', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)]
    })
  });

  /** 'error' paints the border and sets aria-invalid on the textarea. */
  get status(): PromptInputStatus {
    const control = this.form.controls.message;
    return control.invalid && control.touched ? 'error' : 'ready';
  }
}`;

  promptInputProps: PropEntry[] = [
    { name: 'placeholder', type: 'string', default: "'Send a message…'", description: 'Placeholder shown while the composer is empty.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks typing and submission. Also driven by a disabled form control.' },
    { name: 'maxRows', type: 'number', default: '8', description: 'Rows the textarea may grow to before it starts scrolling.' },
    { name: 'status', type: "'ready' | 'streaming' | 'error'", default: "'ready'", description: "Lifecycle of the response being composed. 'streaming' turns the submit button into a stop button; 'error' paints the border and sets aria-invalid." },
    { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Size scale of the composer.' },
    { name: 'submitOnEnter', type: 'boolean', default: 'true', description: 'Submit on Enter, keeping Shift+Enter for newlines. Set false to make Enter always insert a newline.' },
    { name: 'clearOnSubmit', type: 'boolean', default: 'true', description: 'Clears the composer after a successful submit.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name for the textarea. Falls back to the placeholder, then "Message".' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the composer (last-wins).' },
    { name: 'textareaClass', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the textarea (last-wins).' }
  ];

  promptInputOutputs: PropEntry[] = [
    { name: 'submitted', type: 'EventEmitter<string>', description: 'Emitted with the trimmed message text when the user submits. Empty, disabled and streaming composers never emit.' },
    { name: 'stopped', type: 'EventEmitter<void>', description: 'Emitted when the user cancels an in-flight streaming response from the stop button.' },
    { name: 'valueChange', type: 'EventEmitter<string>', description: 'Emitted with the message text whenever it changes.' }
  ];

  submitProps: PropEntry[] = [
    { name: 'variant', type: "'default' | 'secondary' | 'ghost'", default: "'default'", description: 'Visual style of the button. Streaming overrides it with the destructive colour.' },
    { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Size of the button.' },
    { name: 'submitLabel', type: 'string', default: "'Send message'", description: 'Accessible name while the composer is idle.' },
    { name: 'stopLabel', type: 'string', default: "'Stop generating'", description: 'Accessible name while the composer is streaming.' },
    { name: 'showLabel', type: 'boolean', default: 'false', description: 'Renders the label next to the icon instead of icon-only.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the button (last-wins).' }
  ];

  layoutProps: PropEntry[] = [
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the element (last-wins). Both the toolbar and the tool row take only this.' }
  ];
}
