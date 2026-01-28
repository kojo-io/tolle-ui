import { Component, input, forwardRef, viewChild, ElementRef, AfterViewInit, signal, computed, inject, ChangeDetectorRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-textarea',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
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
    
      <div class="relative">
        <textarea
          #textareaElement
          [id]="id()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readOnly]="readonly()"
          [rows]="rows()"
          [ngModel]="value()"
          (ngModelChange)="handleModelChange($event)"
          (input)="handleInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [class]="textareaClasses()"
          [style.resize]="(autoGrow() || readonly() || disabled()) ? 'none' : 'vertical'"
          [style.overflow]="autoGrow() ? 'hidden' : 'auto'"
          [attr.aria-invalid]="error()"
          [attr.aria-describedby]="error() && errorMessage() ? id() + '-error' : null"
          [attr.maxlength]="maxLength()"
        ></textarea>
      </div>
    
      @if ((showCharacterCount() || hint() || errorMessage()) && !disabled()) {
        <div class="flex justify-between items-center px-1">
          @if (hint() && !error()) {
            <p
              class="text-xs text-muted-foreground transition-opacity duration-200"
              [class.opacity-0]="isFocused() && hideHintOnFocus()"
              >
              {{ hint() }}
            </p>
          }
          @if (error() && errorMessage()) {
            <p
              [id]="id() + '-error'"
              class="text-xs text-destructive"
              >
              {{ errorMessage() }}
            </p>
          }
          @if (showCharacterCount()) {
            <p
              class="text-[10px] uppercase tracking-wider text-muted-foreground ml-auto font-medium transition-opacity duration-200"
              [class.opacity-0]="isFocused() && hideCharacterCountOnFocus()"
              >
              {{ value().length || 0 }}{{ maxLength() ? ' / ' + maxLength() : '' }}
            </p>
          }
        </div>
      }
    </div>
  `
})
export class TextareaComponent implements ControlValueAccessor, AfterViewInit {
  textareaEl = viewChild<ElementRef<HTMLTextAreaElement>>('textareaElement');

  id = input(`textarea-${Math.random().toString(36).substr(2, 9)}`);
  label = input('');
  placeholder = input('');
  hint = input('');
  errorMessage = input('');
  rows = input(3);
  maxLength = input<number | undefined>(undefined);
  showCharacterCount = input(false);
  autoGrow = input(false);
  error = input(false);
  className = input('', { alias: 'class' });

  // Focus behavior
  hideHintOnFocus = input(true);
  hideCharacterCountOnFocus = input(false);

  // New States
  disabled = input(false);
  readonly = input(false);

  value = signal<string>('');
  isFocused = signal(false);

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };
  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit() {
    if (this.autoGrow()) this.resize();
  }

  computedLabelClass = computed(() => {
    return cn(
      "text-sm font-medium text-foreground leading-none transition-opacity duration-200",
      this.disabled() && "opacity-50"
    );
  });

  textareaClasses = computed(() => {
    const error = this.error();
    const readonly = this.readonly();
    const disabled = this.disabled();

    return cn(
      // Base styles
      'flex w-full rounded-md border bg-background px-3 py-2 text-sm',
      'ring-offset-background transition-all duration-200',
      'placeholder:text-muted-foreground',

      // Border and shadow
      'border-input shadow-sm',

      // Minimum height
      'min-h-[80px]',

      // Focus state
      !(readonly || disabled) && [
        'focus:outline-none',
        'focus:ring-4',
        'focus:ring-ring/30',
        'focus:ring-offset-0',
        'focus:shadow-none',
        // Border darkens on focus automatically
        'focus:border-primary/80'
      ],

      // Error state
      error && [
        'border-destructive',
        !(readonly || disabled) && [
          'focus:border-destructive/80',
          'focus:ring-destructive/30'
        ]
      ],

      // Disabled state
      disabled && [
        'cursor-not-allowed opacity-50',
        'border-opacity-50'
      ],

      // Readonly state
      readonly && [
        'cursor-default',
        'border-dashed',
        !disabled && 'focus:ring-0 focus:border-opacity-100'
      ],

      // Scrollbar styling
      'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',

      this.className()
    );
  });

  handleModelChange(val: string) {
    if (this.readonly() || this.disabled()) return;
    this.value.set(val);
    this.onChange(val);
    if (this.autoGrow()) this.resize();
  }

  handleInput(event: Event) {
    if (this.readonly() || this.disabled()) return;
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
    if (this.autoGrow()) this.resize();
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }

  private resize() {
    const textarea = this.textareaEl()?.nativeElement;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  writeValue(value: string): void {
    this.value.set(value || '');
    if (this.autoGrow()) setTimeout(() => this.resize());
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Similarly to SwitchComponent, disabled is an input.
    // However, we handle it in the template and classes.
  }
}
