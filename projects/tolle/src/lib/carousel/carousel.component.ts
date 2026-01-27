import {
    Component,
    input,
    output,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    OnInit,
    Injectable,
    Directive,
    inject,
    ChangeDetectorRef,
    signal,
    computed,
    effect
} from '@angular/core';

import EmblaCarousel, {
    EmblaCarouselType,
    EmblaOptionsType,
    EmblaPluginType,
} from 'embla-carousel';

@Injectable()
export class CarouselContext {
    api = signal<EmblaCarouselType | undefined>(undefined);
    orientation = signal<'horizontal' | 'vertical'>('horizontal');
    canScrollPrev = signal(false);
    canScrollNext = signal(false);

    private cdr = inject(ChangeDetectorRef);

    setApi(api: EmblaCarouselType) {
        this.api.set(api);
        this.updateState();

        api.on('select', () => this.updateState());
        api.on('reInit', () => this.updateState());
    }

    updateState() {
        const api = this.api();
        if (!api) return;
        this.canScrollPrev.set(api.canScrollPrev());
        this.canScrollNext.set(api.canScrollNext());
        this.cdr.detectChanges();
    }

    scrollPrev() {
        this.api()?.scrollPrev();
    }

    scrollNext() {
        this.api()?.scrollNext();
    }
}

@Component({
    selector: 'tolle-carousel',
    standalone: true,
    imports: [],
    providers: [CarouselContext],
    template: `
    <div
      class="relative"
      role="region"
      aria-roledescription="carousel"
      [class.flex-col]="orientation() === 'vertical'"
    >
      <ng-content></ng-content>
    </div>
  `,
    host: {
        '[class.flex]': 'orientation() === "vertical"',
    }
})
export class CarouselComponent implements OnInit, OnDestroy {
    opts = input<EmblaOptionsType>({});
    plugins = input<EmblaPluginType[]>([]);
    orientation = input<'horizontal' | 'vertical'>('horizontal');

    apiEvent = output<EmblaCarouselType>({ alias: 'api' });

    private carouselContext = inject(CarouselContext);
    private emblaApi?: EmblaCarouselType;

    constructor() {
        effect(() => {
            this.carouselContext.orientation.set(this.orientation());
        });
    }

    ngOnInit() {
        this.carouselContext.orientation.set(this.orientation());
    }

    initApi(viewport: HTMLElement) {
        this.emblaApi = EmblaCarousel(viewport, {
            ...this.opts(),
            axis: this.orientation() === 'horizontal' ? 'x' : 'y',
        }, this.plugins());

        this.carouselContext.setApi(this.emblaApi);
        this.apiEvent.emit(this.emblaApi);
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
        '[class]': 'carouselContext.orientation() === "horizontal" ? "flex -ml-4" : "flex flex-col -mt-4"',
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
        '[class]': 'carouselContext.orientation() === "horizontal" ? "min-w-0 shrink-0 grow-0 basis-full pl-4" : "min-w-0 shrink-0 grow-0 basis-full pt-4"',
    }
})
export class CarouselItemDirective {
    carouselContext = inject(CarouselContext);
}

@Directive({
    selector: '[tolleCarouselPrevious]',
    standalone: true,
    host: {
        '[attr.disabled]': '!carouselContext.canScrollPrev() ? true : null',
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
        '[attr.disabled]': '!carouselContext.canScrollNext() ? true : null',
        '(click)': 'carouselContext.scrollNext()',
    }
})
export class CarouselNextDirective {
    carouselContext = inject(CarouselContext);
}
