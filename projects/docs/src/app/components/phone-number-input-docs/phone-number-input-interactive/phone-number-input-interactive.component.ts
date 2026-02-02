import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhoneNumberInputComponent } from '../../../../../../tolle/src/public-api';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';

@Component({
    selector: 'app-phone-number-input-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        PhoneNumberInputComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent,
        SwitchComponent,
        InputComponent
    ],
    templateUrl: './phone-number-input-interactive.component.html'
})
export class PhoneNumberInputInteractiveComponent {
    size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
    dataType: 'NumberOnly' | 'FullObject' = 'FullObject';
    mask = '(000) 000-0000';
    disabled = false;
    readonly = false;

    phoneNumber = '';

    get playgroundCode(): string {
        return `<tolle-phone-number-input
  [(ngModel)]="phoneNumber"
  [size]="${this.size}"
  [dataType]="${this.dataType}"
  [mask]="${this.mask}"
  [disabled]="${this.disabled}"
  [readonly]="${this.readonly}"
></tolle-phone-number-input>`;
    }
}
