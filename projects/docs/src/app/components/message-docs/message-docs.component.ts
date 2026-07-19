import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicMessageComponent } from '../../docs-examples/message/basic-message/basic-message.component';
import { MessageGroupExampleComponent } from '../../docs-examples/message/message-group/message-group.component';
import { MessageHeaderFooterComponent } from '../../docs-examples/message/message-header-footer/message-header-footer.component';


@Component({
  selector: 'app-message-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicMessageComponent,
    MessageGroupExampleComponent,
    MessageHeaderFooterComponent
  ],
  templateUrl: './message-docs.component.html',
  styleUrl: './message-docs.component.css'
})
export class MessageDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  MessageComponent,
  MessageGroupComponent,
  MessageAvatarComponent,
  MessageContentComponent,
  MessageHeaderComponent,
  MessageFooterComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [MessageComponent, MessageAvatarComponent, MessageContentComponent]
})`;

  basicCode = `<tolle-message align="start">
  <tolle-message-avatar>AL</tolle-message-avatar>
  <tolle-message-content>
    <tolle-bubble align="start">Did the migration finish?</tolle-bubble>
  </tolle-message-content>
</tolle-message>

<tolle-message align="end">
  <tolle-message-avatar>ME</tolle-message-avatar>
  <tolle-message-content>
    <tolle-bubble variant="primary" align="end">All 14 tables, about a minute ago.</tolle-bubble>
  </tolle-message-content>
</tolle-message>`;

  groupCode = `<tolle-message align="start">
  <tolle-message-avatar>AL</tolle-message-avatar>
  <tolle-message-content>
    <tolle-message-header>Ada</tolle-message-header>

    <tolle-message-group align="start" spacing="tight">
      <tolle-bubble align="start">I pushed the fix.</tolle-bubble>
      <tolle-bubble align="start">Two files, both in the parser.</tolle-bubble>
      <tolle-bubble align="start">Tests are green.</tolle-bubble>
    </tolle-message-group>
  </tolle-message-content>
</tolle-message>`;

  headerFooterCode = `<tolle-message align="start">
  <tolle-message-avatar>AL</tolle-message-avatar>
  <tolle-message-content>
    <tolle-message-header>
      <span>Ada Lovelace</span>
      <span class="font-normal">09:41</span>
    </tolle-message-header>

    <tolle-bubble align="start">Can you take a look before standup?</tolle-bubble>

    <tolle-message-footer>
      <i class="ri-eye-line" aria-hidden="true"></i>
      <span>Seen</span>
    </tolle-message-footer>
  </tolle-message-content>
</tolle-message>`;

  messageProps: PropEntry[] = [
    { name: 'align', type: "'start' | 'end'", default: "'start'", description: "Which edge the message hangs off — 'start' for incoming, 'end' for outgoing. Mirrors the row so the avatar lands on the trailing edge." },
    { name: 'size', type: "'sm' | 'default'", default: "'default'", description: 'Gap density of the row.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the row.' }
  ];

  groupProps: PropEntry[] = [
    { name: 'align', type: "'start' | 'end'", default: "'start'", description: 'Edge the grouped messages hang off.' },
    { name: 'spacing', type: "'tight' | 'default' | 'loose'", default: "'default'", description: 'Vertical gap between the grouped messages.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the group.' }
  ];

  subComponents: PropEntry[] = [
    { name: 'tolle-message-group', type: 'component', description: 'Stacks consecutive messages from one sender so a burst reads as a single turn.' },
    { name: 'tolle-message-avatar', type: 'component', description: 'Avatar slot, anchored to the bottom of the row so it sits beside the last line.' },
    { name: 'tolle-message-content', type: 'component', description: 'Content column that fills the row — wraps the header, the bubble, and the footer.' },
    { name: 'tolle-message-header', type: 'component', description: 'Sender name and metadata above the surface.' },
    { name: 'tolle-message-footer', type: 'component', description: 'Delivery status, actions, or a timestamp below the surface.' }
  ];
}
