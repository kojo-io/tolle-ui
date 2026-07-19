import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicSuggestionsComponent } from '../../docs-examples/suggestion/basic-suggestions/basic-suggestions.component';
import { SuggestionVariantsComponent } from '../../docs-examples/suggestion/suggestion-variants/suggestion-variants.component';
import { SuggestionScrollingComponent } from '../../docs-examples/suggestion/suggestion-scrolling/suggestion-scrolling.component';


@Component({
  selector: 'app-suggestion-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicSuggestionsComponent,
    SuggestionVariantsComponent,
    SuggestionScrollingComponent
  ],
  templateUrl: './suggestion-docs.component.html',
  styleUrl: './suggestion-docs.component.css'
})
export class SuggestionDocsComponent {
  baseService = inject(BaseService);

  installation = `import { SuggestionsComponent, SuggestionComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [SuggestionsComponent, SuggestionComponent]
})`;

  anatomy = `<tolle-suggestions (selected)="send($event)">
  <tolle-suggestion value="…">Label</tolle-suggestion>
</tolle-suggestions>`;

  basicCode = `<tolle-suggestions ariaLabel="Follow-up prompts" (selected)="onSelected($event)">
  @for (prompt of prompts; track prompt) {
    <tolle-suggestion [value]="prompt">{{ prompt }}</tolle-suggestion>
  }
</tolle-suggestions>

<p>Picked: {{ picked || 'nothing yet' }}</p>`;

  basicTs = `export class BasicSuggestionsComponent {
  prompts = [
    'Summarise this thread',
    'Draft a reply',
    'Find the related issue',
    'Explain the trade-offs'
  ];

  picked: string | null = null;

  onSelected(value: string): void {
    this.picked = value;
  }
}`;

  variantsCode = `<tolle-suggestions ariaLabel="Suggestion variants">
  <tolle-suggestion value="outline" variant="outline">Outline</tolle-suggestion>
  <tolle-suggestion value="secondary" variant="secondary">Secondary</tolle-suggestion>
  <tolle-suggestion value="ghost" variant="ghost">Ghost</tolle-suggestion>
  <tolle-suggestion value="disabled" [disabled]="true">Disabled</tolle-suggestion>
</tolle-suggestions>

<tolle-suggestions ariaLabel="Suggestions with icons" gap="lg">
  <tolle-suggestion value="search" icon="ri-search-line">Search the docs</tolle-suggestion>
  <tolle-suggestion value="code" icon="ri-code-s-slash-line" variant="secondary">Write a test</tolle-suggestion>
</tolle-suggestions>`;

  scrollingCode = `<tolle-suggestions ariaLabel="Follow-up prompts">
  @for (item of followUps; track item.value) {
    <tolle-suggestion [value]="item.value" [icon]="item.icon" (selected)="onPicked($event)">
      {{ item.label }}
    </tolle-suggestion>
  }
</tolle-suggestions>`;

  suggestionsProps: PropEntry[] = [
    { name: 'gap', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Spacing between the pills.' },
    { name: 'ariaLabel', type: 'string', default: "'Suggestions'", description: 'Accessible name for the row.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the row (last-wins).' }
  ];

  suggestionsOutputs: PropEntry[] = [
    { name: 'selected', type: 'EventEmitter<string>', description: "Emitted with the value of whichever suggestion in the row was picked, so you can listen in one place instead of binding every pill." }
  ];

  suggestionProps: PropEntry[] = [
    { name: 'value', type: 'string', default: "''", description: 'Value emitted when the pill is picked. Can differ from the projected label.' },
    { name: 'variant', type: "'outline' | 'secondary' | 'ghost'", default: "'outline'", description: 'Visual style of the pill.' },
    { name: 'size', type: "'sm' | 'default' | 'lg'", default: "'default'", description: 'Size of the pill.' },
    { name: 'icon', type: 'string', default: "''", description: 'Remixicon class shown before the label.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks interaction with the pill.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name, when the projected label is not descriptive enough.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the pill (last-wins).' }
  ];

  suggestionOutputs: PropEntry[] = [
    { name: 'selected', type: 'EventEmitter<string>', description: "Emitted with this pill's value when it is picked." }
  ];
}
