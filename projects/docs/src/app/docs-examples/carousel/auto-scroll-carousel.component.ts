import { Component } from '@angular/core';

import AutoScroll from 'embla-carousel-auto-scroll';
import {
  CarouselComponent,
  CarouselContentDirective,
  CarouselContainerDirective,
  CarouselItemDirective,
} from '../../../../../tolle/src/lib/carousel';

@Component({
  selector: 'app-auto-scroll-carousel',
  imports: [
    CarouselComponent,
    CarouselContentDirective,
    CarouselContainerDirective,
    CarouselItemDirective,
  ],
  template: `
    <div class="group relative mx-auto max-w-3xl">
      <tolle-carousel
        (api)="onApi($event)"
        [plugins]="plugins"
        [opts]="{ loop: true, dragFree: true }"
        class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            @for (item of [1, 2, 3, 4, 5, 6, 7, 8]; track item) {
              <div tolleCarouselItem class="basis-[45%] md:basis-[31%]">
                <div class="p-2">
                  <div
                    class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950">
                    <span
                      class="select-none text-4xl font-bold text-neutral-200 dark:text-neutral-800"
                      >{{ item }}</span
                    >
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </tolle-carousel>

      <div class="mt-4 flex justify-center gap-2">
        @for (snap of scrollSnaps; track snap; let i = $index) {
          <button
            (click)="scrollTo(i)"
            [class]="
              'h-2 w-2 rounded-full transition-all duration-300 ' +
              (selectedIndex === i ? 'w-4 bg-primary' : 'bg-neutral-300 dark:bg-neutral-700')
            "
            [attr.aria-label]="'Go to slide ' + (i + 1)"></button>
        }
      </div>
    </div>
  `,
})
export class AutoScrollCarouselComponent {
  api?: any;
  scrollSnaps: number[] = [];
  selectedIndex = 0;

  plugins = [
    AutoScroll({
      speed: 1,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  ];

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
