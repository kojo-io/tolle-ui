import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicConversationComponent } from '../../docs-examples/conversation/basic-conversation/basic-conversation.component';
import { ConversationEmptyStateExampleComponent } from '../../docs-examples/conversation/conversation-empty-state/conversation-empty-state.component';
import { ConversationAutoScrollComponent } from '../../docs-examples/conversation/conversation-auto-scroll/conversation-auto-scroll.component';


@Component({
  selector: 'app-conversation-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicConversationComponent,
    ConversationEmptyStateExampleComponent,
    ConversationAutoScrollComponent
  ],
  templateUrl: './conversation-docs.component.html',
  styleUrl: './conversation-docs.component.css'
})
export class ConversationDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  ConversationComponent,
  ConversationContentComponent,
  ConversationEmptyStateComponent,
  ConversationScrollButtonComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [
    ConversationComponent,
    ConversationContentComponent,
    ConversationScrollButtonComponent
  ]
})`;

  basicCode = `<tolle-conversation size="sm" ariaLabel="Support conversation">
  <tolle-conversation-content>
    @for (turn of turns; track turn.text) {
      <tolle-message [align]="turn.align">
        <tolle-message-avatar>{{ turn.align === 'end' ? 'ME' : 'AL' }}</tolle-message-avatar>
        <tolle-message-content>
          <tolle-bubble [align]="turn.align">{{ turn.text }}</tolle-bubble>
        </tolle-message-content>
      </tolle-message>
    }
  </tolle-conversation-content>

  <tolle-conversation-scroll-button />
</tolle-conversation>`;

  emptyCode = `<tolle-conversation size="sm" [empty]="messages.length === 0">
  <tolle-conversation-empty-state
    icon="ri-chat-smile-2-line"
    title="No messages yet"
    description="Ask a question and the transcript will start here.">
    <button type="button" (click)="send()">Send the first message</button>
  </tolle-conversation-empty-state>

  <tolle-conversation-content>
    <!-- messages -->
  </tolle-conversation-content>

  <tolle-conversation-scroll-button />
</tolle-conversation>`;

  autoScrollCode = `<tolle-conversation
  size="sm"
  [autoScroll]="autoScroll"
  [threshold]="32"
  (atBottomChange)="atBottom = $event">
  <tolle-conversation-content>
    <!-- messages -->
  </tolle-conversation-content>

  <tolle-conversation-scroll-button label="Jump to latest" (jumped)="jumps = jumps + 1" />
</tolle-conversation>`;

  autoScrollTsCode = `export class LiveFeed implements OnDestroy {
  private timer?: ReturnType<typeof setInterval>;

  start(): void {
    this.timer = setInterval(() => {
      const id = this.turns.length;
      this.turns = [...this.turns, { id, text: \`Queue update \${id}\` }];
    }, 1200);
  }

  ngOnDestroy(): void {
    if (this.timer !== undefined) clearInterval(this.timer);
  }
}`;

  conversationProps: PropEntry[] = [
    { name: 'size', type: "'sm' | 'default' | 'lg' | 'full'", default: "'default'", description: "Height preset for the scroll region. 'full' fills its parent instead of capping the height." },
    { name: 'autoScroll', type: 'boolean', default: 'true', description: 'Keeps the newest message in view — but only while the reader is already at the bottom, so a reply never yanks them mid-sentence.' },
    { name: 'empty', type: 'boolean', default: 'false', description: 'Set true before the first message so the empty state shows.' },
    { name: 'threshold', type: 'number', default: '32', description: 'Distance from the bottom, in px, still counted as "at the bottom".' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name for the transcript.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the transcript frame.' },
    { name: 'viewportClass', type: 'string', description: 'Additional CSS classes for the scrolling viewport itself.' }
  ];

  conversationEvents: PropEntry[] = [
    { name: 'atBottomChange', type: 'EventEmitter<boolean>', description: 'Emits whenever the transcript becomes pinned to, or leaves, the bottom.' },
    { name: 'scrollToBottom(behavior?)', type: 'method', description: "Scrolls to the newest message. Call it from a template reference variable; defaults to 'smooth'." }
  ];

  emptyStateProps: PropEntry[] = [
    { name: 'icon', type: 'string', default: "'ri-chat-3-line'", description: 'Remixicon class for the illustration.' },
    { name: 'title', type: 'string', default: "'No messages yet'", description: 'Headline shown above the description.' },
    { name: 'description', type: 'string', default: "'Start the conversation by sending a message.'", description: 'Supporting copy under the headline.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the empty state.' }
  ];

  scrollButtonProps: PropEntry[] = [
    { name: 'variant', type: "'default' | 'secondary' | 'outline'", default: "'outline'", description: 'Visual style of the button.' },
    { name: 'size', type: "'sm' | 'default' | 'icon'", default: "'default'", description: "Size of the button; 'icon' drops the text label." },
    { name: 'label', type: 'string', default: "'Jump to latest'", description: 'Button text and accessible name.' },
    { name: 'jumped', type: 'EventEmitter<void>', description: 'Emits when the reader jumps back to the newest message.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the button.' }
  ];

  subComponents: PropEntry[] = [
    { name: 'tolle-conversation-content', type: 'component', description: 'Vertical stack of messages inside the scrolling viewport.' },
    { name: 'tolle-conversation-empty-state', type: 'component', description: 'Placeholder shown while the transcript reports itself empty. Renders nothing otherwise, so it can stay in the template.' },
    { name: 'tolle-conversation-scroll-button', type: 'component', description: 'Floating jump-to-latest control. Projected outside the viewport so it stays put while the transcript scrolls, and appears only when the reader has scrolled away.' }
  ];
}
