import {
  Component, Input, OnInit, forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isToday, setMonth, setYear, addYears, subYears, isBefore, startOfDay
} from 'date-fns';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-calendar',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="cn('p-3 border rounded-md bg-background text-popover-foreground shadow-sm inline-block w-fit', class)">

      <div class="flex items-center justify-between pt-1 pb-4 gap-2">

        <div class="flex items-center gap-1">
          <button
            type="button"
            (click)="setView('month')"
            [class]="cn(
              'text-sm font-semibold px-2 py-1 rounded transition-colors',
              currentView === 'month' ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
            )"
          >
            {{ viewDate | date: 'MMMM' }}
          </button>

          <button
            type="button"
            (click)="setView('year')"
            [class]="cn(
              'text-sm font-semibold px-2 py-1 rounded transition-colors',
              currentView === 'year' ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
            )"
          >
            {{ viewDate | date: 'yyyy' }}
          </button>
        </div>

        <div class="flex items-center space-x-1">
          <button type="button" (click)="prev()" [class]="navBtnClass">
            <i class="ri-arrow-left-s-line text-lg"></i>
          </button>
          <button type="button" (click)="next()" [class]="navBtnClass">
            <i class="ri-arrow-right-s-line text-lg"></i>
          </button>
        </div>
      </div>

      <div *ngIf="currentView === 'date'" class="space-y-2 animate-in fade-in zoom-in-95 duration-200">
        <div class="grid grid-cols-7 gap-1 w-full">
          <span *ngFor="let day of weekDays" class="text-[0.8rem] text-muted-foreground font-normal text-center w-9">
            {{ day }}
          </span>
        </div>
        <div class="grid grid-cols-7 gap-1 w-full">
          <button
            *ngFor="let date of daysInMonth"
            type="button"
            (click)="selectDate(date)"
            [disabled]="isDateDisabled(date)"
            [class]="getDayClass(date)"
          >
            {{ date | date: 'd' }}
          </button>
        </div>
      </div>

      <div *ngIf="currentView === 'month'" class="grid grid-cols-3 gap-2 w-64 animate-in fade-in zoom-in-95 duration-200">
        <button
          *ngFor="let month of months; let i = index"
          type="button"
          (click)="selectMonth(i)"
          [class]="cn(
            'text-sm py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
            i === viewDate.getMonth() ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' : ''
          )"
        >
          {{ month }}
        </button>
      </div>

      <div *ngIf="currentView === 'year'" class="grid grid-cols-4 gap-2 w-64 animate-in fade-in zoom-in-95 duration-200">
        <button
          *ngFor="let year of years"
          type="button"
          (click)="selectYear(year)"
          [class]="cn(
            'text-sm py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
            year === viewDate.getFullYear() ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' : ''
          )"
        >
          {{ year }}
        </button>
      </div>
    </div>
  `
})
export class CalendarComponent implements OnInit, ControlValueAccessor {
  @Input() class = '';
  @Input() disablePastDates = false;

  currentView: 'date' | 'month' | 'year' = 'date';
  viewDate: Date = new Date();
  selectedDate: Date | null = null;

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  daysInMonth: Date[] = [];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  years: number[] = [];

  navBtnClass = cn('h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all');

  onTouched: () => void = () => {};
  onChange: (value: any) => void = () => {};

  protected cn = cn;

  ngOnInit() {
    this.generateDays();
    this.generateYears();
  }

  generateDays() {
    const start = startOfWeek(startOfMonth(this.viewDate));
    const end = endOfWeek(endOfMonth(this.viewDate));
    this.daysInMonth = eachDayOfInterval({ start, end });
  }

  generateYears() {
    const currentYear = this.viewDate.getFullYear();
    // Generates a 16-year window centered roughly on current view
    this.years = Array.from({ length: 16 }, (_, i) => currentYear - 6 + i);
  }

  setView(view: 'date' | 'month' | 'year') {
    this.currentView = view;
    // If switching to year view, ensure the year grid is centered on current view year
    if (view === 'year') {
      this.generateYears();
    }
  }

  prev() {
    if (this.currentView === 'date') {
      this.viewDate = subMonths(this.viewDate, 1);
      this.generateDays();
    } else if (this.currentView === 'year') {
      this.viewDate = subYears(this.viewDate, 16);
      this.generateYears();
    } else if (this.currentView === 'month') {
      this.viewDate = subYears(this.viewDate, 1);
    }
  }

  next() {
    if (this.currentView === 'date') {
      this.viewDate = addMonths(this.viewDate, 1);
      this.generateDays();
    } else if (this.currentView === 'year') {
      this.viewDate = addYears(this.viewDate, 16);
      this.generateYears();
    } else if (this.currentView === 'month') {
      this.viewDate = addYears(this.viewDate, 1);
    }
  }

  selectDate(date: Date) {
    if (this.isDateDisabled(date)) return;

    this.selectedDate = date;
    if (!isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      this.generateDays();
    }

    this.onChange(date);
    this.onTouched();
  }

  selectMonth(monthIndex: number) {
    this.viewDate = setMonth(this.viewDate, monthIndex);
    this.currentView = 'date';
    this.generateDays();
  }

  selectYear(year: number) {
    this.viewDate = setYear(this.viewDate, year);
    this.currentView = 'date'; // Jump straight back to date view for efficiency
    this.generateDays();
  }

  getDayClass(date: Date) {
    const isSelected = this.selectedDate && isSameDay(date, this.selectedDate);
    const isTodayDate = isToday(date);
    const isOutside = !isSameMonth(date, this.viewDate);
    const isDisabled = this.isDateDisabled(date);

    return cn(
      'h-9 w-9 p-0 font-normal text-sm rounded-md transition-all flex items-center justify-center',
      !isSelected && !isDisabled && 'hover:bg-accent hover:text-accent-foreground',
      isSelected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
      !isSelected && isTodayDate && 'bg-accent text-accent-foreground',
      (isOutside || isDisabled) && 'text-muted-foreground opacity-50',
      isDisabled && 'cursor-not-allowed'
    );
  }

  isDateDisabled(date: Date): boolean {
    return this.disablePastDates ? isBefore(date, startOfDay(new Date())) : false;
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
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}
