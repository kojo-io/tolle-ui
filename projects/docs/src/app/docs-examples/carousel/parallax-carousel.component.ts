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
  selector: 'app-parallax-carousel',
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
      <tolle-carousel (api)="onApi($event)" [opts]="{ dragFree: true, loop: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            @for (item of [1, 2, 3, 4, 5]; track item) {
              <div tolleCarouselItem class="basis-[80%] md:basis-[70%]">
                <div class="p-2">
                  <div
                    class="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900">
                    <!-- Parallax Content -->
                    <div
                      class="parallax__layer pointer-events-none absolute inset-0 flex items-center justify-center"
                      [style.transform]="'translateX(' + parallaxValues[item - 1] + '%)'">
                      <span
                        class="select-none text-[12rem] font-bold text-neutral-400 opacity-10 dark:text-neutral-600"
                        >{{ item }}</span
                      >
                    </div>
                    <span
                      class="relative z-10 text-3xl font-bold text-neutral-600 dark:text-neutral-400"
                      >Slide {{ item }}</span
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
export class ParallaxCarouselComponent {
  api?: any;
  scrollSnaps: number[] = [];
  selectedIndex = 0;
  parallaxValues: number[] = [0, 0, 0, 0, 0];
  TWEEN_FACTOR = 1.2;

  constructor(private cdr: ChangeDetectorRef) {}

  onApi(api: EmblaCarouselType) {
    this.api = api;
    this.scrollSnaps = api.scrollSnapList();
    this.selectedIndex = api.selectedScrollSnap();

    api.on('scroll', () => {
      const engine = api.internalEngine();
      const scrollProgress = api.scrollProgress();

      api.scrollSnapList().forEach((scrollSnap, index) => {
        let diffToTarget = scrollSnap - scrollProgress;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach(loopPoint => {
            const target = loopPoint.target();
            if (loopPoint.index === index) {
              if (diffToTarget > 0.5) diffToTarget -= 1;
              if (diffToTarget < -0.5) diffToTarget += 1;
            }
          });
        }

        const parallax = diffToTarget * -1 * 100 * this.TWEEN_FACTOR;
        this.parallaxValues[index] = parallax;
      });
      this.cdr.detectChanges();
    });

    api.on('select', () => (this.selectedIndex = api.selectedScrollSnap()));
    api.on('reInit', () => {
      this.scrollSnaps = api.scrollSnapList();
      this.selectedIndex = api.selectedScrollSnap();
    });
  }

  scrollTo(index: number) {
    this.api?.scrollTo(index);
  }
}
