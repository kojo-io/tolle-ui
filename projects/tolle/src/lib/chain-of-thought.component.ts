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
import { skip } from 'rxjs/operators';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

/** Progress of a single reasoning step. */
export type ChainOfThoughtStepStatus = 'pending' | 'active' | 'complete';

const chainOfThoughtVariants = cva('w-full text-sm', {
  variants: {
    size: {
      sm: 'text-xs',
      default: 'text-sm',
    },
  },
  defaultVariants: { size: 'default' },
});

export type ChainOfThoughtProps = VariantProps<typeof chainOfThoughtVariants>;

const chainOfThoughtStepVariants = cva(
  // The rail is hidden on the final step so the line stops at the last marker
  // instead of trailing off the bottom of the list.
  'relative flex gap-3 pb-4 last:pb-0 [&:last-child_.tolle-cot-rail]:hidden',
  {
    variants: {
      status: {
        pending: 'text-muted-foreground',
        active: 'text-foreground',
        complete: 'text-muted-foreground',
      },
    },
    defaultVariants: { status: 'complete' },
  }
);

const chainOfThoughtMarkerVariants = cva(
  'relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px]',
  {
    variants: {
      status: {
        pending: 'border-border bg-background text-muted-foreground',
        active: 'border-info bg-info/10 text-info',
        complete: 'border-success/50 bg-success/10 text-success',
      },
    },
    defaultVariants: { status: 'complete' },
  }
);

export type ChainOfThoughtStepProps = VariantProps<typeof chainOfThoughtStepVariants>;

/**
 * Coordinates a `tolle-chain-of-thought` and its header/content children.
 *
 * The children are `OnPush` and receive none of this state as inputs, so it
 * travels as observables and each subscriber calls `markForCheck()`.
 */
@Injectable()
export class ChainOfThoughtService {
  private readonly openSource = new BehaviorSubject<boolean>(false);
  /** Emits whether the reasoning trace is expanded. */
  readonly open$ = this.openSource.asObservable();

  get open(): boolean {
    return this.openSource.value;
  }

  setOpen(open: boolean): void {
    if (this.openSource.value !== open) this.openSource.next(open);
  }

  toggle(): void {
    this.openSource.next(!this.openSource.value);
  }
}

/**
 * A collapsible reasoning trace — the numbered steps an agent worked through
 * before answering, connected by a vertical rail.
 *
 * ```html
 * <tolle-chain-of-thought [open]="true">
 *   <tolle-chain-of-thought-header label="Thought for 4s"></tolle-chain-of-thought-header>
 *   <tolle-chain-of-thought-content>
 *     <tolle-chain-of-thought-step label="Searched the docs" status="complete" icon="ri-search-line">
 *       <tolle-chain-of-thought-search-results>
 *         <tolle-chain-of-thought-search-result>tailwind.config</tolle-chain-of-thought-search-result>
 *       </tolle-chain-of-thought-search-results>
 *     </tolle-chain-of-thought-step>
 *   </tolle-chain-of-thought-content>
 * </tolle-chain-of-thought>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-chain-of-thought',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [ChainOfThoughtService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="computedClass"><ng-content></ng-content></div>`,
})
export class ChainOfThoughtComponent implements OnInit, OnChanges, OnDestroy {
  /** Whether the reasoning steps are expanded. @default false */
  @Input() open = false;
  /** Text scale of the whole trace. @default 'default' */
  @Input() size: ChainOfThoughtProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the trace via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the new expanded state whenever the trace opens or closes. */
  @Output() openChange = new EventEmitter<boolean>();

  private readonly service = inject(ChainOfThoughtService);
  private readonly sub = new Subscription();

  ngOnInit(): void {
    this.service.setOpen(this.open);
    // skip(1) drops the replayed initial value so no `openChange` fires on init.
    this.sub.add(this.service.open$.pipe(skip(1)).subscribe((open) => this.openChange.emit(open)));
  }

  ngOnChanges(): void {
    this.service.setOpen(this.open);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get computedClass() {
    return cn(chainOfThoughtVariants({ size: this.size }), this.class);
  }
}

/** Clickable header that expands and collapses the reasoning steps. */
@Component({
  selector: 'tolle-chain-of-thought-header',
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
      <i class="ri-brain-line shrink-0 text-muted-foreground" aria-hidden="true"></i>
      <span class="truncate">{{ label }}</span>
      <ng-content></ng-content>
      <i
        [class]="isOpen ? 'ri-arrow-down-s-line shrink-0' : 'ri-arrow-right-s-line shrink-0'"
        aria-hidden="true"
      ></i>
    </button>
  `,
})
export class ChainOfThoughtHeaderComponent implements OnInit, OnDestroy {
  /** Text shown in the header. @default 'Chain of Thought' */
  @Input() label = 'Chain of Thought';
  /** Extra Tailwind classes merged onto the header via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(ChainOfThoughtService);
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
    return cn(
      'flex w-full items-center gap-2 rounded-md py-1 text-sm font-medium text-muted-foreground outline-none transition-colors',
      'hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
      this.class
    );
  }

  toggle(): void {
    this.service.toggle();
  }
}

/** Holds the steps; rendered only while the trace is expanded. */
@Component({
  selector: 'tolle-chain-of-thought-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isOpen" data-state="open" [class]="computedClass">
      <ng-content></ng-content>
    </div>
  `,
})
export class ChainOfThoughtContentComponent implements OnInit, OnDestroy {
  /** Extra Tailwind classes merged onto the content via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(ChainOfThoughtService);
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
    return cn('mt-2 flex flex-col', this.class);
  }
}

/** One reasoning step: a marker on the rail, a label, and any projected detail. */
@Component({
  selector: 'tolle-chain-of-thought-step',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'computedClass', '[attr.data-status]': 'status' },
  template: `
    <span class="tolle-cot-rail absolute bottom-0 left-3 top-6 w-px -translate-x-1/2 bg-border" aria-hidden="true"></span>
    <span [class]="markerClass">
      <i [class]="icon" aria-hidden="true"></i>
    </span>
    <div class="min-w-0 flex-1 pt-0.5">
      <p [class]="labelClass">{{ label }}</p>
      <ng-content></ng-content>
    </div>
  `,
})
export class ChainOfThoughtStepComponent {
  /** Text describing what happened in this step. @default '' */
  @Input() label = '';
  /** Progress of this step; drives the marker colour. @default 'complete' */
  @Input() status: ChainOfThoughtStepStatus = 'complete';
  /** Remixicon class shown inside the step marker. @default 'ri-checkbox-blank-circle-fill' */
  @Input() icon = 'ri-checkbox-blank-circle-fill';
  /** Extra Tailwind classes merged onto the step via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(chainOfThoughtStepVariants({ status: this.status }), this.class);
  }

  get markerClass() {
    return cn(chainOfThoughtMarkerVariants({ status: this.status }));
  }

  get labelClass() {
    return cn('truncate text-sm', this.status === 'active' ? 'font-medium text-foreground' : 'text-muted-foreground');
  }
}

/** Wraps the result chips produced by a search step. */
@Component({
  selector: 'tolle-chain-of-thought-search-results',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="cn('mt-1.5 flex flex-wrap items-center gap-1', class)"><ng-content></ng-content></div>`,
})
export class ChainOfThoughtSearchResultsComponent {
  /** Extra Tailwind classes merged onto the results row via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** A single search result rendered as a small chip. */
@Component({
  selector: 'tolle-chain-of-thought-search-result',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="computedClass">
      <i *ngIf="icon" [class]="icon + ' shrink-0'" aria-hidden="true"></i>
      <ng-content></ng-content>
    </span>
  `,
})
export class ChainOfThoughtSearchResultComponent {
  /** Optional remixicon class shown before the label. @default '' */
  @Input() icon = '';
  /** Extra Tailwind classes merged onto the chip via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(
      'inline-flex max-w-full items-center gap-1 truncate rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground',
      this.class
    );
  }
}
