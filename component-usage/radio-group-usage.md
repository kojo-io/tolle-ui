# Radio Group Component Usage Guide

## Overview

The RadioGroup component provides a container for radio buttons with built-in form integration. It manages the selection state and implements ControlValueAccessor for Angular forms.

## Import

```typescript
import { RadioGroupComponent, RadioItemComponent } from '@tolle_/tolle-ui';
```

## Components

### RadioGroupComponent

Container for radio items.

**Inputs:**

| Input             | Type      | Default        | Description            |
| ----------------- | --------- | -------------- | ---------------------- |
| `class`           | `string`  | `''`           | Additional CSS classes |
| `disabled`        | `boolean` | `false`        | Disabled state         |
| `name`            | `string`  | Auto-generated | Radio group name       |
| `ngModel`         | `any`     | `null`         | Two-way binding value  |
| `formControlName` | `string`  | -              | Form control name      |

### RadioItemComponent

Individual radio button item.

**Inputs:**

| Input      | Type      | Default | Description            |
| ---------- | --------- | ------- | ---------------------- |
| `value`    | `any`     | -       | Radio value (required) |
| `disabled` | `boolean` | `false` | Disabled state         |
| `class`    | `string`  | `''`    | Additional CSS classes |

## Basic Usage

### Basic Radio Group Example

```html
<div class="flex flex-col gap-4">
  <tolle-radio-group [(ngModel)]="selectedPlan">
    <tolle-radio-item value="free">Free Plan</tolle-radio-item>
    <tolle-radio-item value="pro">Pro Plan</tolle-radio-item>
    <tolle-radio-item value="enterprise">Enterprise Plan</tolle-radio-item>
  </tolle-radio-group>

  <div class="text-sm text-muted-foreground">Selected: {{ selectedPlan | json }}</div>
</div>
```

## Accessibility

The Radio Group component follows WAI-ARIA radio group patterns:

- **Role**: Container uses `role="radiogroup"` and items use `role="radio"`.
- **Labels**: Provide a visible label for the group using `<legend>` or a heading element.
- **Keyboard Navigation**:
  - Up/Down Arrows: Move between radio items within the group
  - Left/Right Arrows: Also navigate between items
  - Space/Enter: Select the focused item
  - Tab/Shift+Tab: Move focus into/out of the radio group (focus lands on the selected item or first item)
- **Selection Announcement**: `aria-checked` indicates which item is selected. Only one item can be selected at a time.
- **Focus Management**: Focus stays within the group when using arrow keys. Tab moves to the next focusable element outside the group.
- **Disabled State**: Disabled items have `aria-disabled="true"` and are skipped in keyboard navigation.

```html
<fieldset>
  <legend class="mb-2 text-sm font-medium">Choose your plan</legend>
  <tolle-radio-group [(ngModel)]="selectedPlan">
    <tolle-radio-item value="free">Free Plan</tolle-radio-item>
    <tolle-radio-item value="pro">Pro Plan</tolle-radio-item>
    <tolle-radio-item value="enterprise" [disabled]="true"
      >Enterprise Plan (Coming Soon)</tolle-radio-item
    >
  </tolle-radio-group>
</fieldset>
```
