import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
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
    imports: [
        CommonModule,
        FormsModule,
        SegmentedComponent,
        BaseEditorComponent,
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
      <h2 class="text-2xl font-bold mb-6">Examples</h2>

      <div class="space-y-12">
        <div id="basic">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Basic</h3>
          <p class="text-muted-foreground mb-4">A simple carousel with navigation buttons.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="basicView" />
          </div>
          <div *ngIf="basicView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-basic-carousel />
          </div>
          <div *ngIf="basicView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="basicCode" language="typescript" />
          </div>
        </div>

        <div id="multiple">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Multiple Slides</h3>
          <p class="text-muted-foreground mb-4">Display multiple slides per view and scroll multiple items at once.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="multipleView" />
          </div>
          <div *ngIf="multipleView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-multiple-carousel />
          </div>
          <div *ngIf="multipleView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="multipleCode" language="typescript" />
          </div>
        </div>

        <div id="alignment">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Alignment</h3>
          <p class="text-muted-foreground mb-4">Change the alignment of slides (start, center, end).</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="alignmentView" />
          </div>
          <div *ngIf="alignmentView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-alignment-carousel />
          </div>
          <div *ngIf="alignmentView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="alignmentCode" language="typescript" />
          </div>
        </div>

        <div id="variable-width">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Variable Widths</h3>
          <p class="text-muted-foreground mb-4">Slides can have different widths defined in CSS.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="variableWidthView" />
          </div>
          <div *ngIf="variableWidthView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-variable-width-carousel />
          </div>
          <div *ngIf="variableWidthView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="variableWidthCode" language="typescript" />
          </div>
        </div>

        <div id="rtl">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Right To Left</h3>
          <p class="text-muted-foreground mb-4">Support for Right-to-Left directions.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="rtlView" />
          </div>
          <div *ngIf="rtlView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-rtl-carousel />
          </div>
          <div *ngIf="rtlView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="rtlCode" language="typescript" />
          </div>
        </div>

        <div id="autoplay">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Autoplay</h3>
          <p class="text-muted-foreground mb-4">Automatically advance slides using the Autoplay plugin.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="autoplayView" />
          </div>
          <div *ngIf="autoplayView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-autoplay-carousel />
          </div>
          <div *ngIf="autoplayView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="autoplayCode" language="typescript" />
          </div>
        </div>

        <div id="auto-scroll">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Auto Scroll</h3>
          <p class="text-muted-foreground mb-4">Continuous auto-scrolling using the Auto Scroll plugin.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="autoScrollView" />
          </div>
          <div *ngIf="autoScrollView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-auto-scroll-carousel />
          </div>
          <div *ngIf="autoScrollView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="autoScrollCode" language="typescript" />
          </div>
        </div>

        <div id="fade">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Fade</h3>
          <p class="text-muted-foreground mb-4">Cross-fade transition effect using the Fade plugin.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="fadeView" />
          </div>
          <div *ngIf="fadeView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-fade-carousel />
          </div>
          <div *ngIf="fadeView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="fadeCode" language="typescript" />
          </div>
        </div>

        <div id="class-names">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Class Names</h3>
          <p class="text-muted-foreground mb-4">Automatically add classes to slides using the Class Names plugin.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="classNamesView" />
          </div>
          <div *ngIf="classNamesView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-class-names-carousel />
          </div>
          <div *ngIf="classNamesView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="classNamesCode" language="typescript" />
          </div>
        </div>

        <div id="loop">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Loop & Drag Free</h3>
          <p class="text-muted-foreground mb-4">Infinite looping scrolling with free drag behavior.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="loopView" />
          </div>
          <div *ngIf="loopView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-loop-carousel />
          </div>
          <div *ngIf="loopView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="loopCode" language="typescript" />
          </div>
        </div>

        <div id="parallax">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Parallax</h3>
          <p class="text-muted-foreground mb-4">Parallax scrolling effect calculated via the Embla API events.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="parallaxView" />
          </div>
          <div *ngIf="parallaxView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-parallax-carousel />
          </div>
          <div *ngIf="parallaxView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="parallaxCode" language="typescript" />
          </div>
        </div>

        <div id="scale">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Scale Tween</h3>
          <p class="text-muted-foreground mb-4">Slides scale based on their proximity to the center.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="scaleView" />
          </div>
          <div *ngIf="scaleView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-scale-carousel />
          </div>
          <div *ngIf="scaleView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="scaleCode" language="typescript" />
          </div>
        </div>

        <div id="opacity">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Opacity Tween</h3>
          <p class="text-muted-foreground mb-4">Slides fade out as they move away from the center.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="opacityView" />
          </div>
          <div *ngIf="opacityView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-opacity-carousel />
          </div>
          <div *ngIf="opacityView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="opacityCode" language="typescript" />
          </div>
        </div>

        <div id="thumbnails">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Thumbnails</h3>
          <p class="text-muted-foreground mb-4">Synchronize two carousels to create a main gallery with thumbnails.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="thumbnailsView" />
          </div>
          <div *ngIf="thumbnailsView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-thumbnails-carousel />
          </div>
          <div *ngIf="thumbnailsView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="thumbnailsCode" language="typescript" />
          </div>
        </div>

        <div id="progress">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Progress Bar</h3>
          <p class="text-muted-foreground mb-4">A visual progress bar reflecting the scroll position.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="progressView" />
          </div>
          <div *ngIf="progressView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-progress-carousel />
          </div>
          <div *ngIf="progressView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="progressCode" language="typescript" />
          </div>
        </div>

        <div id="lazy-load">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Lazy Loading</h3>
          <p class="text-muted-foreground mb-4">Optimize performance by loading slide content only when in view.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="lazyLoadView" />
          </div>
          <div *ngIf="lazyLoadView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-lazy-load-carousel />
          </div>
          <div *ngIf="lazyLoadView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="lazyLoadCode" language="typescript" />
          </div>
        </div>

        <div id="infinite-scroll">
          <h3 class="text-xl font-semibold mb-4 text-foreground/80">Infinite Scroll</h3>
          <p class="text-muted-foreground mb-4">Dynamically load and append more slides as the user scrolls.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="infiniteScrollView" />
          </div>
          <div *ngIf="infiniteScrollView === 'preview'"
               class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 shadow-sm">
            <app-infinite-scroll-carousel />
          </div>
          <div *ngIf="infiniteScrollView === 'code'"
               class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm">
            <app-base-editor [code]="infiniteScrollCode" language="typescript" />
          </div>
        </div>
      </div>
    </section>
  `
})
export class CarouselExamplesComponent {
  sourceService = inject(SourceCodeService);

  basicView = 'preview';
  multipleView = 'preview';
  verticalView = 'preview';
  autoplayView = 'preview';
  loopView = 'preview';
  thumbnailsView = 'preview';
  alignmentView = 'preview';
  variableWidthView = 'preview';
  rtlView = 'preview';
  autoScrollView = 'preview';
  fadeView = 'preview';
  classNamesView = 'preview';
  parallaxView = 'preview';
  scaleView = 'preview';
  opacityView = 'preview';
  progressView = 'preview';
  lazyLoadView = 'preview';
  infiniteScrollView = 'preview';

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

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

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
