import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injectable,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

/**
 * Contract a `tolle-menubar-menu` fulfils so `MenubarService` can drive focus and
 * keyboard navigation without importing the component (which would be circular).
 */
export interface MenubarMenuRef {
  /** Stable id, unique per menu instance. */
  readonly id: string;
  /** The menu's trigger button, once rendered. */
  triggerElement: HTMLElement | null;
  /** The menu's open panel, or `null` while closed. */
  contentElement: HTMLElement | null;
}

let menubarMenuCounter = 0;

/**
 * Coordinates the menus of a single `tolle-menubar`. Provided by
 * `MenubarComponent`, injected by every descendant menu/trigger/content.
 *
 * The defining behaviour of a menu bar lives here: once *any* menu is open,
 * hovering a different trigger switches to it immediately (`hoverEnter`), while
 * hovering with everything closed does nothing.
 */
@Injectable()
export class MenubarService {
  private openIdSource = new BehaviorSubject<string | null>(null);
  /** Emits the id of the currently open menu, or `null` when all are closed. */
  readonly openId$ = this.openIdSource.asObservable();

  private sizeSource = new BehaviorSubject<'sm' | 'default' | 'lg'>('default');
  /**
   * Emits the bar's size so OnPush triggers re-render when it changes. Reading
   * the parent component's property directly would not mark them dirty.
   */
  readonly size$ = this.sizeSource.asObservable();

  /** The bar's current size scale. */
  get size(): 'sm' | 'default' | 'lg' {
    return this.sizeSource.value;
  }

  setSize(size: 'sm' | 'default' | 'lg'): void {
    if (this.sizeSource.value !== size) this.sizeSource.next(size);
  }

  /** Registered menus in DOM (registration) order. */
  private menus: MenubarMenuRef[] = [];

  /** Id of the open menu, or `null`. */
  get openId(): string | null {
    return this.openIdSource.value;
  }

  /** True while one of the bar's menus is open. */
  get isAnyOpen(): boolean {
    return this.openIdSource.value !== null;
  }

  register(menu: MenubarMenuRef): void {
    if (this.menus.indexOf(menu) === -1) this.menus.push(menu);
  }

  unregister(menu: MenubarMenuRef): void {
    const i = this.menus.indexOf(menu);
    if (i > -1) this.menus.splice(i, 1);
    if (this.openId === menu.id) this.close();
  }

  isOpen(id: string): boolean {
    return this.openId === id;
  }

  open(id: string): void {
    if (this.openId !== id) this.openIdSource.next(id);
  }

  close(): void {
    if (this.openId !== null) this.openIdSource.next(null);
  }

  toggle(id: string): void {
    if (this.openId === id) this.close();
    else this.open(id);
  }

  /**
   * Pointer entered a trigger. Only switches menus when the bar is already
   * "active" (something open) — this is what makes a menu bar feel native.
   */
  hoverEnter(id: string): void {
    if (this.isAnyOpen) this.open(id);
  }

  /** Moves focus to the previous/next menu, keeping the open state. */
  moveMenu(delta: number): void {
    if (!this.menus.length) return;
    const current = this.menus.findIndex(m => m.id === this.openId);
    const from = current > -1 ? current : this.indexOfFocusedTrigger();
    const next =
      from < 0
        ? delta > 0
          ? 0
          : this.menus.length - 1
        : (from + delta + this.menus.length) % this.menus.length;
    const target = this.menus[next];
    if (this.isAnyOpen) this.open(target.id);
    target.triggerElement?.focus();
  }

  /** Moves focus between the enabled items of the currently open menu. */
  moveItem(delta: number): void {
    const items = this.openItems();
    if (!items.length) return;
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next =
      current < 0
        ? delta > 0
          ? 0
          : items.length - 1
        : (current + delta + items.length) % items.length;
    items[next].focus();
  }

  /** Focuses the trigger of the given menu (used when Escape closes a menu). */
  focusTrigger(id: string): void {
    this.menus.find(m => m.id === id)?.triggerElement?.focus();
  }

  private openItems(): HTMLElement[] {
    const content = this.menus.find(m => m.id === this.openId)?.contentElement;
    if (!content) return [];
    return Array.from(
      content.querySelectorAll<HTMLElement>('[role="menuitem"]:not([data-disabled])')
    );
  }

  private indexOfFocusedTrigger(): number {
    const active = document.activeElement;
    return this.menus.findIndex(m => !!m.triggerElement && m.triggerElement === active);
  }
}

const menubarVariants = cva(
  'flex items-center gap-1 rounded-md border border-border bg-background shadow-sm',
  {
    variants: {
      size: {
        sm: 'h-8 p-0.5',
        default: 'h-10 p-1',
        lg: 'h-12 p-1.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export type MenubarProps = VariantProps<typeof menubarVariants>;

const menubarTriggerVariants = cva(
  'flex select-none items-center rounded-sm font-medium outline-none transition-colors ' +
    'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground ' +
    'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-7 px-2 text-xs',
        default: 'h-8 px-3 text-sm',
        lg: 'h-9 px-4 text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export type MenubarTriggerProps = VariantProps<typeof menubarTriggerVariants>;

const menubarItemVariants = cva(
  'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors ' +
    'focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground ' +
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-popover-foreground',
        destructive: 'text-destructive focus:bg-destructive/10 hover:bg-destructive/10',
      },
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inset: false,
    },
  }
);

export type MenubarItemProps = VariantProps<typeof menubarItemVariants>;

/**
 * Desktop-application style menu bar.
 *
 * ```html
 * <tolle-menubar>
 *   <tolle-menubar-menu>
 *     <tolle-menubar-trigger>File</tolle-menubar-trigger>
 *     <tolle-menubar-content>
 *       <tolle-menubar-label>Document</tolle-menubar-label>
 *       <tolle-menubar-item (select)="onNew()">New</tolle-menubar-item>
 *       <tolle-menubar-separator />
 *       <tolle-menubar-item variant="destructive">Delete</tolle-menubar-item>
 *     </tolle-menubar-content>
 *   </tolle-menubar-menu>
 * </tolle-menubar>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-menubar',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  providers: [MenubarService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menubar',
    '[class]': 'computedClass',
    '(keydown)': 'onKeydown($event)',
  },
  template: `<ng-content></ng-content>`,
})
export class MenubarComponent implements OnInit, OnChanges, OnDestroy {
  /** Height/padding scale, inherited by every trigger in the bar. @default 'default' */
  @Input() size: MenubarProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the bar via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the id of the menu that opened, or `null` when the bar closes. */
  @Output() openChange = new EventEmitter<string | null>();

  protected readonly service = inject(MenubarService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly sub = new Subscription();
  private listening = false;

  get computedClass(): string {
    return cn(menubarVariants({ size: this.size }), this.class);
  }

  ngOnChanges(): void {
    // Push size into the service so OnPush triggers get told about it.
    this.service.setSize(this.size ?? 'default');
  }

  ngOnInit(): void {
    this.service.setSize(this.size ?? 'default');
    this.sub.add(
      this.service.openId$.subscribe(id => {
        this.openChange.emit(id);
        if (id !== null) this.startListening();
        else this.stopListening();
      })
    );
  }

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.service.moveMenu(1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.service.moveMenu(-1);
        break;
      case 'ArrowDown':
        if (!this.service.isAnyOpen) break;
        event.preventDefault();
        this.service.moveItem(1);
        break;
      case 'ArrowUp':
        if (!this.service.isAnyOpen) break;
        event.preventDefault();
        this.service.moveItem(-1);
        break;
      case 'Escape': {
        const openId = this.service.openId;
        if (openId === null) break;
        event.preventDefault();
        this.service.close();
        this.service.focusTrigger(openId);
        break;
      }
      default:
        break;
    }
  }

  // Capture phase so nested containers that stopPropagation() on their root
  // (modal, sheet) cannot prevent the outside click from reaching us.
  private outsideClick = (event: Event) => {
    if (!this.host.nativeElement.contains(event.target as Node)) this.service.close();
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
  }
}

/** A single menu in the bar — wraps one trigger and its content panel. */
@Component({
  selector: 'tolle-menubar-menu',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Presentational so the menubar "owns" the trigger's menuitem role directly
  // even though this wrapper element sits in between.
  host: { role: 'none', '[class]': "'relative inline-flex'" },
  template: `<ng-content></ng-content>`,
})
export class MenubarMenuComponent implements MenubarMenuRef, OnInit, OnDestroy {
  /** Explicit id for the menu; one is generated when omitted. */
  @Input() id = `tolle-menubar-menu-${menubarMenuCounter++}`;

  triggerElement: HTMLElement | null = null;
  contentElement: HTMLElement | null = null;

  readonly service = inject(MenubarService);

  get triggerId(): string {
    return `${this.id}-trigger`;
  }

  get isOpen(): boolean {
    return this.service.isOpen(this.id);
  }

  ngOnInit(): void {
    this.service.register(this);
  }

  ngOnDestroy(): void {
    this.service.unregister(this);
  }
}

/** Button that opens its menu on click, and on hover once the bar is active. */
@Component({
  selector: 'tolle-menubar-trigger',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
  template: `
    <button
      #trigger
      type="button"
      role="menuitem"
      [id]="menu.triggerId"
      [disabled]="disabled"
      aria-haspopup="menu"
      [attr.aria-expanded]="isOpen"
      [attr.aria-controls]="isOpen ? menu.id + '-content' : null"
      [attr.data-state]="isOpen ? 'open' : 'closed'"
      [class]="computedClass"
      (click)="onClick()"
      (mouseenter)="onMouseEnter()"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class MenubarTriggerComponent implements OnDestroy {
  /** Prevents the menu from opening. @default false */
  @Input() disabled = false;
  /** Overrides the size inherited from `tolle-menubar`. */
  @Input() size?: MenubarTriggerProps['size'];
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). */
  @Input() class = '';

  protected readonly menu = inject(MenubarMenuComponent);
  private readonly service = inject(MenubarService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub = new Subscription();

  constructor() {
    this.sub.add(this.service.openId$.subscribe(() => this.cdr.markForCheck()));
    // The bar's size is not an input of this component, so nothing else would
    // mark an OnPush trigger dirty when it changes.
    this.sub.add(this.service.size$.subscribe(() => this.cdr.markForCheck()));
  }

  @ViewChild('trigger') set triggerRef(ref: ElementRef<HTMLButtonElement> | undefined) {
    this.menu.triggerElement = ref?.nativeElement ?? null;
  }

  protected get isOpen(): boolean {
    return this.menu.isOpen;
  }

  protected get computedClass(): string {
    return cn(menubarTriggerVariants({ size: this.size ?? this.service.size }), this.class);
  }

  protected onClick(): void {
    if (this.disabled) return;
    this.service.toggle(this.menu.id);
  }

  protected onMouseEnter(): void {
    if (this.disabled) return;
    this.service.hoverEnter(this.menu.id);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

/** The dropdown panel of a menu. Rendered only while its menu is open. */
@Component({
  selector: 'tolle-menubar-content',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <div
        #panel
        role="menu"
        aria-orientation="vertical"
        [id]="menu.id + '-content'"
        [attr.aria-labelledby]="menu.triggerId"
        data-state="open"
        [class]="computedClass"
        style="position: fixed; top: 0; left: 0;"
      >
        <ng-content></ng-content>
      </div>
    }
  `,
})
export class MenubarContentComponent implements OnDestroy {
  /** Preferred side of the trigger to render on; flips when space is tight. @default 'bottom-start' */
  @Input() placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' = 'bottom-start';
  /** Gap in pixels between the trigger and the panel. @default 4 */
  @Input() sideOffset = 4;
  /** Extra Tailwind classes merged onto the panel via `cn()` (last-wins). */
  @Input() class = '';

  protected readonly menu = inject(MenubarMenuComponent);
  private readonly service = inject(MenubarService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub: Subscription;
  private cleanup?: () => void;

  constructor() {
    this.sub = this.service.openId$.subscribe(() => this.cdr.markForCheck());
  }

  @ViewChild('panel') set panelRef(ref: ElementRef<HTMLElement> | undefined) {
    const el = ref?.nativeElement ?? null;
    this.menu.contentElement = el;
    this.stopPositioning();
    if (el) this.startPositioning(el);
  }

  protected get isOpen(): boolean {
    return this.menu.isOpen;
  }

  protected get computedClass(): string {
    return cn(
      'z-[1000] min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1',
      'text-popover-foreground shadow-md animate-in fade-in zoom-in-95',
      this.class
    );
  }

  private startPositioning(panel: HTMLElement): void {
    const trigger = this.menu.triggerElement;
    if (!trigger) return;
    this.cleanup = autoUpdate(trigger, panel, () => {
      computePosition(trigger, panel, {
        strategy: 'fixed',
        placement: this.placement,
        middleware: [offset(this.sideOffset), flip(), shift({ padding: 8 })],
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

/** A selectable row inside a menu. Closes the bar when activated. */
@Component({
  selector: 'tolle-menubar-item',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="menuitem"
      [attr.tabindex]="disabled ? null : -1"
      [attr.data-disabled]="disabled ? '' : null"
      [attr.aria-disabled]="disabled || null"
      [class]="computedClass"
      (click)="activate($event)"
      (keydown.enter)="activate($event)"
      (keydown.space)="activate($event)"
    >
      <ng-content select="[prefix]"></ng-content>
      <span class="flex-1 truncate"><ng-content></ng-content></span>
      <ng-content select="[shortcut]"></ng-content>
    </div>
  `,
})
export class MenubarItemComponent {
  /** Visual style of the item. @default 'default' */
  @Input() variant: MenubarItemProps['variant'] = 'default';
  /** Adds left padding so the label lines up with items that have icons. @default false */
  @Input() inset = false;
  /** Blocks activation and dims the item. @default false */
  @Input() disabled = false;
  /** Extra Tailwind classes merged onto the item via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted when the item is clicked or activated with Enter/Space. */
  @Output() select = new EventEmitter<Event>();

  private readonly service = inject(MenubarService);

  protected get computedClass(): string {
    return cn(
      menubarItemVariants({ variant: this.variant, inset: this.inset }),
      this.class
    );
  }

  protected activate(event: Event): void {
    if (this.disabled) return;
    event.preventDefault();
    this.select.emit(event);
    this.service.close();
  }
}

/** A non-interactive heading inside a menu. */
@Component({
  selector: 'tolle-menubar-label',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', inset ? 'pl-8' : '', class)"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class MenubarLabelComponent {
  /** Adds left padding so the label lines up with items that have icons. @default false */
  @Input() inset = false;
  /** Extra Tailwind classes merged onto the label via `cn()` (last-wins). */
  @Input() class = '';
  protected readonly cn = cn;
}

/** A horizontal rule between groups of menu items. */
@Component({
  selector: 'tolle-menubar-separator',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div role="separator" aria-orientation="horizontal" [class]="cn('-mx-1 my-1 h-px bg-border', class)"></div>`,
})
export class MenubarSeparatorComponent {
  /** Extra Tailwind classes merged onto the separator via `cn()` (last-wins). */
  @Input() class = '';
  protected readonly cn = cn;
}
