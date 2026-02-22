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

## Basic Usage

### Simple Switch

```html
<tolle-switch [(ngModel)]="enabled" />
<span>Enabled: {{ enabled }}</span>
```

### Disabled Switch

```html
<tolle-switch [disabled]="true" [(ngModel)]="disabledValue" />
<span class="text-muted-foreground">Cannot be changed</span>
```

### Switch with ngModel

```html
<tolle-switch [(ngModel)]="isenabled" />
<span>Enabled: {{ isenabled }}</span>
```

### Switch in Reactive Form

```html
<form [formGroup]="form">
  <tolle-switch formControlName="notifications" />
  <span>Enable notifications</span>
</form>
```

```typescript
this.form = this.fb.group({
  notifications: [false]
});
```

## Switch Sizes

### Extra Small (xs)

```html
<tolle-switch size="xs" [(ngModel)]="value" />
<span class="text-xs">Extra Small</span>
```

### Small (sm)

```html
<tolle-switch size="sm" [(ngModel)]="value" />
<span class="text-sm">Small</span>
```

### Default

```html
<tolle-switch [(ngModel)]="value" />
<span class="text-base">Default</span>
```

### Large (lg)

```html
<tolle-switch size="lg" [(ngModel)]="value" />
<span class="text-lg">Large</span>
```

## Switch States

### Checked

```html
<tolle-switch [ngModel]="true" (ngModelChange)="value = $event" />
<span>On</span>
```

### Unchecked

```html
<tolle-switch [ngModel]="false" (ngModelChange)="value = $event" />
<span>Off</span>
```

## Switch with Label

### Label on Right (Default)

```html
<div class="flex items-center gap-3">
  <tolle-switch id="toggle" [(ngModel)]="value" />
  <label for="toggle" class="font-medium">Toggle me</label>
</div>
```

### Label on Left

```html
<div class="flex items-center gap-3">
  <label class="font-medium">Enable dark mode</label>
  <tolle-switch id="dark-mode" [(ngModel)]="darkMode" />
</div>
```

### Label Above

```html
<div class="space-y-2">
  <label class="block font-medium">Dark Mode</label>
  <tolle-switch id="dark-mode" [(ngModel)]="darkMode" />
</div>
```

## Switch with Helper Text

```html
<div class="space-y-2">
  <div class="flex items-center gap-2">
    <tolle-switch id="email-notif" [(ngModel)]="emailNotif" />
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
    <tolle-switch id="terms" [(ngModel)]="acceptedTerms" />
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
      <tolle-switch [(ngModel)]="emailNotif" />
    </div>
    <div class="flex items-center justify-between">
      <div>
        <div class="font-medium">Push notifications</div>
        <div class="text-xs text-muted-foreground">Receive push alerts on your device</div>
      </div>
      <tolle-switch [(ngModel)]="pushNotif" />
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
        <tolle-switch [(ngModel)]="feature.enabled" />
      </td>
    </tr>
  </tbody>
</table>
```

## Switch with Custom Color

```html
<tolle-switch
  class="bg-blue-500 data-[checked=true]:bg-blue-600"
  [(ngModel)]="value"
/>
```

## Switch with Icon

```html
<div class="flex items-center gap-3">
  <tolle-switch id="airplane" [(ngModel)]="airplaneMode" />
  <label for="airplane" class="flex items-center gap-2 font-medium">
    <i class="ri-airplane-line"></i>
    <span>Airplane Mode</span>
  </label>
</div>
```

## Switch with Loading State

```html
<div class="flex items-center gap-3">
  <tolle-switch
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
    <tolle-switch [(ngModel)]="notifications" />
  </div>
  <div class="flex items-center justify-between">
    <span class="font-medium">Marketing emails</span>
    <tolle-switch [(ngModel)]="marketing" />
  </div>
  <div class="flex items-center justify-between">
    <span class="font-medium">Social updates</span>
    <tolle-switch [(ngModel)]="social" />
  </div>
</div>
```
