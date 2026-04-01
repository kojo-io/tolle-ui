# Masked Input Component Usage Guide

## Overview

The MaskedInput component provides an input field with formatting based on a mask pattern. It supports various mask types like phone numbers, dates, credit cards, and custom patterns.

## Import

```typescript
import { MaskedInputComponent } from '@tolle_/tolle-ui';
```

## MaskedInputComponent

**Inputs:**

| Input             | Type                          | Default        | Description             |
| ----------------- | ----------------------------- | -------------- | ----------------------- |
| `id`              | `string`                      | Auto-generated | Input ID                |
| `label`           | `string`                      | `''`           | Input label             |
| `hint`            | `string`                      | `''`           | Hint text               |
| `errorMessage`    | `string`                      | `''`           | Error message           |
| `mask`            | `string`                      | -              | Mask pattern (required) |
| `placeholder`     | `string`                      | `''`           | Placeholder text        |
| `type`            | `string`                      | `'text'`       | Input type              |
| `disabled`        | `boolean`                     | `false`        | Disabled state          |
| `readonly`        | `boolean`                     | `false`        | Read-only state         |
| `class`           | `string`                      | `''`           | Additional CSS classes  |
| `containerClass`  | `string`                      | `''`           | Container CSS classes   |
| `error`           | `boolean`                     | `false`        | Error state             |
| `size`            | `'xs'\|'sm'\|'default'\|'lg'` | `'default'`    | Input size              |
| `returnRaw`       | `boolean`                     | `false`        | Return raw value        |
| `hideHintOnFocus` | `boolean`                     | `true`         | Hide hint on focus      |
| `ngModel`         | `any`                         | `null`         | Two-way binding value   |
| `formControlName` | `string`                      | -              | Form control name       |

## Basic Usage

### Basic Masked Input Example

```html
<div class="w-full max-w-sm space-y-4">
  <tolle-masked-input
    label="Credit Card"
    mask="0000 0000 0000 0000"
    placeholder="0000 0000 0000 0000"
    [(ngModel)]="creditCard"
    ><i prefix class="ri-bank-card-line text-muted-foreground"></i>
  </tolle-masked-input>

  <div class="text-sm text-muted-foreground">Value: {{ creditCard }}</div>
</div>
```

## Use Cases

### Credit Card Number

```html
<tolle-masked-input
  label="Credit Card Number"
  mask="0000 0000 0000 0000"
  placeholder="1234 5678 9012 3456"
  [(ngModel)]="cardNumber">
  <i prefix class="ri-bank-card-line"></i>
</tolle-masked-input>
```

### Phone Number (US Format)

```html
<tolle-masked-input
  label="Phone Number"
  mask="(000) 000-0000"
  placeholder="(555) 123-4567"
  [(ngModel)]="phoneNumber">
  <i prefix class="ri-phone-line"></i>
</tolle-masked-input>
```

### Date Input

```html
<tolle-masked-input
  label="Date of Birth"
  mask="00/00/0000"
  placeholder="MM/DD/YYYY"
  [(ngModel)]="birthDate">
  <i prefix class="ri-calendar-line"></i>
</tolle-masked-input>
```

### Social Security Number

```html
<tolle-masked-input
  label="Social Security Number"
  mask="000-00-0000"
  placeholder="123-45-6789"
  [(ngModel)]="ssn">
  <i prefix class="ri-shield-user-line"></i>
</tolle-masked-input>
```

### Custom Mask Patterns

The mask uses these special characters:

- `0` or `0` - Digit (0-9)
- `A` - Letter (A-Z, a-z)
- `S` - Alphanumeric (A-Z, a-z, 0-9)
- Any other character - Literal character

```html
<!-- Product Code: 3 letters + dash + 4 digits -->
<tolle-masked-input
  label="Product Code"
  mask="AAA-0000"
  placeholder="ABC-1234"
  [(ngModel)]="productCode">
  <i prefix class="ri-barcode-line"></i>
</tolle-masked-input>

<!-- License Plate: 3 letters + space + 4 digits -->
<tolle-masked-input
  label="License Plate"
  mask="AAA 0000"
  placeholder="ABC 1234"
  [(ngModel)]="licensePlate">
  <i prefix class="ri-car-line"></i>
</tolle-masked-input>
```

### Return Raw Value

Set `returnRaw="true"` to get the unmasked value (digits only):

```html
<tolle-masked-input
  label="Credit Card (Raw)"
  mask="0000 0000 0000 0000"
  [returnRaw]="true"
  [(ngModel)]="rawCardNumber">
</tolle-masked-input>
<!-- rawCardNumber will be "1234567890123456" instead of "1234 5678 9012 3456" -->
```
