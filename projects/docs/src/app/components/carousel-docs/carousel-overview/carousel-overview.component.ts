import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-carousel-overview',
    imports: [CommonModule],
    template: `
    <header class="mb-12 border-b border-slate-200 pb-8">
      <h1 class="text-4xl font-extrabold tracking-tight mb-4 text-foreground">
        Carousel
      </h1>
      <p class="text-lg text-muted-foreground">
        A motion and touch compatible carousel component built using Embla Carousel core.
      </p>
    </header>

    <section class="mb-16">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Introduction</h2>
      <p class="mb-6">
        The <code>tolle-carousel</code> provides a flexible way to create carousels with custom navigation and content. 
        It exposes the direct Embla Carousel API for advanced configurations.
      </p>
    </section>
  `
})
export class CarouselOverviewComponent { }
