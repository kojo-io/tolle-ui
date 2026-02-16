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

### Single Toggle

```html
<button
  tolleToggle
  [pressed]="isenabled"
  (pressedChange)="isenabled = !isenabled"
>
  {{ isenabled ? 'On' : 'Off' }}
</button>
```

### Toggle with Icon

```html
<button
  tolleToggle
  [pressed]="darkMode"
  (pressedChange)="darkMode = !darkMode"
>
  <i class="ri-moon-line" *ngIf="!darkMode"></i>
  <i class="ri-sun-line" *ngIf="darkMode"></i>
</button>
```

## Toggle Sizes

### Small

```html
<button
  tolleToggle
  size="sm"
  [pressed]="value"
  (pressedChange)="value = !value"
>
  Small
</button>
```

### Default

```html
<button
  tolleToggle
  [pressed]="value"
  (pressedChange)="value = !value"
>
  Default
</button>
```

### Large

```html
<button
  tolleToggle
  size="lg"
  [pressed]="value"
  (pressedChange)="value = !value"
>
  Large
</button>
```

## Toggle Variants

### Default Variant

```html
<div class="space-y-2">
  <button
    tolleToggle
    variant="default"
    [pressed]="true"
  >
    On
  </button>
  <button
    tolleToggle
    variant="default"
    [pressed]="false"
  >
    Off
  </button>
</div>
```

### Outline Variant

```html
<div class="space-y-2">
  <button
    tolleToggle
    variant="outline"
    [pressed]="true"
  >
    On
  </button>
  <button
    tolleToggle
    variant="outline"
    [pressed]="false"
  >
    Off
  </button>
</div>
```

## Toggle Group (Single Select)

### Basic Toggle Group

```html
<tolle-toggle-group
  [(ngModel)]="alignment"
  type="single"
>
  <button
    tolleToggleGroupItem
    value="left"
  >
    <i class="ri-align-left"></i>
  </button>
  <button
    tolleToggleGroupItem
    value="center"
  >
    <i class="ri-align-center"></i>
  </button>
  <button
    tolleToggleGroupItem
    value="right"
  >
    <i class="ri-align-right"></i>
  </button>
</tolle-toggle-group>
<p>Alignment: {{ alignment }}</p>
```

### Toggle Group with Text

```html
<tolle-toggle-group
  [(ngModel)]="visibility"
  type="single"
>
  <button
    tolleToggleGroupItem
    value="public"
  >
    Public
  </button>
  <button
    tolleToggleGroupItem
    value="private"
  >
    Private
  </button>
</tolle-toggle-group>
```

## Toggle Group (Multiple Select)

### Multiple Selection

```html
<tolle-toggle-group
  [(ngModel)]="permissions"
  type="multiple"
>
  <button
    tolleToggleGroupItem
    value="read"
  >
    Read
  </button>
  <button
    tolleToggleGroupItem
    value="write"
  >
    Write
  </button>
  <button
    tolleToggleGroupItem
    value="delete"
  >
    Delete
  </button>
</tolle-toggle-group>
<p>Permissions: {{ permissions | json }}</p>
```

## Segment Component

### Simple Segment

```html
<tolle-segment
  [(ngModel)]="view"
  [items]="[
    { label: 'Grid', value: 'grid', icon: 'ri-grid-line' },
    { label: 'List', value: 'list', icon: 'ri-list-unordered' }
  ]"
/>
```

### Segment with ngModel

```html
<tolle-segment
  [(ngModel)]="selectedMode"
  [items]="modes"
/>
```

```typescript
modes: SegmentItem[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'Pro', value: 'pro' }
];
```

### Segment with Icons

```html
<tolle-segment
  [(ngModel)]="selected"
  [items]="[
    { label: 'Mail', value: 'mail', icon: 'ri-mail-line' },
    { label: 'Calendar', value: 'calendar', icon: 'ri-calendar-line' },
    { label: 'Contacts', value: 'contacts', icon: 'ri-contacts-line' }
  ]"
/>
```

## Toggle in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Appearance</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <div class="font-medium">Dark Mode</div>
        <div class="text-sm text-muted-foreground">Toggle dark theme</div>
      </div>
      <button
        tolleToggle
        [pressed]="darkMode"
        (pressedChange)="darkMode = !darkMode"
      />
    </div>

    <div class="flex items-center justify-between">
      <div>
        <div class="font-medium">Compact Mode</div>
        <div class="text-sm text-muted-foreground">Reduce spacing</div>
      </div>
      <button
        tolleToggle
        [pressed]="compactMode"
        (pressedChange)="compactMode = !compactMode"
      />
    </div>
  </tolle-card-content>
</tolle-card>
```

## Toggle with Custom Styling

### Custom Colors

```html
<button
  tolleToggle
  class="bg-blue-500 data-[pressed=true]:bg-blue-600"
  [pressed]="value"
  (pressedChange)="value = !value"
>
  Custom
</button>
```

### Large Toggle

```html
<button
  tolleToggle
  size="lg"
  class="h-12 px-8 text-lg"
  [pressed]="value"
  (pressedChange)="value = !value"
>
  {{ value ? 'Enabled' : 'Disabled' }}
</button>
```

## Toggle Group in Toolbar

```html
<div class="flex items-center gap-1 p-1 border rounded-md">
  <button
    tolleToggle
    size="sm"
    class="h-8 w-8 p-0"
    [pressed]="bold"
    (pressedChange)="bold = !bold"
  >
    <i class="ri-bold-line"></i>
  </button>
  <button
    tolleToggle
    size="sm"
    class="h-8 w-8 p-0"
    [pressed]="italic"
    (pressedChange)="italic = !italic"
  >
    <i class="ri-italic-line"></i>
  </button>
  <button
    tolleToggle
    size="sm"
    class="h-8 w-8 p-0"
    [pressed]="underline"
    (pressedChange)="underline = !underline"
  >
    <i class="ri-underline-line"></i>
  </button>
</div>
```

## Toggle Group with Disabled Items

```html
<tolle-toggle-group
  [(ngModel)]="selected"
  type="single"
>
  <button
    tolleToggleGroupItem
    value="a"
  >
    Option A
  </button>
  <button
    tolleToggleGroupItem
    value="b"
    [disabled]="true"
  >
    Option B (Locked)
  </button>
  <button
    tolleToggleGroupItem
    value="c"
  >
    Option C
  </button>
</tolle-toggle-group>
```
