# Textarea Component Usage Guide

## Overview

The Textarea component provides a styled multi-line text input with auto-grow functionality and character count support. It implements ControlValueAccessor for Angular forms integration.

## Import

```typescript
import { TextareaComponent } from '@tolle_/tolle-ui';
```

## TextareaComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `string` | Auto-generated | Textarea ID |
| `label` | `string` | `''` | Label text |
| `placeholder` | `string` | `''` | Placeholder text |
| `hint` | `string` | `''` | Hint text |
| `errorMessage` | `string` | `''` | Error message |
| `rows` | `number` | `3` | Number of rows |
| `maxLength` | `number` | - | Maximum character length |
| `showCharacterCount` | `boolean` | `false` | Show character count |
| `autoGrow` | `boolean` | `false` | Auto-grow height |
| `error` | `boolean` | `false` | Error state |
| `className` | `string` | `''` | Custom class |
| `hideHintOnFocus` | `boolean` | `true` | Hide hint on focus |
| `hideCharacterCountOnFocus` | `boolean` | `true` | Hide character count on focus |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Readonly state |
| `ngModel` | `any` | `null` | Two-way binding value |
| `formControlName` | `string` | - | Form control name |

## Basic Usage

### Basic Textarea Example

```html
<div class="w-full max-w-sm space-y-4">
      <tolle-textarea
        label="Bio"
        placeholder="Tell us a little bit about yourself."
        hint="You can @mention other users and organizations."
        [rows]="3"
      ></tolle-textarea>
    </div>
```

