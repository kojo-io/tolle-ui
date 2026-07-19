import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnChanges,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { cn } from './utils/cn';
import { CommandService } from './command.service';

let commandItemId = 0;

/**
 * A filterable command menu — the list half of a command palette (⌘K),
 * a searchable dropdown, or an inline action list.
 *
 * Compose it from `tolle-command-input`, `tolle-command-list`,
 * `tolle-command-group`, `tolle-command-item` and `tolle-command-empty`.
 * Filtering, keyboard navigation and `aria-activedescendant` are handled for
 * you by the `CommandService` this component provides.
 *
 * For the ⌘K modal version use `tolle-command-dialog`; for a form control use
 * `tolle-combobox`.
 * @new
 */
@Component({
  selector: 'tolle-command',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [CommandService],
  template: `
    <div
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded="true"
      [attr.aria-label]="ariaLabel || null"
      [class]="computedClass"
      (keydown)="onKeyDown($event)"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class CommandComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Set false to keep every item visible and filter the list yourself —
   * for server-side or fuzzy search. @default true
   */
  @Input() shouldFilter = true;
  /** Accessible name for the command menu. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the menu via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the chosen item's `value` when the user selects one. */
  @Output() selected = new EventEmitter<any>();
  /** Emitted with the query text whenever the search input changes. */
  @Output() queryChange = new EventEmitter<string>();

  private readonly service = inject(CommandService);
  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.service.shouldFilter = this.shouldFilter;
    this.subscriptions.add(this.service.selected$.subscribe((value) => this.selected.emit(value)));
    this.subscriptions.add(this.service.query$.subscribe((query) => this.queryChange.emit(query)));
  }

  ngOnChanges(): void {
    this.service.shouldFilter = this.shouldFilter;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get computedClass() {
    return cn('flex w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', this.class);
  }

  /**
   * Menu-level keyboard handling, so the arrows work whether focus is in the
   * search input or on the menu itself.
   */
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.service.move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.service.move(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.service.setActive(this.service.visibleIds[0] ?? null);
        break;
      case 'End':
        event.preventDefault();
        this.service.setActive(this.service.visibleIds[this.service.visibleIds.length - 1] ?? null);
        break;
      case 'Enter':
        event.preventDefault();
        this.service.selectActive();
        break;
    }
  }
}

/** Search box for a `tolle-command`. Typing here drives the filtering. */
@Component({
  selector: 'tolle-command-input',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cn('flex items-center gap-2 border-b border-border px-3', class)">
      <i class="ri-search-line shrink-0 text-muted-foreground" aria-hidden="true"></i>
      <input
        [attr.placeholder]="placeholder"
        [attr.aria-activedescendant]="activeId"
        [attr.aria-label]="ariaLabel || placeholder || 'Search'"
        aria-autocomplete="list"
        autocomplete="off"
        spellcheck="false"
        [value]="value"
        [class]="cn(
          'h-11 w-full bg-transparent py-3 text-sm text-foreground outline-none',
          'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          inputClass
        )"
        (input)="onInput($event)"
      />
    </div>
  `,
})
export class CommandInputComponent implements OnInit, OnDestroy {
  /** Placeholder shown when the query is empty. @default 'Type a command or search…' */
  @Input() placeholder = 'Type a command or search…';
  /** Accessible name for the search box. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the search row via `cn()` (last-wins). */
  @Input() class = '';
  /** Extra Tailwind classes merged onto the `<input>` itself via `cn()` (last-wins). */
  @Input() inputClass = '';

  private readonly service = inject(CommandService);
  private readonly subscriptions = new Subscription();
  private readonly cdr = inject(ChangeDetectorRef);

  value = '';
  activeId: string | null = null;
  protected cn = cn;

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.activeId$.subscribe((id) => {
        this.activeId = id;
        this.cdr.markForCheck();
      })
    );
    // The dialog clears the query when it reopens; mirror that back into the box.
    this.subscriptions.add(
      this.service.query$.subscribe((query) => {
        if (query !== this.value) {
          this.value = query;
          this.cdr.markForCheck();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value = next;
    this.service.setQuery(next);
  }
}

/** Scrolling container for the command items. */
@Component({
  selector: 'tolle-command-list',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="listbox" [attr.aria-label]="ariaLabel || null" [class]="cn('max-h-80 overflow-y-auto overflow-x-hidden p-1', class)">
      <ng-content></ng-content>
    </div>
  `,
})
export class CommandListComponent {
  /** Accessible name for the list. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the list via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/**
 * Shown only when the query matches nothing. Renders nothing otherwise, so it
 * can live in the template permanently.
 */
@Component({
  selector: 'tolle-command-empty',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isEmpty" role="status" [class]="cn('py-6 text-center text-sm text-muted-foreground', class)">
      <ng-content></ng-content>
    </div>
  `,
})
export class CommandEmptyComponent implements OnInit, OnDestroy {
  /** Extra Tailwind classes merged onto the empty state via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(CommandService);
  private readonly subscriptions = new Subscription();
  private readonly cdr = inject(ChangeDetectorRef);

  isEmpty = false;
  protected cn = cn;

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.visible$.subscribe(() => {
        this.isEmpty = this.service.isEmpty;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

/**
 * A labelled section of items. The heading hides itself when filtering removes
 * every item in the group, so you never get a stranded header.
 */
@Component({
  selector: 'tolle-command-group',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  template: `
    <div role="group" [attr.aria-label]="heading || null" [class]="cn('overflow-hidden p-1 text-foreground', class)">
      <div
        *ngIf="heading"
        [class]="cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', hidden && 'hidden')"
      >
        {{ heading }}
      </div>
      <ng-content></ng-content>
    </div>
  `,
})
export class CommandGroupComponent implements OnInit, OnDestroy {
  /** Section heading. @default '' */
  @Input() heading = '';
  /** Extra Tailwind classes merged onto the group via `cn()` (last-wins). */
  @Input() class = '';

  private readonly service = inject(CommandService);
  private readonly subscriptions = new Subscription();
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly memberIds = new Set<string>();

  hidden = false;
  protected cn = cn;

  ngOnInit(): void {
    this.subscriptions.add(
      this.service.visible$.subscribe((visible) => {
        // Hide the heading once none of this group's items survive the filter.
        this.hidden = this.memberIds.size > 0 && !visible.some((id) => this.memberIds.has(id));
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** Called by child items so the group knows which ids belong to it. */
  addMember(id: string): void {
    this.memberIds.add(id);
  }

  removeMember(id: string): void {
    this.memberIds.delete(id);
  }
}

/** A selectable row in a command menu. */
@Component({
  selector: 'tolle-command-item',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="visible"
      [id]="id"
      role="option"
      [attr.aria-selected]="active"
      [attr.aria-disabled]="disabled || null"
      [attr.data-active]="active ? '' : null"
      [class]="computedClass"
      (click)="onClick()"
      (mouseenter)="onMouseEnter()"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class CommandItemComponent implements OnInit, OnChanges, OnDestroy {
  /** Value emitted from the menu's `selected` output when this row is chosen. */
  @Input() value: any = null;
  /**
   * Text matched against the query. Defaults to `value` when omitted — set it
   * explicitly whenever the row's visible text differs from its value.
   * @default ''
   */
  @Input() label = '';
  /** Extra terms that should also match this row, e.g. synonyms. @default [] */
  @Input() keywords: string[] = [];
  /** Makes the row unselectable and skipped by the arrow keys. @default false */
  @Input() disabled = false;
  /** Extra Tailwind classes merged onto the row via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted when this specific row is chosen. */
  @Output() selected = new EventEmitter<any>();

  private readonly service = inject(CommandService);
  private readonly group = inject(CommandGroupComponent, { optional: true });
  private readonly subscriptions = new Subscription();
  private readonly cdr = inject(ChangeDetectorRef);

  readonly id = `command-item-${commandItemId++}`;
  visible = true;
  active = false;

  ngOnInit(): void {
    this.service.register({
      id: this.id,
      searchText: this.searchText,
      value: this.value,
      disabled: this.disabled,
    });
    this.group?.addMember(this.id);

    this.subscriptions.add(
      this.service.visible$.subscribe((ids) => {
        this.visible = ids.includes(this.id);
        this.cdr.markForCheck();
      })
    );
    this.subscriptions.add(
      this.service.activeId$.subscribe((activeId) => {
        this.active = activeId === this.id;
        this.cdr.markForCheck();
      })
    );
    this.subscriptions.add(
      this.service.selected$.subscribe((value) => {
        if (value === this.value) this.selected.emit(value);
      })
    );
  }

  ngOnChanges(): void {
    this.service.update(this.id, {
      searchText: this.searchText,
      value: this.value,
      disabled: this.disabled,
    });
  }

  ngOnDestroy(): void {
    this.group?.removeMember(this.id);
    this.service.unregister(this.id);
    this.subscriptions.unsubscribe();
  }

  /** Label plus keywords, so synonyms match without being displayed. */
  private get searchText(): string {
    const base = this.label || (this.value != null ? String(this.value) : '');
    return [base, ...this.keywords].join(' ');
  }

  get computedClass() {
    return cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
      this.active && !this.disabled && 'bg-accent text-accent-foreground',
      this.disabled && 'pointer-events-none opacity-50',
      this.class
    );
  }

  onClick(): void {
    if (this.disabled) return;
    this.service.selectById(this.id);
  }

  onMouseEnter(): void {
    if (this.disabled) return;
    this.service.setActive(this.id);
  }
}

/** Divider between command groups. */
@Component({
  selector: 'tolle-command-separator',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div role="separator" [class]="cn('-mx-1 h-px bg-border', class)"></div>`,
})
export class CommandSeparatorComponent {
  /** Extra Tailwind classes merged onto the separator via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/** Right-aligned shortcut hint inside a command item. Pairs with `tolle-kbd`. */
@Component({
  selector: 'tolle-command-shortcut',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="cn('ml-auto flex items-center gap-1 text-xs tracking-widest text-muted-foreground', class)"><ng-content></ng-content></span>`,
})
export class CommandShortcutComponent {
  /** Extra Tailwind classes merged onto the shortcut via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}
