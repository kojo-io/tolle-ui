# Scroll Area Component Usage Guide

## Overview

The ScrollArea component provides a custom-styled scrollable area. It hides native scrollbars while maintaining full scrolling functionality.

## Import

```typescript
import { ScrollAreaComponent } from '@tolle_/tolle-ui';
```

## ScrollAreaComponent

**Inputs:**

| Input         | Type                               | Default  | Description               |
| ------------- | ---------------------------------- | -------- | ------------------------- |
| `class`       | `string`                           | `''`     | Additional CSS classes    |
| `height`      | `string`                           | `'100%'` | Height of the scroll area |
| `orientation` | `'vertical'\|'horizontal'\|'both'` | `'both'` | Scroll direction          |

## Basic Usage

### Vertical Scroll

```html
<tolle-scroll-area class="h-[200px] w-[350px] rounded-md border p-4">
  <div class="space-y-4">
    <h4 class="text-sm font-medium leading-none">Tags</h4>
    <div *ngFor="let tag of tags" class="text-sm">
      {{tag}}
      <tolle-separator class="my-2"></tolle-separator>
    </div>
  </div>
</tolle-scroll-area>
```

### Horizontal Scroll

```html
<tolle-scroll-area orientation="horizontal" class="w-full p-4">
  <div class="flex gap-4">
    <div *ngFor="let item of items" class="h-[200px] w-[300px] rounded-md bg-muted">
      {{ item.title }}
    </div>
  </div>
</tolle-scroll-area>
```

### Chat Message List

```html
<tolle-scroll-area orientation="vertical" class="h-[400px] p-4">
  <div class="space-y-4">
    <div *ngFor="let message of messages" class="flex gap-3">
      <tolle-avatar [src]="message.avatar" class="mt-1" />
      <div>
        <div class="flex items-center gap-2">
          <span class="font-medium">{{ message.author }}</span>
          <span class="text-xs text-muted-foreground">{{ message.time }}</span>
        </div>
        <p class="text-sm">{{ message.content }}</p>
      </div>
    </div>
  </div>
</tolle-scroll-area>
```

### Sidebar Navigation

```html
<tolle-scroll-area class="h-[calc(100vh-4rem)] w-[240px]">
  <nav class="space-y-2 p-4">
    <a
      *ngFor="let item of menuItems"
      [class]="item.active ? 'bg-primary/10 text-primary' : ''"
      class="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted">
      <i [class]="item.icon"></i>
      {{ item.label }}
    </a>
  </nav>
</tolle-scroll-area>
```

### Table Container

```html
<tolle-scroll-area class="h-[400px]">
  <table class="w-full">
    <thead class="sticky top-0 bg-background">
      <tr>
        <th class="px-4 py-2 text-left">Name</th>
        <th class="px-4 py-2 text-left">Email</th>
        <th class="px-4 py-2 text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let user of users">
        <td class="px-4 py-2">{{ user.name }}</td>
        <td class="px-4 py-2">{{ user.email }}</td>
        <td class="px-4 py-2">{{ user.status }}</td>
      </tr>
    </tbody>
  </table>
</tolle-scroll-area>
```

### Image Gallery

```html
<tolle-scroll-area orientation="both" class="h-[300px] w-full rounded-lg border">
  <div class="grid grid-cols-3 gap-2 p-2">
    <img
      *ngFor="let image of images"
      [src]="image.url"
      [alt]="image.alt"
      class="h-[150px] w-[200px] rounded object-cover" />
  </div>
</tolle-scroll-area>
```
