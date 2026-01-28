import { Component, input, output, forwardRef, contentChildren, inject, ChangeDetectorRef, signal, computed, effect } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from './utils/cn';
import { ToggleComponent } from './toggle.component';

@Component({
    selector: 'tolle-toggle-group',
    standalone: true,
    imports: [],
    template: `<ng-content></ng-content>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ToggleGroupComponent),
            multi: true
        }
    ],
    host: {
        '[class]': 'computedClass()',
        'role': 'group'
    },
    styles: [`
    :host {
      display: inline-flex;
    }

    /* 1. First Item: Remove right rounding */
    :host ::ng-deep tolle-toggle-group-item:first-child tolle-toggle button {
      @apply rounded-r-none;
    }

    /* 2. Middle Items: Remove all rounding and left border */
    :host ::ng-deep tolle-toggle-group-item:not(:first-child):not(:last-child) tolle-toggle button {
      @apply rounded-none border-l-0;
    }

    /* 3. Last Item: Remove left rounding and left border */
    :host ::ng-deep tolle-toggle-group-item:last-child:not(:first-child) tolle-toggle button {
      @apply rounded-l-none border-l-0;
    }

    /* 4. Hover/Focus State: Higher z-index to show borders/rings correctly */
    :host ::ng-deep tolle-toggle-group-item tolle-toggle button:hover,
    :host ::ng-deep tolle-toggle-group-item tolle-toggle button:focus,
    :host ::ng-deep tolle-toggle-group-item tolle-toggle button[data-state=on] {
      @apply z-10 relative;
    }
  `]
})
export class ToggleGroupComponent implements ControlValueAccessor {
    type = input<'single' | 'multiple'>('single');
    variant = input<'default' | 'outline'>('default');
    size = input<'default' | 'sm' | 'lg'>('default');
    className = input('', { alias: 'class' });
    disabled = input(false);

    valueChange = output<any>();

    items = contentChildren<ToggleGroupItemComponent>(forwardRef(() => ToggleGroupItemComponent), { descendants: true });

    private _value = signal<any>(undefined);
    private cdr = inject(ChangeDetectorRef);

    onChange: (value: any) => void = () => { };
    onTouched: () => void = () => { };

    computedClass = computed(() => {
        return cn("inline-flex items-center justify-center -space-x-px rounded-md", this.className());
    });

    constructor() {
        effect(() => {
            this.updateItemsState();
        });
    }

    writeValue(value: any): void {
        this._value.set(value);
        this.cdr.markForCheck();
    }

    registerOnChange(fn: (value: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void {
        // disabled is an input, skip for now
    }

    toggleItem(itemValue: string) {
        if (this.disabled()) return;

        let newValue: any;
        if (this.type() === 'single') {
            newValue = this._value() === itemValue ? null : itemValue;
        } else {
            const current = Array.isArray(this._value()) ? [...this._value()] : [];
            const index = current.indexOf(itemValue);
            if (index > -1) {
                current.splice(index, 1);
            } else {
                current.push(itemValue);
            }
            newValue = current;
        }

        this._value.set(newValue);
        this.onChange(newValue);
        this.valueChange.emit(newValue);
    }

    private updateItemsState() {
        const items = this.items();
        const val = this._value();
        const type = this.type();
        const variant = this.variant();
        const size = this.size();
        const groupDisabled = this.disabled();

        items.forEach((item: ToggleGroupItemComponent) => {
            if (type === 'single') {
                item.pressed.set(val === item.value());
            } else {
                item.pressed.set(Array.isArray(val) && val.includes(item.value()));
            }
            item.variant.set(variant);
            item.size.set(size);
            item.groupDisabled.set(groupDisabled);
            item.cdr.markForCheck();
        });
    }
}

@Component({
    selector: 'tolle-toggle-group-item',
    standalone: true,
    imports: [ToggleComponent],
    template: `
    <tolle-toggle
      [pressed]="pressed()"
      [variant]="variant()"
      [size]="size()"
      [disabled]="isEffectiveDisabled()"
      (pressedChange)="onToggle()"
      [class]="className()"
    >
      <ng-content></ng-content>
    </tolle-toggle>
  `
})
export class ToggleGroupItemComponent {
    value = input.required<string>();
    className = input('', { alias: 'class' });
    disabled = input(false);

    pressed = signal(false);
    variant = signal<'default' | 'outline'>('default');
    size = signal<'default' | 'sm' | 'lg'>('default');
    groupDisabled = signal(false);

    isEffectiveDisabled = computed(() => this.disabled() || this.groupDisabled());

    private group = inject(ToggleGroupComponent);
    public cdr = inject(ChangeDetectorRef);

    onToggle() {
        this.group.toggleItem(this.value());
    }
}
