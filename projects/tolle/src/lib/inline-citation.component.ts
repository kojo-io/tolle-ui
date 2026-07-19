import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import {
  HoverCardComponent,
  HoverCardTriggerComponent,
  HoverCardContentComponent,
} from './hover-card.component';

const inlineCitationVariants = cva(
  'cursor-pointer rounded-sm align-super font-medium leading-none transition-colors',
  {
    variants: {
      variant: {
        default: 'text-primary hover:text-primary/80',
        muted: 'text-muted-foreground hover:text-foreground',
        subtle: 'text-foreground/60 hover:text-foreground',
      },
      size: {
        sm: 'text-[9px]',
        default: 'text-[10px]',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export type InlineCitationProps = VariantProps<typeof inlineCitationVariants>;

/**
 * A superscript citation marker for prose. Hovering the marker reveals the
 * projected source card, positioned by the existing `tolle-hover-card`.
 *
 * ```html
 * The model was released in March.<tolle-inline-citation [index]="1">
 *   <tolle-inline-citation-card
 *     title="Release notes"
 *     url="https://example.com/notes"
 *     snippet="Shipped on 14 March."
 *   ></tolle-inline-citation-card>
 * </tolle-inline-citation>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-inline-citation',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule, HoverCardComponent, HoverCardTriggerComponent, HoverCardContentComponent],
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
        <sup
          role="button"
          tabindex="0"
          [attr.aria-label]="ariaLabel || 'Citation ' + index"
          [class]="computedClass"
          >{{ index }}</sup
        >
      </tolle-hover-card-trigger>
      <tolle-hover-card-content [class]="contentClass">
        <ng-content></ng-content>
      </tolle-hover-card-content>
    </tolle-hover-card>
  `,
})
export class InlineCitationComponent implements OnChanges, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Number rendered in the superscript marker. @default 1 */
  @Input() index: number | string = 1;
  /** Colour treatment of the marker. @default 'default' */
  @Input() variant: InlineCitationProps['variant'] = 'default';
  /** Text size of the marker. @default 'default' */
  @Input() size: InlineCitationProps['size'] = 'default';
  /** Side of the marker the source card opens on. @default 'top' */
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  /** Milliseconds to wait before opening the card. @default 150 */
  @Input() openDelay = 150;
  /** Milliseconds to wait before closing the card. @default 200 */
  @Input() closeDelay = 200;
  /** Accessible label for the marker; falls back to "Citation {index}". @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the marker via `cn()` (last-wins). */
  @Input() class = '';
  /** Extra Tailwind classes merged onto the hover card panel via `cn()` (last-wins). */
  @Input() cardClass = '';

  private readonly cdr = inject(ChangeDetectorRef);
  private refreshTimer?: ReturnType<typeof setTimeout>;

  get computedClass() {
    return cn(inlineCitationVariants({ variant: this.variant, size: this.size }), this.class);
  }

  get contentClass() {
    return cn('w-72 p-0', this.cardClass);
  }

  /**
   * `tolle-hover-card` flips its own visibility from a `setTimeout`, which never
   * marks this OnPush view dirty. Re-check just after the delay elapses so the
   * card actually appears (and disappears) inside an OnPush host.
   */
  scheduleRefresh(delay: number): void {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => this.cdr.markForCheck(), delay + 32);
  }

  ngOnDestroy(): void {
    clearTimeout(this.refreshTimer);
  }
}

/** The source preview shown inside a citation's hover card. */
@Component({
  selector: 'tolle-inline-citation-card',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass">
      <p class="truncate text-sm font-medium text-popover-foreground">{{ title }}</p>
      <a
        *ngIf="url"
        [href]="url"
        target="_blank"
        rel="noreferrer noopener"
        class="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        <i class="ri-external-link-line shrink-0" aria-hidden="true"></i>
        <span class="truncate">{{ displayUrl }}</span>
      </a>
      <p *ngIf="snippet" class="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{{ snippet }}</p>
      <ng-content></ng-content>
    </div>
  `,
})
export class InlineCitationCardComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Title of the cited source. @default '' */
  @Input() title = '';
  /** Link to the cited source. @default '' */
  @Input() url = '';
  /** Short excerpt from the source. @default '' */
  @Input() snippet = '';
  /** Extra Tailwind classes merged onto the card via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn('flex flex-col p-3', this.class);
  }

  /** The URL without its scheme, which reads better in a narrow card. */
  get displayUrl(): string {
    return this.url.replace(/^https?:\/\//, '');
  }
}

/** A pulled quote from the cited source, shown inside the citation card. */
@Component({
  selector: 'tolle-inline-citation-quote',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <blockquote [class]="computedClass">
      <ng-content></ng-content>
      <footer *ngIf="cite" class="mt-1 text-[11px] not-italic text-muted-foreground/80">— {{ cite }}</footer>
    </blockquote>
  `,
})
export class InlineCitationQuoteComponent  implements OnChanges{
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Attribution shown beneath the quote. @default '' */
  @Input() cite = '';
  /** Extra Tailwind classes merged onto the quote via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(
      'mt-2 border-l-2 border-border pl-3 text-xs italic leading-relaxed text-muted-foreground',
      this.class
    );
  }
}
