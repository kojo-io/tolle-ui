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
<hover-card-component>
  <div hover-card-trigger class="cursor-pointer hover:text-primary">
    <strong>Hover over me</strong>
  </div>
  <hover-card-content>
    <p>This is a hover card.</p>
  </hover-card-content>
</hover-card-component>
```

### Hover Card with Avatar

```html
<hover-card-component>
  <div hover-card-trigger class="flex items-center gap-2">
    <tolle-avatar>
      <tolle-avatar-image src="avatar.jpg" />
      <tolle-avatar-fallback>JD</tolle-avatar-fallback>
    </tolle-avatar>
    <span class="font-medium">John Doe</span>
  </div>
  <hover-card-content class="w-64">
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
      <button tolleButton class="w-full justify-start" size="sm">View Profile</button>
    </div>
  </hover-card-content>
</hover-card-component>
```

## Hover Card with Delay

### Custom Delay

```html
<hover-card-component [openDelay]="1000" [closeDelay]="500">
  <div hover-card-trigger class="cursor-pointer">
    Hover (1s delay)
  </div>
  <hover-card-content>
    <p>Content with 1 second delay</p>
  </hover-card-content>
</hover-card-component>
```

## Hover Card in List

### User List

```html
<ul class="space-y-2">
  <li *ngFor="let user of users" class="flex items-center gap-2">
    <hover-card-component>
      <div hover-card-trigger class="flex items-center gap-2">
        <tolle-avatar>
          <tolle-avatar-image [src]="user.avatar" />
          <tolle-avatar-fallback>{{ user.name.charAt(0) }}</tolle-avatar-fallback>
        </tolle-avatar>
        <span class="text-sm">{{ user.name }}</span>
      </div>
      <hover-card-content class="w-48">
        <div class="font-medium">{{ user.name }}</div>
        <div class="text-sm text-muted-foreground">{{ user.email }}</div>
        <div class="mt-2">
          <button tolleButton size="sm" class="w-full">Message</button>
        </div>
      </hover-card-content>
    </hover-card-component>
  </li>
</ul>
```

## Hover Card with Content Preview

### Text Preview

```html
<hover-card-component>
  <div hover-card-trigger class="cursor-pointer hover:underline">
    See preview
  </div>
  <hover-card-content class="w-80">
    <div class="text-sm">
      <p class="font-medium mb-2">Content Preview</p>
      <p class="text-muted-foreground line-clamp-3">
        This is a preview of the content that would be shown in the main view.
        Hover cards are great for giving users a glimpse of what's available
        without navigating away from the current page.
      </p>
    </div>
  </hover-card-content>
</hover-card-component>
```

## Hover Card with Links

### Navigation Preview

```html
<hover-card-component>
  <div hover-card-trigger class="cursor-pointer hover:text-primary">
    Dashboard
  </div>
  <hover-card-content class="w-48">
    <div class="space-y-1">
      <button tolleButton variant="ghost" class="w-full justify-start">
        <i class="ri-home-line mr-2"></i> Overview
      </button>
      <button tolleButton variant="ghost" class="w-full justify-start">
        <i class="ri-bar-chart-line mr-2"></i> Analytics
      </button>
      <button tolleButton variant="ghost" class="w-full justify-start">
        <i class="ri-user-follow-line mr-2"></i> Users
      </button>
    </div>
  </hover-card-content>
</hover-card-component>
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
        <hover-card-component>
          <div hover-card-trigger class="cursor-pointer font-medium hover:text-primary">
            {{ user.name }}
          </div>
          <hover-card-content class="w-48">
            <div class="font-medium">{{ user.name }}</div>
            <div class="text-sm text-muted-foreground">{{ user.email }}</div>
          </hover-card-content>
        </hover-card-component>
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
<hover-card-component placement="top">
  <div hover-card-trigger>Top</div>
  <hover-card-content>Top content</hover-card-content>
</hover-card-component>

<!-- Bottom (default) -->
<hover-card-component placement="bottom">
  <div hover-card-trigger>Bottom</div>
  <hover-card-content>Bottom content</hover-card-content>
</hover-card-component>

<!-- Left -->
<hover-card-component placement="left">
  <div hover-card-trigger>Left</div>
  <hover-card-content>Left content</hover-card-content>
</hover-card-component>

<!-- Right -->
<hover-card-component placement="right">
  <div hover-card-trigger>Right</div>
  <hover-card-content>Right content</hover-card-content>
</hover-card-component>
```

## Hover Card with Card

```html
<hover-card-component>
  <div hover-card-trigger class="cursor-pointer">
    <tolle-card class="w-64">
      <tolle-card-header>
        <tolle-card-title>Card Title</tolle-card-title>
      </tolle-card-header>
      <tolle-card-content>
        <p>Card content</p>
      </tolle-card-content>
    </tolle-card>
  </div>
  <hover-card-content>
    <p>Additional information</p>
  </hover-card-content>
</hover-card-component>
```

## Hover Card with Image Preview

### Image Preview

```html
<hover-card-component>
  <div hover-card-trigger class="cursor-pointer">
    <img
      src="thumbnail.jpg"
      class="h-24 w-24 rounded-lg object-cover"
    />
  </div>
  <hover-card-content class="w-64">
    <img
      src="full-image.jpg"
      class="w-full h-48 object-cover rounded-lg mb-2"
    />
    <div class="font-medium">Image Title</div>
    <div class="text-sm text-muted-foreground">1024x768 • 2MB</div>
  </hover-card-content>
</hover-card-component>
```

## Hover Card with Action Buttons

```html
<hover-card-component>
  <div hover-card-trigger class="cursor-pointer">
    <button tolleButton variant="outline" size="sm">View User</button>
  </div>
  <hover-card-content class="w-48">
    <div class="flex flex-col space-y-1">
      <button tolleButton variant="ghost" size="sm" class="justify-start">
        <i class="ri-edit-line mr-2"></i> Edit
      </button>
      <button tolleButton variant="ghost" size="sm" class="justify-start">
        <i class="ri-delete-bin-line mr-2"></i> Delete
      </button>
      <div tolleDropdownSeparator></div>
      <button tolleButton variant="ghost" size="sm" class="justify-start">
        <i class="ri-mail-line mr-2"></i> Send Email
      </button>
    </div>
  </hover-card-content>
</hover-card-component>
```
