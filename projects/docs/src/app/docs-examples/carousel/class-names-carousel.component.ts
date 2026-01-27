import { Component } from '@angular/core';

import ClassNames from 'embla-carousel-class-names';
import {
  CarouselComponent,
  CarouselContentDirective,
  CarouselContainerDirective,
  CarouselItemDirective,
  CarouselPreviousDirective,
  CarouselNextDirective
} from '../../../../../tolle/src/lib/carousel';

@Component({
    selector: 'app-class-names-carousel',
    imports: [
    CarouselComponent,
    CarouselContentDirective,
    CarouselContainerDirective,
    CarouselItemDirective,
    CarouselPreviousDirective,
    CarouselNextDirective
],
    template: `
    <div class="relative max-w-2xl mx-auto group">
      <tolle-carousel (api)="onApi($event)" [plugins]="plugins" [opts]="{ loop: true }" class="w-full">
        <div tolleCarouselContent>
          <div tolleCarouselContainer>
            @for (item of [1, 2, 3, 4, 5, 6]; track item) {
              <div tolleCarouselItem class="basis-[80%] md:basis-[70%]">
                <div class="p-2">
                  <div class="embla__slide_class flex aspect-video items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-all duration-300">
                    <span class="text-6xl font-bold text-neutral-200 dark:text-neutral-800 select-none">{{ item }}</span>
                  </div>
                </div>
              </div>
            }
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
        @for (snap of scrollSnaps; track snap; let i = $index) {
          <button
            (click)="scrollTo(i)"
            [class]="'w-2 h-2 rounded-full transition-all duration-300 ' + (selectedIndex === i ? 'bg-primary w-4' : 'bg-neutral-300 dark:bg-neutral-700')"
            [attr.aria-label]="'Go to slide ' + (i + 1)">
          </button>
        }
      </div>
    </div>
    
    <style>
      :host ::ng-deep .embla__slide_class.is-selected {
      border-color: #7c3aed;
      background-color: rgba(124, 58, 237, 0.05);
      transform: scale(1.05);
    }
    :host ::ng-deep .embla__slide_class.is-selected span {
    color: #7c3aed;
    }
    </style>
    `
})
export class ClassNamesCarouselComponent {
  api?: any;
  scrollSnaps: number[] = [];
  selectedIndex = 0;

  plugins = [
    ClassNames({
      snapped: 'is-selected'
    })
  ];

  onApi(api: any) {
    this.api = api;
    this.scrollSnaps = api.scrollSnapList();
    this.selectedIndex = api.selectedScrollSnap();

    api.on('select', () => {
      this.selectedIndex = api.selectedScrollSnap();
    });

    api.on('reInit', () => {
      this.scrollSnaps = api.scrollSnapList();
      this.selectedIndex = api.selectedScrollSnap();
    });
  }

  scrollTo(index: number) {
    this.api?.scrollTo(index);
  }
}
