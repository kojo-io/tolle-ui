import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';

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
  styles: [':host { display: inline-flex; align-items: center; gap: 0.5rem; }'],
  imports: [],
  // The id belongs to the inner button — the element a `<label for>` can
  // actually target. On the host it was unreachable (and would be duplicated).
  host: { '[attr.id]': 'null' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <button
      type="button"
      [id]="id"
      role="checkbox"
      [attr.aria-checked]="checked"
      [attr.data-state]="checked ? 'checked' : 'unchecked'"
      [disabled]="disabled"
      (click)="toggle()"
      [class]="computedClass">
      @if (checked) {
        <i
          class="ri-check-line font-bold"
          [class]="size === 'xs' ? 'text-[10px]' : 'text-[14px]'"
          aria-hidden="true"></i>
      }
    </button>
    @if (label) {
      <label [for]="id" [class]="labelClass">{{ label }}</label>
    }
  `,
})
export class CheckboxComponent implements ControlValueAccessor {
  /** Extra Tailwind classes merged onto the checkbox via `cn()` (last-wins). */
  @Input() class = '';
  /** Disables the checkbox and blocks toggling. @default false */
  @Input() disabled = false;
  /** Size of the checkbox. @default 'default' */
  @Input() size: CheckboxProps['size'] = 'default';
  /** Id of the checkbox button; a `<label for>` elsewhere can target it. @default auto-generated */
  @Input() id = `tolle-checkbox-${Math.random().toString(36).slice(2, 11)}`;
  /** Text label beside the checkbox; clicking it toggles the checkbox. @default '' */
  @Input() label = '';

  get labelClass() {
    return cn(
      'text-sm font-medium leading-none text-foreground select-none',
      this.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    );
  }

  checked = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get computedClass() {
    return cn(checkboxVariants({ size: this.size, checked: this.checked }), this.class);
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
