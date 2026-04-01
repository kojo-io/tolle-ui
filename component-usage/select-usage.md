# Select Component Usage Guide

## Overview

The Select component provides a searchable dropdown for selecting options. It supports single and multi-select modes, search functionality, and implements ControlValueAccessor for Angular forms.

## Import

```typescript
import { SelectComponent, SelectItemComponent, SelectGroupComponent } from '@tolle_/tolle-ui';
```

## Components

### SelectComponent

**Inputs:**

| Input             | Type                          | Default              | Description                     |
| ----------------- | ----------------------------- | -------------------- | ------------------------------- |
| `placeholder`     | `string`                      | `'Select an option'` | Placeholder text                |
| `size`            | `'xs'\|'sm'\|'default'\|'lg'` | `'default'`          | Select size                     |
| `searchable`      | `boolean`                     | `false`              | Enable search                   |
| `disabled`        | `boolean`                     | `false`              | Disabled state                  |
| `class`           | `string`                      | `''`                 | Additional CSS classes          |
| `maxSelections`   | `number`                      | -                    | Max selections for multi-select |
| `maxDisplayItems` | `number`                      | -                    | Max items to display            |
| `ngModel`         | `any`                         | `null`               | Two-way binding value           |
| `formControlName` | `string`                      | -                    | Form control name               |

### SelectItemComponent

**Inputs:**

| Input         | Type      | Default | Description            |
| ------------- | --------- | ------- | ---------------------- |
| `value`       | `any`     | -       | Item value (required)  |
| `class`       | `string`  | `''`    | Additional CSS classes |
| `selected`    | `boolean` | `false` | Selected state         |
| `disabled`    | `boolean` | `false` | Disabled state         |
| `multiSelect` | `boolean` | `false` | Multi-select mode      |

### SelectGroupComponent

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

## Basic Usage

### Basic Select Example

```html
<div class="w-full max-w-[200px] space-y-4">
  <tolle-select [(ngModel)]="selectedFruit" placeholder="Select a fruit">
    <tolle-select-item value="apple">Apple</tolle-select-item>
    <tolle-select-item value="banana">Banana</tolle-select-item>
    <tolle-select-item value="orange">Orange</tolle-select-item>
    <tolle-select-item value="grape">Grape</tolle-select-item>
  </tolle-select>

  <div class="text-sm text-muted-foreground">Selected: {{ selectedFruit || 'None' }}</div>
</div>
```

## Accessibility

The Select component follows WAI-ARIA combobox/listbox patterns:

- **Role**: Uses `role="listbox"` for the dropdown and `role="option"` for items.
- **Labels**: Always associate a visible label with the select using a wrapping `<label>` element.
- **Keyboard Navigation**:
  - Space/Enter: Open/close dropdown
  - Up/Down Arrows: Navigate between options
  - Escape: Close dropdown without selection
  - Home/End: Jump to first/last option
  - Type-to-search: Filter options by typing when searchable is enabled
- **Focus Management**: Focus is trapped within the dropdown when open. Focus returns to the trigger when closed.
- **Screen Readers**: Selected option is announced via `aria-selected` and `aria-activedescendant`.
- **Disabled State**: Disabled selects are not focusable and excluded from the accessibility tree.

```html
<label class="mb-2 block text-sm font-medium" for="country">Country</label>
<tolle-select [(ngModel)]="selectedCountry" placeholder="Select your country" searchable>
  <tolle-select-item *ngFor="let country of countries" [value]="country.code">
    {{ country.name }}
  </tolle-select-item>
</tolle-select>
```
