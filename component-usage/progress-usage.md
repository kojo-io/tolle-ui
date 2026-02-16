# Progress Component Usage Guide

## Overview

The Progress component displays a progress bar to indicate the completion status of a task or process.

## Import

```typescript
import { ProgressComponent } from '@tolle_/tolle-ui';
```

## ProgressComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | `number\|null` | `0` | Progress value (0-100) |
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Simple Progress Bar

```html
<progress-component [value]="50" class="h-2"></progress-component>
```

### Progress with Value Binding

```html
<progress-component [value]="progress" class="h-2"></progress-component>
<p>Progress: {{ progress }}%</p>
```

```typescript
progress = 75;
```

### Indeterminate Progress

```html
<progress-component [value]="null" class="h-2"></progress-component>
```

## Progress Bar Sizes

### Small Height (2px)

```html
<progress-component [value]="60" class="h-1"></progress-component>
```

### Medium Height (4px)

```html
<progress-component [value]="60" class="h-2"></progress-component>
```

### Large Height (8px)

```html
<progress-component [value]="60" class="h-4"></progress-component>
```

## Progress with Text Label

### Value Display Below

```html
<div class="space-y-2">
  <progress-component [value]="75" class="h-2"></progress-component>
  <div class="flex justify-between text-xs text-muted-foreground">
    <span>Progress</span>
    <span>75%</span>
  </div>
</div>
```

### Value Display Above

```html
<div class="space-y-2">
  <div class="flex justify-between text-xs font-medium">
    <span>Upload Status</span>
    <span>{{ progress }}%</span>
  </div>
  <progress-component [value]="progress" class="h-2"></progress-component>
</div>
```

## Progress with Custom Styling

### Different Colors

```html
<!-- Success (Green) -->
<progress-component [value]="100" class="h-2">
  <div class="bg-emerald-500 h-full rounded-full transition-all"></div>
</progress-component>

<!-- Warning (Yellow/Orange) -->
<progress-component [value]="75" class="h-2">
  <div class="bg-amber-500 h-full rounded-full transition-all"></div>
</progress-component>

<!-- Destructive (Red) -->
<progress-component [value]="30" class="h-2">
  <div class="bg-destructive h-full rounded-full transition-all"></div>
</progress-component>
```

### Custom Colors

```html
<progress-component [value]="progress" class="h-2">
  <div
    class="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
    [style.width.%]="progress"
  ></div>
</progress-component>
```

## Progress in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>File Upload</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span>Uploading file...</span>
        <span>{{ uploadProgress }}%</span>
      </div>
      <progress-component [value]="uploadProgress" class="h-2"></progress-component>
    </div>

    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span>Processing</span>
        <span>{{ processingProgress }}%</span>
      </div>
      <progress-component [value]="processingProgress" class="h-2"></progress-component>
    </div>
  </tolle-card-content>
</tolle-card>
```

## Progress in Modal

```html
<tolle-alert-dialog-content>
  <tolle-alert-dialog-header>
    <tolle-alert-dialog-title>Exporting Data</tolle-alert-dialog-title>
  </tolle-alert-dialog-header>

  <tolle-alert-dialog-content class="space-y-4">
    <p>Preparing your export...</p>
    <progress-component [value]="exportProgress" class="h-2"></progress-component>
    <p class="text-xs text-muted-foreground text-center">
      {{ exportProgress === 100 ? 'Export complete!' : 'Please wait...' }}
    </p>
  </tolle-alert-dialog-content>
</tolle-alert-dialog-content>
```

## Progress with Animation

### Animated Progress

```html
<progress-component [value]="progress" class="h-2">
  <div
    class="bg-primary h-full rounded-full transition-all duration-500 ease-out"
    [style.width.%]="progress"
  ></div>
</progress-component>
```

### Indeterminate Animation

```html
<progress-component [value]="null" class="h-2">
  <div class="bg-primary h-full rounded-full animate-progress-indeterminate"></div>
</progress-component>
```

## Progress in Progress Circle (Custom Implementation)

```html
<div class="relative flex items-center justify-center">
  <svg class="w-24 h-24 transform -rotate-90">
    <circle
      class="text-muted-foreground"
      stroke="currentColor"
      stroke-width="4"
      fill="transparent"
      r="40"
      cx="48"
      cy="48"
    />
    <circle
      class="text-primary transition-all duration-500 ease-out"
      stroke="currentColor"
      stroke-width="4"
      fill="transparent"
      r="40"
      cx="48"
      cy="48"
      stroke-dasharray="251.2"
      [style.stroke-dashoffset]="251.2 - (251.2 * progress) / 100"
    />
  </svg>
  <div class="absolute text-center">
    <span class="text-2xl font-bold">{{ progress }}%</span>
  </div>
</div>
```

## Progress in Form Submission

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <tolle-input formControlName="email" label="Email" type="email" />

  <button
    tolleButton
    class="w-full"
    [disabled]="form.invalid || isSubmitting"
  >
    <i class="ri-loader-4-line ri-spin mr-2" *ngIf="isSubmitting"></i>
    {{ isSubmitting ? 'Submitting...' : 'Submit' }}
  </button>

  <div class="mt-4" *ngIf="isSubmitting">
    <progress-component [value]="submitProgress" class="h-2"></progress-component>
  </div>
</form>
```

## Multiple Progress Bars

```html
<div class="space-y-4">
  <div class="space-y-2">
    <div class="flex justify-between text-xs">
      <span>HTML</span>
      <span>90%</span>
    </div>
    <progress-component [value]="90" class="h-1"></progress-component>
  </div>
  <div class="space-y-2">
    <div class="flex justify-between text-xs">
      <span>CSS</span>
      <span>75%</span>
    </div>
    <progress-component [value]="75" class="h-1"></progress-component>
  </div>
  <div class="space-y-2">
    <div class="flex justify-between text-xs">
      <span>JavaScript</span>
      <span>60%</span>
    </div>
    <progress-component [value]="60" class="h-1"></progress-component>
  </div>
</div>
```

## Progress with Value Changes

```html
<div class="space-y-4">
  <div class="flex items-center gap-2">
    <button
      tolleButton
      size="sm"
      (click)="incrementProgress()"
      [disabled]="progress >= 100"
    >
      +
    </button>
    <progress-component [value]="progress" class="h-2 flex-1"></progress-component>
    <button
      tolleButton
      size="sm"
      variant="outline"
      (click)="resetProgress()"
    >
      Reset
    </button>
  </div>
  <p class="text-center text-sm">Progress: {{ progress }}%</p>
</div>
```
