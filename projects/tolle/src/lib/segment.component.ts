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
  icon?: string; // Added: Optional icon class (e.g., 'ri-home-line')
  class?: string; // Added: Custom class for specific item wrapper
  data?: any; // Added: Extra data payload for custom templates
};

@Component({
  selector: 'tolle-segment',
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentComponent),
      multi: true,
    },
  ],
  template: `
    <div
      #container
      [class]="
        cn('relative flex w-full select-none items-center gap-1 rounded-lg bg-muted p-1', class)
      "
      role="radiogroup"
      (keydown)="onKeydown($event)">
      <div
        class="absolute bottom-1 top-1 rounded-md bg-primary shadow-sm transition-all duration-300 ease-tolle"
        [style.left.px]="gliderLeft"
        [style.width.px]="gliderWidth"
        [class.opacity-0]="!hasValue"></div>

      @for (item of items; track item) {
        <button
          #itemEls
          type="button"
          role="radio"
          [disabled]="item.disabled || disabled"
          [attr.aria-checked]="value === item.value"
          [attr.tabindex]="getTabIndex(item)"
          (click)="select(item.value)"
          [class]="
            cn(
              'relative z-10 flex-1 rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'flex items-center justify-center gap-2',
              value === item.value
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground/70',
              item.disabled && 'cursor-not-allowed opacity-50',
              item.class
            )
          ">
          @if (itemTemplate) {
            <ng-container
              *ngTemplateOutlet="
                itemTemplate;
                context: { $implicit: item, selected: value === item.value }
              ">
            </ng-container>
          } @else {
            @if (item.icon) {
              <i [class]="item.icon"></i>
            }
            <span class="truncate">{{ item.label }}</span>
          }
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SegmentComponent implements ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {
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

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

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

  /** True when the current value matches one of the items. */
  private hasSelectedValue(): boolean {
    return this.items.some(i => i.value === this.value);
  }

  private firstEnabledItem(): SegmentItem | undefined {
    if (this.disabled) return undefined;
    return this.items.find(i => !i.disabled);
  }

  /**
   * Roving tabindex: the selected item is tab-reachable, or - when nothing is
   * selected - the first enabled item. All other items get -1.
   */
  getTabIndex(item: SegmentItem): number {
    if (this.disabled || item.disabled) return -1;
    if (this.value === item.value) return 0;
    if (!this.hasSelectedValue() && this.firstEnabledItem() === item) return 0;
    return -1;
  }

  /**
   * WAI-ARIA radio group keyboard nav: Arrow Left/Right (and Home/End) move
   * selection + focus across the enabled items, wrapping and skipping disabled.
   */
  onKeydown(event: KeyboardEvent) {
    if (this.disabled) return;

    const key = event.key;
    const forward = key === 'ArrowRight';
    const backward = key === 'ArrowLeft';
    const home = key === 'Home';
    const end = key === 'End';
    if (!forward && !backward && !home && !end) return;

    const enabled = this.items.map((it, i) => ({ it, i })).filter(x => !x.it.disabled);
    if (!enabled.length) return;

    event.preventDefault();

    const buttons = this.itemElements?.toArray().map(r => r.nativeElement) ?? [];
    const focusedIndex = buttons.indexOf(event.target as HTMLElement);
    let pos = enabled.findIndex(x => x.i === focusedIndex);
    if (pos < 0) pos = enabled.findIndex(x => x.it.value === this.value);

    let targetPos: number;
    if (home) {
      targetPos = 0;
    } else if (end) {
      targetPos = enabled.length - 1;
    } else if (forward) {
      targetPos = pos < 0 ? 0 : (pos + 1) % enabled.length;
    } else {
      targetPos = pos < 0 ? enabled.length - 1 : (pos - 1 + enabled.length) % enabled.length;
    }

    const target = enabled[targetPos];
    this.select(target.it.value);
    this.itemElements.get(target.i)?.nativeElement.focus();
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

  protected cn = cn;
}

/**
 * Back-compat alias: the class was renamed to match its `tolle-segment` selector.
 *
 * A re-export binding rather than `const SegmentedComponent = SegmentComponent`,
 * because Angular's AOT compiler resolves an aliased export straight back to the
 * class declaration — so it still works in a consumer's `imports: []` array.
 *
 * @deprecated Use `SegmentComponent`. This alias will be removed in a future major.
 */
export { SegmentComponent as SegmentedComponent };
