import {
  Component, input, forwardRef, ElementRef, viewChild, HostListener, ChangeDetectorRef, signal, computed, inject
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate, size } from '@floating-ui/dom';
import { cn } from './utils/cn';
import { RangeCalendarComponent } from './range-calendar.component';
import { format } from 'date-fns';
import { InputComponent } from './input.component';
import { DateRange } from './types/date-range';

@Component({
  selector: 'tolle-date-range-picker',
  standalone: true,
  imports: [FormsModule, RangeCalendarComponent, InputComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative w-full" #triggerContainer>
      <tolle-input
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [ngModel]="displayValue()"
        [class]="className()"
        >
        <div suffix class="flex items-center gap-1.5 cursor-pointer">
          @if ((value().start || value().end) && !disabled()) {
            <i
              (click)="clear($event)"
              class="ri-close-line cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            ></i>
          }
    
          <i
            (click)="togglePopover($event)"
            class="ri-calendar-line cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          ></i>
        </div>
      </tolle-input>
    
      @if (isOpen()) {
        <div
          #popover
          class="fixed z-50"
          style="visibility: hidden;"
          >
          <tolle-range-calendar class="shadow-lg"
            [ngModel]="value()"
            (rangeSelect)="onCalendarSelect($event)"
            [disablePastDates]="disablePastDates()"
          ></tolle-range-calendar>
        </div>
      }
    </div>
  `
})
export class DateRangePickerComponent implements ControlValueAccessor {
  disabled = input(false);
  placeholder = input('Pick a date range');
  className = input('', { alias: 'class' });
  disablePastDates = input(false);
  inputSize = input<'xs' | 'sm' | 'default' | 'lg'>('default', { alias: 'size' });

  triggerContainer = viewChild<ElementRef>('triggerContainer');
  popover = viewChild<ElementRef>('popover');

  value = signal<DateRange>({ start: null, end: null });
  isOpen = signal(false);
  private cleanupAutoUpdate?: () => void;

  private cdr = inject(ChangeDetectorRef);

  displayValue = computed(() => {
    const val = this.value();
    if (!val.start) return '';

    const startStr = format(val.start, 'MMM dd, yyyy');
    if (!val.end) return startStr;

    const endStr = format(val.end, 'MMM dd, yyyy');
    return `${startStr} - ${endStr}`;
  });

  onCalendarSelect(range: DateRange) {
    this.value.set(range);
    this.onChange(range);

    if (range.start && range.end) {
      setTimeout(() => this.close(), 150);
    }
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
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = undefined;
    }
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    this.value.set({ start: null, end: null });
    this.onChange(this.value());
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
          placement: 'bottom-end',
          strategy: 'fixed',
          middleware: [
            offset(4),
            flip({
              fallbackAxisSideDirection: 'start',
              padding: 8
            }),
            shift({ padding: 8 }),
            size({
              apply({ rects, elements, availableHeight }) {
                Object.assign(elements.floating.style, {
                  maxHeight: `${Math.min(400, availableHeight)}px`,
                  minWidth: `${Math.max(rects.reference.width, 320)}px`,
                });
              }
            })
          ],
        }).then(({ x, y, placement }) => {
          Object.assign(popover.style, {
            left: `${x}px`,
            top: `${y}px`,
            visibility: 'visible',
          });

          popover.classList.remove('calendar-top', 'calendar-bottom');
          if (placement.includes('top')) {
            popover.classList.add('calendar-top');
          } else {
            popover.classList.add('calendar-bottom');
          }
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

  @HostListener('window:resize')
  onWindowResize() {
    if (this.isOpen()) {
      this.close();
    }
  }

  // --- Control Value Accessor ---
  onChange: (value: DateRange) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(val: DateRange | null): void {
    if (val) {
      this.value.set({ ...val });
    } else {
      this.value.set({ start: null, end: null });
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: DateRange) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    // disabled is an input
  }

  protected cn = cn;
}
