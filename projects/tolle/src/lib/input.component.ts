import { Component, Input, forwardRef, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-input',
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
        [class]="computedLabelClass">
        {{ label }}
      </label>

      <div
        [class]="computedContainerClass"
        (click)="focusInput()"
      >
        <div class="flex items-center text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
          <ng-content select="[prefix]"></ng-content>
        </div>

        <input
          #inputElement
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readOnly]="readonly"
          [(ngModel)]="value"
          (blur)="onBlur()"
          (focus)="onFocus()"
          (input)="onInputChange($event)"
          [class]="computedInputClass"
          [attr.aria-invalid]="error"
          [attr.aria-describedby]="error && errorMessage ? id + '-error' : null"
        />

        <div class="flex items-center text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
          <ng-content select="[suffix]"></ng-content>
        </div>
      </div>

      <ng-container *ngIf="!disabled">
        <p
          *ngIf="hint && !error"
          class="text-xs text-muted-foreground px-1 transition-opacity duration-200"
          [class.opacity-0]="isFocused && hideHintOnFocus"
        >
          {{ hint }}
        </p>
        <p
          *ngIf="error && errorMessage"
          [id]="id + '-error'"
          class="text-xs text-destructive px-1"
        >
          {{ errorMessage }}
        </p>
      </ng-container>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

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

  // Focus behavior
  @Input() hideHintOnFocus: boolean = true;

  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};
  isFocused: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.inputElement?.nativeElement.hasAttribute('autofocus')) {
      setTimeout(() => this.inputElement.nativeElement.focus());
    }
  }

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

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  focusInput(): void {
    if (!this.disabled && this.inputElement) {
      this.inputElement.nativeElement.focus();
    }
  }

  protected readonly cn = cn;

  get computedLabelClass() {
    return cn(
      "text-sm font-medium text-foreground leading-none transition-opacity duration-200",
      this.disabled && "opacity-50"
    );
  }

  get computedContainerClass() {
    return cn(
      // Base styles
      "group relative flex items-center w-full rounded-md border transition-all duration-200",
      "bg-background",

      // Border and shadow
      "border-input shadow-sm",

      // Sizing
      this.size === 'xs' && "h-8 px-2 gap-1.5 text-xs",
      this.size === 'sm' && "h-9 px-3 gap-2 text-sm",
      this.size === 'default' && "h-10 px-3 gap-2 text-sm",
      this.size === 'lg' && "h-11 px-4 gap-3 text-base",

      // Focus state - SIMPLE AND ELEGANT LIKE ZARDUI
      // The magic happens in CSS: border darkens automatically on focus
      !(this.readonly || this.disabled) && [
        "focus-within:border-primary/80",
        "focus-within:ring-4",
        "focus-within:ring-ring/30",
        "focus-within:ring-offset-0",
        "focus-within:shadow-none",
      ],

      // Error state
      this.error && [
        "border-destructive",
        !(this.readonly || this.disabled) && [
          "focus-within:border-destructive/80",
          "focus-within:ring-destructive/30"
        ]
      ],

      // Disabled state
      this.disabled && [
        "cursor-not-allowed opacity-50",
        "border-opacity-50"
      ],

      // Readonly state
      this.readonly && [
        "cursor-default",
        "border-dashed",
        !this.disabled && "focus-within:ring-0 focus-within:border-opacity-100"
      ],

      this.containerClass
    );
  }

  get computedInputClass() {
    return cn(
      // Base styles
      "flex-1 bg-transparent border-none p-0",
      "placeholder:text-muted-foreground",

      // Remove all default focus styles
      "focus:outline-none focus:ring-0 focus:shadow-none",

      // Text sizing
      this.size === 'xs' && "text-xs",
      this.size === 'sm' && "text-sm",
      this.size === 'default' && "text-sm",
      this.size === 'lg' && "text-base",

      // Cursor states
      this.disabled && "cursor-not-allowed",
      this.readonly && "cursor-default",

      // Text color
      "text-foreground",

      // Selection color
      "selection:bg-primary/20 selection:text-foreground",

      this.class
    );
  }
}
