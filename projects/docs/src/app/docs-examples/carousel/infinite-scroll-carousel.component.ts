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

@Component({
  selector: 'app-infinite-scroll-carousel',
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
      <tolle-carousel (api)="onApi($event)" [opts]="{ dragFree: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            @for (item of slides; track item; let i = $index) {
              <div tolleCarouselItem class="basis-[80%] md:basis-[48%]">
                <div class="p-2">
                  <div
                    class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950">
                    <span
                      class="select-none text-6xl font-bold text-neutral-200 dark:text-neutral-800"
                      >{{ i + 1 }}</span
                    >
                  </div>
                </div>
              </div>
            }

            <!-- Loading Indicator -->
            @if (loading) {
              <div tolleCarouselItem class="basis-[80%] md:basis-[48%]">
                <div class="p-2">
                  <div
                    class="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 transition-all duration-300 dark:bg-primary/5">
                    <div class="flex flex-col items-center gap-3">
                      <i class="ri-loader-4-line animate-spin text-4xl text-primary/60"></i>
                      <span class="text-xs font-semibold uppercase tracking-widest text-primary/40"
                        >Fetching data</span
                      >
                    </div>
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
      <p class="mt-4 text-center text-xs italic text-muted-foreground">
        Scroll to the end to load more slides...
      </p>
    </div>
  `,
})
export class InfiniteScrollCarouselComponent {
  api?: any;
  scrollSnaps: number[] = [];
  selectedIndex = 0;
  slides = Array.from({ length: 10 });
  loading = false;
  hasMore = true;

  constructor(private cdr: ChangeDetectorRef) {}

  onApi(api: EmblaCarouselType) {
    this.api = api;
    this.scrollSnaps = api.scrollSnapList();
    this.selectedIndex = api.selectedScrollSnap();

    const checkScroll = () => {
      if (this.loading || !this.hasMore) return;
      const scrollProgress = api.scrollProgress();

      if (scrollProgress > 0.9) {
        this.loadMore();
      }
      this.selectedIndex = api.selectedScrollSnap();
      this.cdr.detectChanges();
    };

    api.on('scroll', checkScroll);
    api.on('select', () => {
      this.selectedIndex = api.selectedScrollSnap();
      this.cdr.detectChanges();
    });
    api.on('reInit', () => {
      this.scrollSnaps = api.scrollSnapList();
      this.selectedIndex = api.selectedScrollSnap();
      this.cdr.detectChanges();
    });
  }

  loadMore() {
    this.loading = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      const nextBatch = Array.from({ length: 5 });
      this.slides = [...this.slides, ...nextBatch];
      this.loading = false;

      if (this.slides.length > 50) {
        this.hasMore = false;
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  scrollTo(index: number) {
    this.api?.scrollTo(index);
  }
}
