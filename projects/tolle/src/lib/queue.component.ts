import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injectable, Input, OnChanges, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

/** Where a queued entry is in its lifecycle. */
export type QueueItemStatus = 'queued' | 'running' | 'done';

let queueItemId = 0;

/** Tallies of the entries currently in a queue. */
export interface QueueCounts {
  total: number;
  queued: number;
  running: number;
  done: number;
}

const queueVariants = cva('w-full rounded-lg border border-border bg-card text-card-foreground', {
  variants: {
    size: {
      sm: 'p-2 text-xs',
      default: 'p-3 text-sm',
    },
  },
  defaultVariants: { size: 'default' },
});

export type QueueProps = VariantProps<typeof queueVariants>;

const queueItemVariants = cva(
  'group/queue-item flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-colors',
  {
    variants: {
      status: {
        queued: 'border-border bg-background text-muted-foreground',
        running: 'border-info/40 bg-info/5 text-foreground',
        done: 'border-transparent bg-transparent text-muted-foreground',
      },
    },
    defaultVariants: { status: 'queued' },
  }
);

const queueItemIconVariants = cva('shrink-0 text-base leading-none', {
  variants: {
    status: {
      queued: 'text-muted-foreground',
      running: 'text-info',
      done: 'text-success',
    },
  },
  defaultVariants: { status: 'queued' },
});

export type QueueItemProps = VariantProps<typeof queueItemVariants>;

/** Remixicon class shown for each queue item status. */
const QUEUE_ICONS: Record<QueueItemStatus, string> = {
  queued: 'ri-time-line',
  running: 'ri-loader-4-line animate-spin',
  done: 'ri-check-line',
};

/**
 * Counts the items of a single `tolle-queue`.
 *
 * The header is `OnPush` and the item count is not one of its inputs, so it is
 * published as an observable and the subscriber calls `markForCheck()`.
 */
@Injectable()
export class QueueService {
  private readonly statuses = new Map<string, QueueItemStatus>();

  private readonly countsSource = new BehaviorSubject<QueueCounts>({
    total: 0,
    queued: 0,
    running: 0,
    done: 0,
  });
  /** Emits the queue's tallies whenever an item is added, updated or removed. */
  readonly counts$ = this.countsSource.asObservable();

  get counts(): QueueCounts {
    return this.countsSource.value;
  }

  register(id: string, status: QueueItemStatus): void {
    this.statuses.set(id, status);
    this.recompute();
  }

  setStatus(id: string, status: QueueItemStatus): void {
    if (!this.statuses.has(id)) return;
    if (this.statuses.get(id) === status) return;
    this.statuses.set(id, status);
    this.recompute();
  }

  unregister(id: string): void {
    if (this.statuses.delete(id)) this.recompute();
  }

  private recompute(): void {
    const values = [...this.statuses.values()];
    this.countsSource.next({
      total: values.length,
      queued: values.filter((status) => status === 'queued').length,
      running: values.filter((status) => status === 'running').length,
      done: values.filter((status) => status === 'done').length,
    });
  }
}

/**
 * Messages or tasks waiting their turn. The header counts the entries for you,
 * so the host only has to render `tolle-queue-item` children.
 *
 * ```html
 * <tolle-queue title="Queued">
 *   <tolle-queue-item label="Summarise the thread" status="running"></tolle-queue-item>
 *   <tolle-queue-item label="Draft a reply" (remove)="drop(1)"></tolle-queue-item>
 * </tolle-queue>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-queue',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [QueueService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <div class="flex items-center gap-2">
        <i class="ri-stack-line shrink-0 text-muted-foreground" aria-hidden="true"></i>
        <span class="truncate font-medium text-foreground">{{ title }}</span>
        <span [class]="countClass" [attr.aria-label]="counts.total + ' items queued'">{{ counts.total }}</span>
      </div>

      <p *ngIf="counts.total === 0" class="mt-2 text-sm text-muted-foreground">{{ emptyMessage }}</p>

      <div role="list" [class]="listClass">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class QueueComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Heading shown above the queued items. @default 'Queue' */
  @Input() title = 'Queue';
  /** Text shown while the queue holds nothing. @default 'Nothing queued.' */
  @Input() emptyMessage = 'Nothing queued.';
  /** Padding and text scale of the queue. @default 'default' */
  @Input() size: QueueProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the queue via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the queue's tallies whenever its items change. */
  @Output() countsChange = new EventEmitter<QueueCounts>();

  private readonly service = inject(QueueService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub = new Subscription();

  counts: QueueCounts = this.service.counts;

  ngOnInit(): void {
    this.sub.add(
      this.service.counts$.subscribe((counts) => {
        this.counts = counts;
        this.cdr.markForCheck();
        this.countsChange.emit(counts);
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get computedClass() {
    return cn(queueVariants({ size: this.size }), this.class);
  }

  get countClass() {
    return cn(
      'ml-auto shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground'
    );
  }

  get listClass() {
    return cn(this.counts.total === 0 ? 'flex flex-col' : 'mt-2 flex flex-col gap-1');
  }
}

/** A single entry in a `tolle-queue`. */
@Component({
  selector: 'tolle-queue-item',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="listitem" [class]="computedClass" [attr.data-status]="status">
      <i [class]="iconClass" aria-hidden="true"></i>

      <span [class]="labelClass">{{ label }}</span>
      <ng-content></ng-content>

      <button
        *ngIf="removable"
        type="button"
        [attr.aria-label]="removeLabel"
        class="ml-auto shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        (click)="remove.emit()"
      >
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
    </div>
  `,
})
export class QueueItemComponent implements OnInit, OnChanges, OnDestroy {
  /** Text describing the queued work. @default '' */
  @Input() label = '';
  /** Lifecycle state of this entry. @default 'queued' */
  @Input() status: QueueItemStatus = 'queued';
  /** Shows the trailing dismiss button that emits `remove`. @default true */
  @Input() removable = true;
  /** Accessible label for the dismiss button. @default 'Remove from queue' */
  @Input() removeLabel = 'Remove from queue';
  /** Extra Tailwind classes merged onto the entry via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted when the user dismisses this entry. */
  @Output() remove = new EventEmitter<void>();

  private readonly service = inject(QueueService);
  private readonly id = 'tolle-queue-item-' + queueItemId++;

  ngOnInit(): void {
    this.service.register(this.id, this.status);
  }

  ngOnChanges(): void {
    this.service.setStatus(this.id, this.status);
  }

  ngOnDestroy(): void {
    this.service.unregister(this.id);
  }

  get computedClass() {
    return cn(queueItemVariants({ status: this.status }), this.class);
  }

  get iconClass() {
    return cn(queueItemIconVariants({ status: this.status }), QUEUE_ICONS[this.status]);
  }

  get labelClass() {
    return cn('min-w-0 flex-1 truncate', this.status === 'done' && 'line-through');
  }
}
