import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

/* ------------------------------------------------------------------ *
 * Pure time helpers
 *
 * The wire format is a 24-hour `HH:mm` / `HH:mm:ss` string. It is
 * timezone-free and stable across serialisation, which a `Date` is not:
 * a `Date` carries a calendar day and a UTC offset that nobody chose when
 * all the user did was pick "2:30 PM".
 * ------------------------------------------------------------------ */

/** A wall-clock time with no date and no timezone attached. */
export interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

const pad2 = (n: number): string => (n < 10 ? '0' + n : String(n));

/** Seconds elapsed since midnight for a wall-clock time. */
export function timePartsToSeconds(parts: TimeParts): number {
  return parts.hour * 3600 + parts.minute * 60 + parts.second;
}

/**
 * Parses `HH:mm` or `HH:mm:ss` (24-hour). Returns `null` for anything that
 * is not a well-formed, in-range time — callers treat that as "no value".
 */
export function parseTimeString(value: string | null | undefined): TimeParts | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(value.trim());
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] === undefined ? 0 : Number(match[3]);

  if (hour > 23 || minute > 59 || second > 59) return null;
  return { hour, minute, second };
}

/** Renders a wall-clock time as `HH:mm`, or `HH:mm:ss` when `withSeconds`. */
export function formatTimeString(parts: TimeParts, withSeconds = false): string {
  const base = pad2(parts.hour) + ':' + pad2(parts.minute);
  return withSeconds ? base + ':' + pad2(parts.second) : base;
}

/**
 * 24-hour hour to its 12-hour clock face. Midnight is `12 AM` and noon is
 * `12 PM` — the two values that a naive `hour % 12` gets wrong.
 */
export function to12Hour(hour24: number): { hour12: number; meridiem: 'AM' | 'PM' } {
  const meridiem: 'AM' | 'PM' = hour24 < 12 ? 'AM' : 'PM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, meridiem };
}

/** 12-hour clock face back to a 24-hour hour. `12 AM` is 0, `12 PM` is 12. */
export function from12Hour(hour12: number, meridiem: 'AM' | 'PM'): number {
  const base = hour12 % 12; // 12 -> 0, leaves 1..11 alone
  return meridiem === 'PM' ? base + 12 : base;
}

/* ------------------------------------------------------------------ *
 * Column model
 * ------------------------------------------------------------------ */

/** Which unit a column of the picker scrolls through. */
export type TimeColumnKind = 'hour' | 'minute' | 'second' | 'meridiem';

/** One entry inside a time column. */
export interface TimeOption {
  /** Stable identity for `trackBy` and `aria-activedescendant`. */
  id: string;
  /** Text shown to the user. */
  label: string;
  /**
   * The 24-hour value this entry commits for its column. For a `meridiem`
   * column this is the resulting 24-hour *hour*.
   */
  raw: number;
  /** Value used for the selected comparison (clock-face value for hours). */
  face: number;
  disabled: boolean;
}

/** A scrollable column of the picker. */
export interface TimeColumn {
  kind: TimeColumnKind;
  label: string;
  options: TimeOption[];
}

const SECONDS_PER_DAY = 24 * 3600;

const timeOptionVariants = cva(
  'flex w-full shrink-0 cursor-pointer select-none items-center justify-center rounded-md tabular-nums ' +
    'transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      size: {
        xs: 'h-6 px-2 text-[11px]',
        sm: 'h-7 px-2 text-xs',
        default: 'h-8 px-2.5 text-sm',
        lg: 'h-9 px-3 text-base',
      },
      selected: {
        true: 'bg-primary text-primary-foreground hover:bg-primary',
        false: 'text-foreground hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: { size: 'default', selected: false },
  }
);

/** Variant props for the option rows inside a time column. */
export type TimeColumnsProps = VariantProps<typeof timeOptionVariants>;

/**
 * The bare scrollable hour / minute / second / AM-PM columns, with no trigger
 * and no popover of its own.
 *
 * `tolle-time-picker` wraps this in a floating panel, and
 * `tolle-date-time-picker` sits it beside a calendar — so the option
 * generation, the min/max disabling and the roving keyboard model live here
 * once instead of in both.
 */
@Component({
  selector: 'tolle-time-columns',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cn('flex items-stretch gap-1', class)">
      <div
        *ngFor="let column of columns; let ci = index; trackBy: trackColumn"
        class="flex flex-col"
      >
        <div class="px-1 pb-1 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {{ column.label }}
        </div>
        <div
          #listbox
          role="listbox"
          tabindex="0"
          [attr.aria-label]="column.label"
          [attr.aria-activedescendant]="activeDescendantFor(ci)"
          (keydown)="onColumnKeydown($event, ci)"
          [class]="cn(
            'flex flex-col gap-0.5 overflow-y-auto scroll-smooth rounded-md p-1',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            column.kind === 'meridiem' ? 'w-14' : 'w-14',
            heightClass
          )"
        >
          <button
            *ngFor="let option of column.options; trackBy: trackOption"
            type="button"
            role="option"
            tabindex="-1"
            [id]="option.id"
            [attr.aria-selected]="isSelected(column, option)"
            [attr.aria-disabled]="option.disabled"
            [attr.data-selected]="isSelected(column, option)"
            [attr.data-active]="isActive(ci, option)"
            [disabled]="option.disabled"
            [class]="optionClass(column, option, ci)"
            (click)="choose(column, option, ci)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TimeColumnsComponent implements OnInit, OnChanges {
  /** Selected hour in 24-hour form, or `null` when nothing is chosen yet. @default null */
  @Input() hour: number | null = null;
  /** Selected minute, or `null` when nothing is chosen yet. @default null */
  @Input() minute: number | null = null;
  /** Selected second, or `null` when nothing is chosen yet. @default null */
  @Input() second: number | null = null;
  /** Renders a 12-hour clock face with an AM/PM column. @default false */
  @Input() use12Hours = false;
  /** Adds the seconds column. @default false */
  @Input() showSeconds = false;
  /** Interval between minute entries, in minutes. @default 1 */
  @Input() minuteStep = 1;
  /** Interval between second entries, in seconds. @default 1 */
  @Input() secondStep = 1;
  /** Earliest selectable time, as seconds since midnight. @default 0 */
  @Input() minSeconds = 0;
  /** Latest selectable time, as seconds since midnight. @default 86399 */
  @Input() maxSeconds = SECONDS_PER_DAY - 1;
  /** Row height and text size of the entries. @default 'default' */
  @Input() size: TimeColumnsProps['size'] = 'default';
  /** Extra Tailwind classes merged onto the column strip via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the full wall-clock time whenever an entry is chosen. */
  @Output() timeChange = new EventEmitter<TimeParts>();

  @ViewChildren('listbox') listboxes?: QueryList<ElementRef<HTMLElement>>;

  readonly columnsId = 'time-col-' + Math.random().toString(36).slice(2, 11);

  /**
   * Built once per input change rather than read from a getter: a getter would
   * hand `*ngFor` a fresh array on every change-detection pass, so every row —
   * each carrying a click handler — would be torn down and rebuilt on every
   * pass.
   */
  columns: TimeColumn[] = [];
  /** Roving active entry per column, for `aria-activedescendant`. */
  activeIndex: number[] = [];

  protected cn = cn;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.columns.length) this.rebuild();
  }

  ngOnChanges(): void {
    this.rebuild();
  }

  get heightClass(): string {
    switch (this.size) {
      case 'xs':
        return 'max-h-[144px]';
      case 'sm':
        return 'max-h-[168px]';
      case 'lg':
        return 'max-h-[216px]';
      default:
        return 'max-h-[192px]';
    }
  }

  /* ---------------- option generation ---------------- */

  private rebuild(): void {
    const step = (value: number, fallback: number) =>
      Number.isFinite(value) && value >= 1 ? Math.floor(value) : fallback;

    const minuteStep = step(this.minuteStep, 1);
    const secondStep = step(this.secondStep, 1);
    const effectiveHour = this.hour ?? 0;
    const effectiveMinute = this.minute ?? 0;
    const meridiem = to12Hour(effectiveHour).meridiem;

    // How far a partially-specified time can stretch. With no seconds column
    // the seconds are pinned to :00, so an hour only reaches :59:00.
    const hourSpan = this.showSeconds ? 3599 : 3540;
    const minuteSpan = this.showSeconds ? 59 : 0;

    const columns: TimeColumn[] = [];

    // Hours
    const hourOptions: TimeOption[] = [];
    if (this.use12Hours) {
      // Clock-face order: 12, 1, 2 … 11.
      const faces = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      for (const face of faces) {
        const raw = from12Hour(face, meridiem);
        hourOptions.push({
          id: this.columnsId + '-hour-' + face,
          label: pad2(face),
          raw,
          face,
          disabled: this.rangeDisabled(raw * 3600, hourSpan),
        });
      }
    } else {
      for (let h = 0; h < 24; h++) {
        hourOptions.push({
          id: this.columnsId + '-hour-' + h,
          label: pad2(h),
          raw: h,
          face: h,
          disabled: this.rangeDisabled(h * 3600, hourSpan),
        });
      }
    }
    columns.push({ kind: 'hour', label: 'Hour', options: hourOptions });

    // Minutes
    const minuteOptions: TimeOption[] = [];
    for (let m = 0; m < 60; m += minuteStep) {
      const start = effectiveHour * 3600 + m * 60;
      minuteOptions.push({
        id: this.columnsId + '-minute-' + m,
        label: pad2(m),
        raw: m,
        face: m,
        disabled: this.rangeDisabled(start, minuteSpan),
      });
    }
    columns.push({ kind: 'minute', label: 'Min', options: minuteOptions });

    // Seconds
    if (this.showSeconds) {
      const secondOptions: TimeOption[] = [];
      for (let s = 0; s < 60; s += secondStep) {
        const at = effectiveHour * 3600 + effectiveMinute * 60 + s;
        secondOptions.push({
          id: this.columnsId + '-second-' + s,
          label: pad2(s),
          raw: s,
          face: s,
          disabled: this.rangeDisabled(at, 0),
        });
      }
      columns.push({ kind: 'second', label: 'Sec', options: secondOptions });
    }

    // Meridiem
    if (this.use12Hours) {
      const face12 = to12Hour(effectiveHour).hour12;
      const meridiemOptions: TimeOption[] = (['AM', 'PM'] as const).map((m, i) => {
        const raw = from12Hour(face12, m);
        const halfStart = m === 'AM' ? 0 : 12 * 3600;
        return {
          id: this.columnsId + '-meridiem-' + m,
          label: m,
          raw,
          face: i, // 0 = AM, 1 = PM
          disabled: this.rangeDisabled(halfStart, 12 * 3600 - 1),
        };
      });
      columns.push({ kind: 'meridiem', label: 'AM/PM', options: meridiemOptions });
    }

    this.columns = columns;
    this.syncActiveToSelection();
  }

  /**
   * True when nothing in `[start, start + span]` falls inside the allowed
   * window — i.e. picking this entry could not produce a legal time.
   */
  private rangeDisabled(start: number, span: number): boolean {
    return start + span < this.minSeconds || start > this.maxSeconds;
  }

  private syncActiveToSelection(): void {
    this.activeIndex = this.columns.map((column) => {
      const idx = column.options.findIndex((o) => this.isSelected(column, o));
      if (idx >= 0) return idx;
      const firstEnabled = column.options.findIndex((o) => !o.disabled);
      return firstEnabled >= 0 ? firstEnabled : 0;
    });
  }

  /* ---------------- selection ---------------- */

  isSelected(column: TimeColumn, option: TimeOption): boolean {
    switch (column.kind) {
      case 'hour':
        if (this.hour === null) return false;
        return this.use12Hours ? to12Hour(this.hour).hour12 === option.face : this.hour === option.face;
      case 'minute':
        return this.minute !== null && this.minute === option.face;
      case 'second':
        return this.second !== null && this.second === option.face;
      case 'meridiem':
        if (this.hour === null) return false;
        return (to12Hour(this.hour).meridiem === 'AM' ? 0 : 1) === option.face;
    }
  }

  isActive(columnIndex: number, option: TimeOption): boolean {
    const column = this.columns[columnIndex];
    if (!column) return false;
    return column.options[this.activeIndex[columnIndex]] === option;
  }

  activeDescendantFor(columnIndex: number): string | null {
    const column = this.columns[columnIndex];
    return column?.options[this.activeIndex[columnIndex]]?.id ?? null;
  }

  optionClass(column: TimeColumn, option: TimeOption, columnIndex: number): string {
    const selected = this.isSelected(column, option);
    return cn(
      timeOptionVariants({ size: this.size, selected }),
      // The roving highlight has to read as distinct from the committed value,
      // otherwise arrowing around looks like it is already selecting.
      !selected && this.isActive(columnIndex, option) && 'bg-accent text-accent-foreground'
    );
  }

  /** Commits `option` in its column and emits the resulting whole time. */
  choose(column: TimeColumn, option: TimeOption, columnIndex: number): void {
    if (option.disabled) return;

    const next: TimeParts = {
      hour: this.hour ?? 0,
      minute: this.minute ?? 0,
      second: this.second ?? 0,
    };

    switch (column.kind) {
      case 'hour':
      case 'meridiem':
        next.hour = option.raw;
        break;
      case 'minute':
        next.minute = option.raw;
        break;
      case 'second':
        next.second = option.raw;
        break;
    }

    this.activeIndex[columnIndex] = column.options.indexOf(option);
    this.timeChange.emit(next);
    this.cdr.markForCheck();
  }

  /* ---------------- keyboard ---------------- */

  onColumnKeydown(event: KeyboardEvent, columnIndex: number): void {
    const column = this.columns[columnIndex];
    if (!column) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveActive(columnIndex, 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveActive(columnIndex, -1);
        break;
      case 'Home':
        event.preventDefault();
        this.setActive(columnIndex, 0, 1);
        break;
      case 'End':
        event.preventDefault();
        this.setActive(columnIndex, column.options.length - 1, -1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.focusColumn(columnIndex - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.focusColumn(columnIndex + 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        {
          const option = column.options[this.activeIndex[columnIndex]];
          if (option) this.choose(column, option, columnIndex);
        }
        break;
      default:
        return;
    }
  }

  private moveActive(columnIndex: number, delta: number): void {
    const current = this.activeIndex[columnIndex] ?? 0;
    this.setActive(columnIndex, current + delta, delta);
  }

  /** Lands on the first enabled entry at or past `index`, walking `direction`. */
  private setActive(columnIndex: number, index: number, direction: number): void {
    const column = this.columns[columnIndex];
    if (!column) return;

    let i = Math.max(0, Math.min(index, column.options.length - 1));
    while (column.options[i]?.disabled) {
      i += direction;
      if (i < 0 || i >= column.options.length) return; // no enabled entry that way
    }

    this.activeIndex[columnIndex] = i;
    this.scrollOptionIntoView(columnIndex, i);
    this.cdr.markForCheck();
  }

  private focusColumn(columnIndex: number): void {
    if (columnIndex < 0 || columnIndex >= this.columns.length) return;
    this.listboxes?.get(columnIndex)?.nativeElement.focus();
  }

  /** Focuses the first column — used when the panel opens. */
  focusFirstColumn(): void {
    this.focusColumn(0);
  }

  /**
   * Centres each column on its selected entry. Scrolls the listbox directly
   * rather than calling `scrollIntoView`, which would also scroll the page
   * behind a fixed-position panel.
   */
  scrollSelectedIntoView(): void {
    this.listboxes?.forEach((ref) => {
      const list = ref.nativeElement;
      const selected = list.querySelector('[data-selected="true"]') as HTMLElement | null;
      if (!selected) return;
      list.scrollTop = selected.offsetTop - list.clientHeight / 2 + selected.clientHeight / 2;
    });
  }

  private scrollOptionIntoView(columnIndex: number, optionIndex: number): void {
    const list = this.listboxes?.get(columnIndex)?.nativeElement;
    if (!list) return;
    const el = list.children[optionIndex] as HTMLElement | undefined;
    if (!el) return;

    if (el.offsetTop < list.scrollTop) {
      list.scrollTop = el.offsetTop;
    } else if (el.offsetTop + el.clientHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = el.offsetTop + el.clientHeight - list.clientHeight;
    }
  }

  trackColumn = (_: number, column: TimeColumn) => column.kind;
  trackOption = (_: number, option: TimeOption) => option.id;
}

/* ------------------------------------------------------------------ *
 * The picker
 * ------------------------------------------------------------------ */

const timePickerTriggerVariants = cva(
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

/** Variant props for the time picker trigger. */
export type TimePickerProps = VariantProps<typeof timePickerTriggerVariants>;

/**
 * A trigger that opens scrollable hour / minute / second columns in a floating
 * panel.
 *
 * The value is a **24-hour `HH:mm` string** (or `HH:mm:ss` when `showSeconds`),
 * regardless of whether the face is rendered as 12-hour — a wall-clock time has
 * no date and no timezone, and a `Date` would invent both. Set
 * `valueType="date"` to exchange `Date` objects instead, in which case the time
 * is written onto today's date (or onto the date already held by the control).
 *
 * Implements `ControlValueAccessor`, so it works with `ngModel` and reactive
 * forms. Use `tolle-date-time-picker` when a date is needed alongside.
 * @new
 */
@Component({
  selector: 'tolle-time-picker',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule, TimeColumnsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
  ],
  template: `
    <button
      #trigger
      type="button"
      aria-haspopup="dialog"
      [attr.aria-expanded]="isOpen"
      [attr.aria-controls]="isOpen ? panelId : null"
      [attr.aria-label]="ariaLabel || null"
      [attr.data-state]="isOpen ? 'open' : 'closed'"
      [disabled]="disabled"
      [class]="computedTriggerClass"
      (click)="toggle()"
      (keydown)="onTriggerKeyDown($event)"
    >
      <span [class]="cn('truncate', displayValue ? 'text-foreground' : 'text-muted-foreground')">
        {{ displayValue || placeholder }}
      </span>
      <i class="ri-time-line shrink-0 text-muted-foreground" aria-hidden="true"></i>
    </button>

    <div
      *ngIf="isOpen"
      #panel
      role="dialog"
      [id]="panelId"
      [attr.aria-label]="ariaLabel || 'Choose a time'"
      class="fixed left-0 top-0 z-[9999]"
      style="visibility: hidden"
    >
      <div class="rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md">
        <tolle-time-columns
          #columns
          [hour]="hour"
          [minute]="minute"
          [second]="second"
          [use12Hours]="use12Hours"
          [showSeconds]="showSeconds"
          [minuteStep]="minuteStep"
          [secondStep]="secondStep"
          [minSeconds]="minSeconds"
          [maxSeconds]="maxSeconds"
          [size]="size"
          (timeChange)="onTimeChange($event)"
        ></tolle-time-columns>
      </div>
    </div>
  `,
})
export class TimePickerComponent implements ControlValueAccessor, OnDestroy {
  /** Text shown on the trigger when no time is selected. @default 'Select a time' */
  @Input() placeholder = 'Select a time';
  /** Disables the control. @default false */
  @Input() disabled = false;
  /** Renders a 12-hour face with an AM/PM column. The emitted value stays 24-hour. @default false */
  @Input() use12Hours = false;
  /** Adds a seconds column and emits `HH:mm:ss`. @default false */
  @Input() showSeconds = false;
  /** Interval between minute entries, in minutes. @default 1 */
  @Input() minuteStep = 1;
  /** Interval between second entries, in seconds. @default 1 */
  @Input() secondStep = 1;
  /** Earliest selectable time as a 24-hour `HH:mm` string; earlier entries are disabled. */
  @Input() min?: string;
  /** Latest selectable time as a 24-hour `HH:mm` string; later entries are disabled. */
  @Input() max?: string;
  /** Height and text size of the trigger and entries. @default 'default' */
  @Input() size: TimePickerProps['size'] = 'default';
  /** Applies the destructive border and focus ring. @default false */
  @Input() invalid = false;
  /** Accessible name when there is no associated visible label. @default '' */
  @Input() ariaLabel = '';
  /** Exchange `Date` objects instead of `HH:mm` strings through the form control. @default 'string' */
  @Input() valueType: 'string' | 'date' = 'string';
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the chosen time whenever it changes. */
  @Output() valueChange = new EventEmitter<string | Date | null>();
  /** Emitted when the panel opens. */
  @Output() opened = new EventEmitter<void>();
  /** Emitted when the panel closes. */
  @Output() closed = new EventEmitter<void>();

  @ViewChild('trigger') triggerEl?: ElementRef<HTMLElement>;
  @ViewChild('panel') panelEl?: ElementRef<HTMLElement>;
  @ViewChild('columns') columnsCmp?: TimeColumnsComponent;

  readonly panelId = 'time-picker-panel-' + Math.random().toString(36).slice(2, 11);

  hour: number | null = null;
  minute: number | null = null;
  second: number | null = null;
  isOpen = false;

  protected cn = cn;

  private cleanup?: () => void;
  /** The date half of a `Date` value, kept so round-tripping does not move the day. */
  private dateAnchor: Date | null = null;
  private onChange: (value: string | Date | null) => void = () => {};
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

  /* ---------------- derived ---------------- */

  /** The current selection as wall-clock parts, or `null` when incomplete. */
  get parts(): TimeParts | null {
    if (this.hour === null || this.minute === null) return null;
    return { hour: this.hour, minute: this.minute, second: this.second ?? 0 };
  }

  get displayValue(): string {
    const parts = this.parts;
    if (!parts) return '';

    if (this.use12Hours) {
      const { hour12, meridiem } = to12Hour(parts.hour);
      const body =
        String(hour12) +
        ':' +
        pad2(parts.minute) +
        (this.showSeconds ? ':' + pad2(parts.second) : '');
      return body + ' ' + meridiem;
    }
    return formatTimeString(parts, this.showSeconds);
  }

  get minSeconds(): number {
    const parsed = parseTimeString(this.min);
    return parsed ? timePartsToSeconds(parsed) : 0;
  }

  get maxSeconds(): number {
    const parsed = parseTimeString(this.max);
    return parsed ? timePartsToSeconds(parsed) : SECONDS_PER_DAY - 1;
  }

  get computedTriggerClass(): string {
    return cn(timePickerTriggerVariants({ size: this.size, invalid: this.invalid }), this.class);
  }

  /* ---------------- open / close ---------------- */

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
      this.columnsCmp?.scrollSelectedIntoView();
      this.columnsCmp?.focusFirstColumn();
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

  /* ---------------- value ---------------- */

  onTimeChange(parts: TimeParts): void {
    this.hour = parts.hour;
    this.minute = parts.minute;
    this.second = parts.second;
    this.emit();
    this.cdr.markForCheck();
  }

  private emit(): void {
    const value = this.currentValue();
    this.onChange(value);
    this.valueChange.emit(value);
  }

  private currentValue(): string | Date | null {
    const parts = this.parts;
    if (!parts) return null;
    if (this.valueType === 'date') {
      const base = this.dateAnchor ?? new Date();
      return new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        parts.hour,
        parts.minute,
        parts.second,
        0
      );
    }
    return formatTimeString(parts, this.showSeconds);
  }

  private updatePosition(): void {
    const trigger = this.triggerEl?.nativeElement;
    const panel = this.panelEl?.nativeElement;
    if (!trigger || !panel) return;

    this.cleanup = autoUpdate(trigger, panel, () => {
      computePosition(trigger, panel, {
        strategy: 'fixed',
        placement: 'bottom-start',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        Object.assign(panel.style, {
          left: x + 'px',
          top: y + 'px',
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

  /* ---------------- ControlValueAccessor ---------------- */

  writeValue(value: string | Date | null | undefined): void {
    let parts: TimeParts | null = null;

    if (value instanceof Date && !isNaN(value.getTime())) {
      this.dateAnchor = value;
      parts = { hour: value.getHours(), minute: value.getMinutes(), second: value.getSeconds() };
    } else if (typeof value === 'string') {
      parts = parseTimeString(value);
    }

    this.hour = parts ? parts.hour : null;
    this.minute = parts ? parts.minute : null;
    this.second = parts ? parts.second : null;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string | Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) this.close();
    this.cdr.markForCheck();
  }
}
