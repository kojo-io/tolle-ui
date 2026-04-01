# Progress Component Usage Guide

## Overview

The Progress component displays a progress bar to indicate the completion status of a task or process.

## Import

```typescript
import { ProgressComponent } from '@tolle_/tolle-ui';
```

## ProgressComponent

**Inputs:**

| Input   | Type           | Default | Description            |
| ------- | -------------- | ------- | ---------------------- |
| `value` | `number\|null` | `0`     | Progress value (0-100) |
| `class` | `string`       | `''`    | Additional CSS classes |

## Basic Usage

### Basic Progress

```html
<tolle-progress [value]="60" class="w-[60%]"></tolle-progress>
```

### Progress with Value Display

```html
<div class="flex items-center gap-4">
  <tolle-progress [value]="progress" class="flex-1"></tolle-progress>
  <span class="text-sm text-muted-foreground">{{ progress }}%</span>
</div>
```

### Progress Sizes

```html
<tolle-progress [value]="25" class="h-1"></tolle-progress>
<tolle-progress [value]="50" class="h-2"></tolle-progress>
<tolle-progress [value]="75" class="h-4"></tolle-progress>
```

### Indeterminate Progress

When `value` is `null` or undefined, the progress bar shows an indeterminate animation:

```html
<tolle-progress [value]="null" class="w-full"></tolle-progress>
```

### Dynamic Progress

```typescript
import { Component } from '@angular/core';
import { ProgressComponent, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ProgressComponent, ButtonComponent],
  template: `
    <tolle-progress [value]="progress" class="mb-4 w-full"></tolle-progress>
    <div class="flex gap-2">
      <tolle-button size="sm" (click)="decrement()">-</tolle-button>
      <tolle-button size="sm" (click)="increment()">+</tolle-button>
    </div>
  `,
})
export class ExampleComponent {
  progress = 0;

  increment() {
    this.progress = Math.min(100, this.progress + 10);
  }

  decrement() {
    this.progress = Math.max(0, this.progress - 10);
  }
}
```

### File Upload Progress

```html
<div class="space-y-2">
  <div class="flex justify-between text-sm">
    <span>Uploading document.pdf</span>
    <span>{{ uploadProgress }}%</span>
  </div>
  <tolle-progress [value]="uploadProgress" class="h-2"></tolle-progress>
</div>
```
