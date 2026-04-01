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

### Basic Country Selector Example

```html
<div class="w-full max-w-xs">
      <tolle-country-selector defaultCountryCode="GH"></tolle-country-selector>
    </div>
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
