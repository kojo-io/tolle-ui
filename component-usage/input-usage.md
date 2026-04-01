# Input Component Usage Guide

## Overview

The Input component provides a styled text input field with label, hint, and error states. It implements ControlValueAccessor for Angular forms integration.

## Import

```typescript
import { InputComponent } from '@tolle_/tolle-ui';
```

## InputComponent

**Inputs:**

| Input             | Type                          | Default        | Description                              |
| ----------------- | ----------------------------- | -------------- | ---------------------------------------- |
| `id`              | `string`                      | Auto-generated | Input ID                                 |
| `label`           | `string`                      | `''`           | Input label                              |
| `hint`            | `string`                      | `''`           | Hint text below input                    |
| `errorMessage`    | `string`                      | `''`           | Error message text                       |
| `type`            | `string`                      | `'text'`       | Input type (text, email, password, etc.) |
| `placeholder`     | `string`                      | `''`           | Placeholder text                         |
| `size`            | `'xs'\|'sm'\|'default'\|'lg'` | `'default'`    | Input size                               |
| `containerClass`  | `string`                      | `''`           | Container CSS classes                    |
| `class`           | `string`                      | `''`           | Additional CSS classes                   |
| `disabled`        | `boolean`                     | `false`        | Disabled state                           |
| `readonly`        | `boolean`                     | `false`        | Read-only state                          |
| `error`           | `boolean`                     | `false`        | Error state                              |
| `hideHintOnFocus` | `boolean`                     | `true`         | Hide hint when focused                   |
| `ngModel`         | `any`                         | `null`         | Two-way binding value                    |
| `formControlName` | `string`                      | -              | Form control name                        |

## Basic Usage

### Basic Input Example

```html
<div class="w-full max-w-sm space-y-4">
  <tolle-input
    label="Email"
    type="email"
    placeholder="name@example.com"
    hint="We'll never share your email.">
    <i prefix class="ri-mail-line"></i>
  </tolle-input>
</div>
```

## Accessibility

The Input component follows WAI-ARIA best practices:

- **Labels**: Always provide a `label` for screen readers. The `id` input associates the label with the input element.
- **Error States**: Use `errorMessage` to provide descriptive error text. The component automatically sets `aria-invalid` and `aria-describedby` attributes.
- **Hints**: Provide helpful hint text via the `hint` input. The component associates hints with `aria-describedby`.
- **Keyboard Navigation**:
  - Tab/Shift+Tab: Move focus between inputs
  - All standard text editing keys work (arrows, Home, End, etc.)
- **Disabled State**: Inputs with `disabled="true"` are removed from the tab order and not focusable.
- **Required Fields**: Combine with `<tolle-label>` for required field indication.

```html
<tolle-input
  label="Password"
  type="password"
  placeholder="Enter password"
  [error]="passwordInvalid"
  errorMessage="Password must be at least 8 characters"
  hint="Include uppercase, lowercase, and numbers" />
```
