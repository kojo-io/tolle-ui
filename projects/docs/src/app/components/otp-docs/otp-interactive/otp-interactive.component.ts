import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { OtpComponent } from '../../../../../../tolle/src/lib/otp.component';
import { OtpSlotComponent } from '../../../../../../tolle/src/lib/otp-slot.component';
import { OtpGroupComponent } from '../../../../../../tolle/src/lib/otp-group.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
  selector: 'app-otp-interactive',
  standalone: true,
  imports: [
    FormsModule,
    OtpComponent,
    OtpSlotComponent,
    OtpGroupComponent,
    InputComponent,
    CheckboxComponent,
    PlaygroundComponent
  ],
  templateUrl: './otp-interactive.component.html'
})
export class OtpInteractiveComponent {
  protected readonly Array = Array;
  length = 6;
  disabled = false;
  auto = true;

  otpValue = '';

  get playgroundCode(): string {
    const inputs = [
      this.length !== 6 ? `[length]="${this.length}"` : '',
      this.disabled ? '[disabled]="true"' : '',
      this.auto ? '[auto]="true"' : ''
    ].filter(Boolean).join('\n  ');

    if (this.auto) {
      return `<tolle-otp
  [(ngModel)]="otpValue"${inputs ? '\n  ' + inputs : ''}
></tolle-otp>`;
    }

    return `<tolle-otp #otp="tolleOtp"
  [(ngModel)]="otpValue"${inputs ? '\n  ' + inputs : ''}
>
  <tolle-otp-group>
    <tolle-otp-slot 
      *ngFor="let _ of [0,1,2]; let i = index"
      [char]="otpValue[i]"
      [isActive]="otp.isFocused() && otpValue.length === i"
      [isFirst]="i === 0"
      [isLast]="i === 2"
    ></tolle-otp-slot>
  </tolle-otp-group>
  <div class="px-2">-</div>
  <tolle-otp-group>
    <tolle-otp-slot 
      *ngFor="let _ of [0,1,2]; let i = index"
      [char]="otpValue[i + 3]"
      [isActive]="otp.isFocused() && otpValue.length === i + 3"
      [isFirst]="i === 0"
      [isLast]="i === 2"
    ></tolle-otp-slot>
  </tolle-otp-group>
</tolle-otp>`;
  }
}
