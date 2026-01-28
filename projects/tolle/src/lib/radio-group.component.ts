import { Component, input, forwardRef, effect, inject, OnChanges, SimpleChanges } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from './utils/cn';
import { RadioService } from './radio-service';

@Component({
  selector: 'tolle-radio-group',
  standalone: true,
  imports: [],
  providers: [
    RadioService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="cn('grid gap-2', class())" role="radiogroup">
      <ng-content></ng-content>
    </div>
  `
})
export class RadioGroupComponent implements ControlValueAccessor {
  class = input('');
  disabled = input(false);
  name = input(`radio-group-${Math.random().toString(36).substring(2, 9)}`);

  private radioService = inject(RadioService);

  onChange: (val: any) => void = () => { };
  onTouched: () => void = () => { };

  constructor() {
    effect(() => {
      const val = this.radioService.selectedValue();
      this.onChange(val);
    });

    effect(() => {
      this.radioService.setDisabled(this.disabled());
    });
  }

  setDisabledState?(isDisabled: boolean): void {
    this.radioService.setDisabled(isDisabled);
  }

  writeValue(value: any): void {
    this.radioService.select(value);
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  protected readonly cn = cn;
}
