import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicModelSelectorComponent } from '../../docs-examples/model-selector/basic-model-selector/basic-model-selector.component';
import { ModelSelectorGroupedComponent } from '../../docs-examples/model-selector/model-selector-grouped/model-selector-grouped.component';
import { ModelSelectorVariantsComponent } from '../../docs-examples/model-selector/model-selector-variants/model-selector-variants.component';


@Component({
  selector: 'app-model-selector-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicModelSelectorComponent,
    ModelSelectorGroupedComponent,
    ModelSelectorVariantsComponent
  ],
  templateUrl: './model-selector-docs.component.html',
  styleUrl: './model-selector-docs.component.css'
})
export class ModelSelectorDocsComponent {
  baseService = inject(BaseService);

  installation = `import { ModelSelectorComponent, ModelOption } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [FormsModule, ModelSelectorComponent]
})`;

  anatomy = `<tolle-model-selector [models]="models" [(ngModel)]="modelId" />`;

  optionType = `export type ModelOption = {
  /** Stable identifier written back through the form control. */
  id: string;
  /** Human-readable model name. */
  name: string;
  /** Vendor or family; when present the list is grouped by it. */
  provider?: string;
  /** One-line summary shown under the name. */
  description?: string;
  /** Short tag rendered as a pill, e.g. "new" or "preview". */
  badge?: string;
  /** Prevents the option from being chosen. */
  disabled?: boolean;
};`;

  basicCode = `<tolle-model-selector [models]="models" [(ngModel)]="modelId" />`;

  basicTs = `import { FormsModule } from '@angular/forms';
import { ModelOption } from '@tolle_/tolle-ui';

export class BasicModelSelectorComponent {
  // Grouped by \`provider\` — models sharing one land under a single heading.
  readonly models: ModelOption[] = [
    { id: 'opus-4', name: 'Opus 4', provider: 'Anthropic', description: 'Deepest reasoning' },
    { id: 'sonnet-4', name: 'Sonnet 4', provider: 'Anthropic', description: 'Balanced speed and quality' },
    { id: 'haiku-4', name: 'Haiku 4', provider: 'Anthropic', description: 'Fastest, lowest cost' }
  ];

  modelId: string | null = 'sonnet-4';
}`;

  groupedCode = `<form [formGroup]="form">
  <tolle-model-selector
    formControlName="model"
    [models]="models"
    [showProviderOnTrigger]="true"
    searchPlaceholder="Search all providers…"
    ariaLabel="Model" />
</form>`;

  groupedTs = `export class ModelSelectorGroupedComponent {
  private readonly fb = inject(FormBuilder);

  // Group order follows first appearance, and so does the order within a group.
  readonly models: ModelOption[] = [
    { id: 'opus-4', name: 'Opus 4', provider: 'Anthropic', description: 'Deepest reasoning', badge: 'new' },
    { id: 'sonnet-4', name: 'Sonnet 4', provider: 'Anthropic', description: 'Balanced speed and quality' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Long context window' },
    { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'Google', description: 'Not enabled on this plan', disabled: true },
    { id: 'llama-70b', name: 'Llama 70B', provider: 'Meta', description: 'Open weights', badge: 'preview' }
  ];

  readonly form = this.fb.nonNullable.group({
    model: this.fb.control<string | null>('gemini-pro')
  });
}`;

  variantsCode = `<tolle-model-selector
  variant="ghost" size="xs"
  [models]="models" [searchable]="false"
  [(ngModel)]="modelId" (modelChange)="onModelChange($event)" />

<tolle-model-selector size="sm" [models]="models" [(ngModel)]="modelId" icon="ri-cpu-line" />

<tolle-model-selector [models]="models" [disabled]="true" [ngModel]="modelId" />`;

  selectorProps: PropEntry[] = [
    { name: 'models', type: 'ModelOption[]', default: '[]', description: 'Models to choose from; grouped by provider when that field is set.' },
    { name: 'placeholder', type: 'string', default: "'Select a model'", description: 'Text shown on the trigger when nothing is selected.' },
    { name: 'searchPlaceholder', type: 'string', default: "'Search models…'", description: 'Placeholder inside the search box.' },
    { name: 'emptyMessage', type: 'string', default: "'No models found.'", description: 'Message shown when the query matches no model.' },
    { name: 'searchable', type: 'boolean', default: 'true', description: 'Shows the search box above the list.' },
    { name: 'showProviderOnTrigger', type: 'boolean', default: 'false', description: "Prefixes the selected model's name with its provider on the trigger." },
    { name: 'size', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'", description: 'Height and text size of the trigger.' },
    { name: 'variant', type: "'default' | 'ghost'", default: "'default'", description: 'Visual style of the trigger.' },
    { name: 'icon', type: 'string', default: "'ri-sparkling-line'", description: 'Remixicon class shown at the start of the trigger. Pass an empty string to drop it.' },
    { name: 'placement', type: "'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'", default: "'bottom-start'", description: 'Where the list opens relative to the trigger.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control. Also set by a reactive form via setDisabledState.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name for the trigger and list.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the trigger (last-wins).' }
  ];

  selectorOutputs: PropEntry[] = [
    { name: 'valueChange', type: 'EventEmitter<string | null>', description: "Emitted with the chosen model's id whenever the selection changes." },
    { name: 'modelChange', type: 'EventEmitter<ModelOption | null>', description: 'Emitted with the whole ModelOption whenever the selection changes.' }
  ];
}
