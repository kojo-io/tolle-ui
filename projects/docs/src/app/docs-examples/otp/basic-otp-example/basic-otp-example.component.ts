import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OtpComponent } from '../../../../../../tolle/src/lib/otp.component';

@Component({
    selector: 'app-basic-otp-example',
    imports: [CommonModule, FormsModule, OtpComponent],
    template: `
    <div class="w-full flex flex-col items-center gap-4">
      <tolle-otp
        [length]="6"
        [auto]="true"
        [(ngModel)]="otpValue"
      ></tolle-otp>

      <div class="text-sm text-muted-foreground mt-4">
        Value: <span class="font-mono text-foreground">{{ otpValue }}</span>
      </div>
    </div>
  `
})
export class BasicOtpExampleComponent {
    otpValue = '';
}
