import {
  Component, Input, forwardRef, ElementRef, ViewChild,
  AfterContentChecked, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-masked-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskedInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      <label
        *ngIf="label"
        [for]="id"
        [class]="computedLabelClass"
      >
        {{ label }}
      </label>

      <div
        [class]="computedContainerClass"
        (click)="focusInput()"
      >
        <!-- Prefix Icon -->
        <div class="h-full flex items-center text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
          <ng-content select="[prefix]"></ng-content>
        </div>

        <input
          #inputEl
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readOnly]="readonly"
          [value]="displayValue"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [class]="computedInputClass"
          [attr.aria-invalid]="error"
          [attr.aria-describedby]="error && errorMessage ? id + '-error' : null"
        />

        <!-- Suffix Icon -->
        <div class="h-full flex items-center text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
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
export class MaskedInputComponent implements ControlValueAccessor, AfterContentChecked {
  @Input() id: string = `masked-input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() mask: string = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() class = '';
  @Input() containerClass: string = '';
  @Input() error: boolean = false;
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  @Input() returnRaw = false;
  @Input() hideHintOnFocus: boolean = true;

  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>;

  hasPrefix = false;
  hasSuffix = false;
  displayValue = '';
  isFocused: boolean = false;

  private tokens: { [key: string]: RegExp } = {
    '0': /\d/, '9': /\d/, 'a': /[a-z]/i, 'A': /[a-z]/i, '*': /[a-z0-9]/i
  };

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) { }

  ngAfterContentChecked() {
    const prefix = this.el.nativeElement.querySelector('[prefix]');
    const suffix = this.el.nativeElement.querySelector('[suffix]');

    if (this.hasPrefix !== !!prefix || this.hasSuffix !== !!suffix) {
      this.hasPrefix = !!prefix;
      this.hasSuffix = !!suffix;
      this.cdr.detectChanges();
    }
  }

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

      // Focus state - SIMPLE LIKE ZARDUI
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

  focusInput(): void {
    if (!this.disabled && this.inputEl) {
      this.inputEl.nativeElement.focus();
    }
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  // --- Masking Logic ---
  onInput(event: Event) {
    if (this.readonly || this.disabled) return;
    const input = event.target as HTMLInputElement;
    const raw = this.unmask(input.value);
    const masked = this.applyMask(raw);
    this.displayValue = masked;
    input.value = masked;
    this.returnRaw ? this.onChange(raw) : this.onChange(masked);
  }

  private applyMask(rawValue: string): string {
    let rawIndex = 0;
    let formatted = '';
    for (let i = 0; i < this.mask.length; i++) {
      if (rawIndex >= rawValue.length) break;
      const maskChar = this.mask[i];
      const rawChar = rawValue[rawIndex];
      if (this.tokens[maskChar]) {
        if (this.tokens[maskChar].test(rawChar)) {
          formatted += rawChar;
          rawIndex++;
        } else {
          rawIndex++;
          i--;
        }
      } else {
        formatted += maskChar;
        if (rawChar === maskChar) rawIndex++;
      }
    }
    return formatted;
  }

  private unmask(val: string): string {
    return val.replace(/[^a-zA-Z0-9]/g, '');
  }

  writeValue(value: any): void {
    this.displayValue = value ? this.applyMask(this.unmask(value.toString())) : '';
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

  protected cn = cn;
}
