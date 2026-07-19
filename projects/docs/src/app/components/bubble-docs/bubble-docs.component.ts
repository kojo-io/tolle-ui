import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicBubbleComponent } from '../../docs-examples/bubble/basic-bubble/basic-bubble.component';
import { BubbleActionsExampleComponent } from '../../docs-examples/bubble/bubble-actions/bubble-actions.component';
import { CollapsibleBubbleComponent } from '../../docs-examples/bubble/collapsible-bubble/collapsible-bubble.component';


@Component({
  selector: 'app-bubble-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicBubbleComponent,
    BubbleActionsExampleComponent,
    CollapsibleBubbleComponent
  ],
  templateUrl: './bubble-docs.component.html',
  styleUrl: './bubble-docs.component.css'
})
export class BubbleDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  BubbleComponent,
  BubbleActionsComponent,
  BubbleReactionsComponent,
  BubbleReaction
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [BubbleComponent, BubbleActionsComponent, BubbleReactionsComponent]
})`;

  basicCode = `<tolle-bubble variant="default" align="start">Default — a bordered card surface.</tolle-bubble>
<tolle-bubble variant="muted" align="start">Muted — for quieter, secondary turns.</tolle-bubble>
<tolle-bubble variant="outline" align="start">Outline — transparent, border only.</tolle-bubble>
<tolle-bubble variant="primary" align="end">Primary — the outgoing side.</tolle-bubble>

<tolle-bubble size="sm">Small</tolle-bubble>
<tolle-bubble size="default">Default</tolle-bubble>
<tolle-bubble size="lg">Large</tolle-bubble>`;

  actionsCode = `<tolle-bubble align="start">
  The parser now short-circuits on the first unbalanced brace…

  <tolle-bubble-actions>
    <button type="button" (click)="copy()">Copy</button>
    <button type="button">Retry</button>
  </tolle-bubble-actions>
</tolle-bubble>

<tolle-bubble-reactions [reactions]="reactions" (react)="toggle($event)" />`;

  actionsTsCode = `reactions: BubbleReaction[] = [
  { emoji: '👍', count: 3, reacted: true },
  { emoji: '🎉', count: 1 },
  { emoji: '👀', count: 2 }
];

toggle(reaction: BubbleReaction): void {
  reaction.reacted = !reaction.reacted;
  reaction.count = (reaction.count ?? 0) + (reaction.reacted ? 1 : -1);
}`;

  collapsibleCode = `<tolle-bubble
  align="start"
  [collapsible]="true"
  [collapsed]="collapsed"
  collapsedHeight="5rem"
  expandLabel="Read the full answer"
  collapseLabel="Collapse"
  (collapsedChange)="collapsed = $event">
  A migration runs in three phases…
</tolle-bubble>

<tolle-bubble variant="primary" align="end" [interactive]="true" (bubbleClick)="opened = opened + 1">
  Interactive — click or press Enter
</tolle-bubble>`;

  bubbleProps: PropEntry[] = [
    { name: 'variant', type: "'default' | 'primary' | 'muted' | 'outline'", default: "'default'", description: 'Visual style of the surface.' },
    { name: 'align', type: "'start' | 'end'", default: "'start'", description: 'Which edge the bubble hangs off. Squares the matching bottom corner so it reads as a tail.' },
    { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Padding and text scale of the surface.' },
    { name: 'collapsible', type: 'boolean', default: 'false', description: 'Shows a show-more / show-less toggle for long content.' },
    { name: 'collapsed', type: 'boolean', default: 'true', description: 'Whether the content is currently clamped. Only has an effect with collapsible.' },
    { name: 'collapsedHeight', type: 'string', default: "'6rem'", description: 'Max height of the clamped content, as a CSS length.' },
    { name: 'expandLabel', type: 'string', default: "'Show more'", description: 'Label of the toggle while the content is clamped.' },
    { name: 'collapseLabel', type: 'string', default: "'Show less'", description: 'Label of the toggle while the content is expanded.' },
    { name: 'interactive', type: 'boolean', default: 'false', description: 'Makes the whole surface a keyboard-focusable trigger that emits bubbleClick.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the surface.' }
  ];

  bubbleEvents: PropEntry[] = [
    { name: 'collapsedChange', type: 'EventEmitter<boolean>', description: 'Emits the new collapsed state when the show-more toggle is pressed.' },
    { name: 'bubbleClick', type: 'EventEmitter<Event>', description: 'Emits when an interactive bubble is activated by click, Enter, or Space.' }
  ];

  actionsProps: PropEntry[] = [
    { name: 'alwaysVisible', type: 'boolean', default: 'false', description: 'Keeps the row permanently visible instead of revealing it on hover or focus.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the row.' }
  ];

  reactionsProps: PropEntry[] = [
    { name: 'reactions', type: 'BubbleReaction[]', default: '[]', description: 'Reaction chips to render, in display order.' },
    { name: 'react', type: 'EventEmitter<BubbleReaction>', description: 'Emits the reaction whose chip was clicked.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the row.' }
  ];

  reactionType: PropEntry[] = [
    { name: 'emoji', type: 'string', description: 'The emoji character to display.' },
    { name: 'count', type: 'number', description: 'How many people reacted with it. Omitted or 0 hides the tally.' },
    { name: 'reacted', type: 'boolean', description: 'Whether the current user is one of them; highlights the chip.' }
  ];
}
