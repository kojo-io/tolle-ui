import {
  Component,
  Input,
  forwardRef,
  ElementRef,
  ViewChild,
  OnDestroy,
  HostListener,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { cn } from './utils/cn';
import { SelectItemComponent } from './select-item.component';
import { Subscription } from 'rxjs';
import { SelectService } from './select.service';
import { InputComponent } from './input.component';

@Component({
  selector: 'tolle-select',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  providers: [
    SelectService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="cn('relative w-full', 'size-' + size)" #container>
      <button
        type="button"
        #trigger
        (click)="toggle()"
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
        *ngIf="isOpen"
        class="absolute bg-popover z-50 min-w-full overflow-hidden rounded-md border border-border text-popover-foreground bg-background shadow-md"
        style="visibility: hidden; top: 0; left: 0;"
      >
        <div *ngIf="searchable" class="p-2 border-b border-border bg-popover">
          <tolle-input
            size="xs"
            placeholder="Search..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            class="w-full">
            <i prefix class="ri-search-line"></i>
          </tolle-input>
        </div>

        <div class="p-1 max-h-60 overflow-y-auto">
          <ng-content></ng-content>
          <div *ngIf="noResults" class="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SelectComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {
  @Input() placeholder = 'Select an option';
  @Input() class = '';
  @Input() disabled = false;
  @Input() searchable = false;
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;
  @ContentChildren(SelectItemComponent, { descendants: true }) items!: QueryList<SelectItemComponent>;

  private sub = new Subscription();
  searchQuery = '';
  noResults = false;
  isOpen = false;
  value: any = null;
  selectedLabel = '';
  cleanupAutoUpdate?: () => void;

  onChange: any = () => {};
  onTouched: any = () => {};

  protected cn = cn;

  constructor(private selectService: SelectService) {
    this.sub.add(
      this.selectService.selectedValue$.subscribe(val => {
        this.value = val;
        this.onChange(val);
        this.updateItemSelection();
      })
    );

    this.sub.add(
      this.selectService.selectedLabel$.subscribe(label => {
        this.selectedLabel = label;
        this.close();
      })
    );
  }

  // UPDATED: Centralized sizing logic for the trigger
  get computedTriggerClass() {
    return cn(
      'flex w-full items-center justify-between rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
      'disabled:opacity-50 shadow-sm transition-shadow',
      this.size === 'xs' && 'h-8 px-2 text-xs',
      this.size === 'sm' && 'h-9 px-3 text-sm',
      this.size === 'default' && 'h-10 px-3 text-sm',
      this.size === 'lg' && 'h-11 px-4 text-base',
      this.class
    );
  }

  // UPDATED: Dynamic icon sizing relative to the trigger size
  get iconClass() {
    return cn(
      'ri-arrow-down-s-line text-muted-foreground ml-2 transition-transform duration-200',
      this.isOpen ? 'rotate-180' : '',
      (this.size === 'xs' || this.size === 'sm') ? 'text-[14px]' : 'text-[18px]'
    );
  }

  ngAfterContentInit() {
    this.updateItemSelection();
    this.items.changes.subscribe(() => this.updateItemSelection());
  }

  private updateItemSelection() {
    if (this.items) {
      this.items.forEach(item => {
        item.selected = item.value === this.value;
      });
    }
  }

  toggle() {
    if (this.disabled) return;
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    // Tick to ensure DOM is rendered before positioning
    setTimeout(() => this.updatePosition());
  }

  close() {
    this.isOpen = false;
    this.searchQuery = '';
    this.onSearchChange('');
    if (this.cleanupAutoUpdate) this.cleanupAutoUpdate();
  }

  private updatePosition() {
    if (!this.trigger || !this.popover) return;

    this.cleanupAutoUpdate = autoUpdate(
      this.trigger.nativeElement,
      this.popover.nativeElement,
      () => {
        computePosition(this.trigger.nativeElement, this.popover.nativeElement, {
          placement: 'bottom-start',
          middleware: [offset(4), flip(), shift({ padding: 8 })],
        }).then(({ x, y }) => {
          Object.assign(this.popover.nativeElement.style, {
            left: `${x}px`,
            top: `${y}px`,
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
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isOpen && !this.trigger.nativeElement.contains(event.target) && !this.popover.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.updateItemSelection();
    if (this.items) {
      const found = this.items.find(i => i.value === value);
      if (found) this.selectedLabel = found.getLabel();
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if (this.cleanupAutoUpdate) this.cleanupAutoUpdate();
  }
}
