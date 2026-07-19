import { Component, Input, Output, EventEmitter, forwardRef, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, HostListener, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { format, isValid, startOfDay } from 'date-fns';
import { cn } from './utils/cn';
import { CalendarComponent, CalendarMode } from './calendar.component';

/**
 * The trigger button — same shape as `tolle-date-time-picker`'s, so the two
 * controls read as siblings: a bordered field that opens a floating panel,
 * not a typeable text input.
 */
const datePickerTriggerVariants = cva(
  'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background text-foreground shadow-sm transition-colors ' +
    'focus:outline-none focus-visible:border-primary/80 focus-visible:ring-4 focus-visible:ring-ring/30 ' +
    'disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        xs: 'h-8 px-2 text-xs',
        sm: 'h-9 px-3 text-sm',
        default: 'h-10 px-3 text-sm',
        lg: 'h-11 px-4 text-base',
      },
      invalid: {
        true: 'border-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/30',
        false: '',
      },
    },
    defaultVariants: { size: 'default', invalid: false },
  }
);

/** Variant props for the date picker. */
export type DatePickerProps = VariantProps<typeof datePickerTriggerVariants>;

/**
 * A button trigger paired with a `tolle-calendar` in a floating panel.
 *
 * The value is a `Date` normalised to the start of its day — a calendar date
 * has no time, and carrying one would make two selections of the same day
 * compare unequal. `mode` switches the whole control between picking a day, a
 * month or a year, taking the calendar's own quick-actions row with it.
 *
 * Implements `ControlValueAccessor`, so it works with `ngModel` and reactive
 * forms. Use `tolle-date-range-picker` for a span and `tolle-date-time-picker`
 * when a time is needed alongside — this trigger is deliberately the same
 * shape as that one, not a typeable masked field.
 */
@Component({
  selector: 'tolle-date-picker',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  template: `
    <button
      #trigger
      type="button"
      aria-haspopup="dialog"
      [attr.aria-expanded]="isOpen"
      [attr.aria-label]="ariaLabel || null"
      [attr.data-state]="isOpen ? 'open' : 'closed'"
      [disabled]="disabled"
      [class]="computedTriggerClass"
      (click)="toggle()"
      (keydown)="onTriggerKeyDown($event)"
    >
      <span [class]="cn('truncate', displayValue ? 'text-foreground' : 'text-muted-foreground')">
        {{ displayValue || placeholder }}
      </span>
      <i class="ri-calendar-line shrink-0 text-muted-foreground" aria-hidden="true"></i>
    </button>

    <div
      #popover
      *ngIf="isOpen"
      role="dialog"
      [attr.aria-label]="'Choose a date'"
      class="fixed left-0 top-0 z-[50]"
      style="visibility: hidden"
    >
      <div class="rounded-md border border-border bg-popover text-popover-foreground shadow-md">
        <div class="p-3">
          <tolle-calendar
            [bordered]="false"
            [showQuickActions]="false"
            [(ngModel)]="value"
            (ngModelChange)="onCalendarChange($event)"
            [mode]="mode"
            [disablePastDates]="disablePastDates"
            [minDate]="minDate"
            [maxDate]="maxDate"
            [formatMonthFn]="formatMonthFn"
            [formatYearFn]="formatYearFn"
          ></tolle-calendar>
        </div>

        <div
          *ngIf="showQuickActions"
          class="flex items-center justify-between gap-2 border-t border-border px-3 py-2"
        >
          <button *ngIf="showClear" type="button" [class]="footerButtonClass" (click)="clearFromFooter()">
            Clear
          </button>
          <button
            type="button"
            [class]="cn(footerButtonClass, 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground', !showClear && 'ml-auto')"
            (click)="done()"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  `
})
export class DatePickerComponent implements OnChanges, ControlValueAccessor, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Text shown on the trigger when no date is selected. @default 'Pick a date' */
  @Input() placeholder = 'Pick a date';
  /** Disables the control. @default false */
  @Input() disabled = false;
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). @default '' */
  @Input() class = '';
  /** Disables every day before today in the calendar. @default false */
  @Input() disablePastDates = false;
  /** Shows the footer's Clear button. @default true */
  @Input() showClear = true;
  /** Shows the panel's Clear / Done footer. @default true */
  @Input() showQuickActions = true;
  /** Earliest selectable date; earlier days are disabled. */
  @Input() minDate?: Date;
  /** Latest selectable date; later days are disabled. */
  @Input() maxDate?: Date;
  /** Whether the control picks a day, a month or a year. @default 'date' */
  @Input() mode: CalendarMode = 'date';
  /** Overrides how a month is labelled in the calendar header. */
  @Input() formatMonthFn?: (date: Date) => string;
  /** Overrides how a year is labelled in the calendar header. */
  @Input() formatYearFn?: (date: Date) => string;
  /** Overrides how the selected date is rendered on the trigger. */
  @Input() displayFormat?: (date: Date, mode: CalendarMode) => string;
  /** Height and text size of the trigger. @default 'default' */
  @Input() size: DatePickerProps['size'] = 'default';
  /** Applies the destructive border and focus ring. @default false */
  @Input() invalid = false;
  /** Accessible name when there is no associated visible label. @default '' */
  @Input() ariaLabel = '';

  /** Emitted with the chosen date, or `null` when the value is cleared. */
  @Output() valueChange = new EventEmitter<Date | null>();
  /** Emitted when the calendar panel opens. */
  @Output() opened = new EventEmitter<void>();
  /** Emitted when the calendar panel closes. */
  @Output() closed = new EventEmitter<void>();

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;

  value: Date | null = null;
  isOpen = false;
  cleanupAutoUpdate?: () => void;

  /** Footer buttons, styled exactly as the date-time picker's. */
  readonly footerButtonClass = cn(
    'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  );

  /** Footer Clear — empties the value and leaves the panel open, like the reference. */
  clearFromFooter(): void {
    this.value = null;
    this.emit();
    this.cdr.markForCheck();
  }

  /** Footer Done — commits what is already selected and closes. */
  done(): void {
    this.close();
  }

  private _outsideClickHandler = (event: MouseEvent) => {
    if (!this.trigger.nativeElement.contains(event.target) && !this.popover?.nativeElement.contains(event.target)) {
      this.close();
    }
  };

  constructor(private cdr: ChangeDetectorRef) {}

  get computedTriggerClass(): string {
    return cn(datePickerTriggerVariants({ size: this.size, invalid: this.invalid }), this.class);
  }

  get displayValue(): string {
    return this.value ? this.formatDate(this.value) : '';
  }

  formatDate(date: Date): string {
    if (this.displayFormat) {
      return this.displayFormat(date, this.mode);
    }

    switch (this.mode) {
      case 'date': return format(date, 'MMM d, yyyy');
      case 'month': return format(date, 'MMMM yyyy');
      case 'year': return format(date, 'yyyy');
      default: return format(date, 'MMM d, yyyy');
    }
  }

  onCalendarChange(date: Date | null) {
    this.value = date;
    this.emit();
    this.close();
    this.cdr.markForCheck();
  }

  toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  onTriggerKeyDown(event: KeyboardEvent): void {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key) && !this.isOpen) {
      event.preventDefault();
      this.open();
    }
  }

  @HostListener('keydown.escape') onEscape() { if (this.isOpen) this.close(); }

  open() {
    if (this.disabled || this.isOpen) return;
    this.isOpen = true;
    this.opened.emit();
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
    if (!this.isOpen) return;
    this.isOpen = false;
    this.closed.emit();
    this.teardown();
    // The outside-click handler is a raw document listener, so nothing else
    // marks this OnPush view dirty when it fires.
    this.cdr.markForCheck();
  }

  /** Reports the current value to the form and to `valueChange`. */
  private emit() {
    this.onChange(this.value);
    this.valueChange.emit(this.value);
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

  private teardown() {
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = undefined;
    }
    document.removeEventListener('pointerdown', this._outsideClickHandler, true);
  }

  ngOnDestroy() {
    this.teardown();
  }

  // CVA Implementation
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: any): void {
    if (val) {
      const date = new Date(val);
      this.value = isValid(date) ? startOfDay(date) : null;
    } else {
      this.value = null;
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
  protected cn = cn;
}
