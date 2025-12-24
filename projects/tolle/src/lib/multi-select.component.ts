import { Component, Input, ContentChildren, QueryList, AfterContentInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { SelectItemComponent } from './select-item.component';
import { SelectService } from './select.service';
import { cn } from './utils/cn';
import {BadgeComponent} from '@tolle/ui/badge.component';
import {InputComponent} from '@tolle/ui/input.component';

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
      <button #trigger type="button" (click)="toggle()" [disabled]="disabled"
              [class]="cn('flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all h-auto', class)">
        <div class="flex flex-wrap gap-1 items-center max-w-[95%]">
          <ng-container *ngIf="value?.length; else placeholderTpl">
            <tolle-badge *ngFor="let item of selectedItems" size="xs" variant="secondary" [removable]="true" (onRemove)="removeValue($event, item.value)">
              {{ item.label }}
            </tolle-badge>
          </ng-container>
          <ng-template #placeholderTpl><span class="text-muted-foreground">{{ placeholder }}</span></ng-template>
        </div>
        <i [class]="cn('ri-arrow-down-s-line text-muted-foreground ml-2 transition-transform', isOpen ? 'rotate-180' : '')"></i>
      </button>

      <div #popover *ngIf="isOpen" class="absolute bg-popover z-50 min-w-full rounded-md border border-border shadow-md overflow-hidden" style="visibility: hidden;">

        <div class="p-2 border-b border-border space-y-2 bg-popover">
          <tolle-input *ngIf="searchable" size="xs" placeholder="Search..." [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange($event)">
            <i prefix class="ri-search-line"></i>
          </tolle-input>

          <div class="flex items-center justify-between px-1">
            <button type="button" (click)="selectAll()" class="text-[10px] font-bold uppercase text-primary hover:underline">Select All</button>
            <button type="button" (click)="clearAll()" class="text-[10px] font-bold uppercase text-muted-foreground hover:underline">Clear</button>
          </div>
        </div>

        <div class="p-1 max-h-60 overflow-y-auto">
          <ng-content></ng-content>
          <div *ngIf="noResults" class="py-4 text-center text-xs text-muted-foreground">No results found for "{{searchQuery}}"</div>
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

  ngAfterContentInit() {
    this.syncItems();
    this.items.changes.subscribe(() => this.syncItems());
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
    if (this.cleanup) this.cleanup();
  }

  private updatePosition() {
    this.cleanup = autoUpdate(this.trigger.nativeElement, this.popover.nativeElement, () => {
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
    });
  }

  toggleValue(val: any) {
    const index = this.value.indexOf(val);
    index > -1 ? this.value.splice(index, 1) : this.value.push(val);
    this.syncItems();
    this.onChange([...this.value]); // Return new array reference for Change Detection
  }

  selectAll() {
    this.value = this.items.map(i => i.value);
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
      if (item.selected) this.selectedItems.push({ label: item.getLabel(), value: item.value });
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
  writeValue(v: any[]): void { this.value = Array.isArray(v) ? v : []; this.syncItems(); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  protected cn = cn;
}
