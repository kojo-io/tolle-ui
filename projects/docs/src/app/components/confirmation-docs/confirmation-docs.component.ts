import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicConfirmationComponent } from '../../docs-examples/confirmation/basic-confirmation/basic-confirmation.component';
import { ConfirmationResolvedComponent } from '../../docs-examples/confirmation/confirmation-resolved/confirmation-resolved.component';

@Component({
  selector: 'app-confirmation-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicConfirmationComponent,
    ConfirmationResolvedComponent
  ],
  templateUrl: './confirmation-docs.component.html',
  styleUrl: './confirmation-docs.component.css'
})
export class ConfirmationDocsComponent {
  baseService = inject(BaseService);

  installation = `import { ConfirmationComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [ConfirmationComponent]
})`;

  basicCode = `<tolle-confirmation
  title="Delete 3 files?"
  description="src/legacy/parser.ts, src/legacy/lexer.ts and src/legacy/index.ts will be removed."
  confirmLabel="Delete"
  cancelLabel="Keep"
  confirmedLabel="Deleted"
  cancelledLabel="Kept"
  [state]="state"
  (confirmed)="approve()"
  (cancelled)="deny()" />`;

  statesCode = `<tolle-confirmation title="Run database migration?" state="pending" />
<tolle-confirmation title="Push to origin/main?" confirmedLabel="Pushed" state="confirmed" />
<tolle-confirmation title="Install 12 new packages?" cancelledLabel="Declined" state="cancelled" />`;

  confirmationProps: PropEntry[] = [
    { name: 'title', type: 'string', default: "''", description: 'The action awaiting sign-off.' },
    { name: 'description', type: 'string', default: "''", description: 'Supporting detail about what will happen.' },
    { name: 'confirmLabel', type: 'string', default: "'Approve'", description: 'Label for the confirming button.' },
    { name: 'cancelLabel', type: 'string', default: "'Deny'", description: 'Label for the cancelling button.' },
    { name: 'confirmedLabel', type: 'string', default: "'Approved'", description: 'Text shown in the resolved row after confirming.' },
    { name: 'cancelledLabel', type: 'string', default: "'Denied'", description: 'Text shown in the resolved row after cancelling.' },
    { name: 'state', type: "'pending' | 'confirmed' | 'cancelled'", default: "'pending'", description: 'Drives whether the buttons or the resolved row is shown.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both buttons while the decision is in flight.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the confirmation.' }
  ];

  confirmationEvents: PropEntry[] = [
    { name: 'confirmed', type: 'EventEmitter<void>', description: 'Emitted when the user approves the action.' },
    { name: 'cancelled', type: 'EventEmitter<void>', description: 'Emitted when the user denies the action.' }
  ];
}
