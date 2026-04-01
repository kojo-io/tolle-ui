# Sheet Component Usage Guide

## Overview

The Sheet component provides a slide-out panel that appears from the edge of the screen. It supports both declarative (template-based) and programmatic (service-based) usage, making it ideal for sidebars, drawers, forms, and additional content.

## Import

```typescript
import {
  SheetComponent,
  SheetTriggerComponent,
  SheetContentComponent,
  SheetHeaderComponent,
  SheetFooterComponent,
  SheetTitleComponent,
  SheetDescriptionComponent,
  SheetService,
  SheetRef,
} from '@tolle_/tolle-ui';
```

## SheetService

The `SheetService` allows you to open sheets programmatically.

### Methods

| Method                         | Returns       | Description                           |
| ------------------------------ | ------------- | ------------------------------------- |
| `open<R>(config: SheetConfig)` | `SheetRef<R>` | Opens a sheet and returns a reference |

## SheetConfig Interface

| Property          | Type                                      | Default   | Description                            |
| ----------------- | ----------------------------------------- | --------- | -------------------------------------- |
| `content`         | `string \| Type<any> \| TemplateRef<any>` | -         | **Required.** Content to display       |
| `title`           | `string`                                  | -         | Optional sheet title                   |
| `description`     | `string`                                  | -         | Optional sheet description             |
| `side`            | `'top' \| 'bottom' \| 'left' \| 'right'`  | `'right'` | Edge where sheet appears               |
| `hasBackdrop`     | `boolean`                                 | `true`    | Whether to show backdrop               |
| `backdropClose`   | `boolean`                                 | `true`    | Whether clicking backdrop closes sheet |
| `showCloseButton` | `boolean`                                 | `true`    | Show close button                      |
| `rounded`         | `boolean`                                 | `false`   | Rounded corners on inner edge          |
| `data`            | `{ [key: string]: any }`                  | -         | Data passed to component content       |
| `context`         | `T`                                       | -         | Context passed to template content     |
| `class`           | `string`                                  | -         | Additional CSS classes                 |

## SheetRef

The `SheetRef` is returned by `SheetService.open()`.

| Property/Method     | Type                                 | Description                             |
| ------------------- | ------------------------------------ | --------------------------------------- |
| `afterClosed$`      | `Observable<R \| undefined \| null>` | Observable that emits when sheet closes |
| `config`            | `SheetConfig`                        | The sheet configuration                 |
| `close(result?: R)` | `void`                               | Closes the sheet with optional result   |

## Declarative Usage (Template-based)

### SheetComponent Inputs

| Input         | Type      | Default | Description   |
| ------------- | --------- | ------- | ------------- |
| `isOpen`      | `boolean` | `false` | Open state    |
| `hasBackdrop` | `boolean` | `true`  | Show backdrop |

**Outputs:**

| Output         | Type                    | Description                     |
| -------------- | ----------------------- | ------------------------------- |
| `isOpenChange` | `EventEmitter<boolean>` | Emitted when open state changes |

### SheetContentComponent Inputs

| Input     | Type                                     | Default   | Description            |
| --------- | ---------------------------------------- | --------- | ---------------------- |
| `side`    | `'top' \| 'bottom' \| 'left' \| 'right'` | `'right'` | Sheet position         |
| `rounded` | `boolean`                                | `false`   | Rounded corners        |
| `class`   | `string`                                 | `''`      | Additional CSS classes |

### Basic Sheet

```html
<tolle-sheet>
  <tolle-sheet-trigger>
    <tolle-button variant="outline">Open Sheet</tolle-button>
  </tolle-sheet-trigger>
  <tolle-sheet-content side="right">
    <tolle-sheet-header>
      <tolle-sheet-title>Edit Profile</tolle-sheet-title>
      <tolle-sheet-description>
        Make changes to your profile here. Click save when you're done.
      </tolle-sheet-description>
    </tolle-sheet-header>

    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <tolle-label for="name" class="text-right">Name</tolle-label>
        <tolle-input id="name" value="Pedro Duarte" class="col-span-3"></tolle-input>
      </div>
    </div>

    <tolle-sheet-footer>
      <tolle-button type="submit">Save changes</tolle-button>
    </tolle-sheet-footer>
  </tolle-sheet-content>
</tolle-sheet>
```

### Different Positions

```html
<!-- Right side (default) -->
<tolle-button tolleSheetTrigger="right-sheet">Right Sheet</tolle-button>
<tolle-sheet #right-sheet>
  <tolle-sheet-content side="right">Right content</tolle-sheet-content>
</tolle-sheet>

<!-- Left side -->
<tolle-button tolleSheetTrigger="left-sheet">Left Sheet</tolle-button>
<tolle-sheet #left-sheet>
  <tolle-sheet-content side="left">Left content</tolle-sheet-content>
</tolle-sheet>

<!-- Top -->
<tolle-button tolleSheetTrigger="top-sheet">Top Sheet</tolle-button>
<tolle-sheet #top-sheet>
  <tolle-sheet-content side="top">Top content</tolle-sheet-content>
</tolle-sheet>

<!-- Bottom -->
<tolle-button tolleSheetTrigger="bottom-sheet">Bottom Sheet</tolle-button>
<tolle-sheet #bottom-sheet>
  <tolle-sheet-content side="bottom">Bottom content</tolle-sheet-content>
</tolle-sheet>
```

### Controlled Sheet

```html
<tolle-button (click)="openSheet()">Open Settings</tolle-button>

<tolle-sheet [(isOpen)]="isSheetOpen">
  <tolle-sheet-content side="right">
    <tolle-sheet-header>
      <tolle-sheet-title>Settings</tolle-sheet-title>
    </tolle-sheet-header>
    <!-- Content -->
  </tolle-sheet-content>
</tolle-sheet>
```

```typescript
import { Component } from '@angular/core';

@Component({
  // ...
})
export class ExampleComponent {
  isSheetOpen = false;

  openSheet() {
    this.isSheetOpen = true;
  }
}
```

## Programmatic Usage (Service-based)

### Basic String Content

```typescript
import { Component, inject } from '@angular/core';
import { SheetService, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent],
  template: ` <tolle-button (click)="showInfo()">Show Info</tolle-button> `,
})
export class ExampleComponent {
  private sheetService = inject(SheetService);

  showInfo() {
    this.sheetService.open({
      title: 'Information',
      content: 'Your request has been submitted successfully.',
      side: 'right',
    });
  }
}
```

### Template Content

```typescript
import { Component, inject } from '@angular/core';
import { SheetService, ButtonComponent, InputComponent, LabelComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent, InputComponent, LabelComponent],
  template: `
    <tolle-button (click)="openEditSheet()">Edit Profile</tolle-button>

    <ng-template #editSheet let-close="close" let-user="user">
      <div class="space-y-4 p-4">
        <h3 class="text-lg font-semibold">Edit Profile</h3>

        <div class="space-y-2">
          <tolle-label for="sheet-name">Name</tolle-label>
          <tolle-input id="sheet-name" [(ngModel)]="editedName"></tolle-input>
        </div>

        <div class="space-y-2">
          <tolle-label for="sheet-email">Email</tolle-label>
          <tolle-input id="sheet-email" type="email" [(ngModel)]="editedEmail"></tolle-input>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <tolle-button variant="outline" (click)="close()">Cancel</tolle-button>
          <tolle-button (click)="close({ name: editedName, email: editedEmail })"
            >Save</tolle-button
          >
        </div>
      </div>
    </ng-template>
  `,
})
export class ExampleComponent {
  private sheetService = inject(SheetService);

  editedName = '';
  editedEmail = '';

  openEditSheet() {
    this.editedName = 'John Doe';
    this.editedEmail = 'john@example.com';

    const ref = this.sheetService.open({
      content: this.editSheet,
      context: { user: { name: this.editedName, email: this.editedEmail } },
      side: 'right',
    });

    ref.afterClosed$.subscribe(result => {
      if (result) {
        console.log('Saved:', result);
        // Update user
      }
    });
  }
}
```

### Component Content

```typescript
// filter-sheet.component.ts
import { Component, inject } from '@angular/core';
import { SheetRef, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-filter-sheet',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="space-y-4 p-4">
      <h3 class="text-lg font-semibold">Filters</h3>

      <!-- Filter options -->
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium">Status</label>
          <select class="mt-1 w-full rounded border p-2" [(ngModel)]="filters.status">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium">Date Range</label>
          <!-- Date inputs -->
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-4">
        <tolle-button variant="outline" (click)="clearFilters()">Clear</tolle-button>
        <tolle-button (click)="applyFilters()">Apply</tolle-button>
      </div>
    </div>
  `,
})
export class FilterSheetComponent {
  private sheetRef = inject(SheetRef);

  data = this.sheetRef.config.data as { status: string };
  filters = { status: this.data?.status || '' };

  clearFilters() {
    this.filters = { status: '' };
    this.sheetRef.close({ status: '' });
  }

  applyFilters() {
    this.sheetRef.close(this.filters);
  }
}

// parent.component.ts
import { Component, inject } from '@angular/core';
import { SheetService, ButtonComponent } from '@tolle_/tolle-ui';
import { FilterSheetComponent } from './filter-sheet.component';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [ButtonComponent],
  template: ` <tolle-button (click)="openFilters()">Open Filters</tolle-button> `,
})
export class ParentComponent {
  private sheetService = inject(SheetService);

  openFilters() {
    const ref = this.sheetService.open({
      content: FilterSheetComponent,
      data: { status: 'active' },
      side: 'left',
    });

    ref.afterClosed$.subscribe(filters => {
      if (filters) {
        this.applyFilters(filters);
      }
    });
  }

  applyFilters(filters: any) {
    // Apply filters to data
  }
}
```

## Use Cases

### Settings Panel (Right)

```typescript
openSettings() {
  const ref = this.sheetService.open({
    title: 'Settings',
    content: SettingsComponent,
    side: 'right',
    size: 'lg'
  });
}
```

### Mobile Navigation (Left)

```typescript
openMobileNav() {
  const ref = this.sheetService.open({
    content: MobileNavComponent,
    side: 'left',
    backdropClose: true,
    showCloseButton: true
  });
}
```

### Action Sheet (Bottom)

```typescript
openActions() {
  this.sheetService.open({
    title: 'Choose Action',
    content: `
      <div class="space-y-2">
        <button (click)="share()" class="w-full text-left p-3 hover:bg-muted rounded">Share</button>
        <button (click)="copy()" class="w-full text-left p-3 hover:bg-muted rounded">Copy Link</button>
        <button (click)="delete()" class="w-full text-left p-3 text-destructive hover:bg-destructive/10 rounded">Delete</button>
      </div>
    `,
    side: 'bottom',
    rounded: true
  });
}
```

### Cart Preview (Right)

```typescript
openCart() {
  this.sheetService.open({
    title: 'Shopping Cart',
    content: CartComponent,
    data: { items: this.cartItems },
    side: 'right',
    showCloseButton: true
  });
}
```

### Full-height Form (Left)

```typescript
openForm() {
  const ref = this.sheetService.open({
    title: 'Create New Item',
    content: CreateItemFormComponent,
    side: 'left',
    backdropClose: false,
    showCloseButton: true
  });

  ref.afterClosed$.subscribe(result => {
    if (result) {
      this.items.push(result);
    }
  });
}
```

### Non-Closable Sheet

```typescript
openRequiredForm() {
  this.sheetService.open({
    title: 'Complete Your Profile',
    content: ProfileFormComponent,
    side: 'right',
    backdropClose: false,
    showCloseButton: false
  });

  // User must complete the form to dismiss
}
```

## Accessibility

The Sheet component follows WAI-ARIA dialog pattern:

- **Roles**: Uses `role="dialog"` and `aria-modal="true"`.
- **Labels**:
  - Use `<tolle-sheet-title>` for the dialog title (required)
  - Use `<tolle-sheet-description>` for additional context
- **Keyboard Navigation**:
  - Escape: Close the sheet
  - Tab/Shift+Tab: Navigate between focusable elements within the sheet
- **Focus Management**:
  - Focus is automatically trapped within the sheet when opened
  - Focus moves to the sheet when opened
  - Focus returns to the trigger element when the sheet is closed
- **Screen Readers**:
  - Background content is marked as `inert` when sheet is open
  - Title and description are announced when sheet opens
- **Backdrop**: Click on backdrop to close (configurable via `hasBackdrop` and `backdropClose`)

## Sides Reference

| Side     | Direction          | Use Case                       |
| -------- | ------------------ | ------------------------------ |
| `right`  | Slides from right  | Settings, forms, detail panels |
| `left`   | Slides from left   | Navigation, filters            |
| `top`    | Slides from top    | Notifications, alerts          |
| `bottom` | Slides from bottom | Action sheets, mobile menus    |
