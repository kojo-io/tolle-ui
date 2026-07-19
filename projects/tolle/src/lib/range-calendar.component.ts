import { Component, Input, OnInit, OnChanges, SimpleChanges, forwardRef, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  addDays, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isToday, setMonth, setYear, addYears, subYears,
  isBefore, startOfDay, isWithinInterval, format
} from 'date-fns';
import { cn } from './utils/cn';
import {DateRange} from './types/date-range';

@Component({
  selector: 'tolle-range-calendar',
  styles: [':host { display: block; }'],
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
    <div [class]="cn('text-popover-foreground inline-block min-w-fit', bordered ? 'p-3 border rounded-md bg-background shadow-sm' : '', class)">

      <!-- ===== Multi-month view (side-by-side, shared range) ===== -->
      <div *ngIf="numberOfMonths > 1" class="flex flex-col gap-4 sm:flex-row">
        <div *ngFor="let m of visibleMonths; let idx = index" class="space-y-2">
          <div class="flex items-center justify-between pt-1 pb-2">
            <button *ngIf="idx === 0" type="button" (click)="prev()" [class]="navBtnClass" aria-label="Previous month">
              <i class="ri-arrow-left-s-line text-lg"></i>
            </button>
            <span *ngIf="idx !== 0" class="h-7 w-7"></span>

            <div class="text-sm font-semibold">{{ m.label }}</div>

            <button *ngIf="idx === visibleMonths.length - 1" type="button" (click)="next()" [class]="navBtnClass" aria-label="Next month">
              <i class="ri-arrow-right-s-line text-lg"></i>
            </button>
            <span *ngIf="idx !== visibleMonths.length - 1" class="h-7 w-7"></span>
          </div>

          <div class="grid grid-cols-7 gap-y-1">
            <span *ngFor="let day of weekDays" class="text-[0.8rem] text-muted-foreground font-normal text-center w-9">{{ day }}</span>
          </div>
          <div role="grid" class="grid grid-cols-7 gap-y-1" (keydown)="onGridKeydown($event)">
            <ng-container *ngFor="let date of m.days">
              <!-- Only the month's own days are rendered; adjacent-month days are
                   blank spacers so each calendar in a multi-month view is self-contained. -->
              <button
                *ngIf="isCurrentMonth(date, m.date); else pad"
                type="button"
                role="gridcell"
                [attr.data-date]="fmtKey(date)"
                [attr.aria-selected]="isSelected(date)"
                [attr.aria-label]="(date | date:'fullDate')"
                (click)="selectDate(date)"
                [disabled]="isDateDisabled(date)"
                [class]="getDayClass(date, m.date)"
              >
                {{ date | date: 'd' }}
              </button>
              <ng-template #pad><span class="h-9 w-9" aria-hidden="true"></span></ng-template>
            </ng-container>
          </div>
        </div>
      </div>

      <!-- ===== Single-month view (with month / year quick pickers) ===== -->
      <ng-container *ngIf="numberOfMonths <= 1">
        <div class="flex items-center justify-between pt-1 pb-4 gap-2">
          <div class="flex items-center gap-1">
            <button type="button" (click)="setView('month')"
              [class]="cn('text-sm font-semibold px-2 py-1 rounded transition-colors', currentView === 'month' ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground')">
              {{ viewDate | date: 'MMMM' }}
            </button>
            <button type="button" (click)="setView('year')"
              [class]="cn('text-sm font-semibold px-2 py-1 rounded transition-colors', currentView === 'year' ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground')">
              {{ viewDate | date: 'yyyy' }}
            </button>
          </div>
          <div class="flex items-center space-x-1">
            <button type="button" (click)="prev()" [class]="navBtnClass" aria-label="Previous month"><i class="ri-arrow-left-s-line text-lg"></i></button>
            <button type="button" (click)="next()" [class]="navBtnClass" aria-label="Next month"><i class="ri-arrow-right-s-line text-lg"></i></button>
          </div>
        </div>

        <div *ngIf="currentView === 'date'" class="space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div class="grid grid-cols-7 gap-y-1 w-full">
            <span *ngFor="let day of weekDays" class="text-[0.8rem] text-muted-foreground font-normal text-center w-9">
              {{ day }}
            </span>
          </div>
          <div role="grid" class="grid grid-cols-7 gap-y-1 w-full" (keydown)="onGridKeydown($event)">
            <button
              *ngFor="let date of daysInMonth"
              type="button"
              role="gridcell"
              [attr.data-date]="fmtKey(date)"
              [attr.aria-selected]="isSelected(date)"
              [attr.aria-label]="(date | date:'fullDate')"
              (click)="selectDate(date)"
              [disabled]="isDateDisabled(date)"
              [class]="getDayClass(date)"
            >
              {{ date | date: 'd' }}
            </button>
          </div>
        </div>

        <div *ngIf="currentView === 'month'" class="grid grid-cols-3 gap-2 w-64 animate-in fade-in zoom-in-95 duration-200">
          <button *ngFor="let month of months; let i = index" type="button" (click)="selectMonth(i)"
            [class]="cn('text-sm py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors', i === viewDate.getMonth() ? 'bg-primary text-primary-foreground' : '')">
            {{ month }}
          </button>
        </div>

        <div *ngIf="currentView === 'year'" class="grid grid-cols-4 gap-2 w-64 animate-in fade-in zoom-in-95 duration-200">
          <button *ngFor="let year of years" type="button" (click)="selectYear(year)"
            [class]="cn('text-sm py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors', year === viewDate.getFullYear() ? 'bg-primary text-primary-foreground' : '')">
            {{ year }}
          </button>
        </div>
      </ng-container>
    </div>
  `
})
export class RangeCalendarComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() class = '';
  @Input() disablePastDates = false;
  /** Renders the calendar's own border/background/shadow. Set `false` inside a
   * card/popover that already provides chrome. @default true */
  @Input() bordered = true;
  /** Number of consecutive months rendered side by side. @default 1 */
  @Input() numberOfMonths = 1;
  @Output() rangeSelect = new EventEmitter<DateRange>(); // Emits whenever selection changes

  currentView: 'date' | 'month' | 'year' = 'date';
  viewDate: Date = new Date();

  // The Range Value
  value: DateRange = { start: null, end: null };

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  daysInMonth: Date[] = [];
  /** Grids for each visible month (multi-month view). */
  visibleMonths: { date: Date; days: Date[]; label: string }[] = [];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  years: number[] = [];

  navBtnClass = cn('h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring');

  onTouched: () => void = () => {};
  onChange: (value: DateRange) => void = () => {};
  protected cn = cn;

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.generateDays();
    this.generateYears();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Rebuild the month grids when the visible-month count changes after init
    // (e.g. a `[numberOfMonths]` toggle), so single ⇄ multi-month is reactive.
    if (changes['numberOfMonths'] && !changes['numberOfMonths'].firstChange) {
      this.generateDays();
    }
  }

  // --- Date Generation Logic (Same as Calendar) ---
  generateDays() {
    const start = startOfWeek(startOfMonth(this.viewDate));
    const end = endOfWeek(endOfMonth(this.viewDate));
    this.daysInMonth = eachDayOfInterval({ start, end });

    // Multi-month grids: viewDate is the leftmost month, then N-1 consecutive.
    const count = Math.max(1, this.numberOfMonths);
    this.visibleMonths = Array.from({ length: count }, (_, i) => {
      const monthDate = addMonths(this.viewDate, i);
      return {
        date: monthDate,
        days: eachDayOfInterval({ start: startOfWeek(startOfMonth(monthDate)), end: endOfWeek(endOfMonth(monthDate)) }),
        label: format(monthDate, 'MMMM yyyy'),
      };
    });
  }

  generateYears() {
    const currentYear = this.viewDate.getFullYear();
    this.years = Array.from({ length: 16 }, (_, i) => currentYear - 6 + i);
  }

  setView(view: 'date' | 'month' | 'year') {
    this.currentView = view;
    if (view === 'year') this.generateYears();
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

  // --- Range Selection Logic ---

  selectDate(date: Date) {
    if (this.isDateDisabled(date)) return;

    const { start, end } = this.value;

    // 1. If start exists but end doesn't
    if (start && !end) {
      if (isBefore(date, start)) {
        // User clicked earlier date -> Reset start
        this.value = { start: date, end: null };
      } else {
        // User clicked later date -> Complete range
        this.value = { start, end: date };
      }
    }
    // 2. If neither exist OR both exist (reset)
    else {
      this.value = { start: date, end: null };
    }

    // Only re-anchor the view when the clicked day isn't already on a visible month
    // (so clicking the right-hand month in a 2-month view doesn't jump the calendar).
    const onVisibleMonth = this.visibleMonths.some((m) => isSameMonth(date, m.date));
    if (!onVisibleMonth) {
      this.viewDate = startOfMonth(date);
      this.generateDays();
    }

    this.onChange(this.value);
    this.rangeSelect.emit(this.value);
    this.onTouched();
  }

  // --- Grid keyboard navigation (date view only) ---

  /**
   * Arrow keys move by day/week, Home/End to week edges, PageUp/PageDown by
   * month. Enter/Space are left to the native day <button>. The focused day is
   * read from its `data-date` key, so navigation is independent of grid layout
   * (adjacent-month days aren't rendered in the multi-month view).
   */
  onGridKeydown(event: KeyboardEvent) {
    if (this.numberOfMonths <= 1 && this.currentView !== 'date') return;

    const key = (event.target as HTMLElement).getAttribute('data-date');
    if (!key) return;
    const current = this.keyToDate(key);

    let next: Date | null = null;
    switch (event.key) {
      case 'ArrowLeft': next = addDays(current, -1); break;
      case 'ArrowRight': next = addDays(current, 1); break;
      case 'ArrowUp': next = addDays(current, -7); break;
      case 'ArrowDown': next = addDays(current, 7); break;
      case 'Home': next = startOfWeek(current); break;
      case 'End': next = endOfWeek(current); break;
      case 'PageUp': next = subMonths(current, 1); break;
      case 'PageDown': next = addMonths(current, 1); break;
      default: return;
    }

    event.preventDefault();
    this.focusDay(next);
  }

  private focusDay(date: Date) {
    const selector = `[data-date="${this.fmtKey(date)}"]`;
    let btn = this.el.nativeElement.querySelector(selector) as HTMLElement | null;
    if (btn) { btn.focus(); return; }

    // Target day isn't currently rendered → page the view toward it, then retry.
    if (this.numberOfMonths > 1) {
      this.viewDate = isBefore(date, this.visibleMonths[0].date)
        ? subMonths(this.viewDate, 1)
        : addMonths(this.viewDate, 1);
    } else {
      this.viewDate = startOfMonth(date);
    }
    this.generateDays();
    this.cdr.detectChanges();
    btn = this.el.nativeElement.querySelector(selector) as HTMLElement | null;
    btn?.focus();
  }

  selectMonth(monthIndex: number) {
    this.viewDate = setMonth(this.viewDate, monthIndex);
    this.currentView = 'date';
    this.generateDays();
  }

  selectYear(year: number) {
    this.viewDate = setYear(this.viewDate, year);
    this.currentView = 'date';
    this.generateDays();
  }

  // --- Visual Styling for Range ---

  isSelected(date: Date): boolean {
    const { start, end } = this.value;
    return !!((start && isSameDay(date, start)) || (end && isSameDay(date, end)));
  }

  /** True when `date` belongs to `refMonth` (used to blank out adjacent-month cells). */
  isCurrentMonth(date: Date, refMonth: Date): boolean {
    return isSameMonth(date, refMonth);
  }

  /** Stable, timezone-safe `data-date` key used to locate day buttons for focus. */
  fmtKey(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  private keyToDate(key: string): Date {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  getDayClass(date: Date, refMonth: Date = this.viewDate) {
    const { start, end } = this.value;
    const isOutside = !isSameMonth(date, refMonth);
    const isDisabled = this.isDateDisabled(date);

    // Range Checks
    const isStart = start && isSameDay(date, start);
    const isEnd = end && isSameDay(date, end);
    const isInside = start && end && isWithinInterval(date, { start, end });
    const isTodayDate = isToday(date);

    return cn(
      // Base: h-9 w-9, but we remove margins/rounding for the 'strip' effect
      'h-9 w-9 p-0 font-normal text-sm transition-all flex items-center justify-center relative z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',

      // Default State (Not selected, Not disabled)
      !isInside && !isStart && !isEnd && !isDisabled && 'hover:bg-accent hover:text-accent-foreground rounded-md',

      // The "Caps": Start and End
      (isStart || isEnd) && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',

      // The "Strip": Dates between start and end
      isInside && !isStart && !isEnd && 'bg-accent text-accent-foreground rounded-none',

      // Connecting the Caps to the Strip (Rectangular inside edges)
      isStart && end && 'rounded-l-md rounded-r-none',
      isEnd && start && 'rounded-r-md rounded-l-none',
      // If no end date yet, Start should be fully rounded
      isStart && !end && 'rounded-md',

      // Muted/Disabled logic
      !isInside && isTodayDate && !isStart && !isEnd && 'bg-accent/50 text-accent-foreground rounded-md',
      (isOutside || isDisabled) && 'text-muted-foreground opacity-50',
      isDisabled && 'cursor-not-allowed'
    );
  }

  isDateDisabled(date: Date): boolean {
    return this.disablePastDates ? isBefore(date, startOfDay(new Date())) : false;
  }

  // --- CVA Implementation ---
  writeValue(val: DateRange | null): void {
    if (val) {
      this.value = val;
      if (val.start) this.viewDate = val.start;
      this.generateDays();
      this.generateYears();
    }
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}
