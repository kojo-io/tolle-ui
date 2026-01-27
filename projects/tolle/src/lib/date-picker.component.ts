import {
  Component, input, forwardRef, ElementRef, viewChild, HostListener, ChangeDetectorRef, signal, computed, inject
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { format, parse, isValid, startOfDay } from 'date-fns';
import { cn } from './utils/cn';
import { MaskedInputComponent } from './masked-input.component';
import { CalendarComponent, CalendarMode } from './calendar.component';

@Component({
  selector: 'tolle-date-picker',
  standalone: true,
  imports: [FormsModule, MaskedInputComponent, CalendarComponent],
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
        [disabled]="disabled()"
        [ngModel]="inputValue()"
        (ngModelChange)="onInputChange($event)"
        [class]="cn(className())">
        <div suffix class="flex items-center gap-1.5 cursor-pointer">
          @if (value() && !disabled() && showClear()) {
            <i
              (click)="clear($event)"
              class="ri-close-line cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            ></i>
          }
    
          <i
            (click)="togglePopover($event)"
            [class]="cn(
              'cursor-pointer text-muted-foreground transition-colors',
              'ri-calendar-line'
            )"
          ></i>
        </div>
      </tolle-masked-input>
    
      @if (isOpen()) {
        <div
          #popover
          class="fixed z-[50]"
          style="visibility: hidden; top: 0; left: 0;"
          >
          <tolle-calendar class="shadow-lg"
            [ngModel]="value()"
            (ngModelChange)="onCalendarChange($event)"
            [mode]="mode()"
            [disablePastDates]="disablePastDates()"
            [minDate]="minDate()"
            [maxDate]="maxDate()"
            [showQuickActions]="showQuickActions()"
            [formatMonthFn]="formatMonthFn()"
            [formatYearFn]="formatYearFn()"
          ></tolle-calendar>
        </div>
      }
    </div>
  `
})
export class DatePickerComponent implements ControlValueAccessor {
  placeholder = input('MM/DD/YYYY');
  disabled = input(false);
  className = input('', { alias: 'class' });
  disablePastDates = input(false);
  showClear = input(true);
  showQuickActions = input(true);
  minDate = input<Date | undefined>(undefined);
  maxDate = input<Date | undefined>(undefined);
  mode = input<CalendarMode>('date');
  formatMonthFn = input<(date: Date) => string>();
  formatYearFn = input<(date: Date) => string>();
  displayFormat = input<(date: Date, mode: CalendarMode) => string>();

  triggerContainer = viewChild<ElementRef>('triggerContainer');
  popover = viewChild<ElementRef>('popover');

  value = signal<Date | null>(null);
  inputValue = signal<string>('');
  isOpen = signal(false);
  private cleanupAutoUpdate?: () => void;

  private cdr = inject(ChangeDetectorRef);

  getMask(): string {
    switch (this.mode()) {
      case 'date': return '00/00/0000';
      case 'month': return '00/0000';
      case 'year': return '0000';
      default: return '00/00/0000';
    }
  }

  getPlaceholder(): string {
    switch (this.mode()) {
      case 'date': return 'MM/DD/YYYY';
      case 'month': return 'MM/YYYY';
      case 'year': return 'YYYY';
      default: return 'MM/DD/YYYY';
    }
  }

  getFormatString(): string {
    switch (this.mode()) {
      case 'date': return 'MM/dd/yyyy';
      case 'month': return 'MM/yyyy';
      case 'year': return 'yyyy';
      default: return 'MM/dd/yyyy';
    }
  }

  formatDate(date: Date): string {
    const displayFn = this.displayFormat();
    if (displayFn) {
      return displayFn(date, this.mode());
    }

    switch (this.mode()) {
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
    this.inputValue.set(str);
    const expectedLength = this.getFormatString().replace(/[^0aA]/g, '').length;

    if (str?.length === expectedLength) {
      const parsed = this.parseDate(str);
      if (parsed) {
        this.value.set(parsed);
        this.onChange(parsed);
      }
    } else if (!str) {
      this.value.set(null);
      this.onChange(null);
    }
  }

  onCalendarChange(date: Date | null) {
    this.value.set(date);
    if (date) {
      this.inputValue.set(this.formatDate(date));
    } else {
      this.inputValue.set('');
    }
    this.onChange(date);
    this.close();
  }

  togglePopover(event: MouseEvent) {
    event.stopPropagation();
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    this.isOpen.set(true);
    setTimeout(() => this.updatePosition());
  }

  close() {
    this.isOpen.set(false);
    this.cleanupAutoUpdate?.();
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    this.value.set(null);
    this.inputValue.set('');
    this.onChange(null);
    this.cdr.markForCheck();
  }

  private updatePosition() {
    const trigger = this.triggerContainer()?.nativeElement;
    const popover = this.popover()?.nativeElement;
    if (!trigger || !popover) return;

    this.cleanupAutoUpdate = autoUpdate(
      trigger,
      popover,
      () => {
        computePosition(trigger, popover, {
          strategy: 'fixed',
          placement: 'bottom-start',
          middleware: [
            offset(4),
            flip(),
            shift({ padding: 8 })
          ],
        }).then(({ x, y, strategy }) => {
          Object.assign(popover.style, {
            position: strategy,
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
    const trigger = this.triggerContainer()?.nativeElement;
    const popover = this.popover()?.nativeElement;
    if (this.isOpen() && trigger && popover &&
      !trigger.contains(event.target) &&
      !popover.contains(event.target)) {
      this.close();
    }
  }

  // CVA Implementation
  onChange: (value: Date | null) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(val: any): void {
    if (val) {
      const date = new Date(val);
      if (isValid(date)) {
        const normalized = startOfDay(date);
        this.value.set(normalized);
        this.inputValue.set(this.formatDate(normalized));
      }
    } else {
      this.value.set(null);
      this.inputValue.set('');
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: Date | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    // disabled is an input
  }
  protected cn = cn;
}
