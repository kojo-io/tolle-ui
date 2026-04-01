# Skeleton Component Usage Guide

## Overview

The Skeleton component displays a loading placeholder with a shimmer effect. It's used to indicate content that is being loaded, improving perceived performance.

## Import

```typescript
import { SkeletonComponent } from '@tolle_/tolle-ui';
```

## SkeletonComponent

**Inputs:**

| Input     | Type                       | Default  | Description            |
| --------- | -------------------------- | -------- | ---------------------- |
| `variant` | `'rect'\|'circle'\|'pill'` | `'rect'` | Skeleton shape         |
| `class`   | `string`                   | `''`     | Additional CSS classes |

## Basic Usage

### Basic Skeleton Example

```html
<div class="flex w-full max-w-sm items-center space-x-4 rounded-lg border bg-card p-4">
  <tolle-skeleton variant="circle" class="h-12 w-12" />
  <div class="flex flex-1 flex-col space-y-2">
    <tolle-skeleton variant="rect" class="h-4 w-[250px]" />
    <tolle-skeleton variant="rect" class="h-4 w-[200px]" />
  </div>
</div>
```

### Card Loading State

```html
<div class="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
  <div class="space-y-2">
    <tolle-skeleton variant="rect" class="h-6 w-3/4" />
    <tolle-skeleton variant="rect" class="h-4 w-full" />
  </div>
  <tolle-skeleton variant="rect" class="h-32 w-full" />
  <div class="flex gap-2">
    <tolle-skeleton variant="rect" class="h-10 w-24" />
    <tolle-skeleton variant="rect" class="h-10 w-24" />
  </div>
</div>
```

### Avatar with Text

```html
<div class="flex items-center gap-4">
  <tolle-skeleton variant="circle" class="h-12 w-12" />
  <div class="space-y-2">
    <tolle-skeleton variant="rect" class="h-4 w-32" />
    <tolle-skeleton variant="rect" class="h-3 w-24" />
  </div>
</div>
```

### List Skeleton

```html
<div class="space-y-4">
  <div *ngFor="let i of [1,2,3]" class="flex items-center gap-4">
    <tolle-skeleton variant="circle" class="h-10 w-10" />
    <div class="flex-1 space-y-2">
      <tolle-skeleton variant="rect" class="h-4 w-3/4" />
      <tolle-skeleton variant="rect" class="h-3 w-1/2" />
    </div>
  </div>
</div>
```

### Table Skeleton

```html
<div class="space-y-3">
  <div class="flex gap-4">
    <tolle-skeleton variant="rect" class="h-4 w-24" />
    <tolle-skeleton variant="rect" class="h-4 w-32" />
    <tolle-skeleton variant="rect" class="h-4 w-20" />
  </div>
  <div *ngFor="let row of [1,2,3,4,5]" class="flex gap-4">
    <tolle-skeleton variant="rect" class="h-4 w-24" />
    <tolle-skeleton variant="rect" class="h-4 w-32" />
    <tolle-skeleton variant="rect" class="h-4 w-20" />
  </div>
</div>
```

### Pill Skeleton

```html
<div class="flex gap-2">
  <tolle-skeleton variant="pill" class="h-6 w-20" />
  <tolle-skeleton variant="pill" class="h-6 w-16" />
  <tolle-skeleton variant="pill" class="h-6 w-24" />
</div>
```
