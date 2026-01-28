import { Component, input, forwardRef, ChangeDetectorRef, signal, computed, inject } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-otp',
  exportAs: 'tolleOtp',
  standalone: true,
  imports: [FormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OtpComponent),
    multi: true
  }],
  template: `
    <div class="relative flex items-center gap-2">
      <input
        #hiddenInput
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        [maxLength]="length()"
        class="absolute inset-0 opacity-0 cursor-default z-20"
        [ngModel]="value()"
        (input)="onInputChange($event)"
        (focus)="isFocused.set(true)"
        (blur)="isFocused.set(false)"
        [disabled]="disabled()"
        />
    
      @if (auto()) {
        <div class="flex items-center gap-2 pointer-events-none">
          <div class="flex items-center">
            @for (_ of slots(); track i; let i = $index) {
              <div
                [class]="getSlotClass(i)"
                >
                {{ value()[i] || '' }}
                @if (isFocused() && value().length === i) {
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="h-4 w-px animate-caret-blink bg-foreground duration-1000"></div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    
      @if (!auto()) {
        <div class="flex items-center gap-2 pointer-events-none">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `
})
export class OtpComponent implements ControlValueAccessor {
  length = input<number>(6);
  disabled = input(false);
  auto = input(false);

  protected slots = computed(() => Array(Number(this.length())).fill(0));

  value = signal<string>('');
  isFocused = signal(false);

  private cdr = inject(ChangeDetectorRef);

  onChange: (val: string) => void = () => { };
  onTouched: () => void = () => { };

  onInputChange(event: any) {
    const val = event.target.value.replace(/\D/g, '');
    this.value.set(val);
    this.onChange(val);
    this.cdr.markForCheck();
  }

  // Visual logic for the automated slots
  getSlotClass(index: number) {
    const isActive = this.isFocused() && this.value().length === index;
    const len = this.length();

    return cn(
      'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all bg-background',
      index === 0 && 'rounded-l-md border-l',
      index === len - 1 && 'rounded-r-md',
      isActive && 'z-30 ring-2 ring-ring ring-offset-background'
    );
  }

  writeValue(value: any): void {
    this.value.set(value || '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}
