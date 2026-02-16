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

### Simple Textarea

```html
<tolle-textarea
  id="message"
  label="Message"
  placeholder="Type your message..."
  [(ngModel)]="message"
/>
```

### Disabled Textarea

```html
<tolle-textarea
  id="notes"
  label="Notes"
  value="This is a read-only note"
  [disabled]="true"
/>
```

### Read-only Textarea

```html
<tolle-textarea
  id="reference"
  label="Reference"
  value="REF-12345"
  [readonly]="true"
/>
```

## Textarea with Rows

### Custom Rows

```html
<tolle-textarea
  id="description"
  label="Description"
  [rows]="5"
  placeholder="Enter description..."
/>
```

### Single Row (Auto-grow)

```html
<tolle-textarea
  id="title"
  label="Title"
  [rows]="1"
  placeholder="Enter title..."
/>
```

## Auto-grow Textarea

### With Auto-grow

```html
<tolle-textarea
  id="content"
  label="Content"
  [autoGrow]="true"
  placeholder="Start typing..."
/>
```

### With Max Height

```html
<tolle-textarea
  id="content"
  label="Content"
  [autoGrow]="true"
  [rows]="3"
  placeholder="Start typing..."
  style="max-height: 200px; overflow-y: auto;"
/>
```

## Character Count

### With Character Count

```html
<tolle-textarea
  id="bio"
  label="Bio"
  [maxLength]="160"
  [showCharacterCount]="true"
  [(ngModel)]="bio"
  placeholder="Tell us about yourself..."
/>
```

### Hide on Focus

```html
<tolle-textarea
  id="comment"
  label="Comment"
  [maxLength]="500"
  [showCharacterCount]="true"
  [hideCharacterCountOnFocus]="true"
  [(ngModel)]="comment"
/>
```

## Textarea with Error State

### Error State (Programmatic)

```html
<tolle-textarea
  id="description"
  label="Description"
  [error]="true"
  errorMessage="Description is required (min 10 characters)"
/>
```

### Error State (Form Validation)

```html
<form [formGroup]="form">
  <tolle-textarea
    id="description"
    label="Description"
    formControlName="description"
  />
</form>
```

### Conditional Error

```html
<tolle-textarea
  id="description"
  label="Description"
  [error]="form.get('description')?.invalid && form.get('description')?.touched"
  errorMessage="Description must be at least 10 characters"
/>
```

## Textarea with Hint

```html
<tolle-textarea
  id="instructions"
  label="Instructions"
  hint="Include step-by-step details"
  [(ngModel)]="instructions"
/>
```

### Hide Hint on Focus

```html
<tolle-textarea
  id="notes"
  label="Notes"
  hint="Optional notes for your team"
  [hideHintOnFocus]="true"
/>
```

## Textarea in Form

### Reactive Form

```typescript
this.form = this.fb.group({
  message: ['', [Validators.required, Validators.minLength(10)]],
  description: ['', Validators.maxLength(500)]
});
```

```html
<form [formGroup]="form">
  <tolle-textarea
    id="message"
    label="Message"
    formControlName="message"
  />
</form>
```

### Template-driven Form

```html
<form>
  <tolle-textarea
    id="message"
    label="Message"
    [(ngModel)]="message"
    name="message"
    required
    minlength="10"
  />
  <p class="text-xs text-destructive" *ngIf="form.submitted && !message?.trim()">
    Message is required
  </p>
</form>
```

## Textarea with Clear Button

```html
<tolle-textarea
  id="search"
  label="Search"
  [(ngModel)]="searchQuery"
  placeholder="Type to search..."
>
  <button
    *ngIf="searchQuery"
    suffix
    type="button"
    (click)="searchQuery = ''"
    class="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
  >
    <i class="ri-close-line"></i>
  </button>
</tolle-textarea>
```

## Textarea with Resize Handle

### Disable Resize

```html
<tolle-textarea
  id="content"
  label="Content"
  [style.resize]="'none'"
/>
```

### Vertical Only Resize

```html
<tolle-textarea
  id="content"
  label="Content"
  [style.resize]="'vertical'"
/>
```

## Textarea with Custom Styling

```html
<tolle-textarea
  id="code"
  label="Code"
  class="font-mono text-sm"
  [rows]="10"
  placeholder="Enter code..."
/>
```

## Textarea with Prefix/Suffix

### Prefix Text

```html
<tolle-textarea
  id="price"
  label="Price"
  placeholder="0.00"
>
  <span prefix class="text-muted-foreground">$</span>
</tolle-textarea>
```

### Suffix Text

```html
<tolle-textarea
  id="url"
  label="URL"
  placeholder="example"
>
  <span suffix class="text-muted-foreground">.com</span>
</tolle-textarea>
```
