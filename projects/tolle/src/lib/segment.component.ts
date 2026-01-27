import {
  Component,
  Input,
  forwardRef,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ChangeDetectorRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

export type SegmentItem = {
  label: string;
  value: any;
  disabled?: boolean;
  icon?: string;   // Added: Optional icon class (e.g., 'ri-home-line')
  class?: string;  // Added: Custom class for specific item wrapper
  data?: any;      // Added: Extra data payload for custom templates
}

@Component({
    selector: 'tolle-segment',
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SegmentedComponent),
            multi: true
        }
    ],
    template: `
    <div
      #container
      [class]="cn(
        'relative flex items-center p-1 bg-muted rounded-lg select-none w-full gap-1',
        class
      )"
      role="tablist"
    >
      <div
        class="absolute top-1 bottom-1 bg-primary shadow-sm rounded-md transition-all duration-300 ease-[cubic-bezier(0.2,0.0,0.2,1)]"
        [style.left.px]="gliderLeft"
        [style.width.px]="gliderWidth"
        [class.opacity-0]="!hasValue"
      ></div>

      <button
        *ngFor="let item of items"
        #itemEls
        type="button"
        role="tab"
        [disabled]="item.disabled || disabled"
        [attr.aria-selected]="value === item.value"
        (click)="select(item.value)"
        [class]="cn(
          'relative z-10 flex-1 px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-md text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'flex items-center justify-center gap-2',
          value === item.value
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground/70',
          item.disabled && 'opacity-50 cursor-not-allowed',
          item.class
        )"
      >
        <ng-container *ngIf="itemTemplate; else defaultContent">
          <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, selected: value === item.value }">
          </ng-container>
        </ng-container>

        <ng-template #defaultContent>
          <i *ngIf="item.icon" [class]="item.icon"></i>
          <span class="truncate">{{ item.label }}</span>
        </ng-template>
      </button>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class SegmentedComponent implements ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {
  @Input() items: SegmentItem[] = [];
  @Input() class = '';
  @Input() disabled = false;
  @Input() itemTemplate?: TemplateRef<any>; // Allow custom content

  value: any = null;
  gliderLeft = 0;
  gliderWidth = 0;
  hasValue = false;

  @ViewChild('container') containerEl!: ElementRef<HTMLElement>;
  @ViewChildren('itemEls') itemElements!: QueryList<ElementRef<HTMLElement>>;

  private resizeObserver?: ResizeObserver;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    setTimeout(() => this.updateGlider());

    if (typeof ResizeObserver !== 'undefined' && this.containerEl) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateGlider();
      });
      this.resizeObserver.observe(this.containerEl.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Recalculate if items change or if value changes externally
    if (changes['items'] && !changes['items'].firstChange) {
      setTimeout(() => this.updateGlider());
    }
  }

  select(val: any) {
    if (this.disabled) return;
    const item = this.items.find(i => i.value === val);
    if (item?.disabled) return;

    this.value = val;
    this.onChange(val);
    this.onTouched();
    this.updateGlider();
  }

  updateGlider() {
    if (!this.itemElements || !this.items.length) return;

    const index = this.items.findIndex(i => i.value === this.value);

    if (index === -1) {
      this.hasValue = false;
      this.gliderWidth = 0;
      return;
    }

    const activeElement = this.itemElements.get(index)?.nativeElement;

    if (activeElement) {
      this.hasValue = true;
      this.gliderLeft = activeElement.offsetLeft;
      this.gliderWidth = activeElement.offsetWidth;
      this.cdr.detectChanges();
    }
  }

  // CVA Implementation
  writeValue(val: any): void {
    this.value = val;
    setTimeout(() => this.updateGlider());
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  protected cn = cn;
}
