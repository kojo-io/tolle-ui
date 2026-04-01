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

### Basic Otp Example

```html
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
```

### Manual Otp Example

```html
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
```

