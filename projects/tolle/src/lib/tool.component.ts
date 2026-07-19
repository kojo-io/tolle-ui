import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  EventEmitter,
  Injectable,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const toolStateVariants = cva(
  'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      state: {
        pending: 'bg-muted text-muted-foreground',
        running: 'bg-info/10 text-info',
        success: 'bg-success/10 text-success',
        error: 'bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: {
      state: 'pending',
    },
  }
);

export type ToolStateProps = VariantProps<typeof toolStateVariants>;

/** Lifecycle of a tool call. */
export type ToolState = NonNullable<ToolStateProps['state']>;

/** Remixicon class shown in the state chip for each state. */
const TOOL_STATE_ICONS: Record<ToolState, string> = {
  pending: 'ri-time-line',
  running: 'ri-loader-4-line animate-spin',
  success: 'ri-check-line',
  error: 'ri-error-warning-line',
};

/** Default chip text for each state. */
const TOOL_STATE_LABELS: Record<ToolState, string> = {
  pending: 'Pending',
  running: 'Running',
  success: 'Completed',
  error: 'Error',
};

/**
 * Coordinates a `tolle-tool` with its header, input and output.
 *
 * Header/input/output are OnPush siblings projected into the tool, so the
 * shared open + state they render from is published here.
 *
 * Provided on `ToolComponent`, so each tool call gets its own instance.
 */
@Injectable()
export class ToolService {
  private readonly openSource = new BehaviorSubject<boolean>(false);
  /** Emits whether the tool call is expanded. */
  readonly open$ = this.openSource.asObservable();

  private readonly stateSource = new BehaviorSubject<ToolState>('pending');
  /** Emits the tool call's lifecycle state. */
  readonly state$ = this.stateSource.asObservable();

  /** True while the tool call is expanded. */
  get open(): boolean {
    return this.openSource.value;
  }

  /** The tool call's current state. */
  get state(): ToolState {
    return this.stateSource.value;
  }

  setOpen(value: boolean): void {
    if (this.openSource.value !== value) this.openSource.next(value);
  }

  toggle(): void {
    this.setOpen(!this.openSource.value);
  }

  setState(state: ToolState): void {
    if (this.stateSource.value !== state) this.stateSource.next(state);
  }
}

const toolVariants = cva('w-full overflow-hidden rounded-md border bg-card text-card-foreground', {
  variants: {
    state: {
      pending: 'border-border',
      running: 'border-info/40',
      success: 'border-border',
      error: 'border-destructive/40',
    },
  },
  defaultVariants: {
    state: 'pending',
  },
});

export type ToolProps = VariantProps<typeof toolVariants>;

/**
 * A collapsible record of one tool/function call: what was invoked, the
 * arguments it received and the result it returned.
 *
 * Compose it from `tolle-tool-header`, `tolle-tool-input` and
 * `tolle-tool-output`.
 * @new
 */
@Component({
  selector: 'tolle-tool',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [ToolService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass" [attr.data-state]="open ? 'open' : 'closed'">
      <ng-content></ng-content>
    </div>
  `,
})
export class ToolComponent implements OnInit, OnChanges, OnDestroy {
  /** Lifecycle of the call, driving the header chip and border. @default 'pending' */
  @Input() state: ToolState = 'pending';
  /** Whether the call's input and output are expanded. @default false */
  @Input() open = false;
  /** Extra Tailwind classes merged onto the tool via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the new state whenever the call is expanded or collapsed. */
  @Output() openChange = new EventEmitter<boolean>();

  private readonly service = inject(ToolService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();
  /** True while an `open` input is being pushed into the service. */
  private applyingInput = false;

  ngOnInit(): void {
    this.service.setOpen(this.open);
    this.service.setState(this.state);
    // `skip(1)` drops the BehaviorSubject's current value so mounting never
    // emits a spurious `openChange`.
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
    this.service.setState(this.state);
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
    return cn(toolVariants({ state: this.state }), this.class);
  }
}

/** Clickable header of a `tolle-tool`: the tool's name plus its state chip. */
@Component({
  selector: 'tolle-tool-header',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-tool-header
      [attr.aria-expanded]="open"
      [attr.data-state]="open ? 'open' : 'closed'"
      [class]="computedClass"
      (click)="onToggle()"
    >
      <i [class]="icon" class="shrink-0 text-muted-foreground" aria-hidden="true"></i>

      <span class="truncate font-medium text-foreground" data-tool-name>{{ name }}</span>

      <span [class]="chipClass" data-tool-state>
        <i [class]="stateIcon" aria-hidden="true"></i>
        {{ stateLabel }}
      </span>

      <i
        class="ri-arrow-down-s-line shrink-0 text-muted-foreground transition-transform duration-200"
        [class.rotate-180]="open"
        aria-hidden="true"
      ></i>

      <ng-content></ng-content>
    </button>
  `,
})
export class ToolHeaderComponent implements OnInit, OnDestroy {
  /** Name of the tool that was called. @default '' */
  @Input() name = '';
  /** Remixicon class shown before the tool name. @default 'ri-tools-line' */
  @Input() icon = 'ri-tools-line';
  /** Overrides the chip text; defaults to a label derived from the state. @default '' */
  @Input() stateLabelOverride = '';
  /** Extra Tailwind classes merged onto the header via `cn()` (last-wins). */
  @Input() class = '';
  /** Extra Tailwind classes merged onto the state chip via `cn()` (last-wins). */
  @Input() chipClassName = '';

  private readonly service = inject(ToolService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  open = false;
  state: ToolState = 'pending';

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.open$.subscribe((open) => {
        this.open = open;
        this.cdr.markForCheck();
      })
    );
    this.subscriptions.add(
      this.service.state$.subscribe((state) => {
        this.state = state;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get stateIcon(): string {
    return TOOL_STATE_ICONS[this.state];
  }

  get stateLabel(): string {
    return this.stateLabelOverride || TOOL_STATE_LABELS[this.state];
  }

  get chipClass() {
    return cn(toolStateVariants({ state: this.state }), this.chipClassName);
  }

  get computedClass() {
    return cn(
      'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
      'hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
      this.class
    );
  }

  onToggle(): void {
    this.service.toggle();
  }
}

/**
 * Base for the two payload panels. Owns the shared "visible only while the
 * tool is expanded" wiring and the payload-to-text formatting.
 *
 * Decorated with a selector-less `@Directive()` because it uses Angular
 * features (DI and lifecycle hooks) on behalf of its subclasses.
 */
@Directive()
export abstract class ToolPayloadBase implements OnInit, OnDestroy {
  /** Payload to render; objects are pretty-printed as JSON, strings are shown as-is. */
  payload: unknown = null;

  protected readonly service = inject(ToolService);
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

  /** True once there is a payload worth rendering. */
  get hasPayload(): boolean {
    return this.payload !== null && this.payload !== undefined && this.payload !== '';
  }

  /** The payload as display text. Falls back to `String()` for cyclic values. */
  get formatted(): string {
    if (typeof this.payload === 'string') return this.payload;
    try {
      return JSON.stringify(this.payload, null, 2) ?? String(this.payload);
    } catch {
      return String(this.payload);
    }
  }
}

/** Arguments the tool was called with. Visible while the `tolle-tool` is expanded. */
@Component({
  selector: 'tolle-tool-input',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="open" data-tool-input [class]="computedClass">
      <p *ngIf="label" class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {{ label }}
      </p>

      <pre
        *ngIf="hasPayload; else projected"
        class="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs text-foreground"
      >{{ formatted }}</pre>

      <ng-template #projected>
        <div class="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs text-foreground">
          <ng-content></ng-content>
        </div>
      </ng-template>
    </div>
  `,
})
export class ToolInputComponent extends ToolPayloadBase {
  /** Arguments passed to the tool; objects are pretty-printed as JSON. @default null */
  @Input() override payload: unknown = null;
  /** Heading above the payload. @default 'Parameters' */
  @Input() label = 'Parameters';
  /** Extra Tailwind classes merged onto the panel via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn('flex flex-col gap-1.5 border-t border-border px-3 py-2', this.class);
  }
}

/** Result the tool returned. Visible while the `tolle-tool` is expanded. */
@Component({
  selector: 'tolle-tool-output',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="open" data-tool-output [class]="computedClass">
      <p *ngIf="label" class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {{ label }}
      </p>

      <pre *ngIf="hasPayload; else projected" [class]="payloadClass">{{ formatted }}</pre>

      <ng-template #projected>
        <div [class]="payloadClass">
          <ng-content></ng-content>
        </div>
      </ng-template>
    </div>
  `,
})
export class ToolOutputComponent extends ToolPayloadBase {
  /** Result returned by the tool; objects are pretty-printed as JSON. @default null */
  @Input() override payload: unknown = null;
  /** Heading above the payload. @default 'Result' */
  @Input() label = 'Result';
  /** Styles the payload as a failure. @default false */
  @Input() error = false;
  /** Extra Tailwind classes merged onto the panel via `cn()` (last-wins). */
  @Input() class = '';

  get payloadClass() {
    return cn(
      'overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs text-foreground',
      this.error && 'bg-destructive/10 text-destructive'
    );
  }

  get computedClass() {
    return cn('flex flex-col gap-1.5 border-t border-border px-3 py-2', this.class);
  }
}
