import { Component } from '@angular/core';
import { PhoneNumberInputComponent } from '../../../../../../tolle/src/public-api';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-basic-phone-number-input-example',
    standalone: true,
    imports: [PhoneNumberInputComponent, FormsModule, JsonPipe],
    template: `
    <div class="flex flex-col gap-4 max-w-md">
      <tolle-phone-number-input
        [(ngModel)]="phoneNumber"
        placeholder="Enter phone number"
      ></tolle-phone-number-input>
      
      <div class="p-4 rounded-md bg-muted text-xs font-mono overflow-auto">
        Value: {{ phoneNumber | json }}
      </div>
    </div>
  `
})
export class BasicPhoneNumberInputExampleComponent {
    phoneNumber = '';
}
