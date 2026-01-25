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
      <tolle-carousel (api)="onApi($event)" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of slides; let i = index" tolleCarouselItem class="basis-[80%] md:basis-[70%]">
              <div class="p-2">
                <div class="relative flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm transition-all duration-300">
                  <img *ngIf="loadedSlides.has(i)" 
                       [src]="'https://picsum.photos/seed/' + (i + 10) + '/800/450'" 
                       class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                       (load)="onImageLoad(i)"
                       [class.opacity-0]="!imagesReady.has(i)">
                  
                  <div *ngIf="!imagesReady.has(i)" class="absolute inset-0 flex items-center justify-center">
                    <i class="ri-loader-4-line animate-spin text-4xl text-neutral-300 dark:text-neutral-700"></i>
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
