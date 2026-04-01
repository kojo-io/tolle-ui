# Button Component Usage Guide

## Overview

The Button component is the primary way users interact with your application. It supports multiple variants, sizes, and states.

## Import

```typescript
import { ButtonComponent, ButtonGroupComponent } from '@tolle_/tolle-ui';
```

## Components

### ButtonComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'default'\|'outline'\|'ghost'\|'destructive'\|'secondary'\|'link'` | `'default'` | Button variant |
| `size` | `'xs'\|'sm'\|'default'\|'lg'\|'icon-xs'\|'icon-sm'\|'icon'\|'icon-lg'` | `'default'` | Button size |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `busy` | `boolean` | `false` | Loading state (shows spinner) |

### ButtonGroupComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Basic Button

```html
<div class="flex flex-wrap gap-4">
      <tolle-button>Primary (Auto)</tolle-button>
      <tolle-button variant="secondary">Secondary (Derived)</tolle-button>
      <tolle-button variant="outline">Outline</tolle-button>
      <tolle-button variant="ghost">Ghost</tolle-button>
      <tolle-button variant="link">Link</tolle-button>
    </div>
    
    <div class="flex flex-wrap items-center gap-4 mt-8">
      <tolle-button size="sm">Small</tolle-button>
      <tolle-button size="default">Default</tolle-button>
      <tolle-button size="lg">Large</tolle-button>
    </div>
```

### Busy Button

```html
<div class="flex flex-wrap gap-4">
      <tolle-button [busy]="true">Please wait</tolle-button>
      <tolle-button variant="outline" [busy]="true">Loading...</tolle-button>
      <tolle-button size="icon" [busy]="true">
        <i class="ri-save-line"></i>
      </tolle-button>
    </div>
```

### Destructive Button

```html
<div class="flex flex-wrap gap-4">
      <tolle-button variant="destructive">Destructive Default</tolle-button>
      <tolle-button variant="destructive" size="sm">Small</tolle-button>
      <tolle-button variant="destructive" size="lg">Large</tolle-button>
    </div>
```

### Icon Button

```html
<div class="flex flex-wrap gap-4 items-center">
      <tolle-button variant="outline">
        <i class="ri-github-line mr-2"></i>
        <span>View on GitHub</span>
      </tolle-button>

      <tolle-button variant="outline" size="icon" tolleTooltip="Edit Profile" placement="top">
        <i class="ri-edit-line"></i>
      </tolle-button>

      <tolle-button size="icon-lg">
        <i class="ri-more-2-fill"></i>
      </tolle-button>

      <tolle-button size="icon" variant="destructive">
        <i class="ri-more-2-fill"></i>
      </tolle-button>

      <tolle-button size="icon-sm" variant="secondary">
        <i class="ri-more-2-fill"></i>
      </tolle-button>

      <tolle-button size="icon-xs">
        <i class="ri-more-2-fill"></i>
      </tolle-button>
    </div>
```

