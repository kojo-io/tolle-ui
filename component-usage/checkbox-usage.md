# Checkbox Component Usage Guide

## Overview

The Checkbox component allows users to select one or more options from a list. It implements the ControlValueAccessor interface for use with Angular forms.

## Import

```typescript
import { CheckboxComponent } from '@tolle_/tolle-ui';
```

## CheckboxComponent

**Inputs:**

| Input      | Type                          | Default     | Description            |
| ---------- | ----------------------------- | ----------- | ---------------------- |
| `class`    | `string`                      | `''`        | Additional CSS classes |
| `disabled` | `boolean`                     | `false`     | Disabled state         |
| `size`     | `'xs'\|'sm'\|'default'\|'lg'` | `'default'` | Checkbox size          |

**Outputs:**

The checkbox implements `ControlValueAccessor`, so value changes are handled through Angular forms:

| Approach        | Syntax                        |
| --------------- | ----------------------------- |
| Two-way binding | `[(ngModel)]="value"`         |
| Reactive forms  | `formControlName="fieldName"` |

When using `ngModel`, the `ngModelChange` event is emitted when the checkbox is toggled.

## Basic Usage

### Basic Checkbox

```html
<div class="flex items-center space-x-2">
  <tolle-checkbox id="terms" />
  <label
    for="terms"
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    Accept terms and conditions
  </label>
</div>
```

### Checkbox Disabled

```html
<div class="flex items-center space-x-2">
  <tolle-checkbox id="terms2" [disabled]="true" />
  <label
    for="terms2"
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    Accept terms and conditions
  </label>
</div>
```

### Checkbox With Description

```html
<div class="items-top flex space-x-2">
  <tolle-checkbox id="terms1" />
  <div class="grid gap-1.5 leading-none">
    <label
      for="terms1"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      Accept terms and conditions
    </label>
    <p class="text-sm text-muted-foreground">
      You agree to our Terms of Service and Privacy Policy.
    </p>
  </div>
</div>
```

## Accessibility

The Checkbox component follows WAI-ARIA checkbox patterns:

- **Role**: Uses `role="checkbox"` with `aria-checked` state.
- **Labels**: Always associate a label via `id`/`for` attributes or by wrapping a `<label>` element.
- **Keyboard Navigation**:
  - Space: Toggle the checkbox state
  - Tab/Shift+Tab: Move focus between form elements
- **State Announcement**: Screen readers announce the checked state via `aria-checked`.
- **Disabled State**: Disabled checkboxes have `aria-disabled="true"` and are not focusable.
- **Indeterminate State**: Use `indeterminate` input for partial selection state (displayed as a dash).

```html
<tolle-checkbox id="required-checkbox" [(ngModel)]="checked"></tolle-checkbox>
<label for="required-checkbox" class="ml-2">I agree to the terms</label>
```

### Indeterminate Checkbox

```html
<tolle-checkbox [indeterminate]="someSelected"></tolle-checkbox>
```
