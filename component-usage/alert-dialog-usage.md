# Alert Dialog Component Usage Guide

## Overview

The AlertDialog component is a modal dialog used for user confirmations, important messages, or actions requiring explicit user consent. It includes a service for programmatic control.

## Import

```typescript
import {
  AlertDialogComponent,
  AlertDialogTriggerComponent,
  AlertDialogPortalComponent,
  AlertDialogContentComponent,
  AlertDialogHeaderComponent,
  AlertDialogFooterComponent,
  AlertDialogTitleComponent,
  AlertDialogDescriptionComponent,
  AlertDialogActionComponent,
  AlertDialogCancelComponent
} from '@tolle_/tolle-ui';
import { AlertDialogService } from '@tolle_/tolle-ui';
```

## Components

### AlertDialogComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls dialog visibility |
| `onOpenChange` | `EventEmitter<boolean>` | - | Emitted when dialog open state changes |

### AlertDialogTriggerComponent

Button or element that opens the dialog.

### AlertDialogPortalComponent

Renders the dialog in an overlay portal.

### AlertDialogContentComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `size` | `'xs'\|'sm'\|'md'\|'lg'\|'xl'\|'2xl'\|'full'\|'fit'` | `'sm'` | Dialog size |

### AlertDialogHeaderComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### AlertDialogFooterComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### AlertDialogTitleComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### AlertDialogDescriptionComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### AlertDialogActionComponent

Container for action buttons.

### AlertDialogCancelComponent

Container for cancel button.

## Basic Usage

### Simple Confirmation Dialog

```html
<tolle-alert-dialog>
  <tolle-alert-dialog-trigger>
    <button>Delete Account</button>
  </tolle-alert-dialog-trigger>

  <tolle-alert-dialog-portal>
    <tolle-alert-dialog-content class="sm:max-w-[425px]">
      <tolle-alert-dialog-header>
        <tolle-alert-dialog-title>Are you sure?</tolle-alert-dialog-title>
        <tolle-alert-dialog-description>
          This action cannot be undone. This will permanently delete your account.
        </tolle-alert-dialog-description>
      </tolle-alert-dialog-header>

      <tolle-alert-dialog-footer>
        <tolle-alert-dialog-cancel>
          <button variant="outline">Cancel</button>
        </tolle-alert-dialog-cancel>
        <tolle-alert-dialog-action>
          <button variant="destructive">Delete</button>
        </tolle-alert-dialog-action>
      </tolle-alert-dialog-footer>
    </tolle-alert-dialog-content>
  </tolle-alert-dialog-portal>
</tolle-alert-dialog>
```

### Destructive Action Dialog

```html
<tolle-alert-dialog>
  <tolle-alert-dialog-trigger>
    <button variant="destructive">Remove Item</button>
  </tolle-alert-dialog-trigger>

  <tolle-alert-dialog-portal>
    <tolle-alert-dialog-content>
      <tolle-alert-dialog-header>
        <tolle-alert-dialog-title>Remove Item</tolle-alert-dialog-title>
        <tolle-alert-dialog-description>
          Are you sure you want to remove this item from your cart?
        </tolle-alert-dialog-description>
      </tolle-alert-dialog-header>

      <tolle-alert-dialog-footer>
        <tolle-alert-dialog-cancel>
          <button variant="outline">Keep</button>
        </tolle-alert-dialog-cancel>
        <tolle-alert-dialog-action>
          <button variant="destructive">Remove</button>
        </tolle-alert-dialog-action>
      </tolle-alert-dialog-footer>
    </tolle-alert-dialog-content>
  </tolle-alert-dialog-portal>
</tolle-alert-dialog>
```

## Programmatic Control with AlertDialogService

### Opening a Dialog

```typescript
import { AlertDialogService, AlertDialogConfig } from '@tolle_/tolle-ui';

export class MyComponent {
  constructor(private alertDialogService: AlertDialogService) {}

  openDialog() {
    const config: AlertDialogConfig = {
      title: 'Confirm Action',
      description: 'This action cannot be undone.',
      cancelText: 'Cancel',
      actionText: 'Confirm',
      variant: 'default', // 'default' or 'destructive'
      size: 'md' // 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full', 'fit'
    };

    this.alertDialogService.open(config);
  }
}
```

### Using the After Closed Observable

```typescript
const dialogRef = this.alertDialogService.open(config);

dialogRef.afterClosed$.subscribe(result => {
  if (result) {
    // User clicked the action button
    console.log('Action confirmed');
  } else {
    // User clicked cancel or closed the dialog
    console.log('Action cancelled');
  }
});
```

## Dialog Sizes

```html
<!-- Extra Small -->
<tolle-alert-dialog-content size="xs">...</tolle-alert-dialog-content>

<!-- Small (default) -->
<tolle-alert-dialog-content size="sm">...</tolle-alert-dialog-content>

<!-- Medium -->
<tolle-alert-dialog-content size="md">...</tolle-alert-dialog-content>

<!-- Large -->
<tolle-alert-dialog-content size="lg">...</tolle-alert-dialog-content>

<!-- Extra Large -->
<tolle-alert-dialog-content size="xl">...</tolle-alert-dialog-content>

<!-- 2X Large -->
<tolle-alert-dialog-content size="2xl">...</tolle-alert-dialog-content>

<!-- Full Screen -->
<tolle-alert-dialog-content size="full">...</tolle-alert-dialog-content>

<!-- Fit Content -->
<tolle-alert-dialog-content size="fit">...</tolle-alert-dialog-content>
```

## Custom Styling

### Rounded Dialog

```html
<tolle-alert-dialog-content class="rounded-lg">
  <!-- Content -->
</tolle-alert-dialog-content>
```

### Full Width Dialog

```html
<tolle-alert-dialog-content size="full" class="h-screen w-screen rounded-none">
  <!-- Content -->
</tolle-alert-dialog-content>
```

### Custom Header

```html
<tolle-alert-dialog-header class="border-b bg-muted/50 p-6">
  <tolle-alert-dialog-title class="text-xl">Custom Title</tolle-alert-dialog-title>
  <tolle-alert-dialog-description class="text-muted-foreground">
    Custom description
  </tolle-alert-dialog-description>
</tolle-alert-dialog-header>
```

### Custom Footer

```html
<tolle-alert-dialog-footer class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
  <button variant="outline">Cancel</button>
  <button variant="default">Confirm</button>
</tolle-alert-dialog-footer>
```

## Dynamic Content

### Using TemplateRef

```typescript
@ViewChild('dialogTemplate', { static: true }) dialogTemplate!: TemplateRef<any>;

openDialogWithTemplate() {
  const config: AlertDialogConfig = {
    title: 'Template Dialog',
    content: this.dialogTemplate,
    actionText: 'Close'
  };
  this.alertDialogService.open(config);
}
```

### Passing Context

```typescript
const context = { user: this.user, action: 'delete' };
const config: AlertDialogConfig = {
  title: 'Delete User',
  description: `Are you sure you want to delete ${this.user.name}?`,
  actionText: 'Delete',
  context
};
```

## Accessibility Features

- Keyboard navigation (Enter, Space, Escape)
- Focus management
- ARIA attributes for screen readers
- Backdrop click to close (configurable)
