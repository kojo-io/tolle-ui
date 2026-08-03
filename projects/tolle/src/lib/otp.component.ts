import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-otp',
  styles: [':host { display: block; }'],
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative flex items-center gap-2">
      <input
        #hiddenInput
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        aria-label="One-time code"
        [maxLength]="length"
        class="absolute inset-0 z-20 cursor-default opacity-0"
        [(ngModel)]="value"
        (input)="onInputChange($event)"
        (focus)="isFocused = true"
        (blur)="isFocused = false; onTouched()"
        [disabled]="disabled" />

      @if (auto) {
        <div class="pointer-events-none flex items-center gap-2">
          <div class="flex items-center">
            @for (_ of slots; track _; let i = $index) {
              <div [class]="getSlotClass(i)">
                {{ value[i] || '' }}
                @if (isFocused && value.length === i) {
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="animate-caret-blink h-4 w-px bg-foreground duration-1000"></div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }

      @if (!auto) {
        <div class="pointer-events-none flex items-center gap-2">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
})
export class OtpComponent implements ControlValueAccessor {
  @Input()
  set length(val: number) {
    const numericVal = Number(val);
    this._length = numericVal;
    this.slots = Array(numericVal).fill(0);
  }
  get length() {
    return this._length;
  }
  private _length = 6;

  @Input() disabled = false;
  @Input() auto = false;

  protected slots: number[] = Array(6).fill(0);

  value: string = '';
  isFocused = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  onInputChange(event: any) {
    const val = event.target.value.replace(/\D/g, '');
    this.value = val;
    this.onChange(val);
    this.cdr.markForCheck();
  }

  // Visual logic for the automated slots
  getSlotClass(index: number) {
    const isActive = this.isFocused && this.value.length === index;

    return cn(
      'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all bg-background',
      index === 0 && 'rounded-l-md border-l',
      index === this.length - 1 && 'rounded-r-md',
      isActive && 'z-30 ring-2 ring-ring ring-offset-background'
    );
  }

  writeValue(value: any): void {
    this.value = value || '';
    this.cdr.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
}
