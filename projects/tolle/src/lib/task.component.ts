import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injectable, Input, OnChanges, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

/** Lifecycle of a single agent task. */
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'error';

const taskVariants = cva(
  'w-full rounded-lg border bg-card text-card-foreground transition-colors',
  {
    variants: {
      status: {
        pending: 'border-border',
        'in-progress': 'border-info/40',
        completed: 'border-success/40',
        error: 'border-destructive/40',
      },
    },
    defaultVariants: { status: 'pending' },
  }
);

const taskIconVariants = cva('shrink-0 text-base leading-none', {
  variants: {
    status: {
      pending: 'text-muted-foreground',
      'in-progress': 'text-info',
      completed: 'text-success',
      error: 'text-destructive',
    },
  },
  defaultVariants: { status: 'pending' },
});

export type TaskProps = VariantProps<typeof taskVariants>;

/** Remixicon class used for each task status. */
const TASK_ICONS: Record<TaskStatus, string> = {
  pending: 'ri-circle-line',
  'in-progress': 'ri-loader-4-line animate-spin',
  completed: 'ri-checkbox-circle-fill',
  error: 'ri-error-warning-fill',
};

/**
 * Coordinates a `tolle-task` and its trigger/content children.
 *
 * The children are `OnPush` and none of the parent's state arrives as their own
 * inputs, so it is published here as observables and every subscriber calls
 * `markForCheck()`.
 */
@Injectable()
export class TaskService {
  private readonly openSource = new BehaviorSubject<boolean>(false);
  /** Emits whether the task's content is expanded. */
  readonly open$ = this.openSource.asObservable();

  private readonly statusSource = new BehaviorSubject<TaskStatus>('pending');
  /** Emits the task's current status. */
  readonly status$ = this.statusSource.asObservable();

  private readonly titleSource = new BehaviorSubject<string>('');
  /** Emits the task's title. */
  readonly title$ = this.titleSource.asObservable();

  get open(): boolean {
    return this.openSource.value;
  }

  get status(): TaskStatus {
    return this.statusSource.value;
  }

  get title(): string {
    return this.titleSource.value;
  }

  setOpen(open: boolean): void {
    if (this.openSource.value !== open) this.openSource.next(open);
  }

  toggle(): void {
    this.openSource.next(!this.openSource.value);
  }

  setStatus(status: TaskStatus): void {
    if (this.statusSource.value !== status) this.statusSource.next(status);
  }

  setTitle(title: string): void {
    if (this.titleSource.value !== title) this.titleSource.next(title);
  }
}

/**
 * A collapsible record of one unit of agent work — a title, a status, and the
 * individual steps taken, revealed on demand.
 *
 * ```html
 * <tolle-task status="completed" title="Read the codebase" [open]="true">
 *   <tolle-task-trigger></tolle-task-trigger>
 *   <tolle-task-content>
 *     <tolle-task-item>
 *       Searched <tolle-task-item-file>utils/cn.ts</tolle-task-item-file>
 *     </tolle-task-item>
 *   </tolle-task-content>
 * </tolle-task>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-task',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [TaskService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="computedClass" [attr.data-status]="status"><ng-content></ng-content></div>`,
})
export class TaskComponent implements OnInit, OnChanges, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  /** Lifecycle state of the task; drives the icon and border colour. @default 'pending' */
  @Input() status: TaskStatus = 'pending';
  /** Title shown by `tolle-task-trigger`. @default '' */
  @Input() title = '';
  /** Whether the task's content is expanded. @default false */
  @Input() open = false;
  /** Extra Tailwind classes merged onto the task via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the new expanded state whenever the task opens or closes. */
  @Output() openChange = new EventEmitter<boolean>();

  private readonly service = inject(TaskService);
  private readonly sub = new Subscription();

  ngOnInit(): void {
    this.push();
    // skip(1) drops the BehaviorSubject's replayed value so the component does
    // not emit an `openChange` for its own initial state.
    this.sub.add(this.service.open$.pipe(skip(1)).subscribe((open) => this.openChange.emit(open)));
  }

  ngOnChanges(): void {
    this.push();
  
    // A bound `class` input is written through Angular's styling path,
    // which does not mark an OnPush view dirty on its own.
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private push(): void {
    this.service.setStatus(this.status);
    this.service.setTitle(this.title);
    this.service.setOpen(this.open);
  }

  get computedClass() {
    return cn(taskVariants({ status: this.status }), this.class);
  }
}

/** Header row of a `tolle-task`: status icon, title, and the expand chevron. */
@Component({
  selector: 'tolle-task-trigger',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [attr.aria-expanded]="isOpen"
      [attr.data-state]="isOpen ? 'open' : 'closed'"
      [class]="computedClass"
      (click)="toggle()"
    >
      <i [class]="iconClass" [attr.data-status]="status" aria-hidden="true"></i>
      <span class="min-w-0 flex-1 truncate text-left">{{ title }}</span>
      <ng-content></ng-content>
      <i
        [class]="isOpen ? 'ri-arrow-down-s-line shrink-0 text-muted-foreground' : 'ri-arrow-right-s-line shrink-0 text-muted-foreground'"
        aria-hidden="true"
      ></i>
    </button>
  `,
})
export class TaskTriggerComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(TaskService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub = new Subscription();

  isOpen = false;
  status: TaskStatus = 'pending';
  title = '';

  ngOnInit(): void {
    this.sub.add(
      this.service.open$.subscribe((open) => {
        this.isOpen = open;
        this.cdr.markForCheck();
      })
    );
    this.sub.add(
      this.service.status$.subscribe((status) => {
        this.status = status;
        this.cdr.markForCheck();
      })
    );
    this.sub.add(
      this.service.title$.subscribe((title) => {
        this.title = title;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get iconClass() {
    return cn(taskIconVariants({ status: this.status }), TASK_ICONS[this.status]);
  }

  get computedClass() {
    return cn(
      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors',
      'hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring',
      this.class
    );
  }

  toggle(): void {
    this.service.toggle();
  }
}

/** The body of a `tolle-task`; rendered only while the task is expanded. */
@Component({
  selector: 'tolle-task-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isOpen" [attr.data-state]="'open'" [class]="computedClass">
      <ng-content></ng-content>
    </div>
  `,
})
export class TaskContentComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Extra Tailwind classes merged onto the content via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(TaskService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub = new Subscription();

  isOpen = false;

  ngOnInit(): void {
    this.sub.add(
      this.service.open$.subscribe((open) => {
        this.isOpen = open;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get computedClass() {
    return cn('flex flex-col gap-1 border-t border-border px-3 py-2', this.class);
  }
}

/** One line of work inside a `tolle-task-content`. */
@Component({
  selector: 'tolle-task-item',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <i class="ri-corner-down-right-line mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true"></i>
      <span class="min-w-0 flex-1"><ng-content></ng-content></span>
    </div>
  `,
})
export class TaskItemComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Extra Tailwind classes merged onto the item via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn('flex items-start gap-2 text-sm text-muted-foreground', this.class);
  }
}

/** An inline file chip, for naming the file a task step touched. */
@Component({
  selector: 'tolle-task-item-file',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="computedClass">
      <i [class]="icon + ' shrink-0 text-muted-foreground'" aria-hidden="true"></i>
      <ng-content></ng-content>
    </span>
  `,
})
export class TaskItemFileComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Remixicon class for the leading file glyph. @default 'ri-file-line' */
  @Input() icon = 'ri-file-line';
  /** Extra Tailwind classes merged onto the chip via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(
      'inline-flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5 align-middle text-xs font-medium text-foreground',
      this.class
    );
  }
}
