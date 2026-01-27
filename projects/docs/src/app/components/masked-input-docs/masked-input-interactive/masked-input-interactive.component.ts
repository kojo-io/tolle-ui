import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MaskedInputComponent } from '../../../../../../tolle/src/lib/masked-input.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-masked-input-interactive',
    imports: [
    FormsModule,
    MaskedInputComponent,
    InputComponent,
    CheckboxComponent,
    SelectComponent,
    SelectItemComponent,
    PlaygroundComponent
],
    templateUrl: './masked-input-interactive.component.html'
})
export class MaskedInputInteractiveComponent {
    label = 'Phone Number';
    hint = 'Enter US phone format';
    mask = '(000) 000-0000';
    placeholder = '(555) 555-5555';
    size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
    showPrefix = true;
    showSuffix = false;
    disabled = false;
    readonly = false;
    error = false;
    errorMessage = 'Invalid phone number';

    inputValue = '';

    get playgroundCode(): string {
        const inputs = [
            this.label ? `label="${this.label}"` : '',
            this.mask ? `mask="${this.mask}"` : '',
            this.placeholder ? `placeholder="${this.placeholder}"` : '',
            this.hint ? `hint="${this.hint}"` : '',
            this.size !== 'default' ? `size="${this.size}"` : '',
            this.disabled ? '[disabled]="true"' : '',
            this.readonly ? '[readonly]="true"' : '',
            this.error ? '[error]="true"' : '',
            this.error && this.errorMessage ? `errorMessage="${this.errorMessage}"` : ''
        ].filter(Boolean).join('\n  ');

        return `<tolle-masked-input
  [(ngModel)]="inputValue"${inputs ? '\n  ' + inputs : ''}
>${this.showPrefix ? '\n  <i prefix class="ri-phone-line"></i>' : ''}${this.showSuffix ? '\n  <i suffix class="ri-check-line"></i>' : ''}
</tolle-masked-input>

<!-- Value: {{ inputValue }} -->`;
    }
}
