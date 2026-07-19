import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
  ViewChild,
  OnDestroy,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate, size } from '@floating-ui/dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import { SelectItemComponent } from './select-item.component';
import { Subscription } from 'rxjs';
import { SelectService } from './select.service';
import { InputComponent } from './input.component';

const selectTriggerVariants = cva(
  'flex w-full items-center justify-between rounded-md border border-input bg-background text-foreground shadow-sm transition-all duration-200',
  {
    variants: {
      size: {
        xs: 'h-8 px-2 text-xs',
        sm: 'h-9 px-3 text-sm',
        default: 'h-10 px-3 text-sm',
        lg: 'h-11 px-4 text-base',
      },
      disabled: {
        true: 'cursor-not-allowed border-opacity-50 opacity-50',
        false: '',
      },
      readonly: {
        true: 'cursor-default border-dashed',
        false: '',
      },
    },
    compoundVariants: [
      // Only an interactive trigger gets the hover border and the focus ring.
      {
        disabled: false,
        readonly: false,
        class:
          'hover:border-accent focus-visible:border-primary/80 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-offset-0',
      },
      // Readonly still takes focus, but without the emphasis ring.
      {
        disabled: false,
        readonly: true,
        class: 'focus-visible:border-opacity-100 focus-visible:ring-0',
      },
    ],
    defaultVariants: { size: 'default', disabled: false, readonly: false },
  }
);

const selectIconVariants = cva(
  'ri-arrow-down-s-line ml-2 text-muted-foreground transition-transform duration-200',
  {
    variants: {
      size: {
        xs: 'text-[14px]',
        sm: 'text-[14px]',
        default: 'text-[18px]',
        lg: 'text-[18px]',
      },
      open: { true: 'rotate-180', false: '' },
      muted: { true: 'opacity-30', false: '' },
    },
    defaultVariants: { size: 'default', open: false, muted: false },
  }
);

export type SelectProps = VariantProps<typeof selectTriggerVariants>;

/**
 * A single-select listbox: a trigger that opens a floating panel of
 * `tolle-select-item` options, with optional inline search. Implements
 * `ControlValueAccessor`, so it works with `ngModel` and reactive forms.
 */
@Component({
  selector: 'tolle-select',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SelectService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  styles: [':host { display: block; }', '.hidden-dropdown { display: none !important; }'],
  template: `
    <div class="relative w-full" #container>
      <button
        type="button"
        #trigger
        role="combobox"
        aria-haspopup="listbox"
        [attr.aria-expanded]="isOpen"
        [attr.aria-activedescendant]="isOpen ? activeDescendantId : null"
        [attr.data-state]="isOpen ? 'open' : 'closed'"
        (click)="toggle()"
        (keydown)="onTriggerKeyDown($event)"
        [disabled]="disabled"
        [class]="computedTriggerClass"
      >
        <span class="truncate" [class.text-muted-foreground]="!selectedLabel">
          {{ selectedLabel || placeholder }}
        </span>
        <i [class]="iconClass"></i>
      </button>

      <div
        #popover
        [class.hidden-dropdown]="!isOpen"
        class="fixed bg-popover z-[999] overflow-auto flex flex-col rounded-md border border-border text-popover-foreground shadow-md"
        style="visibility: hidden; top: 0; left: 0;">
        <div *ngIf="searchable" class="p-2 border-b border-border bg-popover h-auto">
          <tolle-input
            #searchInput
            size="xs"
            placeholder="Search..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            (keydown)="onSearchKeyDown($event)"
            class="w-full">
            <i prefix class="ri-search-line"></i>
          </tolle-input>
        </div>

        <div role="listbox" class="p-1 overflow-y-auto grow h-full w-full">
          <ng-content></ng-content>
          <div *ngIf="noResults" class="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SelectComponent
  implements ControlValueAccessor, AfterContentInit, OnChanges, OnDestroy {
  /** Text shown on the trigger when nothing is selected. @default 'Select an option' */
  @Input() placeholder = 'Select an option';
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). @default '' */
  @Input() class = '';
  /** Disables the control and blocks opening the panel. @default false */
  @Input() disabled = false;
  /** Adds a search box that filters the projected options. @default false */
  @Input() searchable = false;
  /** Height and text size of the trigger. @default 'default' */
  @Input() size: SelectProps['size'] = 'default';
  /** Shows the current value but blocks opening the panel. @default false */
  @Input() readonly = false;

  /** Emitted with the chosen value whenever the selection changes. */
  @Output() valueChange = new EventEmitter<any>();
  /** Emitted when the panel opens. */
  @Output() opened = new EventEmitter<void>();
  /** Emitted when the panel closes. */
  @Output() closed = new EventEmitter<void>();

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  @ViewChild('searchInput', { read: ElementRef }) searchInput?: ElementRef<HTMLElement>;
  @ContentChildren(SelectItemComponent, { descendants: true }) items!: QueryList<SelectItemComponent>;

  private sub = new Subscription();
  private itemsChangeSub?: Subscription;
  private pendingValue: any = undefined;

  searchQuery = '';
  noResults = false;
  isOpen = false;
  value: any = null;
  selectedLabel = '';
  cleanupAutoUpdate?: () => void;

  // Keyboard navigation (active-descendant) state
  activeIndex = -1;
  private typeaheadBuffer = '';
  private typeaheadTime = 0;
  private pendingTypeaheadChar = '';

  onChange: any = () => { };
  onTouched: any = () => { };

  protected cn = cn;

  constructor(
    private selectService: SelectService,
    private cdr: ChangeDetectorRef
  ) {
    this.sub.add(
      this.selectService.selectedValue$.subscribe(val => {
        this.value = val;
        this.onChange(val);
        this.valueChange.emit(val);
        this.updateItemSelection();
        this.cdr.markForCheck();
      })
    );

    this.sub.add(
      this.selectService.selectedLabel$.subscribe(label => {
        this.selectedLabel = label;
        this.close();
        this.cdr.markForCheck();
      })
    );
  }

  get computedTriggerClass() {
    return cn(
      selectTriggerVariants({
        size: this.size,
        disabled: this.disabled,
        readonly: this.readonly,
      }),
      this.class
    );
  }

  get iconClass() {
    return cn(
      selectIconVariants({
        size: this.size,
        open: this.isOpen,
        muted: this.disabled || this.readonly,
      })
    );
  }

  /**
   * Under OnPush a `[class]` binding is applied through Angular's *styling*
   * path, which writes the input but — unlike a plain property binding — never
   * marks the component dirty. Without this the trigger would keep rendering
   * the class it was born with. Covering every input here is cheap and leaves
   * no second instance of that trap.
   */
  ngOnChanges() {
    this.cdr.markForCheck();
  }

  ngAfterContentInit() {
    // Subscribe to items changes to handle dynamic content
    this.itemsChangeSub = this.items.changes.subscribe(() => {
      this.updateItemSelection();
      this.applyPendingValue();
      this.cdr.markForCheck();
    });

    // Apply initial selection if items are already available
    this.updateItemSelection();
    this.applyPendingValue();
  }

  private applyPendingValue(): void {
    if (this.pendingValue !== undefined && this.items && this.items.length > 0) {
      const found = this.items.find(i => i.value === this.pendingValue);
      if (found) {
        this.selectedLabel = found.getLabel();
        this.cdr.markForCheck();
      }
      this.pendingValue = undefined;
    }
  }

  private updateItemSelection() {
    if (this.items) {
      this.items.forEach(item => {
        item.selected = item.value === this.value;
      });
    }
  }

  private _outsideClickHandler = (event: MouseEvent) => {
    if (!this.trigger.nativeElement.contains(event.target) && !this.popover?.nativeElement.contains(event.target)) {
      this.close();
    }
  };

  toggle() {
    if (this.disabled || this.readonly) return;
    this.isOpen ? this.close() : this.open();
  }

  open() {
    const wasOpen = this.isOpen;
    this.isOpen = true;
    this.trigger.nativeElement.focus();
    if (!wasOpen) this.opened.emit();
    this.cdr.markForCheck();
    requestAnimationFrame(() => {
      this.updatePosition();
      document.addEventListener('pointerdown', this._outsideClickHandler, true);
      this.initActiveAfterOpen();
      this.cdr.markForCheck();
    });
  }

  close() {
    const wasOpen = this.isOpen;
    this.isOpen = false;
    this.searchQuery = '';
    this.onSearchChange('');
    this.resetActive();
    if (this.cleanupAutoUpdate) this.cleanupAutoUpdate();
    document.removeEventListener('pointerdown', this._outsideClickHandler, true);
    if (wasOpen) this.closed.emit();
    this.cdr.markForCheck();
  }

  private updatePosition() {
    if (!this.trigger || !this.popover) return;

    this.cleanupAutoUpdate = autoUpdate(
      this.trigger.nativeElement,
      this.popover.nativeElement,
      () => {
        computePosition(this.trigger.nativeElement, this.popover.nativeElement, {
          strategy: 'fixed',
          placement: 'bottom-start',
          middleware: [
            offset(4),
            flip(),
            shift({ padding: 8 }),
            // Match the panel to the trigger width and cap its height to the
            // space actually available, so the list scrolls instead of
            // overflowing.
            size({
              apply({ rects, elements, availableHeight }) {
                Object.assign(elements.floating.style, {
                  width: rects.reference.width + 'px',
                  maxHeight: availableHeight + 'px'
                });
              },
            }),
          ],
        }).then(({ x, y, strategy }) => {
          Object.assign(this.popover.nativeElement.style, {
            position: strategy,
            left: x + 'px',
            top: y + 'px',
            visibility: 'visible',
          });
        });
      }
    );
  }

  onSearchChange(query: string) {
    const filter = (query || '').toLowerCase().trim();
    let visibleCount = 0;

    this.items.forEach(item => {
      const text = item.getLabel().toLowerCase();
      const isVisible = text.includes(filter);
      item.hidden = !isVisible;
      if (isVisible) visibleCount++;
    });

    this.noResults = visibleCount === 0 && filter !== '';

    // Re-anchor the active option to the first visible match while open.
    if (this.isOpen) this.setActive(0);
    this.cdr.markForCheck();
  }

  // ---- Keyboard navigation (WAI-ARIA listbox pattern) ----

  private get navigableItems(): SelectItemComponent[] {
    return this.items ? this.items.filter(i => !i.hidden && !i.disabled) : [];
  }

  get activeDescendantId(): string | null {
    const list = this.navigableItems;
    return this.activeIndex >= 0 && this.activeIndex < list.length
      ? list[this.activeIndex].id
      : null;
  }

  private updateActiveStates() {
    const list = this.navigableItems;
    const activeItem = this.activeIndex >= 0 ? list[this.activeIndex] ?? null : null;
    this.items?.forEach(i => (i.active = i === activeItem));
    this.syncActiveDescendant();
    this.cdr.markForCheck();
  }

  private syncActiveDescendant() {
    const input = this.searchInput?.nativeElement?.querySelector('input');
    if (!input) return;
    const id = this.activeDescendantId;
    if (id) input.setAttribute('aria-activedescendant', id);
    else input.removeAttribute('aria-activedescendant');
  }

  private setActive(index: number) {
    const list = this.navigableItems;
    if (!list.length) {
      this.activeIndex = -1;
      this.updateActiveStates();
      return;
    }
    this.activeIndex = Math.max(0, Math.min(index, list.length - 1));
    this.updateActiveStates();
    list[this.activeIndex]?.scrollIntoActiveView();
  }

  private setActiveItem(item: SelectItemComponent) {
    const idx = this.navigableItems.indexOf(item);
    if (idx >= 0) this.setActive(idx);
  }

  private moveActive(delta: number) {
    const list = this.navigableItems;
    if (!list.length) return;
    const next = this.activeIndex < 0 ? (delta > 0 ? 0 : list.length - 1) : this.activeIndex + delta;
    this.setActive(next); // setActive clamps (no wrap, matching shadcn)
  }

  private setActiveToSelectedOrFirst() {
    const list = this.navigableItems;
    if (!list.length) {
      this.activeIndex = -1;
      this.updateActiveStates();
      return;
    }
    const selIdx = list.findIndex(i => i.value === this.value);
    this.setActive(selIdx >= 0 ? selIdx : 0);
  }

  private initActiveAfterOpen() {
    if (this.pendingTypeaheadChar) {
      const c = this.pendingTypeaheadChar;
      this.pendingTypeaheadChar = '';
      this.setActiveToSelectedOrFirst();
      this.typeahead(c);
    } else {
      this.setActiveToSelectedOrFirst();
    }
  }

  private resetActive() {
    this.activeIndex = -1;
    this.typeaheadBuffer = '';
    this.pendingTypeaheadChar = '';
    this.items?.forEach(i => (i.active = false));
  }

  private isTypeaheadChar(event: KeyboardEvent): boolean {
    return event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey;
  }

  private typeahead(char: string) {
    const now = Date.now();
    // Reset the buffer based on elapsed time (correctness is not timer-driven).
    if (now - this.typeaheadTime > 500) this.typeaheadBuffer = '';
    this.typeaheadTime = now;
    this.typeaheadBuffer += char.toLowerCase();
    const match = this.navigableItems.find(i =>
      i.getLabel().toLowerCase().startsWith(this.typeaheadBuffer)
    );
    if (match) this.setActiveItem(match);
  }

  private selectActive() {
    const item = this.navigableItems[this.activeIndex];
    if (!item) return;
    // Single-select: notify parent (which closes and syncs the label).
    this.selectService.registerClick(item.value, item.getLabel());
    this.trigger.nativeElement.focus();
  }

  onTriggerKeyDown(event: KeyboardEvent) {
    if (this.disabled || this.readonly) return;
    const key = event.key;

    if (!this.isOpen) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ' || key === 'Home' || key === 'End') {
        event.preventDefault();
        this.open();
        return;
      }
      if (this.isTypeaheadChar(event)) {
        event.preventDefault();
        this.pendingTypeaheadChar = key;
        this.open();
      }
      return;
    }

    switch (key) {
      case 'ArrowDown': event.preventDefault(); this.moveActive(1); break;
      case 'ArrowUp': event.preventDefault(); this.moveActive(-1); break;
      case 'Home': event.preventDefault(); this.setActive(0); break;
      case 'End': event.preventDefault(); this.setActive(this.navigableItems.length - 1); break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectActive();
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        this.trigger.nativeElement.focus();
        break;
      case 'Tab':
        this.close();
        break;
      default:
        if (this.isTypeaheadChar(event)) {
          event.preventDefault();
          this.typeahead(key);
        }
    }
  }

  // Keydown while the (optional) search input is focused. Arrows/Enter/Escape
  // drive the list; other keys fall through so the user can type to filter.
  onSearchKeyDown(event: KeyboardEvent) {
    if (!this.isOpen) return;
    switch (event.key) {
      case 'ArrowDown': event.preventDefault(); this.moveActive(1); break;
      case 'ArrowUp': event.preventDefault(); this.moveActive(-1); break;
      case 'Enter': event.preventDefault(); this.selectActive(); break;
      case 'Escape':
        event.preventDefault();
        this.close();
        this.trigger.nativeElement.focus();
        break;
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.updateItemSelection();
    if (this.items && this.items.length > 0) {
      const found = this.items.find(i => i.value === value);
      if (found) {
        this.selectedLabel = found.getLabel();
      }
    } else {
      // Queue the value for when items become available
      this.pendingValue = value;
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.itemsChangeSub?.unsubscribe();
    if (this.cleanupAutoUpdate) this.cleanupAutoUpdate();
    document.removeEventListener('pointerdown', this._outsideClickHandler, true);
  }
}
