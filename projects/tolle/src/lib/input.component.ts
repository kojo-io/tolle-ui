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
    <div [class]="cn('relative flex items-center w-full group', 'size-' + size, containerClass)">

      <div class="absolute left-3 flex items-center justify-center text-muted-foreground group-focus-within:text-primary transition-colors"
           [class.left-2.5]="size === 'xs'">
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

      <div class="absolute right-3 flex items-center justify-center text-muted-foreground group-focus-within:text-primary transition-colors"
           [class.right-2.5]="size === 'xs'">
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

  get computedInputClass() {
    return cn(
      "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
      'disabled:opacity-50 shadow-sm transition-shadow',
      this.size === 'xs' && "h-8 text-xs px-2",
      this.size === 'sm' && "h-9 px-3",
      this.size === 'default' && "h-10 px-3",
      this.size === 'lg' && "h-11 px-4 text-base",
      "group-has-[[prefix]]:pl-10 group-has-[[suffix]]:pr-10",
      this.size === 'xs' && "group-has-[[prefix]]:pl-8 group-has-[[suffix]]:pr-8",
      this.error && "border-destructive focus-visible:ring-destructive",
      this.class
    );
  }
}
