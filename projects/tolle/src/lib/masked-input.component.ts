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
    <div [class]="cn('relative flex items-center w-full group', 'size-' + size, class)">

      <div class="absolute left-3 flex items-center justify-center text-muted-foreground group-focus-within:text-primary transition-colors"
           [class.left-2.5]="size === 'xs'">
        <ng-content select="[prefix]"></ng-content>
      </div>

      <input
        #inputEl
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="displayValue"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [class]="computedInputClass"
      />

      <div class="absolute right-3 flex items-center justify-center text-muted-foreground group-focus-within:text-primary transition-colors"
           [class.right-2.5]="size === 'xs'">
        <ng-content select="[suffix]"></ng-content>
      </div>
    </div>
  `
})
export class MaskedInputComponent implements ControlValueAccessor, AfterContentChecked {
  @Input() mask: string = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() disabled = false;
  @Input() class = '';
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

  // FIXED DETECTION: Check the actual DOM nodes projected into the component
  ngAfterContentChecked() {
    const prefix = this.el.nativeElement.querySelector('[prefix]');
    const suffix = this.el.nativeElement.querySelector('[suffix]');

    if (this.hasPrefix !== !!prefix || this.hasSuffix !== !!suffix) {
      this.hasPrefix = !!prefix;
      this.hasSuffix = !!suffix;
      this.cdr.detectChanges();
    }
  }

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

  // --- Masking Logic ---
  onInput(event: Event) {
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
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
  protected cn = cn;
}
