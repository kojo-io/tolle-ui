import { Component, Directive, Input, Output, EventEmitter, ElementRef, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnInit, OnDestroy, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { cn } from './utils/cn';
import { MessageScrollerService, ScrollStartPosition } from './message-scroller.service';

/**
 * A scroll container built for conversations, where content streams in while
 * the reader is still reading.
 *
 * A plain overflow-scroll div gets this wrong in both directions: it either
 * pins to the bottom and yanks the page mid-sentence, or it never follows and
 * the reader misses the reply. This handles the cases that are easy to get
 * wrong — following the live edge only while the reader is already there,
 * opening a saved thread at the newest turn rather than the absolute end, and
 * holding position when older history loads in above.
 *
 * ```html
 * <tolle-message-scroller startPosition="last-anchor">
 *   <tolle-message-scroller-viewport>
 *     <tolle-message-scroller-content>
 *       <div tolleMessageScrollerItem [scrollAnchor]="turn.isNewTurn" *ngFor="let turn of turns">
 *         …
 *       </div>
 *     </tolle-message-scroller-content>
 *   </tolle-message-scroller-viewport>
 *   <tolle-message-scroller-button />
 * </tolle-message-scroller>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-message-scroller',
  // The host sits between a consumer-sized parent and the templated flex
  // frame below; display:block would drop the parent's height and the
  // frame's `flex-1 min-h-0` would have nothing to size against.
  styles: [':host { display: flex; flex-direction: column; height: 100%; min-height: 0; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [MessageScrollerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cn('relative flex min-h-0 flex-1 flex-col overflow-hidden', class)">
      <ng-content></ng-content>
    </div>
  `,
})
export class MessageScrollerComponent implements OnChanges, OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /**
   * Where to land when the transcript first renders. `last-anchor` opens at the
   * newest turn so a long answer starts from its first line.
   * @default 'last-anchor'
   */
  @Input() startPosition: ScrollStartPosition = 'last-anchor';
  /**
   * Pixels of the previous turn kept visible above an anchored turn, so the
   * reader can see what the reply is responding to. @default 48
   */
  @Input() scrollPreviousItemPeek = 48;
  /**
   * Distance from the bottom, in px, still treated as the live edge.
   * @default 32
   */
  @Input() threshold = 32;
  /** Extra Tailwind classes merged onto the frame via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted when the reader arrives at, or leaves, the live edge. */
  @Output() atBottomChange = new EventEmitter<boolean>();

  private readonly service = inject(MessageScrollerService);
  private readonly sub = new Subscription();
  protected cn = cn;

  ngOnInit(): void {
    this.service.threshold = this.threshold;
    this.sub.add(this.service.atBottom$.subscribe((v) => this.atBottomChange.emit(v)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  /** Jumps to the newest content and resumes following. */
  scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    this.service.scrollToBottom(behavior);
  }
}

/**
 * The scrolling element. Watches its own size and its content's size so it can
 * follow streamed text and hold position when history is prepended.
 */
@Component({
  selector: 'tolle-message-scroller-viewport',
  // Same reasoning as tolle-message-scroller: this host is the flex item the
  // scrollable inner div sizes against, so it must join the flex chain itself.
  styles: [':host { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #viewport [class]="cn('min-h-0 flex-1 overflow-y-auto overscroll-contain', class)">
      <ng-content></ng-content>
    </div>
  `,
})
export class MessageScrollerViewportComponent implements OnChanges, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Extra Tailwind classes merged onto the viewport via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(MessageScrollerService);
  private readonly scroller = inject(MessageScrollerComponent);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  private viewportEl: HTMLElement | null = null;
  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private onScroll = () => this.service.measure();
  /** scrollHeight captured before each DOM mutation, to detect prepends. */
  private lastScrollHeight = 0;
  private lastScrollTop = 0;
  protected cn = cn;

  ngAfterViewInit(): void {
    const el = this.host.nativeElement.querySelector<HTMLElement>('div');
    if (!el) return;
    this.viewportEl = el;
    this.service.registerViewport(el);

    // Scroll fires at frame rate; keeping the listener outside Angular means we
    // only re-enter change detection when a tracked boolean actually flips.
    this.zone.runOutsideAngular(() => {
      el.addEventListener('scroll', this.onScroll, { passive: true });

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.service.handleContentGrowth());
        this.resizeObserver.observe(el);
        const content = el.firstElementChild;
        if (content) this.resizeObserver.observe(content);
      }

      if (typeof MutationObserver !== 'undefined') {
        this.mutationObserver = new MutationObserver(() => this.afterMutation());
        this.mutationObserver.observe(el, { childList: true, subtree: true, characterData: true });
      }
    });

    this.lastScrollHeight = el.scrollHeight;

    // Wait a frame so projected content has laid out before positioning.
    setTimeout(() => {
      this.service.applyStartPosition(
        this.scroller.startPosition,
        this.scroller.scrollPreviousItemPeek
      );
      this.lastScrollHeight = el.scrollHeight;
    });
  }

  ngOnDestroy(): void {
    this.viewportEl?.removeEventListener('scroll', this.onScroll);
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
  }

  /**
   * Distinguishes content appended below (stream) from content inserted above
   * (history). Growth while the reader has NOT moved but the scrollable area
   * above them has, means a prepend — restore their position rather than let
   * the view lurch.
   */
  private afterMutation(): void {
    const el = this.viewportEl;
    if (!el) return;

    const grew = el.scrollHeight - this.lastScrollHeight;
    const readerMoved = el.scrollTop !== this.lastScrollTop;

    if (grew > 0 && !readerMoved && !this.service.isFollowing && el.scrollTop > 0) {
      this.service.preserveOnPrepend(this.lastScrollHeight);
    } else if (grew > 0) {
      this.service.handleContentGrowth();
    }

    this.lastScrollHeight = el.scrollHeight;
    this.lastScrollTop = el.scrollTop;
    this.service.measure();
  }
}

/** The transcript itself. Announced politely so streamed replies reach screen readers. */
@Component({
  selector: 'tolle-message-scroller-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      [class]="cn('flex flex-col gap-4 p-4', class)"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class MessageScrollerContentComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Extra Tailwind classes merged onto the transcript via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/**
 * Marks one row of the transcript. Set `scrollAnchor` on the row that begins a
 * conversation turn so `startPosition="last-anchor"` can open there.
 */
@Directive({
  selector: '[tolleMessageScrollerItem]',
  standalone: true,
  host: { '[attr.data-scroll-anchor]': `scrollAnchor ? '' : null` },
})
export class MessageScrollerItemDirective implements OnInit, OnDestroy {
  /** Marks this row as the start of a turn. @default false */
  @Input() scrollAnchor = false;

  private readonly service = inject(MessageScrollerService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  ngOnInit(): void {
    if (this.scrollAnchor) this.service.registerAnchor(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.service.unregisterAnchor(this.host.nativeElement);
  }

  /** Brings this row into view — use for jump-to-message. */
  scrollIntoView(behavior: ScrollBehavior = 'smooth'): void {
    this.service.scrollToItem(this.host.nativeElement, behavior);
  }
}

/** Floating "jump to latest" control. Hidden while the reader is already at the edge. */
@Component({
  selector: 'tolle-message-scroller-button',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      *ngIf="!atBottom"
      type="button"
      [attr.aria-label]="ariaLabel"
      [class]="cn(
        'absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full',
        'border border-border bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-md',
        'transition-colors hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        class
      )"
      (click)="jump()"
    >
      <i class="ri-arrow-down-line" aria-hidden="true"></i>
      <ng-content></ng-content>
    </button>
  `,
})
export class MessageScrollerButtonComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Accessible name for the jump control. @default 'Jump to latest messages' */
  @Input() ariaLabel = 'Jump to latest messages';
  /** Extra Tailwind classes merged onto the button via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(MessageScrollerService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub = new Subscription();

  atBottom = true;
  protected cn = cn;

  ngOnInit(): void {
    this.sub.add(
      this.service.atBottom$.subscribe((v) => {
        this.atBottom = v;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  jump(): void {
    this.service.scrollToBottom();
  }
}
