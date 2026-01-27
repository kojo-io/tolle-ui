import {
  Component,
  input,
  forwardRef,
  ElementRef,
  viewChildren,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  TemplateRef,
  viewChild,
  signal,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

export type SegmentItem = {
  label: string;
  value: any;
  disabled?: boolean;
  icon?: string;
  class?: string;
  data?: any;
}

@Component({
  selector: 'tolle-segment',
  standalone: true,
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
        class()
      )"
      role="tablist"
      >
      <div
        class="absolute top-1 bottom-1 bg-primary shadow-sm rounded-md transition-all duration-300 ease-[cubic-bezier(0.2,0.0,0.2,1)]"
        [style.left.px]="gliderLeft()"
        [style.width.px]="gliderWidth()"
        [class.opacity-0]="!hasValue()"
      ></div>
    
      @for (item of items(); track item.value; let i = $index) {
        <button
          #itemEls
          type="button"
          role="tab"
          [disabled]="item.disabled || disabled()"
          [attr.aria-selected]="value() === item.value"
          (click)="select(item.value)"
        [class]="cn(
          'relative z-10 flex-1 px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-md text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'flex items-center justify-center gap-2',
          value() === item.value
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground/70',
          item.disabled && 'opacity-50 cursor-not-allowed',
          item.class
        )"
          >
          @if (itemTemplate()) {
            <ng-container *ngTemplateOutlet="itemTemplate()!; context: { $implicit: item, selected: value() === item.value }">
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
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SegmentedComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  items = input<SegmentItem[]>([]);
  class = input('');
  disabled = input(false);
  itemTemplate = input<TemplateRef<any>>();

  value = signal<any>(null);
  gliderLeft = signal(0);
  gliderWidth = signal(0);
  hasValue = signal(false);

  containerEl = viewChild<ElementRef<HTMLElement>>('container');
  itemElements = viewChildren<ElementRef<HTMLElement>>('itemEls');

  private resizeObserver?: ResizeObserver;
  private cdr = inject(ChangeDetectorRef);

  onChange: (val: any) => void = () => { };
  onTouched: () => void = () => { };

  constructor() {
    effect(() => {
      // Re-update glider when items or value changes
      this.items();
      this.value();
      setTimeout(() => this.updateGlider());
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateGlider());

    const container = this.containerEl()?.nativeElement;
    if (typeof ResizeObserver !== 'undefined' && container) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateGlider();
      });
      this.resizeObserver.observe(container);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  select(val: any) {
    if (this.disabled()) return;
    const item = this.items().find((i: SegmentItem) => i.value === val);
    if (item?.disabled) return;

    this.value.set(val);
    this.onChange(val);
    this.onTouched();
    this.updateGlider();
  }

  updateGlider() {
    const elements = this.itemElements();
    const items = this.items();
    if (!elements.length || !items.length) {
      this.hasValue.set(false);
      this.gliderWidth.set(0);
      return;
    }

    const index = items.findIndex((i: SegmentItem) => i.value === this.value());

    if (index === -1) {
      this.hasValue.set(false);
      this.gliderWidth.set(0);
      return;
    }

    const activeElement = elements[index]?.nativeElement;

    if (activeElement) {
      this.hasValue.set(true);
      this.gliderLeft.set(activeElement.offsetLeft);
      this.gliderWidth.set(activeElement.offsetWidth);
      this.cdr.detectChanges();
    }
  }

  // CVA Implementation
  writeValue(val: any): void {
    this.value.set(val);
    setTimeout(() => this.updateGlider());
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    // handled by input() signal but CVA protocol might still call this
  }

  protected cn = cn;
}
