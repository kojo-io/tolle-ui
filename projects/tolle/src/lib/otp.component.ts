import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';
import {
  FormControlLabelComponent,
  FormControlMessageComponent,
  describedBy,
  hasMessage,
} from './form-control-label.component';

@Component({
  selector: 'tolle-otp',
  styles: [':host { display: block; }'],
  imports: [FormsModule, FormControlLabelComponent, FormControlMessageComponent],
  // The id belongs to the inner <input> so `<label for>` reaches it.
  host: { '[attr.id]': 'null' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpComponent),
      multi: true,
    },
  ],
  template: `
    @if (label) {
      <tolle-form-control-label [for]="id" [disabled]="disabled">{{ label }}</tolle-form-control-label>
    }
    <div class="relative flex items-center gap-2">
      <input
        #hiddenInput
        [id]="id"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        [attr.aria-label]="label ? null : 'One-time code'"
        [attr.aria-invalid]="error || null"
        [attr.aria-describedby]="describedBy(id, hint, errorMessage, error, disabled)"
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
    @if (hasMessage(hint, errorMessage, error, disabled)) {
      <tolle-form-control-message [controlId]="id" [hint]="hint" [errorMessage]="errorMessage" [error]="error" />
    }
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

  /** Disables the input. @default false */
  @Input() disabled = false;
  /** Render the slots automatically; leave false to project `tolle-otp-group` / `tolle-otp-slot` yourself. @default false */
  @Input() auto = false;
  /** Id of the inner input; a `<label for>` elsewhere can target it. @default auto-generated */
  @Input() id = `tolle-otp-${Math.random().toString(36).slice(2, 11)}`;
  /** Label shown above the slots and wired to the input for screen readers. @default '' */
  @Input() label = '';
  /** Help text shown below the slots while there is no error. @default '' */
  @Input() hint = '';
  /** Error text shown below the slots while `error` is true. @default '' */
  @Input() errorMessage = '';
  /** Marks the code invalid: destructive slot borders, `aria-invalid`, and shows `errorMessage`. @default false */
  @Input() error = false;

  protected readonly describedBy = describedBy;
  protected readonly hasMessage = hasMessage;

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
      this.error && 'border-destructive',
      isActive && 'z-30 ring-2 ring-ring ring-offset-background',
      isActive && this.error && 'ring-destructive'
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
