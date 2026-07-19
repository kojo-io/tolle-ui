import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const switchTrackVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        xs: 'h-4 w-7',
        sm: 'h-5 w-9',
        default: 'h-6 w-11',
        lg: 'h-7 w-[3.25rem]',
      },
      checked: {
        true: 'bg-primary',
        false: 'bg-input',
      },
    },
    defaultVariants: {
      size: 'default',
      checked: false,
    },
  }
);

const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      checked: {
        true: '',
        false: 'translate-x-0',
      },
    },
    compoundVariants: [
      { size: 'xs', checked: true, class: 'translate-x-3' },
      { size: 'sm', checked: true, class: 'translate-x-4' },
      { size: 'default', checked: true, class: 'translate-x-5' },
      { size: 'lg', checked: true, class: 'translate-x-6' },
    ],
    defaultVariants: {
      size: 'default',
      checked: false,
    },
  }
);

export type SwitchProps = VariantProps<typeof switchTrackVariants>;

@Component({
  selector: 'tolle-switch',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
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
      [attr.data-state]="checked ? 'checked' : 'unchecked'"
      [disabled]="disabled"
      (click)="toggle()"
      [class]="trackClass"
    >
      <span [class]="thumbClass"></span>
    </button>
  `
})
export class SwitchComponent implements ControlValueAccessor {
  /** Extra Tailwind classes merged onto the switch track via `cn()` (last-wins). */
  @Input() class = '';
  /** Disables the switch and blocks toggling. @default false */
  @Input() disabled = false;
  /** Size of the switch. @default 'default' */
  @Input() size: SwitchProps['size'] = 'default';

  checked = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get trackClass() {
    return cn(
      switchTrackVariants({ size: this.size, checked: this.checked }),
      this.class
    );
  }

  get thumbClass() {
    return cn(switchThumbVariants({ size: this.size, checked: this.checked }));
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
