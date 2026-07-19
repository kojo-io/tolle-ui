import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injectable, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

/**
 * Coordinates a `tolle-reasoning` with its trigger and content.
 *
 * The trigger and content are OnPush children, so the open/streaming/duration
 * state they render from is published here rather than read off the parent.
 *
 * Provided on `ReasoningComponent`, so each trace gets its own instance.
 */
@Injectable()
export class ReasoningService {
  private readonly openSource = new BehaviorSubject<boolean>(false);
  /** Emits whether the trace is expanded. */
  readonly open$ = this.openSource.asObservable();

  private readonly streamingSource = new BehaviorSubject<boolean>(false);
  /** Emits whether the model is still producing the trace. */
  readonly streaming$ = this.streamingSource.asObservable();

  private readonly durationSource = new BehaviorSubject<number>(0);
  /** Emits how long the model spent reasoning, in seconds. */
  readonly duration$ = this.durationSource.asObservable();

  /** True while the trace is expanded. */
  get open(): boolean {
    return this.openSource.value;
  }

  setOpen(value: boolean): void {
    if (this.openSource.value !== value) this.openSource.next(value);
  }

  toggle(): void {
    this.setOpen(!this.openSource.value);
  }

  setStreaming(value: boolean): void {
    if (this.streamingSource.value !== value) this.streamingSource.next(value);
  }

  setDuration(value: number): void {
    if (this.durationSource.value !== value) this.durationSource.next(value);
  }
}

const reasoningVariants = cva('flex w-full flex-col gap-2', {
  variants: {
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type ReasoningProps = VariantProps<typeof reasoningVariants>;

/**
 * A collapsible view of the model's reasoning, collapsed by default.
 *
 * While `streaming` is true the trigger reads "Thinking…"; once it finishes the
 * trigger reports how long the model thought, using `duration`.
 *
 * Compose it from `tolle-reasoning-trigger` and `tolle-reasoning-content`.
 * @new
 */
@Component({
  selector: 'tolle-reasoning',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [ReasoningService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass" [attr.data-state]="open ? 'open' : 'closed'">
      <ng-content></ng-content>
    </div>
  `,
})
export class ReasoningComponent implements OnInit, OnChanges, OnDestroy {
  /** Whether the trace is expanded. @default false */
  @Input() open = false;
  /** True while the model is still producing the trace. @default false */
  @Input() streaming = false;
  /** Seconds the model spent reasoning, shown once streaming finishes. @default 0 */
  @Input() duration = 0;
  /** Text scale of the trace. @default 'default' */
  @Input() size: ReasoningProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the trace via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the new state whenever the trace is expanded or collapsed. */
  @Output() openChange = new EventEmitter<boolean>();

  private readonly service = inject(ReasoningService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();
  /** True while an `open` input is being pushed into the service. */
  private applyingInput = false;

  ngOnInit(): void {
    this.sync();
    // `skip(1)` drops the BehaviorSubject's current value so simply mounting
    // the component never emits a spurious `openChange`.
    this.subscriptions.add(
      this.service.open$.pipe(skip(1)).subscribe((open) => {
        this.open = open;
        this.cdr.markForCheck();
        // Only user-driven toggles are worth reporting; echoing a change the
        // parent just made would fight a `[(open)]` binding.
        if (!this.applyingInput) this.openChange.emit(open);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) this.applyInput(this.open);
    this.service.setStreaming(this.streaming);
    this.service.setDuration(this.duration);
  
    // A bound `class` input is written through Angular's styling path,
    // which does not mark an OnPush view dirty on its own.
    this.cdr.markForCheck();
  }

  private applyInput(open: boolean): void {
    this.applyingInput = true;
    try {
      this.service.setOpen(open);
    } finally {
      this.applyingInput = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get computedClass() {
    return cn(reasoningVariants({ size: this.size }), this.class);
  }

  private sync(): void {
    this.service.setOpen(this.open);
    this.service.setStreaming(this.streaming);
    this.service.setDuration(this.duration);
  }
}

/**
 * Toggle for a `tolle-reasoning`. Shows a live "Thinking…" label while the
 * trace is streaming and the elapsed thinking time once it is done.
 */
@Component({
  selector: 'tolle-reasoning-trigger',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-reasoning-trigger
      [attr.aria-expanded]="open"
      [attr.data-state]="open ? 'open' : 'closed'"
      [class]="computedClass"
      (click)="onToggle()"
    >
      <i
        [class]="icon"
        [class.animate-pulse]="streaming"
        aria-hidden="true"
      ></i>

      <span data-reasoning-label>{{ label }}</span>

      <i
        class="ri-arrow-down-s-line transition-transform duration-200"
        [class.rotate-180]="open"
        aria-hidden="true"
      ></i>

      <ng-content></ng-content>
    </button>
  `,
})
export class ReasoningTriggerComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Remixicon class shown before the label. @default 'ri-brain-line' */
  @Input() icon = 'ri-brain-line';
  /** Label shown while the trace is streaming. @default 'Thinking…' */
  @Input() thinkingLabel = 'Thinking…';
  /** Label used when the trace finished without a measured duration. @default 'Thought for a few seconds' */
  @Input() fallbackLabel = 'Thought for a few seconds';
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(ReasoningService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  open = false;
  streaming = false;
  duration = 0;

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.open$.subscribe((open) => {
        this.open = open;
        this.cdr.markForCheck();
      })
    );
    this.subscriptions.add(
      this.service.streaming$.subscribe((streaming) => {
        this.streaming = streaming;
        this.cdr.markForCheck();
      })
    );
    this.subscriptions.add(
      this.service.duration$.subscribe((duration) => {
        this.duration = duration;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** "Thinking…" while streaming, otherwise how long the model thought. */
  get label(): string {
    if (this.streaming) return this.thinkingLabel;
    if (!this.duration || this.duration < 1) return this.fallbackLabel;
    const rounded = Math.round(this.duration);
    return 'Thought for ' + rounded + (rounded === 1 ? ' second' : ' seconds');
  }

  get computedClass() {
    return cn(
      'flex w-fit items-center gap-1.5 rounded-md px-1.5 py-1 text-muted-foreground transition-colors',
      'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      this.class
    );
  }

  onToggle(): void {
    this.service.toggle();
  }
}

/** The reasoning text itself. Rendered only while the trace is expanded. */
@Component({
  selector: 'tolle-reasoning-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="open" data-reasoning-content [class]="computedClass">
      <p *ngIf="text" class="whitespace-pre-wrap">{{ text }}</p>
      <ng-content></ng-content>
    </div>
  `,
})
export class ReasoningContentComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Reasoning text to render; project your own markup instead when richer. @default '' */
  @Input() text = '';
  /** Extra Tailwind classes merged onto the content via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(ReasoningService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  open = false;

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.open$.subscribe((open) => {
        this.open = open;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get computedClass() {
    return cn(
      'border-l-2 border-border pl-4 text-muted-foreground',
      this.class
    );
  }
}
