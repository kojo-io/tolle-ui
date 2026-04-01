# Country Codes Service Usage Guide

## Overview

The CountryCodesService provides country data including ISO codes, dial codes, and flag images. It's used internally by the CountrySelectorComponent but can also be used directly for country lookups and data.

## Import

```typescript
import { CountryCodesService } from '@tolle_/tolle-ui';
```

## Service

### CountryCodesService

**Methods:**

| Method | Description |
|--------|-------------|
| `getCountry(isoAlpha2: string)` | Get country by ISO alpha-2 code |
| `getCountries()` | Get all countries |
| `searchCountries(query: string)` | Search countries by name, dial code, or ISO code |
| `getFlagUrl(flagBase64: string)` | Get sanitized flag URL |

## Basic Usage

```html
```typescript
import { Component, OnInit } from '@angular/core';
import { CountryCodesService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-country-example',
  template: `
    <div *ngIf="defaultCountry" class="flex items-center space-x-2">
      <img [src]="getFlagSrc(defaultCountry.flagBase64)" alt="Flag" class="w-6 h-4 object-cover">
      <span>{{ defaultCountry.name }} ({{ defaultCountry.dialCode }})</span>
    </div>
  `
})
export class CountryExampleComponent implements OnInit {
  defaultCountry: any;

  constructor(private countryService: CountryCodesService) {}

  ngOnInit() {
    this.defaultCountry = this.countryService.getCountry('US');
  }

  getFlagSrc(base64: string) {
    return this.countryService.getFlagUrl(base64);
  }
}

```
