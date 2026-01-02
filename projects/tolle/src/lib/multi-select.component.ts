import { Component, Input, ContentChildren, QueryList, AfterContentInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate, size } from '@floating-ui/dom';
import { SelectItemComponent } from './select-item.component';
import { SelectService } from './select.service';
import { cn } from './utils/cn';
import { InputComponent } from './input.component';
import { BadgeComponent } from './badge.component';

@Component({
  selector: 'tolle-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent, InputComponent],
  providers: [
    SelectService,
    { provide: NG_VALUE_ACCESSOR, useExisting: MultiSelectComponent, multi: true }
  ],
  template: `
    <div [class]="cn('relative w-full', 'size-' + size)" #container>
      <button
        #trigger
        type="button"
        (click)="toggle()"
        [disabled]="disabled"
        [class]="computedTriggerClass">

        <div class="flex flex-wrap gap-1 items-center max-w-[95%]">
          <ng-container *ngIf="value?.length; else placeholderTpl">
            <tolle-badge *ngFor="let item of displayItems" size="xs" variant="secondary" [removable]="true" (onRemove)="removeValue($event, item.value)">
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
           class="fixed bg-popover z-[999] rounded-md border border-border shadow-md overflow-hidden"
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

          <tolle-input *ngIf="searchable" size="xs" placeholder="Search..." [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange($event)">
            <i prefix class="ri-search-line"></i>
          </tolle-input>

          <div class="flex items-center justify-between px-1">
            <button type="button"
                    (click)="selectAll()"
                    [disabled]="maxSelections && selectableItems.length > maxSelections"
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
export class MultiSelectComponent implements ControlValueAccessor, AfterContentInit {
  @Input() placeholder = 'Select options...';
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  @Input() searchable = false;
  @Input() disabled = false;
  @Input() class = '';
  @Input() maxSelections?: number;
  @Input() maxDisplayItems = 3;
  @Input() error = false; // Added to support error styling

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;
  @ContentChildren(SelectItemComponent, { descendants: true }) items!: QueryList<SelectItemComponent>;

  value: any[] = [];
  selectedItems: {label: string, value: any}[] = [];
  isOpen = false;
  searchQuery = '';
  noResults = false;
  private cleanup?: () => void;

  constructor(private selectService: SelectService) {
    this.selectService.selectedValue$.subscribe(val => {
      if (val !== undefined && this.isOpen) this.toggleValue(val);
    });
  }

  // NEW: Matches InputComponent styles exactly
  get computedTriggerClass() {
    return cn(
      // Base styles
      'flex min-h-10 w-full items-center justify-between rounded-md border transition-all duration-200 h-auto',
      'bg-background text-sm',

      // Border and shadow
      'border-input shadow-sm',

      // Padding based on size (aligned with InputComponent logic)
      this.size === 'xs' && 'px-2 py-1',
      this.size === 'sm' && 'px-3 py-1.5',
      this.size === 'default' && 'px-3 py-2',
      this.size === 'lg' && 'px-4 py-2',

      // Focus state - ZARDUI STYLE (Soft ring, no offset)
      !this.disabled && [
        'focus:outline-none',
        'focus:ring-4',
        'focus:ring-ring/30',
        'focus:ring-offset-0',
        'focus:shadow-none',
        'focus:border-primary/80' // Darkens border on focus
      ],

      // Hover state
      !this.disabled && 'hover:border-accent',

      // Error state
      this.error && [
        'border-destructive',
        !this.disabled && [
          'focus:border-destructive/80',
          'focus:ring-destructive/30'
        ]
      ],

      // Disabled state
      this.disabled && [
        'cursor-not-allowed opacity-50',
        'border-opacity-50'
      ],

      this.class
    );
  }

  ngAfterContentInit() {
    this.syncItems();
    this.items.changes.subscribe(() => this.syncItems());
  }

  get displayItems(): {label: string, value: any}[] {
    return this.selectedItems.slice(0, this.maxDisplayItems);
  }

  get exceedsDisplayLimit(): boolean {
    return this.value.length > this.maxDisplayItems;
  }

  get selectableItems(): SelectItemComponent[] {
    return this.items ? this.items.filter(item => !item.disabled) : [];
  }

  get availableSelections(): number {
    if (!this.maxSelections) return Infinity;
    return Math.max(0, this.maxSelections - this.value.length);
  }

  toggle() {
    if (this.disabled) return;
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    setTimeout(() => this.updatePosition());
  }

  close() {
    this.isOpen = false;
    this.searchQuery = '';
    this.onSearchChange('');
    if (this.cleanup) this.cleanup();
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
                width: `${rects.reference.width}px`,
                maxHeight: `${availableHeight}px`
              });
            },
          }),
        ],
      }).then(({ x, y, strategy }) => {
        Object.assign(this.popover.nativeElement.style, {
          position: strategy,
          left: `${x}px`,
          top: `${y}px`,
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
    this.onChange([...this.value]);
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
    this.onChange([...this.value]);
  }

  clearAll() {
    this.value = [];
    this.syncItems();
    this.onChange([]);
  }

  removeValue(event: MouseEvent, val: any) {
    event.stopPropagation();
    this.toggleValue(val);
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
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.isOpen && !this.trigger.nativeElement.contains(event.target) && !this.popover?.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  // ControlValueAccessor
  onChange: any = () => {};
  onTouched: any = () => {};
  writeValue(v: any[]): void {
    this.value = Array.isArray(v) ? v : [];
    this.syncItems();
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  protected cn = cn;
}
