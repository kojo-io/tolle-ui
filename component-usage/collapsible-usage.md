# Collapsible Component Usage Guide

## Overview

The Collapsible component allows users to expand or collapse content sections. It provides smooth animations and supports triggers with state management.

## Import

```typescript
import {
  CollapsibleComponent,
  CollapsibleTriggerComponent,
  CollapsibleContentComponent
} from '@tolle_/tolle-ui';
```

## Components

### CollapsibleComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `open` | `boolean` | - | Open state (controlled) |
| `openChange` | `EventEmitter<boolean>` | - | Emitted when open state changes |
| `class` | `string` | `''` | Additional CSS classes |

### CollapsibleTriggerComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### CollapsibleContentComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Simple Collapsible

```html
<tolle-collapsible>
  <div tolle-collapsible-trigger class="flex items-center justify-between p-4 hover:bg-accent rounded cursor-pointer">
    <span class="font-medium">Section Title</span>
    <i class="ri-arrow-down-s-line transition-transform duration-300"></i>
  </div>
  <div tolle-collapsible-content>
    <div class="p-4 pt-0 text-muted-foreground">
      <p>Collapsible content goes here.</p>
    </div>
  </div>
</tolle-collapsible>
```

### Controlled Collapsible

```html
<tolle-collapsible [open]="isOpen" (openChange)="isOpen = $event">
  <div tolle-collapsible-trigger class="p-4 hover:bg-accent rounded cursor-pointer">
    <span class="font-medium">Toggle Section</span>
  </div>
  <div tolle-collapsible-content>
    <div class="p-4 pt-0">
      <p>Content is {{ isOpen ? 'visible' : 'hidden' }}</p>
    </div>
  </div>
</tolle-collapsible>
```

## Collapsible with Icon Animation

### Rotating Icon

```html
<tolle-collapsible>
  <div tolle-collapsible-trigger class="flex items-center justify-between p-4 hover:bg-accent rounded cursor-pointer">
    <div class="flex items-center gap-2">
      <i class="ri-settings-line text-muted-foreground"></i>
      <span class="font-medium">Settings</span>
    </div>
    <i
      class="ri-arrow-down-s-line transition-transform duration-300"
      [class.rotate-180]="isOpen"
    ></i>
  </div>
  <div tolle-collapsible-content>
    <div class="p-4 pt-0 space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">Theme</label>
        <div class="flex gap-2">
          <button tolleButton size="sm">Light</button>
          <button tolleButton size="sm">Dark</button>
        </div>
      </div>
    </div>
  </div>
</tolle-collapsible>
```

## Accordion Style (Multiple Sections)

```html
<div class="space-y-2">
  <tolle-collapsible>
    <div tolle-collapsible-trigger class="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer">
      <span class="font-medium">Payment Methods</span>
      <i class="ri-arrow-down-s-line text-muted-foreground transition-transform duration-300"></i>
    </div>
    <div tolle-collapsible-content>
      <div class="p-4 pt-0 border-t">
        <p class="text-sm">Add your payment methods here.</p>
      </div>
    </div>
  </tolle-collapsible>

  <tolle-collapsible>
    <div tolle-collapsible-trigger class="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer">
      <span class="font-medium">Shipping Address</span>
      <i class="ri-arrow-down-s-line text-muted-foreground transition-transform duration-300"></i>
    </div>
    <div tolle-collapsible-content>
      <div class="p-4 pt-0 border-t">
        <p class="text-sm">Manage your shipping addresses.</p>
      </div>
    </div>
  </tolle-collapsible>

  <tolle-collapsible>
    <div tolle-collapsible-trigger class="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer">
      <span class="font-medium">Notifications</span>
      <i class="ri-arrow-down-s-line text-muted-foreground transition-transform duration-300"></i>
    </div>
    <div tolle-collapsible-content>
      <div class="p-4 pt-0 border-t">
        <p class="text-sm">Configure your notification preferences.</p>
      </div>
    </div>
  </tolle-collapsible>
</div>
```

## Collapsible in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Account Settings</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="space-y-0">
    <tolle-collapsible>
      <div tolle-collapsible-trigger class="flex items-center justify-between p-4 hover:bg-accent cursor-pointer">
        <span class="font-medium">Profile Information</span>
        <i class="ri-arrow-down-s-line transition-transform duration-300"></i>
      </div>
      <div tolle-collapsible-content>
        <div class="p-4 pt-0 space-y-4 border-t">
          <tolle-input label="Full Name" />
          <tolle-input label="Email" type="email" />
        </div>
      </div>
    </tolle-collapsible>

    <tolle-collapsible>
      <div tolle-collapsible-trigger class="flex items-center justify-between p-4 hover:bg-accent cursor-pointer">
        <span class="font-medium">Password</span>
        <i class="ri-arrow-down-s-line transition-transform duration-300"></i>
      </div>
      <div tolle-collapsible-content>
        <div class="p-4 pt-0 space-y-4 border-t">
          <tolle-input label="Current Password" type="password" />
          <tolle-input label="New Password" type="password" />
        </div>
      </div>
    </tolle-collapsible>
  </tolle-card-content>
</tolle-card>
```

## Collapsible with Form

```html
<tolle-collapsible>
  <div tolle-collapsible-trigger class="flex items-center justify-between p-4 border-b hover:bg-accent cursor-pointer">
    <div class="flex items-center gap-2">
      <i class="ri-add-circle-line text-muted-foreground"></i>
      <span class="font-medium">Add New Item</span>
    </div>
    <i class="ri-arrow-down-s-line transition-transform duration-300"></i>
  </div>
  <div tolle-collapsible-content>
    <form class="p-4 pt-0 space-y-4">
      <tolle-input label="Name" />
      <tolle-input label="Description" />
      <button tolleButton class="w-full">Add Item</button>
    </form>
  </div>
</tolle-collapsible>
```

## Collapsible in Modal

```html
<tolle-alert-dialog-content>
  <tolle-alert-dialog-header>
    <tolle-alert-dialog-title>Configuration</tolle-alert-dialog-title>
  </tolle-alert-dialog-header>

  <tolle-alert-dialog-content class="space-y-4">
    <tolle-collapsible>
      <div tolle-collapsible-trigger class="flex items-center justify-between p-3 hover:bg-accent rounded cursor-pointer">
        <span class="text-sm font-medium">Advanced Options</span>
        <i class="ri-arrow-down-s-line text-xs transition-transform duration-300"></i>
      </div>
      <div tolle-collapsible-content>
        <div class="p-3 pt-0 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm">Enable caching</span>
            <input type="checkbox" tolleSwitch />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm">Debug mode</span>
            <input type="checkbox" tolleSwitch />
          </div>
        </div>
      </div>
    </tolle-collapsible>
  </tolle-alert-dialog-content>

  <tolle-alert-dialog-footer>
    <button variant="outline">Cancel</button>
    <button>Save</button>
  </tolle-alert-dialog-footer>
</tolle-alert-dialog-content>
```

## Collapsible with Custom Styling

```html
<tolle-collapsible>
  <div tolle-collapsible-trigger class="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer">
    <div class="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
      <i class="ri-information-line"></i>
    </div>
    <span class="font-medium">Information</span>
    <i class="ri-arrow-down-s-line text-muted-foreground transition-transform duration-300"></i>
  </div>
  <div tolle-collapsible-content>
    <div class="p-4 pt-0 bg-muted/50 rounded-b-lg">
      <p class="text-sm text-muted-foreground">
        This is additional information that can be expanded or collapsed.
      </p>
    </div>
  </div>
</tolle-collapsible>
```

## Collapsible with Loading State

```html
<tolle-collapsible>
  <div tolle-collapsible-trigger class="flex items-center justify-between p-4 hover:bg-accent rounded cursor-pointer">
    <span class="font-medium">Loaded Data</span>
    <i class="ri-arrow-down-s-line transition-transform duration-300"></i>
  </div>
  <div tolle-collapsible-content>
    <div class="p-4 pt-0" *ngIf="!isLoading; else loading">
      <p class="text-sm">Data loaded successfully!</p>
    </div>
    <ng-template #loading>
      <div class="p-4 pt-0">
        <i class="ri-loader-4-line ri-spin text-muted-foreground"></i>
        Loading data...
      </div>
    </ng-template>
  </div>
</tolle-collapsible>
```

## Collapsible with Default Open

### Initially Expanded

```html
<tolle-collapsible [open]="true">
  <div tolle-collapsible-trigger class="flex items-center justify-between p-4 hover:bg-accent rounded cursor-pointer">
    <span class="font-medium">Expanded by Default</span>
    <i class="ri-arrow-down-s-line text-muted-foreground transition-transform duration-300"></i>
  </div>
  <div tolle-collapsible-content>
    <div class="p-4 pt-0">
      <p>This section is open by default.</p>
    </div>
  </div>
</tolle-collapsible>
```
