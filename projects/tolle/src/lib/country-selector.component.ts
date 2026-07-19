import {
  Component,
  Input,
  forwardRef,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
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
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, FormsModule, PopoverComponent, InputComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountrySelectorComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex w-full flex-col gap-1.5">
      <label *ngIf="label" [for]="id" [class]="computedLabelClass">
        {{ label }}
      </label>

      <tolle-popover
        #popover
        [placement]="'bottom-start'"
        (onOpen)="onPopoverOpen()"
        (onClose)="onPopoverClose()">
        <div trigger class="w-full">
          <button
            type="button"
            [id]="id"
            role="combobox"
            aria-haspopup="listbox"
            [attr.aria-expanded]="popover?.isOpen"
            [attr.aria-activedescendant]="popover?.isOpen ? activeDescendantId : null"
            [disabled]="disabled"
            [class]="computedTriggerClass"
            (blur)="onBlur()"
            (focus)="onFocus()"
            (keydown)="onTriggerKeyDown($event)"
            [attr.aria-invalid]="error"
            [attr.aria-describedby]="error && errorMessage ? id + '-error' : null">
            <div class="flex items-center gap-2 truncate">
              <img
                *ngIf="selectedCountry"
                [src]="getFlagUrl(selectedCountry.flag)"
                class="h-4 w-6 flex-shrink-0 rounded-sm border border-border object-cover"
                [alt]="selectedCountry.name" />
              <span *ngIf="selectedCountry && showName" class="truncate font-medium">
                {{ selectedCountry.name }}
              </span>
              <span *ngIf="!selectedCountry" class="truncate text-muted-foreground">
                {{ placeholder }}
              </span>
            </div>
            <i [class]="iconClass"></i>
          </button>
        </div>

        <div
          class="flex min-w-[300px] max-w-[400px] flex-col overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
          (mousedown)="$event.stopPropagation()">
          <div class="sticky top-0 z-10 border-b border-border bg-popover p-2 shadow-sm">
            <tolle-input
              size="sm"
              placeholder="Search country..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterCountries($event)"
              (keydown)="onSearchKeyDown($event)"
              class="w-full"
              #searchInput>
              <i prefix class="ri-search-line"></i>
            </tolle-input>
          </div>

          <div role="listbox" class="max-h-[300px] overflow-y-auto p-1">
            <div
              *ngFor="let country of shadowCountries; let i = index"
              [id]="id + '-option-' + i"
              role="option"
              [attr.aria-selected]="selectedCountry?.isoAlpha2 === country.isoAlpha2"
              [attr.data-highlighted]="i === activeIndex ? '' : null"
              (click)="selectCountry(country)"
              [class]="getItemClass(country, i)">
              <div class="flex w-full items-center gap-3">
                <img
                  [src]="getFlagUrl(country.flag)"
                  class="h-4 w-6 flex-shrink-0 rounded-sm border border-border object-cover"
                  [alt]="country.name" />
                <span class="flex-1 truncate text-sm">{{ country.name }}</span>
                <span class="text-xs text-muted-foreground">{{ country.dialCode }}</span>
                <i
                  *ngIf="selectedCountry?.isoAlpha2 === country.isoAlpha2"
                  class="ri-check-line text-primary"></i>
              </div>
            </div>
            <div
              *ngIf="shadowCountries.length === 0"
              class="py-6 text-center text-sm text-muted-foreground">
              No countries found.
            </div>
          </div>
        </div>
      </tolle-popover>

      <ng-container *ngIf="!disabled">
        <p
          *ngIf="hint && !error"
          class="px-1 text-xs text-muted-foreground transition-opacity duration-200"
          [class.opacity-0]="isFocused && hideHintOnFocus">
          {{ hint }}
        </p>
        <p
          *ngIf="error && errorMessage"
          [id]="id + '-error'"
          class="px-1 text-xs font-medium text-destructive">
          {{ errorMessage }}
        </p>
      </ng-container>
    </div>
  `,
})
export class CountrySelectorComponent implements OnInit, ControlValueAccessor {
  @Input() id = `country-selector-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label = '';
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() error = false;
  @Input() hideHintOnFocus = true;
  @Input() placeholder = 'Select country';
  @Input() class = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() size: 'xs' | 'sm' | 'default' | 'lg' = 'default';
  @Input() defaultCountryCode = 'GH';
  @Input() returnValue: 'object' | 'isoAlpha2' | 'dialCode' | 'name' = 'isoAlpha2';
  @Input() showName = true;
  @Input() externalFocused: boolean | undefined;

  @Output() onSelect = new EventEmitter<any>();
  @Output() onFocusChange = new EventEmitter<void>();
  @Output() onBlurChange = new EventEmitter<void>();

  @ViewChild('popover') popover!: PopoverComponent;
  @ViewChild('searchInput', { read: ElementRef }) searchInput?: ElementRef<HTMLElement>;

  private countryCodesService = inject(CountryCodesService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  value: any = null;
  selectedCountry: any = null;
  searchQuery = '';
  shadowCountries: any[] = [];
  isFocused = false;

  // Keyboard navigation (active-descendant) state over the filtered rows
  activeIndex = -1;

  onChange: any = () => {};
  onTouched: any = () => {};

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
    const focused = this.externalFocused !== undefined ? this.externalFocused : this.isFocused;
    return cn(
      'flex w-full items-center justify-between border transition-all duration-200',
      'bg-background text-foreground',
      'border-input shadow-sm',
      this.size === 'xs' && 'h-8 px-2 text-xs',
      this.size === 'sm' && 'h-9 px-3 text-sm',
      this.size === 'default' && 'h-10 px-3 text-sm',
      this.size === 'lg' && 'h-11 px-4 text-base',
      // Rounded corners
      'rounded-md',
      // Focus state
      !(this.readonly || this.disabled) && [
        'focus-visible:outline-none',
        'focus-visible:ring-4',
        'focus-visible:ring-ring/30',
        'focus-visible:ring-offset-0',
        'shadow-none',
        this.error ? 'focus-visible:border-destructive/80' : 'focus-visible:border-primary/80',
      ],
      // External focus state (when controlled by parent)
      !(this.readonly || this.disabled) &&
        focused && [
          'ring-4',
          'ring-ring/30',
          'ring-offset-0',
          'shadow-none',
          this.error ? 'border-destructive/80' : 'border-primary/80',
        ],
      !(this.readonly || this.disabled) && 'hover:border-accent',
      // Error state
      this.error && [
        'border-destructive',
        !(this.readonly || this.disabled) && focused && 'ring-destructive/30',
      ],
      this.disabled && 'cursor-not-allowed opacity-50 border-opacity-50',
      this.readonly && 'cursor-default border-dashed',
      this.class
    );
  }

  get computedLabelClass() {
    return cn(
      'text-sm font-medium text-foreground leading-none transition-opacity duration-200',
      this.disabled && 'opacity-50'
    );
  }

  get iconClass() {
    return cn(
      'ri-arrow-down-s-line text-muted-foreground ml-2 transition-transform duration-200',
      this.popover?.isOpen ? 'rotate-180' : '',
      this.size === 'xs' || this.size === 'sm' ? 'text-[14px]' : 'text-[18px]',
      (this.disabled || this.readonly) && 'opacity-30'
    );
  }

  getItemClass(country: any, index: number) {
    const isSelected = this.selectedCountry?.isoAlpha2 === country.isoAlpha2;
    const isActive = index === this.activeIndex;
    return cn(
      'flex items-center justify-between px-3 py-2 cursor-pointer transition-colors duration-150 rounded-sm w-full',
      isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 text-foreground',
      // Active-descendant (keyboard) highlight
      isActive && 'bg-accent text-accent-foreground'
    );
  }

  get activeDescendantId(): string | null {
    return this.activeIndex >= 0 && this.activeIndex < this.shadowCountries.length
      ? `${this.id}-option-${this.activeIndex}`
      : null;
  }

  getFlagUrl(flagBase64: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + flagBase64);
  }

  filterCountries(query: string) {
    const filter = (query || '').toLowerCase().trim();
    this.shadowCountries = this.countryCodesService.countries.filter(
      c =>
        c.name.toLowerCase().includes(filter) ||
        c.dialCode.includes(filter) ||
        c.isoAlpha2.toLowerCase().includes(filter)
    );
    // Re-anchor the active row to the first match after filtering.
    this.activeIndex = this.shadowCountries.length ? 0 : -1;
    this.syncActiveDescendant();
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
      case 'object':
        return country;
      case 'isoAlpha2':
        return country.isoAlpha2;
      case 'dialCode':
        return country.dialCode;
      case 'name':
        return country.name;
      default:
        return country.isoAlpha2;
    }
  }

  onFocus(): void {
    this.isFocused = true;
    this.onFocusChange.emit();
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.onBlurChange.emit();
  }

  onPopoverOpen() {
    // Anchor the active row to the currently selected country (or the first).
    const selIdx = this.selectedCountry
      ? this.shadowCountries.findIndex(c => c.isoAlpha2 === this.selectedCountry.isoAlpha2)
      : -1;
    this.activeIndex = selIdx >= 0 ? selIdx : (this.shadowCountries.length ? 0 : -1);
    setTimeout(() => {
      this.getSearchInputEl()?.focus();
      this.syncActiveDescendant();
      this.scrollActiveIntoView();
    }, 0);
  }

  onPopoverClose() {
    this.searchQuery = '';
    this.filterCountries('');
    this.activeIndex = -1;
    this.onBlur();
  }

  // ---- Keyboard navigation (WAI-ARIA listbox/combobox pattern) ----

  private getSearchInputEl(): HTMLInputElement | null {
    return this.searchInput?.nativeElement?.querySelector('input') ?? null;
  }

  private syncActiveDescendant() {
    const input = this.getSearchInputEl();
    if (!input) return;
    const id = this.activeDescendantId;
    if (id) input.setAttribute('aria-activedescendant', id);
    else input.removeAttribute('aria-activedescendant');
  }

  private scrollActiveIntoView() {
    if (this.activeIndex < 0) return;
    document
      .getElementById(`${this.id}-option-${this.activeIndex}`)
      ?.scrollIntoView({ block: 'nearest' });
  }

  private moveActive(delta: number) {
    if (!this.shadowCountries.length) return;
    const next = this.activeIndex < 0
      ? (delta > 0 ? 0 : this.shadowCountries.length - 1)
      : this.activeIndex + delta;
    // Clamp (no wrap, matching shadcn).
    this.activeIndex = Math.max(0, Math.min(next, this.shadowCountries.length - 1));
    this.syncActiveDescendant();
    this.scrollActiveIntoView();
  }

  private selectActive() {
    const country = this.shadowCountries[this.activeIndex];
    if (!country) return;
    this.selectCountry(country); // closes the popover
    document.getElementById(this.id)?.focus();
  }

  onTriggerKeyDown(event: KeyboardEvent) {
    if (this.disabled || this.readonly) return;
    if (this.popover?.isOpen) return; // once open, focus moves to the search input
    const key = event.key;
    if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ' || key === 'Home' || key === 'End') {
      event.preventDefault();
      this.popover.open();
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      // Any printable character opens the popover (focus moves to the search box).
      this.popover.open();
    }
  }

  // Keydown while the search input is focused. Arrows/Enter/Escape drive the
  // list; other keys (incl. Home/End for caret) fall through to text editing.
  onSearchKeyDown(event: KeyboardEvent) {
    if (!this.popover?.isOpen) return;
    switch (event.key) {
      case 'ArrowDown': event.preventDefault(); this.moveActive(1); break;
      case 'ArrowUp': event.preventDefault(); this.moveActive(-1); break;
      case 'Enter': event.preventDefault(); this.selectActive(); break;
      case 'Escape':
        event.preventDefault();
        this.popover.close();
        document.getElementById(this.id)?.focus();
        break;
    }
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

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
