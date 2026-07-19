import {
  Component, Input, forwardRef, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, HostListener
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
  styles: [':host { display: block; }'],
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
    <div class="relative w-full">
      <tolle-input
        [placeholder]="placeholder"
        [disabled]="disabled"
        [ngModel]="displayValue"
        [class]="class"
      >
        <div suffix class="flex items-center gap-1.5">
          <button
            type="button"
            tabindex="-1"
            aria-label="Clear date range"
            *ngIf="(value.start || value.end) && !disabled"
            (click)="clear($event)"
            class="ri-close-line cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          ></button>

          <button
            #trigger
            type="button"
            (click)="togglePopover($event)"
            aria-label="Open calendar"
            aria-haspopup="dialog"
            [attr.aria-expanded]="isOpen"
            class="ri-calendar-line cursor-pointer text-muted-foreground hover:text-primary transition-colors bg-transparent border-0 p-0"
          ></button>
        </div>
      </tolle-input>

      <div
        #popover
        *ngIf="isOpen"
        role="dialog"
        class="fixed z-50"
        style="visibility: hidden;"
      >
        <tolle-range-calendar class="shadow-lg"
          [ngModel]="value"
          (rangeSelect)="onCalendarSelect($event)"
          [disablePastDates]="disablePastDates"
          [numberOfMonths]="numberOfMonths"
        ></tolle-range-calendar>
      </div>
    </div>
  `
})
export class DateRangePickerComponent implements ControlValueAccessor, OnDestroy {
  @Input() disabled = false;
  @Input() placeholder = 'Pick a date range';
  @Input() class = '';
  @Input() disablePastDates = false;
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  /** Consecutive months shown in the popover (e.g. `2` for a two-month picker). @default 1 */
  @Input() numberOfMonths = 1;

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;

  value: DateRange = { start: null, end: null };
  isOpen = false;
  cleanupAutoUpdate?: () => void;

  private _outsideClickHandler = (event: MouseEvent) => {
    if (!this.trigger.nativeElement.contains(event.target) && !this.popover?.nativeElement.contains(event.target)) {
      this.close();
    }
  };

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

  @HostListener('keydown.escape') onEscape() { if (this.isOpen) this.close(); }

  open() {
    this.isOpen = true;
    // Render the popover synchronously so its DOM node + @ViewChild('popover') exist
    // before we position it. Otherwise, with zone eventCoalescing (Angular defers change
    // detection to the next animation frame), updatePosition() can run first, find no
    // popover, and the calendar stays hidden — regardless of where the picker is used.
    this.cdr.detectChanges();
    if (this.trigger?.nativeElement) {
      this.trigger.nativeElement.focus();
    }
    const schedule = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : (fn: FrameRequestCallback) => setTimeout(fn, 0);
    schedule(() => {
      this.updatePosition();
      document.addEventListener('pointerdown', this._outsideClickHandler, true);
    });
  }

  close() {
    this.isOpen = false;
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = undefined;
    }
    document.removeEventListener('pointerdown', this._outsideClickHandler, true);
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    this.value = { start: null, end: null };
    this.onChange(this.value);
    this.cdr.markForCheck();
  }

  // --- Floating UI Positioning with Fixed Strategy ---
  private updatePosition() {
    if (!this.trigger || !this.popover) return;

    this.cleanupAutoUpdate = autoUpdate(
      this.trigger.nativeElement,
      this.popover.nativeElement,
      () => {
        computePosition(this.trigger.nativeElement, this.popover.nativeElement, {
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

  ngOnDestroy() {
    if (this.cleanupAutoUpdate) this.cleanupAutoUpdate();
    document.removeEventListener('pointerdown', this._outsideClickHandler, true);
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
