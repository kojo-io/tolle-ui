# Alert Component Usage Guide

## Overview

The Alert component displays a brief, important message in a visually prominent way. It's typically used for notifications, warnings, or important information.

## Import

```typescript
import { AlertComponent } from '@tolle_/tolle-ui';
```

## AlertComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `variant` | `'default' \| 'destructive'` | `'default'` | Alert variant style |

## Basic Usage

### Default Alert

```html
<tolle-alert class="rounded-lg">
  <i class="ri-info-line text-xl mr-2"></i>
  <div class="flex flex-col">
    <h5 class="font-semibold">Heads up!</h5>
    <p class="text-sm text-muted-foreground">
      You can add components and dependencies to your app using the cli.
    </p>
  </div>
</tolle-alert>
```

### Destructive Alert

```html
<tolle-alert variant="destructive" class="rounded-lg">
  <i class="ri-error-warning-line text-xl mr-2"></i>
  <div class="flex flex-col">
    <h5 class="font-semibold">Error</h5>
    <p class="text-sm text-destructive">
      Your session has expired. Please log in again.
    </p>
  </div>
</tolle-alert>
```

### Alert with Title and Description

```html
<tolle-alert class="flex items-start gap-4">
  <i class="ri-checkbox-circle-line text-emerald-600 text-xl mt-0.5"></i>
  <div class="flex-1">
    <h5 class="font-semibold text-foreground">Success</h5>
    <p class="text-sm text-muted-foreground mt-1">
      Your changes have been saved successfully.
    </p>
  </div>
</tolle-alert>
```

### Alert with Action Button

```html
<tolle-alert class="flex items-start gap-4">
  <i class="ri-alert-line text-amber-500 text-xl mt-0.5"></i>
  <div class="flex-1">
    <h5 class="font-semibold text-foreground">Warning</h5>
    <p class="text-sm text-muted-foreground mt-1">
      This action cannot be undone.
    </p>
  </div>
  <button class="px-3 py-1 text-sm font-medium rounded-md hover:bg-accent">
    Undo
  </button>
</tolle-alert>
```

## Alert with Close Button

```html
<tolle-alert class="relative">
  <button class="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
    <i class="ri-close-line"></i>
  </button>
  <i class="ri-info-line text-xl mr-2"></i>
  <div>
    <p class="text-sm">This alert can be dismissed.</p>
  </div>
</tolle-alert>
```

## Custom Styling

```html
<tolle-alert class="border-l-4 border-l-primary bg-primary/5">
  <i class="ri-info-line text-primary text-xl mr-3"></i>
  <div>
    <h5 class="font-semibold">Note</h5>
    <p class="text-sm mt-1">This is a custom styled alert.</p>
  </div>
</tolle-alert>
```

## Alert Variants

### Default (Info)

```html
<tolle-alert>
  <i class="ri-info-line text-primary text-xl mr-2"></i>
  <div>
    <p>Information message</p>
  </div>
</tolle-alert>
```

### Success

```html
<tolle-alert>
  <i class="ri-checkbox-circle-line text-emerald-600 text-xl mr-2"></i>
  <div>
    <p class="text-emerald-700 dark:text-emerald-400">Operation completed successfully</p>
  </div>
</tolle-alert>
```

### Destructive (Error)

```html
<tolle-alert variant="destructive">
  <i class="ri-error-warning-line text-destructive text-xl mr-2"></i>
  <div>
    <p class="text-destructive">An error occurred</p>
  </div>
</tolle-alert>
```

## Animation

The alert supports animation classes:

```html
<tolle-alert class="animate-in fade-in slide-in-from-top-2 duration-300">
  <!-- Content -->
</tolle-alert>
```
