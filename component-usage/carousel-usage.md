# Carousel Component Usage Guide

## Overview

The Carousel component provides a slide-based content viewer using Embla Carousel. It supports horizontal and vertical orientations with navigation controls.

## Import

```typescript
import {
  CarouselComponent,
  CarouselContentDirective,
  CarouselContainerDirective,
  CarouselItemDirective,
  CarouselPreviousDirective,
  CarouselNextDirective
} from '@tolle_/tolle-ui';
```

## Components

### CarouselComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `opts` | `EmblaOptionsType` | `{}` | Embla carousel options |
| `plugins` | `EmblaPluginType[]` | `[]` | Embla plugins |
| `orientation` | `'horizontal'\|'vertical'` | `'horizontal'` | Carousel orientation |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `api` | `EventEmitter<EmblaCarouselType>` | Emits the Embla API |

### CarouselContentDirective

Selector: `[tolleCarouselContent]`

Container for carousel viewport.

### CarouselContainerDirective

Selector: `[tolleCarouselContainer]`

Container for carousel slides.

### CarouselItemDirective

Selector: `[tolleCarouselItem]`

Individual carousel slide/item.

### CarouselPreviousDirective

Selector: `[tolleCarouselPrevious]`

Previous navigation button.

### CarouselNextDirective

Selector: `[tolleCarouselNext]`

Next navigation button.

## Basic Usage

### Simple Carousel

```html
<tolle-carousel>
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem>
        <img src="slide1.jpg" class="h-64 w-full object-cover rounded-lg" />
      </div>
      <div tolleCarouselItem>
        <img src="slide2.jpg" class="h-64 w-full object-cover rounded-lg" />
      </div>
      <div tolleCarouselItem>
        <img src="slide3.jpg" class="h-64 w-full object-cover rounded-lg" />
      </div>
    </div>
  </div>
</tolle-carousel>
```

### Carousel with Navigation

```html
<tolle-carousel>
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem>
        <div class="h-64 w-full bg-muted rounded-lg flex items-center justify-center">
          Slide 1
        </div>
      </div>
      <div tolleCarouselItem>
        <div class="h-64 w-full bg-muted rounded-lg flex items-center justify-center">
          Slide 2
        </div>
      </div>
      <div tolleCarouselItem>
        <div class="h-64 w-full bg-muted rounded-lg flex items-center justify-center">
          Slide 3
        </div>
      </div>
    </div>
  </div>

  <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background rounded-full shadow">
    <i class="ri-arrow-left-line"></i>
  </button>
  <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background rounded-full shadow">
    <i class="ri-arrow-right-line"></i>
  </button>
</tolle-carousel>
```

## Carousel Options

### Custom Options

```html
<tolle-carousel [opts]="carouselOptions">
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem>Slide 1</div>
      <div tolleCarouselItem>Slide 2</div>
      <div tolleCarouselItem>Slide 3</div>
    </div>
  </div>
</tolle-carousel>
```

```typescript
carouselOptions: EmblaOptionsType = {
  align: 'start',
  loop: true,
  draggable: true,
  dragFree: false,
  containScroll: 'trimSnaps'
};
```

### Autoplay

```html
<tolle-carousel [opts]="{ ...carouselOptions, autoplay: true }">
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem>Slide 1</div>
      <div tolleCarouselItem>Slide 2</div>
    </div>
  </div>
</tolle-carousel>
```

## Carousel Orientations

### Horizontal (Default)

```html
<tolle-carousel orientation="horizontal">
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem>Horizontal Slide 1</div>
      <div tolleCarouselItem>Horizontal Slide 2</div>
    </div>
  </div>
</tolle-carousel>
```

### Vertical

```html
<tolle-carousel orientation="vertical">
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem class="h-48">Vertical Slide 1</div>
      <div tolleCarouselItem class="h-48">Vertical Slide 2</div>
    </div>
  </div>
</tolle-carousel>
```

## Carousel with Dots

### Custom Indicators

```html
<tolle-carousel #carousel>
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem>
        <div class="h-64 w-full bg-muted rounded-lg flex items-center justify-center">
          Slide 1
        </div>
      </div>
      <div tolleCarouselItem>
        <div class="h-64 w-full bg-muted rounded-lg flex items-center justify-center">
          Slide 2
        </div>
      </div>
      <div tolleCarouselItem>
        <div class="h-64 w-full bg-muted rounded-lg flex items-center justify-center">
          Slide 3
        </div>
      </div>
    </div>
  </div>

  <div class="flex gap-2 mt-4 justify-center">
    <button
      *ngFor="let slide of [1, 2, 3]; let i = index"
      [class.bg-primary]="selectedIndex === i"
      [class.bg-muted]="selectedIndex !== i"
      (click)="carousel.slideTo(i)"
      class="h-2 w-8 rounded-full transition-colors"
    ></button>
  </div>
</tolle-carousel>
```

## Carousel with Buttons

### Full Navigation

```html
<tolle-carousel [opts]="{ loop: true }">
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem>
        <img src="slide1.jpg" class="h-64 w-full object-cover rounded-lg" />
      </div>
      <div tolleCarouselItem>
        <img src="slide2.jpg" class="h-64 w-full object-cover rounded-lg" />
      </div>
      <div tolleCarouselItem>
        <img src="slide3.jpg" class="h-64 w-full object-cover rounded-lg" />
      </div>
    </div>
  </div>

  <button tolleCarouselPrevious class="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background">
    <i class="ri-arrow-left-line text-xl"></i>
  </button>
  <button tolleCarouselNext class="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background">
    <i class="ri-arrow-right-line text-xl"></i>
  </button>
</tolle-carousel>
```

## Carousel in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Featured Products</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="p-0">
    <tolle-carousel [opts]="{ align: 'start', loop: true }">
      <div tolleCarouselContent>
        <div tolleCarouselContainer>
          <div tolleCarouselItem class="p-4">
            <tolle-card class="h-full">
              <div class="h-48 overflow-hidden rounded-t-lg">
                <img src="product1.jpg" class="h-full w-full object-cover" />
              </div>
              <tolle-card-content>
                <div class="font-medium">Product 1</div>
                <div class="text-sm text-muted-foreground">$99.99</div>
              </tolle-card-content>
            </tolle-card>
          </div>
          <div tolleCarouselItem class="p-4">
            <tolle-card class="h-full">
              <div class="h-48 overflow-hidden rounded-t-lg">
                <img src="product2.jpg" class="h-full w-full object-cover" />
              </div>
              <tolle-card-content>
                <div class="font-medium">Product 2</div>
                <div class="text-sm text-muted-foreground">$149.99</div>
              </tolle-card-content>
            </tolle-card>
          </div>
        </div>
      </div>
    </tolle-carousel>
  </tolle-card-content>
</tolle-card>
```

## Carousel with API

### Access Embla API

```html
<tolle-carousel (api)="onApiReady($event)">
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem>Slide 1</div>
      <div tolleCarouselItem>Slide 2</div>
    </div>
  </div>
</tolle-carousel>
```

```typescript
emblaApi: EmblaCarouselType | null = null;

onApiReady(api: EmblaCarouselType) {
  this.emblaApi = api;

  // Use API methods
  api.on('select', () => {
    console.log('Slide changed:', api.selectedScrollSnap());
  });

  api.on('reInit', () => {
    console.log('Carousel re-initialized');
  });
}

slideTo(index: number) {
  this.emblaApi?.scrollTo(index);
}

next() {
  this.emblaApi?.scrollNext();
}

prev() {
  this.emblaApi?.scrollPrev();
}
```

## Carousel with Images

### Image Carousel

```html
<tolle-carousel [opts]="{ loop: true, align: 'center' }">
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem>
        <img src="image1.jpg" class="h-80 w-full object-cover rounded-lg" />
      </div>
      <div tolleCarouselItem>
        <img src="image2.jpg" class="h-80 w-full object-cover rounded-lg" />
      </div>
      <div tolleCarouselItem>
        <img src="image3.jpg" class="h-80 w-full object-cover rounded-lg" />
      </div>
    </div>
  </div>

  <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/20 hover:bg-black/30 rounded-full text-white">
    <i class="ri-arrow-left-line"></i>
  </button>
  <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/20 hover:bg-black/30 rounded-full text-white">
    <i class="ri-arrow-right-line"></i>
  </button>
</tolle-carousel>
```

## Carousel with Captions

```html
<tolle-carousel [opts]="{ loop: true }">
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem class="relative">
        <img src="slide1.jpg" class="h-64 w-full object-cover rounded-lg" />
        <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h3 class="font-semibold">Slide Title 1</h3>
          <p class="text-sm">Slide description goes here.</p>
        </div>
      </div>
      <div tolleCarouselItem class="relative">
        <img src="slide2.jpg" class="h-64 w-full object-cover rounded-lg" />
        <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h3 class="font-semibold">Slide Title 2</h3>
          <p class="text-sm">Another slide description.</p>
        </div>
      </div>
    </div>
  </div>
</tolle-carousel>
```

## Carousel Responsive

```html
<tolle-carousel [opts]="responsiveOptions">
  <div tolleCarouselContent>
    <div tolleCarouselContainer>
      <div tolleCarouselItem>
        <div class="h-48 bg-muted rounded-lg flex items-center justify-center">
          Mobile Slide
        </div>
      </div>
      <div tolleCarouselItem>
        <div class="h-64 bg-muted rounded-lg flex items-center justify-center">
          Desktop Slide
        </div>
      </div>
    </div>
  </div>
</tolle-carousel>
```
