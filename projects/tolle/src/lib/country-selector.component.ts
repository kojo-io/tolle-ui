import {
    Component,
    forwardRef,
    inject,
    OnInit,
    viewChild,
    ChangeDetectorRef,
    input,
    output,
    signal,
    computed
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
          [disabled]="disabled()"
          [class]="computedTriggerClass()"
        >
          <div class="flex items-center gap-2 truncate">
            @if (selectedCountry()) {
              <img
                [src]="getFlagUrl(selectedCountry()!.flag)"
                class="h-4 w-6 rounded-sm border border-border object-cover flex-shrink-0"
                [alt]="selectedCountry()!.name"
              />
            }
            @if (selectedCountry() && showName()) {
              <span class="truncate font-medium">
                {{ selectedCountry()!.name }}
              </span>
            }
            @if (!selectedCountry()) {
              <span class="text-muted-foreground truncate">
                {{ placeholder() }}
              </span>
            }
          </div>
          <i [class]="iconClass()"></i>
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
          @for (country of shadowCountries(); track country.isoAlpha2) {
            <div
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
                @if (selectedCountry()?.isoAlpha2 === country.isoAlpha2) {
                  <i class="ri-check-line text-primary"></i>
                }
              </div>
            </div>
          }
          @if (shadowCountries().length === 0) {
            <div class="py-6 text-center text-sm text-muted-foreground">
              No countries found.
            </div>
          }
        </div>
      </div>
    </tolle-popover>
  `
})
export class CountrySelectorComponent implements OnInit, ControlValueAccessor {
    placeholder = input('Select country');
    class = input('');
    disabled = input(false);
    readonly = input(false);
    size = input<'xs' | 'sm' | 'default' | 'lg'>('default');
    defaultCountryCode = input('GH');
    returnValue = input<'object' | 'isoAlpha2' | 'dialCode' | 'name'>('isoAlpha2');
    showName = input(true);

    onSelect = output<any>();

    popover = viewChild<PopoverComponent>('popover');

    private countryCodesService = inject(CountryCodesService);
    private sanitizer = inject(DomSanitizer);
    private cdr = inject(ChangeDetectorRef);

    value = signal<any>(null);
    selectedCountry = signal<any>(null);
    searchQuery = '';
    shadowCountries = signal<any[]>([]);

    onChange: any = () => { };
    onTouched: any = () => { };

    protected cn = cn;

    ngOnInit() {
        this.shadowCountries.set(this.countryCodesService.countries);
        if (this.defaultCountryCode() && !this.value()) {
            const defaultCountry = this.countryCodesService.countries.find(
                c => c.isoAlpha2 === this.defaultCountryCode()
            );
            if (defaultCountry) {
                this.selectedCountry.set(defaultCountry);
                this.value.set(this.getReturnValueInternal(defaultCountry));
            }
        }
    }

    computedTriggerClass = computed(() => {
        return cn(
            'flex w-full items-center justify-between rounded-md border transition-all duration-200',
            'bg-background text-foreground',
            'border-input shadow-sm',
            this.size() === 'xs' && 'h-8 px-2 text-xs',
            this.size() === 'sm' && 'h-9 px-3 text-sm',
            this.size() === 'default' && 'h-10 px-3 text-sm',
            this.size() === 'lg' && 'h-11 px-4 text-base',
            !(this.readonly() || this.disabled()) && [
                'focus:outline-none',
                'focus:ring-4',
                'focus:ring-ring/30',
                'focus:ring-offset-0',
                'focus:border-primary/80'
            ],
            !(this.readonly() || this.disabled()) && 'hover:border-accent',
            this.disabled() && 'cursor-not-allowed opacity-50 border-opacity-50',
            this.readonly() && 'cursor-default border-dashed',
            this.class()
        );
    });

    iconClass = computed(() => {
        return cn(
            'ri-arrow-down-s-line text-muted-foreground ml-2 transition-transform duration-200',
            this.popover()?.isOpen() ? 'rotate-180' : '',
            (this.size() === 'xs' || this.size() === 'sm') ? 'text-[14px]' : 'text-[18px]',
            (this.disabled() || this.readonly()) && 'opacity-30'
        );
    });

    getItemClass(country: any) {
        const isSelected = this.selectedCountry()?.isoAlpha2 === country.isoAlpha2;
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
        this.shadowCountries.set(this.countryCodesService.countries.filter(c =>
            c.name.toLowerCase().includes(filter) ||
            c.dialCode.includes(filter) ||
            c.isoAlpha2.toLowerCase().includes(filter)
        ));
    }

    selectCountry(country: any) {
        this.selectedCountry.set(country);
        const val = this.getReturnValueInternal(country);
        this.value.set(val);
        this.onChange(val);
        this.onSelect.emit(country);
        this.popover()?.close();
    }

    private getReturnValueInternal(country: any) {
        switch (this.returnValue()) {
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
        this.value.set(value);
        if (value) {
            const found = this.countryCodesService.countries.find(c => {
                if (this.returnValue() === 'object') return c.isoAlpha2 === value.isoAlpha2;
                if (this.returnValue() === 'isoAlpha2') return c.isoAlpha2 === value;
                if (this.returnValue() === 'dialCode') return c.dialCode === value;
                if (this.returnValue() === 'name') return c.name === value;
                return false;
            });
            this.selectedCountry.set(found || null);
        } else {
            this.selectedCountry.set(null);
        }
        this.cdr.markForCheck();
    }

    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void {
        // Note: Signal inputs are read-only. This component's 'disabled' is a signal input.
        // Reactive forms usually handle this by setting the disabled state on the form control.
        // If we need to support both Signal input and Reactive Forms disabled state,
        // we should use a local signal for 'disabledInternal'.
    }
}
