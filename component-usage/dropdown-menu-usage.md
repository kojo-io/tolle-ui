# Dropdown Menu Component Usage Guide

## Overview

The DropdownMenu component provides a dropdown menu that can be triggered by a button or any element. It supports menu items, separators, labels, and custom content for building navigation or action menus.

## Import

```typescript
import {
  DropdownMenuComponent,
  DropdownItemComponent,
  DropdownLabelComponent,
  DropdownSeparatorComponent,
  DropdownTriggerDirective,
} from '@tolle_/tolle-ui';
```

## Components

### DropdownMenuComponent

Container for dropdown items.

**Inputs:**

| Input   | Type      | Default | Description             |
| ------- | --------- | ------- | ----------------------- |
| `class` | `string`  | `''`    | Additional CSS classes  |
| `open`  | `boolean` | `false` | Open state (controlled) |

**Outputs:**

| Output         | Type                    | Description                     |
| -------------- | ----------------------- | ------------------------------- |
| `onOpenChange` | `EventEmitter<boolean>` | Emitted when open state changes |

### DropdownItemComponent

**Inputs:**

| Input      | Type      | Default | Description            |
| ---------- | --------- | ------- | ---------------------- |
| `class`    | `string`  | `''`    | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state         |

### DropdownLabelComponent

Group label/section header.

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

### DropdownSeparatorComponent

Visual separator between items.

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

### DropdownTriggerDirective

**Selector:** `[tolleDropdownTrigger]`

**Usage:** `[tolleDropdownTrigger]="dropdownMenu"`

## Basic Usage

### Simple Dropdown Menu

```html
<tolle-button variant="outline" [tolleDropdownTrigger]="menu">
  Open Menu
  <i class="ri-arrow-down-s-line ml-2"></i>
</tolle-button>

<tolle-dropdown-menu #menu>
  <div class="flex flex-col">
    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
      <i class="ri-edit-line"></i>
      Edit
    </button>
    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
      <i class="ri-share-line"></i>
      Share
    </button>
    <div class="my-1 h-px bg-border"></div>
    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10">
      <i class="ri-delete-bin-line"></i>
      Delete
    </button>
  </div>
</tolle-dropdown-menu>
```

### Dropdown with Labels and Separators

```html
<tolle-button variant="outline" [tolleDropdownTrigger]="actionsMenu"> Actions </tolle-button>

<tolle-dropdown-menu #actionsMenu>
  <div class="p-2">
    <div class="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Account</div>
    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      <i class="ri-user-line"></i>
      Profile Settings
    </button>
    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      <i class="ri-notification-line"></i>
      Notifications
    </button>

    <div class="my-1 h-px bg-border"></div>

    <div class="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Workspace</div>
    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      <i class="ri-team-line"></i>
      Team Members
    </button>
    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      <i class="ri-folder-line"></i>
      Projects
    </button>

    <div class="my-1 h-px bg-border"></div>

    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10">
      <i class="ri-logout-box-line"></i>
      Sign Out
    </button>
  </div>
</tolle-dropdown-menu>
```

### User Menu Dropdown

```html
<tolle-button variant="ghost" [tolleDropdownTrigger]="userMenu" class="flex items-center gap-2">
  <tolle-avatar class="h-8 w-8">
    <img src="https://github.com/shadcn.png" />
  </tolle-avatar>
  <span class="font-medium">John Doe</span>
  <i class="ri-arrow-down-s-line"></i>
</tolle-button>

<tolle-dropdown-menu #userMenu>
  <div class="w-56 p-2">
    <div class="px-2 py-1.5">
      <div class="font-semibold">John Doe</div>
      <div class="text-xs text-muted-foreground">john@example.com</div>
    </div>

    <div class="my-1 h-px bg-border"></div>

    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      <i class="ri-user-line"></i>
      Your Profile
    </button>
    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      <i class="ri-settings-line"></i>
      Settings
    </button>
    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      <i class="ri-bank-card-line"></i>
      Billing
    </button>

    <div class="my-1 h-px bg-border"></div>

    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10">
      <i class="ri-logout-box-line"></i>
      Sign Out
    </button>
  </div>
</tolle-dropdown-menu>
```

### Controlled Dropdown

```typescript
import { Component } from '@angular/core';
import { DropdownMenuComponent, DropdownTriggerDirective, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [DropdownMenuComponent, DropdownTriggerDirective, ButtonComponent],
  template: `
    <tolle-button variant="outline" [tolleDropdownTrigger]="menu"> Options </tolle-button>

    <tolle-dropdown-menu #menu [(open)]="isMenuOpen" (onOpenChange)="onMenuOpenChange($event)">
      <div class="p-2">
        <button
          (click)="selectOption('edit')"
          class="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
          Edit
        </button>
        <button
          (click)="selectOption('duplicate')"
          class="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
          Duplicate
        </button>
      </div>
    </tolle-dropdown-menu>
  `,
})
export class ExampleComponent {
  isMenuOpen = false;

  onMenuOpenChange(open: boolean) {
    console.log('Menu open:', open);
  }

  selectOption(option: string) {
    console.log('Selected:', option);
    this.isMenuOpen = false;
  }
}
```

### Dropdown with Icons and Shortcuts

```html
<tolle-button [tolleDropdownTrigger]="fileMenu"> File </tolle-button>

<tolle-dropdown-menu #fileMenu>
  <div class="w-56 p-2">
    <button
      class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-accent">
      <div class="flex items-center gap-2">
        <i class="ri-file-add-line"></i>
        New File
      </div>
      <span class="text-xs text-muted-foreground">⌘N</span>
    </button>
    <button
      class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-accent">
      <div class="flex items-center gap-2">
        <i class="ri-folder-add-line"></i>
        New Folder
      </div>
    </button>

    <div class="my-1 h-px bg-border"></div>

    <button
      class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-accent">
      <div class="flex items-center gap-2">
        <i class="ri-save-line"></i>
        Save
      </div>
      <span class="text-xs text-muted-foreground">⌘S</span>
    </button>

    <div class="my-1 h-px bg-border"></div>

    <button
      class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-accent">
      <div class="flex items-center gap-2">
        <i class="ri-download-line"></i>
        Export
      </div>
    </button>
  </div>
</tolle-dropdown-menu>
```

### Dropdown with Checkboxes

```typescript
import { Component } from '@angular/core';
import { DropdownMenuComponent, DropdownTriggerDirective, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [DropdownMenuComponent, DropdownTriggerDirective, ButtonComponent],
  template: `
    <tolle-button [tolleDropdownTrigger]="filterMenu"> Filter </tolle-button>

    <tolle-dropdown-menu #filterMenu>
      <div class="w-48 p-2">
        <div class="px-2 py-1.5 text-sm font-semibold">Status</div>

        <button
          *ngFor="let status of statuses"
          (click)="toggleStatus(status)"
          class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
          <i [class]="status.checked ? 'ri-checkbox-line' : 'ri-checkbox-blank-line'"></i>
          {{ status.label }}
        </button>
      </div>
    </tolle-dropdown-menu>
  `,
})
export class ExampleComponent {
  statuses = [
    { label: 'Active', checked: true },
    { label: 'Inactive', checked: false },
    { label: 'Pending', checked: true },
  ];

  toggleStatus(status: any) {
    status.checked = !status.checked;
  }
}
```

### Dropdown with Disabled Items

```html
<tolle-button [tolleDropdownTrigger]="menu"> Options </tolle-button>

<tolle-dropdown-menu #menu>
  <div class="p-2">
    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      Available Option
    </button>

    <!-- Disabled item -->
    <button
      disabled
      class="flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm opacity-50">
      <span>Coming Soon</span>
      <span class="rounded bg-muted px-1.5 py-0.5 text-xs">Pro</span>
    </button>

    <div class="my-1 h-px bg-border"></div>

    <button
      class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      Another Option
    </button>
  </div>
</tolle-dropdown-menu>
```

### Dropdown with Search/Filter

```html
<tolle-button [tolleDropdownTrigger]="searchMenu"> Select Country </tolle-button>

<tolle-dropdown-menu #searchMenu>
  <div class="w-64 p-2">
    <div class="flex items-center px-2 pb-2">
      <tolle-input placeholder="Search countries..." [class]="'h-8'" />
    </div>

    <div class="max-h-48 overflow-auto">
      <button
        *ngFor="let country of countries"
        class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
        {{ country.name }}
      </button>
    </div>
  </div>
</tolle-dropdown-menu>
```

### Multiple Dropdowns

```html
<div class="flex gap-2">
  <tolle-button [tolleDropdownTrigger]="editMenu">Edit</tolle-button>
  <tolle-button [tolleDropdownTrigger]="viewMenu">View</tolle-button>
  <tolle-button [tolleDropdownTrigger]="shareMenu">Share</tolle-button>
</div>

<tolle-dropdown-menu #editMenu>
  <div class="p-2">
    <button class="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">Cut</button>
    <button class="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      Copy
    </button>
    <button class="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      Paste
    </button>
  </div>
</tolle-dropdown-menu>

<tolle-dropdown-menu #viewMenu>
  <div class="p-2">
    <button class="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      Grid
    </button>
    <button class="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      List
    </button>
    <button class="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      Compact
    </button>
  </div>
</tolle-dropdown-menu>

<tolle-dropdown-menu #shareMenu>
  <div class="p-2">
    <button class="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      Email
    </button>
    <button class="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      Link
    </button>
    <button class="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
      Embed
    </button>
  </div>
</tolle-dropdown-menu>
```
