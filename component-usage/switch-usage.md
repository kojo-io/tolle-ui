# Switch Component Usage Guide

## Overview

The Switch component provides a toggle switch for binary (on/off) states. It implements ControlValueAccessor for Angular forms integration and supports various sizes.

## Import

```typescript
import { SwitchComponent } from '@tolle_/tolle-ui';
```

## SwitchComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `size` | `'xs'\|'sm'\|'default'\|'lg'` | `'default'` | Switch size |
| `checked` | `boolean` | `false` | Checked state |
| `ngModel` | `any` | `null` | Two-way binding value |
| `formControlName` | `string` | - | Form control name |

## Basic Usage

### Simple Switch

```html
<label class="flex items-center gap-2">
  <input type="checkbox" tolleSwitch />
  <span>Enable feature</span>
</label>
```

### Disabled Switch

```html
<label class="flex items-center gap-2">
  <input type="checkbox" tolleSwitch [disabled]="true" />
  <span class="text-muted-foreground">Cannot be changed</span>
</label>
```

### Switch with ngModel

```html
<input type="checkbox" tolleSwitch [(ngModel)]="isenabled" />
<span>Enabled: {{ isenabled }}</span>
```

### Switch in Form

```html
<form [formGroup]="form">
  <input type="checkbox" tolleSwitch formControlName="notifications" />
  <span>Enable notifications</span>
</form>
```

## Switch Sizes

### Extra Small (xs)

```html
<input type="checkbox" tolleSwitch size="xs" [(ngModel)]="value" />
<span class="text-xs">Extra Small</span>
```

### Small (sm)

```html
<input type="checkbox" tolleSwitch size="sm" [(ngModel)]="value" />
<span class="text-sm">Small</span>
```

### Default

```html
<input type="checkbox" tolleSwitch [(ngModel)]="value" />
<span class="text-base">Default</span>
```

### Large (lg)

```html
<input type="checkbox" tolleSwitch size="lg" [(ngModel)]="value" />
<span class="text-lg">Large</span>
```

## Switch States

### Checked

```html
<input type="checkbox" tolleSwitch [checked]="true" [(ngModel)]="value" />
<span>On</span>
```

### Unchecked

```html
<input type="checkbox" tolleSwitch [checked]="false" [(ngModel)]="value" />
<span>Off</span>
```

## Switch with Label

### Label on Right (Default)

```html
<div class="flex items-center gap-3">
  <input type="checkbox" tolleSwitch id="toggle" [(ngModel)]="value" />
  <label for="toggle" class="font-medium">Toggle me</label>
</div>
```

### Label on Left

```html
<div class="flex items-center gap-3">
  <label class="font-medium">Enable dark mode</label>
  <input type="checkbox" tolleSwitch id="dark-mode" [(ngModel)]="darkMode" />
</div>
```

### Label Above

```html
<div class="space-y-2">
  <label class="block font-medium">Dark Mode</label>
  <input type="checkbox" tolleSwitch id="dark-mode" [(ngModel)]="darkMode" />
</div>
```

## Switch with Helper Text

```html
<div class="space-y-2">
  <div class="flex items-center gap-2">
    <input type="checkbox" tolleSwitch id="email-notif" [(ngModel)]="emailNotif" />
    <label for="email-notif" class="font-medium">Email notifications</label>
  </div>
  <p class="text-xs text-muted-foreground ml-6">
    Receive daily summaries of your activity
  </p>
</div>
```

## Switch with Error State

```html
<div class="space-y-2">
  <div class="flex items-center gap-2">
    <input type="checkbox" tolleSwitch id="terms" [(ngModel)]="acceptedTerms" />
    <label for="terms" class="font-medium">I accept the terms</label>
  </div>
  <p class="text-xs text-destructive" *ngIf="form.submitted && !acceptedTerms">
    You must accept the terms to continue
  </p>
</div>
```

## Switch in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Settings</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <div class="font-medium">Email notifications</div>
        <div class="text-xs text-muted-foreground">Receive emails about your account</div>
      </div>
      <input type="checkbox" tolleSwitch [(ngModel)]="emailNotif" />
    </div>
    <div class="flex items-center justify-between">
      <div>
        <div class="font-medium">Push notifications</div>
        <div class="text-xs text-muted-foreground">Receive push alerts on your device</div>
      </div>
      <input type="checkbox" tolleSwitch [(ngModel)]="pushNotif" />
    </div>
  </tolle-card-content>
</tolle-card>
```

## Switch in Table

```html
<table class="w-full">
  <thead>
    <tr>
      <th>Feature</th>
      <th>Enabled</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let feature of features">
      <td>{{ feature.name }}</td>
      <td>
        <input type="checkbox" tolleSwitch [(ngModel)]="feature.enabled" />
      </td>
    </tr>
  </tbody>
</table>
```

## Switch with Custom Color

```html
<input
  type="checkbox"
  tolleSwitch
  class="peer h-5 w-9 rounded-full border border-primary bg-background checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  [checked]="value"
/>
```

## Switch with Icon

```html
<div class="flex items-center gap-3">
  <input type="checkbox" tolleSwitch id="airplane" [(ngModel)]="airplaneMode" />
  <label for="airplane" class="flex items-center gap-2 font-medium">
    <i class="ri-airplane-line"></i>
    <span>Airplane Mode</span>
  </label>
</div>
```

## Switch with Loading State

```html
<div class="flex items-center gap-3">
  <input
    type="checkbox"
    tolleSwitch
    id="save"
    [(ngModel)]="saveEnabled"
    [disabled]="isLoading"
  />
  <label for="save" class="font-medium">Auto-save</label>
  <i
    class="ri-loader-4-line ri-spin text-muted-foreground"
    *ngIf="isLoading"
  ></i>
</div>
```

## Multiple Switches (Switch Group)

```html
<div class="space-y-4">
  <div class="flex items-center justify-between">
    <span class="font-medium">Notifications</span>
    <input type="checkbox" tolleSwitch [(ngModel)]="notifications" />
  </div>
  <div class="flex items-center justify-between">
    <span class="font-medium">Marketing emails</span>
    <input type="checkbox" tolleSwitch [(ngModel)]="marketing" />
  </div>
  <div class="flex items-center justify-between">
    <span class="font-medium">Social updates</span>
    <input type="checkbox" tolleSwitch [(ngModel)]="social" />
  </div>
</div>
```
