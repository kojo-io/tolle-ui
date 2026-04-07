import {
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  ChangeDetectorRef,
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
    <div class="flex w-full flex-col gap-1.5">
      <label *ngIf="label" [for]="id" [class]="computedLabelClass">
        {{ label }}
      </label>

      <div class="flex gap-2" (focusin)="onFocusIn()" (focusout)="onFocusOut()">
        <tolle-country-selector
          class="flex-shrink-0"
          [showName]="false"
          [size]="size"
          [disabled]="disabled || !enableCountrySelector"
          [readonly]="readonly"
          [externalFocused]="isFocused"
          [(ngModel)]="selectedIso"
          (ngModelChange)="onCountryChange($event)"
          (onFocusChange)="onFocusIn()"
          (onBlurChange)="onFocusOut()"></tolle-country-selector>

        <tolle-masked-input
          class="min-w-0 flex-1"
          [id]="id"
          [mask]="mask"
          [size]="size"
          [disabled]="disabled"
          [readonly]="readonly"
          [placeholder]="placeholder"
          [error]="error"
          [externalFocused]="isFocused"
          [(ngModel)]="displayValue"
          (ngModelChange)="onMaskInputChange($event)"></tolle-masked-input>
      </div>

      <ng-container *ngIf="!disabled">
        <p
          *ngIf="hint && !error"
          class="px-1 text-xs text-muted-foreground transition-opacity duration-200"
          [class.opacity-0]="isFocused && hideHintOnFocus">
          {{ hint }}
        </p>
        <p *ngIf="error && errorMessage" [id]="id + '-error'" class="px-1 text-xs text-destructive">
          {{ errorMessage }}
        </p>
      </ng-container>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneNumberInputComponent),
      multi: true,
    },
  ],
})
export class PhoneNumberInputComponent implements ControlValueAccessor {
  private cdr = inject(ChangeDetectorRef);

  @Input() id = `phone-input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label = '';
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() error = false;
  @Input() hideHintOnFocus = true;
  @Input() placeholder = 'Phone number';
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() defaultCountryCode = 'GH';
  @Input() dataType: 'NumberOnly' | 'FullObject' = 'FullObject';
  @Input() mask = '(000) 000-0000';
  @Input() class = '';
  @Input() enableCountrySelector = true;

  @Output() onSelect = new EventEmitter<any>();

  displayValue = '';
  selectedIso = '';
  private rawValue = '';
  isFocused = false;

  protected cn = cn;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    this.selectedIso = this.defaultCountryCode;
  }

  get computedLabelClass() {
    return cn(
      'text-sm font-medium text-foreground leading-none transition-opacity duration-200',
      this.disabled && 'opacity-50'
    );
  }

  onFocusIn(): void {
    this.isFocused = true;
    this.cdr.markForCheck();
  }

  onFocusOut(): void {
    this.isFocused = false;
    this.onTouched();
    this.cdr.markForCheck();
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
        } catch (e) {}
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
