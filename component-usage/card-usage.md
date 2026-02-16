# Card Component Usage Guide

## Overview

The Card component is a versatile container for content like images, text, and actions. It's commonly used for displaying related information in a structured format.

## Import

```typescript
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent
} from '@tolle_/tolle-ui';
```

## Components

### CardComponent

Container component with default styling.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### CardHeaderComponent

Header section of the card.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### CardTitleComponent

Title element for the card header.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### CardDescriptionComponent

Description text for the card header.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### CardContentComponent

Main content area of the card.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### CardFooterComponent

Footer section of the card.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Simple Card

```html
<tolle-card class="w-full max-w-sm">
  <tolle-card-header>
    <tolle-card-title>Card Title</tolle-card-title>
    <tolle-card-description>Card description here</tolle-card-description>
  </tolle-card-header>
  <tolle-card-content>
    <p>Card content goes here.</p>
  </tolle-card-content>
  <tolle-card-footer>
    <p>Card footer</p>
  </tolle-card-footer>
</tolle-card>
```

### Card with Image

```html
<tolle-card class="w-full max-w-sm">
  <div class="h-48 overflow-hidden rounded-t-lg">
    <img src="image.jpg" alt="Card image" class="h-full w-full object-cover" />
  </div>
  <tolle-card-header>
    <tolle-card-title>Card with Image</tolle-card-title>
    <tolle-card-description>Description of the image</tolle-card-description>
  </tolle-card-header>
  <tolle-card-content>
    <p>Content goes here...</p>
  </tolle-card-content>
  <tolle-card-footer>
    <button tolleButton size="sm">Action</button>
  </tolle-card-footer>
</tolle-card>
```

### Card with Action Buttons

```html
<tolle-card class="w-full max-w-sm">
  <tolle-card-header>
    <tolle-card-title>Settings</tolle-card-title>
    <tolle-card-description>Manage your preferences</tolle-card-description>
  </tolle-card-header>
  <tolle-card-content>
    <p>Content here...</p>
  </tolle-card-content>
  <tolle-card-footer>
    <button tolleButton size="sm">Save</button>
    <button tolleButton size="sm" variant="outline">Cancel</button>
  </tolle-card-footer>
</tolle-card>
```

## Card Variants

### Raised Card

```html
<tolle-card class="shadow-lg">
  <!-- Content -->
</tolle-card>
```

### Bordered Card

```html
<tolle-card class="border-2 border-primary">
  <!-- Content -->
</tolle-card>
```

### Inset Card

```html
<tolle-card class="bg-muted/50">
  <!-- Content -->
</tolle-card>
```

### Destructive Card

```html
<tolle-card class="border-destructive/20 bg-destructive/5">
  <!-- Content -->
</tolle-card>
```

## Card with Tabs

```html
<tolle-card class="w-full max-w-md">
  <tolle-card-header>
    <tolle-card-title>Profile</tolle-card-title>
  </tolle-card-header>
  <tolle-tabs defaultValue="account" class="w-full">
    <tolle-tabs-list>
      <tolle-tabs-trigger value="account">Account</tolle-tabs-trigger>
      <tolle-tabs-trigger value="password">Password</tolle-tabs-trigger>
    </tolle-tabs-list>
    <tolle-tabs-content value="account">Account content</tolle-tabs-content>
    <tolle-tabs-content value="password">Password content</tolle-tabs-content>
  </tolle-tabs>
</tolle-card>
```

## Card Grid Layout

```html
<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <tolle-card>
    <tolle-card-header>
      <tolle-card-title>Card 1</tolle-card-title>
    </tolle-card-header>
    <tolle-card-content>Content 1</tolle-card-content>
  </tolle-card>
  <tolle-card>
    <tolle-card-header>
      <tolle-card-title>Card 2</tolle-card-title>
    </tolle-card-header>
    <tolle-card-content>Content 2</tolle-card-content>
  </tolle-card>
  <tolle-card>
    <tolle-card-header>
      <tolle-card-title>Card 3</tolle-card-title>
    </tolle-card-header>
    <tolle-card-content>Content 3</tolle-card-content>
  </tolle-card>
</div>
```

## Card with Badge

```html
<tolle-card class="relative">
  <div class="absolute right-4 top-4">
    <tolle-badge variant="outline">New</tolle-badge>
  </div>
  <tolle-card-header>
    <tolle-card-title>Card with Badge</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content>Content</tolle-card-content>
</tolle-card>
```

## Card with Progress

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Progress</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content>
    <div class="space-y-2">
      <p class="text-sm">Task completion</p>
      <div class="flex items-center gap-2">
        <progress-component [value]="75" class="h-2 flex-1"></progress-component>
        <span class="text-xs text-muted-foreground">75%</span>
      </div>
    </div>
  </tolle-card-content>
</tolle-card>
```

## Card with Avatar

```html
<tolle-card>
  <tolle-card-header>
    <div class="flex items-center gap-3">
      <tolle-avatar>
        <tolle-avatar-image src="avatar.jpg" />
        <tolle-avatar-fallback>JD</tolle-avatar-fallback>
      </tolle-avatar>
      <div>
        <tolle-card-title>John Doe</tolle-card-title>
        <tolle-card-description>john@example.com</tolle-card-description>
      </div>
    </div>
  </tolle-card-header>
  <tolle-card-content>Content here...</tolle-card-content>
</tolle-card>
```

## Card without Header

```html
<tolle-card class="rounded-lg">
  <tolle-card-content>
    <p>Card content without header</p>
  </tolle-card-content>
</tolle-card>
```

## Card without Footer

```html
<tolle-card class="rounded-lg">
  <tolle-card-header>
    <tolle-card-title>Title Only</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content>Content here...</tolle-card-content>
</tolle-card>
```
