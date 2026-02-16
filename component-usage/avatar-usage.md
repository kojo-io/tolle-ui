# Avatar Component Usage Guide

## Overview

The Avatar component displays a user's profile picture, initials, or fallback icon. It's commonly used in user profiles, comments, and chat interfaces.

## Import

```typescript
import {
  AvatarComponent,
  AvatarImageComponent,
  AvatarFallbackComponent
} from '@tolle_/tolle-ui';
```

## Components

### AvatarComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `alt` | `string` | `''` | Alt text for the avatar image |

### AvatarImageComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `src` | `string` | `''` | Image source URL |
| `class` | `string` | `''` | Additional CSS classes |
| `alt` | `string` | `''` | Alt text for the image |

### AvatarFallbackComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Avatar with Image

```html
<tolle-avatar>
  <tolle-avatar-image src="https://github.com/shadcn.png" alt="@shadcn" />
  <tolle-avatar-fallback>SC</tolle-avatar-fallback>
</tolle-avatar>
```

### Avatar with Initials

```html
<tolle-avatar class="bg-primary text-primary-foreground">
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>
```

### Avatar with Fallback Icon

```html
<tolle-avatar>
  <tolle-avatar-fallback>
    <i class="ri-user-line"></i>
  </tolle-avatar-fallback>
</tolle-avatar>
```

## Avatar Sizes

### Extra Small (24x24)

```html
<tolle-avatar class="h-6 w-6 text-[10px]">
  <tolle-avatar-image src="avatar.jpg" />
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>
```

### Small (32x32)

```html
<tolle-avatar class="h-8 w-8 text-xs">
  <tolle-avatar-image src="avatar.jpg" />
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>
```

### Default (40x40)

```html
<tolle-avatar class="h-10 w-10 text-sm">
  <tolle-avatar-image src="avatar.jpg" />
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>
```

### Large (48x48)

```html
<tolle-avatar class="h-12 w-12 text-base">
  <tolle-avatar-image src="avatar.jpg" />
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>
```

### Extra Large (64x64)

```html
<tolle-avatar class="h-16 w-16 text-lg">
  <tolle-avatar-image src="avatar.jpg" />
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>
```

## Avatar Shapes

### Rounded (Default)

```html
<tolle-avatar class="rounded-lg">
  <tolle-avatar-image src="avatar.jpg" />
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>
```

### Rounded Full (Circular)

```html
<tolle-avatar class="h-10 w-10 rounded-full">
  <tolle-avatar-image src="avatar.jpg" />
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>
```

### Rounded Sm (Small Radius)

```html
<tolle-avatar class="rounded-md">
  <tolle-avatar-image src="avatar.jpg" />
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>
```

### Rounded None (Square)

```html
<tolle-avatar class="rounded-none">
  <tolle-avatar-image src="avatar.jpg" />
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>
```

## Avatar in User List

```html
<div class="flex -space-x-2 overflow-hidden">
  <tolle-avatar class="h-8 w-8 border-2 border-background">
    <tolle-avatar-image src="user1.jpg" />
    <tolle-avatar-fallback>U1</tolle-avatar-fallback>
  </tolle-avatar>
  <tolle-avatar class="h-8 w-8 border-2 border-background">
    <tolle-avatar-image src="user2.jpg" />
    <tolle-avatar-fallback>U2</tolle-avatar-fallback>
  </tolle-avatar>
  <tolle-avatar class="h-8 w-8 border-2 border-background">
    <tolle-avatar-fallback>+3</tolle-avatar-fallback>
  </tolle-avatar>
</div>
```

## Avatar with Status Indicator

```html
<div class="relative inline-block">
  <tolle-avatar class="h-12 w-12">
    <tolle-avatar-image src="avatar.jpg" />
    <tolle-avatar-fallback>JD</tolle-avatar-fallback>
  </tolle-avatar>
  <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500"></span>
</div>
```

## Avatar with Online Status

```html
<div class="flex items-center gap-3">
  <div class="relative">
    <tolle-avatar class="h-10 w-10">
      <tolle-avatar-image src="avatar.jpg" />
      <tolle-avatar-fallback>JD</tolle-avatar-fallback>
    </tolle-avatar>
    <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500"></span>
  </div>
  <div>
    <div class="font-medium">John Doe</div>
    <div class="text-xs text-muted-foreground">Online</div>
  </div>
</div>
```

## Avatar with Hover Effect

```html
<tolle-avatar class="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all">
  <tolle-avatar-image src="avatar.jpg" />
  <tolle-avatar-fallback>JD</tolle-avatar-fallback>
</tolle-avatar>
```

## Avatar in Comment

```html
<div class="flex gap-3">
  <tolle-avatar class="h-8 w-8 flex-shrink-0">
    <tolle-avatar-image src="user.jpg" />
    <tolle-avatar-fallback>UA</tolle-avatar-fallback>
  </tolle-avatar>
  <div class="flex-1">
    <div class="flex items-center gap-2">
      <span class="font-medium">User Name</span>
      <span class="text-xs text-muted-foreground">2h ago</span>
    </div>
    <p class="text-sm mt-1">This is a comment.</p>
  </div>
</div>
```
