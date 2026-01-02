import {
  Component, Input, forwardRef, ElementRef, ViewChild, HostListener, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate, size } from '@floating-ui/dom';
import { cn } from './utils/cn';
import { RangeCalendarComponent } from './range-calendar.component';
import { format } from 'date-fns';
import { InputComponent } from './input.component';
import { DateRange } from './types/date-range';

@Component({
  selector: 'tolle-date-range-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, RangeCalendarComponent, InputComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative w-full" #triggerContainer>
      <tolle-input
        [placeholder]="placeholder"
        [disabled]="disabled"
        [ngModel]="displayValue"
        [class]="class"
      >
        <div suffix class="flex items-center gap-1.5 cursor-pointer">
          <i
            *ngIf="(value.start || value.end) && !disabled"
            (click)="clear($event)"
            class="ri-close-line cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          ></i>

          <i
            (click)="togglePopover($event)"
            class="ri-calendar-line cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          ></i>
        </div>
      </tolle-input>

      <div
        #popover
        *ngIf="isOpen"
        class="fixed z-50"
        style="visibility: hidden;"
      >
        <tolle-range-calendar class="shadow-lg"
          [ngModel]="value"
          (rangeSelect)="onCalendarSelect($event)"
          [disablePastDates]="disablePastDates"
        ></tolle-range-calendar>
      </div>
    </div>
  `
})
export class DateRangePickerComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() placeholder = 'Pick a date range';
  @Input() class = '';
  @Input() disablePastDates = false;
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';

  @ViewChild('triggerContainer') triggerContainer!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;

  value: DateRange = { start: null, end: null };
  isOpen = false;
  cleanupAutoUpdate?: () => void;

  constructor(private cdr: ChangeDetectorRef) {}

  get displayValue(): string {
    if (!this.value.start) return '';

    const startStr = format(this.value.start, 'MMM dd, yyyy');
    if (!this.value.end) return startStr;

    const endStr = format(this.value.end, 'MMM dd, yyyy');
    return `${startStr} - ${endStr}`;
  }

  onCalendarSelect(range: DateRange) {
    this.value = range;
    this.onChange(this.value);

    // Close only if range is complete
    if (range.start && range.end) {
      setTimeout(() => this.close(), 150);
    }
  }

  togglePopover(event: MouseEvent) {
    event.stopPropagation();
    if (this.disabled) return;
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    setTimeout(() => this.updatePosition());
  }

  close() {
    this.isOpen = false;
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = undefined;
    }
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    this.value = { start: null, end: null };
    this.onChange(this.value);
    this.cdr.markForCheck();
  }

  // --- Floating UI Positioning with Fixed Strategy ---
  private updatePosition() {
    if (!this.triggerContainer || !this.popover) return;

    this.cleanupAutoUpdate = autoUpdate(
      this.triggerContainer.nativeElement,
      this.popover.nativeElement,
      () => {
        computePosition(this.triggerContainer.nativeElement, this.popover.nativeElement, {
          placement: 'bottom-end',
          strategy: 'fixed', // Use fixed to escape column layout
          middleware: [
            offset(4),
            flip({
              fallbackAxisSideDirection: 'start',
              padding: 8
            }),
            shift({ padding: 8 }),
            size({
              apply({ rects, elements, availableHeight }) {
                // Constrain popover to available space
                Object.assign(elements.floating.style, {
                  maxHeight: `${Math.min(400, availableHeight)}px`,
                  minWidth: `${Math.max(rects.reference.width, 320)}px`, // Calendar minimum width
                });
              }
            })
          ],
        }).then(({ x, y, placement }) => {
          Object.assign(this.popover.nativeElement.style, {
            left: `${x}px`,
            top: `${y}px`,
            visibility: 'visible',
          });

          // Optional: Add placement class for styling
          this.popover.nativeElement.classList.remove('calendar-top', 'calendar-bottom');
          if (placement.includes('top')) {
            this.popover.nativeElement.classList.add('calendar-top');
          } else {
            this.popover.nativeElement.classList.add('calendar-bottom');
          }
        });
      }
    );
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.isOpen &&
      !this.triggerContainer.nativeElement.contains(event.target) &&
      !this.popover?.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.isOpen) {
      this.close(); // Close on resize for simplicity
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    // Floating-UI's autoUpdate handles scroll repositioning
  }

  // --- Control Value Accessor ---
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: DateRange | null): void {
    if (val) {
      this.value = { ...val };
    } else {
      this.value = { start: null, end: null };
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  protected cn = cn;
}
