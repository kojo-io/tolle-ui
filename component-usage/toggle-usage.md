# Toggle Component Usage Guide

## Overview

The Toggle component provides a switch button that can be toggled between on and off states. It's similar to a checkbox but styled as a button with visual feedback.

## Import

```typescript
import {
  ToggleComponent,
  ToggleGroupComponent,
  ToggleGroupItemComponent,
  SegmentComponent
} from '@tolle_/tolle-ui';
```

## Components

### ToggleComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `pressed` | `boolean` | `false` | Pressed/toggled state |
| `variant` | `'default'\|'outline'` | `'default'` | Toggle variant |
| `size` | `'default'\|'sm'\|'lg'` | `'default'` | Toggle size |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |

### ToggleGroupComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | `'single'\|'multiple'` | `'single'` | Selection type |
| `variant` | `'default'\|'outline'` | `'default'` | Variant for all items |
| `size` | `'default'\|'sm'\|'lg'` | `'default'` | Size for all items |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `value` | `any` | - | Current value |
| `valueChange` | `EventEmitter<any>` | - | Emitted when value changes |

### ToggleGroupItemComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | `string` | - | Item value (required) |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |

### SegmentComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `items` | `SegmentItem[]` | `[]` | Array of segment items |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `itemTemplate` | `TemplateRef` | - | Custom item template |
| `value` | `any` | - | Current value |
| `valueChange` | `EventEmitter<any>` | - | Emitted when value changes |

## Basic Usage

```html
<tolle-toggle [(pressed)]="isBold" aria-label="Toggle bold">
  <i class="ri-bold"></i>
</tolle-toggle>
```
