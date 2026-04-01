# Breadcrumb Component Usage Guide

## Overview

The Breadcrumb component displays navigation path history, helping users understand their location within a website or application.

## Import

```typescript
import {
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent,
} from '@tolle_/tolle-ui';
```

## Components

### BreadcrumbComponent

Container for breadcrumb items. Provides separator styling.

**Selector:** `tolle-breadcrumb`

**Inputs:**

| Input   | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

### BreadcrumbItemComponent

Individual breadcrumb item container.

**Selector:** `tolle-breadcrumb-item`

### BreadcrumbLinkComponent

Link element for breadcrumb items.

**Selector:** `tolle-breadcrumb-link`

**Inputs:**

| Input    | Type      | Default | Description                             |
| -------- | --------- | ------- | --------------------------------------- |
| `active` | `boolean` | `false` | Whether this is the active/current item |

### BreadcrumbSeparatorComponent

Separator between breadcrumb items.

**Selector:** `tolle-breadcrumb-separator`

**Note:** Can contain custom content (icons, text) or use default separator.

## Basic Usage

### Basic Breadcrumb

```html
<tolle-breadcrumb>
  <tolle-breadcrumb-item>
    <tolle-breadcrumb-link>Home</tolle-breadcrumb-link>
  </tolle-breadcrumb-item>
  <tolle-breadcrumb-separator></tolle-breadcrumb-separator>
  <tolle-breadcrumb-item>
    <tolle-breadcrumb-link>Components</tolle-breadcrumb-link>
  </tolle-breadcrumb-item>
  <tolle-breadcrumb-separator></tolle-breadcrumb-separator>
  <tolle-breadcrumb-item>
    <tolle-breadcrumb-link [active]="true">Breadcrumb</tolle-breadcrumb-link>
  </tolle-breadcrumb-item>
</tolle-breadcrumb>
```

### Custom Separator Breadcrumb

```html
<tolle-breadcrumb>
  <tolle-breadcrumb-item>
    <tolle-breadcrumb-link>Home</tolle-breadcrumb-link>
  </tolle-breadcrumb-item>
  <tolle-breadcrumb-separator>
    <i class="ri-arrow-right-double-line text-muted-foreground/50"></i>
  </tolle-breadcrumb-separator>
  <tolle-breadcrumb-item>
    <tolle-breadcrumb-link>Components</tolle-breadcrumb-link>
  </tolle-breadcrumb-item>
  <tolle-breadcrumb-separator>
    <i class="ri-arrow-right-double-line text-muted-foreground/50"></i>
  </tolle-breadcrumb-separator>
  <tolle-breadcrumb-item>
    <tolle-breadcrumb-link [active]="true">Breadcrumb</tolle-breadcrumb-link>
  </tolle-breadcrumb-item>
</tolle-breadcrumb>
```
