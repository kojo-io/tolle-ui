import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneNumberInputComponent } from '../../../../../../tolle/src/lib/phone-number-input.component';

@Component({
    selector: 'app-basic-phone-number-input-example',
    standalone: true,
    imports: [CommonModule, PhoneNumberInputComponent],
    template: `
    <div class="w-full max-w-sm">
      <tolle-phone-number-input defaultCountryCode="GH"></tolle-phone-number-input>
    </div>
  `,
})
export class BasicPhoneNumberInputExampleComponent { }
