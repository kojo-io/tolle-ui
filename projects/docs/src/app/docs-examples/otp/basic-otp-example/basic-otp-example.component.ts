import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { OtpComponent } from '../../../../../../tolle/src/lib/otp.component';

@Component({
  selector: 'app-basic-otp-example',
  imports: [FormsModule, OtpComponent],
  template: `
    <div class="flex w-full flex-col items-center gap-4">
      <tolle-otp [length]="6" [auto]="true" [(ngModel)]="otpValue"></tolle-otp>

      <div class="mt-4 text-sm text-muted-foreground">
        Value: <span class="font-mono text-foreground">{{ otpValue }}</span>
      </div>
    </div>
  `,
})
export class BasicOtpExampleComponent {
  otpValue = '';
}
