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

### Avatar Fallback Example

```html
<div class="flex gap-4 items-center">
    <tolle-avatar src="invalid-url.png">
        <tolle-avatar-fallback>JD</tolle-avatar-fallback>
    </tolle-avatar>

    <tolle-avatar>
        <tolle-avatar-fallback>
            <i class="ri-user-line text-xl"></i>
        </tolle-avatar-fallback>
    </tolle-avatar>
</div>
```

### Avatar Shapes

```html
<div class="flex gap-4 items-center">
    <tolle-avatar shape="circle" src="https://github.com/nutlope.png">
        <tolle-avatar-fallback>CI</tolle-avatar-fallback>
    </tolle-avatar>

    <tolle-avatar shape="square" src="https://github.com/nutlope.png">
        <tolle-avatar-fallback>SQ</tolle-avatar-fallback>
    </tolle-avatar>
</div>
```

### Avatar Sizes

```html
<div class="flex gap-4 items-center">
    <tolle-avatar size="sm" src="https://github.com/nutlope.png">
        <tolle-avatar-fallback>SM</tolle-avatar-fallback>
    </tolle-avatar>

    <tolle-avatar size="default" src="https://github.com/nutlope.png">
        <tolle-avatar-fallback>DF</tolle-avatar-fallback>
    </tolle-avatar>

    <tolle-avatar size="lg" src="https://github.com/nutlope.png">
        <tolle-avatar-fallback>LG</tolle-avatar-fallback>
    </tolle-avatar>

    <tolle-avatar size="xl" src="https://github.com/nutlope.png">
        <tolle-avatar-fallback>XL</tolle-avatar-fallback>
    </tolle-avatar>
</div>
```

### Basic Avatar

```html
<div class="flex gap-4 items-center">
    <tolle-avatar src="https://github.com/nutlope.png" alt="User Name">
        <tolle-avatar-fallback>JD</tolle-avatar-fallback>
    </tolle-avatar>

    <tolle-avatar size="lg">
        <tolle-avatar-fallback>
            <i class="ri-user-line text-2xl"></i>
        </tolle-avatar-fallback>
    </tolle-avatar>
</div>
```

