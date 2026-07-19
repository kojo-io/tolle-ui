import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injectable, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const promptInputVariants = cva(
  'flex w-full flex-col gap-2 rounded-lg border bg-background p-2 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background',
  {
    variants: {
      status: {
        ready: 'border-input focus-within:ring-ring',
        streaming: 'border-info focus-within:ring-info',
        error: 'border-destructive focus-within:ring-destructive',
      },
      size: {
        sm: 'p-1.5 text-xs',
        default: 'p-2 text-sm',
        lg: 'p-3 text-base',
      },
    },
    defaultVariants: {
      status: 'ready',
      size: 'default',
    },
  }
);

export type PromptInputProps = VariantProps<typeof promptInputVariants>;

/** Lifecycle of the response the composer is driving. */
export type PromptInputStatus = NonNullable<PromptInputProps['status']>;

/**
 * Coordinates a `tolle-prompt-input` with its projected toolbar controls.
 *
 * The submit button is an OnPush child that must flip to a stop button the
 * moment the status changes, so the composer publishes its state here instead
 * of the button reading the parent's fields.
 *
 * Provided on `PromptInputComponent`, so each composer gets its own instance.
 */
@Injectable()
export class PromptInputService {
  private readonly statusSource = new BehaviorSubject<PromptInputStatus>('ready');
  /** Emits the composer's current status. */
  readonly status$ = this.statusSource.asObservable();

  private readonly canSubmitSource = new BehaviorSubject<boolean>(false);
  /** Emits whether there is submittable text and the composer is enabled. */
  readonly canSubmit$ = this.canSubmitSource.asObservable();

  private readonly submitSource = new Subject<void>();
  /** Emits when a toolbar control asks the composer to submit. */
  readonly submit$ = this.submitSource.asObservable();

  private readonly stopSource = new Subject<void>();
  /** Emits when a toolbar control asks the composer to stop streaming. */
  readonly stop$ = this.stopSource.asObservable();

  /** The composer's current status. */
  get status(): PromptInputStatus {
    return this.statusSource.value;
  }

  /** True when the composer has submittable text. */
  get canSubmit(): boolean {
    return this.canSubmitSource.value;
  }

  setStatus(status: PromptInputStatus): void {
    if (this.statusSource.value !== status) this.statusSource.next(status);
  }

  setCanSubmit(value: boolean): void {
    if (this.canSubmitSource.value !== value) this.canSubmitSource.next(value);
  }

  requestSubmit(): void {
    this.submitSource.next();
  }

  requestStop(): void {
    this.stopSource.next();
  }
}

/**
 * A message composer: an auto-growing textarea plus a toolbar, wired as a
 * `ControlValueAccessor` so it drops into template- or reactive-driven forms.
 *
 * Enter submits and Shift+Enter inserts a newline (swap with `submitOnEnter`).
 * While `status` is 'streaming' the projected `tolle-prompt-input-submit`
 * becomes a stop button that emits `stopped`.
 * @new
 */
@Component({
  selector: 'tolle-prompt-input',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [
    PromptInputService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PromptInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <textarea
        #textarea
        data-prompt-input-textarea
        rows="1"
        [value]="value"
        [attr.placeholder]="placeholder"
        [disabled]="disabled"
        [attr.aria-label]="ariaLabel || placeholder || 'Message'"
        [attr.aria-invalid]="status === 'error' ? 'true' : null"
        [class]="textareaComputedClass"
        (input)="onInput($event)"
        (keydown)="onKeyDown($event)"
        (blur)="onBlur()"
      ></textarea>

      <ng-content></ng-content>
    </div>
  `,
})
export class PromptInputComponent
  implements ControlValueAccessor, OnInit, OnChanges, AfterViewInit, OnDestroy
{
  /** Placeholder shown while the composer is empty. @default 'Send a message…' */
  @Input() placeholder = 'Send a message…';
  /** Blocks typing and submission. @default false */
  @Input() disabled = false;
  /** Rows the textarea may grow to before it starts scrolling. @default 8 */
  @Input() maxRows = 8;
  /** Lifecycle of the response being composed. @default 'ready' */
  @Input() status: PromptInputStatus = 'ready';
  /** Size scale of the composer. @default 'default' */
  @Input() size: PromptInputProps['size'] = 'default';
  /** Submit on Enter, keeping Shift+Enter for newlines. @default true */
  @Input() submitOnEnter = true;
  /** Clears the composer after a successful submit. @default true */
  @Input() clearOnSubmit = true;
  /** Accessible name for the textarea. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the composer via `cn()` (last-wins). */
  @Input() class = '';
  /** Extra Tailwind classes merged onto the textarea via `cn()` (last-wins). */
  @Input() textareaClass = '';

  /** Emitted with the trimmed message text when the user submits. */
  @Output() submitted = new EventEmitter<string>();
  /** Emitted when the user cancels an in-flight streaming response. */
  @Output() stopped = new EventEmitter<void>();
  /** Emitted with the message text whenever it changes. */
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('textarea') private textarea?: ElementRef<HTMLTextAreaElement>;

  private readonly service = inject(PromptInputService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  value = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.syncService();
    this.subscriptions.add(this.service.submit$.subscribe(() => this.submit()));
    this.subscriptions.add(this.service.stop$.subscribe(() => this.stop()));
  }

  ngOnChanges(): void {
    this.syncService();
  
    // A bound `class` input is written through Angular's styling path,
    // which does not mark an OnPush view dirty on its own.
    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    this.resize();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get computedClass() {
    return cn(
      promptInputVariants({ status: this.status, size: this.size }),
      this.disabled && 'cursor-not-allowed opacity-60',
      this.class
    );
  }

  get textareaComputedClass() {
    return cn(
      'w-full resize-none bg-transparent px-2 py-1.5 text-sm text-foreground outline-none',
      'placeholder:text-muted-foreground disabled:cursor-not-allowed',
      this.textareaClass
    );
  }

  onInput(event: Event): void {
    const next = (event.target as HTMLTextAreaElement).value;
    this.setValue(next);
    this.resize();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || !this.submitOnEnter) return;
    // Shift+Enter is the newline escape hatch; modifier chords and IME
    // composition must never steal the keystroke.
    if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;
    if ((event as KeyboardEvent & { isComposing?: boolean }).isComposing) return;

    event.preventDefault();
    this.submit();
  }

  onBlur(): void {
    this.onTouched();
  }

  /** Submits the current text, unless the composer is empty, disabled or busy. */
  submit(): void {
    if (this.disabled || this.status === 'streaming') return;
    const text = this.value.trim();
    if (!text) return;

    this.submitted.emit(text);

    if (this.clearOnSubmit) {
      this.setValue('');
      if (this.textarea) this.textarea.nativeElement.value = '';
      this.resize();
    }
  }

  /** Cancels an in-flight streaming response. */
  stop(): void {
    this.stopped.emit();
  }

  /** Moves focus into the textarea. */
  focus(): void {
    this.textarea?.nativeElement.focus();
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
    if (this.textarea) this.textarea.nativeElement.value = this.value;
    this.service.setCanSubmit(this.canSubmit);
    this.cdr.markForCheck();
    this.resize();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.syncService();
    this.cdr.markForCheck();
  }

  private get canSubmit(): boolean {
    return !this.disabled && this.value.trim().length > 0;
  }

  private setValue(next: string): void {
    this.value = next;
    this.onChange(next);
    this.valueChange.emit(next);
    this.service.setCanSubmit(this.canSubmit);
  }

  private syncService(): void {
    this.service.setStatus(this.status);
    this.service.setCanSubmit(this.canSubmit);
  }

  /**
   * Grows the textarea with its content up to `maxRows`, then lets it scroll.
   * Measured from the computed line height so it tracks the inherited font.
   */
  private resize(): void {
    const el = this.textarea?.nativeElement;
    if (!el) return;

    el.style.height = 'auto';

    const styles = getComputedStyle(el);
    const parsedLineHeight = parseFloat(styles.lineHeight);
    const lineHeight = Number.isFinite(parsedLineHeight)
      ? parsedLineHeight
      : parseFloat(styles.fontSize) * 1.5 || 20;
    const vertical =
      parseFloat(styles.paddingTop || '0') +
      parseFloat(styles.paddingBottom || '0') +
      parseFloat(styles.borderTopWidth || '0') +
      parseFloat(styles.borderBottomWidth || '0');
    const max = lineHeight * Math.max(1, this.maxRows) + vertical;

    const next = Math.min(el.scrollHeight, max);
    el.style.height = next + 'px';
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }
}

/** Bottom bar of a `tolle-prompt-input`: tools on the left, submit on the right. */
@Component({
  selector: 'tolle-prompt-input-toolbar',
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
export class PromptInputToolbarComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Extra Tailwind classes merged onto the toolbar via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn('flex items-center justify-between gap-2 px-1', this.class);
  }
}

/** Left-aligned cluster of tool buttons inside a `tolle-prompt-input-toolbar`. */
@Component({
  selector: 'tolle-prompt-input-tools',
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
export class PromptInputToolsComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Extra Tailwind classes merged onto the tool row via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn('flex flex-1 items-center gap-1 text-muted-foreground', this.class);
  }
}

const promptInputSubmitVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-7 px-2 text-xs',
        default: 'size-8 text-sm',
        lg: 'h-10 px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type PromptInputSubmitProps = VariantProps<typeof promptInputSubmitVariants>;

/**
 * Send button for a `tolle-prompt-input`. Turns into a stop button while the
 * composer's status is 'streaming', so one control covers both directions.
 */
@Component({
  selector: 'tolle-prompt-input-submit',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-prompt-input-submit
      [attr.data-state]="status"
      [attr.aria-label]="currentLabel"
      [disabled]="isDisabled"
      [class]="computedClass"
      (click)="onClick()"
    >
      <i [class]="currentIcon" aria-hidden="true"></i>
      <span *ngIf="showLabel">{{ currentLabel }}</span>
    </button>
  `,
})
export class PromptInputSubmitComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Visual style of the button. @default 'default' */
  @Input() variant: PromptInputSubmitProps['variant'] = 'default';
  /** Size of the button. @default 'default' */
  @Input() size: PromptInputSubmitProps['size'] = 'default';
  /** Accessible name while the composer is idle. @default 'Send message' */
  @Input() submitLabel = 'Send message';
  /** Accessible name while the composer is streaming. @default 'Stop generating' */
  @Input() stopLabel = 'Stop generating';
  /** Renders the label next to the icon. @default false */
  @Input() showLabel = false;
  /** Extra Tailwind classes merged onto the button via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(PromptInputService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  status: PromptInputStatus = 'ready';
  canSubmit = false;

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.status$.subscribe((status) => {
        this.status = status;
        this.cdr.markForCheck();
      })
    );
    this.subscriptions.add(
      this.service.canSubmit$.subscribe((canSubmit) => {
        this.canSubmit = canSubmit;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** True while the button is showing its stop affordance. */
  get isStreaming(): boolean {
    return this.status === 'streaming';
  }

  get currentIcon(): string {
    return this.isStreaming ? 'ri-stop-circle-line' : 'ri-send-plane-2-fill';
  }

  get currentLabel(): string {
    return this.isStreaming ? this.stopLabel : this.submitLabel;
  }

  /** Stopping stays available with an empty composer; sending does not. */
  get isDisabled(): boolean {
    return !this.isStreaming && !this.canSubmit;
  }

  get computedClass() {
    return cn(
      promptInputSubmitVariants({ variant: this.variant, size: this.size }),
      this.isStreaming && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      this.class
    );
  }

  onClick(): void {
    if (this.isStreaming) {
      this.service.requestStop();
    } else {
      this.service.requestSubmit();
    }
  }
}
