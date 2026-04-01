# Collapsible Component Usage Guide

## Overview

The Collapsible component allows users to expand or collapse content sections. It provides smooth animations and supports triggers with state management.

## Import

```typescript
import {
  CollapsibleComponent,
  CollapsibleTriggerComponent,
  CollapsibleContentComponent,
} from '@tolle_/tolle-ui';
```

## Components

### CollapsibleComponent

Container that manages the collapsible state.

**Inputs:**

| Input   | Type      | Default | Description             |
| ------- | --------- | ------- | ----------------------- |
| `open`  | `boolean` | -       | Open state (controlled) |
| `class` | `string`  | `''`    | Additional CSS classes  |

**Outputs:**

| Output       | Type                    | Description                     |
| ------------ | ----------------------- | ------------------------------- |
| `openChange` | `EventEmitter<boolean>` | Emitted when open state changes |

### CollapsibleTriggerComponent

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

### CollapsibleContentComponent

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

## Basic Usage

```html
<tolle-collapsible class="w-[350px] space-y-2 rounded-md border p-4">
  <div class="flex items-center justify-between space-x-4 px-4">
    <h4 class="text-sm font-semibold">@peduarte starred 3 repositories</h4>
    <tolle-collapsible-trigger>
      <tolle-button variant="ghost" size="sm" class="w-9 p-0">
        <i class="ri-arrow-down-s-line h-4 w-4"></i>
        <span class="sr-only">Toggle</span>
      </tolle-button>
    </tolle-collapsible-trigger>
  </div>
  <div class="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/primitives</div>
  <tolle-collapsible-content class="space-y-2">
    <div class="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/colors</div>
    <div class="rounded-md border px-4 py-3 font-mono text-sm">@stitches/react</div>
  </tolle-collapsible-content>
</tolle-collapsible>
```
