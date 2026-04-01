# Phone Number Service Usage Guide

## Overview

The PhoneNumberService provides phone number parsing, validation, and formatting functionality using `libphonenumber-js`. It's used internally by the PhoneNumberInputComponent but can also be used directly for phone number operations.

## Import

```typescript
import { PhoneNumberService } from '@tolle_/tolle-ui';
```

## Service

### PhoneNumberService

**Methods:**

| Method | Description | Returns |
|--------|-------------|---------|
| `parsePhoneNumber(number: string, country?: string)` | Parse a phone number | `PhoneNumber \| null` |
| `isValidPhoneNumber(number: string, country?: string)` | Validate a phone number | `boolean` |
| `formatPhoneNumber(number: string, format: string, country?: string)` | Format a phone number | `string` |
| `getCountryCodeForNumber(number: string, country?: string)` | Get country code | `string \| null` |
| `getNationalSignificantNumber(number: string, country?: string)` | Get national significant number | `string` |
| `getSupportedRegions()` | Get list of supported regions | `string[]` |

## Basic Usage

```html
```typescript
import { Component } from '@angular/core';
import { PhoneNumberService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-phone-example',
  template: `
    <div class="space-y-2 text-sm">
      <p>Raw Number: {{ rawNumber }}</p>
      <p>Is Valid: {{ isValid ? 'Yes' : 'No' }}</p>
      <p>Formatted (National): {{ formattedNumber }}</p>
    </div>
  `
})
export class PhoneExampleComponent {
  rawNumber = '2133734253';
  isValid: boolean;
  formattedNumber: string;

  constructor(private phoneService: PhoneNumberService) {
    this.isValid = this.phoneService.isValidPhoneNumber(this.rawNumber, 'US');
    this.formattedNumber = this.phoneService.formatPhoneNumber(this.rawNumber, 'NATIONAL', 'US');
  }
}

```
