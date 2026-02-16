# Checkbox Component Usage Guide

## Overview

The Checkbox component allows users to select one or more options from a list. It implements the ControlValueAccessor interface for use with Angular forms.

## Import

```typescript
import { CheckboxComponent } from '@tolle_/tolle-ui';
```

## CheckboxComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `size` | `'xs'\|'sm'\|'default'\|'lg'` | `'default'` | Checkbox size |
| `checked` | `boolean` | `false` | Checked state (for standalone use) |
| `ngModel` | `any` | `null` | Two-way binding value |
| `formControlName` | `string` | - | Form control name |

## Basic Usage

### Single Checkbox

```html
<label class="flex items-center gap-2">
  <input type="checkbox" tolleCheckbox />
  <span>Agree to terms</span>
</label>
```

### Disabled Checkbox

```html
<label class="flex items-center gap-2">
  <input type="checkbox" tolleCheckbox [disabled]="true" />
  <span class="text-muted-foreground">Cannot be changed</span>
</label>
```

### Checkbox with ngModel

```html
<input type="checkbox" tolleCheckbox [(ngModel)]="isSelected" />
<span>Selected: {{ isSelected }}</span>
```

### Checkbox in Form

```html
<form [formGroup]="form">
  <input type="checkbox" tolleCheckbox formControlName="terms" />
  <span>Accept terms</span>
</form>
```

## Checkbox Sizes

### Extra Small (xs)

```html
<input type="checkbox" tolleCheckbox size="xs" />
<span class="text-xs">Extra Small</span>
```

### Small (sm)

```html
<input type="checkbox" tolleCheckbox size="sm" />
<span class="text-sm">Small</span>
```

### Default

```html
<input type="checkbox" tolleCheckbox />
<span class="text-base">Default</span>
```

### Large (lg)

```html
<input type="checkbox" tolleCheckbox size="lg" />
<span class="text-lg">Large</span>
```

## Checkbox States

### Checked

```html
<input type="checkbox" tolleCheckbox [checked]="true" />
<span>Checked</span>
```

### Indeterminate (via template reference)

```html
<input type="checkbox" tolleCheckbox #checkbox="ngModel" [(ngModel)]="value" />
<button (click)="checkbox.indeterminate = true">Set Indeterminate</button>
```

## Checkbox Group

### Basic Group

```html
<div class="space-y-2">
  <label class="flex items-center gap-2">
    <input type="checkbox" tolleCheckbox [value]="'apple'" [(ngModel)]="fruits" />
    <span>Apple</span>
  </label>
  <label class="flex items-center gap-2">
    <input type="checkbox" tolleCheckbox [value]="'banana'" [(ngModel)]="fruits" />
    <span>Banana</span>
  </label>
  <label class="flex items-center gap-2">
    <input type="checkbox" tolleCheckbox [value]="'orange'" [(ngModel)]="fruits" />
    <span>Orange</span>
  </label>
</div>
<p>Selected: {{ fruits | json }}</p>
```

### Group with ngModel

```typescript
fruits: string[] = ['apple'];

toggleFruit(fruit: string) {
  const index = this.fruits.indexOf(fruit);
  if (index > -1) {
    this.fruits.splice(index, 1);
  } else {
    this.fruits.push(fruit);
  }
}
```

## Checkbox with Label

```html
<div class="flex items-start gap-3">
  <input type="checkbox" tolleCheckbox id="checkbox" />
  <label for="checkbox" class="flex-1">
    <span class="block font-medium">Subscribe to newsletter</span>
    <span class="block text-sm text-muted-foreground">Receive updates weekly</span>
  </label>
</div>
```

## Checkbox with Helper Text

```html
<div class="space-y-2">
  <label class="flex items-center gap-2">
    <input type="checkbox" tolleCheckbox />
    <span>Allow notifications</span>
  </label>
  <p class="text-xs text-muted-foreground ml-6">
    You will receive notifications about new messages
  </p>
</div>
```

## Checkbox with Error State

```html
<div class="space-y-2">
  <label class="flex items-center gap-2">
    <input type="checkbox" tolleCheckbox [class.border-destructive]="!form.valid" />
    <span>Required option</span>
  </label>
  <p class="text-xs text-destructive" *ngIf="!form.valid && !selected">
    This field is required
  </p>
</div>
```

## Checkbox in Table

```html
<table class="w-full">
  <thead>
    <tr>
      <th>
        <input type="checkbox" tolleCheckbox [checked]="allSelected" (change)="toggleAll($event)" />
      </th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let item of items">
      <td>
        <input type="checkbox" tolleCheckbox [value]="item.id" [(ngModel)]="selectedIds" />
      </td>
      <td>{{ item.name }}</td>
    </tr>
  </tbody>
</table>
```

## Checkbox with Custom Color

```html
<input
  type="checkbox"
  tolleCheckbox
  class="peer h-4 w-4 rounded border border-primary accent-primary"
/>
<span>Custom accent</span>
```

## Checkbox in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Preferences</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <label class="flex items-center gap-2">
      <input type="checkbox" tolleCheckbox />
      <span>Email notifications</span>
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" tolleCheckbox />
      <span>SMS notifications</span>
    </label>
  </tolle-card-content>
</tolle-card>
```
