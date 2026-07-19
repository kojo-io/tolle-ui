import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const checkboxVariants = cva(
  'group flex shrink-0 cursor-pointer items-center justify-center p-0 rounded-sm border border-primary ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        xs: 'h-3.5 w-3.5',
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      checked: {
        true: 'bg-primary text-primary-foreground',
        false: 'bg-transparent',
      },
    },
    defaultVariants: {
      size: 'default',
      checked: false,
    },
  }
);

export type CheckboxProps = VariantProps<typeof checkboxVariants>;

@Component({
  selector: 'tolle-checkbox',
  styles: [':host { display: inline-flex; }'],
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
    <button
      type="button"
      role="checkbox"
      [attr.aria-checked]="checked"
      [attr.data-state]="checked ? 'checked' : 'unchecked'"
      [disabled]="disabled"
      (click)="toggle()"
      [class]="computedClass"
    >
      <i
        *ngIf="checked"
        class="ri-check-line font-bold"
        [class]="size === 'xs' ? 'text-[10px]' : 'text-[14px]'"
        aria-hidden="true"
      ></i>
    </button>
  `
})
export class CheckboxComponent implements ControlValueAccessor {
  /** Extra Tailwind classes merged onto the checkbox via `cn()` (last-wins). */
  @Input() class = '';
  /** Disables the checkbox and blocks toggling. @default false */
  @Input() disabled = false;
  /** Size of the checkbox. @default 'default' */
  @Input() size: CheckboxProps['size'] = 'default';

  checked = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get computedClass() {
    return cn(
      checkboxVariants({ size: this.size, checked: this.checked }),
      this.class
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
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; this.cdr.markForCheck(); }
}
