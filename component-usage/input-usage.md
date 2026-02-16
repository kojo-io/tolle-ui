# Input Component Usage Guide

## Overview

The Input component provides a styled text input field with label, hint, and error states. It implements ControlValueAccessor for Angular forms integration.

## Import

```typescript
import { InputComponent } from '@tolle_/tolle-ui';
```

## InputComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `string` | Auto-generated | Input ID |
| `label` | `string` | `''` | Input label |
| `hint` | `string` | `''` | Hint text below input |
| `errorMessage` | `string` | `''` | Error message text |
| `type` | `string` | `'text'` | Input type (text, email, password, etc.) |
| `placeholder` | `string` | `''` | Placeholder text |
| `size` | `'xs'\|'sm'\|'default'\|'lg'` | `'default'` | Input size |
| `containerClass` | `string` | `''` | Container CSS classes |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |
| `error` | `boolean` | `false` | Error state |
| `hideHintOnFocus` | `boolean` | `true` | Hide hint when focused |
| `ngModel` | `any` | `null` | Two-way binding value |
| `formControlName` | `string` | - | Form control name |

## Basic Usage

### Simple Input

```html
<tolle-input
  id="name"
  label="Name"
  placeholder="Enter your name"
  [(ngModel)]="name"
/>
```

### Disabled Input

```html
<tolle-input
  id="email"
  label="Email"
  value="user@example.com"
  [disabled]="true"
/>
```

### Read-only Input

```html
<tolle-input
  id="username"
  label="Username"
  value="johndoe"
  [readonly]="true"
/>
```

## Input Types

### Text Input

```html
<tolle-input
  id="text"
  label="Text"
  type="text"
  placeholder="Enter text"
/>
```

### Email Input

```html
<tolle-input
  id="email"
  label="Email"
  type="email"
  placeholder="Enter email"
/>
```

### Password Input

```html
<tolle-input
  id="password"
  label="Password"
  type="password"
  placeholder="Enter password"
/>
```

### Number Input

```html
<tolle-input
  id="number"
  label="Number"
  type="number"
  placeholder="0"
/>
```

### Date Input

```html
<tolle-input
  id="date"
  label="Date"
  type="date"
/>
```

## Input Sizes

### Extra Small (xs)

```html
<tolle-input
  id="small"
  label="Small"
  size="xs"
  placeholder="Extra small"
/>
```

### Small (sm)

```html
<tolle-input
  id="small"
  label="Small"
  size="sm"
  placeholder="Small"
/>
```

### Default

```html
<tolle-input
  id="default"
  label="Default"
  size="default"
  placeholder="Default size"
/>
```

### Large (lg)

```html
<tolle-input
  id="large"
  label="Large"
  size="lg"
  placeholder="Large"
/>
```

## Input with Error State

### Error State (Programmatic)

```html
<tolle-input
  id="error"
  label="Email"
  [error]="true"
  errorMessage="Please enter a valid email address"
/>
```

### Error State (Form Validation)

```html
<form [formGroup]="form">
  <tolle-input
    id="email"
    label="Email"
    type="email"
    formControlName="email"
  />
</form>
```

### Conditional Error

```html
<tolle-input
  id="name"
  label="Name"
  [error]="form.get('name')?.invalid && form.get('name')?.touched"
  errorMessage="Name is required"
/>
```

## Input with Hint

### Hint Text

```html
<tolle-input
  id="password"
  label="Password"
  type="password"
  hint="Must be at least 8 characters"
/>
```

### Hide Hint on Focus

```html
<tolle-input
  id="description"
  label="Description"
  hint="Optional description"
  [hideHintOnFocus]="true"
/>
```

## Input with Prefix/Suffix

### Prefix

```html
<tolle-input
  id="username"
  label="Username"
  placeholder="johndoe"
>
  <span prefix class="text-muted-foreground">@</span>
</tolle-input>
```

### Suffix

```html
<tolle-input
  id="email"
  label="Email"
  placeholder="user"
>
  <span suffix class="text-muted-foreground">@example.com</span>
</tolle-input>
```

### Icon Prefix

```html
<tolle-input
  id="search"
  label="Search"
  placeholder="Search..."
>
  <i prefix class="ri-search-line text-muted-foreground"></i>
</tolle-input>
```

## Input in Form

### Reactive Form

```typescript
this.form = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', Validators.pattern(/^\d{10}$/)]
});
```

```html
<form [formGroup]="form">
  <tolle-input id="name" label="Name" formControlName="name" />
  <tolle-input id="email" label="Email" type="email" formControlName="email" />
  <tolle-input id="phone" label="Phone" type="tel" formControlName="phone" />
</form>
```

### Template-driven Form

```html
<form>
  <tolle-input
    id="name"
    label="Name"
    [(ngModel)]="name"
    name="name"
    required
  />
</form>
```

## Input with Clear Button

```html
<tolle-input
  id="search"
  label="Search"
  [(ngModel)]="searchValue"
  placeholder="Type to search..."
>
  <button
    *ngIf="searchValue"
    suffix
    type="button"
    (click)="searchValue = ''"
    class="text-muted-foreground hover:text-foreground"
  >
    <i class="ri-close-line"></i>
  </button>
</tolle-input>
```

## Input with Character Count

```html
<tolle-input
  id="message"
  label="Message"
  [(ngModel)]="message"
  placeholder="Type your message..."
  [attr.maxlength]="140"
>
  <span suffix class="text-xs text-muted-foreground">
    {{ message.length }} / 140
  </span>
</tolle-input>
```
