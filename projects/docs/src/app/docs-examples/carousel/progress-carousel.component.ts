import { Component, ChangeDetectorRef } from '@angular/core';

import { EmblaCarouselType } from 'embla-carousel';
import {
  CarouselComponent,
  CarouselContentDirective,
  CarouselContainerDirective,
  CarouselItemDirective,
  CarouselPreviousDirective,
  CarouselNextDirective,
} from '../../../../../tolle/src/lib/carousel';
import { ProgressComponent } from '../../../../../tolle/src/lib/progress.component';

@Component({
  selector: 'app-progress-carousel',
  imports: [
    CarouselComponent,
    CarouselContentDirective,
    CarouselContainerDirective,
    CarouselItemDirective,
    CarouselPreviousDirective,
    CarouselNextDirective,
    ProgressComponent,
  ],
  template: `
    <div class="group mx-auto max-w-2xl space-y-6">
      <div class="relative">
        <tolle-carousel (api)="onApi($event)" [opts]="{ dragFree: true }" class="w-full">
          <div tolleCarouselContent>
            <div tolleCarouselContainer>
              @for (item of [1, 2, 3, 4, 5, 6, 7, 8]; track item) {
                <div tolleCarouselItem class="basis-[80%] md:basis-[48%]">
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
            class="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-600 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-white disabled:opacity-30 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900">
            <i class="ri-arrow-left-s-line text-xl"></i>
          </button>
          <button
            tolleCarouselNext
            class="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-600 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-white disabled:opacity-30 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900">
            <i class="ri-arrow-right-s-line text-xl"></i>
          </button>
        </tolle-carousel>
      </div>

      <div class="space-y-4">
        <!-- Progress Bar -->
        <tolle-progress
          [value]="progress"
          class="bg-neutral-100 dark:bg-neutral-800"></tolle-progress>

        <!-- Dots -->
        <div class="flex justify-center gap-2">
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
    </div>
  `,
})
export class ProgressCarouselComponent {
  api?: any;
  progress = 0;
  scrollSnaps: number[] = [];
  selectedIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  onApi(api: EmblaCarouselType) {
    this.api = api;
    this.scrollSnaps = api.scrollSnapList();
    this.selectedIndex = api.selectedScrollSnap();

    const update = () => {
      this.progress = Math.max(0, Math.min(1, api.scrollProgress())) * 100;
      this.selectedIndex = api.selectedScrollSnap();
      this.cdr.detectChanges();
    };

    api.on('scroll', update);
    api.on('select', update);
    api.on('reInit', () => {
      this.scrollSnaps = api.scrollSnapList();
      update();
    });
    update();
  }

  scrollTo(index: number) {
    this.api?.scrollTo(index);
  }
}
