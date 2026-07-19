import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const inputGroupVariants = cva(
  'group/input-group relative flex w-full items-center rounded-md border border-input bg-background shadow-sm transition-colors ' +
    'focus-within:border-primary/80 focus-within:ring-4 focus-within:ring-ring/30 ' +
    'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
  {
    variants: {
      size: {
        xs: 'h-8 gap-1 px-1.5 text-xs',
        sm: 'h-9 gap-1.5 px-2 text-sm',
        default: 'h-10 gap-2 px-2 text-sm',
        lg: 'h-11 gap-2 px-3 text-base',
      },
      invalid: {
        true: 'border-destructive focus-within:border-destructive/80 focus-within:ring-destructive/30',
        false: '',
      },
      // `block-start` / `block-end` addons stack, so the group can no longer be a
      // fixed-height row.
      stacked: {
        true: 'h-auto flex-col items-stretch gap-0 px-0 py-0',
        false: '',
      },
    },
    defaultVariants: { size: 'default', invalid: false, stacked: false },
  }
);

export type InputGroupProps = VariantProps<typeof inputGroupVariants>;

/**
 * Wraps an input with leading/trailing addons — icons, text, buttons or a
 * spinner — inside a single bordered control that shows one shared focus ring.
 *
 * Put a `tolle-input-group-input` (or `tolle-input-group-textarea`) inside,
 * alongside any number of `tolle-input-group-addon` elements.
 * @new
 */
@Component({
  selector: 'tolle-input-group',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="computedClass"><ng-content></ng-content></div>`,
})
export class InputGroupComponent {
  /** Height and text size of the group; match it to the input inside. @default 'default' */
  @Input() size: InputGroupProps['size'] = 'default';
  /** Applies the destructive border and focus ring. @default false */
  @Input() invalid = false;
  /** Switches to a stacked column layout for `block-start`/`block-end` addons. @default false */
  @Input() stacked = false;
  /** Extra Tailwind classes merged onto the group via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(
      inputGroupVariants({ size: this.size, invalid: this.invalid, stacked: this.stacked }),
      this.class
    );
  }
}

const inputGroupAddonVariants = cva('flex shrink-0 items-center gap-1.5 text-muted-foreground', {
  variants: {
    align: {
      'inline-start': 'order-first',
      'inline-end': 'order-last',
      'block-start': 'order-first w-full border-b border-border px-3 py-1.5',
      'block-end': 'order-last w-full border-t border-border px-3 py-1.5',
    },
  },
  defaultVariants: { align: 'inline-start' },
});

export type InputGroupAddonProps = VariantProps<typeof inputGroupAddonVariants>;

/**
 * A slot beside (or above/below) the input for icons, text or buttons.
 * Use `block-start` / `block-end` together with the group's `stacked` input.
 */
@Component({
  selector: 'tolle-input-group-addon',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="computedClass"><ng-content></ng-content></div>`,
})
export class InputGroupAddonComponent {
  /** Where the addon sits relative to the input. @default 'inline-start' */
  @Input() align: InputGroupAddonProps['align'] = 'inline-start';
  /** Extra Tailwind classes merged onto the addon via `cn()` (last-wins). */
  @Input() class = '';

  get computedClass() {
    return cn(inputGroupAddonVariants({ align: this.align }), this.class);
  }
}

const inputGroupButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-1 rounded font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        xs: 'h-6 px-2 text-xs',
        sm: 'h-7 px-2.5 text-sm',
        'icon-xs': 'h-6 w-6 p-0 text-xs',
        'icon-sm': 'h-7 w-7 p-0 text-sm',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'icon-sm' },
  }
);

export type InputGroupButtonProps = VariantProps<typeof inputGroupButtonVariants>;

/** A compact button sized to sit inside an input group addon. */
@Component({
  selector: 'tolle-input-group-button',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel || null"
      [class]="computedClass"
      (click)="clicked.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class InputGroupButtonComponent {
  /** Visual style of the button. @default 'ghost' */
  @Input() variant: InputGroupButtonProps['variant'] = 'ghost';
  /** Size of the button; the `icon-*` sizes render a square. @default 'icon-sm' */
  @Input() size: InputGroupButtonProps['size'] = 'icon-sm';
  /** Native button type. @default 'button' */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  /** Disables the button. @default false */
  @Input() disabled = false;
  /** Accessible name — required when the button shows only an icon. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the button via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the click event when the button is pressed. */
  @Output() clicked = new EventEmitter<MouseEvent>();

  get computedClass() {
    return cn(inputGroupButtonVariants({ variant: this.variant, size: this.size }), this.class);
  }
}

/** Plain text inside an addon — a unit, prefix, or character counter. */
@Component({
  selector: 'tolle-input-group-text',
  styles: [':host { display: inline-flex; }'],
  standalone: true,
  imports: [CommonModule],
  template: `<span [class]="cn('select-none whitespace-nowrap text-sm text-muted-foreground', class)"><ng-content></ng-content></span>`,
})
export class InputGroupTextComponent {
  /** Extra Tailwind classes merged onto the text via `cn()` (last-wins). */
  @Input() class = '';
  protected cn = cn;
}

/**
 * The input inside a `tolle-input-group`. Deliberately borderless and
 * unfocusable-looking — the surrounding group owns the border and focus ring.
 */
@Component({
  selector: 'tolle-input-group-input',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputGroupInputComponent),
      multi: true,
    },
  ],
  template: `
    <input
      [id]="id"
      [type]="type"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [readOnly]="readonly"
      [value]="value ?? ''"
      [attr.aria-describedby]="ariaDescribedby || null"
      [class]="computedClass"
      (input)="onInputChange($event)"
      (blur)="onTouched()"
    />
  `,
})
export class InputGroupInputComponent implements ControlValueAccessor {
  /** Id applied to the underlying `<input>`. */
  @Input() id = `input-group-input-${Math.random().toString(36).slice(2, 11)}`;
  /** Native input type. @default 'text' */
  @Input() type = 'text';
  /** Placeholder text. @default '' */
  @Input() placeholder = '';
  /** Disables the input. @default false */
  @Input() disabled = false;
  /** Makes the input read-only. @default false */
  @Input() readonly = false;
  /** Id of the element describing this input, for `aria-describedby`. @default '' */
  @Input() ariaDescribedby = '';
  /** Extra Tailwind classes merged onto the input via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the new value on every keystroke. */
  @Output() valueChange = new EventEmitter<string>();

  value: string | null = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get computedClass() {
    return cn(
      'min-w-0 flex-1 border-none bg-transparent p-0 text-foreground outline-none',
      'placeholder:text-muted-foreground',
      'focus:outline-none focus:ring-0 focus:shadow-none',
      'disabled:cursor-not-allowed',
      this.class
    );
  }

  onInputChange(event: Event): void {
    if (this.readonly || this.disabled) return;
    const next = (event.target as HTMLInputElement).value;
    this.value = next;
    this.onChange(next);
    this.valueChange.emit(next);
  }

  writeValue(value: string | null): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
}

/** The textarea equivalent of `tolle-input-group-input`. */
@Component({
  selector: 'tolle-input-group-textarea',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputGroupTextareaComponent),
      multi: true,
    },
  ],
  template: `
    <textarea
      [id]="id"
      [rows]="rows"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [readOnly]="readonly"
      [value]="value ?? ''"
      [attr.aria-describedby]="ariaDescribedby || null"
      [class]="computedClass"
      (input)="onInputChange($event)"
      (blur)="onTouched()"
    ></textarea>
  `,
})
export class InputGroupTextareaComponent implements ControlValueAccessor {
  /** Id applied to the underlying `<textarea>`. */
  @Input() id = `input-group-textarea-${Math.random().toString(36).slice(2, 11)}`;
  /** Visible rows. @default 3 */
  @Input() rows = 3;
  /** Placeholder text. @default '' */
  @Input() placeholder = '';
  /** Disables the textarea. @default false */
  @Input() disabled = false;
  /** Makes the textarea read-only. @default false */
  @Input() readonly = false;
  /** Id of the element describing this textarea, for `aria-describedby`. @default '' */
  @Input() ariaDescribedby = '';
  /** Extra Tailwind classes merged onto the textarea via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the new value on every keystroke. */
  @Output() valueChange = new EventEmitter<string>();

  value: string | null = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get computedClass() {
    return cn(
      'min-w-0 flex-1 resize-none border-none bg-transparent p-0 py-2 text-foreground outline-none',
      'placeholder:text-muted-foreground',
      'focus:outline-none focus:ring-0 focus:shadow-none',
      'disabled:cursor-not-allowed',
      this.class
    );
  }

  onInputChange(event: Event): void {
    if (this.readonly || this.disabled) return;
    const next = (event.target as HTMLTextAreaElement).value;
    this.value = next;
    this.onChange(next);
    this.valueChange.emit(next);
  }

  writeValue(value: string | null): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
}
