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
| `variant` | `'default'\|'outline'\|'ghost'\|'destructive'\|'secondary'` | `'default'` | Button variant |
| `size` | `'xs'\|'sm'\|'default'\|'lg'` | `'default'` | Button size |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |

### ButtonGroupComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Default Button

```html
<button tolleButton>Click me</button>
```

### Outlined Button

```html
<button tolleButton variant="outline">Outline</button>
```

### Ghost Button

```html
<button tolleButton variant="ghost">Ghost</button>
```

### Destructive Button

```html
<button tolleButton variant="destructive">Delete</button>
```

### Secondary Button

```html
<button tolleButton variant="secondary">Secondary</button>
```

## Button Sizes

### Extra Small (xs)

```html
<button tolleButton size="xs">Extra Small</button>
```

### Small (sm)

```html
<button tolleButton size="sm">Small</button>
```

### Default

```html
<button tolleButton size="default">Default</button>
```

### Large (lg)

```html
<button tolleButton size="lg">Large</button>
```

## Disabled State

```html
<button tolleButton disabled>Disabled</button>
<button tolleButton variant="outline" disabled>Outline Disabled</button>
<button tolleButton variant="ghost" disabled>Ghost Disabled</button>
```

## Button with Icon

### Icon on Left

```html
<button tolleButton>
  <i class="ri-upload-line"></i>
  <span>Upload</span>
</button>
```

### Icon on Right

```html
<button tolleButton>
  <span>Download</span>
  <i class="ri-download-line"></i>
</button>
```

### Icon Only

```html
<button tolleButton variant="ghost" size="sm">
  <i class="ri-edit-line"></i>
</button>
```

## Loading Button

### Spinner with Text

```html
<button tolleButton [disabled]="true">
  <i class="ri-loader-4-line ri-spin mr-2"></i>
  Loading...
</button>
```

### Spinner Only

```html
<button tolleButton variant="ghost" [disabled]="true">
  <i class="ri-loader-4-line ri-spin"></i>
</button>
```

## Button Group

### Horizontal Group

```html
<tolle-button-group class="inline-flex">
  <button tolleButton variant="outline">Left</button>
  <button tolleButton variant="outline">Middle</button>
  <button tolleButton variant="outline">Right</button>
</tolle-button-group>
```

### Vertical Group

```html
<tolle-button-group class="flex flex-col w-48">
  <button tolleButton variant="outline">Option 1</button>
  <button tolleButton variant="outline">Option 2</button>
  <button tolleButton variant="outline">Option 3</button>
</tolle-button-group>
```

### Segmented Control

```html
<tolle-button-group class="inline-flex rounded-md">
  <button tolleButton variant="outline" class="rounded-r-none border-r-0">Preview</button>
  <button tolleButton variant="outline" class="rounded-l-none rounded-r-none border-r-0 border-l-0 bg-accent">Code</button>
  <button tolleButton variant="outline" class="rounded-l-none">Settings</button>
</tolle-button-group>
```

## Square Button

```html
<button tolleButton class="h-10 w-10 p-0">
  <i class="ri-menu-line"></i>
</button>
```

## Circular Button

```html
<button tolleButton class="h-10 w-10 rounded-full p-0">
  <i class="ri-add-line"></i>
</button>
```

## Link-style Button

```html
<button tolleButton variant="ghost" class="text-primary hover:text-primary">
  Read more
</button>
```

## Block Button

```html
<button tolleButton class="w-full">Full Width Button</button>
```

## Icon Variants

### Icon with Text

```html
<button tolleButton variant="secondary">
  <i class="ri-star-line mr-2"></i>
  Favorite
</button>
```

### Icon Only (Ghost)

```html
<button tolleButton variant="ghost" size="sm">
  <i class="ri-heart-line"></i>
</button>
```

### Icon Only (Default)

```html
<button tolleButton class="h-10 w-10 p-0">
  <i class="ri-search-line"></i>
</button>
```

## Dark Variant

```html
<button tolleButton class="bg-slate-900 text-white hover:bg-slate-800">
  Dark Button
</button>
```

## Custom Style

```html
<button tolleButton class="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
  Gradient Button
</button>
```
