import {
  Component, input, forwardRef, ElementRef, viewChild,
  AfterContentChecked, ChangeDetectorRef, signal, computed, inject
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-masked-input',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskedInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      @if (label()) {
        <label
          [for]="id()"
          [class]="computedLabelClass()"
        >
          {{ label() }}
        </label>
      }
    
      <div
        [class]="computedContainerClass()"
        (click)="focusInput()"
      >
        <!-- Prefix Icon -->
        <div class="flex items-center text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
          <ng-content select="[prefix]"></ng-content>
        </div>
    
        <input
          #inputEl
          [id]="id()"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readOnly]="readonly()"
          [value]="displayValue()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [class]="computedInputClass()"
          [attr.aria-invalid]="error()"
          [attr.aria-describedby]="error() && errorMessage() ? id() + '-error' : null"
        />
    
        <!-- Suffix Icon -->
        <div class="flex items-center text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
          <ng-content select="[suffix]"></ng-content>
        </div>
      </div>
    
      @if (!disabled()) {
        @if (hint() && !error()) {
          <p
            class="text-xs text-muted-foreground px-1 transition-opacity duration-200"
            [class.opacity-0]="isFocused() && hideHintOnFocus()"
          >
            {{ hint() }}
          </p>
        }
        @if (error() && errorMessage()) {
          <p
            [id]="id() + '-error'"
            class="text-xs text-destructive px-1"
          >
            {{ errorMessage() }}
          </p>
        }
      }
    </div>
  `
})
export class MaskedInputComponent implements ControlValueAccessor, AfterContentChecked {
  id = input<string>(`masked-input-${Math.random().toString(36).substr(2, 9)}`);
  label = input<string>('');
  hint = input<string>('');
  errorMessage = input<string>('');
  mask = input<string>('');
  placeholder = input('');
  type = input('text');
  disabled = input(false);
  readonly = input(false);
  className = input('', { alias: 'class' });
  containerClass = input<string>('');
  error = input<boolean>(false);
  size = input<'xs' | 'sm' | 'default' | 'lg'>('default');
  returnRaw = input(false);
  hideHintOnFocus = input<boolean>(true);

  inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  hasPrefix = signal(false);
  hasSuffix = signal(false);
  displayValue = signal('');
  isFocused = signal(false);

  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  private tokens: { [key: string]: RegExp } = {
    '0': /\d/, '9': /\d/, 'a': /[a-z]/i, 'A': /[a-z]/i, '*': /[a-z0-9]/i
  };

  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  ngAfterContentChecked() {
    const prefix = this.el.nativeElement.querySelector('[prefix]');
    const suffix = this.el.nativeElement.querySelector('[suffix]');

    if (this.hasPrefix() !== !!prefix || this.hasSuffix() !== !!suffix) {
      this.hasPrefix.set(!!prefix);
      this.hasSuffix.set(!!suffix);
      this.cdr.detectChanges();
    }
  }

  computedLabelClass = computed(() => {
    return cn(
      "text-sm font-medium text-foreground leading-none transition-opacity duration-200",
      this.disabled() && "opacity-50"
    );
  });

  computedContainerClass = computed(() => {
    const size = this.size();
    const readonly = this.readonly();
    const disabled = this.disabled();
    const error = this.error();

    return cn(
      "group relative flex items-center w-full rounded-md border transition-all duration-200",
      "bg-background",
      "border-input shadow-sm",

      size === 'xs' && "h-8 px-2 gap-1.5 text-xs",
      size === 'sm' && "h-9 px-3 gap-2 text-sm",
      size === 'default' && "h-10 px-3 gap-2 text-sm",
      size === 'lg' && "h-11 px-4 gap-3 text-base",

      !(readonly || disabled) && [
        "focus-within:border-primary/80",
        "focus-within:ring-4",
        "focus-within:ring-ring/30",
        "focus-within:ring-offset-0",
        "focus-within:shadow-none",
      ],

      error && [
        "border-destructive",
        !(readonly || disabled) && [
          "focus-within:border-destructive/80",
          "focus-within:ring-destructive/30"
        ]
      ],

      disabled && [
        "cursor-not-allowed opacity-50",
        "border-opacity-50"
      ],

      readonly && [
        "cursor-default",
        "border-dashed",
        !disabled && "focus-within:ring-0 focus-within:border-opacity-100"
      ],

      this.containerClass()
    );
  });

  computedInputClass = computed(() => {
    const size = this.size();
    const disabled = this.disabled();
    const readonly = this.readonly();

    return cn(
      "flex-1 bg-transparent border-none p-0",
      "placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-0 focus:shadow-none",

      size === 'xs' && "text-xs",
      size === 'sm' && "text-sm",
      size === 'default' && "text-sm",
      size === 'lg' && "text-base",

      disabled && "cursor-not-allowed",
      readonly && "cursor-default",
      "text-foreground",
      "selection:bg-primary/20 selection:text-foreground",

      this.className()
    );
  });

  focusInput(): void {
    if (!this.disabled()) {
      this.inputEl()?.nativeElement.focus();
    }
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }

  onInput(event: Event) {
    if (this.readonly() || this.disabled()) return;
    const input = event.target as HTMLInputElement;
    const raw = this.unmask(input.value);
    const masked = this.applyMask(raw);
    this.displayValue.set(masked);
    input.value = masked;
    this.returnRaw() ? this.onChange(raw) : this.onChange(masked);
  }

  private applyMask(rawValue: string): string {
    const mask = this.mask();
    if (!mask) return rawValue;

    let rawIndex = 0;
    let formatted = '';
    for (let i = 0; i < mask.length; i++) {
      if (rawIndex >= rawValue.length) break;
      const maskChar = mask[i];
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
    this.displayValue.set(value ? this.applyMask(this.unmask(value.toString())) : '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // disabled is an input
  }

  protected cn = cn;
}
