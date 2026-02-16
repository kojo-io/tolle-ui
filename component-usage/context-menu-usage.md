# Context Menu Component Usage Guide

## Overview

The Context Menu component provides a right-click context menu with support for items, submenus, separators, keyboard navigation, and custom actions.

## Import

```typescript
import {
  ContextMenuComponent,
  ContextMenuTriggerDirective,
  ContextMenuService
} from '@tolle_/tolle-ui';
```

## Components

### ContextMenuComponent

Renders the context menu dropdown.

### ContextMenuTriggerDirective

Selector: `[tolleContextMenuTrigger]`

Triggers the context menu on right-click.

### ContextMenuService

Handles menu state and positioning.

## ContextMenuItem Interface

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the action |
| `label` | `string` | Display text |
| `icon` | `string` | Optional icon class |
| `disabled` | `boolean` | Whether item is disabled |
| `destructive` | `boolean` | Whether item is destructive |
| `separator` | `boolean` | Whether to show as a separator |
| `submenu` | `ContextMenuItem[]` | Optional submenu items |
| `shortcut` | `string` | Optional keyboard shortcut |
| `checked` | `boolean` | Whether item is checked |
| `type` | `'default' \| 'checkbox' \| 'radio'` | Item type |

## Basic Usage

### Simple Context Menu

```html
<div
  [tolleContextMenuTrigger]="menuItems"
  (action)="onAction($event)"
  class="p-8 border rounded-lg"
>
  Right-click here to see context menu
</div>

<tolle-context-menu></tolle-context-menu>
```

```typescript
menuItems: ContextMenuItem[] = [
  { id: 'copy', label: 'Copy', icon: 'ri-file-copy-line' },
  { id: 'cut', label: 'Cut', icon: 'ri-scissors-line' },
  { id: 'paste', label: 'Paste', icon: 'ri-clipboard-line' }
];

onAction(actionId: string) {
  console.log('Action:', actionId);
  switch (actionId) {
    case 'copy':
      // Copy logic
      break;
    case 'cut':
      // Cut logic
      break;
    case 'paste':
      // Paste logic
      break;
  }
}
```

### Context Menu with Separator

```html
<div [tolleContextMenuTrigger]="menuItems">
  Right-click me
</div>
<tolle-context-menu></tolle-context-menu>
```

```typescript
menuItems: ContextMenuItem[] = [
  { id: 'undo', label: 'Undo' },
  { id: 'redo', label: 'Redo' },
  { separator: true },
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { separator: true },
  { id: 'delete', label: 'Delete', destructive: true }
];
```

## Context Menu with Submenu

```html
<div [tolleContextMenuTrigger]="menuItems">
  Right-click me
</div>
<tolle-context-menu></tolle-context-menu>
```

```typescript
menuItems: ContextMenuItem[] = [
  { id: 'open', label: 'Open' },
  {
    id: 'openWith',
    label: 'Open With',
    submenu: [
      { id: 'app1', label: 'Application 1' },
      { id: 'app2', label: 'Application 2' },
      { separator: true },
      { id: 'other', label: 'Other App' }
    ]
  },
  { separator: true },
  { id: 'properties', label: 'Properties' }
];
```

## Checkbox and Radio Items

### Checkbox Items

```typescript
menuItems: ContextMenuItem[] = [
  {
    id: 'showSidebar',
    label: 'Show Sidebar',
    type: 'checkbox',
    checked: this.showSidebar
  },
  {
    id: 'showToolbar',
    label: 'Show Toolbar',
    type: 'checkbox',
    checked: this.showToolbar
  }
];
```

### Radio Items

```typescript
menuItems: ContextMenuItem[] = [
  {
    id: 'sortDate',
    label: 'Sort by Date',
    type: 'radio',
    checked: this.sortBy === 'date'
  },
  {
    id: 'sortName',
    label: 'Sort by Name',
    type: 'radio',
    checked: this.sortBy === 'name'
  },
  {
    id: 'sortSize',
    label: 'Sort by Size',
    type: 'radio',
    checked: this.sortBy === 'size'
  }
];
```

## Disabled and Destructive Items

```typescript
menuItems: ContextMenuItem[] = [
  { id: 'view', label: 'View' },
  { id: 'edit', label: 'Edit', disabled: !this.hasEditPermission },
  { id: 'delete', label: 'Delete', destructive: true },
  { id: 'share', label: 'Share', disabled: true }
];
```

## Context Menu with Shortcut

```typescript
menuItems: ContextMenuItem[] = [
  { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' },
  { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y' },
  { separator: true },
  { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
  { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V' },
  { id: 'selectAll', label: 'Select All', shortcut: 'Ctrl+A' }
];
```

## Programmatic Menu Control

### Using ContextMenuService

```typescript
constructor(private contextMenuService: ContextMenuService) {}

openMenu(event: MouseEvent) {
  this.contextMenuService.open({
    event,
    items: [
      { id: 'item1', label: 'Item 1' },
      { id: 'item2', label: 'Item 2' }
    ],
    onAction: (id) => {
      console.log('Clicked:', id);
    }
  });
}

closeMenu() {
  this.contextMenuService.close();
}
```

```html
<button (click)="openMenu($event)">Open Menu</button>
```

### Context Menu with Custom Position

```typescript
showMenu(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

  this.contextMenuService.open({
    event,
    items: this.menuItems,
    triggerElement: event.currentTarget as HTMLElement,
    onAction: (id) => console.log(id)
  });
}
```

## Context Menu in List

### List with Per-Item Context Menu

```html
<ul class="space-y-1">
  <li
    *ngFor="let file of files"
    [tolleContextMenuTrigger]="getFileMenu(file)"
    (action)="onFileAction($event, file)"
    class="p-2 hover:bg-accent rounded cursor-pointer flex items-center gap-2"
  >
    <i class="ri-file-text-line"></i>
    <span>{{ file.name }}</span>
  </li>
</ul>
<tolle-context-menu></tolle-context-menu>
```

```typescript
files: File[] = [
  { id: '1', name: 'document.pdf' },
  { id: '2', name: 'image.jpg' },
  { id: '3', name: 'spreadsheet.xlsx' }
];

getFileMenu(file: File): ContextMenuItem[] {
  return [
    { id: `view-${file.id}`, label: 'View' },
    { id: `edit-${file.id}`, label: 'Edit' },
    { separator: true },
    { id: `download-${file.id}`, label: 'Download' },
    { separator: true },
    { id: `delete-${file.id}`, label: 'Delete', destructive: true }
  ];
}

onFileAction(actionId: string, file: File) {
  const action = actionId.split('-')[0];
  switch (action) {
    case 'view':
      // View file
      break;
    case 'delete':
      // Delete file
      break;
  }
}
```

## Context Menu with Icons

```typescript
menuItems: ContextMenuItem[] = [
  { id: 'home', label: 'Home', icon: 'ri-home-line' },
  { id: 'folder', label: 'New Folder', icon: 'ri-folder-add-line' },
  { id: 'upload', label: 'Upload', icon: 'ri-upload-cloud-2-line' },
  { separator: true },
  { id: 'settings', label: 'Settings', icon: 'ri-settings-line' },
  { id: 'help', label: 'Help', icon: 'ri-question-line' }
];
```

## Context Menu in Table

```html
<table class="w-full">
  <thead>
    <tr>
      <th class="p-2 text-left">Name</th>
      <th class="p-2 text-left">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr
      *ngFor="let row of rows"
      [tolleContextMenuTrigger]="getRowMenu(row)"
      (action)="onRowAction($event, row)"
      class="hover:bg-muted"
    >
      <td class="p-2">{{ row.name }}</td>
      <td class="p-2">{{ row.status }}</td>
    </tr>
  </tbody>
</table>
<tolle-context-menu></tolle-context-menu>
```

## Keyboard Navigation

The context menu supports full keyboard navigation:

- `Arrow Down` / `Arrow Up`: Navigate items
- `Enter` / `Space`: Activate item
- `Arrow Right`: Open submenu
- `Arrow Left`: Close submenu
- `Escape`: Close menu

## Custom Styling

### Custom Context Menu Styles

```html
<tolle-context-menu
  class="my-custom-menu"
></tolle-context-menu>
```

```css
.my-custom-menu {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.my-custom-menu button:hover {
  background-color: #f0f0f0;
}
```

## Multiple Context Menus

### Different Menus for Different Elements

```html
<div
  [tolleContextMenuTrigger]="fileMenuItems"
  (action)="onFileAction($event)"
  class="file-box"
>
  File Container
</div>

<div
  [tolleContextMenuTrigger]="folderMenuItems"
  (action)="onFolderAction($event)"
  class="folder-box"
>
  Folder Container
</div>

<tolle-context-menu></tolle-context-menu>
```

```typescript
fileMenuItems: ContextMenuItem[] = [
  { id: 'file-view', label: 'View File' },
  { id: 'file-delete', label: 'Delete File', destructive: true }
];

folderMenuItems: ContextMenuItem[] = [
  { id: 'folder-open', label: 'Open Folder' },
  { id: 'folder-rename', label: 'Rename Folder' },
  { id: 'folder-delete', label: 'Delete Folder', destructive: true }
];
```
