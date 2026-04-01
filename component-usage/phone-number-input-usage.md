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

### Basic Phone Number Input Example

```html
<div class="w-full max-w-sm">
      <tolle-phone-number-input defaultCountryCode="GH"></tolle-phone-number-input>
    </div>
```

## Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- Proper focus management
- Required and error states announced correctly
