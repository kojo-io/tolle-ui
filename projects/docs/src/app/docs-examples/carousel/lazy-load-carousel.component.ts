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
    selector: 'app-lazy-load-carousel',
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
      <tolle-carousel (api)="onApi($event)" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of slides; let i = index" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
              <div class="p-2">
                <div class="relative flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm transition-all duration-300">
                  <img *ngIf="loadedSlides.has(i)" 
                       [src]="'https://images.unsplash.com/photo-' + (seeds[i]) + '?auto=format&fit=crop&q=80&w=800'" 
                       class="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
                       (load)="onImageLoad(i)"
                       [class.opacity-0]="!imagesReady.has(i)"
                       [class.scale-110]="!imagesReady.has(i)"
                       [class.scale-100]="imagesReady.has(i)">
                  
                  <div *ngIf="!imagesReady.has(i)" class="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
                    <div class="flex flex-col items-center gap-2">
                      <i class="ri-loader-4-line animate-spin text-3xl text-primary/40"></i>
                      <span class="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Loading asset</span>
                    </div>
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
    </div>
  `
})
export class LazyLoadCarouselComponent {
  api?: any;
  scrollSnaps: number[] = [];
  selectedIndex = 0;
  slides = Array.from({ length: 10 });
  loadedSlides = new Set<number>();
  imagesReady = new Set<number>();
  seeds = [
    '1464822759023-fed622ff2c3b',
    '1501785888041-af3ef285b470',
    '1506744038136-46273834b3fb',
    '1511884642898-4c92249e20b6',
    '1434725039720-abb26e22ebe8',
    '1469474968028-56623f02e42e',
    '1441974231531-c6227db76b6e',
    '1500382017468-9049fee7c9cd',
    '1470071459604-3b5ec3a7fe05',
    '1447752875215-b2761acb3c5d'
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  onApi(api: EmblaCarouselType) {
    this.api = api;
    this.scrollSnaps = api.scrollSnapList();
    this.selectedIndex = api.selectedScrollSnap();

    const update = () => {
      const index = api.selectedScrollSnap();
      const slidesInView = api.slidesInView();

      slidesInView.forEach(i => {
        if (!this.loadedSlides.has(i)) {
          this.loadedSlides.add(i);
        }
      });
      this.selectedIndex = api.selectedScrollSnap();
      this.cdr.detectChanges();
    };

    api.on('select', update);
    api.on('slidesInView', update);
    api.on('reInit', () => {
      this.scrollSnaps = api.scrollSnapList();
      update();
    });
    update();
  }

  onImageLoad(index: number) {
    this.imagesReady.add(index);
    this.cdr.detectChanges();
  }

  scrollTo(index: number) {
    this.api?.scrollTo(index);
  }
}
