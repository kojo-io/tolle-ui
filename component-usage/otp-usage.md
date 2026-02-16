# OTP Component Usage Guide

## Overview

The OTP component provides a one-time password input field with auto-focus and character slot management. It's designed for SMS verification and two-factor authentication flows.

## Import

```typescript
import { OtpComponent, OtpGroupComponent, OtpSlotComponent } from '@tolle_/tolle-ui';
```

## Components

### OtpComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `length` | `number` | `6` | OTP length |
| `disabled` | `boolean` | `false` | Disabled state |
| `auto` | `boolean` | `false` | Auto-fill mode |
| `ngModel` | `string` | `null` | Two-way binding value |
| `formControlName` | `string` | - | Form control name |

### OtpGroupComponent

Container for OTP slots.

### OtpSlotComponent

Individual OTP character slot.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `char` | `string` | `''` | Character to display |
| `isActive` | `boolean` | `false` | Whether this slot is active |
| `isFirst` | `boolean` | `false` | First slot indicator |
| `isLast` | `boolean` | `false` | Last slot indicator |
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Simple OTP (6 digits)

```html
<tolle-otp [(ngModel)]="otpValue" />
<p>OTP: {{ otpValue }}</p>
```

### Disabled OTP

```html
<tolle-otp [disabled]="true" />
```

### OTP with Custom Length

```html
<tolle-otp [(ngModel)]="otpValue" [length]="4" />
<!-- For 4-digit PIN -->
```

### OTP with Auto-focus

```html
<tolle-otp [(ngModel)]="otpValue" [auto]="true" />
```

## OTP with Error State

```html
<tolle-otp
  [(ngModel)]="otpValue"
  [length]="6"
  [error]="!isValid && form.submitted"
  errorMessage="Invalid OTP code"
/>
<p class="text-xs text-destructive" *ngIf="!isValid && form.submitted && otpValue.length === 6">
  Please enter a valid 6-digit code
</p>
```

## OTP with ngModel

### Reactive Form

```typescript
this.form = this.fb.group({
  otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
});
```

```html
<form [formGroup]="form">
  <tolle-otp formControlName="otp" [length]="6" />
  <button
    tolleButton
    [disabled]="form.invalid"
    (click)="submitOtp()"
  >
    Verify
  </button>
</form>
```

### Template-driven Form

```html
<form>
  <tolle-otp
    [(ngModel)]="otp"
    name="otp"
    required
    [length]="6"
  />
  <p class="text-xs text-destructive" *ngIf="form.submitted && !otp">
    OTP is required
  </p>
</form>
```

## OTP with Manual Slot Control

### Using OtpGroup and OtpSlot

```html
<tolle-otp-group>
  <tolle-otp-slot [char]="otp[0]" [isActive]="activeSlot === 0" [isFirst]="true" />
  <tolle-otp-slot [char]="otp[1]" [isActive]="activeSlot === 1" />
  <tolle-otp-slot [char]="otp[2]" [isActive]="activeSlot === 2" />
  <tolle-otp-slot [char]="otp[3]" [isActive]="activeSlot === 3" />
  <tolle-otp-slot [char]="otp[4]" [isActive]="activeSlot === 4" />
  <tolle-otp-slot [char]="otp[5]" [isActive]="activeSlot === 5" [isLast]="true" />
</tolle-otp-group>
```

## OTP with Resend Timer

```html
<div class="space-y-2">
  <tolle-otp [(ngModel)]="otpValue" [length]="6" />

  <div class="flex items-center justify-between">
    <p class="text-xs text-muted-foreground">
      Enter the 6-digit code sent to {{ phoneNumber }}
    </p>

    <button
      tolleButton
      variant="ghost"
      size="sm"
      [disabled]="timeLeft > 0"
      (click)="resendOtp()"
    >
      {{ timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend code' }}
    </button>
  </div>
</div>
```

### Component Logic

```typescript
timeLeft = 0;
timer: any;

resendOtp() {
  // Send OTP logic here
  this.startTimer();
}

startTimer() {
  this.timeLeft = 60;
  clearInterval(this.timer);
  this.timer = setInterval(() => {
    if (this.timeLeft > 0) {
      this.timeLeft--;
    } else {
      clearInterval(this.timer);
    }
  }, 1000);
}
```

## OTP with Auto-submit

```html
<tolle-otp
  [(ngModel)]="otpValue"
  [length]="6"
  (ngModelChange)="onOtpChange($event)"
/>

<!-- Component method -->
onOtpChange(value: string) {
  if (value.length === 6) {
    // Auto-submit when full
    this.submitOtp();
  }
}
```

## OTP in Modal

```html
<tolle-alert-dialog>
  <tolle-alert-dialog-trigger>
    <button>Verify Phone</button>
  </tolle-alert-dialog-trigger>

  <tolle-alert-dialog-portal>
    <tolle-alert-dialog-content class="sm:max-w-md">
      <tolle-alert-dialog-header>
        <tolle-alert-dialog-title>Phone Verification</tolle-alert-dialog-title>
        <tolle-alert-dialog-description>
          Enter the 6-digit code sent to +1 (555) 123-4567
        </tolle-alert-dialog-description>
      </tolle-alert-dialog-header>

      <tolle-alert-dialog-content>
        <tolle-otp [(ngModel)]="otpValue" [length]="6" />
      </tolle-alert-dialog-content>

      <tolle-alert-dialog-footer>
        <tolle-alert-dialog-cancel>
          <button variant="outline">Cancel</button>
        </tolle-alert-dialog-cancel>
        <tolle-alert-dialog-action>
          <button (click)="verifyOtp()">Verify</button>
        </tolle-alert-dialog-action>
      </tolle-alert-dialog-footer>
    </tolle-alert-dialog-content>
  </tolle-alert-dialog-portal>
</tolle-alert-dialog>
```

## OTP with Custom Styling

```html
<tolle-otp
  [(ngModel)]="otpValue"
  class="gap-2"
  style="
    --slot-height: 50px;
    --slot-width: 50px;
  "
/>
```

### Custom CSS for Slots

```css
/* Custom slot styling */
.tolle-otp-slot {
  height: 50px;
  width: 50px;
  font-size: 24px;
  font-weight: bold;
}
```

## OTP with Input Mode

### Numeric Keyboard

```html
<tolle-otp
  [(ngModel)]="otpValue"
  [length]="6"
  [inputmode]="'numeric'"
/>
```

## OTP with Validation

```html
<div class="space-y-2">
  <tolle-otp
    [(ngModel)]="otpValue"
    [length]="6"
    [error]="hasError"
  />

  <div class="flex gap-2">
    <button
      tolleButton
      size="sm"
      (click)="validateOtp()"
    >
      Validate
    </button>
    <button
      tolleButton
      size="sm"
      variant="outline"
      (click)="clearOtp()"
    >
      Clear
    </button>
  </div>
</div>
```

## OTP with Value Binding

### Initial Value

```html
<tolle-otp [value]="initialOtp" [length]="6" />
```

### Setting Value Programmatically

```typescript
// In component
@ViewChild(OtpComponent) otpComponent!: OtpComponent;

ngAfterViewInit() {
  // Set OTP programmatically
  this.otpComponent.setValue('123456');
}

getValue(): string {
  return this.otpComponent.getValue();
}
```
