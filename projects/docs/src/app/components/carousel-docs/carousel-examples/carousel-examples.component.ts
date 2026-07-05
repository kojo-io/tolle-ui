import { Component, inject } from '@angular/core';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicCarouselComponent } from '../../../docs-examples/carousel/basic-carousel.component';
import { MultipleCarouselComponent } from '../../../docs-examples/carousel/multiple-carousel.component';
import { VerticalCarouselComponent } from '../../../docs-examples/carousel/vertical-carousel.component';
import { AutoplayCarouselComponent } from '../../../docs-examples/carousel/autoplay-carousel.component';
import { LoopCarouselComponent } from '../../../docs-examples/carousel/loop-carousel.component';
import { ThumbnailsCarouselComponent } from '../../../docs-examples/carousel/thumbnails-carousel.component';
import { AlignmentCarouselComponent } from '../../../docs-examples/carousel/alignment-carousel.component';
import { VariableWidthCarouselComponent } from '../../../docs-examples/carousel/variable-width-carousel.component';
import { RtlCarouselComponent } from '../../../docs-examples/carousel/rtl-carousel.component';
import { AutoScrollCarouselComponent } from '../../../docs-examples/carousel/auto-scroll-carousel.component';
import { FadeCarouselComponent } from '../../../docs-examples/carousel/fade-carousel.component';
import { ClassNamesCarouselComponent } from '../../../docs-examples/carousel/class-names-carousel.component';
import { ParallaxCarouselComponent } from '../../../docs-examples/carousel/parallax-carousel.component';
import { ScaleCarouselComponent } from '../../../docs-examples/carousel/scale-carousel.component';
import { OpacityCarouselComponent } from '../../../docs-examples/carousel/opacity-carousel.component';
import { ProgressCarouselComponent } from '../../../docs-examples/carousel/progress-carousel.component';
import { LazyLoadCarouselComponent } from '../../../docs-examples/carousel/lazy-load-carousel.component';
import { InfiniteScrollCarouselComponent } from '../../../docs-examples/carousel/infinite-scroll-carousel.component';

@Component({
  selector: 'app-carousel-examples',
  standalone: true,
  imports: [
    ComponentPreviewComponent,
    BasicCarouselComponent,
    MultipleCarouselComponent,
    VerticalCarouselComponent,
    AutoplayCarouselComponent,
    LoopCarouselComponent,
    ThumbnailsCarouselComponent,
    AlignmentCarouselComponent,
    VariableWidthCarouselComponent,
    RtlCarouselComponent,
    AutoScrollCarouselComponent,
    FadeCarouselComponent,
    ClassNamesCarouselComponent,
    ParallaxCarouselComponent,
    ScaleCarouselComponent,
    OpacityCarouselComponent,
    ProgressCarouselComponent,
    LazyLoadCarouselComponent,
    InfiniteScrollCarouselComponent
  ],
  template: `
    <section class="mb-16" id="examples">
      <h2 class="mb-6 scroll-m-20 text-xl font-semibold tracking-tight">Examples</h2>

      <div class="space-y-12">
        <div class="space-y-3" id="basic">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Basic</h3>
          <p class="text-muted-foreground">A simple carousel with navigation buttons.</p>
          <app-preview [code]="basicCode" language="typescript">
            <app-basic-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="multiple">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Multiple Slides</h3>
          <p class="text-muted-foreground">Display multiple slides per view and scroll multiple items at once.</p>
          <app-preview [code]="multipleCode" language="typescript">
            <app-multiple-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="alignment">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Alignment</h3>
          <p class="text-muted-foreground">Change the alignment of slides (start, center, end).</p>
          <app-preview [code]="alignmentCode" language="typescript">
            <app-alignment-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="variable-width">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Variable Widths</h3>
          <p class="text-muted-foreground">Slides can have different widths defined in CSS.</p>
          <app-preview [code]="variableWidthCode" language="typescript">
            <app-variable-width-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="rtl">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Right To Left</h3>
          <p class="text-muted-foreground">Support for Right-to-Left directions.</p>
          <app-preview [code]="rtlCode" language="typescript">
            <app-rtl-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="autoplay">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Autoplay</h3>
          <p class="text-muted-foreground">Automatically advance slides using the Autoplay plugin.</p>
          <app-preview [code]="autoplayCode" language="typescript">
            <app-autoplay-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="auto-scroll">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Auto Scroll</h3>
          <p class="text-muted-foreground">Continuous auto-scrolling using the Auto Scroll plugin.</p>
          <app-preview [code]="autoScrollCode" language="typescript">
            <app-auto-scroll-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="fade">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Fade</h3>
          <p class="text-muted-foreground">Cross-fade transition effect using the Fade plugin.</p>
          <app-preview [code]="fadeCode" language="typescript">
            <app-fade-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="class-names">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Class Names</h3>
          <p class="text-muted-foreground">Automatically add classes to slides using the Class Names plugin.</p>
          <app-preview [code]="classNamesCode" language="typescript">
            <app-class-names-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="loop">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Loop & Drag Free</h3>
          <p class="text-muted-foreground">Infinite looping scrolling with free drag behavior.</p>
          <app-preview [code]="loopCode" language="typescript">
            <app-loop-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="parallax">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Parallax</h3>
          <p class="text-muted-foreground">Parallax scrolling effect calculated via the Embla API events.</p>
          <app-preview [code]="parallaxCode" language="typescript">
            <app-parallax-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="scale">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Scale Tween</h3>
          <p class="text-muted-foreground">Slides scale based on their proximity to the center.</p>
          <app-preview [code]="scaleCode" language="typescript">
            <app-scale-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="opacity">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Opacity Tween</h3>
          <p class="text-muted-foreground">Slides fade out as they move away from the center.</p>
          <app-preview [code]="opacityCode" language="typescript">
            <app-opacity-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="thumbnails">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Thumbnails</h3>
          <p class="text-muted-foreground">Synchronize two carousels to create a main gallery with thumbnails.</p>
          <app-preview [code]="thumbnailsCode" language="typescript">
            <app-thumbnails-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="progress">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Progress Bar</h3>
          <p class="text-muted-foreground">A visual progress bar reflecting the scroll position.</p>
          <app-preview [code]="progressCode" language="typescript">
            <app-progress-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="lazy-load">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Lazy Loading</h3>
          <p class="text-muted-foreground">Optimize performance by loading slide content only when in view.</p>
          <app-preview [code]="lazyLoadCode" language="typescript">
            <app-lazy-load-carousel />
          </app-preview>
        </div>

        <div class="space-y-3" id="infinite-scroll">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Infinite Scroll</h3>
          <p class="text-muted-foreground">Dynamically load and append more slides as the user scrolls.</p>
          <app-preview [code]="infiniteScrollCode" language="typescript">
            <app-infinite-scroll-carousel />
          </app-preview>
        </div>
      </div>
    </section>
  `
})
export class CarouselExamplesComponent {
  sourceService = inject(SourceCodeService);

  basicCode = '';
  multipleCode = '';
  verticalCode = '';
  autoplayCode = '';
  loopCode = '';
  thumbnailsCode = '';
  alignmentCode = '';
  variableWidthCode = '';
  rtlCode = '';
  autoScrollCode = '';
  fadeCode = '';
  classNamesCode = '';
  parallaxCode = '';
  scaleCode = '';
  opacityCode = '';
  progressCode = '';
  lazyLoadCode = '';
  infiniteScrollCode = '';

  constructor() {
    this.sourceService.getFile('carousel/basic-carousel.component.ts').subscribe(code => this.basicCode = code);
    this.sourceService.getFile('carousel/multiple-carousel.component.ts').subscribe(code => this.multipleCode = code);
    this.sourceService.getFile('carousel/vertical-carousel.component.ts').subscribe(code => this.verticalCode = code);
    this.sourceService.getFile('carousel/autoplay-carousel.component.ts').subscribe(code => this.autoplayCode = code);
    this.sourceService.getFile('carousel/loop-carousel.component.ts').subscribe(code => this.loopCode = code);
    this.sourceService.getFile('carousel/thumbnails-carousel.component.ts').subscribe(code => this.thumbnailsCode = code);
    this.sourceService.getFile('carousel/alignment-carousel.component.ts').subscribe(code => this.alignmentCode = code);
    this.sourceService.getFile('carousel/variable-width-carousel.component.ts').subscribe(code => this.variableWidthCode = code);
    this.sourceService.getFile('carousel/rtl-carousel.component.ts').subscribe(code => this.rtlCode = code);
    this.sourceService.getFile('carousel/auto-scroll-carousel.component.ts').subscribe(code => this.autoScrollCode = code);
    this.sourceService.getFile('carousel/fade-carousel.component.ts').subscribe(code => this.fadeCode = code);
    this.sourceService.getFile('carousel/class-names-carousel.component.ts').subscribe(code => this.classNamesCode = code);
    this.sourceService.getFile('carousel/parallax-carousel.component.ts').subscribe(code => this.parallaxCode = code);
    this.sourceService.getFile('carousel/scale-carousel.component.ts').subscribe(code => this.scaleCode = code);
    this.sourceService.getFile('carousel/opacity-carousel.component.ts').subscribe(code => this.opacityCode = code);
    this.sourceService.getFile('carousel/progress-carousel.component.ts').subscribe(code => this.progressCode = code);
    this.sourceService.getFile('carousel/lazy-load-carousel.component.ts').subscribe(code => this.lazyLoadCode = code);
    this.sourceService.getFile('carousel/infinite-scroll-carousel.component.ts').subscribe(code => this.infiniteScrollCode = code);
  }
}
