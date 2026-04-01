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

### Alignment Carousel

```html
<div class="space-y-12">
      <!-- Center -->
      <div class="relative max-w-2xl mx-auto group">
        <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 text-center">Center Alignment</p>
        <tolle-carousel (api)="onApiCenter($event)" [opts]="{ align: 'center' }" class="w-full">
          <div tolleCarouselContent>
            <div tolleCarouselContainer>
              <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
                <div class="p-2">
                  <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                    <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
            <i class="ri-arrow-left-s-line text-xl"></i>
          </button>
          <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
            <i class="ri-arrow-right-s-line text-xl"></i>
          </button>
        </tolle-carousel>
        <div class="flex justify-center gap-2 mt-4">
          <button *ngFor="let snap of centerSnaps; let i = index" (click)="centerApi?.scrollTo(i)"
                  [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (centerIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"></button>
        </div>
      </div>

      <!-- End -->
      <div class="relative max-w-2xl mx-auto group">
        <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 text-center">End Alignment</p>
        <tolle-carousel (api)="onApiEnd($event)" [opts]="{ align: 'end' }" class="w-full">
          <div tolleCarouselContent>
            <div tolleCarouselContainer>
              <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
                <div class="p-2">
                  <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                    <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
            <i class="ri-arrow-left-s-line text-xl"></i>
          </button>
          <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
            <i class="ri-arrow-right-s-line text-xl"></i>
          </button>
        </tolle-carousel>
        <div class="flex justify-center gap-2 mt-4">
          <button *ngFor="let snap of endSnaps; let i = index" (click)="endApi?.scrollTo(i)"
                  [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (endIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"></button>
        </div>
      </div>
    </div>
```

### Auto Scroll Carousel

```html
<div class="relative max-w-3xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [plugins]="plugins" [opts]="{ loop: true, dragFree: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5, 6, 7, 8]" tolleCarouselItem class="basis-[45%] md:basis-[31%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-4xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

### Autoplay Carousel

```html
<div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [plugins]="plugins" [opts]="{ loop: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

### Basic Carousel

```html
<div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation Buttons -->
        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <!-- Dots -->
      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

### Class Names Carousel

```html
<div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [plugins]="plugins" [opts]="{ loop: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5, 6]" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
              <div class="p-2">
                <div class="embla__slide_class flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-all duration-300">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>

    <style>
      :host ::ng-deep .embla__slide_class.is-selected {
        border-color: #7c3aed;
        background-color: rgba(124, 58, 237, 0.05);
        transform: scale(1.05);
      }
      :host ::ng-deep .embla__slide_class.is-selected span {
        color: #7c3aed;
      }
    </style>
```

### Fade Carousel

```html
<div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [plugins]="plugins" [opts]="{ loop: true, duration: 0 }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-full">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

### Infinite Scroll Carousel

```html
<div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [opts]="{ dragFree: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of slides; let i = index" tolleCarouselItem class="basis-[80%] md:basis-[48%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ i + 1 }}</span>
                </div>
              </div>
            </div>
            
            <!-- Loading Indicator -->
            <div *ngIf="loading" tolleCarouselItem class="basis-[80%] md:basis-[48%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-primary/30 p-4 bg-primary/5 dark:bg-primary/5 transition-all duration-300">
                  <div class="flex flex-col items-center gap-3">
                    <i class="ri-loader-4-line animate-spin text-4xl text-primary/60"></i>
                    <span class="text-xs font-semibold text-primary/40 uppercase tracking-widest">Fetching data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
      <p class="text-center text-xs text-muted-foreground mt-4 italic">Scroll to the end to load more slides...</p>
    </div>
```

### Lazy Load Carousel

```html
<div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of slides; let i = index" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
              <div class="p-2">
                <div class="relative flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm transition-all duration-300">
                  <img *ngIf="loadedSlides.has(i)" 
                       [src]="'https://images.unsplash.com/photo-' + (seeds[i]) + '?auto=format&fit=crop&q=80&w=800'" 
                       class="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
                       (load)="onImageLoad(i)"
                       [class.opacity-0]="!imagesReady.has(i)"
                       [class.scale-110]="!imagesReady.has(i)"
                       [class.scale-100]="imagesReady.has(i)">
                  
                  <div *ngIf="!imagesReady.has(i)" class="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
                    <div class="flex flex-col items-center gap-2">
                      <i class="ri-loader-4-line animate-spin text-3xl text-primary/40"></i>
                      <span class="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Loading asset</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

### Loop Carousel

```html
<div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [opts]="{ loop: true, dragFree: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

### Multiple Carousel

```html
<div class="relative max-w-3xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [opts]="{ align: 'start', slidesToScroll: 'auto' }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5, 6, 7, 8]" tolleCarouselItem class="basis-[45%] md:basis-[31%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-4xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

### Opacity Carousel

```html
<div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [opts]="{ loop: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-all duration-300"
                     [style.opacity]="opacityValues[item-1]">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

### Parallax Carousel

```html
<div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [opts]="{ dragFree: true, loop: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
              <div class="p-2">
                <div class="relative flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm transition-all duration-300">
                  <!-- Parallax Content -->
                  <div class="parallax__layer absolute inset-0 flex items-center justify-center pointer-events-none" [style.transform]="'translateX(' + parallaxValues[item-1] + '%)'">
                    <span class="text-[12rem] font-bold opacity-10 select-none text-neutral-400 dark:text-neutral-600">{{ item }}</span>
                  </div>
                  <span class="relative text-3xl font-bold z-10 text-neutral-600 dark:text-neutral-400">Slide {{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

### Progress Carousel

```html
<div class="space-y-6 max-w-2xl mx-auto group">
      <div class="relative">
        <tolle-carousel (api)="onApi($event)" [opts]="{ dragFree: true }" class="w-full">
          <div tolleCarouselContent>
            <div tolleCarouselContainer>
              <div *ngFor="let item of [1, 2, 3, 4, 5, 6, 7, 8]" tolleCarouselItem class="basis-[80%] md:basis-[48%]">
                <div class="p-2">
                  <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                    <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
            <i class="ri-arrow-left-s-line text-xl"></i>
          </button>
          <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
            <i class="ri-arrow-right-s-line text-xl"></i>
          </button>
        </tolle-carousel>
      </div>

      <div class="space-y-4">
        <!-- Progress Bar -->
        <tolle-progress [value]="progress" class="bg-neutral-100 dark:bg-neutral-800"></tolle-progress>

        <!-- Dots -->
        <div class="flex justify-center gap-2">
          <button *ngFor="let snap of scrollSnaps; let i = index"
                  (click)="scrollTo(i)"
                  [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                  [attr.aria-label]="'Go to slide ' + (i + 1)">
          </button>
        </div>
      </div>
    </div>
```

### Rtl Carousel

```html
<div dir="rtl" class="relative max-w-2xl mx-auto group">
        <tolle-carousel (api)="onApi($event)" [opts]="{ direction: 'rtl' }" class="w-full">
        <div tolleCarouselContent>
            <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
                <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                    <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
                </div>
            </div>
            </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
            <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
            <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        </tolle-carousel>

        <div class="flex justify-center gap-2 mt-4">
          <button *ngFor="let snap of scrollSnaps; let i = index"
                  (click)="scrollTo(i)"
                  [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                  [attr.aria-label]="'Go to slide ' + (i + 1)">
          </button>
        </div>
    </div>
```

### Scale Carousel

```html
<div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [opts]="{ loop: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-all duration-75"
                     [style.transform]="'scale(' + scaleValues[item-1] + ')'">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

### Thumbnails Carousel

```html
<div class="space-y-4 max-w-3xl mx-auto group">
      <!-- Main Carousel -->
      <tolle-carousel (api)="onMainApi($event)" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of images; let i = index" tolleCarouselItem class="basis-full">
              <div class="p-1">
                <div class="relative flex aspect-[16/9] items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 overflow-hidden shadow-sm dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-500">
                  <img [src]="item" class="absolute inset-0 w-full h-full object-cover">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                  <div class="absolute bottom-6 left-6 right-6">
                    <h4 class="text-white text-xl font-bold mb-1">Slide {{ i + 1 }}</h4>
                    <p class="text-white/80 text-sm">Description for beautiful landscape {{ i + 1 }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button tolleCarouselPrevious class="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full border border-neutral-200 bg-white/90 backdrop-blur-md text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/90 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 -translate-x-2 group-hover:translate-x-0">
          <i class="ri-arrow-left-s-line text-2xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full border border-neutral-200 bg-white/90 backdrop-blur-md text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/90 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 translate-x-2 group-hover:translate-x-0">
          <i class="ri-arrow-right-s-line text-2xl"></i>
        </button>
      </tolle-carousel>

      <!-- Thumbnails Carousel -->
      <div class="px-1">
        <tolle-carousel (api)="onThumbApi($event)" [opts]="{ containScroll: 'keepSnaps', dragFree: true }" class="w-full">
          <div tolleCarouselContent>
            <div tolleCarouselContainer class="flex -ml-2">
              <div *ngFor="let item of images; let i = index"
                  tolleCarouselItem
                  class="basis-1/4 md:basis-[18%] pl-2 cursor-pointer"
                  (click)="onThumbClick(i)">
                <div [class]="'relative flex aspect-[4/3] items-center justify-center rounded-xl overflow-hidden border-2 transition-all duration-300 ' + (selectedIndex === i ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100')">
                  <img [src]="item" class="absolute inset-0 w-full h-full object-cover">
                  <div *ngIf="selectedIndex === i" class="absolute inset-0 bg-primary/10"></div>
                </div>
              </div>
            </div>
          </div>
        </tolle-carousel>
      </div>
    </div>
```

### Variable Width Carousel

```html
<div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [opts]="{ align: 'start' }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div tolleCarouselItem class="basis-[60%] pl-4">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-4xl font-bold text-neutral-200 dark:text-neutral-800 select-none italic">60%</span>
                </div>
              </div>
            </div>
            <div tolleCarouselItem class="basis-[30%] pl-4">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-4xl font-bold text-neutral-200 dark:text-neutral-800 select-none italic">30%</span>
                </div>
              </div>
            </div>
            <div tolleCarouselItem class="basis-[50%] pl-4">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-4xl font-bold text-neutral-200 dark:text-neutral-800 select-none italic">50%</span>
                </div>
              </div>
            </div>
            <div tolleCarouselItem class="basis-[40%] pl-4">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-4xl font-bold text-neutral-200 dark:text-neutral-800 select-none italic">40%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

### Vertical Carousel

```html
<div class="relative max-w-2xl mx-auto group flex flex-col items-center">
      <tolle-carousel (api)="onApi($event)" orientation="vertical" [opts]="{ align: 'start', loop: true }" class="w-full">
        <div tolleCarouselContent class="h-[400px]">
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[70%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 z-10">
          <i class="ri-arrow-up-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 z-10">
          <i class="ri-arrow-down-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div class="flex flex-col justify-center gap-2 absolute -right-8 top-1/2 -translate-y-1/2 h-full py-12">
        <button *ngFor="let snap of scrollSnaps; let i = index"
                (click)="scrollTo(i)"
                [class]="'w-2 transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary h-4 rounded-full' : 'bg-neutral-300 dark:bg-neutral-700 h-2 rounded-full')"
                [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </div>
```

