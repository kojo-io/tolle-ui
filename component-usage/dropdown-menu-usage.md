# Dropdown Menu Component Usage Guide

## Overview

The DropdownMenu component provides a dropdown menu that can be triggered by a button or any element. It supports menu items, separators, labels, and submenus.

## Import

```typescript
import {
  DropdownMenuComponent,
  DropdownItemComponent,
  DropdownLabelComponent,
  DropdownSeparatorComponent,
  DropdownTriggerComponent
} from '@tolle_/tolle-ui';
```

## Components

### DropdownMenuComponent

Container for dropdown items.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `open` | `boolean` | `false` | Open state |
| `onOpenChange` | `EventEmitter<boolean>` | - | Emitted when open state changes |

### DropdownItemComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |

### DropdownLabelComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### DropdownSeparatorComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### DropdownTriggerComponent

Directive for triggering the dropdown.

## Basic Usage

### Simple Dropdown

```html
<tolle-dropdown-menu>
  <button tolleDropdownTrigger>Menu</button>
  <tolle-dropdown-menu-content>
    <button tolleDropdownItem>Action 1</button>
    <button tolleDropdownItem>Action 2</button>
    <button tolleDropdownItem>Action 3</button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>
```

### Dropdown with Separator

```html
<tolle-dropdown-menu>
  <button tolleDropdownTrigger>Options</button>
  <tolle-dropdown-menu-content>
    <button tolleDropdownItem>View</button>
    <button tolleDropdownItem>Edit</button>
    <div tolleDropdownSeparator></div>
    <button tolleDropdownItem>Delete</button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>
```

## Dropdown with Labels

```html
<tolle-dropdown-menu>
  <button tolleDropdownTrigger>Settings</button>
  <tolle-dropdown-menu-content>
    <span tolleDropdownLabel>General</span>
    <button tolleDropdownItem>Profile</button>
    <button tolleDropdownItem>Preferences</button>

    <div tolleDropdownSeparator></div>

    <span tolleDropdownLabel>Account</span>
    <button tolleDropdownItem>billing</button>
    <button tolleDropdownItem>Settings</button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>
```

## Dropdown with Icons

### Icons in Items

```html
<tolle-dropdown-menu>
  <button tolleDropdownTrigger>
    <i class="ri-more-2-fill"></i>
  </button>
  <tolle-dropdown-menu-content>
    <button tolleDropdownItem>
      <i class="ri-edit-line mr-2"></i>
      Edit
    </button>
    <button tolleDropdownItem>
      <i class="ri-delete-bin-line mr-2"></i>
      Delete
    </button>
    <button tolleDropdownItem>
      <i class="ri-download-line mr-2"></i>
      Download
    </button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>
```

### Icon Only Trigger

```html
<tolle-dropdown-menu>
  <button tolleDropdownTrigger class="p-2">
    <i class="ri-more-2-fill"></i>
  </button>
  <tolle-dropdown-menu-content>
    <button tolleDropdownItem>
      <i class="ri-edit-line mr-2"></i>
      Edit
    </button>
    <button tolleDropdownItem>
      <i class="ri-delete-bin-line mr-2"></i>
      Delete
    </button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>
```

## Disabled Dropdown Items

```html
<tolle-dropdown-menu>
  <button tolleDropdownTrigger>Actions</button>
  <tolle-dropdown-menu-content>
    <button tolleDropdownItem [disabled]="true">Locked Action</button>
    <button tolleDropdownItem>Normal Action</button>
    <button tolleDropdownItem [disabled]="true">Another Locked</button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>
```

## Dropdown with Submenu

### Nested Menu

```html
<tolle-dropdown-menu>
  <button tolleDropdownTrigger>File</button>
  <tolle-dropdown-menu-content>
    <button tolleDropdownItem>New</button>
    <button tolleDropdownItem>Open</button>

    <div tolleDropdownItem class="relative">
      <span>Export</span>
      <i class="ri-arrow-right-s-line absolute right-2 text-xs"></i>
      <tolle-dropdown-menu>
        <button tolleDropdownTrigger class="invisible h-full w-full absolute inset-0"></button>
        <tolle-dropdown-menu-content>
          <button tolleDropdownItem>PDF</button>
          <button tolleDropdownItem>CSV</button>
          <button tolleDropdownItem>Excel</button>
        </tolle-dropdown-menu-content>
      </tolle-dropdown-menu>
    </div>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>
```

## Dropdown in Card

```html
<tolle-card>
  <tolle-card-header class="flex justify-between items-center">
    <tolle-card-title>Files</tolle-card-title>
    <tolle-dropdown-menu>
      <button tolleDropdownTrigger class="p-2 hover:bg-accent rounded">
        <i class="ri-more-2-fill"></i>
      </button>
      <tolle-dropdown-menu-content>
        <button tolleDropdownItem>Sort by Name</button>
        <button tolleDropdownItem>Sort by Date</button>
        <div tolleDropdownSeparator></div>
        <button tolleDropdownItem>Refresh</button>
      </tolle-dropdown-menu-content>
    </tolle-dropdown-menu>
  </tolle-card-header>
  <tolle-card-content>
    <!-- Content -->
  </tolle-card-content>
</tolle-card>
```

## Dropdown with Custom Trigger

### Custom Trigger Element

```html
<tolle-dropdown-menu>
  <div tolleDropdownTrigger class="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer">
    <tolle-avatar class="h-8 w-8">
      <tolle-avatar-image src="avatar.jpg" />
      <tolle-avatar-fallback>JD</tolle-avatar-fallback>
    </tolle-avatar>
    <span class="text-sm font-medium">John Doe</span>
    <i class="ri-arrow-down-s-line text-xs"></i>
  </div>
  <tolle-dropdown-menu-content>
    <button tolleDropdownItem>Profile</button>
    <button tolleDropdownItem>Settings</button>
    <div tolleDropdownSeparator></div>
    <button tolleDropdownItem>Log out</button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>
```

## Dropdown Positioning

### Different Positions

```html
<!-- Right (default) -->
<tolle-dropdown-menu>
  <button tolleDropdownTrigger>Right</button>
  <tolle-dropdown-menu-content>
    <button tolleDropdownItem>Action</button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>

<!-- Left -->
<tolle-dropdown-menu>
  <button tolleDropdownTrigger>Left</button>
  <tolle-dropdown-menu-content side="left">
    <button tolleDropdownItem>Action</button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>

<!-- Top -->
<tolle-dropdown-menu>
  <button tolleDropdownTrigger>Top</button>
  <tolle-dropdown-menu-content side="top">
    <button tolleDropdownItem>Action</button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>
```

## Dropdown with Keyboard Navigation

### Accessible Dropdown

```html
<tolle-dropdown-menu>
  <button tolleDropdownTrigger>Menu</button>
  <tolle-dropdown-menu-content>
    <button tolleDropdownItem>View</button>
    <button tolleDropdownItem>Edit</button>
    <button tolleDropdownItem>Delete</button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>
```

## Dropdown in Toolbar

```html
<div class="flex items-center gap-2 p-2 border rounded-md">
  <button tolleButton variant="ghost" size="sm">
    <i class="ri-bold-line"></i>
  </button>
  <button tolleButton variant="ghost" size="sm">
    <i class="ri-italic-line"></i>
  </button>

  <div tolleDropdownSeparator class="h-6 w-px mx-2"></div>

  <tolle-dropdown-menu>
    <button tolleDropdownTrigger variant="ghost" size="sm">
      <i class="ri-align-left-line"></i>
    </button>
    <tolle-dropdown-menu-content>
      <button tolleDropdownItem>Align Left</button>
      <button tolleDropdownItem>Align Center</button>
      <button tolleDropdownItem>Align Right</button>
    </tolle-dropdown-menu-content>
  </tolle-dropdown-menu>
</div>
```

## Dropdown with Hotkeys

```html
<tolle-dropdown-menu>
  <button tolleDropdownTrigger>Actions</button>
  <tolle-dropdown-menu-content>
    <button tolleDropdownItem>
      <span class="flex-1">Copy</span>
      <span class="text-xs text-muted-foreground ml-2">Ctrl+C</span>
    </button>
    <button tolleDropdownItem>
      <span class="flex-1">Paste</span>
      <span class="text-xs text-muted-foreground ml-2">Ctrl+V</span>
    </button>
    <button tolleDropdownItem>
      <span class="flex-1">Delete</span>
      <span class="text-xs text-muted-foreground ml-2">Del</span>
    </button>
  </tolle-dropdown-menu-content>
</tolle-dropdown-menu>
```
