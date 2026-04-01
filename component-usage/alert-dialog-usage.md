# Alert Dialog Component Usage Guide

## Overview

The AlertDialog component is a modal dialog used for user confirmations, important messages, or actions requiring explicit user consent. It supports both declarative (template-based) and programmatic (service-based) usage.

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
  AlertDialogCancelComponent,
  AlertDialogService,
  AlertDialogRef,
} from '@tolle_/tolle-ui';
```

## AlertDialogService

The `AlertDialogService` allows you to open alert dialogs programmatically without declaring them in your template.

### Methods

| Method                            | Returns                   | Description                                            |
| --------------------------------- | ------------------------- | ------------------------------------------------------ |
| `open(config: AlertDialogConfig)` | `AlertDialogRef<boolean>` | Opens an alert dialog with the specified configuration |

### AlertDialogConfig Interface

| Property      | Type                                                               | Default      | Description                              |
| ------------- | ------------------------------------------------------------------ | ------------ | ---------------------------------------- |
| `title`       | `string`                                                           | -            | **Required.** Dialog title               |
| `description` | `string`                                                           | -            | **Required.** Dialog description/message |
| `cancelText`  | `string`                                                           | `'Cancel'`   | Text for the cancel button               |
| `actionText`  | `string`                                                           | `'Continue'` | Text for the action button               |
| `variant`     | `'default' \| 'destructive'`                                       | `'default'`  | Visual variant of the action button      |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full' \| 'fit'` | `'sm'`       | Dialog size                              |

### AlertDialogRef

The `AlertDialogRef` is returned by `AlertDialogService.open()` and provides control over the dialog.

| Property/Method          | Type                  | Description                                                                           |
| ------------------------ | --------------------- | ------------------------------------------------------------------------------------- |
| `afterClosed$`           | `Observable<boolean>` | Observable that emits when dialog closes (true if action clicked, false if cancelled) |
| `close(result: boolean)` | `void`                | Programmatically closes the dialog                                                    |

## Declarative Usage (Template-based)

### AlertDialogComponent

**Inputs:**

| Input          | Type                    | Default | Description                            |
| -------------- | ----------------------- | ------- | -------------------------------------- |
| `open`         | `boolean`               | `false` | Controls dialog visibility             |
| `onOpenChange` | `EventEmitter<boolean>` | -       | Emitted when dialog open state changes |

### AlertDialogTriggerComponent

Button or element that opens the dialog.

### AlertDialogPortalComponent

Renders the dialog in an overlay portal.

### AlertDialogContentComponent

**Inputs:**

| Input   | Type                                                 | Default | Description            |
| ------- | ---------------------------------------------------- | ------- | ---------------------- |
| `class` | `string`                                             | `''`    | Additional CSS classes |
| `size`  | `'xs'\|'sm'\|'md'\|'lg'\|'xl'\|'2xl'\|'full'\|'fit'` | `'sm'`  | Dialog size            |

### AlertDialogHeaderComponent, AlertDialogFooterComponent, AlertDialogTitleComponent, AlertDialogDescriptionComponent

Container components for structuring the dialog content.

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

### AlertDialogActionComponent, AlertDialogCancelComponent

Container for action/cancel buttons.

### Basic Declarative Example

```html
<tolle-alert-dialog>
  <tolle-alert-dialog-trigger>
    <tolle-button variant="outline">Delete Account</tolle-button>
  </tolle-alert-dialog-trigger>
  <tolle-alert-dialog-portal>
    <tolle-alert-dialog-content>
      <tolle-alert-dialog-header>
        <tolle-alert-dialog-title>Are you absolutely sure?</tolle-alert-dialog-title>
        <tolle-alert-dialog-description>
          This action cannot be undone. This will permanently delete your account and remove your
          data from our servers.
        </tolle-alert-dialog-description>
      </tolle-alert-dialog-header>
      <tolle-alert-dialog-footer>
        <tolle-alert-dialog-cancel>
          <tolle-button variant="outline" class="w-full sm:w-auto">Cancel</tolle-button>
        </tolle-alert-dialog-cancel>
        <tolle-alert-dialog-action>
          <tolle-button variant="destructive" class="w-full sm:w-auto">Continue</tolle-button>
        </tolle-alert-dialog-action>
      </tolle-alert-dialog-footer>
    </tolle-alert-dialog-content>
  </tolle-alert-dialog-portal>
</tolle-alert-dialog>
```

## Programmatic Usage (Service-based)

### Basic Confirmation

```typescript
import { Component, inject } from '@angular/core';
import { AlertDialogService, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <tolle-button variant="destructive" (click)="confirmDelete()"> Delete Account </tolle-button>
  `,
})
export class ExampleComponent {
  private alertDialogService = inject(AlertDialogService);

  confirmDelete() {
    const ref = this.alertDialogService.open({
      title: 'Delete Account',
      description:
        'This action cannot be undone. Your account and all data will be permanently removed.',
      variant: 'destructive',
      actionText: 'Delete',
      cancelText: 'Cancel',
    });

    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.deleteAccount();
      }
    });
  }

  deleteAccount() {
    // Handle deletion
  }
}
```

### Different Sizes

```typescript
// Small alert (mobile-friendly)
this.alertDialogService.open({
  title: 'Success',
  description: 'Your changes have been saved.',
  size: 'xs',
});

// Large dialog for complex content
this.alertDialogService.open({
  title: 'Confirm Export',
  description: 'You are about to export 1,234 records. This may take a few minutes.',
  size: 'lg',
  actionText: 'Export',
});

// Fit content size
this.alertDialogService.open({
  title: 'Quick Info',
  description: 'The system will be down for maintenance in 10 minutes.',
  size: 'fit',
});
```

### Info Dialog

```typescript
showInfo() {
  this.alertDialogService.open({
    title: 'Update Available',
    description: 'A new version of the application is available. Please refresh to update.',
    variant: 'default',
    actionText: 'Refresh Now',
    cancelText: 'Later'
  });
}
```

### Warning Dialog

```typescript
warnUnsavedChanges() {
  const ref = this.alertDialogService.open({
    title: 'Unsaved Changes',
    description: 'You have unsaved changes. If you leave, your changes will be lost.',
    variant: 'destructive',
    actionText: 'Discard Changes',
    cancelText: 'Keep Editing'
  });

  ref.afterClosed$.subscribe(discard => {
    if (discard) {
      this.navigateAway();
    }
  });
}
```

### Chained Confirmations

```typescript
async deleteMultipleItems() {
  const itemIds = [1, 2, 3];

  for (const id of itemIds) {
    const ref = this.alertDialogService.open({
      title: `Delete Item ${id}?`,
      description: 'This action cannot be undone.',
      actionText: 'Delete',
      variant: 'destructive'
    });

    const confirmed = await firstValueFrom(ref.afterClosed$);
    if (!confirmed) break;

    await this.deleteItem(id);
  }
}
```

## Accessibility

The Alert Dialog component follows WAI-ARIA alertdialog pattern:

- **Roles**: Uses `role="alertdialog"` and `aria-modal="true"`
- **Labels**: `aria-labelledby` references the dialog title, `aria-describedby` references the description
- **Keyboard Navigation**:
  - Escape: Closes the dialog (triggers cancel)
  - Tab/Shift+Tab: Navigate between buttons within the dialog
- **Focus Management**:
  - Focus is trapped within the dialog when open
  - Focus automatically moves to the dialog content
  - Focus returns to the trigger element when closed
- **Screen Readers**:
  - The `aria-modal="true"` attribute hides background content from screen readers
  - The title and description are announced when the dialog opens

## Sizes Reference

| Size   | Width        | Use Case               |
| ------ | ------------ | ---------------------- |
| `xs`   | 320px        | Mobile alerts          |
| `sm`   | 425px        | Standard confirmations |
| `md`   | 500px        | Default size           |
| `lg`   | 90% / 1024px | Forms, complex content |
| `xl`   | 90% / 1200px | Large content          |
| `2xl`  | 90% / 1400px | Extra large content    |
| `full` | 100vw        | Fullscreen dialogs     |
| `fit`  | Auto         | Fit to content         |
