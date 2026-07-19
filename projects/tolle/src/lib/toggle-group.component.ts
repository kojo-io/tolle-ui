import { Component, Input, Output, EventEmitter, forwardRef, ContentChildren, QueryList, AfterContentInit, AfterViewInit, inject, ChangeDetectorRef, ElementRef, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from './utils/cn';
import { ToggleComponent } from './toggle.component';

@Component({
    selector: 'tolle-toggle-group',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ToggleGroupComponent),
            multi: true
        }
    ],
    host: {
        '[class]': 'computedClass',
        'role': 'group',
        '(keydown)': 'onKeydown($event)',
        '(focusin)': 'onFocusIn($event)'
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
export class ToggleGroupComponent implements AfterContentInit, AfterViewInit, ControlValueAccessor {
    @Input() type: 'single' | 'multiple' = 'single';
    @Input() variant: 'default' | 'outline' = 'default';
    @Input() size: 'default' | 'sm' | 'lg' = 'default';
    @Input() class: string = '';
    @Input() disabled: boolean = false;

    @Output() valueChange = new EventEmitter<any>();

    @ContentChildren(forwardRef(() => ToggleGroupItemComponent), { descendants: true }) items!: QueryList<ToggleGroupItemComponent>;

    private _value: any;
    private cdr = inject(ChangeDetectorRef);
    private host = inject(ElementRef<HTMLElement>);

    /** Index (into the full button list) of the current roving tab stop. */
    private activeIndex = 0;

    onChange: any = () => { };
    onTouched: any = () => { };

    get value() { return this._value; }
    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.updateItemsState();
            this.onChange(v);
            this.valueChange.emit(v);
        }
    }

    ngAfterContentInit() {
        this.updateItemsState();
        this.items.changes.subscribe(() => {
            this.updateItemsState();
            this.cdr.markForCheck();
            // Re-apply roving tabindex once the new toggle views have rendered.
            Promise.resolve().then(() => this.applyRovingTabindex());
        });
    }

    ngAfterViewInit() {
        this.applyRovingTabindex();
    }

    get computedClass() {
        return cn("inline-flex items-center justify-center -space-x-px rounded-md", this.class);
    }

    /** All toggle button elements in DOM order. */
    private get toggleButtons(): HTMLButtonElement[] {
        return Array.from(
            this.host.nativeElement.querySelectorAll('tolle-toggle button')
        ) as HTMLButtonElement[];
    }

    /**
     * Roving tabindex: exactly one toggle button is tab-reachable at a time.
     * Defaults to the current active button, falling back to the first enabled.
     */
    private applyRovingTabindex() {
        const btns = this.toggleButtons;
        if (!btns.length) return;

        let active = this.activeIndex;
        if (active < 0 || active >= btns.length || btns[active].disabled) {
            active = btns.findIndex(b => !b.disabled);
            if (active < 0) active = 0;
        }
        this.activeIndex = active;
        btns.forEach((b, i) => { b.tabIndex = i === active ? 0 : -1; });
    }

    /**
     * Toolbar keyboard nav: Arrow Left/Right (and Home/End) move focus between
     * toggle buttons without activating them (toggles activate on Enter/Space/click).
     */
    onKeydown(event: KeyboardEvent) {
        const key = event.key;
        if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End') return;

        const btns = this.toggleButtons;
        const enabled = btns.map((b, i) => ({ b, i })).filter(x => !x.b.disabled);
        if (!enabled.length) return;

        event.preventDefault();

        const active = (typeof document !== 'undefined' ? document.activeElement : null) as HTMLButtonElement | null;
        const focusedIndex = active ? btns.indexOf(active) : -1;
        let pos = enabled.findIndex(x => x.i === focusedIndex);

        let targetPos: number;
        if (key === 'Home') {
            targetPos = 0;
        } else if (key === 'End') {
            targetPos = enabled.length - 1;
        } else if (key === 'ArrowRight') {
            targetPos = pos < 0 ? 0 : (pos + 1) % enabled.length;
        } else {
            targetPos = pos < 0 ? enabled.length - 1 : (pos - 1 + enabled.length) % enabled.length;
        }

        // Focusing the button triggers focusin, which updates the roving tab stop.
        enabled[targetPos].b.focus();
    }

    /** Keep the roving tab stop in sync when a button gains focus (tab/click). */
    onFocusIn(event: FocusEvent) {
        const btns = this.toggleButtons;
        const idx = btns.indexOf(event.target as HTMLButtonElement);
        if (idx < 0) return;
        this.activeIndex = idx;
        btns.forEach((b, i) => { b.tabIndex = i === idx ? 0 : -1; });
    }

    writeValue(value: any): void {
        this._value = value;
        this.updateItemsState();
        this.cdr.markForCheck();
    }

    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.updateItemsState();
    }

    toggleItem(itemValue: string) {
        if (this.disabled) return;

        if (this.type === 'single') {
            this.value = this.value === itemValue ? null : itemValue;
        } else {
            const current = Array.isArray(this.value) ? [...this.value] : [];
            const index = current.indexOf(itemValue);
            if (index > -1) {
                current.splice(index, 1);
            } else {
                current.push(itemValue);
            }
            this.value = current;
        }
    }

    private updateItemsState() {
        if (!this.items) return;
        this.items.forEach(item => {
            if (this.type === 'single') {
                item.pressed = this.value === item.value;
            } else {
                item.pressed = Array.isArray(this.value) && this.value.includes(item.value);
            }
            item.variant = this.variant;
            item.size = this.size;
            item.disabled = this.disabled || item.disabled;
            item.cdr.markForCheck();
        });
    }
}

@Component({
    selector: 'tolle-toggle-group-item',
  styles: [':host { display: inline-flex; }'],
    standalone: true,
    imports: [CommonModule, ToggleComponent],
    template: `
        <tolle-toggle
            [pressed]="pressed"
            [variant]="variant"
            [size]="size"
            [disabled]="disabled"
            (pressedChange)="onToggle()"
            [class]="class"
        >
            <ng-content></ng-content>
        </tolle-toggle>
    `
})
export class ToggleGroupItemComponent {
    @Input({ required: true }) value!: string;
    @Input() class: string = '';
    @Input() disabled: boolean = false;

    pressed = false;
    variant: 'default' | 'outline' = 'default';
    size: 'default' | 'sm' | 'lg' = 'default';

    private group = inject(ToggleGroupComponent);
    public cdr = inject(ChangeDetectorRef);

    onToggle() {
        this.group.toggleItem(this.value);
    }
}
