import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicAttachmentComponent } from '../../docs-examples/attachment/basic-attachment/basic-attachment.component';
import { AttachmentStatesComponent } from '../../docs-examples/attachment/attachment-states/attachment-states.component';
import { AttachmentInMessageComponent } from '../../docs-examples/attachment/attachment-in-message/attachment-in-message.component';


@Component({
  selector: 'app-attachment-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicAttachmentComponent,
    AttachmentStatesComponent,
    AttachmentInMessageComponent
  ],
  templateUrl: './attachment-docs.component.html',
  styleUrl: './attachment-docs.component.css'
})
export class AttachmentDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  AttachmentComponent,
  AttachmentGroupComponent,
  AttachmentActionsComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [AttachmentComponent, AttachmentGroupComponent, AttachmentActionsComponent]
})`;

  basicCode = `<tolle-attachment name="quarterly-report.pdf" [size]="284160" type="application/pdf" />
<tolle-attachment name="migration-plan.md" [size]="4820" type="text/markdown" />
<tolle-attachment name="build-artifacts.zip" [size]="18874368" type="application/zip" density="sm" />

<tolle-attachment
  name="revenue.csv"
  [size]="912"
  type="text/csv"
  [removable]="true"
  (remove)="onRemove()"
  (open)="onOpen()" />`;

  statesCode = `<tolle-attachment
  name="design-system.fig"
  [size]="7340032"
  type="application/octet-stream"
  [state]="state"
  [progress]="progress"
  errorLabel="Upload failed — connection lost" />

<tolle-attachment
  name="onboarding.mp4"
  [size]="52428800"
  type="video/mp4"
  state="error"
  errorLabel="Too large — 50 MB limit"
  [removable]="true" />`;

  statesTsCode = `export class UploadDemo implements OnDestroy {
  state: AttachmentProps['state'] = 'uploading';
  progress = 35;

  private timer?: ReturnType<typeof setInterval>;

  start(): void {
    this.stop();
    this.state = 'uploading';
    this.progress = 0;

    this.timer = setInterval(() => {
      this.progress += 8;
      if (this.progress >= 100) {
        this.progress = 100;
        this.state = 'idle';
        this.stop();
      }
    }, 220);
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private stop(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}`;

  inMessageCode = `<tolle-message align="end">
  <tolle-message-avatar>ME</tolle-message-avatar>
  <tolle-message-content>
    <tolle-bubble variant="primary" align="end">Here are the files from the audit.</tolle-bubble>

    <tolle-attachment-group>
      @for (file of files; track file.name) {
        <tolle-attachment [name]="file.name" [size]="file.size" [type]="file.type" class="max-w-[15rem]">
          <tolle-attachment-actions>
            <button type="button" aria-label="Download">
              <i class="ri-download-2-line" aria-hidden="true"></i>
            </button>
          </tolle-attachment-actions>
        </tolle-attachment>
      }
    </tolle-attachment-group>
  </tolle-message-content>
</tolle-message>`;

  attachmentProps: PropEntry[] = [
    { name: 'name', type: 'string', default: "''", description: "File name shown as the card's title, and its accessible label." },
    { name: 'size', type: 'number', default: '0', description: 'File size in bytes. Rendered for display as B / KB / MB — 1536 becomes "1.5 KB".' },
    { name: 'type', type: 'string', default: "''", description: "MIME type, e.g. 'image/png'. Chooses the thumbnail or the file icon." },
    { name: 'url', type: 'string', default: "''", description: 'Source for the thumbnail. An image/* type with a url renders a thumbnail instead of an icon.' },
    { name: 'state', type: "'idle' | 'uploading' | 'error'", default: "'idle'", description: 'Upload lifecycle state of the attachment.' },
    { name: 'progress', type: 'number', default: '0', description: 'Upload progress from 0 to 100; clamped, and only shown while uploading.' },
    { name: 'density', type: "'sm' | 'default'", default: "'default'", description: 'Density of the card.' },
    { name: 'removable', type: 'boolean', default: 'false', description: 'Shows a trailing remove button that emits remove.' },
    { name: 'removeLabel', type: 'string', default: "'Remove attachment'", description: 'Accessible label for the remove button.' },
    { name: 'errorLabel', type: 'string', default: "'Upload failed'", description: "Text shown in place of the size when the state is 'error'." },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the card.' }
  ];

  attachmentEvents: PropEntry[] = [
    { name: 'remove', type: 'EventEmitter<Event>', description: 'Emits when the remove button is pressed. The click is stopped, so open does not also fire.' },
    { name: 'open', type: 'EventEmitter<Event>', description: 'Emits when the card is activated by click, Enter, or Space.' }
  ];

  groupProps: PropEntry[] = [
    { name: 'class', type: 'string', description: 'Additional CSS classes for the wrapping row.' }
  ];

  actionsProps: PropEntry[] = [
    { name: 'alwaysVisible', type: 'boolean', default: 'false', description: 'Keeps the actions visible instead of revealing them on hover or focus.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the slot.' }
  ];

  iconMap: PropEntry[] = [
    { name: 'image/*', type: 'ri-image-line', description: 'Renders a thumbnail from url when one is supplied, otherwise the icon.' },
    { name: 'video/*', type: 'ri-film-line', description: 'Video files.' },
    { name: 'audio/*', type: 'ri-music-2-line', description: 'Audio files.' },
    { name: 'application/pdf', type: 'ri-file-pdf-line', description: 'PDF documents.' },
    { name: 'text/*', type: 'ri-file-text-line', description: 'Plain text, markdown, and similar.' },
    { name: 'zip / compressed / tar', type: 'ri-file-zip-line', description: 'Archives, matched on a substring of the type.' },
    { name: 'spreadsheet / excel / csv', type: 'ri-file-excel-line', description: 'Tabular data, matched on a substring of the type.' },
    { name: 'anything else', type: 'ri-file-line', description: 'The generic file icon.' }
  ];
}
