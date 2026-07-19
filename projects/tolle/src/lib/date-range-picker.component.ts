import { Component, Input, Output, EventEmitter, forwardRef, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, HostListener, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate, size as sizeMiddleware } from '@floating-ui/dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import { RangeCalendarComponent } from './range-calendar.component';
import { format } from 'date-fns';
import { DateRange } from './types/date-range';

/**
 * The trigger button — same shape as `tolle-date-time-picker`'s and
 * `tolle-date-picker`'s, so all three read as one family: a bordered field
 * that opens a floating panel, not a typeable text input.
 */
const dateRangePickerTriggerVariants = cva(
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

/** Variant props for the date range picker. */
export type DateRangePickerProps = VariantProps<typeof dateRangePickerTriggerVariants>;

/**
 * A button trigger paired with a `tolle-range-calendar` in a floating panel,
 * for picking a start and an end date.
 *
 * The value is a `DateRange` — `{ start, end }` — and a half-made range is a
 * legal intermediate state: picking a start emits `{ start, end: null }` and
 * leaves the panel open, so a consumer can react to the first click. The panel
 * only closes once both ends exist.
 *
 * Implements `ControlValueAccessor`, so it works with `ngModel` and reactive
 * forms. Use `tolle-date-picker` for a single date — this trigger is
 * deliberately the same shape as that one and as `tolle-date-time-picker`.
 */
@Component({
  selector: 'tolle-date-range-picker',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, FormsModule, RangeCalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
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
      [attr.aria-label]="'Choose a date range'"
      class="fixed left-0 top-0 z-50"
      style="visibility: hidden"
    >
      <div class="rounded-md border border-border bg-popover text-popover-foreground shadow-md">
        <div class="p-3">
          <tolle-range-calendar
            [bordered]="false"
            [ngModel]="value"
            (rangeSelect)="onCalendarSelect($event)"
            [disablePastDates]="disablePastDates"
            [numberOfMonths]="numberOfMonths"
          ></tolle-range-calendar>
        </div>

        <div class="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
          <button type="button" [class]="footerButtonClass" (click)="clearFromFooter()">
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
  `
})
export class DateRangePickerComponent implements OnChanges, ControlValueAccessor, OnDestroy {

  /**
   * Angular writes a bound `class` input through its styling path, which does
   * not mark an OnPush component dirty — without this hook the component keeps
   * rendering the class it was born with.
   */
  ngOnChanges(): void {
    this.cdr.markForCheck();
  }

  /** Disables the control. @default false */
  @Input() disabled = false;
  /** Text shown on the trigger when no range is selected. @default 'Pick a date range' */
  @Input() placeholder = 'Pick a date range';
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). @default '' */
  @Input() class = '';
  /** Disables every day before today in the calendar. @default false */
  @Input() disablePastDates = false;
  /** Height and text size of the trigger. @default 'default' */
  @Input() size: DateRangePickerProps['size'] = 'default';
  /** Consecutive months shown in the popover (e.g. `2` for a two-month picker). @default 1 */
  @Input() numberOfMonths = 1;
  /** Applies the destructive border and focus ring. @default false */
  @Input() invalid = false;
  /** Accessible name when there is no associated visible label. @default '' */
  @Input() ariaLabel = '';

  /** Emitted with the selected range, including the half-made `{ start, end: null }` state. */
  @Output() valueChange = new EventEmitter<DateRange>();
  /** Emitted when the calendar panel opens. */
  @Output() opened = new EventEmitter<void>();
  /** Emitted when the calendar panel closes. */
  @Output() closed = new EventEmitter<void>();

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;

  value: DateRange = { start: null, end: null };
  isOpen = false;
  cleanupAutoUpdate?: () => void;

  /** Footer buttons, styled exactly as the date-time picker's. */
  readonly footerButtonClass = cn(
    'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  );

  /** Footer Clear — empties the range and leaves the panel open, like the reference. */
  clearFromFooter(): void {
    this.value = { start: null, end: null };
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
    return cn(dateRangePickerTriggerVariants({ size: this.size, invalid: this.invalid }), this.class);
  }

  get displayValue(): string {
    if (!this.value.start) return '';

    const startStr = format(this.value.start, 'MMM d, yyyy');
    if (!this.value.end) return startStr;

    const endStr = format(this.value.end, 'MMM d, yyyy');
    return startStr + ' - ' + endStr;
  }

  onCalendarSelect(range: DateRange) {
    this.value = range;
    this.emit();

    // Close only if range is complete
    if (range.start && range.end) {
      setTimeout(() => this.close(), 150);
    }
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
    if (!this.isOpen) return;
    this.isOpen = false;
    this.closed.emit();
    this.teardown();
    // Both the outside-click handler and the deferred close after a completed
    // range run outside any template binding, so nothing else marks this OnPush
    // view dirty.
    this.cdr.markForCheck();
  }

  /** Reports the current range to the form and to `valueChange`. */
  private emit() {
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  // --- Floating UI Positioning with Fixed Strategy ---
  private updatePosition() {
    if (!this.trigger || !this.popover) return;

    this.cleanupAutoUpdate = autoUpdate(
      this.trigger.nativeElement,
      this.popover.nativeElement,
      () => {
        computePosition(this.trigger.nativeElement, this.popover.nativeElement, {
          placement: 'bottom-start',
          strategy: 'fixed', // Use fixed to escape column layout
          middleware: [
            offset(4),
            flip({
              fallbackAxisSideDirection: 'start',
              padding: 8
            }),
            shift({ padding: 8 }),
            sizeMiddleware({
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
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  protected cn = cn;
}
