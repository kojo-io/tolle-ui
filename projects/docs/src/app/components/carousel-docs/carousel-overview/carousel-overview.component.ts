import { Component } from '@angular/core';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
    selector: 'app-carousel-overview',
    standalone: true,
    imports: [DocHeroComponent],
    template: `
    <app-doc-hero slug="carousel" description="A motion and touch compatible carousel component built using Embla Carousel core." id="overview" />

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight">Introduction</h2>
      <p class="text-muted-foreground">
        The <code>tolle-carousel</code> provides a flexible way to create carousels with custom navigation and content.
        It exposes the direct Embla Carousel API for advanced configurations.
      </p>
    </section>
  `
})
export class CarouselOverviewComponent { }
