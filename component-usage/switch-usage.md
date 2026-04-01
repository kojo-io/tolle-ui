# Switch Component Usage Guide

## Overview

The Switch component provides a toggle switch for binary (on/off) states. It implements ControlValueAccessor for Angular forms integration and supports various sizes.

## Import

```typescript
import { SwitchComponent } from '@tolle_/tolle-ui';
```

## SwitchComponent

**Inputs:**

| Input      | Type                          | Default     | Description            |
| ---------- | ----------------------------- | ----------- | ---------------------- |
| `class`    | `string`                      | `''`        | Additional CSS classes |
| `disabled` | `boolean`                     | `false`     | Disabled state         |
| `size`     | `'xs'\|'sm'\|'default'\|'lg'` | `'default'` | Switch size            |

**Outputs:**

The switch implements `ControlValueAccessor`, so value changes are handled through Angular forms:

| Approach        | Syntax                        |
| --------------- | ----------------------------- |
| Two-way binding | `[(ngModel)]="value"`         |
| Reactive forms  | `formControlName="fieldName"` |

When using `ngModel`, the `ngModelChange` event is emitted when the switch is toggled.

### Handling Value Changes

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SwitchComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SwitchComponent, FormsModule],
  template: `
    <tolle-switch
      id="notifications"
      [(ngModel)]="notifications"
      (ngModelChange)="onNotificationsChange($event)">
    </tolle-switch>
    <label for="notifications">Enable notifications</label>
  `,
})
export class ExampleComponent {
  notifications = false;

  onNotificationsChange(value: boolean) {
    console.log('Notifications:', value);
  }
}
```

## Basic Usage

### Basic Switch Example

```html
<div class="flex items-center space-x-2">
  <tolle-switch id="airplane-mode" [(ngModel)]="airplaneMode"></tolle-switch>
  <label
    for="airplane-mode"
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    Airplane Mode
  </label>
</div>
```

## Accessibility

The Switch component follows WAI-ARIA switch patterns:

- **Role**: Uses `role="switch"` with `aria-checked` state.
- **Labels**: Always provide a visible label. Use `id` on the switch and `for` on the label to associate them.
- **Keyboard Navigation**:
  - Space/Enter: Toggle the switch state
  - Tab/Shift+Tab: Move focus between form elements
- **State Announcement**: Screen readers announce the checked state via `aria-checked="true"` or `aria-checked="false"`.
- **Disabled State**: Disabled switches have `aria-disabled="true"` and are not focusable.
- **Status Changes**: The `aria-checked` attribute updates automatically when toggled.

```html
<tolle-switch id="notifications" [(ngModel)]="notifications"></tolle-switch>
<label for="notifications" class="ml-2">Enable notifications</label>
```

### Switch Sizes

```html
<div class="flex items-center gap-4">
  <tolle-switch size="xs"></tolle-switch>
  <tolle-switch size="sm"></tolle-switch>
  <tolle-switch size="default"></tolle-switch>
  <tolle-switch size="lg"></tolle-switch>
</div>
```
