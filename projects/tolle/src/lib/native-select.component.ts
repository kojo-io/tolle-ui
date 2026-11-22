import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ChangeDetectorRef,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import {
  FormControlLabelComponent,
  FormControlMessageComponent,
  describedBy,
  hasMessage,
} from './form-control-label.component';

const nativeSelectVariants = cva(
  'flex w-full appearance-none items-center rounded-md border border-input bg-background text-foreground shadow-sm transition-colors ' +
    'focus:outline-none focus-visible:border-primary/80 focus-visible:ring-4 focus-visible:ring-ring/30 ' +
    'disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        xs: 'h-8 pl-2 pr-7 text-xs',
        sm: 'h-9 pl-3 pr-8 text-sm',
        default: 'h-10 pl-3 pr-8 text-sm',
        lg: 'h-11 pl-4 pr-9 text-base',
      },
      invalid: {
        true: 'border-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/30',
        false: '',
      },
    },
    defaultVariants: { size: 'default', invalid: false },
  }
);

export type NativeSelectProps = VariantProps<typeof nativeSelectVariants>;

export type NativeSelectOption = {
  label: string;
  value: any;
  disabled?: boolean;
};

/**
 * A styled native `<select>`. Unlike `tolle-select` it uses the platform
 * dropdown, so it needs no portal or floating-ui and works well on mobile and
 * inside forms that must degrade without JavaScript.
 *
 * Options come from `options`, or from projected `<option>` elements when you
 * need `<optgroup>` or custom markup.
 * @new
 */
@Component({
  selector: 'tolle-native-select',
  styles: [':host { display: block; }'],
  imports: [FormControlLabelComponent, FormControlMessageComponent],
  // The id belongs to the <select> so `<label for>` reaches it; leaving it on
  // the host too would duplicate it (and the label would target the host).
  host: { '[attr.id]': 'null' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NativeSelectComponent),
      multi: true,
    },
  ],
  template: `
    @if (label) {
      <tolle-form-control-label [for]="id" [disabled]="disabled">{{ label }}</tolle-form-control-label>
    }
    <div class="relative w-full">
      <select
        [id]="id"
        [disabled]="disabled"
        [attr.aria-invalid]="invalid || null"
        [attr.aria-label]="label ? null : ariaLabel || null"
        [attr.aria-describedby]="describedBy(id, hint, errorMessage, invalid, disabled)"
        [class]="computedClass"
        (change)="onSelectChange($event)"
        (blur)="onTouched()">
        @if (placeholder) {
          <option
            value=""
            [selected]="value === null || value === undefined || value === ''"
            disabled>
            {{ placeholder }}
          </option>
        }
        <!--
        The DOM value is the option's INDEX, not its value. A select element
        coerces every option value to a string, which collapses all object
        options to "[object Object]" and makes them indistinguishable on the
        way back out. Indexing keeps object- and number-valued options
        round-tripping exactly.
        -->
        @for (option of options; track option; let i = $index) {
          <option
            [value]="i"
            [disabled]="option.disabled || false"
            [selected]="option.value === value">
            {{ option.label }}
          </option>
        }
        <ng-content></ng-content>
      </select>

      <i
        class="ri-arrow-down-s-line pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"></i>
    </div>
    @if (hasMessage(hint, errorMessage, invalid, disabled)) {
      <tolle-form-control-message [controlId]="id" [hint]="hint" [errorMessage]="errorMessage" [error]="invalid" />
    }
  `,
})
export class NativeSelectComponent implements ControlValueAccessor {
  /** Id applied to the underlying `<select>`; a `<label for>` elsewhere can target it. @default auto-generated */
  @Input() id = `native-select-${Math.random().toString(36).slice(2, 11)}`;
  /** Label shown above the control and wired to it for screen readers. @default '' */
  @Input() label = '';
  /** Help text shown below the control while it is not invalid. @default '' */
  @Input() hint = '';
  /** Error text shown below the control while `invalid` is true. @default '' */
  @Input() errorMessage = '';

  protected readonly describedBy = describedBy;
  protected readonly hasMessage = hasMessage;
  /** Options to render. Omit and project `<option>` elements for custom markup. @default [] */
  @Input() options: NativeSelectOption[] = [];
  /** Non-selectable prompt shown when no value is set. @default '' */
  @Input() placeholder = '';
  /** Height and text size of the control. @default 'default' */
  @Input() size: NativeSelectProps['size'] = 'default';
  /** Applies the destructive border and sets `aria-invalid`. @default false */
  @Input() invalid = false;
  /** Disables the control. @default false */
  @Input() disabled = false;
  /** Accessible name when there is no associated visible label. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the `<select>` via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the newly selected value whenever the user picks an option. */
  @Output() valueChange = new EventEmitter<any>();

  value: any = null;
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get computedClass() {
    return cn(nativeSelectVariants({ size: this.size, invalid: this.invalid }), this.class);
  }

  onSelectChange(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;

    // Options rendered from `options` carry their index as the DOM value, so we
    // can hand back the ORIGINAL value — object, number or string — untouched.
    // Anything else came from a projected <option>, where the string is all
    // there is.
    const index = Number(raw);
    const fromOptions =
      raw !== '' && Number.isInteger(index) && index >= 0 && index < this.options.length;
    const next = fromOptions ? this.options[index].value : raw;

    this.value = next;
    this.onChange(next);
    this.valueChange.emit(next);
  }

  writeValue(value: any): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
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
