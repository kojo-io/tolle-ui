import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicFieldComponent } from '../../docs-examples/field/basic-field/basic-field.component';
import { FieldSetExampleComponent } from '../../docs-examples/field/field-set/field-set.component';
import { FieldValidationComponent } from '../../docs-examples/field/field-validation/field-validation.component';


@Component({
  selector: 'app-field-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicFieldComponent,
    FieldSetExampleComponent,
    FieldValidationComponent
  ],
  templateUrl: './field-docs.component.html',
  styleUrl: './field-docs.component.css'
})
export class FieldDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  FieldComponent,
  FieldLabelComponent,
  FieldContentComponent,
  FieldDescriptionComponent,
  FieldErrorComponent,
  FieldGroupComponent,
  FieldSetComponent,
  FieldLegendComponent,
  FieldSeparatorComponent,
  FieldTitleComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [FieldComponent, FieldLabelComponent, FieldDescriptionComponent]
})`;

  basicCode = `<tolle-field>
  <tolle-field-label for="account-email" [required]="true">Email</tolle-field-label>

  <tolle-input-group>
    <tolle-input-group-addon>
      <i class="ri-mail-line"></i>
    </tolle-input-group-addon>
    <tolle-input-group-input
      id="account-email"
      type="email"
      placeholder="ada@example.com"
      ariaDescribedby="account-email-description"
      [(ngModel)]="email" />
  </tolle-input-group>

  <tolle-field-description id="account-email-description">
    We only use this address to send receipts.
  </tolle-field-description>
</tolle-field>`;

  fieldSetCode = `<tolle-field-set>
  <tolle-field-legend>Profile</tolle-field-legend>

  <tolle-field-group>
    <tolle-field>
      <tolle-field-label for="profile-first-name" [required]="true">First name</tolle-field-label>
      <tolle-input-group>
        <tolle-input-group-input
          id="profile-first-name"
          ariaDescribedby="profile-first-name-description"
          [(ngModel)]="firstName"
          name="firstName" />
      </tolle-input-group>
      <tolle-field-description id="profile-first-name-description">
        Shown on your public profile.
      </tolle-field-description>
    </tolle-field>

    <tolle-field-separator />
    <tolle-field-title>Workspace</tolle-field-title>

    <tolle-field>
      <tolle-field-label for="profile-workspace" [required]="true">Slug</tolle-field-label>
      <tolle-input-group>
        <tolle-input-group-addon>
          <tolle-input-group-text>tolle.dev/</tolle-input-group-text>
        </tolle-input-group-addon>
        <tolle-input-group-input
          id="profile-workspace"
          ariaDescribedby="profile-workspace-description"
          [(ngModel)]="workspace"
          name="workspace" />
      </tolle-input-group>
      <tolle-field-description id="profile-workspace-description">
        Lowercase letters, numbers, and dashes.
      </tolle-field-description>
    </tolle-field>
  </tolle-field-group>
</tolle-field-set>`;

  validationCode = `// username = new FormControl('a', {
//   nonNullable: true,
//   validators: [Validators.required, Validators.minLength(3)]
// });

<tolle-field [invalid]="showError">
  <tolle-field-label for="signup-username" [required]="true">Username</tolle-field-label>

  <tolle-input-group [invalid]="showError">
    <tolle-input-group-addon>
      <i class="ri-at-line"></i>
    </tolle-input-group-addon>
    <tolle-input-group-input
      id="signup-username"
      placeholder="ada"
      ariaDescribedby="signup-username-description signup-username-error"
      [formControl]="username" />
  </tolle-input-group>

  <tolle-field-description id="signup-username-description">
    This is how teammates will find you.
  </tolle-field-description>

  <tolle-field-error id="signup-username-error" [errors]="usernameError" />
</tolle-field>`;

  fieldProps: PropEntry[] = [
    { name: 'orientation', type: "'vertical' | 'horizontal' | 'responsive'", default: "'vertical'", description: 'Layout direction. `responsive` stacks on small screens and goes horizontal from the `md` breakpoint up.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Marks the field invalid, turning on destructive styling for the label and descendants.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the field.' }
  ];

  subComponents: PropEntry[] = [
    { name: 'tolle-field-label', type: 'FieldLabelComponent', description: 'Label for the control. Inputs: `for` (id of the control), `required` (appends a * marker), `class`.' },
    { name: 'tolle-field-content', type: 'FieldContentComponent', description: 'Column that groups the control with its description and error text. Inputs: `class`.' },
    { name: 'tolle-field-description', type: 'FieldDescriptionComponent', description: "Helper text below the control. Inputs: `id` — point the control's `aria-describedby` at it — and `class`." },
    { name: 'tolle-field-error', type: 'FieldErrorComponent', description: 'Validation message with `role="alert"`; renders nothing when empty. Inputs: `errors` (string, string[], or a `ValidationErrors`-style object), `id`, `class`.' },
    { name: 'tolle-field-group', type: 'FieldGroupComponent', description: 'Stacks several fields with consistent spacing. Inputs: `class`.' },
    { name: 'tolle-field-set', type: 'FieldSetComponent', description: 'Semantic `<fieldset>` grouping related fields under a legend. Inputs: `class`.' },
    { name: 'tolle-field-legend', type: 'FieldLegendComponent', description: "`<legend>` for a fieldset. Inputs: `variant` ('legend' | 'label', default 'legend'), `class`." },
    { name: 'tolle-field-separator', type: 'FieldSeparatorComponent', description: 'Divider between sections of a form. Inputs: `class`.' },
    { name: 'tolle-field-title', type: 'FieldTitleComponent', description: 'Title for a group of fields that is not a `<legend>`. Inputs: `class`.' }
  ];
}
