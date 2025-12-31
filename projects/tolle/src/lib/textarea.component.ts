import { Component, Input, forwardRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-textarea',
  standalone: true,
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
      <label *ngIf="label" [for]="id"
             [class.opacity-50]="disabled"
             class="text-sm font-medium text-foreground leading-none transition-opacity">
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
          (blur)="onTouched()"
          [class]="textareaClasses"
          [style.resize]="(autoGrow || readonly || disabled) ? 'none' : 'vertical'"
          [style.overflow]="autoGrow ? 'hidden' : 'auto'"
        ></textarea>
      </div>

      <div *ngIf="(showCharacterCount || hint) && !disabled" class="flex justify-between items-center px-1">
        <p *ngIf="hint" class="text-xs text-muted-foreground">{{ hint }}</p>
        <p *ngIf="showCharacterCount" class="text-[10px] uppercase tracking-wider text-muted-foreground ml-auto font-medium">
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
  @Input() rows = 3;
  @Input() maxLength?: number;
  @Input() showCharacterCount = false;
  @Input() autoGrow = false;
  @Input() error = false;
  @Input() className = '';

  // New States
  @Input() disabled = false;
  @Input() readonly = false;

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  ngAfterViewInit() {
    if (this.autoGrow) this.resize();
  }

  get textareaClasses() {
    return cn(
      'flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200 shadow-sm',
      'placeholder:text-muted-foreground focus-visible:outline-none',

      // Focus States (Disabled only when readonly or disabled is true)
      !(this.readonly || this.disabled) && 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',

      // Border colors
      this.error ? 'border-destructive' : 'border-input',

      // Disabled vs Readonly styles
      this.disabled && 'cursor-not-allowed opacity-50',
      this.readonly && 'cursor-default border-dashed focus-visible:ring-0',

      'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
      'min-h-[80px]',
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

  private resize() {
    const textarea = this.textareaElement.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.autoGrow) setTimeout(() => this.resize());
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
}
