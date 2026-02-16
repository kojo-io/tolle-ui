# Sheet Component Usage Guide

## Overview

The Sheet component provides a slide-out panel that appears from the side of the screen. It's commonly used for sidebars, drawers, or additional content that doesn't require a full modal.

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
  SheetService
} from '@tolle_/tolle-ui';
```

## Components

### SheetComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Open state |
| `hasBackdrop` | `boolean` | `true` | Show backdrop |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `isOpenChange` | `EventEmitter<boolean>` | Emitted when open state changes |

### SheetTriggerComponent

Triggers the sheet to open.

### SheetContentComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `side` | `'top'\|'bottom'\|'left'\|'right'` | `'right'` | Side of screen |
| `rounded` | `boolean` | `false` | Rounded corners on inner side |
| `class` | `string` | `''` | Additional CSS classes |

### SheetHeaderComponent

Header section of the sheet.

### SheetFooterComponent

Footer section of the sheet.

### SheetTitleComponent

Title element.

### SheetDescriptionComponent

Description element.

## Basic Usage

### Right Sheet (Default)

```html
<tolle-sheet>
  <button tolleSheetTrigger>Open Sheet</button>

  <tolle-sheet-content side="right">
    <h2 class="text-lg font-semibold">Sheet Title</h2>
    <p class="text-sm text-muted-foreground">
      This is a sheet content.
    </p>
  </tolle-sheet-content>
</tolle-sheet>
```

### Left Sheet

```html
<tolle-sheet>
  <button tolleSheetTrigger>Open Left Sheet</button>

  <tolle-sheet-content side="left">
    <h2 class="text-lg font-semibold">Left Sheet</h2>
    <p class="text-sm text-muted-foreground">
      Content slides from the left.
    </p>
  </tolle-sheet-content>
</tolle-sheet>
```

### Bottom Sheet

```html
<tolle-sheet>
  <button tolleSheetTrigger>Open Bottom Sheet</button>

  <tolle-sheet-content side="bottom">
    <h2 class="text-lg font-semibold">Bottom Sheet</h2>
    <p class="text-sm text-muted-foreground">
      Content slides from the bottom.
    </p>
  </tolle-sheet-content>
</tolle-sheet>
```

### Top Sheet

```html
<tolle-sheet>
  <button tolleSheetTrigger>Open Top Sheet</button>

  <tolle-sheet-content side="top">
    <h2 class="text-lg font-semibold">Top Sheet</h2>
    <p class="text-sm text-muted-foreground">
      Content slides from the top.
    </p>
  </tolle-sheet-content>
</tolle-sheet>
```

## Sheet with Header and Footer

### Complete Sheet

```html
<tolle-sheet>
  <button tolleSheetTrigger>Settings</button>

  <tolle-sheet-content side="right">
    <tolle-sheet-header>
      <tolle-sheet-title>Settings</tolle-sheet-title>
      <tolle-sheet-description>
        Manage your application settings
      </tolle-sheet-description>
    </tolle-sheet-header>

    <div class="space-y-4 py-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">Theme</label>
        <div class="flex gap-2">
          <button tolleButton size="sm">Light</button>
          <button tolleButton size="sm">Dark</button>
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium">Notifications</label>
        <div class="flex gap-2">
          <button tolleButton size="sm" variant="secondary">Email</button>
          <button tolleButton size="sm" variant="secondary">SMS</button>
        </div>
      </div>
    </div>

    <tolle-sheet-footer>
      <button tolleButton variant="outline" (click)="sheet.close()">Close</button>
      <button tolleButton (click)="saveSettings()">Save</button>
    </tolle-sheet-footer>
  </tolle-sheet-content>
</tolle-sheet>
```

## Sheet Service

### Opening Sheet Programmatically

```typescript
import { SheetService, SheetConfig } from '@tolle_/tolle-ui';

constructor(private sheetService: SheetService) {}

openSheet() {
  const config: SheetConfig = {
    content: 'Sheet content',
    title: 'Title',
    side: 'right',
    hasBackdrop: true
  };

  const sheetRef = this.sheetService.open(config);
}
```

### Sheet with Component Content

```typescript
openComponentSheet() {
  const config: SheetConfig = {
    content: SettingsComponent,
    title: 'Settings',
    side: 'right',
    data: { userId: this.userId }
  };

  this.sheetService.open(config);
}
```

### Sheet with Template Content

```typescript
@ViewChild('sheetTemplate') sheetTemplate!: TemplateRef<any>;

openTemplateSheet() {
  const config: SheetConfig = {
    content: this.sheetTemplate,
    title: 'Template Sheet',
    side: 'left'
  };

  this.sheetService.open(config);
}
```

## Sheet Sizes

### Full Width Sheet

```html
<tolle-sheet-content side="left" class="sm:max-w-sm">
  <!-- Content -->
</tolle-sheet-content>
```

### Medium Sheet

```html
<tolle-sheet-content side="right" class="w-3/4">
  <!-- Content -->
</tolle-sheet-content>
```

### Large Sheet

```html
<tolle-sheet-content side="right" class="w-full">
  <!-- Content -->
</tolle-sheet-content>
```

## Sheet with Form

```html
<tolle-sheet>
  <button tolleSheetTrigger>Filter</button>

  <tolle-sheet-content side="right">
    <tolle-sheet-header>
      <tolle-sheet-title>Filters</tolle-sheet-title>
    </tolle-sheet-header>

    <div class="space-y-4 py-4">
      <tolle-input label="Name" />
      <tolle-input label="Email" type="email" />
      <div class="space-y-2">
        <label class="text-sm font-medium">Status</label>
        <select class="w-full rounded-md border px-3 py-2">
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
    </div>

    <tolle-sheet-footer>
      <button tolleButton variant="outline" (click)="sheet.close()">Cancel</button>
      <button tolleButton>Apply Filters</button>
    </tolle-sheet-footer>
  </tolle-sheet-content>
</tolle-sheet>
```

## Sheet with Sidebar Content

### Navigation Sheet

```html
<tolle-sheet>
  <button tolleSheetTrigger class="p-2">
    <i class="ri-menu-line"></i>
  </button>

  <tolle-sheet-content side="left" class="sm:max-w-xs">
    <tolle-sheet-header>
      <tolle-sheet-title>Menu</tolle-sheet-title>
    </tolle-sheet-header>

    <nav class="space-y-1 py-4">
      <button tolleButton variant="ghost" class="w-full justify-start">
        <i class="ri-home-line mr-2"></i>
        Home
      </button>
      <button tolleButton variant="ghost" class="w-full justify-start">
        <i class="ri-user-line mr-2"></i>
        Profile
      </button>
      <button tolleButton variant="ghost" class="w-full justify-start">
        <i class="ri-settings-line mr-2"></i>
        Settings
      </button>
    </nav>
  </tolle-sheet-content>
</tolle-sheet>
```

## Sheet with Rounded Corners

### Rounded Sheet

```html
<tolle-sheet-content side="right" [rounded]="true">
  <h2 class="text-lg font-semibold">Rounded Sheet</h2>
  <p class="text-sm text-muted-foreground">
    This sheet has rounded corners on the inner side.
  </p>
</tolle-sheet-content>
```

## Sheet with Backdrop

### No Backdrop Sheet

```html
<tolle-sheet [hasBackdrop]="false">
  <button tolleSheetTrigger>Open</button>

  <tolle-sheet-content side="right">
    <p>No backdrop effect</p>
  </tolle-sheet-content>
</tolle-sheet>
```

## Sheet in Responsive Layout

### Mobile Sheet

```html
<tolle-sheet>
  <button tolleSheetTrigger class="lg:hidden p-2">
    <i class="ri-menu-line"></i>
  </button>

  <tolle-sheet-content side="left" class="sm:max-w-xs">
    <p class="lg:hidden">Mobile menu</p>
    <p class="hidden lg:block">Desktop menu</p>
  </tolle-sheet-content>
</tolle-sheet>
```

## Sheet with Close Button

### Custom Close Button

```html
<tolle-sheet-content side="right">
  <button
    (click)="sheet.close()"
    class="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
  >
    <i class="ri-close-line"></i>
  </button>
  <p class="pl-8">Content with custom close button</p>
</tolle-sheet-content>
```

## Sheet with Animation

### Custom Animation

```html
<tolle-sheet-content
  side="right"
  class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
>
  <!-- Content -->
</tolle-sheet-content>
```
