import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="computedContainerClass">

      <div class="flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
        <ng-content select="[prefix]"></ng-content>
      </div>

      <input
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [(ngModel)]="value"
        (blur)="onTouched()"
        (input)="onInputChange($event)"
        [class]="computedInputClass"
      />

      <div class="flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
        <ng-content select="[suffix]"></ng-content>
      </div>
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() error: boolean = false;
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  @Input() containerClass: string = '';
  @Input() class: string = '';

  // Internal State
  value: any = '';

  // CVA Callbacks
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  // --- ControlValueAccessor Implementation ---

  writeValue(value: any): void {
    this.value = value;
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

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  // --- Styling Logic ---
  protected readonly cn = cn;

  get computedContainerClass() {
    return cn(
      "group relative flex items-center w-full rounded-md border border-input bg-background ring-offset-background transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 shadow-sm",
      this.size === 'xs' && "h-8 px-2 gap-1.5",
      this.size === 'sm' && "h-9 px-3 gap-2",
      this.size === 'default' && "h-10 px-3 gap-2",
      this.size === 'lg' && "h-11 px-4 gap-3",
      this.disabled && "cursor-not-allowed opacity-50",
      this.error && "border-destructive focus-within:ring-destructive",
      this.containerClass
    );
  }

  get computedInputClass() {
    return cn(
      "flex-1 bg-transparent border-none p-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed",
      this.size === 'xs' && "text-xs",
      this.size === 'lg' && "text-base",
      this.class
    );
  }
}
