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
    selector: 'app-infinite-scroll-carousel',
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
      <tolle-carousel (api)="onApi($event)" [opts]="{ dragFree: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of slides; let i = index" tolleCarouselItem class="basis-[80%] md:basis-[48%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ i + 1 }}</span>
                </div>
              </div>
            </div>
            
            <!-- Loading Indicator -->
            <div *ngIf="loading" tolleCarouselItem class="basis-[80%] md:basis-[48%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-primary/30 p-4 bg-primary/5 dark:bg-primary/5 transition-all duration-300">
                  <div class="flex flex-col items-center gap-3">
                    <i class="ri-loader-4-line animate-spin text-4xl text-primary/60"></i>
                    <span class="text-xs font-semibold text-primary/40 uppercase tracking-widest">Fetching data</span>
                  </div>
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
      <p class="text-center text-xs text-muted-foreground mt-4 italic">Scroll to the end to load more slides...</p>
    </div>
  `
})
export class InfiniteScrollCarouselComponent {
  api?: any;
  scrollSnaps: number[] = [];
  selectedIndex = 0;
  slides = Array.from({ length: 10 });
  loading = false;
  hasMore = true;

  constructor(private cdr: ChangeDetectorRef) { }

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
