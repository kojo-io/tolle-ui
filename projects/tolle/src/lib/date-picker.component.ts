import {
  Component, Input, forwardRef, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { format, parse, isValid, startOfDay } from 'date-fns';
import { cn } from './utils/cn';
import { MaskedInputComponent } from './masked-input.component';
import { CalendarComponent, CalendarMode } from './calendar.component';

@Component({
  selector: 'tolle-date-picker',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, FormsModule, MaskedInputComponent, CalendarComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative w-full" #triggerContainer>
      <tolle-masked-input
        #maskInput
        [mask]="getMask()"
        [placeholder]="getPlaceholder()"
        [disabled]="disabled"
        [(ngModel)]="inputValue"
        (ngModelChange)="onInputChange($event)"
        [class]="cn(class)">
        <div suffix class="flex items-center gap-1.5">
          <button
            *ngIf="value && !disabled && showClear"
            type="button"
            aria-label="Clear date"
            (click)="clear($event)"
            class="ri-close-line cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            tabindex="-1"
          ></button>

          <button
            type="button"
            #trigger
            aria-label="Open calendar"
            aria-haspopup="dialog"
            [attr.aria-expanded]="isOpen"
            (click)="togglePopover($event)"
            [disabled]="disabled"
            [class]="cn(
              'cursor-pointer text-muted-foreground transition-colors',
              'ri-calendar-line'
            )"
            tabindex="-1"
          ></button>
        </div>
      </tolle-masked-input>

      <div
        #popover
        *ngIf="isOpen"
        role="dialog"
        class="fixed z-[50]"
        style="visibility: hidden; top: 0; left: 0;"
      >
        <tolle-calendar class="shadow-lg"
          [(ngModel)]="value"
          (ngModelChange)="onCalendarChange($event)"
          [mode]="mode"
          [disablePastDates]="disablePastDates"
          [minDate]="minDate"
          [maxDate]="maxDate"
          [showQuickActions]="showQuickActions"
          [formatMonthFn]="formatMonthFn"
          [formatYearFn]="formatYearFn"
        ></tolle-calendar>
      </div>
    </div>
  `
})
export class DatePickerComponent implements ControlValueAccessor, OnDestroy {
  @Input() placeholder = 'MM/DD/YYYY';
  @Input() disabled = false;
  @Input() class = '';
  @Input() disablePastDates = false;
  @Input() showClear = true;
  @Input() showQuickActions = true;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() mode: CalendarMode = 'date';
  @Input() formatMonthFn?: (date: Date) => string;
  @Input() formatYearFn?: (date: Date) => string;

  // Format functions for display
  @Input() displayFormat?: (date: Date, mode: CalendarMode) => string;

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;

  value: Date | null = null;
  inputValue: string = '';
  isOpen = false;
  cleanupAutoUpdate?: () => void;

  private _outsideClickHandler = (event: MouseEvent) => {
    if (!this.trigger.nativeElement.contains(event.target) && !this.popover?.nativeElement.contains(event.target)) {
      this.close();
    }
  };

  constructor(private cdr: ChangeDetectorRef) {}

  getMask(): string {
    switch (this.mode) {
      case 'date': return '00/00/0000';
      case 'month': return '00/0000';
      case 'year': return '0000';
      default: return '00/00/0000';
    }
  }

  getPlaceholder(): string {
    switch (this.mode) {
      case 'date': return 'MM/DD/YYYY';
      case 'month': return 'MM/YYYY';
      case 'year': return 'YYYY';
      default: return 'MM/DD/YYYY';
    }
  }

  getFormatString(): string {
    switch (this.mode) {
      case 'date': return 'MM/dd/yyyy';
      case 'month': return 'MM/yyyy';
      case 'year': return 'yyyy';
      default: return 'MM/dd/yyyy';
    }
  }

  formatDate(date: Date): string {
    if (this.displayFormat) {
      return this.displayFormat(date, this.mode);
    }

    switch (this.mode) {
      case 'date': return format(date, 'MM/dd/yyyy');
      case 'month': return format(date, 'MM/yyyy');
      case 'year': return format(date, 'yyyy');
      default: return format(date, 'MM/dd/yyyy');
    }
  }

  parseDate(str: string): Date | null {
    try {
      const parsed = parse(str, this.getFormatString(), new Date());
      return isValid(parsed) ? startOfDay(parsed) : null;
    } catch {
      return null;
    }
  }

  onInputChange(str: string) {
    const expectedLength = this.getFormatString().replace(/[^0]/g, '').length;

    if (str?.length === expectedLength) {
      const parsed = this.parseDate(str);
      if (parsed) {
        this.value = parsed;
        this.onChange(this.value);
      }
    } else if (!str) {
      this.value = null;
      this.onChange(null);
    }
  }

  onCalendarChange(date: Date | null) {
    this.value = date;
    if (date) {
      this.inputValue = this.formatDate(date);
    } else {
      this.inputValue = '';
    }
    this.onChange(this.value);
    this.close();
  }

  togglePopover(event: MouseEvent) {
    event.stopPropagation();
    if (this.disabled) return;
    this.isOpen ? this.close() : this.open();
  }

  @HostListener('keydown.escape') onEscape() { if (this.isOpen) this.close(); }

  open() {
    if (this.disabled) return;
    this.isOpen = true;
    // Render the popover synchronously so its DOM node + @ViewChild('popover') exist
    // before we position it. Otherwise, with zone eventCoalescing (Angular defers change
    // detection to the next animation frame), updatePosition() can run first, find no
    // popover, and the calendar stays hidden — regardless of where the picker is used.
    this.cdr.detectChanges();
    this.trigger.nativeElement.focus();
    requestAnimationFrame(() => {
      this.updatePosition();
      document.addEventListener('pointerdown', this._outsideClickHandler, true);
    });
  }

  close() {
    this.isOpen = false;
    if (this.cleanupAutoUpdate) this.cleanupAutoUpdate();
    document.removeEventListener('pointerdown', this._outsideClickHandler, true);
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    this.value = null;
    this.inputValue = '';
    this.onChange(null);
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
            shift({ padding: 8 })
          ],
        }).then(({ x, y, strategy }) => {
          Object.assign(this.popover.nativeElement.style, {
            position: strategy,
            left: `${x}px`,
            top: `${y}px`,
            visibility: 'visible',
          });
        });
      }
    );
  }

  ngOnDestroy() {
    if (this.cleanupAutoUpdate) this.cleanupAutoUpdate();
    document.removeEventListener('pointerdown', this._outsideClickHandler, true);
  }

  // CVA Implementation
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: any): void {
    if (val) {
      const date = new Date(val);
      if (isValid(date)) {
        this.value = startOfDay(date);
        this.inputValue = this.formatDate(this.value);
      }
    } else {
      this.value = null;
      this.inputValue = '';
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
  protected cn = cn;
}
