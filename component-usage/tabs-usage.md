# Tabs Component Usage Guide

## Overview

The Tabs component provides a tabbed interface for organizing content into separate sections. Users can switch between different views without navigating away from the page.

## Import

```typescript
import {
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
} from '@tolle_/tolle-ui';
```

## Components

### TabsComponent

**Inputs:**

| Input          | Type                   | Default | Description                     |
| -------------- | ---------------------- | ------- | ------------------------------- |
| `defaultValue` | `string`               | -       | Default active tab value        |
| `value`        | `string`               | -       | Active tab value (controlled)   |
| `valueChange`  | `EventEmitter<string>` | -       | Emitted when active tab changes |
| `class`        | `string`               | `''`    | Additional CSS classes          |

### TabsListComponent

**Inputs:**

| Input     | Type                     | Default     | Description            |
| --------- | ------------------------ | ----------- | ---------------------- |
| `class`   | `string`                 | `''`        | Additional CSS classes |
| `variant` | `'default'\|'underline'` | `'default'` | Tabs variant           |

### TabsTriggerComponent

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `value` | `string` | -       | Tab value (required)   |
| `class` | `string` | `''`    | Additional CSS classes |

### TabsContentComponent

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `value` | `string` | -       | Tab value (required)   |
| `class` | `string` | `''`    | Additional CSS classes |

## Basic Usage

```html
<tolle-tabs defaultValue="account" class="w-[400px]">
  <tolle-tabs-list class="grid w-full grid-cols-2">
    <tolle-tabs-trigger value="account">Account</tolle-tabs-trigger>
    <tolle-tabs-trigger value="password">Password</tolle-tabs-trigger>
  </tolle-tabs-list>
  <tolle-tabs-content value="account" class="rounded-b-md border p-4">
    <p class="text-sm text-muted-foreground">Make changes to your account here.</p>
  </tolle-tabs-content>
  <tolle-tabs-content value="password" class="rounded-b-md border p-4">
    <p class="text-sm text-muted-foreground">
      Change your password here. After saving, you'll be logged out.
    </p>
  </tolle-tabs-content>
</tolle-tabs>
```

## Accessibility

The Tabs component follows WAI-ARIA tabs pattern:

- **Roles**: Tab list uses `role="tablist"`, triggers use `role="tab"`, and content panels use `role="tabpanel"`.
- **Labels**: Provide visible labels for each tab trigger. Use `aria-label` on the tabs container if a visible label is not present.
- **Keyboard Navigation**:
  - Tab: Move focus to the active tab (or first tab)
  - Up/Left Arrows: Move focus to the previous tab (activates on focus)
  - Down/Right Arrows: Move focus to the next tab (activates on focus)
  - Home: Move focus to the first tab
  - End: Move focus to the last tab
- **State Announcement**:
  - `aria-selected="true"` on the active tab
  - `aria-selected="false"` on inactive tabs
  - `aria-controls` links tabs to their content panels
  - `aria-labelledby` on content panels references the active tab
- **Focus Management**: Focus stays within the tab list when using arrow keys. Tab moves to the content panel.
- **Hidden State**: Inactive panels use `hidden` attribute and are not focusable.

```html
<tolle-tabs defaultValue="overview">
  <tolle-tabs-list aria-label="Account settings">
    <tolle-tabs-trigger value="overview">Overview</tolle-tabs-trigger>
    <tolle-tabs-trigger value="security">Security</tolle-tabs-trigger>
    <tolle-tabs-trigger value="notifications">Notifications</tolle-tabs-trigger>
  </tolle-tabs-list>
  <tolle-tabs-content value="overview">...</tolle-tabs-content>
  <tolle-tabs-content value="security">...</tolle-tabs-content>
  <tolle-tabs-content value="notifications">...</tolle-tabs-content>
</tolle-tabs>
```
