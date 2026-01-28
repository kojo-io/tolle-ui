import {
  Component,
  input,
  forwardRef,
  ElementRef,
  viewChild,
  OnDestroy,
  HostListener,
  contentChildren,
  computed,
  signal,
  effect,
  inject
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate, size } from '@floating-ui/dom';
import { cn } from './utils/cn';
import { SelectItemComponent } from './select-item.component';
import { SelectService } from './select.service';
import { InputComponent } from './input.component';

@Component({
  selector: 'tolle-select',
  standalone: true,
  imports: [FormsModule, InputComponent],
  providers: [
    SelectService,
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true }
  ],
  template: `
    <div [class]="cn('relative w-full', 'size-' + size())" #container>
      <button
        type="button"
        #trigger
        (click)="toggle()"
        [disabled]="disabled()"
        [class]="computedTriggerClass()"
        >
        <span class="truncate" [class.text-muted-foreground]="!selectedLabel()">
          {{ selectedLabel() || placeholder() }}
        </span>
        <i [class]="iconClass()"></i>
      </button>
    
      @if (isOpen()) {
        <div
          #popover
          class="fixed bg-popover z-[999] overflow-auto flex flex-col rounded-md border border-border text-popover-foreground shadow-md"
          style="visibility: hidden; top: 0; left: 0;">
          @if (searchable()) {
            <div class="p-2 border-b border-border bg-popover h-auto">
              <tolle-input
                size="xs"
                placeholder="Search..."
                [ngModel]="searchQuery()"
                (ngModelChange)="onSearchChange($event)"
                class="w-full">
                <i prefix class="ri-search-line"></i>
              </tolle-input>
            </div>
          }
          <div class="p-1 overflow-y-auto scrollbar-hidden grow h-full w-full">
            <ng-content></ng-content>
            @if (noResults()) {
              <div class="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            }
          </div>
        </div>
      }
    </div>
    `
})
export class SelectComponent implements ControlValueAccessor, OnDestroy {
  placeholder = input('Select an option');
  className = input('', { alias: 'class' });
  disabled = input(false);
  searchable = input(false);
  size = input<'xs' | 'sm' | 'default' | 'lg'>('default');
  readonly = input(false);

  trigger = viewChild<ElementRef>('trigger');
  popover = viewChild<ElementRef>('popover');
  container = viewChild<ElementRef>('container');
  items = contentChildren(SelectItemComponent, { descendants: true });

  searchQuery = signal('');
  noResults = signal(false);
  isOpen = signal(false);
  value = signal<any>(null);
  selectedLabel = signal('');
  cleanupAutoUpdate?: () => void;

  onChange: any = () => { };
  onTouched: any = () => { };

  private selectService = inject(SelectService);
  protected cn = cn;

  constructor() {
    // React to service signal changes
    effect(() => {
      const val = this.selectService.selectedValue();
      this.value.set(val);
      this.onChange(val);
    });

    effect(() => {
      const label = this.selectService.selectedLabel();
      this.selectedLabel.set(label);
      if (label) {
        this.close();
      }
    });

    // Sync item selection state whenever value or items change
    effect(() => {
      const val = this.value();
      const items = this.items();
      items.forEach((item: SelectItemComponent) => {
        item.selected.set(item.value() === val);
      });
    });
  }

  computedTriggerClass = computed(() => {
    return cn(
      'flex w-full items-center justify-between rounded-md border transition-all duration-200',
      'bg-background text-foreground',
      'border-input shadow-sm',
      this.size() === 'xs' && 'h-8 px-2 text-xs',
      this.size() === 'sm' && 'h-9 px-3 text-sm',
      this.size() === 'default' && 'h-10 px-3 text-sm',
      this.size() === 'lg' && 'h-11 px-4 text-base',
      !(this.readonly() || this.disabled()) && [
        'focus:outline-none',
        'focus:ring-4',
        'focus:ring-ring/30',
        'focus:ring-offset-0',
        'focus:shadow-none',
        'focus:border-primary/80'
      ],
      !(this.readonly() || this.disabled()) && 'hover:border-accent',
      this.disabled() && [
        'cursor-not-allowed opacity-50',
        'border-opacity-50'
      ],
      this.readonly() && [
        'cursor-default',
        'border-dashed',
        !this.disabled() && 'focus:ring-0 focus:border-opacity-100'
      ],
      this.className()
    );
  });

  iconClass = computed(() => {
    return cn(
      'ri-arrow-down-s-line text-muted-foreground ml-2 transition-transform duration-200',
      this.isOpen() ? 'rotate-180' : '',
      (this.size() === 'xs' || this.size() === 'sm') ? 'text-[14px]' : 'text-[18px]',
      (this.disabled() || this.readonly()) && 'opacity-30'
    );
  });

  toggle() {
    if (this.disabled() || this.readonly()) return;
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    this.isOpen.set(true);
    const trigger = this.trigger();
    if (trigger) trigger.nativeElement.focus();
    setTimeout(() => this.updatePosition());
  }

  close() {
    this.isOpen.set(false);
    this.searchQuery.set('');
    this.onSearchChange('');
    if (this.cleanupAutoUpdate) this.cleanupAutoUpdate();
  }

  private updatePosition() {
    const trigger = this.trigger();
    const popover = this.popover();
    if (!trigger || !popover) return;

    this.cleanupAutoUpdate = autoUpdate(
      trigger.nativeElement,
      popover.nativeElement,
      () => {
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
            padding: '4px'
          });
        });
      }
    );
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    const filter = (query || '').toLowerCase().trim();
    let visibleCount = 0;

    this.items().forEach((item: SelectItemComponent) => {
      const text = item.getLabel().toLowerCase();
      const isVisible = text.includes(filter);
      item.hidden.set(!isVisible);
      if (isVisible) visibleCount++;
    });

    this.noResults.set(visibleCount === 0 && filter !== '');
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const trigger = this.trigger();
    const popover = this.popover();
    if (this.isOpen() && trigger && !trigger.nativeElement.contains(event.target) && (!popover || !popover.nativeElement.contains(event.target))) {
      this.close();
    }
  }

  writeValue(value: any): void {
    this.value.set(value);
    const found = this.items().find((i: SelectItemComponent) => i.value() === value);
    if (found) this.selectedLabel.set(found.getLabel());
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    // input() is read-only
  }

  ngOnDestroy() {
    if (this.cleanupAutoUpdate) this.cleanupAutoUpdate();
  }
}
