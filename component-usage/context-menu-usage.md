# Context Menu Component Usage Guide

## Overview

The Context Menu component provides a right-click context menu with support for items, submenus, separators, keyboard navigation, and custom actions. It's ideal for providing quick actions on elements like tables, files, or images.

## Import

```typescript
import {
  ContextMenuComponent,
  ContextMenuTriggerDirective,
  ContextMenuService,
} from '@tolle_/tolle-ui';
```

## Components

### ContextMenuComponent

Renders the context menu dropdown.

### ContextMenuTriggerDirective

**Selector:** `[tolleContextMenuTrigger]`

**Inputs:**

| Input                     | Type                | Default | Description         |
| ------------------------- | ------------------- | ------- | ------------------- |
| `tolleContextMenuTrigger` | `ContextMenuItem[]` | -       | Array of menu items |

**Outputs:**

| Output   | Type                   | Description                       |
| -------- | ---------------------- | --------------------------------- |
| `action` | `EventEmitter<string>` | Emitted when an action is clicked |

## ContextMenuItem Interface

| Property      | Type                                 | Default     | Description                                       |
| ------------- | ------------------------------------ | ----------- | ------------------------------------------------- |
| `id`          | `string`                             | -           | Unique identifier for the action                  |
| `label`       | `string`                             | -           | Display text                                      |
| `icon`        | `string`                             | -           | Optional icon class (e.g., 'ri-edit-line')        |
| `disabled`    | `boolean`                            | `false`     | Whether item is disabled                          |
| `destructive` | `boolean`                            | `false`     | Whether item is destructive (red text)            |
| `separator`   | `boolean`                            | `false`     | Whether to show as separator                      |
| `submenu`     | `ContextMenuItem[]`                  | -           | Optional submenu items                            |
| `shortcut`    | `string`                             | -           | Optional keyboard shortcut display                |
| `checked`     | `boolean`                            | `false`     | Whether item is checked (for checkbox/radio type) |
| `type`        | `'default' \| 'checkbox' \| 'radio'` | `'default'` | Item type                                         |

## Basic Usage

### Simple Context Menu

```typescript
import { Component } from '@angular/core';
import {
  ContextMenuComponent,
  ContextMenuTriggerDirective,
  ButtonComponent,
} from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ContextMenuComponent, ContextMenuTriggerDirective, ButtonComponent],
  template: `
    <div
      [tolleContextMenuTrigger]="menuItems"
      (action)="onAction($event)"
      class="flex h-[200px] w-full cursor-context-menu flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm transition-colors hover:bg-muted/50">
      <i class="ri-mouse-line mb-3 text-4xl text-muted-foreground"></i>
      <span class="font-medium text-foreground">Right click here</span>
      <span class="mt-1 text-xs text-muted-foreground">To see the context menu</span>
    </div>

    <div class="mt-4 rounded-lg border border-border bg-card p-3">
      <span class="text-sm font-semibold text-foreground">Last Action:</span>
      <code class="ml-2 rounded bg-secondary px-2 py-1 font-mono text-xs text-secondary-foreground">
        {{ lastAction || 'None' }}
      </code>
    </div>
  `,
})
export class ExampleComponent {
  menuItems: ContextMenuItem[] = [
    { id: 'edit', label: 'Edit', icon: 'ri-edit-line' },
    { id: 'copy', label: 'Copy', icon: 'ri-file-copy-line', shortcut: '⌘C' },
    { id: 'paste', label: 'Paste', icon: 'ri-clipboard-line', shortcut: '⌘V' },
    { separator: true, id: 'sep1' },
    { id: 'delete', label: 'Delete', icon: 'ri-delete-bin-line', destructive: true },
  ];

  lastAction = '';

  onAction(actionId: string) {
    this.lastAction = actionId;
    console.log('Action:', actionId);
  }
}
```

### Context Menu with Submenus

```typescript
import { Component } from '@angular/core';
import { ContextMenuItem } from '@tolle_/tolle-ui';

@Component({
  // ...
})
export class ExampleComponent {
  menuItems: ContextMenuItem[] = [
    { id: 'new', label: 'New File', icon: 'ri-file-add-line' },
    { id: 'new-folder', label: 'New Folder', icon: 'ri-folder-add-line' },
    { separator: true, id: 'sep1' },
    {
      id: 'sort',
      label: 'Sort By',
      icon: 'ri-sort-asc',
      submenu: [
        { id: 'sort-name', label: 'Name' },
        { id: 'sort-date', label: 'Date Modified' },
        { id: 'sort-size', label: 'Size' },
        { id: 'sort-type', label: 'Type' },
      ],
    },
    {
      id: 'view',
      label: 'View',
      icon: 'ri-eye-line',
      submenu: [
        { id: 'view-grid', label: 'Grid View', icon: 'ri-grid-line' },
        { id: 'view-list', label: 'List View', icon: 'ri-list-check' },
        { separator: true, id: 'sep-view' },
        { id: 'view-details', label: 'Details', icon: 'ri-file-list-line' },
      ],
    },
    { separator: true, id: 'sep2' },
    { id: 'delete', label: 'Delete', icon: 'ri-delete-bin-line', destructive: true },
  ];
}
```

### Checkbox and Radio Items

```typescript
import { Component } from '@angular/core';
import { ContextMenuItem } from '@tolle_/tolle-ui';

@Component({
  // ...
})
export class ExampleComponent {
  menuItems: ContextMenuItem[] = [
    {
      id: 'show-hidden',
      label: 'Show Hidden Files',
      type: 'checkbox',
      checked: false,
    },
    {
      id: 'show-extensions',
      label: 'Show File Extensions',
      type: 'checkbox',
      checked: true,
    },
    { separator: true, id: 'sep1' },
    {
      id: 'sort-name',
      label: 'Sort by Name',
      type: 'radio',
      checked: true,
    },
    {
      id: 'sort-date',
      label: 'Sort by Date',
      type: 'radio',
      checked: false,
    },
    {
      id: 'sort-size',
      label: 'Sort by Size',
      type: 'radio',
      checked: false,
    },
  ];

  onAction(actionId: string) {
    // Update checked state for checkbox/radio items
    this.menuItems = this.menuItems.map(item => {
      if (item.id === actionId) {
        if (item.type === 'checkbox') {
          return { ...item, checked: !item.checked };
        } else if (item.type === 'radio') {
          return { ...item, checked: true };
        }
      }
      // Uncheck other radio items in the same group
      if (item.type === 'radio' && item.id !== actionId) {
        return { ...item, checked: false };
      }
      return item;
    });
  }
}
```

### Table Row Context Menu

```typescript
import { Component } from '@angular/core';
import { ContextMenuItem } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-table',
  standalone: true,
  template: `
    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b">
          <th class="px-4 py-2 text-left">Name</th>
          <th class="px-4 py-2 text-left">Email</th>
          <th class="px-4 py-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          *ngFor="let user of users"
          [tolleContextMenuTrigger]="getContextMenu(user)"
          (action)="onRowAction($event, user)"
          class="cursor-context-menu border-b hover:bg-muted/50">
          <td class="px-4 py-2">{{ user.name }}</td>
          <td class="px-4 py-2">{{ user.email }}</td>
          <td class="px-4 py-2">{{ user.status }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class TableExampleComponent {
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'Pending' },
  ];

  getContextMenu(user: any): ContextMenuItem[] {
    return [
      { id: 'view', label: 'View Details', icon: 'ri-eye-line' },
      { id: 'edit', label: 'Edit', icon: 'ri-edit-line' },
      { separator: true, id: 'sep1' },
      {
        id: 'deactivate',
        label: user.status === 'Active' ? 'Deactivate' : 'Activate',
        icon: user.status === 'Active' ? 'ri-user-unfollow-line' : 'ri-user-follow-line',
      },
      { separator: true, id: 'sep2' },
      { id: 'delete', label: 'Delete', icon: 'ri-delete-bin-line', destructive: true },
    ];
  }

  onRowAction(actionId: string, user: any) {
    switch (actionId) {
      case 'view':
        this.viewUser(user);
        break;
      case 'edit':
        this.editUser(user);
        break;
      case 'deactivate':
        this.toggleUserStatus(user);
        break;
      case 'delete':
        this.deleteUser(user);
        break;
    }
  }

  // ... action methods
}
```

### Image Context Menu

```typescript
import { Component } from '@angular/core';
import { ContextMenuItem } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  template: `
    <div
      [tolleContextMenuTrigger]="menuItems"
      (action)="onAction($event)"
      class="relative inline-block">
      <img [src]="imageSrc" alt="Image" class="h-auto max-w-full cursor-context-menu rounded-lg" />
    </div>
  `,
})
export class ImageViewerComponent {
  imageSrc = 'https://example.com/image.jpg';
  zoomLevel = 100;

  menuItems: ContextMenuItem[] = [
    { id: 'view-original', label: 'View Original', icon: 'ri-external-link-line' },
    { separator: true, id: 'sep1' },
    { id: 'copy-image', label: 'Copy Image', icon: 'ri-file-copy-line' },
    { id: 'copy-url', label: 'Copy Image URL', icon: 'ri-link' },
    { separator: true, id: 'sep2' },
    {
      id: 'zoom',
      label: 'Zoom',
      icon: 'ri-zoom-in-line',
      submenu: [
        { id: 'zoom-50', label: '50%' },
        { id: 'zoom-100', label: '100%' },
        { id: 'zoom-150', label: '150%' },
        { id: 'zoom-200', label: '200%' },
      ],
    },
    { separator: true, id: 'sep3' },
    { id: 'download', label: 'Download', icon: 'ri-download-line' },
    { id: 'share', label: 'Share', icon: 'ri-share-line' },
  ];

  onAction(actionId: string) {
    switch (actionId) {
      case 'copy-image':
        navigator.clipboard.write?.([new ClipboardItem({ 'image/png': fetch(this.imageSrc) })]);
        break;
      case 'download':
        // Download logic
        break;
      // ... other cases
    }
  }
}
```

### Disabled Items

```typescript
import { Component } from '@angular/core';
import { ContextMenuItem } from '@tolle_/tolle-ui';

@Component({
  // ...
})
export class ExampleComponent {
  menuItems: ContextMenuItem[] = [
    { id: 'edit', label: 'Edit', icon: 'ri-edit-line' },
    { id: 'rename', label: 'Rename', icon: 'ri-input-field', disabled: true },
    { separator: true, id: 'sep1' },
    {
      id: 'share',
      label: 'Share',
      icon: 'ri-share-line',
      submenu: [
        { id: 'share-email', label: 'Via Email' },
        { id: 'share-link', label: 'Copy Link' },
        { id: 'share-social', label: 'Social Media', disabled: true },
      ],
    },
    { separator: true, id: 'sep2' },
    { id: 'delete', label: 'Delete', icon: 'ri-delete-bin-line', destructive: true },
  ];
}
```

### Dynamic Context Menu

```typescript
import { Component } from '@angular/core';
import { ContextMenuItem } from '@tolle_/tolle-ui';

@Component({
  // ...
})
export class ExampleComponent {
  selectedItem: any = null;

  getContextMenu(): ContextMenuItem[] {
    const items: ContextMenuItem[] = [];

    if (this.selectedItem?.isEditable) {
      items.push({ id: 'edit', label: 'Edit', icon: 'ri-edit-line' });
    }

    if (this.selectedItem?.isDeletable) {
      items.push({ id: 'delete', label: 'Delete', icon: 'ri-delete-bin-line', destructive: true });
    }

    if (this.selectedItem?.status === 'draft') {
      items.push({ id: 'publish', label: 'Publish', icon: 'ri-upload-line' });
    } else if (this.selectedItem?.status === 'published') {
      items.push({ id: 'unpublish', label: 'Unpublish', icon: 'ri-arrow-down-line' });
    }

    return items;
  }
}
```

### Icons Reference

Use Remix Icons with the `ri-` prefix:

| Icon                 | Usage         |
| -------------------- | ------------- |
| `ri-edit-line`       | Edit action   |
| `ri-delete-bin-line` | Delete action |
| `ri-file-copy-line`  | Copy action   |
| `ri-share-line`      | Share action  |
| `ri-settings-line`   | Settings      |
| `ri-eye-line`        | View          |
| `ri-download-line`   | Download      |
| `ri-folder-line`     | Folder        |
| `ri-more-2-fill`     | More options  |

## Accessibility

The Context Menu component follows WAI-ARIA menu patterns:

- **Roles**: Uses `role="menu"` for the container and `role="menuitem"` for items.
- **Keyboard Navigation**:
  - Right-click: Opens context menu
  - Escape: Closes the menu
  - Up/Down Arrows: Navigate between items
  - Enter/Space: Activate the focused item
  - Right Arrow: Open submenu (if present)
  - Left Arrow: Close submenu
- **Screen Readers**: Menu items are announced with their labels and states (disabled, checked).
