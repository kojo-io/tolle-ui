import {
  Component,
  Input,
  forwardRef,
  inject,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CountryCodesService } from './country-codes.service';
import { PopoverComponent } from './popover.component';
import { InputComponent } from './input.component';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-country-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, PopoverComponent, InputComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountrySelectorComponent),
      multi: true
    }
  ],
  template: `
    <tolle-popover #popover [placement]="'bottom-start'" (onClose)="onPopoverClose()">
      <div trigger class="w-full">
        <button
          type="button"
          [disabled]="disabled"
          [class]="computedTriggerClass"
        >
          <div class="flex items-center gap-2 truncate">
            <img
              *ngIf="selectedCountry"
              [src]="getFlagUrl(selectedCountry.flag)"
              class="h-4 w-6 rounded-sm border border-border object-cover flex-shrink-0"
              [alt]="selectedCountry.name"
            />
            <span *ngIf="selectedCountry && showName" class="truncate font-medium">
              {{ selectedCountry.name }}
            </span>
            <span *ngIf="!selectedCountry" class="text-muted-foreground truncate">
              {{ placeholder }}
            </span>
          </div>
          <i [class]="iconClass"></i>
        </button>
      </div>

      <div class="flex flex-col bg-popover rounded-md border border-border shadow-md min-w-[300px] max-w-[400px] overflow-hidden">
        <div class="p-2 border-b border-border bg-popover shadow-sm sticky top-0 z-10">
          <tolle-input
            size="sm"
            placeholder="Search country..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterCountries($event)"
            class="w-full"
            #searchInput
          >
            <i prefix class="ri-search-line"></i>
          </tolle-input>
        </div>

        <div class="max-h-[300px] overflow-y-auto p-1">
          <div
            *ngFor="let country of shadowCountries"
            (click)="selectCountry(country)"
            [class]="getItemClass(country)"
          >
            <div class="flex items-center gap-3 w-full">
              <img
                [src]="getFlagUrl(country.flag)"
                class="h-4 w-6 rounded-sm border border-border object-cover flex-shrink-0"
                [alt]="country.name"
              />
              <span class="text-sm flex-1 truncate">{{ country.name }}</span>
              <span class="text-xs text-muted-foreground">{{ country.dialCode }}</span>
              <i *ngIf="selectedCountry?.isoAlpha2 === country.isoAlpha2" class="ri-check-line text-primary"></i>
            </div>
          </div>
          <div *ngIf="shadowCountries.length === 0" class="py-6 text-center text-sm text-muted-foreground">
            No countries found.
          </div>
        </div>
      </div>
    </tolle-popover>
  `
})
export class CountrySelectorComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = 'Select country';
  @Input() class = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  @Input() defaultCountryCode = 'GH';
  @Input() returnValue: 'object' | 'isoAlpha2' | 'dialCode' | 'name' = 'isoAlpha2';
  @Input() showName = true;

  @Output() onSelect = new EventEmitter<any>();

  @ViewChild('popover') popover!: PopoverComponent;

  private countryCodesService = inject(CountryCodesService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  value: any = null;
  selectedCountry: any = null;
  searchQuery = '';
  shadowCountries: any[] = [];

  onChange: any = () => { };
  onTouched: any = () => { };

  protected cn = cn;

  ngOnInit() {
    this.shadowCountries = this.countryCodesService.countries;
    if (this.defaultCountryCode && !this.value) {
      this.selectedCountry = this.countryCodesService.countries.find(
        c => c.isoAlpha2 === this.defaultCountryCode
      );
      if (this.selectedCountry) {
        this.value = this.getReturnValue(this.selectedCountry);
      }
    }
  }

  get computedTriggerClass() {
    return cn(
      'flex w-full items-center justify-between rounded-md border transition-all duration-200',
      'bg-background text-foreground',
      'border-input shadow-sm',
      this.size === 'xs' && 'h-8 px-2 text-xs',
      this.size === 'sm' && 'h-9 px-3 text-sm',
      this.size === 'default' && 'h-10 px-3 text-sm',
      this.size === 'lg' && 'h-11 px-4 text-base',
      !(this.readonly || this.disabled) && [
        'focus:outline-none',
        'focus:ring-4',
        'focus:ring-ring/30',
        'focus:ring-offset-0',
        'focus:border-primary/80'
      ],
      !(this.readonly || this.disabled) && 'hover:border-accent',
      this.disabled && 'cursor-not-allowed opacity-50 border-opacity-50',
      this.readonly && 'cursor-default border-dashed',
      this.class
    );
  }

  get iconClass() {
    return cn(
      'ri-arrow-down-s-line text-muted-foreground ml-2 transition-transform duration-200',
      this.popover?.isOpen ? 'rotate-180' : '',
      (this.size === 'xs' || this.size === 'sm') ? 'text-[14px]' : 'text-[18px]',
      (this.disabled || this.readonly) && 'opacity-30'
    );
  }

  getItemClass(country: any) {
    const isSelected = this.selectedCountry?.isoAlpha2 === country.isoAlpha2;
    return cn(
      'flex items-center justify-between px-3 py-2 cursor-pointer transition-colors duration-150 rounded-sm w-full',
      isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 text-foreground'
    );
  }

  getFlagUrl(flagBase64: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/*;base64,' + flagBase64
    );
  }

  filterCountries(query: string) {
    const filter = (query || '').toLowerCase().trim();
    this.shadowCountries = this.countryCodesService.countries.filter(c =>
      c.name.toLowerCase().includes(filter) ||
      c.dialCode.includes(filter) ||
      c.isoAlpha2.toLowerCase().includes(filter)
    );
  }

  selectCountry(country: any) {
    this.selectedCountry = country;
    this.value = this.getReturnValue(country);
    this.onChange(this.value);
    this.onSelect.emit(country);
    this.popover.close();
  }

  private getReturnValue(country: any) {
    switch (this.returnValue) {
      case 'object': return country;
      case 'isoAlpha2': return country.isoAlpha2;
      case 'dialCode': return country.dialCode;
      case 'name': return country.name;
      default: return country.isoAlpha2;
    }
  }

  onPopoverClose() {
    this.searchQuery = '';
    this.filterCountries('');
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
    if (value) {
      this.selectedCountry = this.countryCodesService.countries.find(c => {
        if (this.returnValue === 'object') return c.isoAlpha2 === value.isoAlpha2;
        if (this.returnValue === 'isoAlpha2') return c.isoAlpha2 === value;
        if (this.returnValue === 'dialCode') return c.dialCode === value;
        if (this.returnValue === 'name') return c.name === value;
        return false;
      });
    } else {
      this.selectedCountry = null;
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
}
