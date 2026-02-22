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

### Injecting the Service

```typescript
import { Component } from '@angular/core';
import { PhoneNumberService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  template: `<!-- Template -->`
})
export class ExampleComponent {
  constructor(private phoneNumberService: PhoneNumberService) {}
}
```

## Parsing Phone Numbers

### Parse Phone Number

```typescript
const phoneNumber = this.phoneNumberService.parsePhoneNumber(
  '1234567890',
  'US'
);

if (phoneNumber) {
  console.log(phoneNumber.country);     // 'US'
  console.log(phoneNumber.countryCode); // '1'
  console.log(phoneNumber.number);      // '1234567890'
}
```

### Parse with Default Country

```typescript
// Without country code - uses default country
const phone = this.phoneNumberService.parsePhoneNumber(
  '555-123-4567',
  'US'
);

// With country code
const international = this.phoneNumberService.parsePhoneNumber(
  '+44 20 7946 0958',
  'US' // fallback only
);
```

## Validating Phone Numbers

### Check Validity

```typescript
const isValid = this.phoneNumberService.isValidPhoneNumber(
  '1234567890',
  'US'
);

console.log(isValid); // true or false
```

### Validate with Default Country

```typescript
// Local number - validates against default country
const isValidLocal = this.phoneNumberService.isValidPhoneNumber(
  '555-123-4567',
  'US'
);

// International number
const isValidIntl = this.phoneNumberService.isValidPhoneNumber(
  '+44 20 7946 0958'
);
```

## Formatting Phone Numbers

### Format as E.164

```typescript
const formatted = this.phoneNumberService.formatPhoneNumber(
  '1234567890',
  'E.164',
  'US'
);

console.log(formatted); // '+11234567890'
```

### Format as International

```typescript
const formatted = this.phoneNumberService.formatPhoneNumber(
  '1234567890',
  'INTERNATIONAL',
  'US'
);

console.log(formatted); // '+1 123-456-7890'
```

### Format as National

```typescript
const formatted = this.phoneNumberService.formatPhoneNumber(
  '1234567890',
  'NATIONAL',
  'US'
);

console.log(formatted); // '(123) 456-7890'
```

### Format as RFC3966

```typescript
const formatted = this.phoneNumberService.formatPhoneNumber(
  '1234567890',
  'RFC3966',
  'US'
);

console.log(formatted); // 'tel:+1-123-456-7890'
```

## Phone Number Object Methods

When parsing returns a phone number object, you can use these methods:

```typescript
const phone = this.phoneNumberService.parsePhoneNumber('1234567890', 'US');

if (phone) {
  // Get formatted versions
  phone.format('E.164');         // +11234567890
  phone.format('INTERNATIONAL'); // +1 123-456-7890
  phone.format('NATIONAL');      // (123) 456-7890
  phone.format('RFC3966');       // tel:+1-123-456-7890

  // Get details
  phone.country;     // 'US'
  phone.countryCode; // '1'
  phone.number;      // '1234567890'
  phone.isValid;     // true
}
```

## Example: Phone Number Validation

```typescript
import { Component } from '@angular/core';
import { PhoneNumberService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-phone-validator',
  template: `
    <div>
      <input
        type="tel"
        [(ngModel)]="phoneNumber"
        (blur)="validate()"
        placeholder="Enter phone number"
      />
      <div *ngIf="error" class="text-destructive">
        {{ error }}
      </div>
      <div *ngIf="success" class="text-green-600">
        Valid phone number
      </div>
    </div>
  `
})
export class PhoneValidatorComponent {
  phoneNumber = '';
  error = '';
  success = false;

  constructor(private phoneNumberService: PhoneNumberService) {}

  validate() {
    const phone = this.phoneNumberService.parsePhoneNumber(
      this.phoneNumber,
      'US'
    );

    if (!phone || !phone.isValid) {
      this.error = 'Please enter a valid phone number';
      this.success = false;
    } else {
      this.error = '';
      this.success = true;
      console.log('Valid:', phone.format('E.164'));
    }
  }
}
```

## Example: Phone Number Formatter

```typescript
import { Component } from '@angular/core';
import { PhoneNumberService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-phone-formatter',
  template: `
    <div>
      <input
        type="tel"
        [(ngModel)]="rawNumber"
        (ngModelChange)="format($event)"
        placeholder="Enter phone number"
      />

      <div class="mt-2 space-y-2">
        <div>E.164: {{ e164 }}</div>
        <div>International: {{ international }}</div>
        <div>National: {{ national }}</div>
      </div>
    </div>
  `
})
export class PhoneFormatterComponent {
  rawNumber = '';
  e164 = '';
  international = '';
  national = '';

  constructor(private phoneNumberService: PhoneNumberService) {}

  format(value: string) {
    const phone = this.phoneNumberService.parsePhoneNumber(value, 'US');

    if (phone && phone.isValid) {
      this.e164 = phone.format('E.164');
      this.international = phone.format('INTERNATIONAL');
      this.national = phone.format('NATIONAL');
    } else {
      this.e164 = '';
      this.international = '';
      this.national = '';
    }
  }
}
```

## Example: Country Code Lookup

```typescript
import { Component, OnInit } from '@angular/core';
import { PhoneNumberService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-country-code',
  template: `
    <select [(ngModel)]="selectedCountry" (change)="onCountryChange()">
      <option *ngFor="let region of regions" [value]="region">
        {{ getCountryName(region) }}
      </option>
    </select>

    <p>Country Code: {{ countryCode }}</p>
  `
})
export class CountryCodeComponent implements OnInit {
  regions: string[] = [];
  selectedCountry = 'US';
  countryCode = '+1';

  constructor(private phoneNumberService: PhoneNumberService) {}

  ngOnInit() {
    this.regions = this.phoneNumberService.getSupportedRegions();
  }

  onCountryChange() {
    this.countryCode = this.phoneNumberService.getCountryCodeForNumber(
      '',
      this.selectedCountry
    );
  }

  getCountryName(regionCode: string): string {
    // Use Intl.DisplayNames for region names
    const displayNames = new Intl.DisplayNames('en', { type: 'region' });
    return displayNames.of(regionCode) || regionCode;
  }
}
```

## Supported Formats

The service supports these formatting options from `libphonenumber-js`:

| Format | Description | Example |
|--------|-------------|---------|
| `E.164` | International format without spaces | `+11234567890` |
| `INTERNATIONAL` | International format with spaces | `+1 123-456-7890` |
| `NATIONAL` | National format | `(123) 456-7890` |
| `RFC3966` | URL-friendly format | `tel:+1-123-456-7890` |

## Supported Regions

```typescript
const regions = this.phoneNumberService.getSupportedRegions();
// Returns array of ISO 3166-1 alpha-2 codes
// ['US', 'GB', 'CA', 'AU', 'DE', 'FR', ...]
```

## Notes

- The service uses `libphonenumber-js` for all phone number operations
- Country codes are based on ISO 3166-1 alpha-2 standard
- Phone numbers are validated against the Google Phone Number Metadata
- The service is tree-shakable and won't be included if not used
- All methods handle empty/invalid inputs gracefully
