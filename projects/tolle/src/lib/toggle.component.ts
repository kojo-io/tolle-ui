import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const toggleVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
    {
        variants: {
            variant: {
                default: "bg-transparent",
                outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                default: "h-10 px-3",
                sm: "h-9 px-2.5",
                lg: "h-11 px-5",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export type ToggleProps = VariantProps<typeof toggleVariants>;

@Component({
    selector: 'tolle-toggle',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button
      type="button"
      [class]="computedClass"
      [disabled]="disabled"
      [attr.aria-pressed]="pressed"
      [attr.data-state]="pressed ? 'on' : 'off'"
      (click)="toggle()"
    >
      <ng-content></ng-content>
    </button>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ToggleComponent),
            multi: true
        }
    ]
})
export class ToggleComponent implements ControlValueAccessor {
    @Input() variant: ToggleProps['variant'] = 'default';
    @Input() size: ToggleProps['size'] = 'default';
    @Input() disabled: boolean = false;
    @Input() class: string = '';

    @Input() set pressed(val: boolean) {
        this._pressed = val;
        this.onChange(val);
    }
    get pressed() { return this._pressed; }
    private _pressed = false;

    @Output() pressedChange = new EventEmitter<boolean>();

    onChange: any = () => { };
    onTouched: any = () => { };

    get computedClass() {
        return cn(
            toggleVariants({
                variant: this.variant,
                size: this.size,
            }),
            this.class
        );
    }

    toggle() {
        if (this.disabled) return;
        this.pressed = !this.pressed;
        this.pressedChange.emit(this.pressed);
        this.onTouched();
    }

    writeValue(value: any): void {
        this._pressed = !!value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
