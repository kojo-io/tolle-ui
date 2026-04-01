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

| Input         | Type                         | Default        | Description                         |
| ------------- | ---------------------------- | -------------- | ----------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Divider orientation                 |
| `decorative`  | `boolean`                    | `true`         | Whether the separator is decorative |
| `class`       | `string`                     | `''`           | Additional CSS classes              |

## Basic Usage

### Horizontal Separator

```html
<div>
  <div class="space-y-1">
    <h4 class="text-sm font-medium leading-none">Radix Primitives</h4>
    <p class="text-sm text-muted-foreground">An open-source UI component library.</p>
  </div>
  <tolle-separator class="my-4"></tolle-separator>
  <div class="flex h-5 items-center space-x-4 text-sm">
    <div>Blog</div>
    <tolle-separator orientation="vertical"></tolle-separator>
    <div>Docs</div>
    <tolle-separator orientation="vertical"></tolle-separator>
    <div>Source</div>
  </div>
</div>
```

### Vertical Separator

```html
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Profile</div>
  <tolle-separator orientation="vertical"></tolle-separator>
  <div>Settings</div>
  <tolle-separator orientation="vertical"></tolle-separator>
  <div>Logout</div>
</div>
```

### Form Sections

```html
<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium">Personal Information</h3>
    <p class="text-sm text-muted-foreground">Update your personal details.</p>
  </div>

  <tolle-separator />

  <div class="space-y-4">
    <tolle-input label="Full Name" placeholder="John Doe" />
    <tolle-input label="Email" type="email" placeholder="john@example.com" />
  </div>

  <tolle-separator />

  <div>
    <h3 class="text-lg font-medium">Security</h3>
    <p class="text-sm text-muted-foreground">Manage your password and authentication.</p>
  </div>
</div>
```

### Decorative vs Semantic

For decorative separators (visual only), use `decorative="true"` (default). For semantic separators that convey meaning, set `decorative="false"`:

```html
<!-- Decorative (default) - hidden from screen readers -->
<tolle-separator class="my-4"></tolle-separator>

<!-- Semantic - visible to screen readers -->
<nav role="navigation" aria-label="Site navigation">
  <tolle-separator orientation="horizontal" [decorative]="false" />
</nav>
```

### Custom Styling

```html
<!-- Thick separator -->
<tolle-separator class="h-1 bg-primary"></tolle-separator>

<!-- Dashed separator -->
<tolle-separator class="border-t-2 border-dashed border-muted-foreground/20"></tolle-separator>

<!-- Gradient separator -->
<tolle-separator
  class="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"></tolle-separator>
```
