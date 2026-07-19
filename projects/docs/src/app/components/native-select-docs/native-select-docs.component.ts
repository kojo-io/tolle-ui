import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicNativeSelectComponent } from '../../docs-examples/native-select/basic-native-select/basic-native-select.component';
import { NativeSelectSizesComponent } from '../../docs-examples/native-select/native-select-sizes/native-select-sizes.component';
import { NativeSelectFormsComponent } from '../../docs-examples/native-select/native-select-forms/native-select-forms.component';


@Component({
  selector: 'app-native-select-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicNativeSelectComponent,
    NativeSelectSizesComponent,
    NativeSelectFormsComponent
  ],
  templateUrl: './native-select-docs.component.html',
  styleUrl: './native-select-docs.component.css'
})
export class NativeSelectDocsComponent {
  baseService = inject(BaseService);

  installation = `import { NativeSelectComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [NativeSelectComponent]
})`;

  basicCode = `<tolle-native-select
  [options]="fruits"
  placeholder="Select a fruit"
  ariaLabel="Fruit" />`;

  sizesCode = `<tolle-native-select [options]="options" size="xs" placeholder="Extra small" />
<tolle-native-select [options]="options" size="sm" placeholder="Small" />
<tolle-native-select [options]="options" size="default" placeholder="Default" />
<tolle-native-select [options]="options" size="lg" placeholder="Large" />
<tolle-native-select [options]="options" [invalid]="true" placeholder="Invalid" />
<tolle-native-select [options]="options" [disabled]="true" placeholder="Disabled" />`;

  formsCode = `quantities: NativeSelectOption[] = [
  { label: '1 seat', value: 1 },
  { label: '2 seats', value: 2 },
  { label: '5 seats', value: 5 }
];

seats: number | null = 2;`;

  formsTemplateCode = `<tolle-native-select
  id="seats"
  [options]="quantities"
  [(ngModel)]="seats"
  placeholder="How many seats?" />`;

  nativeSelectProps: PropEntry[] = [
    { name: 'id', type: 'string', default: 'auto-generated', description: 'Id applied to the underlying select; pair it with a tolle-label.' },
    { name: 'options', type: 'NativeSelectOption[]', default: '[]', description: 'Options to render. Omit and project <option> elements for custom markup.' },
    { name: 'placeholder', type: 'string', default: "''", description: 'Non-selectable prompt shown when no value is set.' },
    { name: 'size', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'", description: 'Height and text size of the control.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies the destructive border and sets aria-invalid.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name when there is no associated visible label.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the select.' }
  ];

  nativeSelectEvents: PropEntry[] = [
    { name: 'valueChange', type: 'EventEmitter<any>', description: 'Fired with the newly selected value whenever the user picks an option.' }
  ];
}
