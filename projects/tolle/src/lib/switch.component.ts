import { Component, input, forwardRef, inject, ChangeDetectorRef, signal, computed } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-switch',
  standalone: true,
  imports: [],
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
      [attr.aria-checked]="checked()"
      [disabled]="disabled()"
      (click)="toggle()"
      [class]="cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses().track,
        checked() ? 'bg-primary' : 'bg-input',
        class()
      )"
    >
      <span
        [class]="cn(
          'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
          sizeClasses().thumb,
          checked() ? sizeClasses().translate : 'translate-x-0'
        )"
      ></span>
    </button>
  `
})
export class SwitchComponent implements ControlValueAccessor {
  class = input('');
  disabled = input(false);
  size = input<'xs' | 'sm' | 'default' | 'lg'>('default');

  checked = signal(false);

  private onChange: (value: boolean) => void = () => { };
  private onTouched: () => void = () => { };

  private cdr = inject(ChangeDetectorRef);

  sizeClasses = computed(() => {
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
    return sizes[this.size() as keyof typeof sizes];
  });

  protected cn = cn;

  toggle() {
    if (this.disabled()) return;
    this.checked.update((v: boolean) => !v);
    this.onChange(this.checked());
    this.onTouched();
  }

  // --- ControlValueAccessor ---
  writeValue(value: boolean): void {
    this.checked.set(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    // This is problematic with input() as it's read-only.
    // However, setDisabledState is usually called by Angular Forms.
    // If we need to support this, we might need a separate signal or model().
    // For now, most of our components use input() and handle disabled state via the template.
    // If the form sets it, we might need a signal to override.
  }
}
