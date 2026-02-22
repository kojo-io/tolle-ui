# Skeleton Component Usage Guide

## Overview

The Skeleton component displays a loading placeholder with a shimmer effect. It's used to indicate content that is being loaded, improving perceived performance.

## Import

```typescript
import { SkeletonComponent } from '@tolle_/tolle-ui';
```

## SkeletonComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'rect'\|'circle'\|'pill'` | `'rect'` | Skeleton shape |
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Simple Skeleton

```html
<tolle-skeleton class="h-4 w-full"></tolle-skeleton>
```

### Skeleton with Custom Dimensions

```html
<tolle-skeleton class="h-8 w-32"></tolle-skeleton>
```

## Skeleton Sizes

### Text Line (Small)

```html
<tolle-skeleton class="h-4 w-full"></tolle-skeleton>
```

### Text Line (Medium)

```html
<tolle-skeleton class="h-6 w-full"></tolle-skeleton>
```

### Text Line (Large)

```html
<tolle-skeleton class="h-8 w-full"></tolle-skeleton>
```

### Square Skeleton

```html
<tolle-skeleton class="h-24 w-24 rounded-lg"></tolle-skeleton>
```

### Circle Skeleton (Avatar)

```html
<tolle-skeleton variant="circle" class="h-12 w-12 rounded-full"></tolle-skeleton>
```

### Rectangle Skeleton

```html
<tolle-skeleton class="h-48 w-full rounded-lg"></tolle-skeleton>
```

## Skeleton in Card

### Card Header

```html
<tolle-card class="w-full max-w-md">
  <tolle-card-header>
    <div class="space-y-2">
      <tolle-skeleton class="h-6 w-32"></tolle-skeleton>
      <tolle-skeleton class="h-4 w-48"></tolle-skeleton>
    </div>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <tolle-skeleton class="h-4 w-full"></tolle-skeleton>
    <tolle-skeleton class="h-4 w-5/6"></tolle-skeleton>
    <tolle-skeleton class="h-4 w-4/6"></tolle-skeleton>
  </tolle-card-content>
</tolle-card>
```

### Card with Image Placeholder

```html
<tolle-card class="w-full max-w-sm">
  <div class="h-48 overflow-hidden rounded-t-lg">
    <tolle-skeleton class="h-full w-full rounded-t-lg"></tolle-skeleton>
  </div>
  <tolle-card-header>
    <div class="space-y-2">
      <tolle-skeleton class="h-6 w-48"></tolle-skeleton>
      <tolle-skeleton class="h-4 w-64"></tolle-skeleton>
    </div>
  </tolle-card-header>
  <tolle-card-content>
    <tolle-skeleton class="h-4 w-full mb-2"></tolle-skeleton>
    <tolle-skeleton class="h-4 w-5/6"></tolle-skeleton>
  </tolle-card-content>
</tolle-card>
```

## Skeleton in List

```html
<div class="space-y-4">
  <div class="flex items-center gap-4">
    <tolle-skeleton class="h-10 w-10 rounded-full"></tolle-skeleton>
    <div class="flex-1 space-y-2">
      <tolle-skeleton class="h-4 w-32"></tolle-skeleton>
      <tolle-skeleton class="h-3 w-48"></tolle-skeleton>
    </div>
  </div>
  <div class="flex items-center gap-4">
    <tolle-skeleton class="h-10 w-10 rounded-full"></tolle-skeleton>
    <div class="flex-1 space-y-2">
      <tolle-skeleton class="h-4 w-32"></tolle-skeleton>
      <tolle-skeleton class="h-3 w-48"></tolle-skeleton>
    </div>
  </div>
  <div class="flex items-center gap-4">
    <tolle-skeleton class="h-10 w-10 rounded-full"></tolle-skeleton>
    <div class="flex-1 space-y-2">
      <tolle-skeleton class="h-4 w-32"></tolle-skeleton>
      <tolle-skeleton class="h-3 w-48"></tolle-skeleton>
    </div>
  </div>
</div>
```

## Skeleton in Table

```html
<div class="rounded-md border">
  <table class="w-full">
    <thead class="bg-muted">
      <tr>
        <th class="p-4">
          <tolle-skeleton class="h-4 w-24"></tolle-skeleton>
        </th>
        <th class="p-4">
          <tolle-skeleton class="h-4 w-24"></tolle-skeleton>
        </th>
        <th class="p-4">
          <tolle-skeleton class="h-4 w-24"></tolle-skeleton>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let row of [1, 2, 3]">
        <td class="p-4">
          <tolle-skeleton class="h-4 w-20"></tolle-skeleton>
        </td>
        <td class="p-4">
          <tolle-skeleton class="h-4 w-32"></tolle-skeleton>
        </td>
        <td class="p-4">
          <tolle-skeleton class="h-4 w-16"></tolle-skeleton>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## Skeleton with Delay

### Conditional Skeleton

```html
<div *ngIf="isLoading; else loaded">
  <tolle-skeleton class="h-48 w-full rounded-lg"></tolle-skeleton>
</div>

<ng-template #loaded>
  <div class="h-48 w-full rounded-lg bg-muted">
    <!-- Content here -->
  </div>
</ng-template>
```

### Skeleton with Timeout

```typescript
isLoading = true;

ngOnInit() {
  setTimeout(() => {
    this.isLoading = false;
  }, 2000);
}
```

```html
<div *ngIf="isLoading; else loaded">
  <tolle-skeleton class="h-full w-full rounded-lg"></tolle-skeleton>
</div>

<ng-template #loaded>
  <div class="h-full w-full rounded-lg bg-muted">
    <!-- Content -->
  </div>
</ng-template>
```

## Skeleton in Carousel

```html
<tolle-carousel *ngIf="!imagesLoaded; else carousel">
  <div tolle-carousel-content>
    <div tolle-carousel-container>
      <div *ngFor="let i of [1, 2, 3]" tolle-carousel-item>
        <tolle-skeleton class="h-64 w-full rounded-lg"></tolle-skeleton>
      </div>
    </div>
  </div>
</tolle-carousel>

<ng-template #carousel>
  <tolle-carousel>
    <div tolle-carousel-content>
      <div tolle-carousel-container>
        <div *ngFor="let image of images" tolle-carousel-item>
          <img [src]="image" class="h-64 w-full rounded-lg object-cover" />
        </div>
      </div>
    </div>
  </tolle-carousel>
</ng-template>
```

## Skeleton in Form

```html
<div class="space-y-4">
  <div class="space-y-2">
    <tolle-skeleton class="h-4 w-24"></tolle-skeleton>
    <tolle-skeleton class="h-10 w-full"></tolle-skeleton>
  </div>
  <div class="space-y-2">
    <tolle-skeleton class="h-4 w-24"></tolle-skeleton>
    <tolle-skeleton class="h-24 w-full"></tolle-skeleton>
  </div>
  <tolle-skeleton class="h-10 w-full"></tolle-skeleton>
</div>
```

## Skeleton with Different Shapes

### Rounded Corners

```html
<tolle-skeleton class="h-48 w-full rounded-xl"></tolle-skeleton>
```

### Pill Shape

```html
<tolle-skeleton variant="pill" class="h-12 w-full rounded-full"></tolle-skeleton>
```

### Custom Border Radius

```html
<tolle-skeleton class="h-32 w-full rounded-2xl"></tolle-skeleton>
```

## Skeleton with Text Lines

### Paragraph Skeleton

```html
<div class="space-y-2">
  <tolle-skeleton class="h-4 w-full"></tolle-skeleton>
  <tolle-skeleton class="h-4 w-11/12"></tolle-skeleton>
  <tolle-skeleton class="h-4 w-10/12"></tolle-skeleton>
  <tolle-skeleton class="h-4 w-9/12"></tolle-skeleton>
</div>
```

### Article Skeleton

```html
<div class="space-y-4">
  <tolle-skeleton class="h-64 w-full rounded-lg"></tolle-skeleton>
  <tolle-skeleton class="h-8 w-3/4"></tolle-skeleton>
  <div class="space-y-2">
    <tolle-skeleton class="h-4 w-full"></tolle-skeleton>
    <tolle-skeleton class="h-4 w-full"></tolle-skeleton>
    <tolle-skeleton class="h-4 w-5/6"></tolle-skeleton>
  </div>
</div>
```
