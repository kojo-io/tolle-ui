import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

/** Progress of a single step in an agent plan. */
export type PlanStepStatus = 'pending' | 'active' | 'done' | 'skipped';

let planStepId = 0;

/** How far through the plan the agent is. */
export interface PlanProgress {
  /** 1-based position of the step being worked on, or of the last finished one. */
  current: number;
  /** Number of registered steps. */
  total: number;
}

const planVariants = cva('w-full rounded-lg border border-border bg-card p-3 text-card-foreground', {
  variants: {
    size: {
      sm: 'p-2 text-xs',
      default: 'p-3 text-sm',
    },
  },
  defaultVariants: { size: 'default' },
});

export type PlanProps = VariantProps<typeof planVariants>;

const planStepVariants = cva(
  // The connector is hidden on the final step so the line stops at the last badge.
  'relative flex gap-3 pb-3 last:pb-0 [&:last-child_.tolle-plan-rail]:hidden',
  {
    variants: {
      status: {
        pending: 'opacity-100',
        active: 'opacity-100',
        done: 'opacity-100',
        skipped: 'opacity-60',
      },
    },
    defaultVariants: { status: 'pending' },
  }
);

const planBadgeVariants = cva(
  'relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium tabular-nums',
  {
    variants: {
      status: {
        pending: 'border-border bg-background text-muted-foreground',
        active: 'border-primary bg-primary text-primary-foreground',
        done: 'border-success/50 bg-success/10 text-success',
        skipped: 'border-dashed border-border bg-background text-muted-foreground',
      },
    },
    defaultVariants: { status: 'pending' },
  }
);

export type PlanStepProps = VariantProps<typeof planStepVariants>;

/**
 * Coordinates a `tolle-plan` and its steps: assigns each step its number and
 * derives the "Step N of M" summary.
 *
 * The header is `OnPush` and the step count is not one of its inputs, so the
 * summary is published as an observable and every subscriber calls
 * `markForCheck()`.
 */
@Injectable()
export class PlanService {
  private readonly statuses = new Map<string, PlanStepStatus>();
  private readonly order: string[] = [];

  private readonly progressSource = new BehaviorSubject<PlanProgress>({ current: 0, total: 0 });
  /** Emits the plan's current position and step count. */
  readonly progress$ = this.progressSource.asObservable();

  private readonly collapsedSource = new BehaviorSubject<boolean>(false);
  /** Emits whether the plan is showing only its summary row. */
  readonly collapsed$ = this.collapsedSource.asObservable();

  get progress(): PlanProgress {
    return this.progressSource.value;
  }

  get collapsed(): boolean {
    return this.collapsedSource.value;
  }

  setCollapsed(collapsed: boolean): void {
    if (this.collapsedSource.value !== collapsed) this.collapsedSource.next(collapsed);
  }

  toggleCollapsed(): void {
    this.collapsedSource.next(!this.collapsedSource.value);
  }

  /** Registers a step and returns its 1-based number. */
  register(id: string, status: PlanStepStatus): number {
    if (!this.statuses.has(id)) this.order.push(id);
    this.statuses.set(id, status);
    this.recompute();
    return this.order.indexOf(id) + 1;
  }

  setStatus(id: string, status: PlanStepStatus): void {
    if (!this.statuses.has(id)) return;
    if (this.statuses.get(id) === status) return;
    this.statuses.set(id, status);
    this.recompute();
  }

  unregister(id: string): void {
    const index = this.order.indexOf(id);
    if (index > -1) this.order.splice(index, 1);
    this.statuses.delete(id);
    this.recompute();
  }

  /**
   * "Current" is the first step still in flight — the active one if there is
   * one, otherwise however many have already been resolved.
   */
  private recompute(): void {
    const total = this.order.length;
    const activeIndex = this.order.findIndex((id) => this.statuses.get(id) === 'active');
    const resolved = this.order.filter((id) => {
      const status = this.statuses.get(id);
      return status === 'done' || status === 'skipped';
    }).length;

    const current = activeIndex > -1 ? activeIndex + 1 : Math.min(resolved, total);
    this.progressSource.next({ current, total });
  }
}

/**
 * An ordered plan the agent intends to work through. Each `tolle-plan-step`
 * numbers itself and joins the connector line; collapsing the plan swaps the
 * steps for a single "Step N of M" summary.
 *
 * ```html
 * <tolle-plan title="Migration plan">
 *   <tolle-plan-step label="Read the schema" status="done"></tolle-plan-step>
 *   <tolle-plan-step label="Write the migration" status="active"></tolle-plan-step>
 *   <tolle-plan-step label="Run it" status="pending"></tolle-plan-step>
 * </tolle-plan>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-plan',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [PlanService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass" [attr.data-collapsed]="isCollapsed ? '' : null">
      <button
        type="button"
        [disabled]="!collapsible"
        [attr.aria-expanded]="collapsible ? !isCollapsed : null"
        [class]="headerClass"
        (click)="toggle()"
      >
        <i
          *ngIf="collapsible"
          [class]="isCollapsed ? 'ri-arrow-right-s-line shrink-0 text-muted-foreground' : 'ri-arrow-down-s-line shrink-0 text-muted-foreground'"
          aria-hidden="true"
        ></i>
        <span class="truncate font-medium text-foreground">{{ title }}</span>
        <span class="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">{{ summary }}</span>
      </button>

      <div [class]="isCollapsed ? 'hidden' : 'mt-3 flex flex-col'">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PlanComponent implements OnInit, OnChanges, OnDestroy {
  /** Heading shown above the steps. @default 'Plan' */
  @Input() title = 'Plan';
  /** Shows only the header and its "Step N of M" summary. @default false */
  @Input() collapsed = false;
  /** Lets the user collapse and expand the plan by clicking the header. @default true */
  @Input() collapsible = true;
  /** Padding and text scale of the plan. @default 'default' */
  @Input() size: PlanProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the plan via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the new collapsed state when the header is toggled. */
  @Output() collapsedChange = new EventEmitter<boolean>();

  private readonly service = inject(PlanService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub = new Subscription();

  isCollapsed = false;
  progress: PlanProgress = { current: 0, total: 0 };

  ngOnInit(): void {
    this.service.setCollapsed(this.collapsed);
    // Seeded before subscribing so the replayed initial value is not mistaken
    // for a user toggle and echoed back out as a `collapsedChange`.
    this.isCollapsed = this.collapsed;
    this.sub.add(
      this.service.collapsed$.subscribe((collapsed) => {
        const changed = this.isCollapsed !== collapsed;
        this.isCollapsed = collapsed;
        this.cdr.markForCheck();
        if (changed) this.collapsedChange.emit(collapsed);
      })
    );
    this.sub.add(
      this.service.progress$.subscribe((progress) => {
        this.progress = progress;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnChanges(): void {
    this.service.setCollapsed(this.collapsed);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  /** The compact "Step N of M" label, empty until at least one step registers. */
  get summary(): string {
    if (!this.progress.total) return '';
    return 'Step ' + Math.max(1, this.progress.current) + ' of ' + this.progress.total;
  }

  get computedClass() {
    return cn(planVariants({ size: this.size }), this.class);
  }

  get headerClass() {
    return cn(
      'flex w-full items-center gap-1.5 rounded-md text-left text-sm outline-none transition-colors',
      this.collapsible ? 'cursor-pointer' : 'cursor-default',
      'focus-visible:ring-2 focus-visible:ring-ring'
    );
  }

  toggle(): void {
    if (!this.collapsible) return;
    this.service.toggleCollapsed();
  }
}

/** One numbered step of a `tolle-plan`. */
@Component({
  selector: 'tolle-plan-step',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'computedClass', '[attr.data-status]': 'status' },
  template: `
    <span class="tolle-plan-rail absolute bottom-0 left-3 top-6 w-px -translate-x-1/2 bg-border" aria-hidden="true"></span>

    <span [class]="badgeClass">
      <i *ngIf="status === 'done'" class="ri-check-line" aria-hidden="true"></i>
      <i *ngIf="status === 'skipped'" class="ri-subtract-line" aria-hidden="true"></i>
      <ng-container *ngIf="status !== 'done' && status !== 'skipped'">{{ index }}</ng-container>
    </span>

    <div class="min-w-0 flex-1 pt-0.5">
      <p [class]="labelClass">{{ label }}</p>
      <p *ngIf="description" class="mt-0.5 text-xs text-muted-foreground">{{ description }}</p>
      <ng-content></ng-content>
    </div>
  `,
})
export class PlanStepComponent implements OnInit, OnChanges, OnDestroy {
  /** What this step does. @default '' */
  @Input() label = '';
  /** Supporting detail shown under the label. @default '' */
  @Input() description = '';
  /** Progress of this step; drives the badge colour and glyph. @default 'pending' */
  @Input() status: PlanStepStatus = 'pending';
  /** Extra Tailwind classes merged onto the step via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(PlanService);
  private readonly id = 'tolle-plan-step-' + planStepId++;

  /** 1-based position of this step, assigned on registration. */
  index = 0;

  ngOnInit(): void {
    this.index = this.service.register(this.id, this.status);
  }

  ngOnChanges(): void {
    this.service.setStatus(this.id, this.status);
  }

  ngOnDestroy(): void {
    this.service.unregister(this.id);
  }

  get computedClass() {
    return cn(planStepVariants({ status: this.status }), this.class);
  }

  get badgeClass() {
    return cn(planBadgeVariants({ status: this.status }));
  }

  get labelClass() {
    return cn(
      'text-sm',
      this.status === 'active' && 'font-medium text-foreground',
      this.status === 'done' && 'text-foreground',
      this.status === 'pending' && 'text-muted-foreground',
      this.status === 'skipped' && 'text-muted-foreground line-through'
    );
  }
}
