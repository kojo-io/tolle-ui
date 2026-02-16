# Tabs Component Usage Guide

## Overview

The Tabs component provides a tabbed interface for organizing content into separate sections. Users can switch between different views without navigating away from the page.

## Import

```typescript
import {
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent
} from '@tolle_/tolle-ui';
```

## Components

### TabsComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `defaultValue` | `string` | - | Default active tab value |
| `value` | `string` | - | Active tab value (controlled) |
| `valueChange` | `EventEmitter<string>` | - | Emitted when active tab changes |
| `class` | `string` | `''` | Additional CSS classes |

### TabsListComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `variant` | `'default'\|'underline'` | `'default'` | Tabs variant |

### TabsTriggerComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | `string` | - | Tab value (required) |
| `class` | `string` | `''` | Additional CSS classes |

### TabsContentComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | `string` | - | Tab value (required) |
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Simple Tabs

```html
<tolle-tabs defaultValue="account">
  <tolle-tabs-list>
    <tolle-tabs-trigger value="account">Account</tolle-tabs-trigger>
    <tolle-tabs-trigger value="password">Password</tolle-tabs-trigger>
  </tolle-tabs-list>
  <tolle-tabs-content value="account">
    <p>Account settings content</p>
  </tolle-tabs-content>
  <tolle-tabs-content value="password">
    <p>Password settings content</p>
  </tolle-tabs-content>
</tolle-tabs>
```

### Controlled Tabs

```html
<tolle-tabs [value]="activeTab" (valueChange)="onTabChange($event)">
  <tolle-tabs-list>
    <tolle-tabs-trigger value="home">Home</tolle-tabs-trigger>
    <tolle-tabs-trigger value="profile">Profile</tolle-tabs-trigger>
    <tolle-tabs-trigger value="settings">Settings</tolle-tabs-trigger>
  </tolle-tabs-list>
  <tolle-tabs-content value="home">
    <p>Home content</p>
  </tolle-tabs-content>
  <tolle-tabs-content value="profile">
    <p>Profile content</p>
  </tolle-tabs-content>
  <tolle-tabs-content value="settings">
    <p>Settings content</p>
  </tolle-tabs-content>
</tolle-tabs>
```

## Tab Variants

### Default Variant

```html
<tolle-tabs-list variant="default">
  <tolle-tabs-trigger value="home">Home</tolle-tabs-trigger>
  <tolle-tabs-trigger value="profile">Profile</tolle-tabs-trigger>
  <tolle-tabs-trigger value="settings">Settings</tolle-tabs-trigger>
</tolle-tabs-list>
```

### Underline Variant

```html
<tolle-tabs-list variant="underline">
  <tolle-tabs-trigger value="home">Home</tolle-tabs-trigger>
  <tolle-tabs-trigger value="profile">Profile</tolle-tabs-trigger>
  <tolle-tabs-trigger value="settings">Settings</tolle-tabs-trigger>
</tolle-tabs-list>
```

## Tabs with Icons

### Icons in Triggers

```html
<tolle-tabs defaultValue="home">
  <tolle-tabs-list>
    <tolle-tabs-trigger value="home">
      <i class="ri-home-line mr-2"></i>
      Home
    </tolle-tabs-trigger>
    <tolle-tabs-trigger value="messages">
      <i class="ri-message-line mr-2"></i>
      Messages
      <tolle-badge variant="secondary" class="ml-2">3</tolle-badge>
    </tolle-tabs-trigger>
    <tolle-tabs-trigger value="profile">
      <i class="ri-user-line mr-2"></i>
      Profile
    </tolle-tabs-trigger>
  </tolle-tabs-list>
  <tolle-tabs-content value="home">
    <p>Home content</p>
  </tolle-tabs-content>
  <tolle-tabs-content value="messages">
    <p>Messages content</p>
  </tolle-tabs-content>
  <tolle-tabs-content value="profile">
    <p>Profile content</p>
  </tolle-tabs-content>
</tolle-tabs>
```

### Icon Only Tabs

```html
<tolle-tabs defaultValue="home">
  <tolle-tabs-list>
    <tolle-tabs-trigger value="home" class="flex justify-center">
      <i class="ri-home-line text-lg"></i>
    </tolle-tabs-trigger>
    <tolle-tabs-trigger value="search" class="flex justify-center">
      <i class="ri-search-line text-lg"></i>
    </tolle-tabs-trigger>
    <tolle-tabs-trigger value="profile" class="flex justify-center">
      <i class="ri-user-line text-lg"></i>
    </tolle-tabs-trigger>
  </tolle-tabs-list>
  <tolle-tabs-content value="home">
    <p>Home content</p>
  </tolle-tabs-content>
  <tolle-tabs-content value="search">
    <p>Search content</p>
  </tolle-tabs-content>
  <tolle-tabs-content value="profile">
    <p>Profile content</p>
  </tolle-tabs-content>
</tolle-tabs>
```

## Tabs in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Settings</tolle-card-title>
    <tolle-card-description>
      Manage your account settings
    </tolle-card-description>
  </tolle-card-header>
  <tolle-card-content class="p-0">
    <tolle-tabs defaultValue="profile">
      <tolle-tabs-list class="mx-4 mt-4">
        <tolle-tabs-trigger value="profile">Profile</tolle-tabs-trigger>
        <tolle-tabs-trigger value="password">Password</tolle-tabs-trigger>
        <tolle-tabs-trigger value="notifications">Notifications</tolle-tabs-trigger>
      </tolle-tabs-list>
      <tolle-tabs-content value="profile" class="p-4">
        <p>Profile settings content</p>
      </tolle-tabs-content>
      <tolle-tabs-content value="password" class="p-4">
        <p>Password settings content</p>
      </tolle-tabs-content>
      <tolle-tabs-content value="notifications" class="p-4">
        <p>Notification settings content</p>
      </tolle-tabs-content>
    </tolle-tabs>
  </tolle-card-content>
</tolle-card>
```

## Tabs with Form

```html
<tolle-tabs defaultValue="personal">
  <tolle-tabs-list>
    <tolle-tabs-trigger value="personal">Personal</tolle-tabs-trigger>
    <tolle-tabs-trigger value="address">Address</tolle-tabs-trigger>
    <tolle-tabs-trigger value="payment">Payment</tolle-tabs-trigger>
  </tolle-tabs-list>
  <tolle-tabs-content value="personal" class="space-y-4">
    <tolle-input label="First Name" />
    <tolle-input label="Last Name" />
  </tolle-tabs-content>
  <tolle-tabs-content value="address" class="space-y-4">
    <tolle-input label="Street Address" />
    <tolle-input label="City" />
    <tolle-input label="Zip Code" />
  </tolle-tabs-content>
  <tolle-tabs-content value="payment" class="space-y-4">
    <tolle-input label="Card Number" />
    <div class="grid grid-cols-2 gap-4">
      <tolle-input label="Expiry" />
      <tolle-input label="CVV" />
    </div>
  </tolle-tabs-content>
</tolle-tabs>
```

## Tabs in Modal

```html
<tolle-alert-dialog>
  <tolle-alert-dialog-trigger>
    <button>Configure</button>
  </tolle-alert-dialog-trigger>

  <tolle-alert-dialog-portal>
    <tolle-alert-dialog-content>
      <tolle-alert-dialog-header>
        <tolle-alert-dialog-title>Configuration</tolle-alert-dialog-title>
      </tolle-alert-dialog-header>

      <tolle-alert-dialog-content>
        <tolle-tabs defaultValue="general">
          <tolle-tabs-list>
            <tolle-tabs-trigger value="general">General</tolle-tabs-trigger>
            <tolle-tabs-trigger value="advanced">Advanced</tolle-tabs-trigger>
          </tolle-tabs-list>
          <tolle-tabs-content value="general" class="space-y-4">
            <tolle-input label="Name" />
          </tolle-tabs-content>
          <tolle-tabs-content value="advanced" class="space-y-4">
            <tolle-input label="API Key" />
          </tolle-tabs-content>
        </tolle-tabs>
      </tolle-alert-dialog-content>

      <tolle-alert-dialog-footer>
        <button variant="outline">Cancel</button>
        <button>Save</button>
      </tolle-alert-dialog-footer>
    </tolle-alert-dialog-content>
  </tolle-alert-dialog-portal>
</tolle-alert-dialog>
```

## Tabs with Custom Styling

### Underline Variant with Custom Colors

```html
<tolle-tabs-list variant="underline" class="border-b">
  <tolle-tabs-trigger value="home" class="hover:text-primary">
    Home
  </tolle-tabs-trigger>
  <tolle-tabs-trigger value="about" class="hover:text-primary">
    About
  </tolle-tabs-trigger>
  <tolle-tabs-trigger value="contact" class="hover:text-primary">
    Contact
  </tolle-tabs-trigger>
</tolle-tabs-list>
```

### Pill Style Tabs

```html
<tolle-tabs-list class="bg-muted p-1 rounded-lg">
  <tolle-tabs-trigger value="home" class="bg-background shadow-sm">
    Home
  </tolle-tabs-trigger>
  <tolle-tabs-trigger value="profile" class="bg-background shadow-sm">
    Profile
  </tolle-tabs-trigger>
  <tolle-tabs-trigger value="settings" class="bg-background shadow-sm">
    Settings
  </tolle-tabs-trigger>
</tolle-tabs-list>
```

## Tabs with ngModel

### Template-driven Form

```html
<tolle-tabs [(ngModel)]="activeTab" name="tabs">
  <tolle-tabs-list>
    <tolle-tabs-trigger value="tab1">Tab 1</tolle-tabs-trigger>
    <tolle-tabs-trigger value="tab2">Tab 2</tolle-tabs-trigger>
  </tolle-tabs-list>
  <tolle-tabs-content value="tab1">
    <p>Content 1</p>
  </tolle-tabs-content>
  <tolle-tabs-content value="tab2">
    <p>Content 2</p>
  </tolle-tabs-content>
</tolle-tabs>
```

## Tabs with Disabled States

```html
<tolle-tabs defaultValue="home">
  <tolle-tabs-list>
    <tolle-tabs-trigger value="home">Home</tolle-tabs-trigger>
    <tolle-tabs-trigger value="profile" [disabled]="true">Profile (Locked)</tolle-tabs-trigger>
    <tolle-tabs-trigger value="settings">Settings</tolle-tabs-trigger>
  </tolle-tabs-list>
  <tolle-tabs-content value="home">
    <p>Home content</p>
  </tolle-tabs-content>
  <tolle-tabs-content value="profile">
    <p>Profile content</p>
  </tolle-tabs-content>
  <tolle-tabs-content value="settings">
    <p>Settings content</p>
  </tolle-tabs-content>
</tolle-tabs>
```
