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

## Basic Usage

### Single Checkbox

```html
<tolle-checkbox [(ngModel)]="isSelected" />
<span>Selected: {{ isSelected }}</span>
```

### Disabled Checkbox

```html
<tolle-checkbox [disabled]="true" [(ngModel)]="disabledValue" />
<span class="text-muted-foreground">Cannot be changed</span>
```

### Checkbox with ngModel

```html
<tolle-checkbox [(ngModel)]="isSelected" />
<span>Selected: {{ isSelected }}</span>
```

### Checkbox in Reactive Form

```html
<form [formGroup]="form">
  <tolle-checkbox formControlName="terms" />
  <span>Accept terms</span>
</form>
```

```typescript
this.form = this.fb.group({
  terms: [false]
});
```

## Checkbox Sizes

### Extra Small (xs)

```html
<tolle-checkbox size="xs" [(ngModel)]="value" />
<span class="text-xs">Extra Small</span>
```

### Small (sm)

```html
<tolle-checkbox size="sm" [(ngModel)]="value" />
<span class="text-sm">Small</span>
```

### Default

```html
<tolle-checkbox [(ngModel)]="value" />
<span class="text-base">Default</span>
```

### Large (lg)

```html
<tolle-checkbox size="lg" [(ngModel)]="value" />
<span class="text-lg">Large</span>
```

## Checkbox States

### Checked

```html
<tolle-checkbox [ngModel]="true" (ngModelChange)="value = $event" />
<span>Checked</span>
```

### Indeterminate (via template reference)

```html
<tolle-checkbox #checkbox="ngModel" [(ngModel)]="value" />
<button (click)="checkbox.indeterminate = true">Set Indeterminate</button>
```

## Checkbox Group

### Basic Group

```html
<div class="space-y-2">
  <label class="flex items-center gap-2">
    <tolle-checkbox [value]="'apple'" [(ngModel)]="fruits" />
    <span>Apple</span>
  </label>
  <label class="flex items-center gap-2">
    <tolle-checkbox [value]="'banana'" [(ngModel)]="fruits" />
    <span>Banana</span>
  </label>
  <label class="flex items-center gap-2">
    <tolle-checkbox [value]="'orange'" [(ngModel)]="fruits" />
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
  <tolle-checkbox id="checkbox" />
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
    <tolle-checkbox />
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
    <tolle-checkbox [class.border-destructive]="!form.valid" />
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
        <tolle-checkbox [checked]="allSelected" (change)="toggleAll($event)" />
      </th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let item of items">
      <td>
        <tolle-checkbox [value]="item.id" [(ngModel)]="selectedIds" />
      </td>
      <td>{{ item.name }}</td>
    </tr>
  </tbody>
</table>
```

## Checkbox with Custom Color

```html
<tolle-checkbox
  class="bg-blue-500 data-[checked=true]:bg-blue-600"
  [(ngModel)]="value"
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
      <tolle-checkbox />
      <span>Email notifications</span>
    </label>
    <label class="flex items-center gap-2">
      <tolle-checkbox />
      <span>SMS notifications</span>
    </label>
  </tolle-card-content>
</tolle-card>
```
