# Multi-Select Component Usage Guide

## Overview

The MultiSelect component provides a specialized dropdown for selecting multiple options. It includes search functionality, selection limits, and displays multiple selected values with chips.

## Import

```typescript
import { MultiSelectComponent } from '@tolle_/tolle-ui';
```

## MultiSelectComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `placeholder` | `string` | `'Select options'` | Placeholder text |
| `size` | `'xs'\|'sm'\|'default'\|'lg'` | `'default'` | Component size |
| `searchable` | `boolean` | `false` | Enable search |
| `disabled` | `boolean` | `false` | Disabled state |
| `class` | `string` | `''` | Additional CSS classes |
| `maxSelections` | `number` | - | Maximum selections allowed |
| `maxDisplayItems` | `number` | - | Max items to display before ellipsis |
| `error` | `boolean` | `false` | Error state |
| `ngModel` | `any[]` | `[]` | Two-way binding value (array) |
| `formControlName` | `string` | - | Form control name |

## Basic Usage

### Basic Multi Select Example

```html
<div class="w-full max-w-sm space-y-4">
      <tolle-multi-select [(ngModel)]="selectedFramworks" placeholder="Select frameworks...">
        <tolle-select-item value="angular">Angular</tolle-select-item>
        <tolle-select-item value="react">React</tolle-select-item>
        <tolle-select-item value="vue">Vue</tolle-select-item>
        <tolle-select-item value="svelte">Svelte</tolle-select-item>
        <tolle-select-item value="ember">Ember</tolle-select-item>
      </tolle-multi-select>

      <div class="text-sm text-muted-foreground">
        Selected: {{ selectedFramworks | json }}
      </div>
    </div>
```

