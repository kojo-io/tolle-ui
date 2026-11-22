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
  selector: 'app-variable-width-carousel',
  imports: [
    CarouselComponent,
    CarouselContentDirective,
    CarouselContainerDirective,
    CarouselItemDirective,
    CarouselPreviousDirective,
    CarouselNextDirective,
  ],
  template: `
    <div class="group relative mx-auto max-w-2xl">
      <tolle-carousel (api)="onApi($event)" [opts]="{ align: 'start' }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div tolleCarouselItem class="basis-[60%] pl-4">
              <div class="p-2">
                <div
                  class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950">
                  <span
                    class="select-none text-4xl font-bold italic text-neutral-200 dark:text-neutral-800"
                    >60%</span
                  >
                </div>
              </div>
            </div>
            <div tolleCarouselItem class="basis-[30%] pl-4">
              <div class="p-2">
                <div
                  class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950">
                  <span
                    class="select-none text-4xl font-bold italic text-neutral-200 dark:text-neutral-800"
                    >30%</span
                  >
                </div>
              </div>
            </div>
            <div tolleCarouselItem class="basis-[50%] pl-4">
              <div class="p-2">
                <div
                  class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950">
                  <span
                    class="select-none text-4xl font-bold italic text-neutral-200 dark:text-neutral-800"
                    >50%</span
                  >
                </div>
              </div>
            </div>
            <div tolleCarouselItem class="basis-[40%] pl-4">
              <div class="p-2">
                <div
                  class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950">
                  <span
                    class="select-none text-4xl font-bold italic text-neutral-200 dark:text-neutral-800"
                    >40%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          tolleCarouselPrevious
          class="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-600 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-white disabled:opacity-30 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button
          tolleCarouselNext
          class="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-600 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-white disabled:opacity-30 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
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
export class VariableWidthCarouselComponent {
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
