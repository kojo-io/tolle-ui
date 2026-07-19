import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicInlineCitationComponent } from '../../docs-examples/inline-citation/basic-inline-citation/basic-inline-citation.component';
import { InlineCitationQuoteExampleComponent } from '../../docs-examples/inline-citation/inline-citation-quote/inline-citation-quote.component';
import { InlineCitationVariantsComponent } from '../../docs-examples/inline-citation/inline-citation-variants/inline-citation-variants.component';


@Component({
  selector: 'app-inline-citation-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicInlineCitationComponent,
    InlineCitationQuoteExampleComponent,
    InlineCitationVariantsComponent
  ],
  templateUrl: './inline-citation-docs.component.html',
  styleUrl: './inline-citation-docs.component.css'
})
export class InlineCitationDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  InlineCitationComponent,
  InlineCitationCardComponent,
  InlineCitationQuoteComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [InlineCitationComponent, InlineCitationCardComponent, InlineCitationQuoteComponent]
})`;

  anatomy = `The model was released in March.<tolle-inline-citation [index]="1">
  <tolle-inline-citation-card
    title="Release notes"
    url="https://example.com/notes"
    snippet="Shipped on 14 March." />
</tolle-inline-citation>`;

  basicCode = `<p>
  Angular's signal-based reactivity landed as a developer preview in v16 and was marked stable
  in v17.<tolle-inline-citation [index]="1">
    <tolle-inline-citation-card
      title="Angular — Signals"
      url="https://angular.dev/guide/signals"
      snippet="Signals are a reactive primitive that notify consumers when their value changes." />
  </tolle-inline-citation>
</p>`;

  quoteCode = `<tolle-inline-citation [index]="1" placement="bottom">
  <tolle-inline-citation-card title="Release notes — 2.0" url="https://example.com/blog/release-2-0">
    <tolle-inline-citation-quote cite="Ada Osei, release notes">
      We wanted the defaults to be the thing you ship, not the thing you override.
    </tolle-inline-citation-quote>
  </tolle-inline-citation-card>
</tolle-inline-citation>`;

  variantsCode = `<tolle-inline-citation [index]="3" variant="default" size="sm" placement="right"
  ariaLabel="Source for the marker example">
  <tolle-inline-citation-card
    title="MDN — sup element"
    url="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sup" />
</tolle-inline-citation>

<!-- …and the same with variant="muted" and variant="subtle" -->`;

  citationProps: PropEntry[] = [
    { name: 'index', type: 'number | string', default: '1', description: 'Number rendered in the superscript marker. Strings let you use symbols such as ★ or a.' },
    { name: 'variant', type: "'default' | 'muted' | 'subtle'", default: "'default'", description: 'Colour treatment of the marker.' },
    { name: 'size', type: "'sm' | 'default'", default: "'default'", description: 'Text size of the marker.' },
    { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Side of the marker the source card opens on.' },
    { name: 'openDelay', type: 'number', default: '150', description: 'Milliseconds to wait before opening the card.' },
    { name: 'closeDelay', type: 'number', default: '200', description: 'Milliseconds to wait before closing the card.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible label for the marker; falls back to "Citation {index}".' },
    { name: 'cardClass', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the hover card panel (last-wins).' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the marker (last-wins).' }
  ];

  cardProps: PropEntry[] = [
    { name: 'title', type: 'string', default: "''", description: 'Title of the cited source.' },
    { name: 'url', type: 'string', default: "''", description: 'Link to the cited source. Rendered without its scheme and opened in a new tab; omit to hide the link.' },
    { name: 'snippet', type: 'string', default: "''", description: 'Short excerpt from the source, clamped to three lines.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the card (last-wins).' }
  ];

  quoteProps: PropEntry[] = [
    { name: 'cite', type: 'string', default: "''", description: 'Attribution shown beneath the quote; omit to hide the footer.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the quote (last-wins).' }
  ];
}
