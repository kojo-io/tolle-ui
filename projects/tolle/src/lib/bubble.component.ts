import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const bubbleVariants = cva(
  'group/bubble relative w-fit max-w-full whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-sm leading-relaxed transition-colors',
  {
    variants: {
      variant: {
        default: 'border border-border bg-card text-card-foreground',
        primary: 'border border-transparent bg-primary text-primary-foreground',
        muted: 'border border-transparent bg-muted text-foreground',
        outline: 'border border-border bg-transparent text-foreground',
      },
      align: {
        // The corner nearest the sender is squared off to read as a tail.
        start: 'rounded-bl-sm',
        end: 'rounded-br-sm',
      },
      size: {
        sm: 'px-2.5 py-1.5 text-xs',
        default: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
      },
    },
    defaultVariants: { variant: 'default', align: 'start', size: 'default' },
  }
);

export type BubbleProps = VariantProps<typeof bubbleVariants>;

/** A single emoji reaction chip and its tally. */
export interface BubbleReaction {
  /** The emoji character to display, e.g. a thumbs-up. */
  emoji: string;
  /** How many people reacted with it. */
  count?: number;
  /** Whether the current user is one of them. */
  reacted?: boolean;
}

/**
 * The visible surface of a chat message — the rounded panel the text sits in.
 * Place it inside `tolle-message-content` and match its `align` to the message.
 * @new
 */
@Component({
  selector: 'tolle-bubble',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="computedClass"
      [attr.role]="interactive ? 'button' : null"
      [attr.tabindex]="interactive ? 0 : null"
      (click)="onTrigger($event)"
      (keydown.enter)="onTrigger($event)"
      (keydown.space)="onTrigger($event)">
      <!-- Single content slot: collapsing only swaps the wrapper's classes so the
           projected nodes are never re-created (and never render empty). -->
      <div [class]="contentClass" [style.max-height]="contentStyle">
        <ng-content></ng-content>
      </div>

      <button
        *ngIf="collapsible"
        type="button"
        [attr.aria-expanded]="!collapsed"
        (click)="toggle($event)"
        class="mt-1 inline-flex items-center gap-1 rounded-sm text-xs font-medium underline underline-offset-2 opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {{ collapsed ? expandLabel : collapseLabel }}
        <i [class]="collapsed ? 'ri-arrow-down-s-line' : 'ri-arrow-up-s-line'" aria-hidden="true"></i>
      </button>

      <ng-content select="[bubbleFooter]"></ng-content>
    </div>
  `,
})
export class BubbleComponent {
  /** Visual style of the surface. @default 'default' */
  @Input() variant: BubbleProps['variant'] = 'default';
  /** Which edge the bubble hangs off; squares the matching bottom corner. @default 'start' */
  @Input() align: BubbleProps['align'] = 'start';
  /** Padding and text scale of the surface. @default 'default' */
  @Input() size: BubbleProps['size'] = 'default';
  /** Shows a show-more / show-less toggle for long content. @default false */
  @Input() collapsible = false;
  /** Whether the content is currently clamped. Only has an effect with `collapsible`. @default true */
  @Input() collapsed = true;
  /** Max height of the clamped content, as a CSS length. @default '6rem' */
  @Input() collapsedHeight = '6rem';
  /** Label of the toggle while the content is clamped. @default 'Show more' */
  @Input() expandLabel = 'Show more';
  /** Label of the toggle while the content is expanded. @default 'Show less' */
  @Input() collapseLabel = 'Show less';
  /** Makes the whole surface a keyboard-focusable trigger that emits `bubbleClick`. @default false */
  @Input() interactive = false;
  /** Extra Tailwind classes merged onto the surface via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the new collapsed state when the show-more toggle is pressed. */
  @Output() collapsedChange = new EventEmitter<boolean>();
  /** Emitted when an interactive bubble is activated by click, Enter, or Space. */
  @Output() bubbleClick = new EventEmitter<Event>();

  get computedClass(): string {
    return cn(
      bubbleVariants({ variant: this.variant, align: this.align, size: this.size }),
      this.interactive &&
        'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      this.class
    );
  }

  /** Classes for the content wrapper — clamped only while collapsible and collapsed. */
  get contentClass(): string {
    return cn(this.isClamped && 'overflow-hidden');
  }

  /** Inline max-height applied while the content is clamped. */
  get contentStyle(): string | null {
    return this.isClamped ? this.collapsedHeight : null;
  }

  /** Whether the projected content is currently clamped. */
  get isClamped(): boolean {
    return this.collapsible && this.collapsed;
  }

  protected toggle(event: Event): void {
    // The toggle lives inside the trigger surface; don't fire both.
    event.stopPropagation();
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  protected onTrigger(event: Event): void {
    if (!this.interactive) return;
    if (event.type === 'keydown') event.preventDefault();
    this.bubbleClick.emit(event);
  }
}

/**
 * Hover-revealed row of actions for a bubble — copy, retry, react. Clicks are
 * kept inside the row so an interactive bubble does not also fire.
 */
@Component({
  selector: 'tolle-bubble-actions',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass" (click)="onClick($event)">
      <ng-content></ng-content>
    </div>
  `,
})
export class BubbleActionsComponent {
  /** Keeps the row permanently visible instead of revealing it on hover or focus. @default false */
  @Input() alwaysVisible = false;
  /** Extra Tailwind classes merged onto the row via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass(): string {
    return cn(
      'mt-1 flex items-center gap-1 transition-opacity',
      this.alwaysVisible
        ? 'opacity-100'
        : 'opacity-0 focus-within:opacity-100 group-hover/bubble:opacity-100',
      this.class
    );
  }

  protected onClick(event: Event): void {
    // Actions stay independently clickable even when the bubble is a trigger.
    event.stopPropagation();
  }
}

/** Row of emoji reaction chips attached to a bubble. */
@Component({
  selector: 'tolle-bubble-reactions',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="computedClass" (click)="stop($event)">
      <button
        *ngFor="let reaction of reactions; trackBy: trackByEmoji"
        type="button"
        [attr.aria-pressed]="!!reaction.reacted"
        [class]="chipClass(reaction)"
        (click)="onReact(reaction, $event)">
        <span aria-hidden="true">{{ reaction.emoji }}</span>
        <span *ngIf="reaction.count" class="tabular-nums">{{ reaction.count }}</span>
      </button>

      <ng-content></ng-content>
    </div>
  `,
})
export class BubbleReactionsComponent {
  /** Reaction chips to render, in display order. @default [] */
  @Input() reactions: BubbleReaction[] = [];
  /** Extra Tailwind classes merged onto the row via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the reaction whose chip was clicked. */
  @Output() react = new EventEmitter<BubbleReaction>();

  get computedClass(): string {
    return cn('mt-1 flex flex-wrap items-center gap-1', this.class);
  }

  protected chipClass(reaction: BubbleReaction): string {
    return cn(
      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      reaction.reacted
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-border bg-muted text-muted-foreground hover:bg-accent'
    );
  }

  protected trackByEmoji(_index: number, reaction: BubbleReaction): string {
    return reaction.emoji;
  }

  protected onReact(reaction: BubbleReaction, event: Event): void {
    event.stopPropagation();
    this.react.emit(reaction);
  }

  protected stop(event: Event): void {
    event.stopPropagation();
  }
}
