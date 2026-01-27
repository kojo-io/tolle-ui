import { Component, Input, forwardRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-textarea',
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextareaComponent),
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

      <div class="relative">
        <textarea
          #textareaElement
          [id]="id"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readOnly]="readonly"
          [rows]="rows"
          [(ngModel)]="value"
          (input)="handleInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [class]="textareaClasses"
          [style.resize]="(autoGrow || readonly || disabled) ? 'none' : 'vertical'"
          [style.overflow]="autoGrow ? 'hidden' : 'auto'"
          [attr.aria-invalid]="error"
          [attr.aria-describedby]="error && errorMessage ? id + '-error' : null"
          [attr.maxlength]="maxLength"
        ></textarea>
      </div>

      <div *ngIf="(showCharacterCount || hint || errorMessage) && !disabled" class="flex justify-between items-center px-1">
        <p
          *ngIf="hint && !error"
          class="text-xs text-muted-foreground transition-opacity duration-200"
          [class.opacity-0]="isFocused && hideHintOnFocus"
        >
          {{ hint }}
        </p>
        <p
          *ngIf="error && errorMessage"
          [id]="id + '-error'"
          class="text-xs text-destructive"
        >
          {{ errorMessage }}
        </p>
        <p
          *ngIf="showCharacterCount"
          class="text-[10px] uppercase tracking-wider text-muted-foreground ml-auto font-medium transition-opacity duration-200"
          [class.opacity-0]="isFocused && hideCharacterCountOnFocus"
        >
          {{ value.length || 0 }}{{ maxLength ? ' / ' + maxLength : '' }}
        </p>
      </div>
    </div>
  `
})
export class TextareaComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('textareaElement') textareaElement!: ElementRef<HTMLTextAreaElement>;

  @Input() id = `textarea-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() rows = 3;
  @Input() maxLength?: number;
  @Input() showCharacterCount = false;
  @Input() autoGrow = false;
  @Input() error = false;
  @Input() className = '';

  // Focus behavior
  @Input() hideHintOnFocus = true;
  @Input() hideCharacterCountOnFocus = false;

  // New States
  @Input() disabled = false;
  @Input() readonly = false;

  value: string = '';
  isFocused: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  ngAfterViewInit() {
    if (this.autoGrow) this.resize();
  }

  get computedLabelClass() {
    return cn(
      "text-sm font-medium text-foreground leading-none transition-opacity duration-200",
      this.disabled && "opacity-50"
    );
  }

  get textareaClasses() {
    return cn(
      // Base styles
      'flex w-full rounded-md border bg-background px-3 py-2 text-sm',
      'ring-offset-background transition-all duration-200',
      'placeholder:text-muted-foreground',

      // Border and shadow
      'border-input shadow-sm',

      // Minimum height
      'min-h-[80px]',

      // Focus state - SIMPLE LIKE ZARDUI
      !(this.readonly || this.disabled) && [
        'focus:outline-none',
        'focus:ring-4',
        'focus:ring-ring/30',
        'focus:ring-offset-0',
        'focus:shadow-none',
        // Border darkens on focus automatically
        'focus:border-primary/80'
      ],

      // Error state
      this.error && [
        'border-destructive',
        !(this.readonly || this.disabled) && [
          'focus:border-destructive/80',
          'focus:ring-destructive/30'
        ]
      ],

      // Disabled state
      this.disabled && [
        'cursor-not-allowed opacity-50',
        'border-opacity-50'
      ],

      // Readonly state
      this.readonly && [
        'cursor-default',
        'border-dashed',
        !this.disabled && 'focus:ring-0 focus:border-opacity-100'
      ],

      // Scrollbar styling
      'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',

      this.className
    );
  }

  handleInput(event: any) {
    if (this.readonly || this.disabled) return;
    const val = event.target.value;
    this.value = val;
    this.onChange(val);
    if (this.autoGrow) this.resize();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  private resize() {
    const textarea = this.textareaElement.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.autoGrow) setTimeout(() => this.resize());
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
