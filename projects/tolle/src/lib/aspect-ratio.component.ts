import { Component, input, viewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, signal } from '@angular/core';

import { cn } from './utils/cn';

@Component({
  selector: 'tolle-aspect-ratio',
  standalone: true,
  imports: [],
  template: `
    <div
      #container
      [class]="cn('relative w-full overflow-hidden bg-muted/20', className())"
      [style.aspect-ratio]="ratio()"
      >
      @if (isLoading() && !hasError()) {
        <div class="absolute inset-0 z-10 animate-pulse bg-muted flex items-center justify-center">
          <i class="ri-image-line text-muted-foreground/40 text-3xl"></i>
        </div>
      }
    
      @if (hasError()) {
        <div class="absolute inset-0 z-20 bg-secondary flex flex-col items-center justify-center gap-2">
          <i class="ri-image-warning-line text-destructive text-2xl"></i>
          <span class="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Failed to load</span>
        </div>
      }
    
      <ng-content></ng-content>
    </div>
    `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    /* Target elements projected into the ng-content */
    :host ::ng-deep img,
    :host ::ng-deep video,
    :host ::ng-deep iframe {
      position: absolute;
      height: 100%;
      width: 100%;
      inset: 0;
      object-fit: cover;
      transition: opacity 0.3s ease-in-out;
    }

    /* Target direct div wrappers if needed */
    :host ::ng-deep .aspect-ratio-content {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class AspectRatioComponent implements AfterViewInit, OnDestroy {
  ratio = input<string | number>('16 / 9');
  className = input('', { alias: 'class' });

  container = viewChild.required<ElementRef<HTMLElement>>('container');

  isLoading = signal(true);
  hasError = signal(false);

  private cleanupListeners: (() => void)[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    const el = this.container().nativeElement;

    // Use capture phase because load/error do not bubble
    const onLoad = (event: Event) => {
      // Check if the event target is inside our container
      if (el.contains(event.target as Node)) {
        this.onLoad();
      }
    };

    const onError = (event: Event) => {
      if (el.contains(event.target as Node)) {
        this.onError();
      }
    };

    el.addEventListener('load', onLoad, true);
    el.addEventListener('error', onError, true);

    this.cleanupListeners.push(() => {
      el.removeEventListener('load', onLoad, true);
      el.removeEventListener('error', onError, true);
    });

    // Check if there are even any media elements. If not, don't show loader.
    // Or if images were already cached/loaded before AfterViewInit
    setTimeout(() => {
      const media = el.querySelectorAll('img, video, iframe');
      if (media.length === 0) {
        this.onLoad();
      } else {
        // Double check if all images are already complete (cached)
        const allComplete = Array.from(media).every(m => {
          if (m instanceof HTMLImageElement) return m.complete;
          return false; // For video/iframe we wait for event
        });
        if (allComplete) {
          this.onLoad();
        }
      }
    }, 50);
  }

  onLoad() {
    this.isLoading.set(false);
    this.hasError.set(false);
    this.cdr.detectChanges();
  }

  onError() {
    this.isLoading.set(false);
    this.hasError.set(true);
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.cleanupListeners.forEach(cleanup => cleanup());
  }

  protected cn = cn;
}
