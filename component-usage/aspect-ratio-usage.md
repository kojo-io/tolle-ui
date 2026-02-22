# Aspect Ratio Component Usage Guide

## Overview

The AspectRatio component maintains a specific aspect ratio for its content. It's commonly used for images, videos, and other media that need to maintain proportional dimensions.

## Import

```typescript
import { AspectRatioComponent } from '@tolle_/tolle-ui';
```

## AspectRatioComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `ratio` | `number` | `16 / 9` | Aspect ratio (width/height) |

## Basic Usage

### Square Aspect Ratio (1:1)

```html
<tolle-aspect-ratio [ratio]="1" class="w-full">
  <img
    src="image.jpg"
    alt="Square image"
    class="h-full w-full object-cover"
  />
</tolle-aspect-ratio>
```

### Landscape Aspect Ratio (16:9)

```html
<tolle-aspect-ratio [ratio]="16 / 9" class="w-full">
  <img
    src="video-thumbnail.jpg"
    alt="Video thumbnail"
    class="h-full w-full object-cover"
  />
</tolle-aspect-ratio>
```

### Portrait Aspect Ratio (9:16)

```html
<tolle-aspect-ratio [ratio]="9 / 16" class="w-64">
  <img
    src="portrait.jpg"
    alt="Portrait image"
    class="h-full w-full object-cover"
  />
</tolle-aspect-ratio>
```

## Common Aspect Ratios

### 1:1 (Square)

```html
<tolle-aspect-ratio [ratio]="1">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>1:1</span>
  </div>
</tolle-aspect-ratio>
```

### 4:3 (Standard)

```html
<tolle-aspect-ratio [ratio]="4 / 3">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>4:3</span>
  </div>
</tolle-aspect-ratio>
```

### 16:9 (Widescreen)

```html
<tolle-aspect-ratio [ratio]="16 / 9">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>16:9</span>
  </div>
</tolle-aspect-ratio>
```

### 21:9 (Ultrawide)

```html
<tolle-aspect-ratio [ratio]="21 / 9">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>21:9</span>
  </div>
</tolle-aspect-ratio>
```

### 3:4 (Portrait)

```html
<tolle-aspect-ratio [ratio]="3 / 4">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>3:4</span>
  </div>
</tolle-aspect-ratio>
```

### 2:3 (Portrait)

```html
<tolle-aspect-ratio [ratio]="2 / 3">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>2:3</span>
  </div>
</tolle-aspect-ratio>
```

## Aspect Ratio with Image

### Cover Image

```html
<tolle-aspect-ratio [ratio]="16 / 9">
  <img
    src="cover.jpg"
    alt="Cover"
    class="h-full w-full object-cover"
  />
</tolle-aspect-ratio>
```

### Contain Image

```html
<tolle-aspect-ratio [ratio]="4 / 3">
  <img
    src="logo.png"
    alt="Logo"
    class="h-full w-full object-contain p-4"
  />
</tolle-aspect-ratio>
```

## Aspect Ratio in Card

### Product Image

```html
<tolle-card class="w-full max-w-sm">
  <tolle-aspect-ratio [ratio]="4 / 3">
    <img
      src="product.jpg"
      alt="Product"
      class="h-full w-full object-cover"
    />
  </tolle-aspect-ratio>
  <tolle-card-header>
    <tolle-card-title>Product Name</tolle-card-title>
    <tolle-card-description>$99.99</tolle-card-description>
  </tolle-card-header>
</tolle-card>
```

### User Avatar Card

```html
<tolle-card class="w-full max-w-xs text-center">
  <tolle-aspect-ratio [ratio]="1">
    <img
      src="avatar.jpg"
      alt="User"
      class="h-full w-full object-cover rounded-t-lg"
    />
  </tolle-aspect-ratio>
  <tolle-card-header>
    <tolle-card-title>John Doe</tolle-card-title>
    <tolle-card-description>UI Designer</tolle-card-description>
  </tolle-card-header>
</tolle-card>
```

## Aspect Ratio in Carousel

```html
<tolle-carousel>
  <div tolle-carousel-content>
    <div tolle-carousel-container>
      <div tolle-carousel-item>
        <tolle-aspect-ratio [ratio]="16 / 9">
          <img src="slide1.jpg" class="h-full w-full object-cover" />
        </tolle-aspect-ratio>
      </div>
      <div tolle-carousel-item>
        <tolle-aspect-ratio [ratio]="16 / 9">
          <img src="slide2.jpg" class="h-full w-full object-cover" />
        </tolle-aspect-ratio>
      </div>
      <div tolle-carousel-item>
        <tolle-aspect-ratio [ratio]="16 / 9">
          <img src="slide3.jpg" class="h-full w-full object-cover" />
        </tolle-aspect-ratio>
      </div>
    </div>
  </div>
</tolle-carousel>
```

## Aspect Ratio with Custom Content

### Custom HTML Content

```html
<tolle-aspect-ratio [ratio]="16 / 9">
  <div class="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
    <div class="text-center">
      <h3 class="text-2xl font-bold">Video Title</h3>
      <p class="mt-2">Watch now</p>
    </div>
  </div>
</tolle-aspect-ratio>
```

### Video Player Placeholder

```html
<tolle-aspect-ratio [ratio]="16 / 9">
  <div class="h-full w-full bg-black flex items-center justify-center">
    <button class="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
      <i class="ri-play-fill text-2xl"></i>
    </button>
  </div>
</tolle-aspect-ratio>
```

## Aspect Ratio in Grid Layout

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <tolle-aspect-ratio [ratio]="16 / 9">
    <img src="item1.jpg" class="h-full w-full object-cover" />
  </tolle-aspect-ratio>
  <tolle-aspect-ratio [ratio]="16 / 9">
    <img src="item2.jpg" class="h-full w-full object-cover" />
  </tolle-aspect-ratio>
  <tolle-aspect-ratio [ratio]="16 / 9">
    <img src="item3.jpg" class="h-full w-full object-cover" />
  </tolle-aspect-ratio>
</div>
```

## Aspect Ratio with Skeleton

### Loading State

```html
<div *ngIf="!imageLoaded; else loadedImage">
  <tolle-aspect-ratio [ratio]="16 / 9">
    <tolle-skeleton class="h-full w-full rounded-lg"></tolle-skeleton>
  </tolle-aspect-ratio>
</div>

<ng-template #loadedImage>
  <tolle-aspect-ratio [ratio]="16 / 9">
    <img src="image.jpg" class="h-full w-full object-cover" />
  </tolle-aspect-ratio>
</ng-template>
```

## Aspect Ratio with Rounded Corners

```html
<tolle-aspect-ratio [ratio]="16 / 9">
  <img
    src="image.jpg"
    class="h-full w-full object-cover rounded-lg"
  />
</tolle-aspect-ratio>
```

## Aspect Ratio in Modal

```html
<tolle-alert-dialog-content>
  <tolle-aspect-ratio [ratio]="16 / 9">
    <img
      src="preview.jpg"
      class="h-full w-full object-cover rounded-t-lg"
    />
  </tolle-aspect-ratio>
  <div class="px-6 pb-6 pt-4">
    <h3 class="text-lg font-semibold">Image Preview</h3>
    <p class="text-muted-foreground mt-2">Full-size preview of your uploaded image.</p>
  </div>
</tolle-alert-dialog-content>
```
