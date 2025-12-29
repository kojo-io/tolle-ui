import {Component, Input, forwardRef, AfterContentInit, OnChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from './utils/cn';
import {RadioService} from './radio-service';

@Component({
  selector: 'tolle-radio-group',
  standalone: true,
  imports: [CommonModule],
  providers: [
    RadioService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="cn('grid gap-2', class)" role="radiogroup">
      <ng-content></ng-content>
    </div>
  `
})
export class RadioGroupComponent implements ControlValueAccessor, OnChanges {
  @Input() class = '';
  @Input() disabled = false;
  @Input() name = `radio-group-${Math.random().toString(36).substring(2, 9)}`;

  value: any;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private radioService: RadioService) {
    this.radioService.selectedValue$.subscribe(val => {
      this.value = val;
      this.onChange(val);
    });
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.radioService.setDisabled(isDisabled);
  }

  ngOnChanges() {
    this.radioService.setDisabled(this.disabled);
  }

  writeValue(value: any): void {
    this.value = value;
    this.radioService.select(value);
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  protected readonly cn = cn;
}
