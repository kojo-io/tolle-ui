import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhoneNumberInputComponent } from '../../../../../../tolle/src/lib/phone-number-input.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-phone-number-input-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        PhoneNumberInputComponent,
        SelectComponent,
        SelectItemComponent,
        SwitchComponent,
        PlaygroundComponent
    ],
    templateUrl: './phone-number-input-interactive.component.html'
})
export class PhoneNumberInputInteractiveComponent {
    value: any = null;
    size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
    dataType: 'NumberOnly' | 'FullObject' = 'FullObject';
    label = 'Phone Number';
    hint = 'Enter your phone number starting with your country code';
    error = false;
    errorMessage = 'Invalid phone number';
    disabled = false;
    readonly = false;

    get playgroundCode(): string {
        return `<tolle-phone-number-input
  [(ngModel)]="value"
  [label]="${this.label ? `'${this.label}'` : 'null'}"
  [hint]="${this.hint ? `'${this.hint}'` : 'null'}"
  [error]="${this.error}"
  [errorMessage]="${this.error ? `'${this.errorMessage}'` : 'null'}"
  size="${this.size}"
  dataType="${this.dataType}"
  [disabled]="${this.disabled}"
  [readonly]="${this.readonly}"
></tolle-phone-number-input>`;
    }
}
