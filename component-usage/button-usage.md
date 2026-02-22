# Button Component Usage Guide

## Overview

The Button component is the primary way users interact with your application. It supports multiple variants, sizes, and states.

## Import

```typescript
import { ButtonComponent, ButtonGroupComponent } from '@tolle_/tolle-ui';
```

## Components

### ButtonComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'default'\|'outline'\|'ghost'\|'destructive'\|'secondary'\|'link'` | `'default'` | Button variant |
| `size` | `'xs'\|'sm'\|'default'\|'lg'\|'icon-xs'\|'icon-sm'\|'icon'\|'icon-lg'` | `'default'` | Button size |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `busy` | `boolean` | `false` | Loading state (shows spinner) |

### ButtonGroupComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Default Button

```html
<tolle-button>Click me</tolle-button>
```

### Outlined Button

```html
<tolle-button variant="outline">Outline</tolle-button>
```

### Ghost Button

```html
<tolle-button variant="ghost">Ghost</tolle-button>
```

### Destructive Button

```html
<tolle-button variant="destructive">Delete</tolle-button>
```

### Secondary Button

```html
<tolle-button variant="secondary">Secondary</tolle-button>
```

## Button Sizes

### Extra Small (xs)

```html
<tolle-button size="xs">Extra Small</tolle-button>
```

### Small (sm)

```html
<tolle-button size="sm">Small</tolle-button>
```

### Default

```html
<tolle-button size="default">Default</tolle-button>
```

### Large (lg)

```html
<tolle-button size="lg">Large</tolle-button>
```

## Icon Sizes

### Icon Extra Small

```html
<tolle-button size="icon-xs">
  <i class="ri-upload-line"></i>
</tolle-button>
```

### Icon Small

```html
<tolle-button size="icon-sm">
  <i class="ri-edit-line"></i>
</tolle-button>
```

### Icon (default square)

```html
<tolle-button size="icon">
  <i class="ri-search-line"></i>
</tolle-button>
```

### Icon Large

```html
<tolle-button size="icon-lg">
  <i class="ri-add-line"></i>
</tolle-button>
```

## Disabled State

```html
<tolle-button disabled>Disabled</tolle-button>
<tolle-button variant="outline" disabled>Outline Disabled</tolle-button>
<tolle-button variant="ghost" disabled>Ghost Disabled</tolle-button>
```

## Button with Icon

### Icon on Left

```html
<tolle-button>
  <i class="ri-upload-line"></i>
  <span>Upload</span>
</tolle-button>
```

### Icon on Right

```html
<tolle-button>
  <span>Download</span>
  <i class="ri-download-line"></i>
</tolle-button>
```

### Icon Only

```html
<tolle-button variant="ghost" size="sm">
  <i class="ri-edit-line"></i>
</tolle-button>
```

## Loading State (busy)

### Spinner with Text

```html
<tolle-button [busy]="true">
  <i class="ri-loader-4-line ri-spin mr-2"></i>
  Loading...
</tolle-button>
```

### Spinner Only

```html
<tolle-button variant="ghost" [busy]="true">
  <i class="ri-loader-4-line ri-spin"></i>
</tolle-button>
```

## Button Group

### Horizontal Group

```html
<tolle-button-group class="inline-flex">
  <tolle-button variant="outline">Left</tolle-button>
  <tolle-button variant="outline">Middle</tolle-button>
  <tolle-button variant="outline">Right</tolle-button>
</tolle-button-group>
```

### Vertical Group

```html
<tolle-button-group class="flex flex-col w-48">
  <tolle-button variant="outline">Option 1</tolle-button>
  <tolle-button variant="outline">Option 2</tolle-button>
  <tolle-button variant="outline">Option 3</tolle-button>
</tolle-button-group>
```

### Segmented Control

```html
<tolle-button-group class="inline-flex rounded-md">
  <tolle-button variant="outline" class="rounded-r-none border-r-0">Preview</tolle-button>
  <tolle-button variant="outline" class="rounded-l-none rounded-r-none border-r-0 border-l-0 bg-accent">Code</tolle-button>
  <tolle-button variant="outline" class="rounded-l-none">Settings</tolle-button>
</tolle-button-group>
```

## Link Variant

```html
<tolle-button variant="link">Read more</tolle-button>
```

## Square Button

```html
<tolle-button class="h-10 w-10 p-0">
  <i class="ri-menu-line"></i>
</tolle-button>
```

## Circular Button

```html
<tolle-button class="h-10 w-10 rounded-full p-0">
  <i class="ri-add-line"></i>
</tolle-button>
```

## Link-style Button

```html
<tolle-button variant="ghost" class="text-primary hover:text-primary">
  Read more
</tolle-button>
```

## Block Button

```html
<tolle-button class="w-full">Full Width Button</tolle-button>
```

## Icon Variants

### Icon with Text

```html
<tolle-button variant="secondary">
  <i class="ri-star-line mr-2"></i>
  Favorite
</tolle-button>
```

### Icon Only (Ghost)

```html
<tolle-button variant="ghost" size="sm">
  <i class="ri-heart-line"></i>
</tolle-button>
```

### Icon Only (Default)

```html
<tolle-button class="h-10 w-10 p-0">
  <i class="ri-search-line"></i>
</tolle-button>
```

## Dark Variant

```html
<tolle-button class="bg-slate-900 text-white hover:bg-slate-800">
  Dark Button
</tolle-button>
```

## Custom Style

```html
<tolle-button class="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
  Gradient Button
</tolle-button>
```
