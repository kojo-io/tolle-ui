# Label Component Usage Guide

## Overview

The Label component provides a styled form label that's associated with form inputs. It improves accessibility and provides consistent styling across forms.

## Import

```typescript
import { LabelComponent } from '@tolle_/tolle-ui';
```

## LabelComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `for` | `string` | - | ID of the associated form control |
| `required` | `boolean` | `false` | Mark as required |

## Basic Usage

### Simple Label

```html
<label tolleLabel>Username</label>
<input type="text" id="username" />
```

### Label with Input

```html
<div class="space-y-2">
  <label tolleLabel for="email">Email Address</label>
  <input
    type="email"
    id="email"
    placeholder="Enter your email"
  />
</div>
```

## Label with Required Indicator

```html
<label tolleLabel [required]="true">Email Address</label>
```

## Label Variants

### Default Label

```html
<label tolleLabel>Default Label</label>
```

### Small Label

```html
<label tolleLabel class="text-xs">Small Label</label>
```

### Large Label

```html
<label tolleLabel class="text-lg">Large Label</label>
```

###Bold Label

```html
<label tolleLabel class="font-bold">Bold Label</label>
```

## Label in Form Controls

### Checkbox Label

```html
<label tolleLabel class="flex items-center gap-2">
  <input type="checkbox" tolleCheckbox />
  <span>Agree to terms</span>
</label>
```

### Radio Label

```html
<label tolleLabel class="flex items-center gap-2">
  <input type="radio" tolleRadio value="option1" name="options" />
  <span>Option 1</span>
</label>
```

## Label with Helper Text

```html
<div class="space-y-1">
  <label tolleLabel for="password">Password</label>
  <p class="text-xs text-muted-foreground">
    Must be at least 8 characters
  </p>
  <input
    type="password"
    id="password"
    class="w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
</div>
```

## Label with Error

```html
<div class="space-y-1">
  <label tolleLabel for="email" [class.text-destructive]="error">Email</label>
  <input
    type="email"
    id="email"
    [class.border-destructive]="error"
    class="w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  />
  <p class="text-xs text-destructive" *ngIf="error">
    Please enter a valid email address
  </p>
</div>
```

## Label in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Settings</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <div class="space-y-1">
      <label tolleLabel for="name">Name</label>
      <input type="text" id="name" />
    </div>
    <div class="space-y-1">
      <label tolleLabel for="email">Email</label>
      <input type="email" id="email" />
    </div>
  </tolle-card-content>
</tolle-card>
```

## Label with Icon

```html
<label tolleLabel class="flex items-center gap-2">
  <i class="ri-user-line"></i>
  <span>Username</span>
</label>
```

## Label with Help Tooltip

```html
<div class="flex items-center gap-2">
  <label tolleLabel for="phone">Phone Number</label>
  <i
    class="ri-question-line text-muted-foreground cursor-help"
    tolleTooltip="Enter your phone number in international format"
    tolleTooltipPlacement="right"
  ></i>
</div>
```

## Label in Grid Layout

```html
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
  <div class="space-y-1">
    <label tolleLabel for="first-name">First Name</label>
    <input type="text" id="first-name" />
  </div>
  <div class="space-y-1">
    <label tolleLabel for="last-name">Last Name</label>
    <input type="text" id="last-name" />
  </div>
</div>
```

## Label in Tabs

```html
<tolle-tabs defaultValue="account">
  <tolle-tabs-list>
    <tolle-tabs-trigger value="account">Account</tolle-tabs-trigger>
  </tolle-tabs-list>
  <tolle-tabs-content value="account">
    <div class="space-y-1">
      <label tolleLabel for="bio">Bio</label>
      <textarea id="bio"></textarea>
    </div>
  </tolle-tabs-content>
</tolle-tabs>
```
