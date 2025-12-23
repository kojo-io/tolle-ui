import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-checkbox',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  template: `
    <div
      (click)="toggle()"
      [class]="cn(
        'group flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-primary ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary text-primary-foreground' : 'bg-transparent',
        sizeClasses,
        class
      )"
    >
      <i
        *ngIf="checked"
        class="ri-check-line font-bold"
        [class]="size === 'xs' ? 'text-[10px]' : 'text-[14px]'"
      ></i>
    </div>
  `
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() class = '';
  @Input() disabled = false;
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';

  checked = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  protected cn = cn;

  get sizeClasses() {
    return cn(
      this.size === 'xs' && 'h-3.5 w-3.5',
      this.size === 'sm' && 'h-4 w-4',
      this.size === 'default' && 'h-5 w-5',
      this.size === 'lg' && 'h-6 w-6'
    );
  }

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
