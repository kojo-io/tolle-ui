# Alert Component Usage Guide

## Overview

The Alert component displays a brief, important message in a visually prominent way. It supports multiple variants for different use cases and can be dismissible.

## Import

```typescript
import { AlertComponent } from '@tolle_/tolle-ui';
```

## AlertComponent

**Selector:** `tolle-alert`

**Inputs:**

| Input         | Type                                                             | Default     | Description                          |
| ------------- | ---------------------------------------------------------------- | ----------- | ------------------------------------ |
| `variant`     | `'default' \| 'destructive' \| 'success' \| 'warning' \| 'info'` | `'default'` | Alert variant style                  |
| `title`       | `string \| undefined`                                            | `undefined` | Optional title displayed prominently |
| `dismissible` | `boolean`                                                        | `false`     | Whether the alert can be dismissed   |
| `class`       | `string`                                                         | `''`        | Additional CSS classes               |

**Outputs:**

| Output    | Type                 | Description                         |
| --------- | -------------------- | ----------------------------------- |
| `onClose` | `EventEmitter<void>` | Emitted when the alert is dismissed |

## Variants

| Variant       | Use Case                        |
| ------------- | ------------------------------- |
| `default`     | General information             |
| `destructive` | Errors, critical warnings       |
| `success`     | Success messages, confirmations |
| `warning`     | Warnings, caution messages      |
| `info`        | Informational messages          |

## Basic Usage

### Default Alert

```html
<tolle-alert>
  <i icon class="ri-information-line"></i>
  This is an informational alert message.
</tolle-alert>
```

### Success Alert

```html
<tolle-alert variant="success" title="Success">
  <i icon class="ri-check-line"></i>
  Your changes have been saved successfully.
</tolle-alert>
```

### Warning Alert

```html
<tolle-alert variant="warning" title="Warning">
  <i icon class="ri-alert-line"></i>
  Please backup your data before proceeding to avoid data loss.
</tolle-alert>
```

### Destructive Alert

```html
<tolle-alert variant="destructive" title="Error">
  <i icon class="ri-error-warning-line"></i>
  Failed to save changes. Please try again.
</tolle-alert>
```

### Info Alert

```html
<tolle-alert variant="info" title="Note">
  <i icon class="ri-lightbulb-line"></i>
  You can customize your preferences in the settings page.
</tolle-alert>
```

### Dismissible Alert

```html
<tolle-alert variant="success" title="Welcome!" [dismissible]="true" (onClose)="onAlertClose()">
  <i icon class="ri-check-line"></i>
  Thanks for signing up!
</tolle-alert>
```

```typescript
import { Component } from '@angular/core';
import { AlertComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [AlertComponent],
  template: `...`,
})
export class ExampleComponent {
  onAlertClose() {
    console.log('Alert was dismissed');
  }
}
```

### Alert with Title

```html
<tolle-alert variant="warning" title="Warning">
  <i icon class="ri-alert-line"></i>
  Your session will expire in 5 minutes due to inactivity.
</tolle-alert>
```

### Alert Without Icon

```html
<tolle-alert variant="info" title="Note">
  This is an alert with just a title and message.
</tolle-alert>
```

### Conditional Alert

```html
@if (showAlert) {
<tolle-alert variant="destructive" [dismissible]="true" (onClose)="showAlert = false">
  <i icon class="ri-error-warning-line"></i>
  An error occurred while processing your request.
</tolle-alert>
}

<tolle-button (click)="showAlert = true">Show Alert</tolle-button>
```

```typescript
import { Component } from '@angular/core';
import { AlertComponent, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [AlertComponent, ButtonComponent],
  template: `...`,
})
export class ExampleComponent {
  showAlert = false;
}
```

## Use Cases

### Form Validation Alert

```html
@for (error of errors; track error.field) {
<tolle-alert variant="destructive" class="mb-2">
  <i icon class="ri-error-warning-line"></i>
  <strong>{{ error.field }}:</strong> {{ error.message }}
</tolle-alert>
}
```

### Network Status Alert

```html
@if (!isOnline) {
<tolle-alert variant="warning" [dismissible]="false">
  <i icon class="ri-wifi-off-line"></i>
  You are currently offline. Some features may not be available.
</tolle-alert>
}
```

### Feature Announcement

```html
<tolle-alert variant="info" [dismissible]="true" title="New Feature!">
  <i icon class="ri-gift-line"></i>
  Check out our new dark mode feature in settings.
</tolle-alert>
```

### Rate Limit Warning

```html
<tolle-alert variant="warning" [dismissible]="true">
  <i icon class="ri-time-line"></i>
  API rate limit exceeded. Please wait 60 seconds before retrying.
</tolle-alert>
```

## Styling

The Alert component uses the following default classes:

- Container: `rounded-md border text-card-foreground shadow`
- Default variant: `bg-background border-border`
- Destructive: `bg-destructive/10 border-destructive text-destructive`
- Success: `bg-green-500/10 border-green-500 text-green-700 dark:text-green-400`
- Warning: `bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400`
- Info: `bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400`
