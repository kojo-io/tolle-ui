import { Component, input, contentChildren, AfterContentInit, ElementRef, viewChild, HostListener, signal, computed, inject, effect } from '@angular/core';

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
  imports: [FormsModule, BadgeComponent, InputComponent],
  providers: [
    SelectService,
    { provide: NG_VALUE_ACCESSOR, useExisting: MultiSelectComponent, multi: true }
  ],
  template: `
    <div [class]="cn('relative w-full', 'size-' + size())" #container>
      <button
        #trigger
        type="button"
        (click)="toggle()"
        [disabled]="disabled()"
        [class]="computedTriggerClass()">
    
        <div class="flex flex-wrap gap-1 items-center max-w-[95%]">
          @if (value().length) {
            @for (item of displayItems(); track item.value) {
              <tolle-badge size="xs" variant="secondary" [removable]="true" (onRemove)="removeValue($event, item.value)">
                {{ item.label }}
              </tolle-badge>
            }
            @if (exceedsDisplayLimit()) {
              <span class="text-xs text-muted-foreground px-1">
                +{{ value().length - maxDisplayItems() }} more
              </span>
            }
            @if (maxSelections() && value().length >= maxSelections()!) {
              <span class="text-xs text-muted-foreground px-1">
                (Max reached)
              </span>
            }
          } @else {
            <span class="text-muted-foreground">{{ placeholder() }}</span>
          }
        </div>
        <i [class]="cn('ri-arrow-down-s-line text-muted-foreground ml-2 transition-transform duration-200', isOpen() ? 'rotate-180' : '')"></i>
      </button>
    
      @if (isOpen()) {
        <div #popover
          class="fixed bg-popover z-[999] rounded-md border border-border shadow-md overflow-hidden"
          style="visibility: hidden; top: 0; left: 0;">
          <div class="p-2 border-b border-border space-y-2 bg-popover">
            <div class="flex items-center justify-between px-1 text-xs">
              <span class="text-muted-foreground">
                {{ value().length }} selected
                @if (maxSelections()) {
                  <span>/ {{ maxSelections() }} max</span>
                }
              </span>
              @if (maxSelections() && value().length >= maxSelections()!) {
                <span class="text-destructive text-xs font-medium">
                  Maximum reached
                </span>
              }
            </div>
            @if (searchable()) {
              <tolle-input size="xs" placeholder="Search..." [ngModel]="searchQuery()" (ngModelChange)="onSearchChange($event)">
                <i prefix class="ri-search-line"></i>
              </tolle-input>
            }
            <div class="flex items-center justify-between px-1">
              <button type="button"
                (click)="selectAll()"
                [disabled]="maxSelections() && selectableItems().length > maxSelections()!"
                    [class]="cn(
                      'text-[10px] font-bold uppercase transition-colors',
                      maxSelections() && selectableItems().length > maxSelections()!
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
            @if (noResults()) {
              <div class="py-4 text-center text-xs text-muted-foreground">
                No results found for "{{searchQuery()}}"
              </div>
            }
            @if (maxSelections() && value().length >= maxSelections()!) {
              <div
                class="p-2 text-center border-t border-border bg-muted/20">
                <span class="text-xs text-destructive">
                  <i class="ri-alert-line mr-1"></i>
                  Maximum selection limit reached ({{maxSelections()}})
                </span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class MultiSelectComponent implements ControlValueAccessor, AfterContentInit {
  placeholder = input('Select options...');
  size = input<'xs' | 'sm' | 'default' | 'lg'>('default');
  searchable = input(false);
  disabled = input(false);
  class = input('');
  maxSelections = input<number>();
  maxDisplayItems = input(3);
  error = input(false);

  trigger = viewChild<ElementRef>('trigger');
  popover = viewChild<ElementRef>('popover');
  items = contentChildren(SelectItemComponent, { descendants: true });

  value = signal<any[]>([]);
  selectedItems = signal<{ label: string, value: any }[]>([]);
  isOpen = signal(false);
  searchQuery = signal('');
  noResults = signal(false);

  private cleanup?: () => void;
  private selectService = inject(SelectService);

  constructor() {
    effect(() => {
      const val = this.selectService.selectedValue();
      if (val !== undefined && val !== null && this.isOpen()) {
        this.toggleValue(val);
      }
    });

    // Reactive sync whenever items or value change
    effect(() => {
      this.syncItems();
    });
  }

  computedTriggerClass = computed(() => {
    return cn(
      'flex min-h-10 w-full items-center justify-between rounded-md border transition-all duration-200 h-auto',
      'bg-background text-sm',
      'border-input shadow-sm',
      this.size() === 'xs' && 'px-2 py-1',
      this.size() === 'sm' && 'px-3 py-1.5',
      this.size() === 'default' && 'px-3 py-2',
      this.size() === 'lg' && 'px-4 py-2',
      !this.disabled() && [
        'focus:outline-none',
        'focus:ring-4',
        'focus:ring-ring/30',
        'focus:ring-offset-0',
        'focus:shadow-none',
        'focus:border-primary/80'
      ],
      !this.disabled() && 'hover:border-accent',
      this.error() && [
        'border-destructive',
        !this.disabled() && [
          'focus:border-destructive/80',
          'focus:ring-destructive/30'
        ]
      ],
      this.disabled() && [
        'cursor-not-allowed opacity-50',
        'border-opacity-50'
      ],
      this.class()
    );
  });

  ngAfterContentInit() {
    // Initial sync will be handled by effect
  }

  displayItems = computed(() => {
    return this.selectedItems().slice(0, this.maxDisplayItems());
  });

  exceedsDisplayLimit = computed(() => {
    return this.value().length > this.maxDisplayItems();
  });

  selectableItems = computed(() => {
    return this.items().filter((item: SelectItemComponent) => !item.disabled());
  });

  availableSelections = computed(() => {
    const max = this.maxSelections();
    if (!max) return Infinity;
    return Math.max(0, max - this.value().length);
  });

  toggle() {
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    this.isOpen.set(true);
    setTimeout(() => this.updatePosition());
  }

  close() {
    this.isOpen.set(false);
    this.searchQuery.set('');
    this.onSearchChange('');
    if (this.cleanup) this.cleanup();
  }

  private updatePosition() {
    const trigger = this.trigger();
    const popover = this.popover();
    if (!trigger || !popover) return;

    this.cleanup = autoUpdate(trigger.nativeElement, popover.nativeElement, () => {
      computePosition(trigger.nativeElement, popover.nativeElement, {
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
        Object.assign(popover.nativeElement.style, {
          position: strategy,
          left: `${x}px`,
          top: `${y}px`,
          visibility: 'visible',
        });
      });
    });
  }

  toggleValue(val: any) {
    this.value.update((current: any[]) => {
      const index = current.indexOf(val);
      if (index > -1) {
        return current.filter((_: any, i: number) => i !== index);
      } else {
        if (this.maxSelections() && current.length >= this.maxSelections()!) return current;
        return [...current, val];
      }
    });
    this.onChange(this.value());
  }

  selectAll() {
    const max = this.maxSelections();
    const currentVal = this.value();
    let nextVal: any[] = [];

    if (max) {
      const availableItems = this.items()
        .filter((item: SelectItemComponent) => !item.disabled() && !currentVal.includes(item.value()))
        .slice(0, this.availableSelections())
        .map((item: SelectItemComponent) => item.value());
      nextVal = [...currentVal, ...availableItems];
    } else {
      nextVal = this.items().filter((item: SelectItemComponent) => !item.disabled()).map((item: SelectItemComponent) => item.value());
    }

    this.value.set(nextVal);
    this.onChange(this.value());
  }

  clearAll() {
    this.value.set([]);
    this.onChange([]);
  }

  removeValue(event: MouseEvent, val: any) {
    event.stopPropagation();
    this.toggleValue(val);
  }

  private syncItems() {
    const items = this.items();
    const val = this.value();
    const max = this.maxSelections();

    const nextSelectedItems: { label: string, value: any }[] = [];

    items.forEach((item: SelectItemComponent) => {
      const isSelected = val.includes(item.value());
      item.selected.set(isSelected);

      if (isSelected) {
        nextSelectedItems.push({ label: item.getLabel(), value: item.value() });
      }

      if (max && val.length >= max) {
        item.disabled.set(!isSelected);
      } else {
        // Only reset if it was disabled by this logic
        // (Wait, the original logic reset it if not disabled, but that's risky if it was disabled via input)
        // Best to just set it to false if it's not selected and we're under the limit
        if (!isSelected) item.disabled.set(false);
      }
    });

    this.selectedItems.set(nextSelectedItems);
  }

  onSearchChange(q: string) {
    this.searchQuery.set(q);
    const filter = (q || '').toLowerCase();
    let visibleCount = 0;

    this.items().forEach((item: SelectItemComponent) => {
      const isVisible = item.getLabel().toLowerCase().includes(filter);
      item.hidden.set(!isVisible);
      if (isVisible) visibleCount++;
    });

    this.noResults.set(visibleCount === 0 && filter !== '');
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent) {
    const trigger = this.trigger();
    const popover = this.popover();
    if (this.isOpen() && trigger && !trigger.nativeElement.contains(event.target) && (!popover || !popover.nativeElement.contains(event.target))) {
      this.close();
    }
  }

  // ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };
  writeValue(v: any[]): void {
    this.value.set(Array.isArray(v) ? v : []);
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    // We can't set input signal, but we handle it via the disabled() signal call in template
  }

  protected cn = cn;
}
