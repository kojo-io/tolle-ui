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
    <div class="flex flex-col gap-1.5 w-full">
      <label
        *ngIf="label"
        [for]="id"
        [class.opacity-50]="disabled"
        class="text-sm font-medium text-foreground leading-none transition-opacity"
      >
        {{ label }}
      </label>

      <div [class]="computedContainerClass">
        <div class="flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
          <ng-content select="[prefix]"></ng-content>
        </div>

        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readOnly]="readonly"
          [(ngModel)]="value"
          (blur)="onTouched()"
          (input)="onInputChange($event)"
          [class]="computedInputClass"
        />

        <div class="flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
          <ng-content select="[suffix]"></ng-content>
        </div>
      </div>

      <ng-container *ngIf="!disabled">
        <p *ngIf="hint && !error" class="text-xs text-muted-foreground px-1">
          {{ hint }}
        </p>
        <p *ngIf="error && errorMessage" class="text-xs text-destructive px-1">
          {{ errorMessage }}
        </p>
      </ng-container>
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() id: string = `input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  @Input() containerClass: string = '';
  @Input() class: string = '';

  // New States
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() error: boolean = false;

  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  writeValue(value: any): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onInputChange(event: Event): void {
    if (this.readonly || this.disabled) return;
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  protected readonly cn = cn;

  get computedContainerClass() {
    return cn(
      "group relative flex items-center w-full rounded-md border transition-all shadow-sm",
      "bg-background ring-offset-background",

      // Sizing
      this.size === 'xs' && "h-8 px-2 gap-1.5",
      this.size === 'sm' && "h-9 px-3 gap-2",
      this.size === 'default' && "h-10 px-3 gap-2",
      this.size === 'lg' && "h-11 px-4 gap-3",

      // Interaction States (Focus ring disabled for Readonly/Disabled)
      !(this.readonly || this.disabled) && "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",

      // Colors & Borders
      this.error ? "border-destructive focus-within:ring-destructive" : "border-input",

      // Disabled vs Readonly styling
      this.disabled && "cursor-not-allowed opacity-50 bg-muted/30",
      this.readonly && "cursor-default bg-muted/10 border-dashed focus-within:ring-0",

      this.containerClass
    );
  }

  get computedInputClass() {
    return cn(
      "flex-1 bg-transparent border-none p-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0",
      this.size === 'xs' && "text-xs",
      this.size === 'lg' && "text-base",
      this.disabled && "cursor-not-allowed",
      this.readonly && "cursor-default",
      this.class
    );
  }
}
