# Badge Component Usage Guide

## Overview

The Badge component displays a small, colored indicator used for notifications, counts, or status labels. It's commonly used to draw attention to new or important information.

## Import

```typescript
import { BadgeComponent } from '@tolle_/tolle-ui';
```

## BadgeComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `variant` | `string` | `'default'` | Badge variant style |

## Basic Usage

### Default Badge

```html
<tolle-badge>Default</tolle-badge>
```

### Badges with Counts

```html
<div class="relative">
  <button>
    <i class="ri-message-line text-2xl"></i>
  </button>
  <tolle-badge class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center px-1 text-xs">
    3
  </tolle-badge>
</div>
```

### Badge with Icon

```html
<tolle-badge class="gap-1">
  <i class="ri-alert-line text-[10px]"></i>
  <span>New</span>
</tolle-badge>
```

## Badge Variants

### Default

```html
<tolle-badge variant="default">Default</tolle-badge>
```

### Secondary

```html
<tolle-badge variant="secondary">Secondary</tolle-badge>
```

### Outline

```html
<tolle-badge variant="outline">Outline</tolle-badge>
```

### Destructive

```html
<tolle-badge variant="destructive">Error</tolle-badge>
```

### Custom Color

```html
<tolle-badge class="bg-blue-500 text-white">Custom</tolle-badge>
```

## Status Indicators

### Online Status

```html
<div class="flex items-center gap-2">
  <div class="relative">
    <avatar-avatar src="avatar.jpg">
      <avatar-fallback>JD</avatar-fallback>
    </avatar-avatar>
    <tolle-badge class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
  </div>
  <span>John Doe</span>
</div>
```

### Order Status

```html
<div class="flex items-center gap-2">
  <span class="font-medium">Order #12345</span>
  <tolle-badge variant="outline">Processing</tolle-badge>
</div>
```

### Product Tags

```html
<div class="flex flex-wrap gap-2">
  <tolle-badge variant="secondary">New</tolle-badge>
  <tolle-badge variant="outline">Sale</tolle-badge>
  <tolle-badge>Featured</tolle-badge>
</div>
```

## Pill Shape

```html
<tolle-badge class="rounded-full">Pill Shape</tolle-badge>
```

## Badge with Click Action

```html
<tolle-badge
  class="cursor-pointer hover:bg-accent transition-colors"
  (click)="onBadgeClick()"
>
  Clickable
</tolle-badge>
```

## Large Badge

```html
<tolle-badge class="h-8 px-3 text-sm">Large Badge</tolle-badge>
```

## Small Badge

```html
<tolle-badge class="h-5 px-2 text-[10px]">Small Badge</tolle-badge>
```

## Inverse Badge (Dark Text on Light Background)

```html
<tolle-badge class="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
  Inverse
</tolle-badge>
```

## Badge in Tabs

```html
<tolle-tabs>
  <tolle-tabs-list>
    <tolle-tabs-trigger value="messages">
      Messages
      <tolle-badge class="ml-2">5</tolle-badge>
    </tolle-tabs-trigger>
    <tolle-tabs-trigger value="notifications">
      Notifications
      <tolle-badge class="ml-2 bg-destructive text-destructive-foreground">2</tolle-badge>
    </tolle-tabs-trigger>
  </tolle-tabs-list>
</tolle-tabs>
```
