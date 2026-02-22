# Hover Card Component Usage Guide

## Overview

The HoverCard component displays a floating card that appears when the user hovers over an element. It's commonly used for showing additional information, previews, or quick actions.

## Import

```typescript
import {
  HoverCardComponent,
  HoverCardTriggerComponent,
  HoverCardContentComponent
} from '@tolle_/tolle-ui';
```

## Components

### HoverCardComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `openDelay` | `number` | `700` | Delay before showing (ms) |
| `closeDelay` | `number` | `300` | Delay before hiding (ms) |
| `placement` | `'top'\|'bottom'\|'left'\|'right'` | `'bottom'` | Card position |

### HoverCardTriggerComponent

The element that triggers the hover card.

### HoverCardContentComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Simple Hover Card

```html
<tolle-hover-card>
  <div tolle-hover-card-trigger class="cursor-pointer hover:text-primary">
    <strong>Hover over me</strong>
  </div>
  <tolle-hover-card-content>
    <p>This is a hover card.</p>
  </tolle-hover-card-content>
</tolle-hover-card>
```

### Hover Card with Avatar

```html
<tolle-hover-card>
  <div tolle-hover-card-trigger class="flex items-center gap-2">
    <tolle-avatar>
      <tolle-avatar-image src="avatar.jpg" />
      <tolle-avatar-fallback>JD</tolle-avatar-fallback>
    </tolle-avatar>
    <span class="font-medium">John Doe</span>
  </div>
  <tolle-hover-card-content class="w-64">
    <div class="flex items-center gap-3 p-2">
      <tolle-avatar class="h-12 w-12">
        <tolle-avatar-image src="avatar.jpg" />
        <tolle-avatar-fallback>JD</tolle-avatar-fallback>
      </tolle-avatar>
      <div>
        <div class="font-semibold">John Doe</div>
        <div class="text-sm text-muted-foreground">john@example.com</div>
      </div>
    </div>
    <div class="border-t p-2">
      <button tolle-button class="w-full justify-start" size="sm">View Profile</button>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

## Hover Card with Delay

### Custom Delay

```html
<tolle-hover-card [openDelay]="1000" [closeDelay]="500">
  <div tolle-hover-card-trigger class="cursor-pointer">
    Hover (1s delay)
  </div>
  <tolle-hover-card-content>
    <p>Content with 1 second delay</p>
  </tolle-hover-card-content>
</tolle-hover-card>
```

## Hover Card in List

### User List

```html
<ul class="space-y-2">
  <li *ngFor="let user of users" class="flex items-center gap-2">
    <tolle-hover-card>
      <div tolle-hover-card-trigger class="flex items-center gap-2">
        <tolle-avatar>
          <tolle-avatar-image [src]="user.avatar" />
          <tolle-avatar-fallback>{{ user.name.charAt(0) }}</tolle-avatar-fallback>
        </tolle-avatar>
        <span class="text-sm">{{ user.name }}</span>
      </div>
      <tolle-hover-card-content class="w-48">
        <div class="font-medium">{{ user.name }}</div>
        <div class="text-sm text-muted-foreground">{{ user.email }}</div>
        <div class="mt-2">
          <button tolle-button size="sm" class="w-full">Message</button>
        </div>
      </tolle-hover-card-content>
    </tolle-hover-card>
  </li>
</ul>
```

## Hover Card with Content Preview

### Text Preview

```html
<tolle-hover-card>
  <div tolle-hover-card-trigger class="cursor-pointer hover:underline">
    See preview
  </div>
  <tolle-hover-card-content class="w-80">
    <div class="text-sm">
      <p class="font-medium mb-2">Content Preview</p>
      <p class="text-muted-foreground line-clamp-3">
        This is a preview of the content that would be shown in the main view.
        Hover cards are great for giving users a glimpse of what's available
        without navigating away from the current page.
      </p>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

## Hover Card with Links

### Navigation Preview

```html
<tolle-hover-card>
  <div tolle-hover-card-trigger class="cursor-pointer hover:text-primary">
    Dashboard
  </div>
  <tolle-hover-card-content class="w-48">
    <div class="space-y-1">
      <button tolle-button variant="ghost" class="w-full justify-start">
        <i class="ri-home-line mr-2"></i> Overview
      </button>
      <button tolle-button variant="ghost" class="w-full justify-start">
        <i class="ri-bar-chart-line mr-2"></i> Analytics
      </button>
      <button tolle-button variant="ghost" class="w-full justify-start">
        <i class="ri-user-follow-line mr-2"></i> Users
      </button>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

## Hover Card in Data Table

### Cell Preview

```html
<table class="w-full">
  <thead class="bg-muted">
    <tr>
      <th class="p-4">User</th>
      <th class="p-4">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let user of users">
      <td class="p-4">
        <tolle-hover-card>
          <div tolle-hover-card-trigger class="cursor-pointer font-medium hover:text-primary">
            {{ user.name }}
          </div>
          <tolle-hover-card-content class="w-48">
            <div class="font-medium">{{ user.name }}</div>
            <div class="text-sm text-muted-foreground">{{ user.email }}</div>
          </tolle-hover-card-content>
        </tolle-hover-card>
      </td>
      <td class="p-4">{{ user.email }}</td>
    </tr>
  </tbody>
</table>
```

## Hover Card with Custom Placement

### Different Positions

```html
<!-- Top -->
<tolle-hover-card placement="top">
  <div tolle-hover-card-trigger>Top</div>
  <tolle-hover-card-content>Top content</tolle-hover-card-content>
</tolle-hover-card>

<!-- Bottom (default) -->
<tolle-hover-card placement="bottom">
  <div tolle-hover-card-trigger>Bottom</div>
  <tolle-hover-card-content>Bottom content</tolle-hover-card-content>
</tolle-hover-card>

<!-- Left -->
<tolle-hover-card placement="left">
  <div tolle-hover-card-trigger>Left</div>
  <tolle-hover-card-content>Left content</tolle-hover-card-content>
</tolle-hover-card>

<!-- Right -->
<tolle-hover-card placement="right">
  <div tolle-hover-card-trigger>Right</div>
  <tolle-hover-card-content>Right content</tolle-hover-card-content>
</tolle-hover-card>
```

## Hover Card with Card

```html
<tolle-hover-card>
  <div tolle-hover-card-trigger class="cursor-pointer">
    <tolle-card class="w-64">
      <tolle-card-header>
        <tolle-card-title>Card Title</tolle-card-title>
      </tolle-card-header>
      <tolle-card-content>
        <p>Card content</p>
      </tolle-card-content>
    </tolle-card>
  </div>
  <tolle-hover-card-content>
    <p>Additional information</p>
  </tolle-hover-card-content>
</tolle-hover-card>
```

## Hover Card with Image Preview

### Image Preview

```html
<tolle-hover-card>
  <div tolle-hover-card-trigger class="cursor-pointer">
    <img
      src="thumbnail.jpg"
      class="h-24 w-24 rounded-lg object-cover"
    />
  </div>
  <tolle-hover-card-content class="w-64">
    <img
      src="full-image.jpg"
      class="w-full h-48 object-cover rounded-lg mb-2"
    />
    <div class="font-medium">Image Title</div>
    <div class="text-sm text-muted-foreground">1024x768 • 2MB</div>
  </tolle-hover-card-content>
</tolle-hover-card>
```

## Hover Card with Action Buttons

```html
<tolle-hover-card>
  <div tolle-hover-card-trigger class="cursor-pointer">
    <button tolle-button variant="outline" size="sm">View User</button>
  </div>
  <tolle-hover-card-content class="w-48">
    <div class="flex flex-col space-y-1">
      <button tolle-button variant="ghost" size="sm" class="justify-start">
        <i class="ri-edit-line mr-2"></i> Edit
      </button>
      <button tolle-button variant="ghost" size="sm" class="justify-start">
        <i class="ri-delete-bin-line mr-2"></i> Delete
      </button>
      <div tolle-dropdown-separator></div>
      <button tolle-button variant="ghost" size="sm" class="justify-start">
        <i class="ri-mail-line mr-2"></i> Send Email
      </button>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>
```
