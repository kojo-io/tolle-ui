import { Component } from '@angular/core';

import { EmblaCarouselType } from 'embla-carousel';
import {
  CarouselComponent,
  CarouselContentDirective,
  CarouselContainerDirective,
  CarouselItemDirective,
  CarouselPreviousDirective,
  CarouselNextDirective,
} from '../../../../../tolle/src/lib/carousel';

@Component({
  selector: 'app-thumbnails-carousel',
  imports: [
    CarouselComponent,
    CarouselContentDirective,
    CarouselContainerDirective,
    CarouselItemDirective,
    CarouselPreviousDirective,
    CarouselNextDirective,
  ],
  template: `
    <div class="group mx-auto max-w-3xl space-y-4">
      <!-- Main Carousel -->
      <tolle-carousel (api)="onMainApi($event)" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            @for (item of images; track item; let i = $index) {
              <div tolleCarouselItem class="basis-full">
                <div class="p-1">
                  <div
                    class="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm transition-all duration-500 dark:border-neutral-800 dark:bg-neutral-900">
                    <img [src]="item" class="absolute inset-0 h-full w-full object-cover" />
                    <div
                      class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-6 left-6 right-6">
                      <h4 class="mb-1 text-xl font-bold text-white">Slide {{ i + 1 }}</h4>
                      <p class="text-sm text-white/80">
                        Description for beautiful landscape {{ i + 1 }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <button
          tolleCarouselPrevious
          class="absolute left-6 top-1/2 flex h-11 w-11 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-600 opacity-0 shadow-xl backdrop-blur-md transition-all hover:bg-white disabled:opacity-30 group-hover:translate-x-0 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-950/90 dark:text-neutral-400 dark:hover:bg-neutral-900">
          <i class="ri-arrow-left-s-line text-2xl"></i>
        </button>
        <button
          tolleCarouselNext
          class="absolute right-6 top-1/2 flex h-11 w-11 -translate-y-1/2 translate-x-2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-600 opacity-0 shadow-xl backdrop-blur-md transition-all hover:bg-white disabled:opacity-30 group-hover:translate-x-0 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-950/90 dark:text-neutral-400 dark:hover:bg-neutral-900">
          <i class="ri-arrow-right-s-line text-2xl"></i>
        </button>
      </tolle-carousel>

      <!-- Thumbnails Carousel -->
      <div class="px-1">
        <tolle-carousel
          (api)="onThumbApi($event)"
          [opts]="{ containScroll: 'keepSnaps', dragFree: true }"
          class="w-full">
          <div tolleCarouselContent>
            <div tolleCarouselContainer class="-ml-2 flex">
              @for (item of images; track item; let i = $index) {
                <div
                  tolleCarouselItem
                  class="basis-1/4 cursor-pointer pl-2 md:basis-[18%]"
                  (click)="onThumbClick(i)">
                  <div
                    [class]="
                      'relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border-2 transition-all duration-300 ' +
                      (selectedIndex === i
                        ? 'scale-[1.02] border-primary ring-2 ring-primary/20'
                        : 'border-transparent opacity-60 hover:opacity-100')
                    ">
                    <img [src]="item" class="absolute inset-0 h-full w-full object-cover" />
                    @if (selectedIndex === i) {
                      <div class="absolute inset-0 bg-primary/10"></div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </tolle-carousel>
      </div>
    </div>
  `,
})
export class ThumbnailsCarouselComponent {
  mainApi?: EmblaCarouselType;
  thumbApi?: EmblaCarouselType;
  selectedIndex = 0;
  images = [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1434725039720-abb26e22ebe8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800',
  ];

  onMainApi(api: EmblaCarouselType) {
    this.mainApi = api;
    this.mainApi.on('select', () => {
      this.selectedIndex = this.mainApi!.selectedScrollSnap();
      this.thumbApi?.scrollTo(this.selectedIndex);
    });
  }

  onThumbApi(api: EmblaCarouselType) {
    this.thumbApi = api;
  }

  onThumbClick(index: number) {
    this.mainApi?.scrollTo(index);
  }
}
