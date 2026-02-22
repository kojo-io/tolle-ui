# Phone Number Input Component Usage Guide

## Overview

The Phone Number Input component is a specialized input for entering and validating international phone numbers. It includes a country selector and uses `libphonenumber-js` for phone number parsing and validation.

## Import

```typescript
import { PhoneNumberInputComponent } from '@tolle_/tolle-ui';
```

## Component

### PhoneNumberInputComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `string` | Auto-generated | Input element ID |
| `label` | `string` | `''` | Label text |
| `hint` | `string` | `''` | Hint text |
| `errorMessage` | `string` | `''` | Error message text |
| `error` | `boolean` | `false` | Error state |
| `hideHintOnFocus` | `boolean` | `true` | Hide hint when focused |
| `placeholder` | `string` | `'Phone number'` | Input placeholder |
| `size` | `'xs' \| 'sm' \| 'default' \| 'lg'` | `'default'` | Input size |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |
| `defaultCountryCode` | `string` | `'GH'` | Default country ISO code |
| `dataType` | `'NumberOnly' \| 'FullObject'` | `'FullObject'` | Return type for value |
| `mask` | `string` | `'(000) 000-0000'` | Input mask pattern |
| `class` | `string` | `''` | Additional CSS classes |
| `enableCountrySelector` | `boolean` | `true` | Enable country selector |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `onSelect` | `EventEmitter<any>` | Emitted when country or phone number changes |

## Basic Usage

### Simple Phone Number Input

```html
<tolle-phone-number-input
  [label]="'Phone Number'"
  [placeholder]="'Enter phone number'"
></tolle-phone-number-input>
```

### With Validation

```html
<tolle-phone-number-input
  [label]="'Phone Number'"
  [error]="hasError"
  [errorMessage]="'Please enter a valid phone number'"
  [(ngModel)]="phoneNumber"
></tolle-phone-number-input>
```

### With Default Country

```html
<tolle-phone-number-input
  [label]="'Phone Number'"
  [defaultCountryCode]="'US'"
  [(ngModel)]="phoneNumber"
></tolle-phone-number-input>
```

### Number Only Return Type

```html
<tolle-phone-number-input
  [label]="'Phone Number'"
  [dataType]="'NumberOnly'"
  [(ngModel)]="phoneNumber"
></tolle-phone-number-input>
```

```typescript
// phoneNumber will be just the digits: '1234567890'
// instead of full object with country, number, etc.
```

### Custom Mask

```html
<tolle-phone-number-input
  [label]="'Phone Number'"
  [mask]="'000-000-0000'"
  [(ngModel)]="phoneNumber"
></tolle-phone-number-input>
```

### Disabled State

```html
<tolle-phone-number-input
  [label]="'Phone Number'"
  [disabled]="true"
></tolle-phone-number-input>
```

### Read-Only State

```html
<tolle-phone-number-input
  [label]="'Phone Number'"
  [readonly]="true"
></tolle-phone-number-input>
```

### Without Country Selector

```html
<tolle-phone-number-input
  [label]="'Phone Number'"
  [enableCountrySelector]="false"
  [(ngModel)]="phoneNumber"
></tolle-phone-number-input>
```

## Form Integration

### Template-Driven Form

```html
<form #form="ngForm">
  <tolle-phone-number-input
    name="phone"
    [(ngModel)]="formData.phone"
    #phone="ngModel"
    [label]="'Phone Number'"
    required
  ></tolle-phone-number-input>

  <div *ngIf="phone.invalid && phone.touched">
    Phone number is required
  </div>
</form>
```

### Reactive Form

```typescript
this.form = this.fb.group({
  phone: ['', [Validators.required]],
});

// Get full phone number object
get phoneValue() {
  return this.form.get('phone')?.value;
}
```

## Handling Selection

```html
<tolle-phone-number-input
  [label]="'Phone Number'"
  (onSelect)="onPhoneSelect($event)"
></tolle-phone-number-input>
```

```typescript
onPhoneSelect(phoneNumber: any) {
  console.log('Country:', phoneNumber.country);
  console.log('Country Code:', phoneNumber.countryCode);
  console.log('Number:', phoneNumber.number);
  console.log('E164:', phoneNumber.format('E.164'));
  console.log('International:', phoneNumber.format('INTERNATIONAL'));
}
```

## Data Types

### FullObject (default)

Returns a phone number object with methods and properties:

```typescript
{
  country: 'US',
  countryCode: '1',
  number: '1234567890',
  format: (format: string) => string,
  isValid: boolean,
  // ... other methods
}
```

### NumberOnly

Returns just the digits:

```typescript
'1234567890'
```

## Phone Number Object Methods

When using `FullObject` data type, you can use these methods:

```typescript
const phone = this.form.get('phone')?.value;

// Get formatted numbers
phone.format('E.164');         // +11234567890
phone.format('INTERNATIONAL'); // +1 123-456-7890
phone.format('NATIONAL');      // (123) 456-7890
phone.format('RFC3966');       // tel:+1-123-456-7890

// Get details
phone.country;     // 'US'
phone.countryCode; // '1'
phone.number;      // '1234567890'
phone.isValid;     // true
```

## Size Variants

```html
<!-- Extra Small -->
<tolle-phone-number-input size="xs"></tolle-phone-number-input>

<!-- Small -->
<tolle-phone-number-input size="sm"></tolle-phone-number-input>

<!-- Default -->
<tolle-phone-number-input size="default"></tolle-phone-number-input>

<!-- Large -->
<tolle-phone-number-input size="lg"></tolle-phone-number-input>
```

## Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- Proper focus management
- Required and error states announced correctly
