import {
  Component, Input, forwardRef, ElementRef, ViewChild, HostListener, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { format, parse, isValid, startOfDay } from 'date-fns';
import { cn } from './utils/cn';
import { MaskedInputComponent } from './masked-input.component';
import { CalendarComponent } from './calendar.component';

@Component({
  selector: 'tolle-date-picker',
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
        [mask]="'00/00/0000'"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [(ngModel)]="inputValue"
        (ngModelChange)="onInputChange($event)"
        [class]="cn(class)"
      >
        <div suffix class="flex items-center gap-1.5 cursor-pointer">
          <i
            *ngIf="value && !disabled"
            (click)="clear($event)"
            class="ri-close-line cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          ></i>

          <i
            (click)="togglePopover($event)"
            class="ri-calendar-line cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          ></i>
        </div>
      </tolle-masked-input>

      <div
        #popover
        *ngIf="isOpen"
        class="absolute bg-popover z-50 max-w-max left-0 right-0 overflow-hidden rounded-md border border-border text-popover-foreground bg-background shadow-md"
        style="visibility: hidden; top: 0; left: 0;"
      >
        <tolle-calendar
          [(ngModel)]="value"
          (ngModelChange)="onCalendarChange($event)"
          [disablePastDates]="disablePastDates"
        ></tolle-calendar>
      </div>
    </div>
  `
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() placeholder = 'MM/DD/YYYY';
  @Input() disabled = false;
  @Input() class = '';
  @Input() disablePastDates = false;

  @ViewChild('triggerContainer') triggerContainer!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;

  value: Date | null = null;
  inputValue: string = '';
  isOpen = false;
  cleanupAutoUpdate?: () => void;

  constructor(private cdr: ChangeDetectorRef) {}

  // --- Logic ---

  onInputChange(str: string) {
    if (str?.length === 10) {
      const parsed = parse(str, 'MM/dd/yyyy', new Date());
      if (isValid(parsed)) {
        this.value = startOfDay(parsed);
        this.onChange(this.value);
      }
    } else if (!str) {
      this.value = null;
      this.onChange(null);
    }
  }

  onCalendarChange(date: Date) {
    this.value = date;
    this.inputValue = format(date, 'MM/dd/yyyy');
    this.onChange(this.value);
    this.close();
  }

  togglePopover(event: MouseEvent) {
    event.stopPropagation(); // Prevent bubbling to document
    if (this.disabled) return;
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    setTimeout(() => this.updatePosition());
  }

  close() {
    this.isOpen = false;
    if (this.cleanupAutoUpdate) this.cleanupAutoUpdate();
  }

  clear(event: MouseEvent) {
    event.stopPropagation(); // CRITICAL: Stop the calendar from opening
    this.value = null;
    this.inputValue = '';
    this.onChange(null);
    this.cdr.markForCheck();
  }

  // --- Positioning ---

  private updatePosition() {
    if (!this.triggerContainer || !this.popover) return;

    this.cleanupAutoUpdate = autoUpdate(
      this.triggerContainer.nativeElement,
      this.popover.nativeElement,
      () => {
        computePosition(this.triggerContainer.nativeElement, this.popover.nativeElement, {
          placement: 'bottom-end', // Aligned to the right where the icon is
          middleware: [offset(4), flip(), shift({ padding: 8 })],
        }).then(({ x, y }) => {
          Object.assign(this.popover.nativeElement.style, {
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
    if (this.isOpen &&
      !this.triggerContainer.nativeElement.contains(event.target) &&
      !this.popover.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  // --- CVA ---
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: any): void {
    if (val) {
      const date = new Date(val);
      if (isValid(date)) {
        this.value = startOfDay(date);
        this.inputValue = format(this.value, 'MM/dd/yyyy');
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
