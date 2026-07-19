import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  forwardRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import {
  HoverCardComponent,
  HoverCardTriggerComponent,
  HoverCardContentComponent,
} from './hover-card.component';

/** How close the context window is to being full. */
export type ContextLevel = 'normal' | 'warning' | 'critical';

/** Everything a `tolle-context` knows about the current window. */
export interface ContextUsage {
  used: number;
  total: number;
  inputTokens: number | null;
  outputTokens: number | null;
  cost: number | null;
  /** Fraction of the window consumed, clamped to 0–1. */
  ratio: number;
  level: ContextLevel;
}

const contextTriggerVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium tabular-nums transition-colors',
  {
    variants: {
      level: {
        normal: 'text-muted-foreground hover:text-foreground',
        warning: 'text-warning hover:text-warning',
        critical: 'text-destructive hover:text-destructive',
      },
    },
    defaultVariants: { level: 'normal' },
  }
);

const contextBarVariants = cva('h-full rounded-full transition-[width,background-color] duration-300', {
  variants: {
    level: {
      normal: 'bg-primary',
      warning: 'bg-warning',
      critical: 'bg-destructive',
    },
  },
  defaultVariants: { level: 'normal' },
});

export type ContextProps = VariantProps<typeof contextTriggerVariants>;

/** Formats a raw token count as a short, readable string. */
export function formatTokens(value: number): string {
  if (!isFinite(value)) return '0';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (abs >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(Math.round(value));
}

/**
 * Publishes the parent `tolle-context`'s numbers to its OnPush trigger and
 * content children, which receive none of it as their own inputs.
 */
@Injectable()
export class ContextService {
  private readonly usageSource = new BehaviorSubject<ContextUsage>({
    used: 0,
    total: 0,
    inputTokens: null,
    outputTokens: null,
    cost: null,
    ratio: 0,
    level: 'normal',
  });

  /** Emits the current context-window usage. */
  readonly usage$ = this.usageSource.asObservable();

  get usage(): ContextUsage {
    return this.usageSource.value;
  }

  setUsage(usage: ContextUsage): void {
    this.usageSource.next(usage);
  }
}

/**
 * A token / context-window usage indicator: a compact percentage and bar that
 * shifts to the warning and destructive tokens as the window fills, with a
 * hover breakdown of input, output and cost.
 *
 * ```html
 * <tolle-context [used]="82000" [total]="128000" [inputTokens]="61000" [outputTokens]="21000" [cost]="0.42"></tolle-context>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-context',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [
    CommonModule,
    HoverCardComponent,
    HoverCardTriggerComponent,
    HoverCardContentComponent,
    // The sub-components are declared further down this file, so they are
    // referenced lazily rather than read at decoration time.
    forwardRef(() => ContextTriggerComponent),
    forwardRef(() => ContextContentComponent),
  ],
  providers: [ContextService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tolle-hover-card
      [openDelay]="openDelay"
      [closeDelay]="closeDelay"
      [placement]="placement"
      (mouseenter)="scheduleRefresh(openDelay)"
      (mouseleave)="scheduleRefresh(closeDelay)"
    >
      <tolle-hover-card-trigger>
        <tolle-context-trigger></tolle-context-trigger>
      </tolle-hover-card-trigger>
      <tolle-hover-card-content class="w-60 p-0">
        <tolle-context-content></tolle-context-content>
      </tolle-hover-card-content>
    </tolle-hover-card>
  `,
})
export class ContextComponent implements OnInit, OnChanges, OnDestroy {
  /** Tokens consumed so far. @default 0 */
  @Input() used = 0;
  /** Size of the context window in tokens. @default 0 */
  @Input() total = 0;
  /** Tokens spent on the prompt, shown in the breakdown. @default null */
  @Input() inputTokens: number | null = null;
  /** Tokens produced by the model, shown in the breakdown. @default null */
  @Input() outputTokens: number | null = null;
  /** Spend for this context, shown in the breakdown. @default null */
  @Input() cost: number | null = null;
  /** Ratio at or above which the indicator turns warning-coloured. @default 0.75 */
  @Input() warningThreshold = 0.75;
  /** Ratio at or above which the indicator turns destructive-coloured. @default 0.9 */
  @Input() criticalThreshold = 0.9;
  /** Side of the indicator the breakdown opens on. @default 'top' */
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  /** Milliseconds to wait before opening the breakdown. @default 150 */
  @Input() openDelay = 150;
  /** Milliseconds to wait before closing the breakdown. @default 200 */
  @Input() closeDelay = 200;
  /** Extra Tailwind classes merged onto the indicator via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(ContextService);
  private readonly cdr = inject(ChangeDetectorRef);
  private refreshTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.push();
  }

  ngOnChanges(): void {
    this.push();
  }

  /** Fraction of the window consumed, clamped to 0–1. */
  get ratio(): number {
    if (!this.total || this.total <= 0) return 0;
    return Math.min(1, Math.max(0, this.used / this.total));
  }

  /** Which colour band the current usage falls into. */
  get level(): ContextLevel {
    const ratio = this.ratio;
    if (ratio >= this.criticalThreshold) return 'critical';
    if (ratio >= this.warningThreshold) return 'warning';
    return 'normal';
  }

  private push(): void {
    this.service.setUsage({
      used: this.used,
      total: this.total,
      inputTokens: this.inputTokens,
      outputTokens: this.outputTokens,
      cost: this.cost,
      ratio: this.ratio,
      level: this.level,
    });
  }

  /**
   * `tolle-hover-card` toggles its own visibility from a `setTimeout`, which
   * never marks this OnPush view dirty — re-check once the delay has elapsed.
   */
  scheduleRefresh(delay: number): void {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => this.cdr.markForCheck(), delay + 32);
  }

  ngOnDestroy(): void {
    clearTimeout(this.refreshTimer);
  }
}

/** The always-visible part of a `tolle-context`: percentage plus usage bar. */
@Component({
  selector: 'tolle-context-trigger',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      role="meter"
      [attr.aria-valuenow]="percent"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-label]="'Context window ' + percent + '% used'"
      [attr.data-level]="usage.level"
      [class]="computedClass"
    >
      <span class="h-1.5 w-10 overflow-hidden rounded-full bg-muted">
        <span [class]="barClass" [style.width.%]="percent"></span>
      </span>
      <span>{{ percent }}%</span>
      <ng-content></ng-content>
    </span>
  `,
})
export class ContextTriggerComponent implements OnInit, OnDestroy {
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(ContextService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub = new Subscription();

  usage: ContextUsage = this.service.usage;

  ngOnInit(): void {
    this.sub.add(
      this.service.usage$.subscribe((usage) => {
        this.usage = usage;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  /** Usage as a whole percentage. */
  get percent(): number {
    return Math.round(this.usage.ratio * 100);
  }

  get computedClass() {
    return cn(contextTriggerVariants({ level: this.usage.level }), this.class);
  }

  get barClass() {
    return cn('block', contextBarVariants({ level: this.usage.level }));
  }
}

/** The hover breakdown of a `tolle-context`: used, total, input, output, cost. */
@Component({
  selector: 'tolle-context-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <div class="flex items-baseline justify-between gap-2">
        <span class="text-sm font-medium text-popover-foreground">Context</span>
        <span class="text-xs tabular-nums text-muted-foreground">{{ tokens(usage.used) }} / {{ tokens(usage.total) }}</span>
      </div>
      <dl class="mt-2 flex flex-col gap-1 text-xs">
        <div *ngIf="usage.inputTokens !== null" class="flex items-center justify-between gap-2">
          <dt class="text-muted-foreground">Input</dt>
          <dd class="tabular-nums text-popover-foreground">{{ tokens(usage.inputTokens) }}</dd>
        </div>
        <div *ngIf="usage.outputTokens !== null" class="flex items-center justify-between gap-2">
          <dt class="text-muted-foreground">Output</dt>
          <dd class="tabular-nums text-popover-foreground">{{ tokens(usage.outputTokens) }}</dd>
        </div>
        <div *ngIf="usage.cost !== null" class="flex items-center justify-between gap-2">
          <dt class="text-muted-foreground">Cost</dt>
          <dd class="tabular-nums text-popover-foreground">{{ currency }}{{ usage.cost }}</dd>
        </div>
      </dl>
      <ng-content></ng-content>
    </div>
  `,
})
export class ContextContentComponent implements OnInit, OnDestroy {
  /** Symbol prefixed to the cost figure. @default '$' */
  @Input() currency = '$';
  /** Extra Tailwind classes merged onto the breakdown via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(ContextService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub = new Subscription();

  usage: ContextUsage = this.service.usage;
  protected tokens = formatTokens;

  ngOnInit(): void {
    this.sub.add(
      this.service.usage$.subscribe((usage) => {
        this.usage = usage;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get computedClass() {
    return cn('flex flex-col p-3', this.class);
  }
}
