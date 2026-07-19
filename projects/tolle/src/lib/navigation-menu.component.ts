import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injectable,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { computePosition, flip, shift, offset, size, autoUpdate } from '@floating-ui/dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

let navigationMenuItemCounter = 0;

/**
 * Coordinates the items of a single `tolle-navigation-menu`. Provided by
 * `NavigationMenuComponent`, injected by its descendants.
 *
 * Closing is deferred by `closeDelay` so a pointer travelling diagonally from a
 * trigger into its panel does not dismiss the menu mid-flight; re-entering
 * either surface calls `cancelClose()` and the pending close is dropped.
 */
@Injectable()
export class NavigationMenuService {
  private openIdSource = new BehaviorSubject<string | null>(null);
  /** Emits the id of the currently open item, or `null` when all are closed. */
  readonly openId$ = this.openIdSource.asObservable();

  /** Milliseconds to wait before closing after the pointer leaves. */
  closeDelay = 150;

  private closeTimer: ReturnType<typeof setTimeout> | undefined;

  /** Id of the open item, or `null`. */
  get openId(): string | null {
    return this.openIdSource.value;
  }

  /** True while any panel is open. */
  get isAnyOpen(): boolean {
    return this.openIdSource.value !== null;
  }

  /** True while a deferred close is pending — exposed for tests/diagnostics. */
  get isCloseScheduled(): boolean {
    return this.closeTimer !== undefined;
  }

  isOpen(id: string): boolean {
    return this.openId === id;
  }

  /** Opens an item immediately and cancels any pending close. */
  open(id: string): void {
    this.cancelClose();
    if (this.openId !== id) this.openIdSource.next(id);
  }

  /** Closes immediately, dropping any pending close. */
  closeNow(): void {
    this.cancelClose();
    if (this.openId !== null) this.openIdSource.next(null);
  }

  /** Queues a close in `closeDelay` ms; a later `open`/`cancelClose` wins. */
  scheduleClose(): void {
    this.cancelClose();
    this.closeTimer = setTimeout(() => {
      this.closeTimer = undefined;
      this.closeNow();
    }, this.closeDelay);
  }

  /** Drops a pending close (pointer came back). */
  cancelClose(): void {
    if (this.closeTimer !== undefined) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }

  toggle(id: string): void {
    if (this.openId === id) this.closeNow();
    else this.open(id);
  }
}

const navigationMenuVariants = cva('relative z-10 flex max-w-max flex-1 items-center justify-center', {
  variants: {
    align: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
  },
  defaultVariants: {
    align: 'center',
  },
});

export type NavigationMenuProps = VariantProps<typeof navigationMenuVariants>;

const navigationMenuTriggerVariants = cva(
  'group inline-flex w-max select-none items-center justify-center gap-1 rounded-md bg-background font-medium transition-colors ' +
    'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none ' +
    'data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-9 px-4 py-2 text-sm',
        lg: 'h-10 px-5 text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export type NavigationMenuTriggerProps = VariantProps<typeof navigationMenuTriggerVariants>;

const navigationMenuLinkVariants = cva(
  'flex select-none flex-col gap-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ' +
    'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        muted: 'text-muted-foreground hover:text-accent-foreground',
      },
      active: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      active: false,
    },
  }
);

export type NavigationMenuLinkProps = VariantProps<typeof navigationMenuLinkVariants>;

/**
 * Site navigation menu: a row of links and triggers, where each trigger reveals
 * a floating panel on hover, focus or click.
 *
 * ```html
 * <tolle-navigation-menu>
 *   <tolle-navigation-menu-list>
 *     <tolle-navigation-menu-item>
 *       <tolle-navigation-menu-trigger>Products</tolle-navigation-menu-trigger>
 *       <tolle-navigation-menu-content class="w-[420px]">
 *         <tolle-navigation-menu-link href="/analytics">Analytics</tolle-navigation-menu-link>
 *       </tolle-navigation-menu-content>
 *     </tolle-navigation-menu-item>
 *   </tolle-navigation-menu-list>
 * </tolle-navigation-menu>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-navigation-menu',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  providers: [NavigationMenuService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [attr.aria-label]="ariaLabel" [class]="computedClass" (keydown)="onKeydown($event)">
      <ng-content></ng-content>
    </nav>
  `,
})
export class NavigationMenuComponent implements OnInit, OnDestroy {
  /** Horizontal alignment of the list within the nav. @default 'center' */
  @Input() align: NavigationMenuProps['align'] = 'center';
  /** Accessible name for the `<nav>` landmark. @default 'Main' */
  @Input() ariaLabel = 'Main';
  /**
   * Milliseconds before a panel closes after the pointer leaves — the grace
   * period that lets the pointer travel diagonally into the panel. @default 150
   */
  @Input() set closeDelay(value: number) {
    this.service.closeDelay = value;
  }
  get closeDelay(): number {
    return this.service.closeDelay;
  }
  /** Extra Tailwind classes merged onto the `<nav>` via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the id of the item that opened, or `null` when the menu closes. */
  @Output() openChange = new EventEmitter<string | null>();

  private readonly service = inject(NavigationMenuService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly sub = new Subscription();
  private listening = false;

  protected get computedClass(): string {
    return cn(navigationMenuVariants({ align: this.align }), this.class);
  }

  ngOnInit(): void {
    this.sub.add(
      this.service.openId$.subscribe(id => {
        this.openChange.emit(id);
        if (id !== null) this.startListening();
        else this.stopListening();
      })
    );
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.service.isAnyOpen) {
      event.preventDefault();
      this.service.closeNow();
    }
  }

  // Capture phase so containers that stopPropagation() on their root cannot
  // prevent the outside click from reaching us.
  private outsideClick = (event: Event) => {
    if (!this.host.nativeElement.contains(event.target as Node)) this.service.closeNow();
  };

  private startListening(): void {
    if (this.listening) return;
    this.listening = true;
    document.addEventListener('pointerdown', this.outsideClick, true);
  }

  private stopListening(): void {
    if (!this.listening) return;
    this.listening = false;
    document.removeEventListener('pointerdown', this.outsideClick, true);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.stopListening();
    this.service.cancelClose();
  }
}

/** The horizontal list that holds the navigation items. */
@Component({
  selector: 'tolle-navigation-menu-list',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul [class]="cn('group flex flex-1 list-none items-center justify-center gap-1', class)">
      <ng-content></ng-content>
    </ul>
  `,
})
export class NavigationMenuListComponent {
  /** Extra Tailwind classes merged onto the `<ul>` via `cn()` (last-wins). */
  @Input() class = '';
  protected readonly cn = cn;
}

/** One entry in the list — a plain link, or a trigger plus its content panel. */
@Component({
  selector: 'tolle-navigation-menu-item',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'contents'" },
  template: `
    <li [class]="cn('relative', class)">
      <ng-content></ng-content>
    </li>
  `,
})
export class NavigationMenuItemComponent implements OnDestroy {
  /** Explicit id for the item; one is generated when omitted. */
  @Input() id = `tolle-navigation-menu-item-${navigationMenuItemCounter++}`;
  /** Extra Tailwind classes merged onto the `<li>` via `cn()` (last-wins). */
  @Input() class = '';

  readonly service = inject(NavigationMenuService);
  protected readonly cn = cn;

  triggerElement: HTMLElement | null = null;

  get triggerId(): string {
    return `${this.id}-trigger`;
  }

  get contentId(): string {
    return `${this.id}-content`;
  }

  get isOpen(): boolean {
    return this.service.isOpen(this.id);
  }

  ngOnDestroy(): void {
    if (this.isOpen) this.service.closeNow();
  }
}

/** Button that reveals its item's panel on hover, focus or click. */
@Component({
  selector: 'tolle-navigation-menu-trigger',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      #trigger
      type="button"
      [id]="item.triggerId"
      [disabled]="disabled"
      aria-haspopup="true"
      [attr.aria-expanded]="isOpen"
      [attr.aria-controls]="isOpen ? item.contentId : null"
      [attr.data-state]="isOpen ? 'open' : 'closed'"
      [class]="computedClass"
      (click)="onClick()"
      (mouseenter)="onPointerEnter()"
      (mouseleave)="onPointerLeave()"
      (focus)="onPointerEnter()"
      (keydown)="onKeydown($event)"
    >
      <ng-content></ng-content>
      <i
        class="ri-arrow-down-s-line text-[16px] transition-transform duration-200"
        [class.rotate-180]="isOpen"
        aria-hidden="true"
      ></i>
    </button>
  `,
})
export class NavigationMenuTriggerComponent implements OnDestroy {
  /** Prevents the panel from opening. @default false */
  @Input() disabled = false;
  /** Height/padding scale of the trigger. @default 'default' */
  @Input() size: NavigationMenuTriggerProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). */
  @Input() class = '';

  protected readonly item = inject(NavigationMenuItemComponent);
  private readonly service = inject(NavigationMenuService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub: Subscription;

  constructor() {
    this.sub = this.service.openId$.subscribe(() => this.cdr.markForCheck());
  }

  @ViewChild('trigger') set triggerRef(ref: ElementRef<HTMLButtonElement> | undefined) {
    this.item.triggerElement = ref?.nativeElement ?? null;
  }

  protected get isOpen(): boolean {
    return this.item.isOpen;
  }

  protected get computedClass(): string {
    return cn(navigationMenuTriggerVariants({ size: this.size }), this.class);
  }

  protected onClick(): void {
    if (this.disabled) return;
    this.service.toggle(this.item.id);
  }

  protected onPointerEnter(): void {
    if (this.disabled) return;
    this.service.open(this.item.id);
  }

  protected onPointerLeave(): void {
    this.service.scheduleClose();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.service.open(this.item.id);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

/** The floating panel revealed by a trigger. Rendered only while open. */
@Component({
  selector: 'tolle-navigation-menu-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <div
        #panel
        [id]="item.contentId"
        [attr.aria-labelledby]="item.triggerId"
        data-state="open"
        [class]="computedClass"
        style="position: fixed; top: 0; left: 0;"
        (mouseenter)="onPointerEnter()"
        (mouseleave)="onPointerLeave()"
      >
        <ng-content></ng-content>
      </div>
    }
  `,
})
export class NavigationMenuContentComponent implements OnDestroy {
  /** Preferred side of the trigger to render on; flips when space is tight. @default 'bottom' */
  @Input() placement: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end' =
    'bottom';
  /** Gap in pixels between the trigger and the panel. @default 8 */
  @Input() sideOffset = 8;
  /** Extra Tailwind classes merged onto the panel via `cn()` (last-wins). */
  @Input() class = '';

  protected readonly item = inject(NavigationMenuItemComponent);
  private readonly service = inject(NavigationMenuService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub: Subscription;
  private cleanup?: () => void;

  constructor() {
    this.sub = this.service.openId$.subscribe(() => this.cdr.markForCheck());
  }

  @ViewChild('panel') set panelRef(ref: ElementRef<HTMLElement> | undefined) {
    this.stopPositioning();
    if (ref?.nativeElement) this.startPositioning(ref.nativeElement);
  }

  protected get isOpen(): boolean {
    return this.item.isOpen;
  }

  protected get computedClass(): string {
    return cn(
      'z-[1000] overflow-auto rounded-md border border-border bg-popover p-2 text-popover-foreground',
      'shadow-lg animate-in fade-in zoom-in-95',
      this.class
    );
  }

  protected onPointerEnter(): void {
    this.service.cancelClose();
  }

  protected onPointerLeave(): void {
    this.service.scheduleClose();
  }

  private startPositioning(panel: HTMLElement): void {
    const trigger = this.item.triggerElement;
    if (!trigger) return;
    this.cleanup = autoUpdate(trigger, panel, () => {
      computePosition(trigger, panel, {
        strategy: 'fixed',
        placement: this.placement,
        middleware: [
          offset(this.sideOffset),
          flip(),
          shift({ padding: 8 }),
          // Wide panels are common here — clamp to what the viewport can show
          // instead of letting them overflow.
          size({
            padding: 8,
            apply({ elements, availableWidth, availableHeight }) {
              Object.assign(elements.floating.style, {
                maxWidth: `${Math.max(0, availableWidth)}px`,
                maxHeight: `${Math.max(0, availableHeight)}px`,
              });
            },
          }),
        ],
      }).then(({ x, y }) => {
        Object.assign(panel.style, { left: `${x}px`, top: `${y}px` });
      });
    });
  }

  private stopPositioning(): void {
    this.cleanup?.();
    this.cleanup = undefined;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.stopPositioning();
  }
}

/** A link inside a panel (or directly in the list, for flat entries). */
@Component({
  selector: 'tolle-navigation-menu-link',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      [attr.href]="href || null"
      [attr.target]="target || null"
      [attr.rel]="target === '_blank' ? 'noreferrer noopener' : null"
      [attr.aria-current]="active ? 'page' : null"
      [attr.data-active]="active ? '' : null"
      [class]="computedClass"
      (click)="navigate.emit($event)"
    >
      <ng-content select="[label]"></ng-content>
      <ng-content></ng-content>
      <ng-content select="[description]"></ng-content>
    </a>
  `,
})
export class NavigationMenuLinkComponent {
  /** Destination URL. Omit to render a non-navigating item. */
  @Input() href = '';
  /** Anchor target; `_blank` also sets a safe `rel`. */
  @Input() target = '';
  /** Marks the link as the current page. @default false */
  @Input() active = false;
  /** Visual style of the link. @default 'default' */
  @Input() variant: NavigationMenuLinkProps['variant'] = 'default';
  /** Extra Tailwind classes merged onto the anchor via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the click event when the link is activated. */
  @Output() navigate = new EventEmitter<MouseEvent>();

  protected get computedClass(): string {
    return cn(
      navigationMenuLinkVariants({ variant: this.variant, active: this.active }),
      this.class
    );
  }
}
