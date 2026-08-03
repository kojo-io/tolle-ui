import { Component } from '@angular/core';

import {
  CarouselComponent,
  CarouselContentDirective,
  CarouselContainerDirective,
  CarouselItemDirective,
  CarouselPreviousDirective,
  CarouselNextDirective,
} from '../../../../../tolle/src/lib/carousel';

@Component({
  selector: 'app-vertical-carousel',
  imports: [
    CarouselComponent,
    CarouselContentDirective,
    CarouselContainerDirective,
    CarouselItemDirective,
    CarouselPreviousDirective,
    CarouselNextDirective,
  ],
  template: `
    <div class="group relative mx-auto flex max-w-2xl flex-col items-center">
      <tolle-carousel
        (api)="onApi($event)"
        orientation="vertical"
        [opts]="{ align: 'start', loop: true }"
        class="w-full">
        <div tolleCarouselContent class="h-[400px]">
          <div tolleCarouselContainer>
            @for (item of [1, 2, 3, 4, 5]; track item) {
              <div tolleCarouselItem class="basis-[70%]">
                <div class="p-2">
                  <div
                    class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950">
                    <span
                      class="select-none text-6xl font-bold text-neutral-200 dark:text-neutral-800"
                      >{{ item }}</span
                    >
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <button
          tolleCarouselPrevious
          class="absolute left-1/2 top-4 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-600 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-white disabled:opacity-30 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900">
          <i class="ri-arrow-up-s-line text-xl"></i>
        </button>
        <button
          tolleCarouselNext
          class="absolute bottom-4 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-600 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-white disabled:opacity-30 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900">
          <i class="ri-arrow-down-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <div
        class="absolute -right-8 top-1/2 flex h-full -translate-y-1/2 flex-col justify-center gap-2 py-12">
        @for (snap of scrollSnaps; track snap; let i = $index) {
          <button
            (click)="scrollTo(i)"
            [class]="
              'w-2 transition-all duration-300 ' +
              (selectedIndex === i
                ? 'h-4 rounded-full bg-primary'
                : 'h-2 rounded-full bg-neutral-300 dark:bg-neutral-700')
            "
            [attr.aria-label]="'Go to slide ' + (i + 1)"></button>
        }
      </div>
    </div>
  `,
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
