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
        [class.opacity-50]="disabled"
        class="text-sm font-medium text-foreground leading-none transition-opacity"
      >
        {{ label }}
      </label>

      <div [class]="computedContainerClass">
        <!-- Prefix Icon -->
        <div class="flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
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
          (blur)="onTouched()"
          [class]="computedInputClass"
        />

        <!-- Suffix Icon -->
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

  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>;

  hasPrefix = false;
  hasSuffix = false;
  displayValue = '';

  private tokens: { [key: string]: RegExp } = {
    '0': /\d/, '9': /\d/, 'a': /[a-z]/i, 'A': /[a-z]/i, '*': /[a-z0-9]/i
  };

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterContentChecked() {
    const prefix = this.el.nativeElement.querySelector('[prefix]');
    const suffix = this.el.nativeElement.querySelector('[suffix]');

    if (this.hasPrefix !== !!prefix || this.hasSuffix !== !!suffix) {
      this.hasPrefix = !!prefix;
      this.hasSuffix = !!suffix;
      this.cdr.detectChanges();
    }
  }

  get computedContainerClass() {
    return cn(
      "group relative flex items-center w-full rounded-md border transition-all shadow-sm",
      "bg-background ring-offset-background",

      // Sizing
      this.size === 'xs' && "h-8 px-2 gap-1.5",
      this.size === 'sm' && "h-9 px-3 gap-2",
      this.size === 'default' && "h-10 px-3 gap-2",
      this.size === 'lg' && "h-11 px-4 gap-3",

      // Interaction States (Inherited from Input focus style)
      !(this.readonly || this.disabled) && "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",

      // Colors & Borders
      this.error ? "border-destructive focus-within:ring-destructive" : "border-input",

      // Disabled vs Readonly styling
      this.disabled && "cursor-not-allowed opacity-50",
      this.readonly && "cursor-default border-dashed focus-within:ring-0",

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
    let rawIndex = 0; let formatted = '';
    for (let i = 0; i < this.mask.length; i++) {
      if (rawIndex >= rawValue.length) break;
      const maskChar = this.mask[i];
      const rawChar = rawValue[rawIndex];
      if (this.tokens[maskChar]) {
        if (this.tokens[maskChar].test(rawChar)) { formatted += rawChar; rawIndex++; }
        else { rawIndex++; i--; }
      } else { formatted += maskChar; if (rawChar === maskChar) rawIndex++; }
    }
    return formatted;
  }

  private unmask(val: string): string { return val.replace(/[^a-zA-Z0-9]/g, ''); }

  writeValue(value: any): void {
    this.displayValue = value ? this.applyMask(this.unmask(value.toString())) : '';
    this.cdr.markForCheck();
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
  protected cn = cn;
}
