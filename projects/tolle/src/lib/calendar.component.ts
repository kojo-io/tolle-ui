import {
  Component,
  Input,
  OnInit,
  forwardRef,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import {
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  setMonth,
  setYear,
  addYears,
  subYears,
  isBefore,
  startOfDay,
  format,
} from 'date-fns';
import { cn } from './utils/cn';

export type CalendarMode = 'date' | 'month' | 'year';

@Component({
  selector: 'tolle-calendar',
  styles: [':host { display: block; }'],
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true,
    },
  ],
  template: `
    <div
      [class]="
        cn(
          'inline-block min-w-fit text-popover-foreground',
          bordered ? 'rounded-md border bg-background p-3 shadow-sm' : '',
          class
        )
      ">
      <!-- Header with Navigation -->
      <div class="flex items-center justify-between gap-2 pb-4 pt-1">
        <!-- View Selector -->
        <div class="flex items-center gap-1">
          @if (mode !== 'year') {
            <button
              type="button"
              (click)="setView('month')"
              [class]="
                cn(
                  'rounded px-2 py-1 text-sm font-semibold transition-colors',
                  currentView === 'month'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )
              ">
              {{ formatMonthYear(viewDate, 'month') }}
            </button>
          }

          <button
            type="button"
            (click)="setView('year')"
            [class]="
              cn(
                'rounded px-2 py-1 text-sm font-semibold transition-colors',
                currentView === 'year'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )
            ">
            {{ formatMonthYear(viewDate, 'year') }}
          </button>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center space-x-1">
          <button type="button" (click)="prev()" [class]="navBtnClass" aria-label="Previous month">
            <i class="ri-arrow-left-s-line text-lg"></i>
          </button>
          <button type="button" (click)="next()" [class]="navBtnClass" aria-label="Next month">
            <i class="ri-arrow-right-s-line text-lg"></i>
          </button>
        </div>
      </div>

      <!-- DATE MODE -->
      @if (currentView === 'date' && mode === 'date') {
        <div class="space-y-2 duration-200 animate-in fade-in zoom-in-95">
          <div class="grid w-full grid-cols-7 gap-1">
            @for (day of weekDays; track day) {
              <span class="w-9 text-center text-[0.8rem] font-normal text-muted-foreground">
                {{ day }}
              </span>
            }
          </div>
          <div role="grid" class="grid w-full grid-cols-7 gap-1" (keydown)="onGridKeydown($event)">
            @for (date of daysInMonth; track date) {
              <button
                type="button"
                role="gridcell"
                [attr.aria-selected]="isSelected(date)"
                [attr.aria-label]="date | date: 'fullDate'"
                (click)="selectDate(date)"
                [disabled]="isDateDisabled(date)"
                [class]="getDayClass(date)">
                {{ formatDate(date, 'day') }}
              </button>
            }
          </div>
        </div>
      }

      <!-- MONTH SELECTOR (for date mode and month mode) -->
      @if (currentView === 'month') {
        <div class="grid w-64 grid-cols-3 gap-2 duration-200 animate-in fade-in zoom-in-95">
          @for (month of months; track month; let i = $index) {
            <button type="button" (click)="selectMonth(i)" [class]="getMonthClass(i)">
              {{ month }}
            </button>
          }
        </div>
      }

      <!-- YEAR SELECTOR (for date mode and year mode) -->
      @if (currentView === 'year') {
        <div class="grid w-64 grid-cols-4 gap-2 duration-200 animate-in fade-in zoom-in-95">
          @for (year of years; track year) {
            <button type="button" (click)="selectYear(year)" [class]="getYearClass(year)">
              {{ year }}
            </button>
          }
        </div>
      }

      <!-- Quick Actions -->
      @if (showQuickActions) {
        <div class="mt-3 border-t pt-3">
          <div class="flex items-center justify-between gap-2">
            <button
              type="button"
              (click)="selectToday()"
              [class]="quickActionBtnClass"
              [disabled]="isTodayDisabled()">
              Today
            </button>
            <button type="button" (click)="clear()" [class]="quickActionBtnClass">Clear</button>
          </div>
        </div>
      }
    </div>
  `,
})
export class CalendarComponent implements OnInit, ControlValueAccessor {
  @Input() class = '';
  /** Renders the calendar's own border, background and shadow. Set `false` when
   * nesting inside a card/popover that already provides the chrome. @default true */
  @Input() bordered = true;
  @Input() mode: CalendarMode = 'date';
  @Input() disablePastDates = false;
  @Input() showQuickActions = true;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() formatMonthFn?: (date: Date) => string;
  @Input() formatYearFn?: (date: Date) => string;
  @Input() formatDateFn?: (date: Date) => string;

  @Output() dateSelect = new EventEmitter<Date | null>();

  currentView: 'date' | 'month' | 'year' = 'date';
  viewDate: Date = new Date();
  selectedDate: Date | null = null;

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  daysInMonth: Date[] = [];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  years: number[] = [];
  yearRangeStart: number;

  navBtnClass = cn(
    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  );
  quickActionBtnClass = cn(
    'px-3 py-1.5 text-sm rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors'
  );

  onTouched: () => void = () => {};
  onChange: (value: any) => void = () => {};

  protected cn = cn;

  constructor(private cdr: ChangeDetectorRef) {
    this.yearRangeStart = new Date().getFullYear() - 6;
  }

  ngOnInit() {
    // Initialize based on mode
    if (this.mode === 'month') {
      this.currentView = 'month';
    } else if (this.mode === 'year') {
      this.currentView = 'year';
    }

    this.generateDays();
    this.generateYears();
  }

  // Format helpers
  formatMonthYear(date: Date, type: 'month' | 'year'): string {
    if (type === 'month' && this.formatMonthFn) {
      return this.formatMonthFn(date);
    }
    if (type === 'year' && this.formatYearFn) {
      return this.formatYearFn(date);
    }
    return type === 'month' ? format(date, 'MMMM') : format(date, 'yyyy');
  }

  formatDate(date: Date, type: 'day' | 'month' | 'year'): string {
    if (type === 'day' && this.formatDateFn) {
      return this.formatDateFn(date);
    }
    return format(date, type === 'day' ? 'd' : type === 'month' ? 'MMM' : 'yyyy');
  }

  generateDays() {
    if (this.mode !== 'date') return;

    const start = startOfWeek(startOfMonth(this.viewDate));
    const end = endOfWeek(endOfMonth(this.viewDate));
    this.daysInMonth = eachDayOfInterval({ start, end });
  }

  generateYears() {
    const currentYear = this.viewDate.getFullYear();

    if (this.mode === 'year') {
      // For year picker, show a 12-year grid
      this.years = Array.from({ length: 12 }, (_, i) => this.yearRangeStart + i);
    } else {
      // For date mode year selector, show 16 years centered on current
      this.years = Array.from({ length: 16 }, (_, i) => currentYear - 6 + i);
    }
  }

  setView(view: 'date' | 'month' | 'year') {
    this.currentView = view;
    if (view === 'year') {
      this.generateYears();
    }
  }

  prev() {
    if (this.mode === 'date') {
      if (this.currentView === 'date') {
        this.viewDate = subMonths(this.viewDate, 1);
        this.generateDays();
      } else if (this.currentView === 'year') {
        this.viewDate = subYears(this.viewDate, 16);
        this.generateYears();
      } else if (this.currentView === 'month') {
        this.viewDate = subYears(this.viewDate, 1);
      }
    } else if (this.mode === 'month') {
      this.viewDate = subYears(this.viewDate, 1);
    } else if (this.mode === 'year') {
      this.yearRangeStart -= 12;
      this.generateYears();
    } else if (this.mode === 'month-year') {
      if (this.currentView === 'month') {
        this.viewDate = subYears(this.viewDate, 1);
      } else {
        this.yearRangeStart -= 12;
        this.generateYears();
      }
    }
  }

  next() {
    if (this.mode === 'date') {
      if (this.currentView === 'date') {
        this.viewDate = addMonths(this.viewDate, 1);
        this.generateDays();
      } else if (this.currentView === 'year') {
        this.viewDate = addYears(this.viewDate, 16);
        this.generateYears();
      } else if (this.currentView === 'month') {
        this.viewDate = addYears(this.viewDate, 1);
      }
    } else if (this.mode === 'month') {
      this.viewDate = addYears(this.viewDate, 1);
    } else if (this.mode === 'year') {
      this.yearRangeStart += 12;
      this.generateYears();
    } else if (this.mode === 'month-year') {
      if (this.currentView === 'month') {
        this.viewDate = addYears(this.viewDate, 1);
      } else {
        this.yearRangeStart += 12;
        this.generateYears();
      }
    }
  }

  prevYears() {
    this.yearRangeStart -= 12;
    this.generateYears();
  }

  nextYears() {
    this.yearRangeStart += 12;
    this.generateYears();
  }

  selectDate(date: Date) {
    if (this.isDateDisabled(date)) return;

    this.selectedDate = date;
    this.onChange(date);
    this.onTouched();
    this.dateSelect.emit(date);
  }

  /**
   * Grid keyboard navigation for the day view (react-day-picker semantics).
   * Arrows move by day/week, Home/End to week edges, PageUp/PageDown by month.
   * Enter/Space are left to the native day <button> (which selects on click and
   * does not scroll the page).
   */
  onGridKeydown(event: KeyboardEvent) {
    if (this.currentView !== 'date' || this.mode !== 'date') return;

    const gridEl = event.currentTarget as HTMLElement;
    const buttons = Array.from(gridEl.querySelectorAll('button')) as HTMLElement[];
    const idx = buttons.indexOf(event.target as HTMLElement);
    if (idx < 0) return;

    const current = this.daysInMonth[idx];
    if (!current) return;

    let next: Date | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(current, -1);
        break;
      case 'ArrowRight':
        next = addDays(current, 1);
        break;
      case 'ArrowUp':
        next = addDays(current, -7);
        break;
      case 'ArrowDown':
        next = addDays(current, 7);
        break;
      case 'Home':
        next = startOfWeek(current);
        break;
      case 'End':
        next = endOfWeek(current);
        break;
      case 'PageUp':
        next = subMonths(current, 1);
        break;
      case 'PageDown':
        next = addMonths(current, 1);
        break;
      default:
        return;
    }

    event.preventDefault();
    this.focusDay(next, gridEl);
  }

  /**
   * Moves focus to the day button matching `date`. If the day is not present in
   * the current grid, the view advances/retreats to its month, regenerates and
   * then focuses it.
   */
  private focusDay(date: Date, gridEl: HTMLElement) {
    let idx = this.daysInMonth.findIndex(d => isSameDay(d, date));
    if (idx < 0) {
      this.viewDate = startOfMonth(date);
      this.generateDays();
      this.cdr.detectChanges(); // re-render the grid synchronously
      idx = this.daysInMonth.findIndex(d => isSameDay(d, date));
    }
    if (idx < 0) return;

    const buttons = Array.from(gridEl.querySelectorAll('button')) as HTMLElement[];
    buttons[idx]?.focus();
  }

  selectMonth(monthIndex: number) {
    if (this.mode === 'date') {
      this.viewDate = setMonth(this.viewDate, monthIndex);
      this.currentView = 'date';
      this.generateDays();
    } else if (this.mode === 'month') {
      this.viewDate = setMonth(this.viewDate, monthIndex);
      this.selectedDate = this.viewDate;
      this.onChange(this.viewDate);
      this.onTouched();
      this.dateSelect.emit(this.viewDate);
    }
  }

  selectYear(year: number) {
    if (this.mode === 'date') {
      this.viewDate = setYear(this.viewDate, year);
      this.currentView = 'date';
      this.generateDays();
    } else if (this.mode === 'year' || this.mode === 'month') {
      this.viewDate = setYear(this.viewDate, year);
      this.selectedDate = this.viewDate;
      this.onChange(this.viewDate);
      this.onTouched();
      this.dateSelect.emit(this.viewDate);
    }
  }

  isSelected(date: Date): boolean {
    return !!(this.selectedDate && isSameDay(date, this.selectedDate));
  }

  getDayClass(date: Date) {
    const isSelected = this.selectedDate && isSameDay(date, this.selectedDate);
    const isTodayDate = isToday(date);
    const isOutside = !isSameMonth(date, this.viewDate);
    const isDisabled = this.isDateDisabled(date);

    return cn(
      'h-9 w-9 p-0 font-normal text-sm rounded-md transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      !isSelected && !isDisabled && 'hover:bg-accent hover:text-accent-foreground',
      isSelected &&
        'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
      !isSelected && isTodayDate && 'bg-accent text-accent-foreground',
      (isOutside || isDisabled) && 'text-muted-foreground opacity-50',
      isDisabled && 'cursor-not-allowed'
    );
  }

  getMonthClass(monthIndex: number) {
    const isSelected =
      this.selectedDate &&
      this.selectedDate.getMonth() === monthIndex &&
      this.selectedDate.getFullYear() === this.viewDate.getFullYear();
    const isCurrent =
      new Date().getMonth() === monthIndex &&
      new Date().getFullYear() === this.viewDate.getFullYear();

    return cn(
      'text-sm py-2.5 rounded-md transition-colors',
      isSelected
        ? 'bg-primary text-primary-foreground hover:bg-primary'
        : isCurrent
          ? 'border border-primary/30 text-primary'
          : 'hover:bg-accent hover:text-accent-foreground'
    );
  }

  getYearClass(year: number) {
    const isSelected = this.selectedDate && this.selectedDate.getFullYear() === year;
    const isCurrent = new Date().getFullYear() === year;

    return cn(
      'text-sm py-2 rounded-md transition-colors',
      isSelected
        ? 'bg-primary text-primary-foreground hover:bg-primary'
        : isCurrent
          ? 'border border-primary/30 text-primary'
          : 'hover:bg-accent hover:text-accent-foreground'
    );
  }

  isDateDisabled(date: Date): boolean {
    if (this.disablePastDates && isBefore(date, startOfDay(new Date()))) {
      return true;
    }
    if (this.minDate && isBefore(date, this.minDate)) {
      return true;
    }
    return !!(this.maxDate && isBefore(this.maxDate, date));
  }

  isTodayDisabled(): boolean {
    return this.isDateDisabled(new Date());
  }

  selectToday() {
    if (!this.isTodayDisabled()) {
      this.selectDate(new Date());
    }
  }

  clear() {
    this.selectedDate = null;
    this.onChange(null);
    this.onTouched();
    this.dateSelect.emit(null);
  }

  // CVA Implementation
  writeValue(obj: any): void {
    if (obj) {
      const date = new Date(obj);
      if (!isNaN(date.getTime())) {
        this.selectedDate = date;
        this.viewDate = date;
        this.generateDays();
        this.generateYears();
      }
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
