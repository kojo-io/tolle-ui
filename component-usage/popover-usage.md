# Popover Component Usage Guide

## Overview

The Popover component displays content in a floating panel that appears on top of other content when triggered. It's commonly used for tooltips, quick actions, forms, or additional information.

## Import

```typescript
import { PopoverComponent, PopoverContentComponent } from '@tolle_/tolle-ui';
```

## Components

### PopoverComponent

**Inputs:**

| Input       | Type                                                                                                                                                                 | Default    | Description      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end' \| 'left-start' \| 'left-end' \| 'right-start' \| 'right-end'` | `'bottom'` | Popover position |

**Outputs:**

| Output    | Type                 | Description                 |
| --------- | -------------------- | --------------------------- |
| `onOpen`  | `EventEmitter<void>` | Emitted when popover opens  |
| `onClose` | `EventEmitter<void>` | Emitted when popover closes |

### PopoverContentComponent

**Inputs:**

| Input   | Type     | Default | Description                          |
| ------- | -------- | ------- | ------------------------------------ |
| `class` | `string` | `''`    | Additional CSS classes               |
| `width` | `string` | -       | Custom width (e.g., '300px', 'w-80') |

## Basic Usage

### Basic Popover

```html
<tolle-popover placement="bottom">
  <tolle-button trigger variant="outline">Open Popover</tolle-button>
  <tolle-popover-content>
    <div class="grid gap-4">
      <h4 class="font-medium leading-none">Dimensions</h4>
      <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
    </div>
  </tolle-popover-content>
</tolle-popover>
```

### All Placements

```html
<!-- Basic placements -->
<div class="flex flex-wrap justify-center gap-4 p-10">
  <tolle-popover placement="top">
    <tolle-button trigger variant="outline">Top</tolle-button>
    <tolle-popover-content><p class="text-sm">Top</p></tolle-popover-content>
  </tolle-popover>

  <tolle-popover placement="bottom">
    <tolle-button trigger variant="outline">Bottom</tolle-button>
    <tolle-popover-content><p class="text-sm">Bottom</p></tolle-popover-content>
  </tolle-popover>

  <tolle-popover placement="left">
    <tolle-button trigger variant="outline">Left</tolle-button>
    <tolle-popover-content><p class="text-sm">Left</p></tolle-popover-content>
  </tolle-popover>

  <tolle-popover placement="right">
    <tolle-button trigger variant="outline">Right</tolle-button>
    <tolle-popover-content><p class="text-sm">Right</p></tolle-popover-content>
  </tolle-popover>
</div>

<!-- Edge-aligned placements -->
<div class="flex flex-wrap justify-center gap-4 p-10">
  <tolle-popover placement="top-start">
    <tolle-button trigger variant="outline">Top Start</tolle-button>
    <tolle-popover-content><p class="text-sm">Top Start</p></tolle-popover-content>
  </tolle-popover>

  <tolle-popover placement="top-end">
    <tolle-button trigger variant="outline">Top End</tolle-button>
    <tolle-popover-content><p class="text-sm">Top End</p></tolle-popover-content>
  </tolle-popover>

  <tolle-popover placement="bottom-start">
    <tolle-button trigger variant="outline">Bottom Start</tolle-button>
    <tolle-popover-content><p class="text-sm">Bottom Start</p></tolle-popover-content>
  </tolle-popover>

  <tolle-popover placement="bottom-end">
    <tolle-button trigger variant="outline">Bottom End</tolle-button>
    <tolle-popover-content><p class="text-sm">Bottom End</p></tolle-popover-content>
  </tolle-popover>
</div>
```

## Controlled State

### Two-way Binding

```typescript
import { Component } from '@angular/core';
import { PopoverComponent, PopoverContentComponent, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [PopoverComponent, PopoverContentComponent, ButtonComponent],
  template: `
    <tolle-popover [(open)]="isPopoverOpen" (onOpenChange)="onPopoverChange($event)">
      <tolle-button trigger variant="outline">
        {{ isPopoverOpen ? 'Close' : 'Open' }} Popover
      </tolle-button>
      <tolle-popover-content>
        <div class="p-4">
          <p class="mb-2 text-sm">Controlled popover</p>
          <tolle-button size="sm" (click)="closePopover()">Close</tolle-button>
        </div>
      </tolle-popover-content>
    </tolle-popover>
  `,
})
export class ExampleComponent {
  isPopoverOpen = false;

  onPopoverChange(open: boolean) {
    console.log('Popover opened:', open);
  }

  closePopover() {
    this.isPopoverOpen = false;
  }
}
```

### Programmatic Open/Close

```typescript
import { Component } from '@angular/core';
import { PopoverComponent, PopoverContentComponent, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [PopoverComponent, PopoverContentComponent, ButtonComponent],
  template: `
    <div class="space-x-2">
      <tolle-button size="sm" (click)="openPopover()">Open</tolle-button>
      <tolle-button size="sm" (click)="closePopover()">Close</tolle-button>
    </div>

    <tolle-popover [open]="isPopoverOpen" (onOpenChange)="onOpenChange($event)">
      <span class="cursor-pointer rounded bg-muted px-3 py-1 text-sm"> Hover target </span>
      <tolle-popover-content>
        <div class="p-4">Programmatically controlled popover</div>
      </tolle-popover-content>
    </tolle-popover>
  `,
})
export class ExampleComponent {
  isPopoverOpen = false;

  openPopover() {
    this.isPopoverOpen = true;
  }

  closePopover() {
    this.isPopoverOpen = false;
  }

  onOpenChange(open: boolean) {
    this.isPopoverOpen = open;
  }
}
```

## Use Cases

### Form in Popover

```html
<tolle-popover placement="bottom">
  <tolle-button trigger variant="outline"> Edit Name </tolle-button>
  <tolle-popover-content width="300px">
    <div class="space-y-4 p-2">
      <div class="space-y-2">
        <tolle-label for="name">Name</tolle-label>
        <tolle-input id="name" placeholder="Enter your name" [(ngModel)]="name" />
      </div>
      <div class="flex justify-end gap-2">
        <tolle-button variant="outline" size="sm">Cancel</tolle-button>
        <tolle-button size="sm">Save</tolle-button>
      </div>
    </div>
  </tolle-popover-content>
</tolle-popover>
```

### Color Picker

```html
<tolle-popover placement="right">
  <div
    trigger
    class="h-10 w-10 cursor-pointer rounded-md border"
    [style.background]="selectedColor"></div>
  <tolle-popover-content width="auto">
    <div class="grid grid-cols-6 gap-1 p-2">
      <button
        *ngFor="let color of colors"
        (click)="selectColor(color)"
        class="h-6 w-6 rounded-md border transition-transform hover:scale-110"
        [style.background]="color"></button>
    </div>
  </tolle-popover-content>
</tolle-popover>
```

```typescript
import { Component } from '@angular/core';

@Component({
  // ...
})
export class ExampleComponent {
  selectedColor = '#2563eb';
  colors = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#14b8a6',
    '#2563eb',
    '#7c3aed',
    '#ec4899',
    '#f43f5e',
    '#fb923c',
    '#facc15',
    '#4ade80',
    '#2dd4bf',
    '#3b82f6',
    '#a855f7',
    '#f472b6',
  ];

  selectColor(color: string) {
    this.selectedColor = color;
  }
}
```

### Date Picker in Popover

```html
<tolle-popover placement="bottom">
  <tolle-button trigger variant="outline" class="w-[200px] justify-start">
    <i class="ri-calendar-line mr-2"></i>
    {{ selectedDate | date:'MMM dd, yyyy' }}
  </tolle-button>
  <tolle-popover-content>
    <tolle-calendar [(ngModel)]="selectedDate"></tolle-calendar>
  </tolle-popover-content>
</tolle-popover>
```

### Info Tooltip

```html
<tolle-popover placement="top">
  <button trigger class="rounded-full bg-muted p-1 text-muted-foreground hover:bg-muted/80">
    <i class="ri-information-line"></i>
  </button>
  <tolle-popover-content class="w-80">
    <div class="space-y-2">
      <h4 class="font-medium">What is this?</h4>
      <p class="text-sm text-muted-foreground">
        This is an informational popover that provides additional context when users need more
        details about a feature or setting.
      </p>
    </div>
  </tolle-popover-content>
</tolle-popover>
```

### Actions Menu

```html
<tolle-popover placement="bottom-start">
  <tolle-button trigger variant="ghost" size="icon">
    <i class="ri-more-2-fill"></i>
  </tolle-button>
  <tolle-popover-content width="180px">
    <div class="p-2">
      <button
        class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
        <i class="ri-edit-line"></i>
        Edit
      </button>
      <button
        class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent">
        <i class="ri-file-copy-line"></i>
        Duplicate
      </button>
      <div class="my-1 h-px bg-border"></div>
      <button
        class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10">
        <i class="ri-delete-bin-line"></i>
        Delete
      </button>
    </div>
  </tolle-popover-content>
</tolle-popover>
```

### Confirm Delete Popover

```html
<tolle-popover placement="top">
  <tolle-button trigger variant="destructive" size="sm">
    <i class="ri-delete-bin-line mr-1"></i>
    Delete
  </tolle-button>
  <tolle-popover-content>
    <div class="space-y-3 p-1">
      <p class="text-sm">Are you sure you want to delete this item?</p>
      <div class="flex justify-end gap-2">
        <tolle-button variant="outline" size="sm">Cancel</tolle-button>
        <tolle-button variant="destructive" size="sm" (click)="deleteItem()">Delete</tolle-button>
      </div>
    </div>
  </tolle-popover-content>
</tolle-popover>
```

### User Avatar Info

```html
<tolle-popover placement="bottom">
  <tolle-avatar trigger class="cursor-pointer" size="sm">
    <img src="https://github.com/shadcn.png" />
  </tolle-avatar>
  <tolle-popover-content width="280px">
    <div class="flex items-start gap-3 p-2">
      <tolle-avatar size="lg">
        <img src="https://github.com/shadcn.png" />
      </tolle-avatar>
      <div>
        <h4 class="font-semibold">John Doe</h4>
        <p class="text-sm text-muted-foreground">john@example.com</p>
        <div class="mt-2 flex gap-1">
          <span class="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">Admin</span>
          <span class="rounded bg-muted px-2 py-0.5 text-xs">Verified</span>
        </div>
      </div>
    </div>
  </tolle-popover-content>
</tolle-popover>
```

### Select with Popover

```html
<tolle-popover placement="bottom-start">
  <div
    trigger
    class="flex w-[200px] cursor-pointer items-center justify-between rounded-md border px-3 py-2 hover:border-primary">
    <span>{{ selectedItem || 'Select an option' }}</span>
    <i class="ri-arrow-down-s-line"></i>
  </div>
  <tolle-popover-content width="200px">
    <div class="max-h-[200px] overflow-auto">
      <button
        *ngFor="let item of items"
        (click)="selectItem(item)"
        [class.selected]="selectedItem === item"
        class="flex w-full items-center rounded-sm px-3 py-2 text-sm hover:bg-accent">
        {{ item }}
      </button>
    </div>
  </tolle-popover-content>
</tolle-popover>
```

## Accessibility

The Popover component follows WAI-ARIA patterns:

- **Roles**: The popover content has `role="dialog"` or `role="tooltip"` depending on content.
- **Keyboard Navigation**:
  - Escape: Close the popover
  - Tab: Navigate between focusable elements within the popover
- **Focus Management**:
  - Focus moves to the popover content when opened (if interactive)
  - Focus returns to the trigger element when closed
- **Screen Readers**: The trigger element should have `aria-expanded` and `aria-haspopup` attributes.
