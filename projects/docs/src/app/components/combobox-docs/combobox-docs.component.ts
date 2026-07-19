import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicComboboxComponent } from '../../docs-examples/combobox/basic-combobox/basic-combobox.component';
import { ComboboxReactiveFormComponent } from '../../docs-examples/combobox/combobox-reactive-form/combobox-reactive-form.component';
import { ComboboxSizesComponent } from '../../docs-examples/combobox/combobox-sizes/combobox-sizes.component';


@Component({
  selector: 'app-combobox-docs',
  standalone: true,
  imports: [
    RouterLink,
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicComboboxComponent,
    ComboboxReactiveFormComponent,
    ComboboxSizesComponent
  ],
  templateUrl: './combobox-docs.component.html',
  styleUrl: './combobox-docs.component.css'
})
export class ComboboxDocsComponent {
  baseService = inject(BaseService);

  installation = `import { ComboboxComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [ComboboxComponent]
})`;

  optionType = `type ComboboxOption = {
  /** Text shown in the list and on the trigger once chosen. */
  label: string;
  /** The value written to the form control. */
  value: any;
  /** Unselectable and skipped by the arrow keys. */
  disabled?: boolean;
  /** Extra terms that should also match this option when searching. */
  keywords?: string[];
};`;

  basicCode = `<span class="text-sm font-medium">Framework</span>

<tolle-combobox
  [options]="frameworks"
  [(ngModel)]="framework"
  placeholder="Select a framework…"
  searchPlaceholder="Search frameworks…"
  ariaLabel="Framework" />

<p>Selected: {{ framework || 'none' }}</p>`;

  basicTs = `import { FormsModule } from '@angular/forms';
import { ComboboxComponent, ComboboxOption } from '@tolle_/tolle-ui';

export class BasicComboboxComponent {
  frameworks: ComboboxOption[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Solid', value: 'solid' },
    { label: 'Ember', value: 'ember', disabled: true }
  ];

  framework: string | null = null;
}`;

  reactiveCode = `<form [formGroup]="form">
  <span class="text-sm font-medium">Currency</span>

  <tolle-combobox
    formControlName="currency"
    [options]="currencies"
    placeholder="Select a currency…"
    searchPlaceholder="Search currencies…"
    ariaLabel="Currency" />

  <tolle-button variant="outline" size="sm" (click)="toggleDisabled()">
    {{ currencyControl.disabled ? 'Enable' : 'Disable' }}
  </tolle-button>

  <pre>{{ form.value | json }}</pre>
</form>`;

  reactiveTs = `import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComboboxComponent, ComboboxOption } from '@tolle_/tolle-ui';

export class ComboboxReactiveFormComponent {
  currencies: ComboboxOption[] = [
    { label: 'US Dollar', value: 'USD' },
    { label: 'Euro', value: 'EUR' },
    { label: 'British Pound', value: 'GBP' },
    { label: 'Ghana Cedi', value: 'GHS' },
    { label: 'Japanese Yen', value: 'JPY' }
  ];

  form = new FormGroup({
    currency: new FormControl<string | null>('USD', Validators.required)
  });

  get currencyControl(): FormControl<string | null> {
    return this.form.controls.currency;
  }

  toggleDisabled(): void {
    if (this.currencyControl.disabled) {
      this.currencyControl.enable();
    } else {
      this.currencyControl.disable();
    }
  }
}`;

  sizesCode = `<tolle-combobox
  size="sm"
  [options]="statuses"
  [(ngModel)]="small"
  placeholder="Status…"
  searchPlaceholder="Try “wip” or “shipped”…"
  emptyMessage="No status matches that."
  ariaLabel="Status (small)" />

<tolle-combobox
  size="default"
  [options]="statuses"
  [(ngModel)]="medium"
  placeholder="Status…"
  searchPlaceholder="Try “wip” or “shipped”…"
  emptyMessage="No status matches that."
  ariaLabel="Status (default)" />

<tolle-combobox
  size="lg"
  [options]="statuses"
  [(ngModel)]="large"
  placeholder="Status…"
  searchPlaceholder="Try “wip” or “shipped”…"
  emptyMessage="No status matches that."
  ariaLabel="Status (large)" />

<tolle-combobox
  [invalid]="true"
  [options]="statuses"
  [(ngModel)]="required"
  placeholder="Status…"
  searchPlaceholder="Try “wip” or “shipped”…"
  emptyMessage="No status matches that."
  ariaLabel="Status (invalid)" />`;

  sizesTs = `statuses: ComboboxOption[] = [
  { label: 'Backlog', value: 'backlog', keywords: ['todo', 'later', 'icebox'] },
  { label: 'In progress', value: 'in-progress', keywords: ['wip', 'active', 'doing'] },
  { label: 'In review', value: 'in-review', keywords: ['pr', 'qa', 'checking'] },
  { label: 'Done', value: 'done', keywords: ['shipped', 'closed', 'complete'] },
  { label: 'Cancelled', value: 'cancelled', keywords: ['dropped', 'abandoned'] }
];`;

  comboboxProps: PropEntry[] = [
    { name: 'options', type: 'ComboboxOption[]', default: '[]', description: 'Options to choose from.' },
    { name: 'placeholder', type: 'string', default: "'Select an option…'", description: 'Text shown on the trigger when nothing is selected.' },
    { name: 'searchPlaceholder', type: 'string', default: "'Search…'", description: 'Placeholder inside the search box.' },
    { name: 'emptyMessage', type: 'string', default: "'No results found.'", description: 'Message shown when the query matches no option.' },
    { name: 'size', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'", description: 'Height and text size of the trigger.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies the destructive border and focus ring.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control. Also set for you by setDisabledState() when a form control is disabled.' },
    { name: 'shouldFilter', type: 'boolean', default: 'true', description: 'Set false to filter the options yourself, e.g. server-side, using searchChange.' },
    { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Close the panel after a value is chosen.' },
    { name: 'placement', type: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", default: "'bottom-start'", description: 'Where the panel opens relative to the trigger. Flips automatically when there is not enough room.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name when there is no associated visible label.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the trigger via cn() (last-wins).' }
  ];

  comboboxOutputs: PropEntry[] = [
    { name: 'valueChange', type: 'EventEmitter<any>', description: 'Emitted with the chosen value whenever the selection changes.' },
    { name: 'searchChange', type: 'EventEmitter<string>', description: 'Emitted with the query text as the user searches — pair with [shouldFilter]="false" for server-side search.' },
    { name: 'opened', type: 'EventEmitter<void>', description: 'Emitted when the panel opens.' },
    { name: 'closed', type: 'EventEmitter<void>', description: 'Emitted when the panel closes.' }
  ];
}
