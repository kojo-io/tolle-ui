import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { format, isSameDay, isValid, startOfDay } from 'date-fns';
import { cn } from './utils/cn';
import { CalendarComponent } from './calendar.component';
import { TimeColumnsComponent, TimeParts, to12Hour } from './time-picker.component';

const SECONDS_PER_DAY = 24 * 3600;

const dateTimePickerTriggerVariants = cva(
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

/** Variant props for the date-time picker trigger. */
export type DateTimePickerProps = VariantProps<typeof dateTimePickerTriggerVariants>;

/**
 * One control for a date *and* a time: `tolle-calendar` on the left, the
 * `tolle-time-columns` strip on the right, in a single floating panel with a
 * Clear / Done footer.
 *
 * The value is a `Date`, because a date-time genuinely is a moment. Changing
 * the date preserves the chosen time and changing the time preserves the
 * chosen date — the two halves are only ever recombined, never reset.
 *
 * Implements `ControlValueAccessor`, so it works with `ngModel` and reactive
 * forms. Use `tolle-date-picker` for a date alone and `tolle-time-picker` for a
 * time alone.
 * @new
 */
@Component({
  selector: 'tolle-date-time-picker',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent, TimeColumnsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    },
  ],
  template: `
    <button
      #trigger
      type="button"
      aria-haspopup="dialog"
      [attr.aria-expanded]="isOpen"
      [attr.aria-controls]="isOpen ? panelId : null"
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
      <i class="ri-calendar-schedule-line shrink-0 text-muted-foreground" aria-hidden="true"></i>
    </button>

    <div
      *ngIf="isOpen"
      #panel
      role="dialog"
      [id]="panelId"
      [attr.aria-label]="ariaLabel || 'Choose a date and time'"
      class="fixed left-0 top-0 z-[9999]"
      style="visibility: hidden"
    >
      <div class="rounded-md border border-border bg-popover text-popover-foreground shadow-md">
        <div class="flex flex-col sm:flex-row">
          <div class="p-3">
            <tolle-calendar
              [bordered]="false"
              [showQuickActions]="false"
              [minDate]="calendarMin"
              [maxDate]="calendarMax"
              [ngModel]="value"
              (dateSelect)="onDateSelect($event)"
            ></tolle-calendar>
          </div>

          <div class="border-t border-border p-3 sm:border-l sm:border-t-0">
            <tolle-time-columns
              #columns
              [hour]="hour"
              [minute]="minute"
              [second]="second"
              [use12Hours]="use12Hours"
              [showSeconds]="showSeconds"
              [minuteStep]="minuteStep"
              [minSeconds]="minSeconds"
              [maxSeconds]="maxSeconds"
              [size]="size"
              (timeChange)="onTimeChange($event)"
            ></tolle-time-columns>
          </div>
        </div>

        <div class="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
          <button
            type="button"
            [class]="footerButtonClass"
            (click)="clear()"
          >
            Clear
          </button>
          <button
            type="button"
            [class]="cn(footerButtonClass, 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground')"
            (click)="done()"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DateTimePickerComponent implements ControlValueAccessor, OnChanges, OnDestroy {
  /** Text shown on the trigger when nothing is selected. @default 'Select date and time' */
  @Input() placeholder = 'Select date and time';
  /** Disables the control. @default false */
  @Input() disabled = false;
  /** Renders a 12-hour face with an AM/PM column. @default false */
  @Input() use12Hours = false;
  /** Adds a seconds column. @default false */
  @Input() showSeconds = false;
  /** Interval between minute entries, in minutes. @default 1 */
  @Input() minuteStep = 1;
  /** Earliest selectable moment; earlier days and times are disabled. */
  @Input() min?: Date;
  /** Latest selectable moment; later days and times are disabled. */
  @Input() max?: Date;
  /** date-fns pattern used to render the value on the trigger. @default 'MMM d, yyyy h:mm a' */
  @Input() displayFormat = 'MMM d, yyyy h:mm a';
  /** Height and text size of the trigger and entries. @default 'default' */
  @Input() size: DateTimePickerProps['size'] = 'default';
  /** Applies the destructive border and focus ring. @default false */
  @Input() invalid = false;
  /** Accessible name when there is no associated visible label. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the chosen moment, or `null` when the value is cleared. */
  @Output() valueChange = new EventEmitter<Date | null>();
  /** Emitted when the panel opens. */
  @Output() opened = new EventEmitter<void>();
  /** Emitted when the panel closes. */
  @Output() closed = new EventEmitter<void>();

  @ViewChild('trigger') triggerEl?: ElementRef<HTMLElement>;
  @ViewChild('panel') panelEl?: ElementRef<HTMLElement>;
  @ViewChild('columns') columnsCmp?: TimeColumnsComponent;

  readonly panelId = 'date-time-picker-panel-' + Math.random().toString(36).slice(2, 11);

  value: Date | null = null;
  isOpen = false;

  /**
   * Day-only copies of `min` / `max` for the calendar. The calendar compares
   * whole `Date`s, so passing a bound that carries a time would disable its own
   * day — 09:00 on the min day would look "before" a 09:30 minimum.
   */
  calendarMin?: Date;
  calendarMax?: Date;

  readonly footerButtonClass = cn(
    'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  );

  protected cn = cn;

  private cleanup?: () => void;
  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this.calendarMin = this.min ? startOfDay(this.min) : undefined;
    this.calendarMax = this.max ? startOfDay(this.max) : undefined;
  }

  private readonly outsideClickHandler = (event: MouseEvent) => {
    const target = event.target as Node;
    if (
      !this.triggerEl?.nativeElement.contains(target) &&
      !this.panelEl?.nativeElement.contains(target)
    ) {
      this.close();
    }
  };

  private readonly escapeHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.isOpen) {
      event.preventDefault();
      this.close();
      this.triggerEl?.nativeElement.focus();
    }
  };

  /* ---------------- derived ---------------- */

  get hour(): number | null {
    return this.value ? this.value.getHours() : null;
  }

  get minute(): number | null {
    return this.value ? this.value.getMinutes() : null;
  }

  get second(): number | null {
    return this.value ? this.value.getSeconds() : null;
  }

  get displayValue(): string {
    if (!this.value) return '';
    try {
      return format(this.value, this.displayFormat);
    } catch {
      // A bad pattern should not blank the control; fall back to something readable.
      const { hour12, meridiem } = to12Hour(this.value.getHours());
      return (
        format(this.value, 'MMM d, yyyy') +
        ' ' +
        hour12 +
        ':' +
        String(this.value.getMinutes()).padStart(2, '0') +
        ' ' +
        meridiem
      );
    }
  }

  /**
   * The time bound only bites on the boundary day itself: on the min day the
   * columns start at the min time, on any later day they start at midnight.
   */
  get minSeconds(): number {
    if (!this.min) return 0;
    const day = this.value ?? this.min;
    if (!isSameDay(day, this.min)) return 0;
    return this.min.getHours() * 3600 + this.min.getMinutes() * 60 + this.min.getSeconds();
  }

  get maxSeconds(): number {
    if (!this.max) return SECONDS_PER_DAY - 1;
    const day = this.value ?? this.max;
    if (!isSameDay(day, this.max)) return SECONDS_PER_DAY - 1;
    return this.max.getHours() * 3600 + this.max.getMinutes() * 60 + this.max.getSeconds();
  }

  get computedTriggerClass(): string {
    return cn(
      dateTimePickerTriggerVariants({ size: this.size, invalid: this.invalid }),
      this.class
    );
  }

  /* ---------------- open / close ---------------- */

  toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  open(): void {
    if (this.disabled || this.isOpen) return;
    this.isOpen = true;
    this.opened.emit();
    this.cdr.markForCheck();

    setTimeout(() => {
      this.updatePosition();
      this.columnsCmp?.scrollSelectedIntoView();
      document.addEventListener('pointerdown', this.outsideClickHandler, true);
      document.addEventListener('keydown', this.escapeHandler, true);
    });
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.closed.emit();
    this.onTouched();
    this.teardown();
    this.cdr.markForCheck();
  }

  onTriggerKeyDown(event: KeyboardEvent): void {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key) && !this.isOpen) {
      event.preventDefault();
      this.open();
    }
  }

  /* ---------------- value ---------------- */

  /**
   * Applies a newly picked day, carrying the existing time across. With no
   * time chosen yet the day starts at midnight.
   */
  onDateSelect(date: Date | null): void {
    if (!date) {
      this.clear();
      return;
    }

    const previous = this.value;
    this.commit(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        previous ? previous.getHours() : 0,
        previous ? previous.getMinutes() : 0,
        previous ? previous.getSeconds() : 0,
        0
      )
    );
  }

  /**
   * Applies a newly picked time, carrying the existing day across. With no day
   * chosen yet the time lands on today.
   */
  onTimeChange(parts: TimeParts): void {
    const base = this.value ?? new Date();
    this.commit(
      new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        parts.hour,
        parts.minute,
        parts.second,
        0
      )
    );
  }

  clear(): void {
    this.commit(null);
    // The calendar keeps its own selection and ignores a null written through
    // the CVA, so closing is what actually returns it to a clean state — it is
    // rebuilt from scratch the next time the panel opens.
    this.close();
  }

  done(): void {
    this.close();
    this.triggerEl?.nativeElement.focus();
  }

  private commit(next: Date | null): void {
    this.value = next;
    this.onChange(next);
    this.valueChange.emit(next);
    this.cdr.markForCheck();
  }

  private updatePosition(): void {
    const trigger = this.triggerEl?.nativeElement;
    const panel = this.panelEl?.nativeElement;
    if (!trigger || !panel) return;

    this.cleanup = autoUpdate(trigger, panel, () => {
      computePosition(trigger, panel, {
        strategy: 'fixed',
        placement: 'bottom-start',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        Object.assign(panel.style, {
          left: x + 'px',
          top: y + 'px',
          visibility: 'visible',
        });
      });
    });
  }

  private teardown(): void {
    this.cleanup?.();
    this.cleanup = undefined;
    document.removeEventListener('pointerdown', this.outsideClickHandler, true);
    document.removeEventListener('keydown', this.escapeHandler, true);
  }

  ngOnDestroy(): void {
    this.teardown();
  }

  /* ---------------- ControlValueAccessor ---------------- */

  writeValue(value: Date | string | null | undefined): void {
    if (value instanceof Date && isValid(value)) {
      this.value = value;
    } else if (typeof value === 'string' && value) {
      const parsed = new Date(value);
      this.value = isValid(parsed) ? parsed : null;
    } else {
      this.value = null;
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) this.close();
    this.cdr.markForCheck();
  }
}
