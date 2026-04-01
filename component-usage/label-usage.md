# Label Component Usage Guide

## Overview

The Label component provides a styled form label that's associated with form inputs. It improves accessibility and provides consistent styling across forms.

## Import

```typescript
import { LabelComponent } from '@tolle_/tolle-ui';
```

## LabelComponent

**Inputs:**

| Input      | Type      | Default | Description                       |
| ---------- | --------- | ------- | --------------------------------- |
| `class`    | `string`  | `''`    | Additional CSS classes            |
| `for`      | `string`  | -       | ID of the associated form control |
| `required` | `boolean` | `false` | Mark as required                  |

## Basic Usage

### Basic Label

```html
<div class="flex items-center space-x-2">
  <tolle-checkbox id="terms"></tolle-checkbox>
  <tolle-label for="terms">Accept terms and conditions</tolle-label>
</div>
```

### Form Fields with Labels

```html
<div class="space-y-4">
  <div>
    <tolle-label for="name" class="mb-2 block">Full Name</tolle-label>
    <tolle-input id="name" placeholder="John Doe" />
  </div>

  <div>
    <tolle-label for="email" class="mb-2 block">Email Address</tolle-label>
    <tolle-input id="email" type="email" placeholder="john@example.com" />
  </div>

  <div>
    <tolle-label for="bio" class="mb-2 block">Bio</tolle-label>
    <tolle-textarea id="bio" placeholder="Tell us about yourself..." />
  </div>
</div>
```

### Required Field

```html
<div>
  <tolle-label for="username" [required]="true" class="mb-2 block"> Username </tolle-label>
  <tolle-input id="username" placeholder="Enter your username" />
</div>
```

### Inline Labels

```html
<div class="flex items-center gap-4">
  <tolle-label for="status" class="text-sm font-medium">Status:</tolle-label>
  <tolle-select id="status" placeholder="Select status">
    <tolle-select-item value="active">Active</tolle-select-item>
    <tolle-select-item value="inactive">Inactive</tolle-select-item>
  </tolle-select>
</div>
```

### Labels with Hint Text

```html
<div>
  <div class="mb-2 flex items-center justify-between">
    <tolle-label for="password">Password</tolle-label>
    <span class="text-sm text-muted-foreground">Must be 8+ characters</span>
  </div>
  <tolle-input id="password" type="password" placeholder="••••••••" />
</div>
```

### Labels with Error States

```html
<div>
  <tolle-label for="email" class="mb-2 block">Email</tolle-label>
  <tolle-input
    id="email"
    type="email"
    [error]="emailInvalid"
    errorMessage="Please enter a valid email address" />
</div>
```

### Nested Label (Wrapping Input)

```html
<tolle-label class="cursor-pointer">
  <div class="flex items-center gap-2">
    <tolle-checkbox />
    <span>Remember me for 30 days</span>
  </div>
</tolle-label>
```
