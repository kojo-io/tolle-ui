import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicMessageScrollerComponent } from '../../docs-examples/message-scroller/basic-message-scroller/basic-message-scroller.component';
import { MessageScrollerStartPositionComponent } from '../../docs-examples/message-scroller/message-scroller-start-position/message-scroller-start-position.component';
import { MessageScrollerStreamingComponent } from '../../docs-examples/message-scroller/message-scroller-streaming/message-scroller-streaming.component';


@Component({
  selector: 'app-message-scroller-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicMessageScrollerComponent,
    MessageScrollerStartPositionComponent,
    MessageScrollerStreamingComponent
  ],
  templateUrl: './message-scroller-docs.component.html',
  styleUrl: './message-scroller-docs.component.css'
})
export class MessageScrollerDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  MessageScrollerComponent,
  MessageScrollerViewportComponent,
  MessageScrollerContentComponent,
  MessageScrollerButtonComponent,
  MessageScrollerItemDirective
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [
    MessageScrollerComponent,
    MessageScrollerViewportComponent,
    MessageScrollerContentComponent,
    MessageScrollerButtonComponent,
    MessageScrollerItemDirective
  ]
})`;

  anatomyCode = `<tolle-message-scroller startPosition="last-anchor">
  <tolle-message-scroller-viewport>
    <tolle-message-scroller-content>

      <!-- One row per entry. The directive goes on YOUR element. -->
      @for (turn of turns; track turn.id) {
        <div tolleMessageScrollerItem [scrollAnchor]="turn.startsTurn">
          <!-- tolle-message, tolle-marker, anything -->
        </div>
      }

    </tolle-message-scroller-content>
  </tolle-message-scroller-viewport>

  <tolle-message-scroller-button>Jump to latest</tolle-message-scroller-button>
</tolle-message-scroller>`;

  basicCode = `<div class="flex h-80 flex-col overflow-hidden rounded-lg border border-border
            [&>tolle-message-scroller]:flex
            [&>tolle-message-scroller]:min-h-0
            [&>tolle-message-scroller]:flex-1">
  <tolle-message-scroller startPosition="bottom" [threshold]="32" (atBottomChange)="atBottom = $event">
    <tolle-message-scroller-viewport>
      <tolle-message-scroller-content>
        @for (turn of turns; track turn.id) {
          <div tolleMessageScrollerItem [scrollAnchor]="turn.startsTurn">
            <tolle-message [align]="turn.align">
              <tolle-message-avatar>{{ turn.align === 'end' ? 'ME' : 'AI' }}</tolle-message-avatar>
              <tolle-message-content>
                <tolle-bubble [align]="turn.align">{{ turn.text }}</tolle-bubble>
              </tolle-message-content>
            </tolle-message>
          </div>
        }
      </tolle-message-scroller-content>
    </tolle-message-scroller-viewport>

    <tolle-message-scroller-button>Jump to latest</tolle-message-scroller-button>
  </tolle-message-scroller>
</div>`;

  startPositionCode = `<!-- Tracking the mount by its start position re-creates the scroller when it
     changes, so the new position is applied on a fresh mount. -->
@for (mount of [startPosition]; track mount) {
  <tolle-message-scroller [startPosition]="mount" [scrollPreviousItemPeek]="peek">
    <tolle-message-scroller-viewport>
      <tolle-message-scroller-content>
        @for (turn of turns; track turn.id) {
          <div tolleMessageScrollerItem [scrollAnchor]="turn.startsTurn">
            <!-- … -->
          </div>
        }
      </tolle-message-scroller-content>
    </tolle-message-scroller-viewport>
  </tolle-message-scroller>
}`;

  streamingCode = `<tolle-message-scroller startPosition="bottom" [threshold]="32" (atBottomChange)="atBottom = $event">
  <tolle-message-scroller-viewport>
    <tolle-message-scroller-content>
      @for (turn of turns; track turn.id) {
        <div tolleMessageScrollerItem [scrollAnchor]="turn.startsTurn">
          <!-- … -->
        </div>
      }

      @if (streaming) {
        <tolle-marker variant="status" icon="ri-loader-4-line" label="Streaming…" [shimmer]="true" />
      }
    </tolle-message-scroller-content>
  </tolle-message-scroller-viewport>

  <tolle-message-scroller-button>Jump to latest</tolle-message-scroller-button>
</tolle-message-scroller>`;

  streamingTsCode = `export class StreamingDemo implements OnDestroy {
  streaming = false;
  turns: Turn[] = [];

  private words: string[] = [];
  private cursor = 0;
  private timer?: ReturnType<typeof setInterval>;

  stream(): void {
    if (this.streaming) return;

    this.words = REPLY.split(' ');
    this.cursor = 0;
    this.streaming = true;
    this.turns = [...this.turns, { id: this.turns.length + 1, align: 'start', text: '', startsTurn: false }];

    this.timer = setInterval(() => {
      if (this.cursor >= this.words.length) {
        this.stop();
        return;
      }

      const next = this.words[this.cursor++];
      const last = this.turns[this.turns.length - 1];
      // Replace the last turn so change detection sees a new reference.
      this.turns = [
        ...this.turns.slice(0, -1),
        { ...last, text: last.text ? \`\${last.text} \${next}\` : next }
      ];
    }, 90);
  }

  stop(): void {
    this.streaming = false;
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  // Always clear the interval — otherwise it keeps mutating a destroyed view.
  ngOnDestroy(): void {
    this.stop();
  }
}`;

  scrollerProps: PropEntry[] = [
    { name: 'startPosition', type: "'top' | 'bottom' | 'last-anchor'", default: "'last-anchor'", description: "Where to land when the transcript first renders. 'last-anchor' opens at the newest turn so a long answer starts from its first line; it falls back to 'bottom' when no row is anchored." },
    { name: 'scrollPreviousItemPeek', type: 'number', default: '48', description: 'Pixels of the previous turn kept visible above an anchored turn, so the reader can see what the reply is responding to.' },
    { name: 'threshold', type: 'number', default: '32', description: 'Distance from the bottom, in px, still treated as the live edge. Inside it, new content pulls the view along; outside it, nothing moves.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the frame.' }
  ];

  scrollerEvents: PropEntry[] = [
    { name: 'atBottomChange', type: 'EventEmitter<boolean>', description: 'Emits when the reader arrives at, or leaves, the live edge.' },
    { name: 'scrollToBottom(behavior?)', type: 'method', description: "Jumps to the newest content and resumes following. Defaults to 'smooth'." }
  ];

  itemProps: PropEntry[] = [
    { name: 'scrollAnchor', type: 'boolean', default: 'false', description: "Marks this row as the start of a conversation turn. startPosition=\"last-anchor\" opens at the last anchored row." },
    { name: 'scrollIntoView(behavior?)', type: 'method', description: 'Brings this row into view — use it for jump-to-message from a search result.' }
  ];

  buttonProps: PropEntry[] = [
    { name: 'ariaLabel', type: 'string', default: "'Jump to latest messages'", description: 'Accessible name for the jump control.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the button.' }
  ];

  subComponents: PropEntry[] = [
    { name: 'tolle-message-scroller-viewport', type: 'component', description: 'The scrolling element. Watches its own size and its content\'s size, so it can follow streamed text and hold position when history is prepended.' },
    { name: 'tolle-message-scroller-content', type: 'component', description: 'The transcript itself. Announced with role="log" and aria-live="polite" so streamed replies reach screen readers.' },
    { name: '[tolleMessageScrollerItem]', type: 'directive', description: 'Goes on your own element — it is a directive, not a wrapper component. Registers the row so it can be anchored or scrolled to.' },
    { name: 'tolle-message-scroller-button', type: 'component', description: 'Floating jump-to-latest control. Hidden while the reader is already at the edge.' }
  ];
}
