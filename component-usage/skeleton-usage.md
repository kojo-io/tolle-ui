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
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Simple Skeleton

```html
<skeleton-component class="h-4 w-full"></skeleton-component>
```

### Skeleton with Custom Dimensions

```html
<skeleton-component class="h-8 w-32"></skeleton-component>
```

## Skeleton Sizes

### Text Line (Small)

```html
<skeleton-component class="h-4 w-full"></skeleton-component>
```

### Text Line (Medium)

```html
<skeleton-component class="h-6 w-full"></skeleton-component>
```

### Text Line (Large)

```html
<skeleton-component class="h-8 w-full"></skeleton-component>
```

### Square Skeleton

```html
<skeleton-component class="h-24 w-24 rounded-lg"></skeleton-component>
```

### Circle Skeleton (Avatar)

```html
<skeleton-component class="h-12 w-12 rounded-full"></skeleton-component>
```

### Rectangle Skeleton

```html
<skeleton-component class="h-48 w-full rounded-lg"></skeleton-component>
```

## Skeleton in Card

### Card Header

```html
<tolle-card class="w-full max-w-md">
  <tolle-card-header>
    <div class="space-y-2">
      <skeleton-component class="h-6 w-32"></skeleton-component>
      <skeleton-component class="h-4 w-48"></skeleton-component>
    </div>
  </tolle-card-header>
  <tolle-card-content class="space-y-4">
    <skeleton-component class="h-4 w-full"></skeleton-component>
    <skeleton-component class="h-4 w-5/6"></skeleton-component>
    <skeleton-component class="h-4 w-4/6"></skeleton-component>
  </tolle-card-content>
</tolle-card>
```

### Card with Image Placeholder

```html
<tolle-card class="w-full max-w-sm">
  <div class="h-48 overflow-hidden rounded-t-lg">
    <skeleton-component class="h-full w-full rounded-t-lg"></skeleton-component>
  </div>
  <tolle-card-header>
    <div class="space-y-2">
      <skeleton-component class="h-6 w-48"></skeleton-component>
      <skeleton-component class="h-4 w-64"></skeleton-component>
    </div>
  </tolle-card-header>
  <tolle-card-content>
    <skeleton-component class="h-4 w-full mb-2"></skeleton-component>
    <skeleton-component class="h-4 w-5/6"></skeleton-component>
  </tolle-card-content>
</tolle-card>
```

## Skeleton in List

```html
<div class="space-y-4">
  <div class="flex items-center gap-4">
    <skeleton-component class="h-10 w-10 rounded-full"></skeleton-component>
    <div class="flex-1 space-y-2">
      <skeleton-component class="h-4 w-32"></skeleton-component>
      <skeleton-component class="h-3 w-48"></skeleton-component>
    </div>
  </div>
  <div class="flex items-center gap-4">
    <skeleton-component class="h-10 w-10 rounded-full"></skeleton-component>
    <div class="flex-1 space-y-2">
      <skeleton-component class="h-4 w-32"></skeleton-component>
      <skeleton-component class="h-3 w-48"></skeleton-component>
    </div>
  </div>
  <div class="flex items-center gap-4">
    <skeleton-component class="h-10 w-10 rounded-full"></skeleton-component>
    <div class="flex-1 space-y-2">
      <skeleton-component class="h-4 w-32"></skeleton-component>
      <skeleton-component class="h-3 w-48"></skeleton-component>
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
          <skeleton-component class="h-4 w-24"></skeleton-component>
        </th>
        <th class="p-4">
          <skeleton-component class="h-4 w-24"></skeleton-component>
        </th>
        <th class="p-4">
          <skeleton-component class="h-4 w-24"></skeleton-component>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let row of [1, 2, 3]">
        <td class="p-4">
          <skeleton-component class="h-4 w-20"></skeleton-component>
        </td>
        <td class="p-4">
          <skeleton-component class="h-4 w-32"></skeleton-component>
        </td>
        <td class="p-4">
          <skeleton-component class="h-4 w-16"></skeleton-component>
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
  <skeleton-component class="h-48 w-full rounded-lg"></skeleton-component>
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
  <skeleton-component class="h-full w-full rounded-lg"></skeleton-component>
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
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div *ngFor="let i of [1, 2, 3]" tolleCarouselItem>
        <skeleton-component class="h-64 w-full rounded-lg"></skeleton-component>
      </div>
    </div>
  </div>
</tolle-carousel>

<ng-template #carousel>
  <tolle-carousel>
    <div tolleCarouselContent>
      <div tolleCarouselContainer>
        <div *ngFor="let image of images" tolleCarouselItem>
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
    <skeleton-component class="h-4 w-24"></skeleton-component>
    <skeleton-component class="h-10 w-full"></skeleton-component>
  </div>
  <div class="space-y-2">
    <skeleton-component class="h-4 w-24"></skeleton-component>
    <skeleton-component class="h-24 w-full"></skeleton-component>
  </div>
  <skeleton-component class="h-10 w-full"></skeleton-component>
</div>
```

## Skeleton with Different Shapes

### Rounded Corners

```html
<skeleton-component class="h-48 w-full rounded-xl"></skeleton-component>
```

### Pill Shape

```html
<skeleton-component class="h-12 w-full rounded-full"></skeleton-component>
```

### Custom Border Radius

```html
<skeleton-component class="h-32 w-full rounded-2xl"></skeleton-component>
```

## Skeleton with Text Lines

### Paragraph Skeleton

```html
<div class="space-y-2">
  <skeleton-component class="h-4 w-full"></skeleton-component>
  <skeleton-component class="h-4 w-11/12"></skeleton-component>
  <skeleton-component class="h-4 w-10/12"></skeleton-component>
  <skeleton-component class="h-4 w-9/12"></skeleton-component>
</div>
```

### Article Skeleton

```html
<div class="space-y-4">
  <skeleton-component class="h-64 w-full rounded-lg"></skeleton-component>
  <skeleton-component class="h-8 w-3/4"></skeleton-component>
  <div class="space-y-2">
    <skeleton-component class="h-4 w-full"></skeleton-component>
    <skeleton-component class="h-4 w-full"></skeleton-component>
    <skeleton-component class="h-4 w-5/6"></skeleton-component>
  </div>
</div>
```
