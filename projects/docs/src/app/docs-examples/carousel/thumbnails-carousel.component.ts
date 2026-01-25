import { Component, AfterViewInit, ViewChild } from '@angular/core';
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
  selector: 'app-thumbnails-carousel',
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
    <div class="space-y-6 max-w-3xl mx-auto group">
      <!-- Main Carousel -->
      <tolle-carousel (api)="onMainApi($event)" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            <div *ngFor="let item of [1, 2, 3, 4, 5]" tolleCarouselItem class="basis-[90%]">
              <div class="p-2">
                <div class="flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-300">
                  <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button tolleCarouselPrevious class="absolute left-6 top-[37%] -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <button tolleCarouselNext class="absolute right-6 top-[37%] -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30">
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>
      </tolle-carousel>

      <!-- Thumbnails Carousel -->
      <div class="px-2">
        <tolle-carousel (api)="onThumbApi($event)" [opts]="{ containScroll: 'keepSnaps', dragFree: true }" class="w-full">
          <div tolleCarouselContent>
            <div tolleCarouselContainer class="flex -ml-3">
              <div *ngFor="let item of [1, 2, 3, 4, 5]; let i = index" 
                  tolleCarouselItem 
                  class="basis-1/4 md:basis-1/5 pl-3 cursor-pointer"
                  (click)="onThumbClick(i)">
                <div [class]="'flex aspect-square items-center justify-center rounded-xl border-2 transition-all duration-300 ' + (selectedIndex === i ? 'border-primary bg-primary/5' : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 opacity-40 hover:opacity-100')">
                  <span [class]="'text-2xl font-bold transition-colors ' + (selectedIndex === i ? 'text-primary' : 'text-neutral-300 dark:text-neutral-700')">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </tolle-carousel>
      </div>
    </div>
  `
})
export class ThumbnailsCarouselComponent {
  mainApi?: EmblaCarouselType;
  thumbApi?: EmblaCarouselType;
  selectedIndex = 0;

  onMainApi(api: EmblaCarouselType) {
    this.mainApi = api;
    this.mainApi.on('select', () => {
      this.selectedIndex = this.mainApi!.selectedScrollSnap();
      this.thumbApi?.scrollTo(this.selectedIndex);
    });
  }

  onThumbApi(api: EmblaCarouselType) {
    this.thumbApi = api;
  }

  onThumbClick(index: number) {
    this.mainApi?.scrollTo(index);
  }
}
