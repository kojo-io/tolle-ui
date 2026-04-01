# Theme Service Usage Guide

## Overview

The ThemeService manages application-wide theming including dark/light mode, primary color customization, and border radius settings. It persists user preferences to localStorage and supports both system preference detection and configuration-based defaults.

## Import

```typescript
import { ThemeService } from '@tolle_/tolle-ui';
```

## ThemeService

### Properties

| Property       | Type                  | Description                                           |
| -------------- | --------------------- | ----------------------------------------------------- |
| `isDark$`      | `Observable<boolean>` | Observable that emits `true` when dark mode is active |
| `isDark`       | `boolean`             | Synchronous getter for current dark mode state        |
| `currentTheme` | `'dark' \| 'light'`   | Returns the current theme name                        |
| `primaryColor` | `string \| null`      | Returns the current primary color as hex string       |

### Methods

| Method                  | Parameters                          | Return           | Description                                         |
| ----------------------- | ----------------------------------- | ---------------- | --------------------------------------------------- |
| `toggleTheme`           | -                                   | `void`           | Toggle between dark and light mode                  |
| `setPrimaryColor`       | `color: string, persist?: boolean`  | `void`           | Set the primary color (hex format, e.g., `#2563eb`) |
| `setRadius`             | `radius: string, persist?: boolean` | `void`           | Set base border radius (e.g., `0.5rem`, `8px`)      |
| `resetToConfigDefaults` | -                                   | `void`           | Reset all preferences to config defaults            |
| `getUserPreferences`    | -                                   | `object \| null` | Get all saved user preferences                      |
| `clearUserPreferences`  | -                                   | `void`           | Clear all saved preferences from localStorage       |

### Configuration

Configure the theme service in your app config:

```typescript
import { ApplicationConfig } from '@angular/core';
import { TOLLE_CONFIG, TolleConfig } from '@tolle_/tolle-ui';

const tolleConfig: TolleConfig = {
  darkByDefault: false,
  primaryColor: '#2563eb',
  radius: '0.5rem',
};

export const appConfig: ApplicationConfig = {
  providers: [{ provide: TOLLE_CONFIG, useValue: tolleConfig }],
};
```

### Preference Priority

The service determines initial theme values using this priority:

1. **User Saved Preferences** (localStorage)
2. **Config Defaults** (TolleConfig)
3. **System Preferences** (prefers-color-scheme media query)

## Basic Usage

### Theme Toggle

```html
<tolle-button (click)="toggleTheme()">
  <i [class]="isDark ? 'ri-sun-line' : 'ri-moon-line'"></i>
  {{ isDark ? 'Light Mode' : 'Dark Mode' }}
</tolle-button>
```

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  get isDark(): boolean {
    return this.themeService.isDark;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
```

### Subscribe to Theme Changes

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ThemeService, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-theme-aware',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './theme-aware.component.html',
})
export class ThemeAwareComponent implements OnInit {
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.isDark$.subscribe(isDark => {
      console.log('Theme changed to:', isDark ? 'dark' : 'light');
    });
  }
}
```

### Set Primary Color

```html
<div class="flex gap-2">
  <tolle-button size="sm" (click)="setPrimaryColor('#2563eb')">Blue</tolle-button>
  <tolle-button size="sm" (click)="setPrimaryColor('#16a34a')">Green</tolle-button>
  <tolle-button size="sm" (click)="setPrimaryColor('#dc2626')">Red</tolle-button>
  <tolle-button size="sm" (click)="setPrimaryColor('#7c3aed')">Purple</tolle-button>
</div>
```

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './color-picker.component.html',
})
export class ColorPickerComponent {
  private themeService = inject(ThemeService);

  setPrimaryColor(color: string): void {
    this.themeService.setPrimaryColor(color);
  }
}
```

### Set Border Radius

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from '@tolle_/tolle-ui';

export class RadiusSettingsComponent {
  private themeService = inject(ThemeService);

  setRadius(radius: string): void {
    this.themeService.setRadius(radius);
  }

  // Examples:
  // this.setRadius('0rem');     // Sharp corners
  // this.setRadius('0.25rem');  // Small radius
  // this.setRadius('0.5rem');   // Default radius
  // this.setRadius('1rem');     // Large radius
  // this.setRadius('2rem');     // Extra large radius
}
```

### Reset to Defaults

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-theme-settings',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <tolle-button variant="outline" (click)="resetTheme()"> Reset to Defaults </tolle-button>
  `,
})
export class ThemeSettingsComponent {
  private themeService = inject(ThemeService);

  resetTheme(): void {
    this.themeService.clearUserPreferences();
  }
}
```

### Get User Preferences

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from '@tolle_/tolle-ui';

export class SettingsComponent {
  private themeService = inject(ThemeService);

  getPreferences(): void {
    const prefs = this.themeService.getUserPreferences();
    if (prefs) {
      console.log('Theme:', prefs.theme);
      console.log('Primary Color:', prefs.primaryColor);
      console.log('Radius:', prefs.radius);
    }
  }
}
```

## CSS Variables

The ThemeService dynamically generates and applies CSS variables:

### Primary Color Variables

| Variable                          | Description                        |
| --------------------------------- | ---------------------------------- |
| `--primary`                       | Primary color as RGB values        |
| `--primary-foreground`            | Contrast color for text on primary |
| `--primary-50` to `--primary-900` | Primary color shades               |

### Dark Mode

The service adds/removes a `.dark` class on the `<html>` element. Ensure your Tailwind CSS configuration includes:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
};
```

## Use Cases

### Persistent Theme Toggle with Local Storage

```html
<tolle-button variant="ghost" size="icon" (click)="toggleTheme()">
  <i [class]="isDark ? 'ri-sun-line' : 'ri-moon-line'"></i>
</tolle-button>
```

```typescript
// ThemeService automatically persists to localStorage
// No additional code needed - preferences are saved on change
```

### Theme Selector Component

```html
<div class="space-y-4 p-4">
  <div class="flex items-center gap-4">
    <span class="font-medium">Mode:</span>
    <tolle-button [variant]="!isDark ? 'default' : 'outline'" (click)="setLight()"
      >Light</tolle-button
    >
    <tolle-button [variant]="isDark ? 'default' : 'outline'" (click)="setDark()">Dark</tolle-button>
  </div>

  <div class="flex items-center gap-4">
    <span class="font-medium">Color:</span>
    <button
      *ngFor="let color of colors"
      (click)="setPrimaryColor(color.value)"
      class="h-8 w-8 rounded-full"
      [style.background]="color.value"></button>
  </div>

  <div class="flex items-center gap-4">
    <span class="font-medium">Radius:</span>
    <tolle-button size="sm" variant="outline" (click)="setRadius('0')">Sharp</tolle-button>
    <tolle-button size="sm" variant="outline" (click)="setRadius('0.5rem')">Default</tolle-button>
    <tolle-button size="sm" variant="outline" (click)="setRadius('1rem')">Round</tolle-button>
  </div>
</div>
```

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService, ButtonComponent } from '@tolle_/tolle-ui';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  templateUrl: './theme-selector.component.html',
})
export class ThemeSelectorComponent {
  private themeService = inject(ThemeService);

  colors = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Orange', value: '#ea580c' },
  ];

  get isDark(): boolean {
    return this.themeService.isDark;
  }

  setLight(): void {
    if (this.isDark) this.themeService.toggleTheme();
  }

  setDark(): void {
    if (!this.isDark) this.themeService.toggleTheme();
  }

  setPrimaryColor(color: string): void {
    this.themeService.setPrimaryColor(color);
  }

  setRadius(radius: string): void {
    this.themeService.setRadius(radius);
  }
}
```

## Notes

- Preferences are automatically persisted to `localStorage` with keys: `tolle-theme`, `tolle-primary-color`, `tolle-radius`
- The service is provided at root level (singleton)
- Works with SSR (checks `isPlatformBrowser` before accessing DOM/localStorage)
- Generated primary color shades follow Tailwind color conventions
