import { Component, Input, forwardRef, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';
import { BadgeComponent } from './badge.component';

@Component({
  selector: 'tolle-tag-input',
  styles: [':host { display: block; }'],
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
        (click)="focusInput()"
      >
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
          [readOnly]="readonly || (maxTags != null && tags.length >= maxTags)"
          [(ngModel)]="inputValue"
          (keydown)="onKeydown($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [class]="computedInputClass"
        />
      </div>

      <ng-container *ngIf="!disabled">
        <p
          *ngIf="hint && !error"
          class="text-xs text-muted-foreground px-1 transition-opacity duration-200"
        >
          {{ hint }}
        </p>
        <p
          *ngIf="error && errorMessage"
          class="text-xs text-destructive px-1"
        >
          {{ errorMessage }}
        </p>
      </ng-container>
    </div>
  `,
})
export class TagInputComponent implements ControlValueAccessor {
  @ViewChild('tagInput') tagInputElement!: ElementRef<HTMLInputElement>;

  @Input() id: string = `tag-input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() placeholder: string = 'Type and press Enter...';
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  @Input() class: string = '';

  // State inputs
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() error: boolean = false;

  // Tag-specific inputs
  @Input() delimiter: string = ',';
  @Input() maxTags: number | null = null;
  @Input() allowDuplicates: boolean = false;
  @Input() tagPrefix: string = '';
  @Input() tagSuffix: string = '';

  tags: string[] = [];
  inputValue: string = '';
  isFocused: boolean = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private cdr: ChangeDetectorRef) { }

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

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled || this.readonly) return;

    const key = event.key;

    // Enter creates a tag
    if (key === 'Enter') {
      event.preventDefault();
      this.commitInput();
      return;
    }

    // Delimiter creates a tag (strip the delimiter)
    if (key === this.delimiter) {
      event.preventDefault();
      this.commitInput();
      return;
    }

    // Backspace on empty input removes the last tag
    if (key === 'Backspace' && this.inputValue === '') {
      if (this.tags.length > 0) {
        this.removeTag(this.tags.length - 1);
      }
      return;
    }
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.commitInput();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  removeTag(index: number, event?: MouseEvent): void {
    if (this.disabled || this.readonly) return;
    if (event) {
      event.stopPropagation();
    }
    this.tags.splice(index, 1);
    this.emitChange();
    this.focusInput();
  }

  focusInput(): void {
    if (!this.disabled && this.tagInputElement) {
      this.tagInputElement.nativeElement.focus();
    }
  }

  private commitInput(): void {
    const value = this.inputValue.trim();
    if (value === '') {
      return;
    }

    // Check max tags
    if (this.maxTags != null && this.tags.length >= this.maxTags) {
      this.inputValue = '';
      return;
    }

    // Check duplicates (case-insensitive)
    if (!this.allowDuplicates) {
      const exists = this.tags.some(
        t => t.toLowerCase() === value.toLowerCase()
      );
      if (exists) {
        this.inputValue = '';
        return;
      }
    }

    this.tags.push(value);
    this.inputValue = '';
    this.emitChange();
  }

  private emitChange(): void {
    this.onChange([...this.tags]);
    this.cdr.markForCheck();
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
      // Base styles — flex-wrap so tags flow onto multiple lines
      "group relative flex flex-wrap items-center w-full rounded-md border transition-all duration-200",
      "bg-background",

      // Border and shadow
      "border-input shadow-sm",

      // Sizing — min-h instead of fixed h so tags can wrap
      this.size === 'xs' && "min-h-8 px-2 py-1 gap-1 text-xs",
      this.size === 'sm' && "min-h-9 px-3 py-1 gap-1.5 text-sm",
      this.size === 'default' && "min-h-10 px-3 py-1.5 gap-2 text-sm",
      this.size === 'lg' && "min-h-11 px-4 py-2 gap-3 text-base",

      // Focus state
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

      this.class
    );
  }

  get computedInputClass() {
    return cn(
      // Base styles — inline within the flex-wrap container
      "flex-1 bg-transparent border-none p-0 min-w-[80px]",
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
      "selection:bg-primary/20 selection:text-foreground"
      // NOTE: consumer `class` is applied to the container only (computedContainerClass),
      // not duplicated onto the inner <input>.
    );
  }
}
