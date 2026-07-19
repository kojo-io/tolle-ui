import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injectable, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

let sourceId = 0;

/**
 * Coordinates a `tolle-sources` with its trigger, content and sources.
 *
 * The trigger has to report how many sources were projected into a sibling
 * component, so every `tolle-source` registers here and the trigger renders
 * from the resulting count.
 *
 * Provided on `SourcesComponent`, so each citation list gets its own instance.
 */
@Injectable()
export class SourcesService {
  private readonly openSource = new BehaviorSubject<boolean>(false);
  /** Emits whether the citation list is expanded. */
  readonly open$ = this.openSource.asObservable();

  private readonly idsSource = new BehaviorSubject<string[]>([]);
  /** Emits the ids of the registered sources, in registration (DOM) order. */
  readonly ids$ = this.idsSource.asObservable();

  /** True while the citation list is expanded. */
  get open(): boolean {
    return this.openSource.value;
  }

  /** How many sources are currently registered. */
  get count(): number {
    return this.idsSource.value.length;
  }

  setOpen(value: boolean): void {
    if (this.openSource.value !== value) this.openSource.next(value);
  }

  toggle(): void {
    this.setOpen(!this.openSource.value);
  }

  register(id: string): void {
    if (this.idsSource.value.includes(id)) return;
    this.idsSource.next([...this.idsSource.value, id]);
  }

  unregister(id: string): void {
    this.idsSource.next(this.idsSource.value.filter((existing) => existing !== id));
  }

  /** Zero-based position of a source, or -1 when it is not registered. */
  indexOf(id: string): number {
    return this.idsSource.value.indexOf(id);
  }
}

const sourcesVariants = cva('flex w-full flex-col gap-2 text-sm', {
  variants: {
    variant: {
      default: '',
      card: 'rounded-md border border-border bg-card p-3 text-card-foreground',
      muted: 'rounded-md bg-muted p-3',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type SourcesProps = VariantProps<typeof sourcesVariants>;

/**
 * A collapsible list of the citations behind a response.
 *
 * Compose it from `tolle-sources-trigger`, `tolle-sources-content` and one
 * `tolle-source` per citation — the trigger counts the sources for you.
 * @new
 */
@Component({
  selector: 'tolle-sources',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [SourcesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass" [attr.data-state]="open ? 'open' : 'closed'">
      <ng-content></ng-content>
    </div>
  `,
})
export class SourcesComponent implements OnInit, OnChanges, OnDestroy {
  /** Whether the citation list is expanded. @default false */
  @Input() open = false;
  /** Visual treatment of the list container. @default 'default' */
  @Input() variant: SourcesProps['variant'] = 'default';
  /** Extra Tailwind classes merged onto the list via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the new state whenever the list is expanded or collapsed. */
  @Output() openChange = new EventEmitter<boolean>();

  private readonly service = inject(SourcesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();
  /** True while an `open` input is being pushed into the service. */
  private applyingInput = false;

  ngOnInit(): void {
    this.service.setOpen(this.open);
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
    return cn(sourcesVariants({ variant: this.variant }), this.class);
  }
}

/** Toggle for a `tolle-sources`, labelled with how many sources there are. */
@Component({
  selector: 'tolle-sources-trigger',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-sources-trigger
      [attr.aria-expanded]="open"
      [attr.data-state]="open ? 'open' : 'closed'"
      [class]="computedClass"
      (click)="onToggle()"
    >
      <i class="ri-links-line" aria-hidden="true"></i>

      <span data-sources-label>{{ label }}</span>

      <i
        class="ri-arrow-down-s-line transition-transform duration-200"
        [class.rotate-180]="open"
        aria-hidden="true"
      ></i>

      <ng-content></ng-content>
    </button>
  `,
})
export class SourcesTriggerComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Overrides the counted number of sources. @default null */
  @Input() count: number | null = null;
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(SourcesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  open = false;
  registered = 0;

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.open$.subscribe((open) => {
        this.open = open;
        this.cdr.markForCheck();
      })
    );
    this.subscriptions.add(
      this.service.ids$.subscribe((ids) => {
        this.registered = ids.length;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** How many sources the trigger reports. */
  get total(): number {
    return this.count ?? this.registered;
  }

  get label(): string {
    return 'Used ' + this.total + (this.total === 1 ? ' source' : ' sources');
  }

  get computedClass() {
    return cn(
      'flex w-fit items-center gap-1.5 rounded-md px-1.5 py-1 text-sm text-muted-foreground transition-colors',
      'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      this.class
    );
  }

  onToggle(): void {
    this.service.toggle();
  }
}

/**
 * Holds the `tolle-source` entries of a `tolle-sources`.
 *
 * Stays in the DOM while collapsed — hidden and `inert` rather than removed —
 * so the sources inside it stay registered and the trigger's count is right
 * before the list has ever been opened.
 */
@Component({
  selector: 'tolle-sources-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      data-sources-content
      [attr.data-state]="open ? 'open' : 'closed'"
      [attr.inert]="open ? null : ''"
      [attr.aria-hidden]="open ? null : 'true'"
      [class]="computedClass"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class SourcesContentComponent implements OnChanges, OnInit, OnDestroy {

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

  private readonly service = inject(SourcesService);
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
    return cn('flex flex-col gap-1.5', !this.open && 'hidden', this.class);
  }
}

const sourceVariants = cva(
  'group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export type SourceProps = VariantProps<typeof sourceVariants>;

/** A single citation inside a `tolle-sources-content`. */
@Component({
  selector: 'tolle-source',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      data-source
      [attr.href]="href || null"
      target="_blank"
      rel="noreferrer noopener"
      [class]="computedClass"
    >
      <img
        *ngIf="favicon; else chip"
        [attr.src]="favicon"
        alt=""
        aria-hidden="true"
        class="size-4 shrink-0 rounded-sm"
      />

      <ng-template #chip>
        <span
          class="flex size-4 shrink-0 items-center justify-center rounded-sm bg-muted text-[10px] font-medium text-muted-foreground"
          aria-hidden="true"
          >{{ position }}</span
        >
      </ng-template>

      <span class="truncate text-foreground" data-source-title>{{ title || href }}</span>

      <i
        class="ri-external-link-line ml-auto shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      ></i>

      <ng-content></ng-content>
    </a>
  `,
})
export class SourceComponent implements OnChanges, OnInit, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** URL the citation points at. @default '' */
  @Input() href = '';
  /** Human-readable title; falls back to the href when empty. @default '' */
  @Input() title = '';
  /** URL of a favicon shown instead of the numbered chip. @default '' */
  @Input() favicon = '';
  /** Overrides the auto-numbered position chip. @default null */
  @Input() index: number | null = null;
  /** Text scale of the citation. @default 'default' */
  @Input() size: SourceProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the citation via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(SourcesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly subscriptions = new Subscription();

  private readonly id = 'source-' + sourceId++;

  order = 0;

  ngOnInit(): void {
    this.service.register(this.id);
    this.subscriptions.add(
      this.service.ids$.subscribe(() => {
        this.order = this.service.indexOf(this.id);
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.service.unregister(this.id);
    this.subscriptions.unsubscribe();
  }

  /** One-based number shown in the chip. */
  get position(): number {
    return this.index ?? this.order + 1;
  }

  get computedClass() {
    return cn(sourceVariants({ size: this.size }), this.class);
  }
}
