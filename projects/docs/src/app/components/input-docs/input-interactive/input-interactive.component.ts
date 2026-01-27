import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';

@Component({
    selector: 'app-input-interactive',
    imports: [
    FormsModule,
    InputComponent,
    PlaygroundComponent,
    SelectComponent,
    SelectItemComponent,
    CheckboxComponent
],
    templateUrl: './input-interactive.component.html'
})
export class InputInteractiveComponent {
    label = 'Email';
    placeholder = 'name@example.com';
    hint = 'This is a hint text.';
    errorMessage = 'Invalid email address.';
    value = '';
    type = 'email';
    size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
    disabled = false;
    readonly = false;
    error = false;

    get playgroundCode() {
        return `<tolle-input
  label="${this.label}"
  placeholder="${this.placeholder}"
  type="${this.type}"
  ${this.value ? `value="${this.value}"\n` : ''}  ${this.hint && !this.error ? `hint="${this.hint}"\n` : ''}  ${this.error ? `[error]="true"\n  errorMessage="${this.errorMessage}"\n` : ''}  ${this.disabled ? `[disabled]="true"\n` : ''}  ${this.readonly ? `[readonly]="true"\n` : ''}  ${this.size !== 'default' ? `size="${this.size}"` : ''}
></tolle-input>`;
    }
}
