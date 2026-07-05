import { Component } from '@angular/core';

import {
  CarouselComponent,
  CarouselContentDirective,
  CarouselContainerDirective,
  CarouselItemDirective,
  CarouselPreviousDirective,
  CarouselNextDirective
} from '../../../../../tolle/src/lib/carousel';

@Component({
    selector: 'app-vertical-carousel',
    imports: [
    CarouselComponent,
    CarouselContentDirective,
    CarouselContainerDirective,
    CarouselItemDirective,
    CarouselPreviousDirective,
    CarouselNextDirective
],
    template: `
    <div class="relative max-w-2xl mx-auto group flex flex-col items-center">
      <tolle-carousel (api)="onApi($event)" orientation="vertical" [opts]="{ align: 'start', loop: true }" class="w-full">
        <div tolleCarouselContent class="h-[400px]">
          <div tolleCarouselContainer>
            @for (item of [1, 2, 3, 4, 5]; track item) {
              <div tolleCarouselItem class="basis-[70%]">
                <div class="p-2">
                  <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                    <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                  </div>
                </div>
              </div>
            }
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
        @for (snap of scrollSnaps; track snap; let i = $index) {
          <button
            (click)="scrollTo(i)"
            [class]="'w-2 transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary h-4 rounded-full' : 'bg-neutral-300 dark:bg-neutral-700 h-2 rounded-full')"
            [attr.aria-label]="'Go to slide ' + (i + 1)">
          </button>
        }
      </div>
    </div>
    `
})
export class VerticalCarouselComponent {
  api?: any;
  scrollSnaps: number[] = [];
  selectedIndex = 0;

  onApi(api: any) {
    this.api = api;
    this.scrollSnaps = api.scrollSnapList();
    this.selectedIndex = api.selectedScrollSnap();

    api.on('select', () => {
      this.selectedIndex = api.selectedScrollSnap();
    });

    api.on('reInit', () => {
      this.scrollSnaps = api.scrollSnapList();
      this.selectedIndex = api.selectedScrollSnap();
    });
  }

  scrollTo(index: number) {
    this.api?.scrollTo(index);
  }
}
