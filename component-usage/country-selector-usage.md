# Country Selector Component Usage Guide

## Overview

The Country Selector component is a dropdown that allows users to select a country from a list of 200+ countries with flags. It includes search functionality and returns country information including dial codes.

## Import

```typescript
import { CountrySelectorComponent } from '@tolle_/tolle-ui';
```

## Component

### CountrySelectorComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `string` | Auto-generated | Select element ID |
| `label` | `string` | `''` | Label text |
| `hint` | `string` | `''` | Hint text |
| `errorMessage` | `string` | `''` | Error message text |
| `error` | `boolean` | `false` | Error state |
| `hideHintOnFocus` | `boolean` | `true` | Hide hint when focused |
| `placeholder` | `string` | `'Select country'` | Placeholder text |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |
| `size` | `'xs' \| 'sm' \| 'default' \| 'lg'` | `'default'` | Component size |
| `defaultCountryCode` | `string` | `'GH'` | Default country ISO code |
| `returnValue` | `'object' \| 'isoAlpha2' \| 'dialCode' \| 'name'` | `'isoAlpha2'` | Return type for value |
| `showName` | `boolean` | `true` | Show country name in selector |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `onSelect` | `EventEmitter<any>` | Emitted when a country is selected |

## Basic Usage

### Simple Country Selector

```html
<tolle-country-selector
  [label]="'Country'"
  [(ngModel)]="country"
></tolle-country-selector>
```

### With Default Country

```html
<tolle-country-selector
  [label]="'Country'"
  [defaultCountryCode]="'US'"
  [(ngModel)]="country"
></tolle-country-selector>
```

### Return ISO Alpha2 Code (default)

```html
<tolle-country-selector
  [(ngModel)]="countryCode"
></tolle-country-selector>
```

```typescript
// countryCode will be: 'US', 'GB', 'CA', etc.
```

### Return Full Country Object

```html
<tolle-country-selector
  [returnValue]="'object'"
  [(ngModel)]="country"
></tolle-country-selector>
```

```typescript
// country will be: { isoAlpha2: 'US', name: 'United States', dialCode: '1', flag: '...' }
```

### Return Dial Code

```html
<tolle-country-selector
  [returnValue]="'dialCode'"
  [(ngModel)]="dialCode"
></tolle-country-selector>
```

```typescript
// dialCode will be: '1', '44', '61', etc.
```

### Return Country Name

```html
<tolle-country-selector
  [returnValue]="'name'"
  [(ngModel)]="countryName"
></tolle-country-selector>
```

```typescript
// countryName will be: 'United States', 'United Kingdom', etc.
```

### Disabled State

```html
<tolle-country-selector
  [disabled]="true"
></tolle-country-selector>
```

### Read-Only State

```html
<tolle-country-selector
  [readonly]="true"
></tolle-country-selector>
```

### Without Country Name

```html
<tolle-country-selector
  [showName]="false"
></tolle-country-selector>
```

## Form Integration

### Template-Driven Form

```html
<form #form="ngForm">
  <tolle-country-selector
    name="country"
    [(ngModel)]="formData.country"
    #country="ngModel"
    [label]="'Country'"
    required
  ></tolle-country-selector>

  <div *ngIf="country.invalid && country.touched">
    Country is required
  </div>
</form>
```

### Reactive Form

```typescript
this.form = this.fb.group({
  country: ['US', [Validators.required]],
});

// Access value based on returnValue setting
get countryValue() {
  return this.form.get('country')?.value;
}
```

## Search Functionality

The country selector includes a built-in search input for quickly finding countries:

```html
<tolle-country-selector
  [label]="'Country'"
  [(ngModel)]="country"
></tolle-country-selector>
```

Users can type:
- Country name: `United States`
- Dial code: `1`
- ISO code: `US`

## Size Variants

```html
<!-- Extra Small -->
<tolle-country-selector size="xs"></tolle-country-selector>

<!-- Small -->
<tolle-country-selector size="sm"></tolle-country-selector>

<!-- Default -->
<tolle-country-selector size="default"></tolle-country-selector>

<!-- Large -->
<tolle-country-selector size="lg"></tolle-country-selector>
```

## Handling Selection

```html
<tolle-country-selector
  [(ngModel)]="country"
  (onSelect)="onCountrySelect($event)"
></tolle-country-selector>
```

```typescript
onCountrySelect(country: any) {
  console.log('Country selected:', country);
  // { isoAlpha2: 'US', name: 'United States', dialCode: '1', flag: '...' }
}
```

## Country Data Structure

Each country in the list has this structure:

```typescript
interface Country {
  isoAlpha2: string;   // US, GB, CA, etc.
  name: string;        // United States, United Kingdom, etc.
  dialCode: string;    // 1, 44, 61, etc.
  flag: string;        // Base64 encoded flag image
}
```

## Custom Styling

```html
<tolle-country-selector
  class="custom-selector"
></tolle-country-selector>
```

```css
.custom-selector {
  /* Your custom styles */
}
```

## Accessibility

- Full keyboard navigation support
- Searchable dropdown for accessibility
- ARIA attributes for screen readers
- Focus management
- Required and error states announced correctly

## Use Cases

### Phone Number Input

```html
<tolle-phone-number-input
  [(ngModel)]="phoneNumber"
>
  <tolle-country-selector
    prefix
    [(ngModel)]="selectedCountry"
  ></tolle-country-selector>
</tolle-phone-number-input>
```

### Registration Form

```html
<form>
  <div class="space-y-4">
    <tolle-input
      label="First Name"
      [(ngModel)]="formData.firstName"
      name="firstName"
    ></tolle-input>

    <tolle-country-selector
      label="Country"
      [(ngModel)]="formData.country"
      name="country"
    ></tolle-country-selector>

    <tolle-phone-number-input
      label="Phone Number"
      [(ngModel)]="formData.phone"
      [defaultCountryCode]="formData.country?.isoAlpha2 || 'US'"
      name="phone"
    ></tolle-phone-number-input>
  </div>
</form>
```
