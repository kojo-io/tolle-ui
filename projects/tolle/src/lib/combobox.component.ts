import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  forwardRef,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { computePosition, flip, shift, offset, size, autoUpdate } from '@floating-ui/dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import {
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandItemComponent,
} from './command.component';

const comboboxTriggerVariants = cva(
  'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background text-foreground shadow-sm transition-colors ' +
    'focus:outline-none focus-visible:border-primary/80 focus-visible:ring-4 focus-visible:ring-ring/30 ' +
    'disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        xs: 'h-8 px-2 text-xs',
        sm: 'h-9 px-3 text-sm',
        default: 'h-10 px-3 text-sm',
        lg: 'h-11 px-4 text-base',
      },
      invalid: {
        true: 'border-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/30',
        false: '',
      },
    },
    defaultVariants: { size: 'default', invalid: false },
  }
);

export type ComboboxProps = VariantProps<typeof comboboxTriggerVariants>;

export type ComboboxOption = {
  label: string;
  value: any;
  disabled?: boolean;
  /** Extra terms that should also match this option when searching. */
  keywords?: string[];
};

/**
 * A searchable single-select: a button that opens a `tolle-command` list in a
 * floating panel. Implements `ControlValueAccessor`, so it works with
 * `ngModel` and reactive forms.
 *
 * Use `tolle-select` when the list is short and needs no search, and
 * `tolle-multi-select` when more than one value can be chosen.
 * @new
 */
@Component({
  selector: 'tolle-combobox',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [
    CommonModule,
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandEmptyComponent,
    CommandItemComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true,
    },
  ],
  template: `
    <button
      #trigger
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      [attr.aria-expanded]="isOpen"
      [attr.aria-controls]="isOpen ? panelId : null"
      [attr.aria-label]="ariaLabel || null"
      [attr.data-state]="isOpen ? 'open' : 'closed'"
      [disabled]="disabled"
      [class]="computedTriggerClass"
      (click)="toggle()"
      (keydown)="onTriggerKeyDown($event)"
    >
      <span [class]="cn('truncate', selectedLabel ? 'text-foreground' : 'text-muted-foreground')">
        {{ selectedLabel || placeholder }}
      </span>
      <i
        class="ri-expand-up-down-line shrink-0 text-muted-foreground transition-transform"
        aria-hidden="true"
      ></i>
    </button>

    <div
      *ngIf="isOpen"
      #panel
      [id]="panelId"
      class="fixed left-0 top-0 z-[9999]"
      style="visibility: hidden"
    >
      <div class="overflow-hidden rounded-md border border-border bg-popover shadow-md">
        <tolle-command [shouldFilter]="shouldFilter" (selected)="onSelect($event)" (queryChange)="searchChange.emit($event)">
          <tolle-command-input [placeholder]="searchPlaceholder"></tolle-command-input>
          <tolle-command-list>
            <tolle-command-empty>{{ emptyMessage }}</tolle-command-empty>
            <tolle-command-item
              *ngFor="let option of options"
              [value]="option.value"
              [label]="option.label"
              [keywords]="option.keywords || []"
              [disabled]="option.disabled || false"
            >
              <i
                class="ri-check-line shrink-0"
                [class.opacity-0]="option.value !== value"
                aria-hidden="true"
              ></i>
              <span class="truncate">{{ option.label }}</span>
            </tolle-command-item>
          </tolle-command-list>
        </tolle-command>
      </div>
    </div>
  `,
})
export class ComboboxComponent implements ControlValueAccessor, OnDestroy {
  /** Options to choose from. @default [] */
  @Input() options: ComboboxOption[] = [];
  /** Text shown on the trigger when nothing is selected. @default 'Select an option…' */
  @Input() placeholder = 'Select an option…';
  /** Placeholder inside the search box. @default 'Search…' */
  @Input() searchPlaceholder = 'Search…';
  /** Message shown when the query matches no option. @default 'No results found.' */
  @Input() emptyMessage = 'No results found.';
  /** Height and text size of the trigger. @default 'default' */
  @Input() size: ComboboxProps['size'] = 'default';
  /** Applies the destructive border and focus ring. @default false */
  @Input() invalid = false;
  /** Disables the control. @default false */
  @Input() disabled = false;
  /** Set false to filter the options yourself, e.g. server-side. @default true */
  @Input() shouldFilter = true;
  /** Close the panel after a value is chosen. @default true */
  @Input() closeOnSelect = true;
  /** Where the panel opens relative to the trigger. @default 'bottom-start' */
  @Input() placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' = 'bottom-start';
  /** Accessible name when there is no associated visible label. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the chosen value whenever the selection changes. */
  @Output() valueChange = new EventEmitter<any>();
  /** Emitted with the query text as the user searches. */
  @Output() searchChange = new EventEmitter<string>();
  /** Emitted when the panel opens. */
  @Output() opened = new EventEmitter<void>();
  /** Emitted when the panel closes. */
  @Output() closed = new EventEmitter<void>();

  @ViewChild('trigger') triggerEl?: ElementRef<HTMLElement>;
  @ViewChild('panel') panelEl?: ElementRef<HTMLElement>;

  readonly panelId = `combobox-panel-${Math.random().toString(36).slice(2, 11)}`;

  value: any = null;
  isOpen = false;
  protected cn = cn;

  private cleanup?: () => void;
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  private readonly outsideClickHandler = (event: MouseEvent) => {
    const target = event.target as Node;
    if (
      !this.triggerEl?.nativeElement.contains(target) &&
      !this.panelEl?.nativeElement.contains(target)
    ) {
      this.close();
    }
  };

  private readonly escapeHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.isOpen) {
      event.preventDefault();
      this.close();
      this.triggerEl?.nativeElement.focus();
    }
  };

  get selectedLabel(): string {
    return this.options.find((o) => o.value === this.value)?.label ?? '';
  }

  get computedTriggerClass() {
    return cn(comboboxTriggerVariants({ size: this.size, invalid: this.invalid }), this.class);
  }

  toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  open(): void {
    if (this.disabled || this.isOpen) return;
    this.isOpen = true;
    this.opened.emit();
    this.cdr.markForCheck();

    setTimeout(() => {
      this.updatePosition();
      // Focus the search box so the user can type straight away.
      this.panelEl?.nativeElement.querySelector('input')?.focus();
      document.addEventListener('pointerdown', this.outsideClickHandler, true);
      document.addEventListener('keydown', this.escapeHandler, true);
    });
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.closed.emit();
    this.onTouched();
    this.teardown();
    this.cdr.markForCheck();
  }

  onTriggerKeyDown(event: KeyboardEvent): void {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key) && !this.isOpen) {
      event.preventDefault();
      this.open();
    }
  }

  onSelect(value: any): void {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
    if (this.closeOnSelect) {
      this.close();
      this.triggerEl?.nativeElement.focus();
    }
    this.cdr.markForCheck();
  }

  private updatePosition(): void {
    const trigger = this.triggerEl?.nativeElement;
    const panel = this.panelEl?.nativeElement;
    if (!trigger || !panel) return;

    this.cleanup = autoUpdate(trigger, panel, () => {
      computePosition(trigger, panel, {
        placement: this.placement,
        middleware: [
          offset(4),
          flip(),
          shift({ padding: 8 }),
          // Match the panel to the trigger width and cap its height to the space
          // actually available, so the list scrolls instead of overflowing.
          size({
            padding: 8,
            apply({ rects, availableHeight, elements }) {
              Object.assign(elements.floating.style, {
                minWidth: `${rects.reference.width}px`,
                maxHeight: `${Math.max(160, availableHeight)}px`,
              });
            },
          }),
        ],
      }).then(({ x, y }) => {
        Object.assign(panel.style, {
          left: `${x}px`,
          top: `${y}px`,
          visibility: 'visible',
        });
      });
    });
  }

  private teardown(): void {
    this.cleanup?.();
    this.cleanup = undefined;
    document.removeEventListener('pointerdown', this.outsideClickHandler, true);
    document.removeEventListener('keydown', this.escapeHandler, true);
  }

  ngOnDestroy(): void {
    this.teardown();
  }

  writeValue(value: any): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
}
