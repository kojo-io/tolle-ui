# Separator Component Usage Guide

## Overview

The Separator component displays a horizontal or vertical divider line. It's commonly used to separate content sections in layouts and forms.

## Import

```typescript
import { SeparatorComponent } from '@tolle_/tolle-ui';
```

## Component

### SeparatorComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Divider orientation |
| `decorative` | `boolean` | `true` | Whether the separator is decorative |
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Horizontal Separator

```html
<div class="space-y-4">
  <div>
    <h3 class="text-lg font-semibold">Section 1</h3>
    <p>Content for section 1</p>
  </div>

  <tolle-separator />

  <div>
    <h3 class="text-lg font-semibold">Section 2</h3>
    <p>Content for section 2</p>
  </div>
</div>
```

### Vertical Separator

```html
<div class="flex items-center gap-4">
  <div class="text-center">
    <div class="font-semibold">Users</div>
    <div class="text-sm text-muted-foreground">1,234</div>
  </div>

  <tolle-separator orientation="vertical" />

  <div class="text-center">
    <div class="font-semibold">Orders</div>
    <div class="text-sm text-muted-foreground">567</div>
  </div>

  <tolle-separator orientation="vertical" />

  <div class="text-center">
    <div class="font-semibold">Revenue</div>
    <div class="text-sm text-muted-foreground">$8,900</div>
  </div>
</div>
```

## Decorative vs Semantic

### Decorative Separator (Default)

```html
<tolle-separator decorative="true" />
```

### Semantic Separator with Role

```html
<tolle-separator
  [decorative]="false"
  aria-label="Section divider"
/>
```

## Custom Styling

### Custom Color

```html
<tolle-separator
  class="bg-primary"
  orientation="horizontal"
/>
```

### Custom Thickness

```html
<!-- Thin separator -->
<tolle-separator class="h-[0.5px]" />

<!-- Thick separator -->
<tolle-separator class="h-2 bg-muted" />
```

### Custom Width (Vertical)

```html
<tolle-separator
  orientation="vertical"
  class="w-[2px] bg-border"
/>
```

## Separator in Forms

### Form Section Divider

```html
<form class="space-y-4">
  <div class="space-y-2">
    <label class="text-sm font-medium">Personal Information</label>
    <tolle-input placeholder="First Name" />
    <tolle-input placeholder="Last Name" />
  </div>

  <tolle-separator />

  <div class="space-y-2">
    <label class="text-sm font-medium">Contact Information</label>
    <tolle-input placeholder="Email" type="email" />
    <tolle-input placeholder="Phone" type="tel" />
  </div>
</form>
```

### Field Group Divider

```html
<div class="space-y-4">
  <div class="grid gap-2">
    <label>Username</label>
    <tolle-input />
  </div>

  <tolle-separator />

  <div class="grid gap-2">
    <label>Email</label>
    <tolle-input type="email" />
  </div>

  <tolle-separator />

  <div class="grid gap-2">
    <label>Password</label>
    <tolle-input type="password" />
  </div>
</div>
```

## Separator in Lists

### List Item Divider

```html
<ul class="divide-y">
  <li class="py-3">Item 1</li>
  <li class="py-3">Item 2</li>
  <li class="py-3">Item 3</li>
</ul>

<!-- Or using separator -->
<div class="space-y-0">
  <div class="py-3">Item 1</div>
  <tolle-separator />
  <div class="py-3">Item 2</div>
  <tolle-separator />
  <div class="py-3">Item 3</div>
</div>
```

## Separator in Navigation

### Nav Menu Divider

```html
<div class="flex flex-col space-y-1">
  <button class="px-4 py-2 text-left hover:bg-accent rounded">
    Dashboard
  </button>
  <button class="px-4 py-2 text-left hover:bg-accent rounded">
    Analytics
  </button>

  <tolle-separator />

  <button class="px-4 py-2 text-left hover:bg-accent rounded">
    Settings
  </button>
  <button class="px-4 py-2 text-left hover:bg-accent rounded">
    Profile
  </button>
</div>
```

### Tab Content Divider

```html
<div class="flex border-b">
  <button class="px-4 py-2 border-b-2 border-primary">Overview</button>
  <button class="px-4 py-2 text-muted-foreground hover:text-foreground">Activity</button>
  <button class="px-4 py-2 text-muted-foreground hover:text-foreground">Settings</button>
</div>

<tolle-separator class="my-4" />

<div class="space-y-4">
  <p>Tab content goes here...</p>
</div>
```

## Separator in Card

### Card Content Divider

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>User Profile</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <div>
      <h4 class="text-sm font-medium mb-1">Personal Info</h4>
      <p class="text-sm">John Doe</p>
      <p class="text-sm">john@example.com</p>
    </div>

    <tolle-separator />

    <div>
      <h4 class="text-sm font-medium mb-1">Contact</h4>
      <p class="text-sm">+1 (555) 123-4567</p>
      <p class="text-sm">123 Main St, City</p>
    </div>

    <tolle-separator />

    <div>
      <h4 class="text-sm font-medium mb-1">Preferences</h4>
      <div class="flex items-center justify-between">
        <span class="text-sm">Email notifications</span>
        <tolle-switch />
      </div>
    </div>
  </tolle-card-content>
</tolle-card>
```

## Separator in Grid

### Grid Column Divider

```html
<div class="grid grid-cols-3 gap-4">
  <div class="p-4 bg-muted rounded-lg">
    <div class="font-semibold">Metric 1</div>
    <div class="text-2xl">1,234</div>
  </div>

  <tolle-separator orientation="vertical" />

  <div class="p-4 bg-muted rounded-lg">
    <div class="font-semibold">Metric 2</div>
    <div class="text-2xl">567</div>
  </div>

  <tolle-separator orientation="vertical" />

  <div class="p-4 bg-muted rounded-lg">
    <div class="font-semibold">Metric 3</div>
    <div class="text-2xl">890</div>
  </div>
</div>
```

## Responsive Separators

### Conditional Separator

```html
<div class="flex flex-col sm:flex-row items-center gap-4">
  <div class="flex-1">Left content</div>

  <tolle-separator
    *ngIf="isDesktop"
    orientation="vertical"
    class="w-[1px] h-8"
  />

  <div class="flex-1">Right content</div>
</div>
```
