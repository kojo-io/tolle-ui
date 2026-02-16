# Popover Component Usage Guide

## Overview

The Popover component displays content in a floating panel that appears on top of other content. It's commonly used for tooltips, quick actions, or additional information.

## Import

```typescript
import {
  PopoverComponent,
  PopoverContentComponent
} from '@tolle_/tolle-ui';
```

## Components

### PopoverComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `open` | `boolean` | `false` | Open state |
| `onOpenChange` | `EventEmitter<boolean>` | - | Emitted when open state changes |
| `placement` | `string` | `'bottom'` | Popover placement |

### PopoverContentComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `width` | `string` | - | Custom width |

## Basic Usage

### Simple Popover

```html
<tolle-popover>
  <div trigger class="cursor-pointer hover:bg-accent p-2 rounded">
    Hover or click me
  </div>
  <tolle-popover-content class="w-64">
    <p>Popover content goes here.</p>
  </tolle-popover-content>
</tolle-popover>
```

### Popover with Button Trigger

```html
<tolle-popover>
  <button tolleButton variant="outline" trigger>More Options</button>
  <tolle-popover-content class="w-48">
    <button tolleButton class="w-full justify-start" variant="ghost">
      <i class="ri-edit-line mr-2"></i> Edit
    </button>
    <button tolleButton class="w-full justify-start" variant="ghost">
      <i class="ri-delete-bin-line mr-2"></i> Delete
    </button>
  </tolle-popover-content>
</tolle-popover>
```

## Popover Positions

### Top

```html
<tolle-popover>
  <button tolleButton trigger>Top</button>
  <tolle-popover-content side="top">
    Content on top
  </tolle-popover-content>
</tolle-popover>
```

### Bottom (Default)

```html
<tolle-popover>
  <button tolleButton trigger>Bottom</button>
  <tolle-popover-content side="bottom">
    Content at bottom
  </tolle-popover-content>
</tolle-popover>
```

### Left

```html
<tolle-popover>
  <button tolleButton trigger>Left</button>
  <tolle-popover-content side="left">
    Content on left
  </tolle-popover-content>
</tolle-popover>
```

### Right

```html
<tolle-popover>
  <button tolleButton trigger>Right</button>
  <tolle-popover-content side="right">
    Content on right
  </tolle-popover-content>
</tolle-popover>
```

## Popover with Trigger Attributes

### Using trigger Attribute

```html
<tolle-popover>
  <div trigger class="cursor-pointer">
    Hover to show
  </div>
  <tolle-popover-content>
    <p>Content appears on hover</p>
  </tolle-popover-content>
</tolle-popover>
```

### Click to Toggle

```html
<tolle-popover>
  <button trigger class="p-2">
    <i class="ri-more-2-fill"></i>
  </button>
  <tolle-popover-content>
    <button tolleButton class="w-full justify-start mb-1">Action 1</button>
    <button tolleButton class="w-full justify-start">Action 2</button>
  </tolle-popover-content>
</tolle-popover>
```

## Popover in Card

```html
<tolle-card>
  <tolle-card-header class="flex justify-between items-center">
    <tolle-card-title>Tasks</tolle-card-title>
    <tolle-popover>
      <button tolleButton variant="ghost" size="sm" trigger>
        <i class="ri-filter-line"></i>
      </button>
      <tolle-popover-content class="w-48">
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" tolleCheckbox />
            <span>Show completed</span>
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" tolleCheckbox />
            <span>Show overdue</span>
          </label>
        </div>
      </tolle-popover-content>
    </tolle-popover>
  </tolle-card-header>
  <tolle-card-content>
    <!-- Content -->
  </tolle-card-content>
</tolle-card>
```

## Popover with Custom Content

### Form in Popover

```html
<tolle-popover>
  <button tolleButton variant="outline" trigger>Filter</button>
  <tolle-popover-content class="w-64">
    <div class="space-y-4">
      <div>
        <label class="text-sm font-medium">Category</label>
        <select class="w-full mt-1 rounded-md border px-2 py-1">
          <option>All</option>
          <option>Work</option>
          <option>Personal</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Priority</label>
        <select class="w-full mt-1 rounded-md border px-2 py-1">
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
      <button tolleButton class="w-full">Apply Filters</button>
    </div>
  </tolle-popover-content>
</tolle-popover>
```

### Avatar in Popover

```html
<tolle-popover>
  <div trigger class="cursor-pointer">
    <tolle-avatar>
      <tolle-avatar-image src="avatar.jpg" />
      <tolle-avatar-fallback>JD</tolle-avatar-fallback>
    </tolle-avatar>
  </div>
  <tolle-popover-content class="w-64">
    <div class="flex items-center gap-3 p-2">
      <tolle-avatar class="h-12 w-12">
        <tolle-avatar-image src="avatar.jpg" />
        <tolle-avatar-fallback>JD</tolle-avatar-fallback>
      </tolle-avatar>
      <div>
        <div class="font-semibold">John Doe</div>
        <div class="text-sm text-muted-foreground">john@example.com</div>
      </div>
    </div>
    <div class="border-t p-2 space-y-1">
      <button tolleButton class="w-full justify-start" size="sm">View Profile</button>
      <button tolleButton class="w-full justify-start" size="sm">Message</button>
    </div>
  </tolle-popover-content>
</tolle-popover>
```

## Popover with Close Button

```html
<tolle-popover>
  <button tolleButton trigger>Info</button>
  <tolle-popover-content class="w-64">
    <div class="flex justify-between items-start mb-2">
      <h4 class="font-semibold">Information</h4>
      <button class="p-1 hover:bg-accent rounded">
        <i class="ri-close-line"></i>
      </button>
    </div>
    <p class="text-sm text-muted-foreground">
      This is additional information that provides context to the user.
    </p>
  </tolle-popover-content>
</tolle-popover>
```

## Popover with Arrow

```html
<tolle-popover>
  <button tolleButton trigger>Hover</button>
  <tolle-popover-content class="w-48">
    <div class="arrow"></div>
    <p>Content with arrow</p>
  </tolle-popover-content>
</tolle-popover>
```

## Popover in Toolbar

```html
<div class="flex items-center gap-2 p-2 border rounded-md">
  <button tolleButton variant="ghost" size="sm">
    <i class="ri-bold-line"></i>
  </button>
  <button tolleButton variant="ghost" size="sm">
    <i class="ri-italic-line"></i>
  </button>

  <div tolle-dropdown-separator class="h-6 w-px mx-2"></div>

  <tolle-popover>
    <button tolleButton variant="ghost" size="sm" trigger>
      <i class="ri-align-left-line"></i>
    </button>
    <tolle-popover-content>
      <button tolleButton class="w-full justify-start mb-1" size="sm">Align Left</button>
      <button tolleButton class="w-full justify-start" size="sm">Align Center</button>
      <button tolleButton class="w-full justify-start" size="sm">Align Right</button>
    </tolle-popover-content>
  </tolle-popover>
</div>
```

## Popover with Delay

### Custom Delay

```html
<!-- Delay can be controlled via component properties or CSS -->
<tolle-popover>
  <button tolleButton trigger>Hover (with delay)</button>
  <tolle-popover-content>
    <p>Delayed content</p>
  </tolle-popover-content>
</tolle-popover>
```

## Popover with Animation

### Animated Popover

```html
<tolle-popover>
  <button tolleButton trigger>Hover</button>
  <tolle-popover-content class="animate-in fade-in zoom-in duration-200">
    <p>Animated content</p>
  </tolle-popover-content>
</tolle-popover>
```

## Popover with Focus Trapping

### Accessible Popover

```html
<tolle-popover>
  <button tolleButton trigger>Settings</button>
  <tolle-popover-content>
    <div class="space-y-2">
      <button tolleButton>Save</button>
      <button tolleButton variant="outline">Cancel</button>
    </div>
  </tolle-popover-content>
</tolle-popover>
```
