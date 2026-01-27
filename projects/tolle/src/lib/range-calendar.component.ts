import { Component, input, OnInit, forwardRef, output, signal, computed, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isToday, setMonth, setYear, addYears, subYears,
  isBefore, startOfDay, isWithinInterval
} from 'date-fns';
import { cn } from './utils/cn';
import { DateRange } from './types/date-range';

@Component({
  selector: 'tolle-range-calendar',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeCalendarComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="cn('p-3 border rounded-md bg-background text-popover-foreground shadow-sm inline-block min-w-fit', className())">
    
      <div class="flex items-center justify-between pt-1 pb-4 gap-2">
        <div class="flex items-center gap-1">
          <button type="button" (click)="setView('month')"
            [class]="cn('text-sm font-semibold px-2 py-1 rounded transition-colors', currentView() === 'month' ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground')">
            {{ viewDate() | date: 'MMMM' }}
          </button>
          <button type="button" (click)="setView('year')"
            [class]="cn('text-sm font-semibold px-2 py-1 rounded transition-colors', currentView() === 'year' ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground')">
            {{ viewDate() | date: 'yyyy' }}
          </button>
        </div>
        <div class="flex items-center space-x-1">
          <button type="button" (click)="prev()" [class]="navBtnClass"><i class="ri-arrow-left-s-line text-lg"></i></button>
          <button type="button" (click)="next()" [class]="navBtnClass"><i class="ri-arrow-right-s-line text-lg"></i></button>
        </div>
      </div>
    
      @if (currentView() === 'date') {
        <div class="space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div class="grid grid-cols-7 gap-y-1 w-full">
            @for (day of weekDays; track day) {
              <span class="text-[0.8rem] text-muted-foreground font-normal text-center w-9">
                {{ day }}
              </span>
            }
          </div>
          <div class="grid grid-cols-7 gap-y-1 w-full">
            @for (date of daysInMonth(); track date) {
              <button
                type="button"
                (click)="selectDate(date)"
                [disabled]="isDateDisabled(date)"
                [class]="getDayClass(date)"
                >
                {{ date | date: 'd' }}
              </button>
            }
          </div>
        </div>
      }
    
      @if (currentView() === 'month') {
        <div class="grid grid-cols-3 gap-2 w-64 animate-in fade-in zoom-in-95 duration-200">
          @for (month of months; track month; let i = $index) {
            <button type="button" (click)="selectMonth(i)"
              [class]="cn('text-sm py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors', i === viewDate().getMonth() ? 'bg-primary text-primary-foreground' : '')">
              {{ month }}
            </button>
          }
        </div>
      }
    
      @if (currentView() === 'year') {
        <div class="grid grid-cols-4 gap-2 w-64 animate-in fade-in zoom-in-95 duration-200">
          @for (year of years(); track year) {
            <button type="button" (click)="selectYear(year)"
              [class]="cn('text-sm py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors', year === viewDate().getFullYear() ? 'bg-primary text-primary-foreground' : '')">
              {{ year }}
            </button>
          }
        </div>
      }
    </div>
  `
})
export class RangeCalendarComponent implements OnInit, ControlValueAccessor {
  className = input('', { alias: 'class' });
  disablePastDates = input(false);
  rangeSelect = output<DateRange>();

  currentView = signal<'date' | 'month' | 'year'>('date');
  viewDate = signal(new Date());

  value = signal<DateRange>({ start: null, end: null });

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  daysInMonth = signal<Date[]>([]);
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  years = signal<number[]>([]);

  navBtnClass = cn('h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all');

  private cdr = inject(ChangeDetectorRef);

  onTouched: () => void = () => { };
  onChange: (value: DateRange) => void = () => { };
  protected cn = cn;

  ngOnInit() {
    this.generateDays();
    this.generateYears();
  }

  generateDays() {
    const start = startOfWeek(startOfMonth(this.viewDate()));
    const end = endOfWeek(endOfMonth(this.viewDate()));
    this.daysInMonth.set(eachDayOfInterval({ start, end }));
  }

  generateYears() {
    const currentYear = this.viewDate().getFullYear();
    this.years.set(Array.from({ length: 16 }, (_, i) => currentYear - 6 + i));
  }

  setView(view: 'date' | 'month' | 'year') {
    this.currentView.set(view);
    if (view === 'year') this.generateYears();
  }

  prev() {
    const view = this.currentView();
    if (view === 'date') {
      this.viewDate.update((d: Date) => subMonths(d, 1));
      this.generateDays();
    } else if (view === 'year') {
      this.viewDate.update((d: Date) => subYears(d, 16));
      this.generateYears();
    } else if (view === 'month') {
      this.viewDate.update((d: Date) => subYears(d, 1));
    }
  }

  next() {
    const view = this.currentView();
    if (view === 'date') {
      this.viewDate.update((d: Date) => addMonths(d, 1));
      this.generateDays();
    } else if (view === 'year') {
      this.viewDate.update((d: Date) => addYears(d, 16));
      this.generateYears();
    } else if (view === 'month') {
      this.viewDate.update((d: Date) => addYears(d, 1));
    }
  }

  selectDate(date: Date) {
    if (this.isDateDisabled(date)) return;

    this.value.update((current: DateRange) => {
      const { start, end } = current;
      let next: DateRange;

      if (start && !end) {
        if (isBefore(date, start)) {
          next = { start: date, end: null };
        } else {
          next = { start, end: date };
        }
      } else {
        next = { start: date, end: null };
      }

      return next;
    });

    if (!isSameMonth(date, this.viewDate())) {
      this.viewDate.set(date);
      this.generateDays();
    }

    const val = this.value();
    this.onChange(val);
    this.rangeSelect.emit(val);
    this.onTouched();
  }

  selectMonth(monthIndex: number) {
    this.viewDate.update((d: Date) => setMonth(d, monthIndex));
    this.currentView.set('date');
    this.generateDays();
  }

  selectYear(year: number) {
    this.viewDate.update((d: Date) => setYear(d, year));
    this.currentView.set('date');
    this.generateDays();
  }

  getDayClass(date: Date) {
    const { start, end } = this.value();
    const isOutside = !isSameMonth(date, this.viewDate());
    const isDisabled = this.isDateDisabled(date);

    const isStart = start && isSameDay(date, start);
    const isEnd = end && isSameDay(date, end);
    const isInside = start && end && isWithinInterval(date, { start, end });
    const isTodayDate = isToday(date);

    return cn(
      'h-9 w-9 p-0 font-normal text-sm transition-all flex items-center justify-center relative z-10',
      !isInside && !isStart && !isEnd && !isDisabled && 'hover:bg-accent hover:text-accent-foreground rounded-md',
      (isStart || isEnd) && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
      isInside && !isStart && !isEnd && 'bg-accent text-accent-foreground rounded-none',
      isStart && end && 'rounded-l-md rounded-r-none',
      isEnd && start && 'rounded-r-md rounded-l-none',
      isStart && !end && 'rounded-md',
      !isInside && isTodayDate && !isStart && !isEnd && 'bg-accent/50 text-accent-foreground rounded-md',
      (isOutside || isDisabled) && 'text-muted-foreground opacity-50',
      isDisabled && 'cursor-not-allowed'
    );
  }

  isDateDisabled(date: Date): boolean {
    return this.disablePastDates() ? isBefore(date, startOfDay(new Date())) : false;
  }

  writeValue(val: DateRange | null): void {
    if (val) {
      this.value.set(val);
      if (val.start) this.viewDate.set(val.start);
      this.generateDays();
      this.generateYears();
    } else {
      this.value.set({ start: null, end: null });
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}
