import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injectable,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

/**
 * Coordinates a `tolle-conversation` and its projected parts.
 *
 * The transcript owns the scroll position; the empty state and the
 * "jump to latest" button are OnPush children that cannot read the parent's
 * fields directly, so everything they need is published here as an observable.
 *
 * Provided on `ConversationComponent`, so each transcript gets its own instance.
 */
@Injectable()
export class ConversationService {
  private readonly atBottomSource = new BehaviorSubject<boolean>(true);
  /** Emits whether the transcript is scrolled to (or near) the newest message. */
  readonly atBottom$ = this.atBottomSource.asObservable();

  private readonly emptySource = new BehaviorSubject<boolean>(false);
  /** Emits whether the transcript has no messages yet. */
  readonly empty$ = this.emptySource.asObservable();

  private readonly scrollRequestSource = new Subject<ScrollBehavior>();
  /** Emits when a child asks the transcript to scroll to the newest message. */
  readonly scrollRequest$ = this.scrollRequestSource.asObservable();

  /** True while the transcript is pinned to the bottom. */
  get atBottom(): boolean {
    return this.atBottomSource.value;
  }

  /** True while the transcript is empty. */
  get empty(): boolean {
    return this.emptySource.value;
  }

  setAtBottom(value: boolean): void {
    if (this.atBottomSource.value !== value) this.atBottomSource.next(value);
  }

  setEmpty(value: boolean): void {
    if (this.emptySource.value !== value) this.emptySource.next(value);
  }

  /** Asks the transcript to scroll to the newest message. */
  requestScrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    this.scrollRequestSource.next(behavior);
  }
}

const conversationVariants = cva('relative flex w-full flex-col overflow-hidden', {
  variants: {
    size: {
      sm: 'max-h-72',
      default: 'max-h-[32rem]',
      lg: 'max-h-[48rem]',
      full: 'h-full max-h-full',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type ConversationProps = VariantProps<typeof conversationVariants>;

/**
 * A scrollable chat transcript. Announces new messages politely, keeps itself
 * pinned to the newest message while the reader is already at the bottom, and
 * hosts the empty state plus the floating "jump to latest" button.
 *
 * Compose it from `tolle-conversation-content`,
 * `tolle-conversation-empty-state` and `tolle-conversation-scroll-button`.
 * @new
 */
@Component({
  selector: 'tolle-conversation',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [ConversationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <div
        #viewport
        data-conversation-viewport
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        [attr.aria-label]="ariaLabel || null"
        [class]="viewportComputedClass"
        (scroll)="onScroll()"
      >
        <ng-content></ng-content>
      </div>

      <ng-content select="tolle-conversation-scroll-button"></ng-content>
    </div>
  `,
})
export class ConversationComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  /** Height preset for the scroll region. @default 'default' */
  @Input() size: ConversationProps['size'] = 'default';
  /** Keeps the newest message in view while the reader is already at the bottom. @default true */
  @Input() autoScroll = true;
  /** Set true before the first message so the empty state shows. @default false */
  @Input() empty = false;
  /** Distance from the bottom, in px, still counted as "at the bottom". @default 32 */
  @Input() threshold = 32;
  /** Accessible name for the transcript. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the transcript via `cn()` (last-wins). */
  @Input() class = '';
  /** Extra Tailwind classes merged onto the scrolling viewport via `cn()` (last-wins). */
  @Input() viewportClass = '';

  /** Emitted whenever the transcript becomes pinned to, or leaves, the bottom. */
  @Output() atBottomChange = new EventEmitter<boolean>();

  @ViewChild('viewport') private viewport?: ElementRef<HTMLElement>;

  private readonly service = inject(ConversationService);
  private readonly subscriptions = new Subscription();
  private observer?: MutationObserver;

  ngOnInit(): void {
    this.service.setEmpty(this.empty);
    this.subscriptions.add(
      this.service.scrollRequest$.subscribe((behavior) => this.scrollToBottom(behavior))
    );
  }

  ngOnChanges(): void {
    this.service.setEmpty(this.empty);
  }

  ngAfterViewInit(): void {
    this.measure();

    // New messages arrive as DOM mutations rather than as inputs on this
    // component, so watching the subtree is the only content-agnostic way to
    // keep a transcript of projected messages pinned to the bottom.
    if (typeof MutationObserver !== 'undefined' && this.viewport) {
      this.observer = new MutationObserver(() => this.onContentChanged());
      this.observer.observe(this.viewport.nativeElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.subscriptions.unsubscribe();
  }

  get computedClass() {
    return cn(conversationVariants({ size: this.size }), this.class);
  }

  get viewportComputedClass() {
    return cn('flex-1 overflow-y-auto overflow-x-hidden outline-none', this.viewportClass);
  }

  /** Scrolls the transcript to the newest message. */
  scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    const el = this.viewport?.nativeElement;
    if (!el) return;
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ top: el.scrollHeight, behavior });
    } else {
      el.scrollTop = el.scrollHeight;
    }
    this.measure();
  }

  /** Recomputes whether the viewport is at the bottom and publishes the result. */
  onScroll(): void {
    this.measure();
  }

  private onContentChanged(): void {
    if (this.autoScroll && this.service.atBottom) {
      this.scrollToBottom('auto');
    } else {
      this.measure();
    }
  }

  private measure(): void {
    const el = this.viewport?.nativeElement;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const next = distance <= this.threshold;
    if (next !== this.service.atBottom) {
      this.service.setAtBottom(next);
      this.atBottomChange.emit(next);
    }
  }
}

/** Vertical stack of messages inside a `tolle-conversation`. */
@Component({
  selector: 'tolle-conversation-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <ng-content></ng-content>
    </div>
  `,
})
export class ConversationContentComponent {
  /** Extra Tailwind classes merged onto the stack via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn('flex flex-col gap-4 p-4', this.class);
  }
}

/**
 * Placeholder shown while a `tolle-conversation` has no messages. Renders
 * nothing once the transcript reports content, so it can stay in the template.
 */
@Component({
  selector: 'tolle-conversation-empty-state',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="visible" data-conversation-empty [class]="computedClass">
      <div
        *ngIf="icon"
        class="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
        <i [class]="icon" aria-hidden="true"></i>
      </div>

      <p *ngIf="title" class="text-sm font-medium text-foreground">{{ title }}</p>
      <p *ngIf="description" class="max-w-sm text-sm text-muted-foreground">{{ description }}</p>

      <ng-content></ng-content>
    </div>
  `,
})
export class ConversationEmptyStateComponent implements OnInit, OnDestroy {
  /** Remixicon class for the illustration. @default 'ri-chat-3-line' */
  @Input() icon = 'ri-chat-3-line';
  /** Headline shown above the description. @default 'No messages yet' */
  @Input() title = 'No messages yet';
  /** Supporting copy under the headline. @default 'Start the conversation by sending a message.' */
  @Input() description = 'Start the conversation by sending a message.';
  /** Extra Tailwind classes merged onto the empty state via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(ConversationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  visible = false;

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.empty$.subscribe((empty) => {
        this.visible = empty;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get computedClass() {
    return cn(
      'flex flex-col items-center justify-center gap-2 px-6 py-12 text-center',
      this.class
    );
  }
}

const conversationScrollButtonVariants = cva(
  'absolute bottom-4 left-1/2 z-10 inline-flex -translate-x-1/2 items-center justify-center gap-1.5 rounded-full border shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-7 px-2 text-xs',
        default: 'h-8 px-3 text-xs',
        icon: 'size-8 p-0 text-sm',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  }
);

export type ConversationScrollButtonProps = VariantProps<typeof conversationScrollButtonVariants>;

/**
 * Floating "jump to latest" control. Appears only while the transcript is
 * scrolled away from the newest message, and scrolls it back on click.
 */
@Component({
  selector: 'tolle-conversation-scroll-button',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      *ngIf="visible"
      type="button"
      data-conversation-scroll-button
      [attr.aria-label]="label"
      [class]="computedClass"
      (click)="onClick()"
    >
      <i class="ri-arrow-down-line" aria-hidden="true"></i>
      <span *ngIf="size !== 'icon'">{{ label }}</span>
    </button>
  `,
})
export class ConversationScrollButtonComponent implements OnInit, OnDestroy {
  /** Visual style of the button. @default 'outline' */
  @Input() variant: ConversationScrollButtonProps['variant'] = 'outline';
  /** Size of the button; 'icon' drops the text label. @default 'default' */
  @Input() size: ConversationScrollButtonProps['size'] = 'default';
  /** Button text and accessible name. @default 'Jump to latest' */
  @Input() label = 'Jump to latest';
  /** Extra Tailwind classes merged onto the button via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted when the reader jumps back to the newest message. */
  @Output() jumped = new EventEmitter<void>();

  private readonly service = inject(ConversationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  visible = false;

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.atBottom$.subscribe((atBottom) => {
        this.visible = !atBottom;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get computedClass() {
    return cn(
      conversationScrollButtonVariants({ variant: this.variant, size: this.size }),
      this.class
    );
  }

  onClick(): void {
    this.service.requestScrollToBottom('smooth');
    this.jumped.emit();
  }
}
