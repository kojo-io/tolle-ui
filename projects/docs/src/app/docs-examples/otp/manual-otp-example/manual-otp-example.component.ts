import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OtpComponent } from '../../../../../../tolle/src/lib/otp.component';
import { OtpGroupComponent } from '../../../../../../tolle/src/lib/otp-group.component';
import { OtpSlotComponent } from '../../../../../../tolle/src/lib/otp-slot.component';

@Component({
    selector: 'app-manual-otp-example',
    standalone: true,
    imports: [CommonModule, FormsModule, OtpComponent, OtpGroupComponent, OtpSlotComponent],
    template: `
    <div class="w-full flex flex-col items-center gap-4">
      <tolle-otp #otp [length]="6" [(ngModel)]="otpValue">
        <tolle-otp-group>
          <tolle-otp-slot [isFirst]="true" [char]="otpValue[0]" [isActive]="otp.isFocused && otpValue.length === 0"></tolle-otp-slot>
          <tolle-otp-slot [char]="otpValue[1]" [isActive]="otp.isFocused && otpValue.length === 1"></tolle-otp-slot>
          <tolle-otp-slot [isLast]="true" [char]="otpValue[2]" [isActive]="otp.isFocused && otpValue.length === 2"></tolle-otp-slot>
        </tolle-otp-group>

        <div class="px-2 text-muted-foreground">-</div>

        <tolle-otp-group>
          <tolle-otp-slot [isFirst]="true" [char]="otpValue[3]" [isActive]="otp.isFocused && otpValue.length === 3"></tolle-otp-slot>
          <tolle-otp-slot [char]="otpValue[4]" [isActive]="otp.isFocused && otpValue.length === 4"></tolle-otp-slot>
          <tolle-otp-slot [isLast]="true" [char]="otpValue[5]" [isActive]="otp.isFocused && otpValue.length === 5"></tolle-otp-slot>
        </tolle-otp-group>
      </tolle-otp>

      <div class="text-sm text-muted-foreground mt-4">
        Value: <span class="font-mono text-foreground">{{ otpValue }}</span>
      </div>
    </div>
  `
})
export class ManualOtpExampleComponent {
    otpValue = '';
}
