import {
  Component,
  Directive,
  Injectable,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const messageVariants = cva('group/message flex w-full gap-2', {
  variants: {
    align: {
      // Incoming: avatar first, content grows to the right.
      start: 'flex-row justify-start',
      // Outgoing: the row is mirrored so the avatar lands on the trailing edge.
      end: 'flex-row-reverse justify-start',
    },
    size: {
      sm: 'gap-1.5 text-sm',
      default: 'gap-2',
    },
  },
  defaultVariants: { align: 'start', size: 'default' },
});

export type MessageProps = VariantProps<typeof messageVariants>;

/** Which edge of the transcript a message hangs off. */
export type MessageAlign = 'start' | 'end';

/**
 * Shares the owning message's alignment with its OnPush children.
 *
 * Avatar / content / header / footer all need to know which edge the row hangs
 * off, but reading `MessageComponent.align` from a child getter would never mark
 * that child dirty. Emitting through an observable and calling `markForCheck()`
 * on each emission is the only thing that re-renders them.
 */
@Injectable()
export class MessageAlignService {
  private alignSource = new BehaviorSubject<MessageAlign>('start');

  /** Emits the owning message's alignment whenever it changes. */
  readonly align$ = this.alignSource.asObservable();

  /** The owning message's current alignment. */
  get align(): MessageAlign {
    return this.alignSource.value;
  }

  setAlign(align: MessageAlign): void {
    if (this.alignSource.value !== align) this.alignSource.next(align);
  }
}

/**
 * Base class for the message sub-components: resolves the row's alignment from
 * the parent `tolle-message` and keeps the OnPush view in sync with it.
 */
@Directive()
abstract class MessageAlignAware implements OnDestroy {
  /** Extra Tailwind classes merged onto the element via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(MessageAlignService, { optional: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub = new Subscription();

  constructor() {
    // Alignment is not an input of this component, so nothing else would mark it
    // dirty when the parent message flips sides.
    if (this.service) {
      this.sub.add(this.service.align$.subscribe(() => this.cdr.markForCheck()));
    }
  }

  /** Alignment inherited from the enclosing message, defaulting to 'start'. */
  protected get align(): MessageAlign {
    return this.service?.align ?? 'start';
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  protected cn = cn;
}

/**
 * The row layout for a single chat message: avatar on one edge, the content
 * column (header, bubble, footer) filling the rest. Compose it with
 * `tolle-bubble` for the visible surface.
 * @new
 */
@Component({
  selector: 'tolle-message',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageAlignService],
  template: `<div [class]="computedClass" role="listitem"><ng-content></ng-content></div>`,
})
export class MessageComponent implements OnChanges {
  /** Which edge the message hangs off — 'start' for incoming, 'end' for outgoing. @default 'start' */
  @Input() align: MessageProps['align'] = 'start';
  /** Gap density of the row. @default 'default' */
  @Input() size: MessageProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the row via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(MessageAlignService);

  ngOnChanges(): void {
    // Push alignment into the service so OnPush children get told about it.
    this.service.setAlign(this.align ?? 'start');
  }

  get computedClass(): string {
    return cn(messageVariants({ align: this.align, size: this.size }), this.class);
  }
}

const messageGroupVariants = cva('flex w-full flex-col', {
  variants: {
    align: {
      start: 'items-start',
      end: 'items-end',
    },
    spacing: {
      tight: 'gap-0.5',
      default: 'gap-1',
      loose: 'gap-3',
    },
  },
  defaultVariants: { align: 'start', spacing: 'default' },
});

export type MessageGroupProps = VariantProps<typeof messageGroupVariants>;

/**
 * Stacks consecutive messages from the same sender with tighter spacing, so a
 * burst of replies reads as one turn rather than several.
 */
@Component({
  selector: 'tolle-message-group',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="computedClass" role="group"><ng-content></ng-content></div>`,
})
export class MessageGroupComponent {
  /** Edge the grouped messages hang off. @default 'start' */
  @Input() align: MessageGroupProps['align'] = 'start';
  /** Vertical gap between the grouped messages. @default 'default' */
  @Input() spacing: MessageGroupProps['spacing'] = 'default';
  /** Extra Tailwind classes merged onto the group via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass(): string {
    return cn(messageGroupVariants({ align: this.align, spacing: this.spacing }), this.class);
  }
}

/**
 * Avatar slot for a message. Anchored to the bottom of the row so it sits beside
 * the last line of a multi-line bubble rather than floating at the top.
 */
@Component({
  selector: 'tolle-message-avatar',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="computedClass"><ng-content></ng-content></div>`,
})
export class MessageAvatarComponent extends MessageAlignAware {
  get computedClass(): string {
    return cn(
      'flex size-8 shrink-0 select-none items-center justify-center self-end overflow-hidden rounded-full bg-muted text-xs font-medium text-muted-foreground',
      this.class
    );
  }
}

/** Content column of a message — wraps the header, the bubble, and the footer. */
@Component({
  selector: 'tolle-message-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="computedClass"><ng-content></ng-content></div>`,
})
export class MessageContentComponent extends MessageAlignAware {
  get computedClass(): string {
    return cn(
      'flex min-w-0 flex-1 flex-col gap-1',
      this.align === 'end' ? 'items-end text-right' : 'items-start text-left',
      this.class
    );
  }
}

/** Sender name and metadata rendered above the message surface. */
@Component({
  selector: 'tolle-message-header',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="computedClass"><ng-content></ng-content></div>`,
})
export class MessageHeaderComponent extends MessageAlignAware {
  get computedClass(): string {
    return cn(
      'flex items-center gap-2 px-1 text-xs font-medium text-muted-foreground',
      this.align === 'end' ? 'flex-row-reverse' : 'flex-row',
      this.class
    );
  }
}

/** Delivery status, actions, or a timestamp rendered below the message surface. */
@Component({
  selector: 'tolle-message-footer',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="computedClass"><ng-content></ng-content></div>`,
})
export class MessageFooterComponent extends MessageAlignAware {
  get computedClass(): string {
    return cn(
      'flex items-center gap-2 px-1 text-xs text-muted-foreground',
      this.align === 'end' ? 'flex-row-reverse' : 'flex-row',
      this.class
    );
  }
}
