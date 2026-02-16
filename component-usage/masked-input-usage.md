# Masked Input Component Usage Guide

## Overview

The MaskedInput component provides an input field with formatting based on a mask pattern. It supports various mask types like phone numbers, dates, credit cards, and custom patterns.

## Import

```typescript
import { MaskedInputComponent } from '@tolle_/tolle-ui';
```

## MaskedInputComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `string` | Auto-generated | Input ID |
| `label` | `string` | `''` | Input label |
| `hint` | `string` | `''` | Hint text |
| `errorMessage` | `string` | `''` | Error message |
| `mask` | `string` | - | Mask pattern (required) |
| `placeholder` | `string` | `''` | Placeholder text |
| `type` | `string` | `'text'` | Input type |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |
| `class` | `string` | `''` | Additional CSS classes |
| `containerClass` | `string` | `''` | Container CSS classes |
| `error` | `boolean` | `false` | Error state |
| `size` | `'xs'\|'sm'\|'default'\|'lg'` | `'default'` | Input size |
| `returnRaw` | `boolean` | `false` | Return raw value |
| `hideHintOnFocus` | `boolean` | `true` | Hide hint on focus |
| `ngModel` | `any` | `null` | Two-way binding value |
| `formControlName` | `string` | - | Form control name |

## Basic Usage

### Simple Masked Input

```html
<tolle-masked-input
  label="Phone Number"
  mask="(000) 000-0000"
  placeholder="(555) 123-4567"
  [(ngModel)]="phoneNumber"
/>
<p>Value: {{ phoneNumber }}</p>
```

### Disabled Masked Input

```html
<tolle-masked-input
  label="Fixed Number"
  mask="(000) 000-0000"
  value="(555) 123-4567"
  [disabled]="true"
/>
```

## Common Mask Patterns

### Phone Number

```html
<tolle-masked-input
  label="Phone"
  mask="(000) 000-0000"
  placeholder="(555) 123-4567"
/>
```

### Date

```html
<tolle-masked-input
  label="Date of Birth"
  mask="00/00/0000"
  placeholder="MM/DD/YYYY"
/>
```

### Credit Card

```html
<tolle-masked-input
  label="Credit Card"
  mask="0000 0000 0000 0000"
  placeholder="1234 5678 9012 3456"
/>
```

### SSN

```html
<tolle-masked-input
  label="SSN"
  mask="000-00-0000"
  placeholder="123-45-6789"
/>
```

### Zip Code

```html
<tolle-masked-input
  label="ZIP Code"
  mask="00000"
  placeholder="12345"
/>
```

### Custom Pattern

```html
<tolle-masked-input
  label="License Plate"
  mask="AAA-0000"
  placeholder="ABC-1234"
/>
```

## Mask Characters

| Character | Description |
|-----------|-------------|
| `0` | Numeric digit (required) |
| `9` | Numeric digit (optional) |
| `A` | Alphabetic character (required) |
| `a` | Alphabetic character (optional) |
| `L` | Alphabetic character (required, lowercase) |
| `l` | Alphabetic character (optional, lowercase) |
| `?` | Alphanumeric (optional) |
| `*` | Alphanumeric (required) |

## Masked Input with Return Raw

### Return Raw Value

```html
<tolle-masked-input
  label="Phone"
  mask="(000) 000-0000"
  [(ngModel)]="phoneNumber"
  [returnRaw]="true"
/>
<!-- Returns raw number: "5551234567" -->
```

## Masked Input Sizes

### Extra Small (xs)

```html
<tolle-masked-input
  label="Small"
  mask="000-00-0000"
  size="xs"
  placeholder="SSN"
/>
```

### Small (sm)

```html
<tolle-masked-input
  label="Small"
  mask="000-00-0000"
  size="sm"
  placeholder="SSN"
/>
```

### Large (lg)

```html
<tolle-masked-input
  label="Large"
  mask="000-00-0000"
  size="lg"
  placeholder="SSN"
/>
```

## Masked Input with Error State

### Error State (Programmatic)

```html
<tolle-masked-input
  label="Phone"
  mask="(000) 000-0000"
  [error]="true"
  errorMessage="Please enter a valid phone number"
/>
```

### Error State (Form Validation)

```html
<form [formGroup]="form">
  <tolle-masked-input
    label="Phone"
    mask="(000) 000-0000"
    formControlName="phone"
  />
</form>
```

### Conditional Error

```html
<tolle-masked-input
  label="Phone"
  mask="(000) 000-0000"
  [error]="form.get('phone')?.invalid && form.get('phone')?.touched"
  errorMessage="Please enter a valid 10-digit phone number"
/>
```

## Masked Input in Form

### Reactive Form

```typescript
this.form = this.fb.group({
  phone: ['', Validators.required],
  ssn: ['', Validators.required],
  date: ['', Validators.required]
});
```

```html
<form [formGroup]="form">
  <tolle-masked-input
    label="Phone"
    mask="(000) 000-0000"
    formControlName="phone"
  />
  <tolle-masked-input
    label="SSN"
    mask="000-00-0000"
    formControlName="ssn"
  />
  <tolle-masked-input
    label="Date"
    mask="00/00/0000"
    formControlName="date"
  />
</form>
```

### Template-driven Form

```html
<form>
  <tolle-masked-input
    label="Phone"
    mask="(000) 000-0000"
    [(ngModel)]="phone"
    name="phone"
    required
  />
</form>
```

## Masked Input with Hint

```html
<tolle-masked-input
  label="Phone"
  mask="(000) 000-0000"
  hint="Enter your 10-digit phone number"
/>
```

### Hide Hint on Focus

```html
<tolle-masked-input
  label="Phone"
  mask="(000) 000-0000"
  hint="Enter your phone number"
  [hideHintOnFocus]="true"
/>
```

## Masked Input with Prefix/Suffix

### Prefix

```html
<tolle-masked-input
  label="Amount"
  mask="000.00"
  placeholder="0.00"
>
  <span prefix class="text-muted-foreground">$</span>
</tolle-masked-input>
```

### Suffix

```html
<tolle-masked-input
  label="Percentage"
  mask="000"
  placeholder="100"
>
  <span suffix class="text-muted-foreground">%</span>
</tolle-masked-input>
```

## Masked Input for Time

### Time Input

```html
<tolle-masked-input
  label="Time"
  mask="00:00"
  placeholder="12:00"
/>
```

### Time with AM/PM

```html
<tolle-masked-input
  label="Appointment Time"
  mask="00:00 LL"
  placeholder="12:00 AM"
/>
```

## Masked Input for UUID

```html
<tolle-masked-input
  label="UUID"
  mask="00000000-0000-0000-0000-000000000000"
  placeholder="550e8400-e29b-41d4-a716-446655440000"
/>
```
