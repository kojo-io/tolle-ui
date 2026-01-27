import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-switch',
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SwitchComponent),
            multi: true
        }
    ],
    template: `
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked"
      [disabled]="disabled"
      (click)="toggle()"
      [class]="cn(
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
    sizeClasses.track,
    checked ? 'bg-primary' : 'bg-input',
    class
  )"
    >
  <span
    [class]="cn(
      'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
      sizeClasses.thumb,
      checked ? sizeClasses.translate : 'translate-x-0'
    )"
  ></span>
    </button>
  `
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() class = '';
  @Input() disabled = false;
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';

  checked = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get sizeClasses() {
    const sizes = {
      xs: {
        track: 'h-4 w-7',
        thumb: 'h-3 w-3',
        translate: 'translate-x-3'
      },
      sm: {
        track: 'h-5 w-9',
        thumb: 'h-4 w-4',
        translate: 'translate-x-4'
      },
      default: {
        track: 'h-6 w-11',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5'
      },
      lg: {
        track: 'h-7 w-[3.25rem]',
        thumb: 'h-6 w-6',
        translate: 'translate-x-6'
      }
    };
    return sizes[this.size];
  }

  protected cn = cn;

  toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.onChange(this.checked);
    this.onTouched();
  }

  // --- ControlValueAccessor ---
  writeValue(value: boolean): void {
    this.checked = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
}
