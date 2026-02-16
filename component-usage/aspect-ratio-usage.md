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
| `ratio` | `number` | `1` | Aspect ratio (width/height) |

## Basic Usage

### Square Aspect Ratio (1:1)

```html
<aspect-ratio-component [ratio]="1" class="w-full">
  <img
    src="image.jpg"
    alt="Square image"
    class="h-full w-full object-cover"
  />
</aspect-ratio-component>
```

### Landscape Aspect Ratio (16:9)

```html
<aspect-ratio-component [ratio]="16 / 9" class="w-full">
  <img
    src="video-thumbnail.jpg"
    alt="Video thumbnail"
    class="h-full w-full object-cover"
  />
</aspect-ratio-component>
```

### Portrait Aspect Ratio (9:16)

```html
<aspect-ratio-component [ratio]="9 / 16" class="w-64">
  <img
    src="portrait.jpg"
    alt="Portrait image"
    class="h-full w-full object-cover"
  />
</aspect-ratio-component>
```

## Common Aspect Ratios

### 1:1 (Square)

```html
<aspect-ratio-component [ratio]="1">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>1:1</span>
  </div>
</aspect-ratio-component>
```

### 4:3 (Standard)

```html
<aspect-ratio-component [ratio]="4 / 3">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>4:3</span>
  </div>
</aspect-ratio-component>
```

### 16:9 (Widescreen)

```html
<aspect-ratio-component [ratio]="16 / 9">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>16:9</span>
  </div>
</aspect-ratio-component>
```

### 21:9 (Ultrawide)

```html
<aspect-ratio-component [ratio]="21 / 9">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>21:9</span>
  </div>
</aspect-ratio-component>
```

### 3:4 (Portrait)

```html
<aspect-ratio-component [ratio]="3 / 4">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>3:4</span>
  </div>
</aspect-ratio-component>
```

### 2:3 (Portrait)

```html
<aspect-ratio-component [ratio]="2 / 3">
  <div class="h-full w-full bg-muted flex items-center justify-center">
    <span>2:3</span>
  </div>
</aspect-ratio-component>
```

## Aspect Ratio with Image

### Cover Image

```html
<aspect-ratio-component [ratio]="16 / 9">
  <img
    src="cover.jpg"
    alt="Cover"
    class="h-full w-full object-cover"
  />
</aspect-ratio-component>
```

### Contain Image

```html
<aspect-ratio-component [ratio]="4 / 3">
  <img
    src="logo.png"
    alt="Logo"
    class="h-full w-full object-contain p-4"
  />
</aspect-ratio-component>
```

## Aspect Ratio in Card

### Product Image

```html
<tolle-card class="w-full max-w-sm">
  <aspect-ratio-component [ratio]="4 / 3">
    <img
      src="product.jpg"
      alt="Product"
      class="h-full w-full object-cover"
    />
  </aspect-ratio-component>
  <tolle-card-header>
    <tolle-card-title>Product Name</tolle-card-title>
    <tolle-card-description>$99.99</tolle-card-description>
  </tolle-card-header>
</tolle-card>
```

### User Avatar Card

```html
<tolle-card class="w-full max-w-xs text-center">
  <aspect-ratio-component [ratio]="1">
    <img
      src="avatar.jpg"
      alt="User"
      class="h-full w-full object-cover rounded-t-lg"
    />
  </aspect-ratio-component>
  <tolle-card-header>
    <tolle-card-title>John Doe</tolle-card-title>
    <tolle-card-description>UI Designer</tolle-card-description>
  </tolle-card-header>
</tolle-card>
```

## Aspect Ratio in Carousel

```html
<tolle-carousel>
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem>
        <aspect-ratio-component [ratio]="16 / 9">
          <img src="slide1.jpg" class="h-full w-full object-cover" />
        </aspect-ratio-component>
      </div>
      <div tolleCarouselItem>
        <aspect-ratio-component [ratio]="16 / 9">
          <img src="slide2.jpg" class="h-full w-full object-cover" />
        </aspect-ratio-component>
      </div>
      <div tolleCarouselItem>
        <aspect-ratio-component [ratio]="16 / 9">
          <img src="slide3.jpg" class="h-full w-full object-cover" />
        </aspect-ratio-component>
      </div>
    </div>
  </div>
</tolle-carousel>
```

## Aspect Ratio with Custom Content

### Custom HTML Content

```html
<aspect-ratio-component [ratio]="16 / 9">
  <div class="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
    <div class="text-center">
      <h3 class="text-2xl font-bold">Video Title</h3>
      <p class="mt-2">Watch now</p>
    </div>
  </div>
</aspect-ratio-component>
```

### Video Player Placeholder

```html
<aspect-ratio-component [ratio]="16 / 9">
  <div class="h-full w-full bg-black flex items-center justify-center">
    <button class="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
      <i class="ri-play-fill text-2xl"></i>
    </button>
  </div>
</aspect-ratio-component>
```

## Aspect Ratio in Grid Layout

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <aspect-ratio-component [ratio]="16 / 9">
    <img src="item1.jpg" class="h-full w-full object-cover" />
  </aspect-ratio-component>
  <aspect-ratio-component [ratio]="16 / 9">
    <img src="item2.jpg" class="h-full w-full object-cover" />
  </aspect-ratio-component>
  <aspect-ratio-component [ratio]="16 / 9">
    <img src="item3.jpg" class="h-full w-full object-cover" />
  </aspect-ratio-component>
</div>
```

## Aspect Ratio with Skeleton

### Loading State

```html
<div *ngIf="!imageLoaded; else loadedImage">
  <aspect-ratio-component [ratio]="16 / 9">
    <skeleton-component class="h-full w-full rounded-lg"></skeleton-component>
  </aspect-ratio-component>
</div>

<ng-template #loadedImage>
  <aspect-ratio-component [ratio]="16 / 9">
    <img src="image.jpg" class="h-full w-full object-cover" />
  </aspect-ratio-component>
</ng-template>
```

## Aspect Ratio with Rounded Corners

```html
<aspect-ratio-component [ratio]="16 / 9">
  <img
    src="image.jpg"
    class="h-full w-full object-cover rounded-lg"
  />
</aspect-ratio-component>
```

## Aspect Ratio in Modal

```html
<tolle-alert-dialog-content>
  <aspect-ratio-component [ratio]="16 / 9">
    <img
      src="preview.jpg"
      class="h-full w-full object-cover rounded-t-lg"
    />
  </aspect-ratio-component>
  <div class="px-6 pb-6 pt-4">
    <h3 class="text-lg font-semibold">Image Preview</h3>
    <p class="text-muted-foreground mt-2">Full-size preview of your uploaded image.</p>
  </div>
</tolle-alert-dialog-content>
```
