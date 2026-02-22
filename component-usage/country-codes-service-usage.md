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

### Injecting the Service

```typescript
import { Component } from '@angular/core';
import { CountryCodesService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  template: `<!-- Template -->`
})
export class ExampleComponent {
  constructor(private countryService: CountryCodesService) {}
}
```

## Getting Country Data

### Get All Countries

```typescript
constructor(private countryService: CountryCodesService) {
  const countries = this.countryService.getCountries();
  console.log(countries.length); // 200+ countries
}
```

### Get Country by ISO Code

```typescript
const ghana = this.countryService.getCountry('GH');
// {
//   isoAlpha2: 'GH',
//   name: 'Ghana',
//   dialCode: '233',
//   flag: '...base64...'
// }
```

### Search Countries

```typescript
// Search by name
const unitedStates = this.countryService.searchCountries('United States');

// Search by dial code
const usa = this.countryService.searchCountries('1');

// Search by ISO code
const us = this.countryService.searchCountries('US');
```

## Country Data Structure

Each country object has this structure:

```typescript
interface Country {
  isoAlpha2: string;   // Two-letter ISO code (e.g., 'US', 'GB', 'CA')
  name: string;        // Full country name (e.g., 'United States')
  dialCode: string;    // International dial code (e.g., '1')
  flag: string;        // Base64 encoded flag image
}
```

## Example: Custom Country Dropdown

```typescript
import { Component, OnInit } from '@angular/core';
import { CountryCodesService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-custom-country',
  template: `
    <div class="relative">
      <button (click)="toggleDropdown()">
        <i class="ri-arrow-down-s-line"></i>
      </button>

      <div *ngIf="isOpen" class="absolute z-10 bg-white border rounded shadow-lg">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (ngModelChange)="filterCountries($event)"
          placeholder="Search countries..."
          class="w-full p-2 border-b"
        />

        <div class="max-h-64 overflow-y-auto">
          <div
            *ngFor="let country of filteredCountries"
            (click)="selectCountry(country)"
            class="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
          >
            <img
              [src]="getFlagUrl(country.flag)"
              class="h-4 w-6 rounded-sm"
              [alt]="country.name"
            />
            <span>{{ country.name }} ({{ country.dialCode }})</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CustomCountryComponent implements OnInit {
  searchQuery = '';
  filteredCountries: any[] = [];
  isOpen = false;

  constructor(private countryService: CountryCodesService) {}

  ngOnInit() {
    this.filteredCountries = this.countryService.getCountries();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  filterCountries(query: string) {
    this.filteredCountries = this.countryService.searchCountries(query);
  }

  selectCountry(country: any) {
    console.log('Selected:', country);
    this.isOpen = false;
    this.searchQuery = '';
  }

  getFlagUrl(flagBase64: string): string {
    return this.countryService.getFlagUrl(flagBase64);
  }
}
```

## Example: Country Dropdown with Flags

```typescript
import { Component, OnInit } from '@angular/core';
import { CountryCodesService } from '@tolle_/tolle-ui';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-country-list',
  template: `
    <div class="grid grid-cols-4 gap-2">
      <div
        *ngFor="let country of countries"
        (click)="selectCountry(country)"
        class="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
      >
        <img
          [src]="getSafeUrl(country.flag)"
          class="h-5 w-8 rounded-sm"
          [alt]="country.name"
        />
        <span class="text-sm">{{ country.name }}</span>
      </div>
    </div>
  `
})
export class CountryListComponent implements OnInit {
  countries: any[] = [];

  constructor(
    private countryService: CountryCodesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.countries = this.countryService.getCountries();
  }

  getSafeUrl(flagBase64: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/*;base64,' + flagBase64
    );
  }

  selectCountry(country: any) {
    console.log('Selected:', country.name);
  }
}
```

## Example: Getting Country Info for Phone Number

```typescript
import { Component } from '@angular/core';
import { CountryCodesService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-phone-form',
  template: `
    <select [(ngModel)]="selectedCountryCode">
      <option *ngFor="let country of countries" [value]="country.isoAlpha2">
        {{ country.name }} +{{ country.dialCode }}
      </option>
    </select>
  `
})
export class PhoneFormComponent implements OnInit {
  countries: any[] = [];
  selectedCountryCode = 'US';

  constructor(private countryService: CountryCodesService) {}

  ngOnInit() {
    this.countries = this.countryService.getCountries();
  }

  getSelectedCountry() {
    return this.countryService.getCountry(this.selectedCountryCode);
  }

  getDialCode(): string {
    const country = this.countryService.getCountry(this.selectedCountryCode);
    return country?.dialCode || '';
  }
}
```

## Example: Country Selector with Search

```typescript
import { Component, OnInit } from '@angular/core';
import { CountryCodesService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-country-selector',
  template: `
    <div class="relative">
      <input
        type="text"
        [(ngModel)]="searchQuery"
        placeholder="Search country..."
        (input)="onSearch($event)"
        class="w-full p-2 border rounded"
      />

      <div *ngIf="suggestions.length > 0" class="absolute z-10 w-full bg-white border rounded shadow-lg">
        <div
          *ngFor="let country of suggestions"
          (click)="selectCountry(country)"
          class="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
        >
          <img
            [src]="getFlagUrl(country.flag)"
            class="h-4 w-6 rounded-sm"
            [alt]="country.name"
          />
          <div>
            <div>{{ country.name }}</div>
            <div class="text-xs text-muted-foreground">
              +{{ country.dialCode }} / {{ country.isoAlpha2 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CountrySelectorComponent implements OnInit {
  searchQuery = '';
  suggestions: any[] = [];
  allCountries: any[] = [];

  constructor(private countryService: CountryCodesService) {}

  ngOnInit() {
    this.allCountries = this.countryService.getCountries();
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.suggestions = this.countryService.searchCountries(query);
  }

  selectCountry(country: any) {
    this.searchQuery = country.name;
    this.suggestions = [];
    console.log('Selected:', country);
  }

  getFlagUrl(flagBase64: string): string {
    return this.countryService.getFlagUrl(flagBase64);
  }
}
```

## Available Countries

The service includes data for 200+ countries and territories, including:
- Sovereign states
- Dependent territories
- Special territories

Countries are sorted alphabetically by name in the default list.

## Notes

- The service uses base64 encoded flag images embedded in the data
- Country data is static and loaded at service initialization
- The service is tree-shakable and won't be included if not used
- Flag URLs are sanitized for security when using `getFlagUrl()`
