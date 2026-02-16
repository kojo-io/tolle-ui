# Breadcrumb Component Usage Guide

## Overview

The Breadcrumb component displays navigation path history, helping users understand their location within a website or application.

## Import

```typescript
import {
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent
} from '@tolle_/tolle-ui';
```

## Components

### BreadcrumbComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |

### BreadcrumbItemComponent

Individual breadcrumb item.

### BreadcrumbLinkComponent

Link element for breadcrumb items.

### BreadcrumbSeparatorComponent

Separator between breadcrumb items.

## Basic Usage

### Simple Breadcrumb

```html
<tolle-breadcrumb aria-label="breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5">
    <li>
      <a href="/" class="text-sm text-muted-foreground hover:text-foreground">
        Home
      </a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <span class="text-sm text-foreground font-medium">Products</span>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <span class="text-sm text-foreground font-medium">Electronics</span>
    </li>
  </ol>
</tolle-breadcrumb>
```

### Breadcrumb with Link

```html
<tolle-breadcrumb aria-label="breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5">
    <li>
      <a href="/" class="text-sm text-muted-foreground hover:text-primary transition-colors">
        Home
      </a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <a href="/products" class="text-sm text-muted-foreground hover:text-primary transition-colors">
        Products
      </a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <span class="text-sm text-foreground font-medium">Details</span>
    </li>
  </ol>
</tolle-breadcrumb>
```

## Breadcrumb with Custom Separator

### Custom Separator

```html
<tolle-breadcrumb aria-label="breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5">
    <li>
      <a href="/" class="text-sm text-muted-foreground hover:text-primary">Home</a>
    </li>
    <li>
      <span class="text-muted-foreground">/</span>
    </li>
    <li>
      <a href="/products" class="text-sm text-muted-foreground hover:text-primary">Products</a>
    </li>
    <li>
      <span class="text-muted-foreground">/</span>
    </li>
    <li>
      <span class="text-sm text-foreground font-medium">Category</span>
    </li>
  </ol>
</tolle-breadcrumb>
```

### Chevron Separator

```html
<tolle-breadcrumb aria-label="breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5">
    <li>
      <a href="/" class="text-sm text-muted-foreground hover:text-primary">Home</a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <a href="/products" class="text-sm text-muted-foreground hover:text-primary">Products</a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <span class="text-sm text-foreground font-medium">Details</span>
    </li>
  </ol>
</tolle-breadcrumb>
```

## Breadcrumb in Header

```html
<header class="border-b px-6 py-4">
  <tolle-breadcrumb aria-label="breadcrumb" class="mb-4">
    <ol class="flex flex-wrap items-center gap-1.5">
      <li>
        <a href="/" class="text-sm text-muted-foreground hover:text-primary">Dashboard</a>
      </li>
      <li>
        <i class="ri-arrow-right-s-line text-muted-foreground"></i>
      </li>
      <li>
        <span class="text-sm text-foreground font-medium">Settings</span>
      </li>
    </ol>
  </tolle-breadcrumb>
  <h1 class="text-2xl font-bold">Settings</h1>
</header>
```

## Breadcrumb with Icons

### Icons in Breadcrumb

```html
<tolle-breadcrumb aria-label="breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5">
    <li>
      <a href="/" class="text-sm text-muted-foreground hover:text-primary">
        <i class="ri-home-line mr-1"></i> Home
      </a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <a href="/products" class="text-sm text-muted-foreground hover:text-primary">
        <i class="ri-shopping-bag-line mr-1"></i> Products
      </a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <span class="text-sm text-foreground font-medium">
        <i class="ri-edit-line mr-1"></i> Edit
      </span>
    </li>
  </ol>
</tolle-breadcrumb>
```

## Breadcrumb in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-breadcrumb aria-label="breadcrumb">
      <ol class="flex flex-wrap items-center gap-1.5">
        <li>
          <a href="/" class="text-sm text-muted-foreground hover:text-primary">Home</a>
        </li>
        <li>
          <i class="ri-arrow-right-s-line text-muted-foreground"></i>
        </li>
        <li>
          <a href="/users" class="text-sm text-muted-foreground hover:text-primary">Users</a>
        </li>
        <li>
          <i class="ri-arrow-right-s-line text-muted-foreground"></i>
        </li>
        <li>
          <span class="text-sm text-foreground font-medium">Profile</span>
        </li>
      </ol>
    </tolle-breadcrumb>
    <tolle-card-title>User Profile</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content>
    <!-- Content -->
  </tolle-card-content>
</tolle-card>
```

## Breadcrumb with Active State

### Active Page Highlight

```html
<tolle-breadcrumb aria-label="breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5">
    <li>
      <a href="/" class="text-sm text-muted-foreground hover:text-primary transition-colors">
        Home
      </a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <a href="/products" class="text-sm text-muted-foreground hover:text-primary transition-colors">
        Products
      </a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <span class="text-sm text-foreground font-medium">Current Page</span>
    </li>
  </ol>
</tolle-breadcrumb>
```

## Breadcrumb with Dropdown

### Dropdown Menu

```html
<tolle-breadcrumb aria-label="breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5">
    <li>
      <a href="/" class="text-sm text-muted-foreground hover:text-primary">Home</a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <tolle-dropdown-menu>
        <button tolleDropdownTrigger class="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
          Categories
          <i class="ri-arrow-down-s-line text-xs"></i>
        </button>
        <tolle-dropdown-menu-content>
          <button tolleDropdownItem>Electronics</button>
          <button tolleDropdownItem>Clothing</button>
          <button tolleDropdownItem>Books</button>
        </tolle-dropdown-menu-content>
      </tolle-dropdown-menu>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <span class="text-sm text-foreground font-medium">Smartphones</span>
    </li>
  </ol>
</tolle-breadcrumb>
```

## Breadcrumb with Dropdown Trigger

### Dynamic Breadcrumb

```html
<tolle-breadcrumb aria-label="breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5">
    <li>
      <a href="/" class="text-sm text-muted-foreground hover:text-primary">Home</a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <span class="text-sm text-muted-foreground hover:text-primary cursor-pointer">
        {{ currentSection }}
        <i class="ri-arrow-down-s-line text-xs ml-1"></i>
      </span>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <span class="text-sm text-foreground font-medium">{{ currentPage }}</span>
    </li>
  </ol>
</tolle-breadcrumb>
```

## Breadcrumb Responsive

### Stack on Mobile

```html
<tolle-breadcrumb aria-label="breadcrumb" class="text-sm">
  <ol class="flex flex-wrap items-center gap-1.5">
    <li>
      <a href="/" class="text-muted-foreground hover:text-primary">Home</a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <a href="/products" class="text-muted-foreground hover:text-primary">Products</a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <span class="text-foreground font-medium">Category</span>
    </li>
  </ol>
</tolle-breadcrumb>
```

## Breadcrumb with Truncation

### Long Breadcrumb

```html
<tolle-breadcrumb aria-label="breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5">
    <li>
      <a href="/" class="text-sm text-muted-foreground hover:text-primary">Home</a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <a href="/products" class="text-sm text-muted-foreground hover:text-primary">Products</a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <a href="/products/electronics" class="text-sm text-muted-foreground hover:text-primary">
        Electronics
      </a>
    </li>
    <li>
      <i class="ri-arrow-right-s-line text-muted-foreground"></i>
    </li>
    <li>
      <span class="text-sm text-foreground font-medium">Smartphones & Tablets</span>
    </li>
  </ol>
</tolle-breadcrumb>
```
