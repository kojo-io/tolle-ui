import {
  Component, Input, forwardRef, ElementRef, ViewChild, HostListener, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { cn } from './utils/cn';
import { RangeCalendarComponent } from './range-calendar.component';
import {DateRange} from '@tolle/ui/types/date-range';
import {InputComponent} from '@tolle/ui/input.component';
import {format} from 'date-fns';

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
      <tolle-input [placeholder]="placeholder" [disabled]="disabled" [ngModel]="displayValue">
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
        class="absolute z-50 min-w-72"
        style="visibility: hidden; top: 0; left: 0;"
      >
        <tolle-range-calendar
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

  // Standardized Sizes
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';

  @ViewChild('triggerContainer') triggerContainer!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;

  value: DateRange = { start: null, end: null };
  isOpen = false;
  cleanupAutoUpdate?: () => void;

  constructor(private cdr: ChangeDetectorRef) {}

  get displayValue(): string {
    if (!this.value.start) return '';

    const startStr = format(this.value.start, 'MMM dd, yyyy'); // Using date-fns format
    if (!this.value.end) return startStr;

    const endStr = format(this.value.end, 'MMM dd, yyyy');
    return `${startStr} - ${endStr}`;
  }

  onCalendarSelect(range: DateRange) {
    this.value = range;
    this.onChange(this.value);

    // Close only if range is complete
    if (range.start && range.end) {
      this.onChange(this.value);
      // Small delay for UX
      setTimeout(() => this.close(), 150);
    }
  }

  togglePopover(event: MouseEvent) {
    if (this.disabled) return;
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    setTimeout(() => this.updatePosition());
  }

  close() {
    this.isOpen = false;
    if (this.cleanupAutoUpdate) this.cleanupAutoUpdate();
  }

  clear(event: MouseEvent) {
    event.stopPropagation(); // Stop button click
    this.value = { start: null, end: null };
    this.onChange(this.value);
  }

  // --- Floating UI Positioning ---
  private updatePosition() {
    if (!this.triggerContainer || !this.popover) return;

    this.cleanupAutoUpdate = autoUpdate(
      this.triggerContainer.nativeElement,
      this.popover.nativeElement,
      () => {
        computePosition(this.triggerContainer.nativeElement, this.popover.nativeElement, {
          placement: 'bottom-start', // Aligned to the right where the icon is
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

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.isOpen &&
      !this.triggerContainer.nativeElement.contains(event.target) &&
      !this.popover.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  // CVA
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
