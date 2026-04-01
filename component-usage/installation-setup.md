# Installation & Setup Guide

## Overview

Tolle UI is a modern Angular 18+ component library built with Tailwind CSS. It provides a comprehensive set of accessible, customizable components for building web applications.

## Prerequisites

Before installing Tolle UI, ensure you have the following installed:

- **Node.js**: v18.x or higher
- **Angular**: v18.2.0 or higher
- **Tailwind CSS**: v3.x (required for styling)

## Installation

### 1. Install Tolle UI and Peer Dependencies

```bash
npm install @tolle_/tolle-ui@latest date-fns@4.1.0 tailwind-merge@3.4.2 clsx@2.1.1 embla-carousel@8.5.2 @floating-ui/dom@1.7.4 class-variance-authority@0.7.1 remixicon@4.5.0
```

### 2. Install Peer Dependencies Manually (Alternative)

If you already have Angular 18 installed and only need the non-Angular dependencies:

```bash
npm install date-fns@4.1.0 tailwind-merge@3.4.2 clsx@2.1.1 embla-carousel@8.5.2 @floating-ui/dom@1.7.4 class-variance-authority@0.7.1 remixicon@4.5.0
```

## Configuration

### 1. Tailwind CSS Setup

Create or update your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  presets: [require('@tolle_/tolle-ui/preset')],
  content: ['./src/**/*.{html,ts}', './node_modules/@tolle_/tolle-ui/**/*.{html,ts,mjs,html}'],
  plugins: [],
};
```

### 2. Add Global Styles

Add the theme CSS file to your `angular.json` in the `styles` array:

```json
{
  "styles": ["src/styles.css", "node_modules/@tolle_/tolle-ui/theme.css"]
}
```

Or import it in your global `styles.css`:

```css
@import '@tolle_/tolle-ui/theme.css';
```

### 3. Configure Tolle Provider (Optional)

Configure your brand theme in `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideTolleConfig } from '@tolle_/tolle-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTolleConfig({
      primaryColor: '#2563eb', // Your brand primary color (hex)
      radius: '0.5rem', // Border radius scale
      darkByDefault: false, // Start in light mode
    }),
  ],
};
```

## Configuration Options

The `provideTolleConfig` function accepts the following options:

| Option                 | Type      | Default     | Description                                            |
| ---------------------- | --------- | ----------- | ------------------------------------------------------ |
| `primaryColor`         | `string`  | `'#2563eb'` | Primary brand color in hex format                      |
| `radius`               | `string`  | `'0.5rem'`  | Base border radius (generates sm, md, lg, xl variants) |
| `darkByDefault`        | `boolean` | `false`     | Whether to start in dark mode                          |
| `defaultToastDuration` | `number`  | `5000`      | Default toast notification duration in ms              |

### Example Configurations

#### Blue Theme

```typescript
provideTolleConfig({
  primaryColor: '#2563eb',
  radius: '0.5rem',
  darkByDefault: false,
});
```

#### Purple Theme with Larger Radius

```typescript
provideTolleConfig({
  primaryColor: '#8b5cf6',
  radius: '0.75rem',
  darkByDefault: false,
});
```

#### Green Theme with Dark Default

```typescript
provideTolleConfig({
  primaryColor: '#16a34a',
  radius: '0.25rem',
  darkByDefault: true,
});
```

#### Orange Theme

```typescript
provideTolleConfig({
  primaryColor: '#ea580c',
  radius: '1rem',
  darkByDefault: false,
});
```

## Importing Components

Import components from `@tolle_/tolle-ui`:

```typescript
import { Component } from '@angular/core';
import {
  ButtonComponent,
  InputComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
  CardFooterComponent,
} from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    CardFooterComponent,
  ],
  template: `
    <tolle-card>
      <tolle-card-header>
        <tolle-card-title>Card Title</tolle-card-title>
      </tolle-card-header>
      <tolle-card-content>
        <tolle-input placeholder="Enter text"></tolle-input>
      </tolle-card-content>
      <tolle-card-footer>
        <tolle-button>Submit</tolle-button>
      </tolle-card-footer>
    </tolle-card>
  `,
})
export class ExampleComponent {}
```

## Using the Theme Service

The `ThemeService` allows runtime theme changes:

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <tolle-button (click)="toggleTheme()">
      {{ isDark ? 'Light Mode' : 'Dark Mode' }}
    </tolle-button>

    <tolle-button (click)="setTheme('#16a34a')">Green</tolle-button>
    <tolle-button (click)="setTheme('#8b5cf6')">Purple</tolle-button>
  `,
})
export class ThemeSwitcherComponent {
  private themeService = inject(ThemeService);

  get isDark(): boolean {
    return this.themeService.isDark;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  setTheme(color: string): void {
    this.themeService.setPrimaryColor(color);
  }
}
```

### Theme Service Methods

| Method                           | Parameters                | Description                        |
| -------------------------------- | ------------------------- | ---------------------------------- |
| `toggleTheme()`                  | -                         | Toggle between light and dark mode |
| `setPrimaryColor(color: string)` | `color` (hex)             | Set primary brand color            |
| `setRadius(radius: string)`      | `radius` (e.g., '0.5rem') | Set border radius scale            |
| `isDark$`                        | `Observable<boolean>`     | Observable of dark mode state      |
| `isDark`                         | `boolean`                 | Synchronous dark mode state        |
| `currentTheme`                   | `'dark' \| 'light'`       | Current theme name                 |
| `primaryColor`                   | `string \| null`          | Current primary color              |
| `resetToConfigDefaults()`        | -                         | Reset to config defaults           |
| `clearUserPreferences()`         | -                         | Clear all saved preferences        |

## Styling

### Dark Mode

Tolle UI uses Tailwind's `darkMode: 'class'` strategy. Add `class="dark"` to your `<html>` element:

```html
<!-- For SSR or manual control -->
<html class="dark"></html>
```

Or use the `ThemeService` to programmatically manage dark mode (it automatically adds/removes the `dark` class).

### Custom CSS Variables

Override CSS variables in your global styles:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... more variables */
}
```

### Adding Icons

Tolle UI uses Remix Icon. Add the icon font to your `index.html`:

```html
<link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet" />
```

Or install via npm:

```bash
npm install remixicon
```

Then add to your `angular.json`:

```json
{
  "styles": ["node_modules/remixicon/fonts/remixicon.css"]
}
```

## Standalone Components

Tolle UI is built entirely with Angular's standalone component API. Import components directly:

```typescript
import { ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent],
  template: ` <tolle-button>Click me</tolle-button> `,
})
export class ExampleComponent {}
```

## Module-based Applications

For module-based applications, import components in your module:

```typescript
import { NgModule } from '@angular/core';
import { ButtonComponent, InputComponent } from '@tolle_/tolle-ui';

@NgModule({
  imports: [ButtonComponent, InputComponent],
})
export class MyModule {}
```

## Form Integration

Tolle UI form components support both template-driven and reactive forms:

### Template-driven Forms

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent, CheckboxComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, InputComponent, CheckboxComponent],
  template: `
    <form #form="ngForm">
      <tolle-input label="Email" [(ngModel)]="email" name="email" required> </tolle-input>

      <tolle-checkbox [(ngModel)]="agree" name="agree"> I agree to terms </tolle-checkbox>
    </form>
  `,
})
export class FormComponent {
  email = '';
  agree = false;
}
```

### Reactive Forms

```typescript
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <tolle-input label="Email" formControlName="email" placeholder="Enter email"> </tolle-input>

      <tolle-button type="submit" [disabled]="form.invalid"> Submit </tolle-button>
    </form>
  `,
})
export class FormComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

## Troubleshooting

### Styles Not Applied

1. Ensure Tailwind CSS is configured correctly
2. Verify the preset is included in `tailwind.config.js`
3. Check that `theme.css` is imported
4. Ensure content paths include the Tolle UI package

### Icons Not Showing

1. Verify Remix Icon is installed
2. Check that the CSS is loaded in `angular.json`
3. Use correct icon names (e.g., `ri-home-line`)

### Dark Mode Not Working

1. Ensure `darkMode: 'class'` is set in `tailwind.config.js`
2. Verify `ThemeService` is injected correctly
3. Check that the `dark` class is being added to `<html>`

### Component Not Found

1. Verify the component is imported correctly
2. Check that the component is added to `imports` array
3. Ensure standalone components are used with `standalone: true`

## Version Compatibility

| Tolle UI | Angular | Tailwind CSS | Node.js |
| -------- | ------- | ------------ | ------- |
| 18.x     | 18.x    | 3.x          | 18+     |
| 17.x     | 17.x    | 3.x          | 18+     |

## Next Steps

- Browse the [component documentation](./component-usage/) for individual component usage
- Check out the [Theme Service](./theme-service-usage.md) for runtime theming
- See [ALIAS.md](./ALIAS.md) for import naming conventions
