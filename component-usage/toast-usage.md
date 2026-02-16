# Toast Component Usage Guide

## Overview

The Toast component displays brief, non-blocking notifications at the edge of the screen. The Toaster component renders the toasts, while the ToastService manages toast creation and display.

## Import

```typescript
import {
  ToastContainerComponent,
  ToastService
} from '@tolle_/tolle-ui';
```

## ToastService

**Methods:**

| Method | Parameters | Description |
|--------|------------|-------------|
| `show` | `toast: Omit<Toast, 'id' \| 'remainingTime' \| 'isPaused'>` | Show a new toast |
| `remove` | `id: number` | Remove a specific toast |
| `setPaused` | `id: number, paused: boolean` | Pause/unpause a toast timer |

## Toast Interface

| Property | Type | Description |
|----------|------|-------------|
| `id` | `number` | Unique identifier (auto-generated) |
| `title` | `string` | Toast title |
| `description` | `string` | Toast message |
| `variant` | `'default'\|'destructive'\|'success'` | Toast style variant |
| `duration` | `number` | Custom duration in ms |
| `remainingTime` | `number` | Time remaining (auto-managed) |
| `isPaused` | `boolean` | Whether timer is paused |

## ToastContainerComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `position` | `'top-right'\|'top-left'\|'bottom-right'\|'bottom-left'\|'top-center'\|'bottom-center'` | `'bottom-right'` | Toast position |

## Basic Usage

### Simple Toast

```typescript
import { ToastService } from '@tolle_/tolle-ui';

constructor(private toastService: ToastService) {}

showToast() {
  this.toastService.show({
    title: 'Success',
    description: 'Your changes have been saved.',
    variant: 'default'
  });
}
```

### Toast with Title

```typescript
this.toastService.show({
  title: 'Notification',
  description: 'New message received'
});
```

### Toast with Only Description

```typescript
this.toastService.show({
  description: 'Action completed successfully'
});
```

## Toast Variants

### Default Toast

```typescript
this.toastService.show({
  title: 'Info',
  description: 'This is an informational message.',
  variant: 'default'
});
```

### Success Toast

```typescript
this.toastService.show({
  title: 'Success',
  description: 'File uploaded successfully.',
  variant: 'success'
});
```

### Destructive (Error) Toast

```typescript
this.toastService.show({
  title: 'Error',
  description: 'Failed to load data.',
  variant: 'destructive'
});
```

## Toast with Duration

### Custom Duration

```typescript
this.toastService.show({
  title: 'Temporary',
  description: 'This toast closes in 5 seconds.',
  variant: 'default',
  duration: 5000
});
```

### Longer Duration

```typescript
this.toastService.show({
  title: 'Long Notification',
  description: 'This will stay for 10 seconds.',
  duration: 10000
});
```

### Permanent Toast

```typescript
this.toastService.show({
  title: 'Important',
  description: 'This won\'t auto-close.',
  duration: 0  // No auto-close
});
```

## Toast Position

### Top Right (Default)

```html
<tolle-toaster position="top-right"></tolle-toaster>
```

### Top Left

```html
<tolle-toaster position="top-left"></tolle-toaster>
```

### Bottom Left

```html
<tolle-toaster position="bottom-left"></tolle-toaster>
```

### Bottom Right (Default)

```html
<tolle-toaster position="bottom-right"></tolle-toaster>
```

### Top Center

```html
<tolle-toaster position="top-center"></tolle-toaster>
```

### Bottom Center

```html
<tolle-toaster position="bottom-center"></tolle-toaster>
```

## Toast in Application

### App Template

```html
<!-- app.component.html -->
<router-outlet></router-outlet>
<tolle-toaster position="bottom-right"></tolle-toaster>
```

### Toast on Action

```typescript
saveSettings() {
  this.settingsService.save(this.settings).subscribe({
    next: () => {
      this.toastService.show({
        title: 'Settings Saved',
        description: 'Your settings have been updated.',
        variant: 'success'
      });
    },
    error: () => {
      this.toastService.show({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive'
      });
    }
  });
}
```

### Toast with Action

```typescript
showUndoToast() {
  const id = Date.now();
  this.toastService.show({
    id,
    title: 'Item deleted',
    description: 'Click undo to restore.',
    variant: 'default'
  });

  // Add a custom action button
  setTimeout(() => {
    // Custom implementation for action button
  }, 0);
}
```

## Toast Service Methods

### Remove Toast

```typescript
const toastId = Date.now();
this.toastService.show({
  id: toastId,
  title: 'Temporary',
  description: 'This will be removed programmatically.'
});

// Remove after 2 seconds
setTimeout(() => {
  this.toastService.remove(toastId);
}, 2000);
```

### Pause/Resume

```typescript
const toastId = Date.now();
this.toastService.show({
  id: toastId,
  title: 'Hover to pause',
  description: 'Move mouse over to pause timer.'
});

// Pause the toast
this.toastService.setPaused(toastId, true);

// Resume the toast
this.toastService.setPaused(toastId, false);
```

## Multiple Toasts

### Stacked Toasts

```typescript
showMultipleToasts() {
  this.toastService.show({
    title: 'First',
    description: 'First toast message.'
  });

  setTimeout(() => {
    this.toastService.show({
      title: 'Second',
      description: 'Second toast message.'
    });
  }, 1000);

  setTimeout(() => {
    this.toastService.show({
      title: 'Third',
      description: 'Third toast message.'
    });
  }, 2000);
}
```

## Toast in Form

### Form Submission Toasts

```typescript
onSubmit() {
  this.isLoading = true;

  this.formService.submit(this.form.value).subscribe({
    next: () => {
      this.isLoading = false;
      this.toastService.show({
        title: 'Success',
        description: 'Form submitted successfully.',
        variant: 'success'
      });
    },
    error: (error) => {
      this.isLoading = false;
      this.toastService.show({
        title: 'Error',
        description: error.message || 'Failed to submit form.',
        variant: 'destructive'
      });
    }
  });
}
```

## Toast with Custom Styling

### Custom Toast Component

```typescript
@Component({
  template: `
    <div [class]="cn(
      'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg',
      'bg-background text-foreground border-border',
      getVariantClasses(toast.variant)
    )">
      <i *ngIf="toast.variant && icons[toast.variant]" [class]="cn('text-lg', icons[toast.variant])"></i>
      <div class="flex-1">
        <div *ngIf="toast.title" class="text-sm font-semibold">{{ toast.title }}</div>
        <div class="text-xs opacity-90">{{ toast.description }}</div>
      </div>
      <button (click)="toastService.remove(toast.id)" class="opacity-50 hover:opacity-100">
        <i class="ri-close-line text-lg"></i>
      </button>
      <div
        class="absolute bottom-0 left-0 h-1 transition-all duration-100"
        [style.width.%]="(toast.remainingTime / (toast.duration || 3000)) * 100"
        [class]="getProgressClasses(toast.variant)"
      ></div>
    </div>
  `
})
export class CustomToastComponent {
  // Custom toast component implementation
}
```

## Toast Queue

### Sequential Toasts

```typescript
showQueue() {
  const toasts = [
    { title: 'Processing', description: 'Starting process...' },
    { title: 'Step 1', description: 'Completed step 1' },
    { title: 'Step 2', description: 'Completed step 2' },
    { title: 'Complete', description: 'All steps finished.' }
  ];

  toasts.forEach((toast, index) => {
    setTimeout(() => {
      this.toastService.show(toast);
    }, index * 1500);
  });
}
```
