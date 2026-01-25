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
  selector: 'app-scale-carousel',
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
      <tolle-carousel (api)="onApi($event)" [opts]="{ loop: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-all duration-75"
                     [style.transform]="'scale(' + scaleValues[item-1] + ')'">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
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
export class ScaleCarouselComponent {
  api?: any;
  scrollSnaps: number[] = [];
  selectedIndex = 0;
  scaleValues: number[] = [1, 1, 1, 1, 1];
  TWEEN_FACTOR = 0.5;

  constructor(private cdr: ChangeDetectorRef) { }

  onApi(api: EmblaCarouselType) {
    this.api = api;
    this.scrollSnaps = api.scrollSnapList();
    this.selectedIndex = api.selectedScrollSnap();

    const update = () => {
      const engine = api.internalEngine();
      const scrollProgress = api.scrollProgress();

      api.scrollSnapList().forEach((scrollSnap, index) => {
        let diffToTarget = scrollSnap - scrollProgress;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopPoint) => {
            if (loopPoint.index === index) {
              if (diffToTarget > 0.5) diffToTarget -= 1;
              if (diffToTarget < -0.5) diffToTarget += 1;
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * this.TWEEN_FACTOR);
        this.scaleValues[index] = Math.max(0.7, tweenValue);
      });
      this.selectedIndex = api.selectedScrollSnap();
      this.cdr.detectChanges();
    };

    api.on('scroll', update);
    api.on('reInit', () => {
      this.scrollSnaps = api.scrollSnapList();
      update();
    });
    api.on('select', update);
    update();
  }

  scrollTo(index: number) {
    this.api?.scrollTo(index);
  }
}
