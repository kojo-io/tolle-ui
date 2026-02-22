# Dropdown Trigger Directive Usage Guide

## Overview

The Dropdown Trigger directive provides a simple way to trigger dropdown menus with automatic positioning using Floating UI. It works in conjunction with the DropdownMenuComponent by binding to a DropdownMenuComponent instance.

## Import

```typescript
import {
  DropdownTriggerDirective,
  DropdownMenuComponent
} from '@tolle_/tolle-ui';
```

## Directive

### DropdownTriggerDirective

Selector: `[tolleDropdownTrigger]`

**Inputs:**

| Input | Type | Description |
|-------|------|-------------|
| `tolleDropdownTrigger` | `DropdownMenuComponent` | The dropdown menu component instance to trigger |

**Note:** This directive does not emit events directly. Use the dropdown menu's events for interaction handling.

## Basic Usage

### Simple Dropdown

The `DropdownTriggerDirective` binds to a `DropdownMenuComponent` instance. The dropdown menu contains the content that will be shown when the trigger is clicked.

```html
<div class="relative inline-block text-left">
  <button
    tolleDropdownTrigger
    [tolleDropdownTrigger]="menu"
    type="button"
    class="inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
  >
    Options
    <i class="ri-arrow-down-s-line"></i>
  </button>

  <tolle-dropdown-menu #menu="tolleDropdownMenu" class="w-48">
    <tolle-dropdown-item>Profile</tolle-dropdown-item>
    <tolle-dropdown-item>Settings</tolle-dropdown-item>
    <tolle-dropdown-separator></tolle-dropdown-separator>
    <tolle-dropdown-item>Log out</tolle-dropdown-item>
  </tolle-dropdown-menu>
</div>
```

## Dropdown with Header

```html
<div class="relative inline-block text-left">
  <button
    tolleDropdownTrigger
    [tolleDropdownTrigger]="filterMenu"
    type="button"
    class="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
  >
    Filter
  </button>

  <tolle-dropdown-menu #filterMenu="tolleDropdownMenu" class="w-64 p-4">
    <div class="mb-4">
      <h3 class="font-semibold">Filter by Category</h3>
    </div>

    <div class="space-y-2">
      <label class="flex items-center gap-2">
        <input type="checkbox" />
        <span>All</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" />
        <span>Active</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" />
        <span>Archived</span>
      </label>
    </div>

    <button class="w-full mt-4 py-2 bg-primary text-primary-foreground rounded">
      Apply Filter
    </button>
  </tolle-dropdown-menu>
</div>
```

## Dropdown with Icons

```html
<div class="relative inline-block text-left">
  <button
    tolleDropdownTrigger
    [tolleDropdownTrigger]="actionsMenu"
    class="p-2 hover:bg-accent rounded-md"
  >
    <i class="ri-more-2-fill"></i>
  </button>

  <tolle-dropdown-menu #actionsMenu="tolleDropdownMenu" class="w-48">
    <tolle-dropdown-item>
      <i class="ri-user-line mr-2"></i>
      Profile
    </tolle-dropdown-item>
    <tolle-dropdown-item>
      <i class="ri-settings-3-line mr-2"></i>
      Settings
    </tolle-dropdown-item>
    <tolle-dropdown-separator></tolle-dropdown-separator>
    <tolle-dropdown-item class="text-destructive">
      <i class="ri-delete-bin-line mr-2"></i>
      Delete
    </tolle-dropdown-item>
  </tolle-dropdown-menu>
</div>
```

## Dropdown with Separators

```html
<div class="relative inline-block text-left">
  <button
    tolleDropdownTrigger
    [tolleDropdownTrigger]="menu"
    class="px-4 py-2 hover:bg-accent rounded-md"
  >
    Actions
  </button>

  <tolle-dropdown-menu #menu="tolleDropdownMenu" class="w-48">
    <tolle-dropdown-item>View</tolle-dropdown-item>
    <tolle-dropdown-item>Edit</tolle-dropdown-item>
    <tolle-dropdown-separator></tolle-dropdown-separator>
    <tolle-dropdown-item>Duplicate</tolle-dropdown-item>
    <tolle-dropdown-separator></tolle-dropdown-separator>
    <tolle-dropdown-item class="text-destructive">Delete</tolle-dropdown-item>
  </tolle-dropdown-menu>
</div>
```

## Dropdown with Disabled Items

```html
<div class="relative inline-block text-left">
  <button
    tolleDropdownTrigger
    [tolleDropdownTrigger]="menu"
    class="px-4 py-2 hover:bg-accent rounded-md"
  >
    Manage
  </button>

  <tolle-dropdown-menu #menu="tolleDropdownMenu" class="w-48">
    <tolle-dropdown-item>View All</tolle-dropdown-item>
    <tolle-dropdown-item [disabled]="true">Edit (Locked)</tolle-dropdown-item>
    <tolle-dropdown-separator></tolle-dropdown-separator>
    <tolle-dropdown-item>Delete</tolle-dropdown-item>
  </tolle-dropdown-menu>
</div>
```

## Dropdown Alignment

### Right-Aligned

```html
<div class="relative inline-block text-left">
  <button
    tolleDropdownTrigger
    [tolleDropdownTrigger]="menu"
    class="px-4 py-2 hover:bg-accent rounded-md"
  >
    Align Right
  </button>

  <tolle-dropdown-menu #menu="tolleDropdownMenu" class="w-48 origin-top-right">
    <tolle-dropdown-item>Option 1</tolle-dropdown-item>
    <tolle-dropdown-item>Option 2</tolle-dropdown-item>
  </tolle-dropdown-menu>
</div>
```

### Left-Aligned

```html
<div class="relative inline-block text-left">
  <button
    tolleDropdownTrigger
    [tolleDropdownTrigger]="menu"
    class="px-4 py-2 hover:bg-accent rounded-md"
  >
    Align Left
  </button>

  <tolle-dropdown-menu #menu="tolleDropdownMenu" class="w-48 origin-top-left">
    <tolle-dropdown-item>Option 1</tolle-dropdown-item>
    <tolle-dropdown-item>Option 2</tolle-dropdown-item>
  </tolle-dropdown-menu>
</div>
```

## Dropdown in Button Group

```html
<div class="inline-flex rounded-md shadow-sm">
  <button
    type="button"
    class="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-l-md"
  >
    Create
  </button>
  <div class="relative -ml-px">
    <button
      tolleDropdownTrigger
      [tolleDropdownTrigger]="menu"
      type="button"
      class="px-2 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-r-md border-l border-primary"
    >
      <i class="ri-arrow-down-s-line"></i>
    </button>
  </div>

  <tolle-dropdown-menu #menu="tolleDropdownMenu" class="w-48">
    <tolle-dropdown-item>New Project</tolle-dropdown-item>
    <tolle-dropdown-item>New File</tolle-dropdown-item>
    <tolle-dropdown-item>New Folder</tolle-dropdown-item>
  </tolle-dropdown-menu>
</div>
```

## Dropdown in Toolbar

```html
<div class="flex items-center gap-2 p-2 bg-muted rounded-lg">
  <button class="p-2 hover:bg-accent rounded-md">
    <i class="ri-undo-line"></i>
  </button>
  <button class="p-2 hover:bg-accent rounded-md">
    <i class="ri-redo-line"></i>
  </button>

  <div class="relative inline-block">
    <button
      tolleDropdownTrigger
      [tolleDropdownTrigger]="menu"
      class="px-3 py-2 hover:bg-accent rounded-md"
    >
      <i class="ri-align-left"></i>
    </button>
  </div>

  <tolle-dropdown-menu #menu="tolleDropdownMenu" class="w-40">
    <tolle-dropdown-item>Left Align</tolle-dropdown-item>
    <tolle-dropdown-item>Center Align</tolle-dropdown-item>
    <tolle-dropdown-item>Right Align</tolle-dropdown-item>
  </tolle-dropdown-menu>
</div>
```

## Dropdown with Search

```html
<div class="relative inline-block text-left">
  <button
    tolleDropdownTrigger
    [tolleDropdownTrigger]="menu"
    class="w-64 px-4 py-2 text-left hover:bg-accent rounded-md border"
  >
    <i class="ri-search-line mr-2"></i>
    Search Items...
  </button>

  <tolle-dropdown-menu #menu="tolleDropdownMenu" class="w-72">
    <div class="p-2">
      <input
        type="text"
        placeholder="Search..."
        class="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>

    <tolle-dropdown-separator></tolle-dropdown-separator>

    <div class="max-h-64 overflow-y-auto">
      <tolle-dropdown-item *ngFor="let item of items">
        {{ item }}
      </tolle-dropdown-item>
    </div>
  </tolle-dropdown-menu>
</div>
```

## Dropdown in Table

```html
<table class="w-full">
  <thead class="bg-muted">
    <tr>
      <th class="p-4">Name</th>
      <th class="p-4 text-right">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let row of rows" class="border-b last:border-0">
      <td class="p-4">{{ row.name }}</td>
      <td class="p-4 text-right">
        <div class="relative inline-block">
          <button
            tolleDropdownTrigger
            [tolleDropdownTrigger]="rowMenu"
            class="p-2 hover:bg-accent rounded-md"
          >
            <i class="ri-more-2-fill"></i>
          </button>
        </div>
      </td>
    </tr>
  </tbody>
</table>

<tolle-dropdown-menu #rowMenu="tolleDropdownMenu" class="w-48">
  <tolle-dropdown-item>View</tolle-dropdown-item>
  <tolle-dropdown-item>Edit</tolle-dropdown-item>
  <tolle-dropdown-separator></tolle-dropdown-separator>
  <tolle-dropdown-item class="text-destructive">Delete</tolle-dropdown-item>
</tolle-dropdown-menu>
```

## Dropdown with Custom Content

```html
<div class="relative inline-block text-left">
  <button
    tolleDropdownTrigger
    [tolleDropdownTrigger]="menu"
    class="px-4 py-2 hover:bg-accent rounded-md"
  >
    User Menu
  </button>

  <tolle-dropdown-menu #menu="tolleDropdownMenu" class="w-64 p-4">
    <div class="flex items-center gap-3 mb-4 pb-4 border-b">
      <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
        {{ user.initials }}
      </div>
      <div>
        <div class="font-semibold">{{ user.name }}</div>
        <div class="text-sm text-muted-foreground">{{ user.email }}</div>
      </div>
    </div>

    <div class="space-y-2">
      <button tolle-dropdown-item class="w-full text-left">
        <i class="ri-user-line mr-2"></i>
        Profile
      </button>
      <button tolle-dropdown-item class="w-full text-left">
        <i class="ri-settings-3-line mr-2"></i>
        Settings
      </button>
    </div>

    <tolle-dropdown-separator></tolle-dropdown-separator>

    <button tolle-dropdown-item class="w-full text-left text-destructive">
      <i class="ri-logout-box-line mr-2"></i>
      Logout
    </button>
  </tolle-dropdown-menu>
</div>
```

## Dropdown with Submenu

```html
<div class="relative inline-block text-left">
  <button
    tolleDropdownTrigger
    [tolleDropdownTrigger]="menu"
    class="px-4 py-2 hover:bg-accent rounded-md"
  >
    Sort By
  </button>

  <tolle-dropdown-menu #menu="tolleDropdownMenu" class="w-48">
    <div class="px-2 py-1.5 text-sm font-medium">Sort by</div>
    <tolle-dropdown-item
      *ngFor="let sort of sorts"
      [class.bg-accent]="sort.active"
      (click)="applySort(sort)"
    >
      {{ sort.label }}
      <i *ngIf="sort.active" class="ri-check-line ml-auto"></i>
    </tolle-dropdown-item>
    <tolle-dropdown-separator></tolle-dropdown-separator>
    <div class="px-2 py-1.5 text-sm font-medium">Secondary sort</div>
    <tolle-dropdown-item *ngFor="let sort of secondarySorts" (click)="applySecondarySort(sort)">
      {{ sort.label }}
    </tolle-dropdown-item>
  </tolle-dropdown-menu>
</div>
```

## Positioning Options

The dropdown uses Floating UI with the following behaviors:

- **Default**: Bottom-end alignment
- **Flip**: Automatically flips to top if space is tight
- **Shift**: Prevents menu from hitting screen edges
- **Offset**: 4px gap between trigger and menu

## Accessing the Menu Component

You can access the DropdownMenuComponent through template reference variables to programmatically control it:

```html
<button
  tolleDropdownTrigger
  [tolleDropdownTrigger]="menu"
>
  Open Menu
</button>

<tolle-dropdown-menu #menu="tolleDropdownMenu" class="w-48">
  <tolle-dropdown-item>Item 1</tolle-dropdown-item>
</tolle-dropdown-menu>
```

## Notes

- The `DropdownTriggerDirective` binds to a `DropdownMenuComponent` instance (not an `ng-template`)
- The dropdown menu content is projected via `ng-content` in the `DropdownMenuComponent`
- The directive handles opening/closing the menu on click
- Clicking outside the menu will automatically close it
