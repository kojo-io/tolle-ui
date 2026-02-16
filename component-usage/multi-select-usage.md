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

### Simple Multi-Select

```html
<tolle-multi-select
  [(ngModel)]="selectedFruits"
  placeholder="Select fruits"
>
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
  <tolle-select-item value="orange">Orange</tolle-select-item>
</tolle-multi-select>
<p>Selected: {{ selectedFruits | json }}</p>
```

### Disabled Multi-Select

```html
<tolle-multi-select
  [disabled]="true"
  [value]="['apple', 'banana']"
  placeholder="Read only selection"
/>
```

## Searchable Multi-Select

```html
<tolle-multi-select
  [(ngModel)]="selectedItems"
  [searchable]="true"
  placeholder="Search and select..."
>
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
  <tolle-select-item value="cherry">Cherry</tolle-select-item>
  <tolle-select-item value="date">Date</tolle-select-item>
  <tolle-select-item value="elderberry">Elderberry</tolle-select-item>
  <tolle-select-item value="fig">Fig</tolle-select-item>
  <tolle-select-item value="grape">Grape</tolle-select-item>
</tolle-multi-select>
```

## Multi-Select with Max Selections

### Limit Selections

```html
<tolle-multi-select
  [(ngModel)]="selected"
  [maxSelections]="3"
  [searchable]="true"
  placeholder="Select up to 3 items"
>
  <tolle-select-item value="item1">Item 1</tolle-select-item>
  <tolle-select-item value="item2">Item 2</tolle-select-item>
  <tolle-select-item value="item3">Item 3</tolle-select-item>
  <tolle-select-item value="item4">Item 4</tolle-select-item>
  <tolle-select-item value="item5">Item 5</tolle-select-item>
</tolle-multi-select>
```

## Multi-Select Sizes

### Extra Small (xs)

```html
<tolle-multi-select
  [(ngModel)]="selected"
  size="xs"
  placeholder="XS Size"
>
  <tolle-select-item value="1">Option 1</tolle-select-item>
  <tolle-select-item value="2">Option 2</tolle-select-item>
</tolle-multi-select>
```

### Small (sm)

```html
<tolle-multi-select
  [(ngModel)]="selected"
  size="sm"
  placeholder="SM Size"
>
  <tolle-select-item value="1">Option 1</tolle-select-item>
  <tolle-select-item value="2">Option 2</tolle-select-item>
</tolle-multi-select>
```

### Large (lg)

```html
<tolle-multi-select
  [(ngModel)]="selected"
  size="lg"
  placeholder="LG Size"
>
  <tolle-select-item value="1">Option 1</tolle-select-item>
  <tolle-select-item value="2">Option 2</tolle-select-item>
</tolle-multi-select>
```

## Multi-Select with maxDisplayItems

### Limit Displayed Items

```html
<tolle-multi-select
  [(ngModel)]="selected"
  [maxDisplayItems]="2"
  [searchable]="true"
  placeholder="Select items"
>
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
  <tolle-select-item value="cherry">Cherry</tolle-select-item>
  <tolle-select-item value="date">Date</tolle-select-item>
</tolle-multi-select>
<!-- Shows: "2 selected" when more than 2 items selected -->
```

## Multi-Select in Form

### Reactive Form

```typescript
this.form = this.fb.group({
  fruits: [[], Validators.required],
  tags: [[], Validators.maxLength(5)]
});
```

```html
<form [formGroup]="form">
  <tolle-multi-select
    formControlName="fruits"
    [searchable]="true"
    placeholder="Select fruits"
  >
    <tolle-select-item value="apple">Apple</tolle-select-item>
    <tolle-select-item value="banana">Banana</tolle-select-item>
    <tolle-select-item value="orange">Orange</tolle-select-item>
  </tolle-multi-select>

  <tolle-multi-select
    formControlName="tags"
    [maxSelections]="5"
    [searchable]="true"
    placeholder="Add tags (max 5)"
  >
    <tolle-select-item value="urgent">Urgent</tolle-select-item>
    <tolle-select-item value="important">Important</tolle-select-item>
    <tolle-select-item value="review">Review</tolle-select-item>
  </tolle-multi-select>
</form>
```

### Template-driven Form

```html
<form>
  <tolle-multi-select
    [(ngModel)]="selectedItems"
    name="items"
    required
    [searchable]="true"
    placeholder="Select items"
  >
    <tolle-select-item value="1">Option 1</tolle-select-item>
    <tolle-select-item value="2">Option 2</tolle-select-item>
  </tolle-multi-select>
</form>
```

## Multi-Select with Error State

```html
<tolle-multi-select
  [(ngModel)]="selected"
  [error]="form.submitted && selected.length === 0"
  errorMessage="Please select at least one option"
  placeholder="Select options"
>
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
</tolle-multi-select>
```

## Multi-Select with Custom Values

### Object Values

```html
<tolle-multi-select
  [(ngModel)]="selectedUsers"
  [searchable]="true"
  placeholder="Select users"
>
  <tolle-select-item [value]="{ id: 1, name: 'John Doe' }">
    John Doe
  </tolle-select-item>
  <tolle-select-item [value]="{ id: 2, name: 'Jane Smith' }">
    Jane Smith
  </tolle-select-item>
  <tolle-select-item [value]="{ id: 3, name: 'Bob Johnson' }">
    Bob Johnson
  </tolle-select-item>
</tolle-multi-select>
<p>Selected: {{ selectedUsers | json }}</p>
```

## Multi-Select with Clear Button

```html
<tolle-multi-select
  [(ngModel)]="selected"
  [showClearButton]="true"
  [searchable]="true"
  placeholder="Select options"
>
  <tolle-select-item value="apple">Apple</tolle-select-item>
  <tolle-select-item value="banana">Banana</tolle-select-item>
</tolle-multi-select>
```

## Multi-Select in Modal

```html
<tolle-alert-dialog>
  <tolle-alert-dialog-trigger>
    <button>Configure Settings</button>
  </tolle-alert-dialog-trigger>

  <tolle-alert-dialog-portal>
    <tolle-alert-dialog-content>
      <tolle-alert-dialog-header>
        <tolle-alert-dialog-title>Configure Permissions</tolle-alert-dialog-title>
      </tolle-alert-dialog-header>

      <tolle-alert-dialog-content class="space-y-4">
        <tolle-multi-select
          [(ngModel)]="permissions"
          [searchable]="true"
          placeholder="Select permissions"
        >
          <tolle-select-item value="read">Read</tolle-select-item>
          <tolle-select-item value="write">Write</tolle-select-item>
          <tolle-select-item value="delete">Delete</tolle-select-item>
          <tolle-select-item value="admin">Admin</tolle-select-item>
        </tolle-multi-select>
      </tolle-alert-dialog-content>

      <tolle-alert-dialog-footer>
        <tolle-alert-dialog-cancel>
          <button variant="outline">Cancel</button>
        </tolle-alert-dialog-cancel>
        <tolle-alert-dialog-action>
          <button>Save</button>
        </tolle-alert-dialog-action>
      </tolle-alert-dialog-footer>
    </tolle-alert-dialog-content>
  </tolle-alert-dialog-portal>
</tolle-alert-dialog>
```
