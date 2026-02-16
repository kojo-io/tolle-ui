# Select Component Usage Guide

## Overview

The Select component provides a searchable dropdown for selecting options. It supports single and multi-select modes, search functionality, and implements ControlValueAccessor for Angular forms.

## Import

```typescript
import {
  SelectComponent,
  SelectItemComponent,
  SelectGroupComponent
} from '@tolle_/tolle-ui';
```

## Components

### SelectComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `placeholder` | `string` | `'Select an option'` | Placeholder text |
| `size` | `'xs'\|'sm'\|'default'\|'lg'` | `'default'` | Select size |
| `searchable` | `boolean` | `false` | Enable search |
| `disabled` | `boolean` | `false` | Disabled state |
| `class` | `string` | `''` | Additional CSS classes |
| `maxSelections` | `number` | - | Max selections for multi-select |
| `maxDisplayItems` | `number` | - | Max items to display |
| `ngModel` | `any` | `null` | Two-way binding value |
| `formControlName` | `string` | - | Form control name |

### SelectItemComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | `any` | - | Item value (required) |
| `class` | `string` | `''` | Additional CSS classes |
| `selected` | `boolean` | `false` | Selected state |
| `disabled` | `boolean` | `false` | Disabled state |
| `multiSelect` | `boolean` | `false` | Multi-select mode |

### SelectGroupComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Single Select

```html
<tolle-select [(ngModel)]="selectedValue">
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
  <tolle-select-item value="orange">Orange</tolle-select-item>
</tolle-select>
<p>Selected: {{ selectedValue }}</p>
```

### Disabled Select

```html
<tolle-select [disabled]="true">
  <tolle-select-item value="option1">Option 1</tolle-select-item>
  <tolle-select-item value="option2">Option 2</span>
</tolle-select>
```

### Select with Placeholder

```html
<tolle-select placeholder="Choose a fruit..." [(ngModel)]="fruit">
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
  <tolle-select-item value="orange">Orange</tolle-select-item>
</tolle-select>
```

## Searchable Select

### With Search

```html
<tolle-select [(ngModel)]="selected" [searchable]="true" placeholder="Search...">
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
  <tolle-select-item value="cherry">Cherry</tolle-select-item>
  <tolle-select-item value="date">Date</tolle-select-item>
  <tolle-select-item value="elderberry">Elderberry</tolle-select-item>
</tolle-select>
```

## Select Sizes

### Extra Small (xs)

```html
<tolle-select [(ngModel)]="selected" size="xs" placeholder="XS Size">
  <tolle-select-item value="1">Option 1</tolle-select-item>
  <tolle-select-item value="2">Option 2</tolle-select-item>
</tolle-select>
```

### Small (sm)

```html
<tolle-select [(ngModel)]="selected" size="sm" placeholder="SM Size">
  <tolle-select-item value="1">Option 1</tolle-select-item>
  <tolle-select-item value="2">Option 2</tolle-select-item>
</tolle-select>
```

### Default

```html
<tolle-select [(ngModel)]="selected" placeholder="Default Size">
  <tolle-select-item value="1">Option 1</tolle-select-item>
  <tolle-select-item value="2">Option 2</tolle-select-item>
</tolle-select>
```

### Large (lg)

```html
<tolle-select [(ngModel)]="selected" size="lg" placeholder="LG Size">
  <tolle-select-item value="1">Option 1</tolle-select-item>
  <tolle-select-item value="2">Option 2</tolle-select-item>
</tolle-select>
```

## Grouped Select

```html
<tolle-select [(ngModel)]="selected" [searchable]="true">
  <tolle-select-group>
    <h3 class="px-3 py-2 text-sm font-semibold">Fruits</h3>
    <tolle-select-item value="apple">Apple</tolle-select-item>
    <tolle-select-item value="banana">Banana</tolle-select-item>
  </tolle-select-group>

  <tolle-select-group>
    <h3 class="px-3 py-2 text-sm font-semibold">Vegetables</h3>
    <tolle-select-item value="carrot">Carrot</tolle-select-item>
    <tolle-select-item value="broccoli">Broccoli</tolle-select-item>
  </tolle-select-group>
</tolle-select>
```

## Multi-Select

### Basic Multi-Select

```html
<tolle-select [(ngModel)]="selectedItems" [multiSelect]="true" placeholder="Select items">
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
  <tolle-select-item value="cherry">Cherry</tolle-select-item>
</tolle-select>
<p>Selected: {{ selectedItems | json }}</p>
```

### Multi-Select with Max Selections

```html
<tolle-select
  [(ngModel)]="selected"
  [multiSelect]="true"
  [maxSelections]="3"
  placeholder="Select up to 3 items"
>
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
  <tolle-select-item value="cherry">Cherry</tolle-select-item>
  <tolle-select-item value="date">Date</tolle-select-item>
</tolle-select>
```

## Select with ngModel

### Reactive Form

```typescript
this.form = this.fb.group({
  fruit: ['', Validators.required],
  vegetables: [[], Validators.required]
});
```

```html
<form [formGroup]="form">
  <tolle-select formControlName="fruit" placeholder="Select fruit">
    <tolle-select-item value="apple">Apple</tolle-select-item>
    <tolle-select-item value="banana">Banana</tolle-select-item>
  </tolle-select>

  <tolle-select formControlName="vegetables" [multiSelect]="true" placeholder="Select vegetables">
    <tolle-select-item value="carrot">Carrot</tolle-select-item>
    <tolle-select-item value="broccoli">Broccoli</tolle-select-item>
  </tolle-select>
</form>
```

### Template-driven Form

```html
<form>
  <tolle-select
    [(ngModel)]="selected"
    name="fruit"
    required
    placeholder="Select fruit"
  >
    <tolle-select-item value="apple">Apple</tolle-select-item>
    <tolle-select-item value="banana">Banana</tolle-select-item>
  </tolle-select>
</form>
```

## Select with Error State

```html
<tolle-select
  [(ngModel)]="selected"
  [error]="form.submitted && !selected"
  errorMessage="Please select an option"
  placeholder="Select an option"
>
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
</tolle-select>
```

## Select with Clear Button

```html
<tolle-select
  [(ngModel)]="selected"
  [showClearButton]="true"
  placeholder="Select an option"
>
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
</tolle-select>
```

## Select with Custom Value

```html
<tolle-select [(ngModel)]="selected" [searchable]="true">
  <tolle-select-item [value]="{ id: 1, name: 'Apple' }">
    Apple
  </tolle-select-item>
  <tolle-select-item [value]="{ id: 2, name: 'Banana' }">
    Banana
  </tolle-select-item>
</tolle-select>
<p>Selected: {{ selected?.name }}</p>
```

## Select in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Preferences</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <tolle-select [(ngModel)]="theme" placeholder="Select theme">
      <tolle-select-item value="light">Light</tolle-select-item>
      <tolle-select-item value="dark">Dark</tolle-select-item>
    </tolle-select>

    <tolle-select [(ngModel)]="language" [searchable]="true" placeholder="Select language">
      <tolle-select-item value="en">English</tolle-select-item>
      <tolle-select-item value="es">Spanish</tolle-select-item>
      <tolle-select-item value="fr">French</tolle-select-item>
    </tolle-select>
  </tolle-card-content>
</tolle-card>
```
