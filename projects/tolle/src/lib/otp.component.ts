import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        [maxLength]="length"
        class="absolute inset-0 opacity-0 cursor-default z-20"
        [(ngModel)]="value"
        (input)="onInputChange($event)"
        (focus)="isFocused = true"
        (blur)="isFocused = false"
        [disabled]="disabled"
      />

      <div *ngIf="auto" class="flex items-center gap-2 pointer-events-none">
        <div class="flex items-center">
          <div *ngFor="let _ of [].constructor(length); let i = index"
               [class]="getSlotClass(i)"
          >
            {{ value[i] || '' }}
            <div *ngIf="isFocused && value.length === i" class="absolute inset-0 flex items-center justify-center">
              <div class="h-4 w-px animate-caret-blink bg-foreground duration-1000"></div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!auto" class="flex items-center gap-2 pointer-events-none">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class OtpComponent implements ControlValueAccessor {
  @Input() length = 6;
  @Input() disabled = false;
  @Input() auto = false; // The toggle for automatic slot generation

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

  writeValue(value: any): void { this.value = value || ''; this.cdr.markForCheck(); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}
