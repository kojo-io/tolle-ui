import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmblaCarouselType } from 'embla-carousel';
import {
  CarouselComponent,
  CarouselContentDirective,
  CarouselContainerDirective,
  CarouselItemDirective,
  CarouselPreviousDirective,
  CarouselNextDirective
} from '../../../../../tolle/src/lib/carousel';

@Component({
  selector: 'app-parallax-carousel',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    CarouselContentDirective,
    CarouselContainerDirective,
    CarouselItemDirective,
    CarouselPreviousDirective,
    CarouselNextDirective
  ],
  template: `
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
  `
})
export class ParallaxCarouselComponent {
  api?: any;
  scrollSnaps: number[] = [];
  selectedIndex = 0;
  parallaxValues: number[] = [0, 0, 0, 0, 0];
  TWEEN_FACTOR = 1.2;

  constructor(private cdr: ChangeDetectorRef) { }

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
          engine.slideLooper.loopPoints.forEach((loopPoint) => {
            const target = loopPoint.target();
            if (loopPoint.index === index) {
              if (diffToTarget > 0.5) diffToTarget -= 1;
              if (diffToTarget < -0.5) diffToTarget += 1;
            }
          });
        }

        const parallax = diffToTarget * (-1) * 100 * this.TWEEN_FACTOR;
        this.parallaxValues[index] = parallax;
      });
      this.cdr.detectChanges();
    });

    api.on('select', () => this.selectedIndex = api.selectedScrollSnap());
    api.on('reInit', () => {
      this.scrollSnaps = api.scrollSnapList();
      this.selectedIndex = api.selectedScrollSnap();
    });
  }

  scrollTo(index: number) {
    this.api?.scrollTo(index);
  }
}
