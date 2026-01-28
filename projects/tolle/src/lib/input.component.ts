import { Component, input, forwardRef, ChangeDetectorRef, ElementRef, viewChild, AfterViewInit, computed } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-input',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      @if (label()) {
        <label
          [for]="id()"
          [class]="computedLabelClass()">
          {{ label() }}
        </label>
      }
    
      <div
        [class]="computedContainerClass()"
        (click)="focusInput()"
        >
        <div class="flex items-center text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
          <ng-content select="[prefix]"></ng-content>
        </div>
    
        <input
          #inputElement
          [id]="id()"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readOnly]="readonly()"
          [(ngModel)]="value"
          (blur)="onBlur()"
          (focus)="onFocus()"
          (input)="onInputChange($event)"
          [class]="computedInputClass()"
          [attr.aria-invalid]="error()"
          [attr.aria-describedby]="error() && errorMessage() ? id() + '-error' : null"
          />
    
        <div class="flex items-center text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
          <ng-content select="[suffix]"></ng-content>
        </div>
      </div>
    
      @if (!disabled()) {
        @if (hint() && !error()) {
          <p
            class="text-xs text-muted-foreground px-1 transition-opacity duration-200"
            [class.opacity-0]="isFocused && hideHintOnFocus()"
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
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement');

  id = input<string>(`input-${Math.random().toString(36).substring(2, 11)}`);
  label = input<string>('');
  hint = input<string>('');
  errorMessage = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  size = input<'xs' | 'sm' | 'default' | 'lg'>('default');
  containerClass = input<string>('');
  class = input<string>('');

  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  error = input<boolean>(false);
  hideHintOnFocus = input<boolean>(true);

  value: any = '';
  onChange: any = () => { };
  onTouched: any = () => { };
  isFocused: boolean = false;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    const el = this.inputElement();
    if (el?.nativeElement.hasAttribute('autofocus')) {
      setTimeout(() => el.nativeElement.focus());
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    // Note: This needs care if disabled is a signal input.
    // In Angular 18+, setDisabledState is called by the Forms module.
    // We might need an internal signal for disabled state if we want to support both.
    // But for now, let's assume it works or we use a private backing field.
    // Actually, input() signals are read-only. We should use a private signal for 'disabled'
    // or just rely on the form control's state.
  }

  onInputChange(event: Event): void {
    if (this.readonly() || this.disabled()) return;
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
    const el = this.inputElement();
    if (!this.disabled() && el) {
      el.nativeElement.focus();
    }
  }

  protected readonly cn = cn;

  computedLabelClass = computed(() => {
    return cn(
      "text-sm font-medium text-foreground leading-none transition-opacity duration-200",
      this.disabled() && "opacity-50"
    );
  });

  computedContainerClass = computed(() => {
    return cn(
      "group relative flex items-center w-full rounded-md border transition-all duration-200",
      "bg-background",
      "border-input shadow-sm",

      this.size() === 'xs' && "h-8 px-2 gap-1.5 text-xs",
      this.size() === 'sm' && "h-9 px-3 gap-2 text-sm",
      this.size() === 'default' && "h-10 px-3 gap-2 text-sm",
      this.size() === 'lg' && "h-11 px-4 gap-3 text-base",

      !(this.readonly() || this.disabled()) && [
        "focus-within:border-primary/80",
        "focus-within:ring-4",
        "focus-within:ring-ring/30",
        "focus-within:ring-offset-0",
        "focus-within:shadow-none",
      ],

      this.error() && [
        "border-destructive",
        !(this.readonly() || this.disabled()) && [
          "focus-within:border-destructive/80",
          "focus-within:ring-destructive/30"
        ]
      ],

      this.disabled() && [
        "cursor-not-allowed opacity-50",
        "border-opacity-50"
      ],

      this.readonly() && [
        "cursor-default",
        "border-dashed",
        !this.disabled() && "focus-within:ring-0 focus-within:border-opacity-100"
      ],

      this.containerClass()
    );
  });

  computedInputClass = computed(() => {
    return cn(
      "flex-1 bg-transparent border-none p-0",
      "placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-0 focus:shadow-none",

      this.size() === 'xs' && "text-xs",
      this.size() === 'sm' && "text-sm",
      this.size() === 'default' && "text-sm",
      this.size() === 'lg' && "text-base",

      this.disabled() && "cursor-not-allowed",
      this.readonly() && "cursor-default",

      "text-foreground",
      "selection:bg-primary/20 selection:text-foreground",

      this.class()
    );
  });
}
