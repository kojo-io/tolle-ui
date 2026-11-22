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
  selector: 'app-alignment-carousel',
  imports: [
    CarouselComponent,
    CarouselContentDirective,
    CarouselContainerDirective,
    CarouselItemDirective,
    CarouselPreviousDirective,
    CarouselNextDirective,
  ],
  template: `
    <div class="space-y-12">
      <!-- Center -->
      <div class="group relative mx-auto max-w-2xl">
        <p
          class="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Center Alignment
        </p>
        <tolle-carousel (api)="onApiCenter($event)" [opts]="{ align: 'center' }" class="w-full">
          <div tolleCarouselContent>
            <div tolleCarouselContainer>
              @for (item of [1, 2, 3, 4, 5]; track item) {
                <div tolleCarouselItem class="basis-[80%] md:basis-[70%]">
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
        <div class="mt-4 flex justify-center gap-2">
          @for (snap of centerSnaps; track snap; let i = $index) {
            <button
              (click)="centerApi?.scrollTo(i)"
              [class]="
                'h-2 w-2 rounded-full transition-all duration-300 ' +
                (centerIndex === i ? 'w-4 bg-primary' : 'bg-neutral-300 dark:bg-neutral-700')
              "></button>
          }
        </div>
      </div>

      <!-- End -->
      <div class="group relative mx-auto max-w-2xl">
        <p
          class="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          End Alignment
        </p>
        <tolle-carousel (api)="onApiEnd($event)" [opts]="{ align: 'end' }" class="w-full">
          <div tolleCarouselContent>
            <div tolleCarouselContainer>
              @for (item of [1, 2, 3, 4, 5]; track item) {
                <div tolleCarouselItem class="basis-[80%] md:basis-[70%]">
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
        <div class="mt-4 flex justify-center gap-2">
          @for (snap of endSnaps; track snap; let i = $index) {
            <button
              (click)="endApi?.scrollTo(i)"
              [class]="
                'h-2 w-2 rounded-full transition-all duration-300 ' +
                (endIndex === i ? 'w-4 bg-primary' : 'bg-neutral-300 dark:bg-neutral-700')
              "></button>
          }
        </div>
      </div>
    </div>
  `,
})
export class AlignmentCarouselComponent {
  centerApi?: any;
  centerSnaps: number[] = [];
  centerIndex = 0;

  endApi?: any;
  endSnaps: number[] = [];
  endIndex = 0;

  onApiCenter(api: any) {
    this.centerApi = api;
    this.centerSnaps = api.scrollSnapList();
    this.centerIndex = api.selectedScrollSnap();
    api.on('select', () => (this.centerIndex = api.selectedScrollSnap()));
  }

  onApiEnd(api: any) {
    this.endApi = api;
    this.endSnaps = api.scrollSnapList();
    this.endIndex = api.selectedScrollSnap();
    api.on('select', () => (this.endIndex = api.selectedScrollSnap()));
  }
}
