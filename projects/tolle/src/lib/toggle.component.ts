import { Component, input, model, output, forwardRef, computed } from '@angular/core';

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
    imports: [],
    template: `
    <button
      type="button"
      [class]="computedClass()"
      [disabled]="disabled()"
      [attr.aria-pressed]="pressed()"
      [attr.data-state]="pressed() ? 'on' : 'off'"
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
    variant = input<ToggleProps['variant']>('default');
    size = input<ToggleProps['size']>('default');
    disabled = input(false);
    className = input('', { alias: 'class' });

    pressed = model(false);
    pressedChange = output<boolean>();

    onChange: (value: boolean) => void = () => { };
    onTouched: () => void = () => { };

    computedClass = computed(() => {
        return cn(
            toggleVariants({
                variant: this.variant(),
                size: this.size(),
            }),
            this.className()
        );
    });

    toggle() {
        if (this.disabled()) return;
        const newValue = !this.pressed();
        this.pressed.set(newValue);
        this.pressedChange.emit(newValue);
        this.onChange(newValue);
        this.onTouched();
    }

    // --- ControlValueAccessor ---
    writeValue(value: boolean): void {
        this.pressed.set(!!value);
    }

    registerOnChange(fn: (value: boolean) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        // disabled is an input, skip for now as it's handled in template
    }
}
