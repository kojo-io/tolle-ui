import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ElementRef,
  ViewChild,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate, size } from '@floating-ui/dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { Subscription } from 'rxjs';
import { SelectItemComponent } from './select-item.component';
import { SelectService } from './select.service';
import { cn } from './utils/cn';
import { InputComponent } from './input.component';
import { BadgeComponent } from './badge.component';

const multiSelectTriggerVariants = cva(
  'flex h-auto min-h-10 w-full items-center justify-between rounded-md border border-input bg-background text-sm shadow-sm transition-all duration-200',
  {
    variants: {
      size: {
        xs: 'px-2 py-1',
        sm: 'px-3 py-1.5',
        default: 'px-3 py-2',
        lg: 'px-4 py-2',
      },
      error: {
        true: 'border-destructive',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed border-opacity-50 opacity-50',
        false: '',
      },
    },
    compoundVariants: [
      // Only an interactive trigger gets the hover border and the focus ring.
      {
        disabled: false,
        class:
          'hover:border-accent focus-visible:border-primary/80 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-offset-0',
      },
      // …and an invalid one rings destructive instead. Declared after the rule
      // above so `cn()` resolves the conflict in its favour.
      {
        disabled: false,
        error: true,
        class: 'focus-visible:border-destructive/80 focus-visible:ring-destructive/30',
      },
    ],
    defaultVariants: { size: 'default', error: false, disabled: false },
  }
);

export type MultiSelectProps = VariantProps<typeof multiSelectTriggerVariants>;

/** One chip on the trigger, standing for a selected option. */
export interface MultiSelectChip {
  label: string;
  value: any;
}

/**
 * A multi-select listbox: a trigger that shows the current selection as
 * removable chips and opens a floating panel of `tolle-select-item` options.
 * Implements `ControlValueAccessor`, so it works with `ngModel` and reactive
 * forms.
 */
@Component({
  selector: 'tolle-multi-select',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent, InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SelectService,
    { provide: NG_VALUE_ACCESSOR, useExisting: MultiSelectComponent, multi: true }
  ],
  template: `
    <div class="relative w-full" #container>
      <button
        #trigger
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        [attr.aria-expanded]="isOpen"
        [attr.aria-activedescendant]="isOpen ? activeDescendantId : null"
        (click)="toggle()"
        (keydown)="onTriggerKeyDown($event)"
        [disabled]="disabled"
        [class]="computedTriggerClass">

        <div class="flex flex-wrap gap-1 items-center max-w-[95%]">
          <ng-container *ngIf="value.length; else placeholderTpl">
            <tolle-badge *ngFor="let item of displayItems; trackBy: trackChip" size="xs" variant="secondary" [removable]="true" (onRemove)="removeValue($event, item.value)">
              {{ item.label }}
            </tolle-badge>
            <span *ngIf="exceedsDisplayLimit" class="text-xs text-muted-foreground px-1">
              +{{ value.length - maxDisplayItems }} more
            </span>
            <span *ngIf="maxSelections && value.length >= maxSelections" class="text-xs text-muted-foreground px-1">
              (Max reached)
            </span>
          </ng-container>
          <ng-template #placeholderTpl><span class="text-muted-foreground">{{ placeholder }}</span></ng-template>
        </div>
        <i [class]="cn('ri-arrow-down-s-line text-muted-foreground ml-2 transition-transform duration-200', isOpen ? 'rotate-180' : '')"></i>
      </button>

      <div #popover *ngIf="isOpen"
           role="listbox"
           aria-multiselectable="true"
           class="fixed bg-popover text-popover-foreground z-[999] rounded-md border border-border shadow-md overflow-hidden"
           style="visibility: hidden; top: 0; left: 0;">

        <div class="p-2 border-b border-border space-y-2 bg-popover">
          <div class="flex items-center justify-between px-1 text-xs">
            <span class="text-muted-foreground">
              {{ value.length }} selected
              <span *ngIf="maxSelections">/ {{ maxSelections }} max</span>
            </span>
            <span *ngIf="maxSelections && value.length >= maxSelections" class="text-destructive text-xs font-medium">
              Maximum reached
            </span>
          </div>

          <tolle-input *ngIf="searchable" #searchInput size="xs" placeholder="Search..." [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange($event)" (keydown)="onSearchKeyDown($event)">
            <i prefix class="ri-search-line"></i>
          </tolle-input>

          <div class="flex items-center justify-between px-1">
            <button type="button"
                    (click)="selectAll()"
                    [disabled]="!!(maxSelections && selectableItems.length > maxSelections)"
                    [class]="cn(
                      'text-[10px] font-bold uppercase transition-colors',
                      maxSelections && selectableItems.length > maxSelections
                        ? 'text-muted-foreground cursor-not-allowed'
                        : 'text-primary hover:underline'
                    )">
              Select All
            </button>
            <button type="button" (click)="clearAll()" class="text-[10px] font-bold uppercase text-muted-foreground hover:underline">
              Clear
            </button>
          </div>
        </div>

        <div class="p-1 max-h-60 overflow-y-auto">
          <ng-content></ng-content>
          <div *ngIf="noResults" class="py-4 text-center text-xs text-muted-foreground">
            No results found for "{{searchQuery}}"
          </div>
          <div *ngIf="maxSelections && value.length >= maxSelections"
               class="p-2 text-center border-t border-border bg-muted/20">
            <span class="text-xs text-destructive">
              <i class="ri-alert-line mr-1"></i>
              Maximum selection limit reached ({{maxSelections}})
            </span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MultiSelectComponent
  implements ControlValueAccessor, AfterContentInit, OnChanges, OnDestroy {
  /** Text shown on the trigger when nothing is selected. @default 'Select options...' */
  @Input() placeholder = 'Select options...';
  /** Padding and text size of the trigger. @default 'default' */
  @Input() size: MultiSelectProps['size'] = 'default';
  /** Adds a search box that filters the projected options. @default false */
  @Input() searchable = false;
  /** Disables the control and blocks opening the panel. @default false */
  @Input() disabled = false;
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). @default '' */
  @Input() class = '';
  /** Largest number of values that can be selected at once; leave unset for no cap. */
  @Input() maxSelections?: number;
  /** How many chips to render before collapsing the rest into a "+N more" hint. @default 3 */
  @Input() maxDisplayItems = 3;
  /** Applies the destructive border and focus ring. @default false */
  @Input() error = false;

  /** Emitted with the full array of selected values whenever the selection changes. */
  @Output() valueChange = new EventEmitter<any[]>();
  /** Emitted when the panel opens. */
  @Output() opened = new EventEmitter<void>();
  /** Emitted when the panel closes. */
  @Output() closed = new EventEmitter<void>();

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;
  @ViewChild('searchInput', { read: ElementRef }) searchInput?: ElementRef<HTMLElement>;
  @ContentChildren(SelectItemComponent, { descendants: true }) items!: QueryList<SelectItemComponent>;

  value: any[] = [];
  selectedItems: MultiSelectChip[] = [];

  /**
   * The chips actually rendered, built into a field rather than read from a
   * getter. A getter hands `*ngFor` a freshly-allocated array on every
   * change-detection pass; paired with the default identity differ that tore
   * down and rebuilt every badge — including the one under the pointer, whose
   * destruction re-fires its own remove handler. See `trackChip` below, which
   * closes the same hole for the rebuilt chip objects `syncItems()` produces.
   */
  displayItems: MultiSelectChip[] = [];
  exceedsDisplayLimit = false;

  isOpen = false;
  searchQuery = '';
  noResults = false;
  private cleanup?: () => void;
  private sub = new Subscription();

  // Keyboard navigation (active-descendant) state
  activeIndex = -1;
  private typeaheadBuffer = '';
  private typeaheadTime = 0;
  private pendingTypeaheadChar = '';

  constructor(
    private selectService: SelectService,
    private cdr: ChangeDetectorRef
  ) {
    this.sub.add(
      this.selectService.selectedValue$.subscribe(val => {
        if (val !== undefined && this.isOpen) this.toggleValue(val);
      })
    );
  }

  get computedTriggerClass() {
    return cn(
      multiSelectTriggerVariants({
        size: this.size,
        error: this.error,
        disabled: this.disabled,
      }),
      this.class
    );
  }

  ngAfterContentInit() {
    this.syncItems();
    this.sub.add(this.items.changes.subscribe(() => {
      this.syncItems();
      this.cdr.markForCheck();
    }));
  }

  /**
   * `maxDisplayItems` decides how much of the selection is rendered, so the
   * chip list has to be rebuilt when it changes.
   *
   * The `markForCheck()` is not redundant: under OnPush a `[class]` binding is
   * applied through Angular's *styling* path, which writes the input but —
   * unlike a plain property binding — never marks the component dirty, so the
   * trigger would keep rendering the class it was born with.
   */
  ngOnChanges() {
    this.refreshDisplay();
    this.cdr.markForCheck();
  }

  /** `*ngFor` identity for the chips — keyed on the option value, not the
   * wrapper object, which `syncItems()` re-allocates on every sync. */
  trackChip = (_index: number, chip: MultiSelectChip): any => chip.value;

  private refreshDisplay(): void {
    this.displayItems = this.selectedItems.slice(0, this.maxDisplayItems);
    this.exceedsDisplayLimit = this.value.length > this.maxDisplayItems;
  }

  get selectableItems(): SelectItemComponent[] {
    return this.items ? this.items.filter(item => !item.disabled) : [];
  }

  get availableSelections(): number {
    if (!this.maxSelections) return Infinity;
    return Math.max(0, this.maxSelections - this.value.length);
  }

  private _outsideClickHandler = (event: MouseEvent) => {
    if (!this.trigger.nativeElement.contains(event.target) && !this.popover?.nativeElement.contains(event.target)) {
      this.close();
    }
  };

  toggle() {
    if (this.disabled) return;
    this.isOpen ? this.close() : this.open();
  }

  open() {
    const wasOpen = this.isOpen;
    this.isOpen = true;
    if (!wasOpen) this.opened.emit();
    this.cdr.markForCheck();
    setTimeout(() => {
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
    if (this.cleanup) this.cleanup();
    document.removeEventListener('pointerdown', this._outsideClickHandler, true);
    if (wasOpen) this.closed.emit();
    this.cdr.markForCheck();
  }

  private updatePosition() {
    if (!this.trigger || !this.popover) return;

    this.cleanup = autoUpdate(this.trigger.nativeElement, this.popover.nativeElement, () => {
      computePosition(this.trigger.nativeElement, this.popover.nativeElement, {
        strategy: 'fixed',
        placement: 'bottom-start',
        middleware: [
          offset(4),
          flip(),
          shift({ padding: 8 }),
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
    });
  }

  toggleValue(val: any) {
    const index = this.value.indexOf(val);
    if (index > -1) {
      this.value.splice(index, 1);
    } else {
      if (this.maxSelections && this.value.length >= this.maxSelections) return;
      this.value.push(val);
    }
    this.syncItems();
    this.emitValue();
  }

  selectAll() {
    if (!this.items) return;
    let itemsToSelect: any[] = [];
    if (this.maxSelections) {
      const availableItems = this.items
        .filter(item => !item.disabled && !this.value.includes(item.value))
        .slice(0, this.availableSelections)
        .map(item => item.value);
      itemsToSelect = [...this.value, ...availableItems];
    } else {
      itemsToSelect = this.items.filter(item => !item.disabled).map(item => item.value);
    }
    this.value = itemsToSelect;
    this.syncItems();
    this.emitValue();
  }

  clearAll() {
    this.value = [];
    this.syncItems();
    this.emitValue();
  }

  removeValue(event: MouseEvent, val: any) {
    event.stopPropagation();
    this.toggleValue(val);
  }

  private emitValue(): void {
    const snapshot = [...this.value];
    this.onChange(snapshot);
    this.valueChange.emit(snapshot);
    this.cdr.markForCheck();
  }

  private syncItems() {
    if (!this.items) return;
    this.selectedItems = [];
    this.items.forEach(item => {
      item.selected = this.value.includes(item.value);
      if (item.selected) {
        this.selectedItems.push({ label: item.getLabel(), value: item.value });
      }
      if (this.maxSelections && this.value.length >= this.maxSelections) {
        item.disabled = !this.value.includes(item.value);
      } else if (item.disabled) {
        item.disabled = false;
      }
    });
    this.refreshDisplay();
    this.cdr.markForCheck();
  }

  onSearchChange(q: string) {
    const filter = (q || '').toLowerCase();
    let visibleCount = 0;
    this.items.forEach(item => {
      const isVisible = item.getLabel().toLowerCase().includes(filter);
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
    const selIdx = list.findIndex(i => this.value.includes(i.value));
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
    // Multi-select: mirror SelectItemComponent.onClick — toggle and stay open.
    item.selected = !item.selected;
    this.selectService.registerClick(item.value, item.getLabel());
    // syncItems() ran synchronously via the service subscription; keep the
    // same option highlighted (its index may have shifted).
    this.setActiveItem(item);
  }

  onTriggerKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;
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

  ngOnDestroy() {
    this.sub.unsubscribe();
    document.removeEventListener('pointerdown', this._outsideClickHandler, true);
    if (this.cleanup) this.cleanup();
  }

  // ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };
  writeValue(v: any[]): void {
    this.value = Array.isArray(v) ? v : [];
    this.syncItems();
    this.refreshDisplay();
    this.cdr.markForCheck();
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  protected cn = cn;
}
