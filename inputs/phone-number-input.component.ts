import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    inject,
    Input,
    Output,
    ViewChild,
    ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CountrySelectorComponent } from './country-selector.component';
import { MaskedInputComponent } from './masked-input.component';
import parsePhoneNumber from 'libphonenumber-js';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-phone-number-input',
    standalone: true,
    imports: [CommonModule, FormsModule, CountrySelectorComponent, MaskedInputComponent],
    template: `
    <tolle-masked-input
      [mask]="mask"
      [size]="size"
      [disabled]="disabled"
      [readonly]="readonly"
      [placeholder]="placeholder"
      [(ngModel)]="displayValue"
      (ngModelChange)="onMaskInputChange($event)"
      [containerClass]="cn('pl-0', class)"
    >
      <tolle-country-selector
        prefix
        class="country-selector-override"
        [showName]="false"
        [size]="size"
        [disabled]="disabled"
        [readonly]="readonly"
        [(ngModel)]="selectedIso"
        (ngModelChange)="onCountryChange($event)"
      ></tolle-country-selector>
    </tolle-masked-input>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
    }
    ::ng-deep .country-selector-override {
       display: flex;
       align-items: center;
       border-right: 1px solid var(--border, #e5e7eb);
    }
    ::ng-deep .country-selector-override button {
      border: none !important;
      border-radius: 0 !important;
      border-top-left-radius: calc(var(--radius, 0.5rem) - 1px) !important;
      border-bottom-left-radius: calc(var(--radius, 0.5rem) - 1px) !important;
      background: transparent !important;
      box-shadow: none !important;
      padding-left: 0.75rem !important;
      padding-right: 0.5rem !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.25rem !important;
    }
    ::ng-deep .country-selector-override button .flex {
      gap: 0.25rem !important;
    }
    ::ng-deep .country-selector-override button i {
      margin-left: 0 !important;
      line-height: 1 !important;
      display: flex !important;
      align-items: center !important;
    }
  `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PhoneNumberInputComponent),
            multi: true
        }
    ]
})
export class PhoneNumberInputComponent implements ControlValueAccessor {
    private cdr = inject(ChangeDetectorRef);

    @Input() placeholder = 'Phone number';
    @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() defaultCountryCode = 'GH';
    @Input() dataType: 'NumberOnly' | 'FullObject' = 'FullObject';
    @Input() mask = '(000) 000-0000';
    @Input() class = '';

    @Output() onSelect = new EventEmitter<any>();

    displayValue = '';
    selectedIso = '';
    private rawValue = '';

    protected cn = cn;

    onChange: any = () => { };
    onTouched: any = () => { };

    constructor() {
        this.selectedIso = this.defaultCountryCode;
    }

    writeValue(value: any): void {
        if (value) {
            if (typeof value === 'object' && value.number) {
                this.selectedIso = value.country || this.defaultCountryCode;
                this.displayValue = value.number;
                this.rawValue = value.number.replace(/\D/g, '');
            } else {
                this.displayValue = value;
                this.rawValue = value.toString().replace(/\D/g, '');
                try {
                    const parsed = parsePhoneNumber(value);
                    if (parsed) {
                        this.selectedIso = parsed.country || this.defaultCountryCode;
                    }
                } catch (e) { }
            }
        } else {
            this.displayValue = '';
            this.rawValue = '';
        }
        this.cdr.markForCheck();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.cdr.markForCheck();
    }

    onCountryChange(iso: string) {
        this.selectedIso = iso;
        this.updateModel();
    }

    onMaskInputChange(value: string) {
        this.displayValue = value;
        this.rawValue = value.replace(/\D/g, '');
        this.updateModel();
    }

    private updateModel() {
        if (!this.rawValue) {
            this.onChange(null);
            return;
        }

        try {
            const parsed = parsePhoneNumber(this.rawValue, this.selectedIso as any);
            if (parsed) {
                if (this.dataType === 'FullObject') {
                    this.onChange(parsed);
                } else {
                    this.onChange(parsed.number);
                }
                this.onSelect.emit(parsed);
            } else {
                this.onChange(this.rawValue);
            }
        } catch (e) {
            this.onChange(this.rawValue);
        }
    }
}
