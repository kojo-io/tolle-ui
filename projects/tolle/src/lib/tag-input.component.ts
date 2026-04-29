import { Component, Input, forwardRef, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';
import { BadgeComponent } from './badge.component';

@Component({
  selector: 'tolle-tag-input',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
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
        (click)="focusInput()">

        <tolle-badge
          *ngFor="let tag of tags; let i = index"
          size="xs"
          variant="secondary"
          [removable]="!disabled && !readonly"
          (onRemove)="removeTag(i, $event)">
          {{ tagPrefix }}{{ tag }}{{ tagSuffix }}
        </tolle-badge>

        <input
          #tagInput
          [id]="id"
          type="text"
          [placeholder]="tags.length === 0 ? placeholder : ''"
          [disabled]="disabled"
          [readOnly]="readonly || isMaxTagsReached"
          [(ngModel)]="inputValue"
          (keydown)="onKeydown($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [class]="computedInputClass"
          [attr.aria-invalid]="error"
          [attr.aria-describedby]="error && errorMessage ? id + '-error' : null"
        />
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
  `,
})
export class TagInputComponent implements ControlValueAccessor {
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  @Input() id: string = `tag-input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() placeholder: string = 'Type and press Enter...';
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  @Input() class: string = '';
  @Input() containerClass: string = '';

  // New states
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() error: boolean = false;

  // Tag-specific inputs
  @Input() delimiter: string = ',';
  @Input() maxTags?: number;
  @Input() allowDuplicates: boolean = false;
  @Input() tagPrefix: string = '';
  @Input() tagSuffix: string = '';

  // Focus behavior
  @Input() hideHintOnFocus: boolean = true;

  tags: string[] = [];
  inputValue: string = '';
  isFocused: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get isMaxTagsReached(): boolean {
    return this.maxTags !== undefined && this.tags.length >= this.maxTags;
  }

  writeValue(values: string[]): void {
    this.tags = Array.isArray(values) ? [...values] : [];
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.commitInput();
  }

  focusInput(): void {
    if (!this.disabled && this.tagInput) {
      this.tagInput.nativeElement.focus();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled || this.readonly) return;

    // Enter creates a tag
    if (event.key === 'Enter') {
      event.preventDefault();
      this.commitInput();
      return;
    }

    // Backspace on empty input removes last tag
    if (event.key === 'Backspace' && this.inputValue === '' && this.tags.length > 0) {
      event.preventDefault();
      this.removeTagAt(this.tags.length - 1);
      return;
    }

    // Delimiter creates a tag (but allow the character to be typed first, then split)
    if (this.delimiter && this.delimiter.length > 0 && event.key === this.delimiter) {
      event.preventDefault();
      this.commitInput();
      return;
    }
  }

  commitInput(): void {
    const raw = this.inputValue.trim();
    if (!raw) {
      this.inputValue = '';
      return;
    }

    if (this.isMaxTagsReached) {
      this.inputValue = '';
      return;
    }

    const tag = raw;

    if (!this.allowDuplicates) {
      const isDuplicate = this.tags.some(
        existing => existing.toLowerCase() === tag.toLowerCase()
      );
      if (isDuplicate) {
        this.inputValue = '';
        return;
      }
    }

    this.tags = [...this.tags, tag];
    this.inputValue = '';
    this.emitChange();
  }

  removeTag(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.removeTagAt(index);
  }

  removeTagAt(index: number): void {
    if (this.disabled || this.readonly) return;
    if (index < 0 || index >= this.tags.length) return;

    this.tags = this.tags.filter((_, i) => i !== index);
    this.emitChange();
    this.focusInput();
  }

  private emitChange(): void {
    this.onChange([...this.tags]);
  }

  protected readonly cn = cn;

  get computedLabelClass() {
    return cn(
      'text-sm font-medium text-foreground leading-none transition-opacity duration-200',
      this.disabled && 'opacity-50'
    );
  }

  get computedContainerClass() {
    return cn(
      // Base styles
      'group relative flex flex-wrap items-center w-full rounded-md border transition-all duration-200',
      'bg-background',
      'gap-1',

      // Border and shadow
      'border-input shadow-sm',

      // Sizing - min-height matches InputComponent heights, with auto height for wrapping
      this.size === 'xs' && 'min-h-8 px-2 py-1 text-xs',
      this.size === 'sm' && 'min-h-9 px-3 py-1.5 text-sm',
      this.size === 'default' && 'min-h-10 px-3 py-1.5 text-sm',
      this.size === 'lg' && 'min-h-11 px-4 py-2 text-base',

      // Focus state
      !(this.readonly || this.disabled) && [
        'focus-within:border-primary/80',
        'focus-within:ring-4',
        'focus-within:ring-ring/30',
        'focus-within:ring-offset-0',
        'focus-within:shadow-none',
      ],

      // Error state
      this.error && [
        'border-destructive',
        !(this.readonly || this.disabled) && [
          'focus-within:border-destructive/80',
          'focus-within:ring-destructive/30'
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
        !this.disabled && 'focus-within:ring-0 focus-within:border-opacity-100'
      ],

      this.containerClass
    );
  }

  get computedInputClass() {
    return cn(
      // Base styles
      'flex-1 bg-transparent border-none p-0',
      'placeholder:text-muted-foreground',

      // Remove all default focus styles
      'focus:outline-none focus:ring-0 focus:shadow-none',

      // Min width so input never collapses fully
      'min-w-[60px]',

      // Text sizing
      this.size === 'xs' && 'text-xs',
      this.size === 'sm' && 'text-sm',
      this.size === 'default' && 'text-sm',
      this.size === 'lg' && 'text-base',

      // Cursor states
      this.disabled && 'cursor-not-allowed',
      this.readonly && 'cursor-default',

      // Text color
      'text-foreground',

      // Selection color
      'selection:bg-primary/20 selection:text-foreground',

      this.class
    );
  }
}
