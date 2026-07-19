import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

/**
 * Relays a chosen suggestion from a `tolle-suggestion` up to the
 * `tolle-suggestions` row that contains it, so consumers can listen in one
 * place instead of binding every pill.
 *
 * Provided on `SuggestionsComponent`; injected optionally, since a pill is
 * perfectly usable on its own.
 */
@Injectable()
export class SuggestionsService {
  private readonly selectedSource = new Subject<string>();
  /** Emits the value of whichever suggestion the user picked. */
  readonly selected$ = this.selectedSource.asObservable();

  select(value: string): void {
    this.selectedSource.next(value);
  }
}

const suggestionsVariants = cva('flex w-full items-center overflow-x-auto scroll-fade-x', {
  variants: {
    gap: {
      sm: 'gap-1',
      default: 'gap-2',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    gap: 'default',
  },
});

export type SuggestionsProps = VariantProps<typeof suggestionsVariants>;

/**
 * A horizontally scrollable row of suggested follow-up prompts.
 *
 * Fill it with `tolle-suggestion` pills and listen to this component's
 * `selected` output to react to any of them.
 */
@Component({
  selector: 'tolle-suggestions',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [SuggestionsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass" role="group" [attr.aria-label]="ariaLabel || null">
      <ng-content></ng-content>
    </div>
  `,
})
export class SuggestionsComponent implements OnInit, OnDestroy {
  /** Spacing between the pills. @default 'default' */
  @Input() gap: SuggestionsProps['gap'] = 'default';
  /** Accessible name for the row. @default 'Suggestions' */
  @Input() ariaLabel = 'Suggestions';
  /** Extra Tailwind classes merged onto the row via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the `value` of whichever suggestion in the row was picked. */
  @Output() selected = new EventEmitter<string>();

  private readonly service = inject(SuggestionsService);
  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.selected$.subscribe((value) => this.selected.emit(value))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get computedClass() {
    return cn(suggestionsVariants({ gap: this.gap }), this.class);
  }
}

const suggestionVariants = cva(
  'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        outline: 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-7 px-2.5 text-xs',
        default: 'h-8 px-3 text-sm',
        lg: 'h-10 px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  }
);

export type SuggestionProps = VariantProps<typeof suggestionVariants>;

/**
 * A single suggested follow-up prompt, rendered as a pill button.
 *
 * Projected content is the label; `value` is what gets emitted when it is
 * picked, so the two can differ.
 * @new
 */
@Component({
  selector: 'tolle-suggestion',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-suggestion
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel || null"
      [class]="computedClass"
      (click)="onClick()"
    >
      <i *ngIf="icon" [class]="icon" aria-hidden="true"></i>
      <ng-content></ng-content>
    </button>
  `,
})
export class SuggestionComponent {
  /** Value emitted when the pill is picked. @default '' */
  @Input() value = '';
  /** Visual style of the pill. @default 'outline' */
  @Input() variant: SuggestionProps['variant'] = 'outline';
  /** Size of the pill. @default 'default' */
  @Input() size: SuggestionProps['size'] = 'default';
  /** Remixicon class shown before the label. @default '' */
  @Input() icon = '';
  /** Blocks interaction with the pill. @default false */
  @Input() disabled = false;
  /** Accessible name, when the projected label is not descriptive enough. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the pill via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with this pill's `value` when it is picked. */
  @Output() selected = new EventEmitter<string>();

  private readonly parent = inject(SuggestionsService, { optional: true });

  get computedClass() {
    return cn(suggestionVariants({ variant: this.variant, size: this.size }), this.class);
  }

  onClick(): void {
    if (this.disabled) return;
    this.selected.emit(this.value);
    this.parent?.select(this.value);
  }
}
