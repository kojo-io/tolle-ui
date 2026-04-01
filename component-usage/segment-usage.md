# Segment Component Usage Guide

## Overview

The Segment component provides a tab-like control for selecting between different options. It features a sliding indicator and supports form integration via ControlValueAccessor.

## Import

```typescript
import { SegmentedComponent } from '@tolle_/tolle-ui';
```

## Component

### SegmentedComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `items` | `SegmentItem[]` | `[]` | Array of segment items |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Whether the segment is disabled |
| `itemTemplate` | `TemplateRef<any>` | - | Custom template for items |

**SegmentItem Interface:**

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Item label |
| `value` | `any` | Item value |
| `disabled` | `boolean` | Whether item is disabled |
| `icon` | `string` | Optional icon class |
| `class` | `string` | Optional custom class |
| `data` | `any` | Optional data payload |

## Basic Usage

### Basic Segment Example

```html
<div class="space-y-4 max-w-sm">
      <tolle-segment
        [items]="items"
        [(ngModel)]="selectedView"
      ></tolle-segment>
      
      <div class="p-4 border rounded-md bg-muted/20 text-center text-sm">
        Current View: <span class="font-bold">{{ getLabel(selectedView) }}</span>
      </div>
    </div>
```

