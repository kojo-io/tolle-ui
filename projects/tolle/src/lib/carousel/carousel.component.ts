import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    ViewChild,
    AfterViewInit,
    OnDestroy,
    OnInit,
    OnChanges,
    ContentChild,
    forwardRef,
    Injectable,
    Directive,
    HostListener,
    inject,
    ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import EmblaCarousel, {
    EmblaCarouselType,
    EmblaOptionsType,
    EmblaPluginType,
} from 'embla-carousel';
import { Subject } from 'rxjs';

@Injectable()
export class CarouselContext {
    api$ = new Subject<EmblaCarouselType>();
    api?: EmblaCarouselType;
    orientation: 'horizontal' | 'vertical' = 'horizontal';
    canScrollPrev = false;
    canScrollNext = false;

    constructor(private cdr: ChangeDetectorRef) { }

    setApi(api: EmblaCarouselType) {
        this.api = api;
        this.api$.next(api);
        this.updateState();

        api.on('select', () => this.updateState());
        api.on('reInit', () => this.updateState());
    }

    updateState() {
        if (!this.api) return;
        this.canScrollPrev = this.api.canScrollPrev();
        this.canScrollNext = this.api.canScrollNext();
        this.cdr.detectChanges();
    }

    scrollPrev() {
        this.api?.scrollPrev();
    }

    scrollNext() {
        this.api?.scrollNext();
    }
}

@Component({
    selector: 'tolle-carousel',
    imports: [CommonModule],
    providers: [CarouselContext],
    template: `
    <div
      class="relative"
      role="region"
      aria-roledescription="carousel"
      [class.flex-col]="orientation === 'vertical'"
    >
      <ng-content></ng-content>
    </div>
  `,
    host: {
        '[class.flex]': 'orientation === "vertical"',
    }
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
    @Input() opts: EmblaOptionsType = {};
    @Input() plugins: EmblaPluginType[] = [];
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

    @Output() api = new EventEmitter<EmblaCarouselType>();

    private carouselContext = inject(CarouselContext);
    private emblaApi?: EmblaCarouselType;

    @ViewChild('container', { static: false }) containerRef?: ElementRef;

    constructor() { }

    ngOnInit() {
        this.carouselContext.orientation = this.orientation;
    }

    ngOnChanges() {
        this.carouselContext.orientation = this.orientation;
    }

    ngAfterViewInit() {
        // We expect tolleCarouselContent to provide the viewport element
    }

    initApi(viewport: HTMLElement) {
        this.emblaApi = EmblaCarousel(viewport, {
            ...this.opts,
            axis: this.orientation === 'horizontal' ? 'x' : 'y',
        }, this.plugins);

        this.carouselContext.setApi(this.emblaApi);
        this.api.emit(this.emblaApi);
    }

    ngOnDestroy() {
        this.emblaApi?.destroy();
    }
}

@Directive({
    selector: '[tolleCarouselContent]',
    standalone: true,
    host: {
        'class': 'overflow-hidden',
    }
})
export class CarouselContentDirective implements AfterViewInit {
    private carousel = inject(CarouselComponent);
    private el = inject(ElementRef);

    ngAfterViewInit() {
        this.carousel.initApi(this.el.nativeElement);
    }
}

@Directive({
    selector: '[tolleCarouselContainer]',
    standalone: true,
    host: {
        '[class]': 'carouselContext.orientation === "horizontal" ? "flex -ml-4" : "flex flex-col -mt-4"',
    }
})
export class CarouselContainerDirective {
    carouselContext = inject(CarouselContext);
}

@Directive({
    selector: '[tolleCarouselItem]',
    standalone: true,
    host: {
        'role': 'group',
        'aria-roledescription': 'slide',
        '[class]': 'carouselContext.orientation === "horizontal" ? "min-w-0 shrink-0 grow-0 basis-full pl-4" : "min-w-0 shrink-0 grow-0 basis-full pt-4"',
    }
})
export class CarouselItemDirective {
    carouselContext = inject(CarouselContext);
}

@Directive({
    selector: '[tolleCarouselPrevious]',
    standalone: true,
    host: {
        '[attr.disabled]': '!carouselContext.canScrollPrev ? true : null',
        '(click)': 'carouselContext.scrollPrev()',
    }
})
export class CarouselPreviousDirective {
    carouselContext = inject(CarouselContext);
}

@Directive({
    selector: '[tolleCarouselNext]',
    standalone: true,
    host: {
        '[attr.disabled]': '!carouselContext.canScrollNext ? true : null',
        '(click)': 'carouselContext.scrollNext()',
    }
})
export class CarouselNextDirective {
    carouselContext = inject(CarouselContext);
}
