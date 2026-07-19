import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  forwardRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import { PopoverComponent } from './popover.component';
import {
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandItemComponent,
} from './command.component';

/** One model the user can pick. Deliberately provider-agnostic. */
export type ModelOption = {
  /** Stable identifier written back through the form control. */
  id: string;
  /** Human-readable model name. */
  name: string;
  /** Vendor or family; when present the list is grouped by it. */
  provider?: string;
  /** One-line summary shown under the name. */
  description?: string;
  /** Short tag rendered as a pill, e.g. "new" or "preview". */
  badge?: string;
  /** Prevents the option from being chosen. */
  disabled?: boolean;
};

/** A provider heading and the models filed under it. */
export type ModelSelectorGroup = { provider: string; models: ModelOption[] };

const modelSelectorTriggerVariants = cva(
  'inline-flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background text-foreground shadow-sm transition-colors ' +
    'focus:outline-none focus-visible:border-primary/80 focus-visible:ring-4 focus-visible:ring-ring/30 ' +
    'disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-2.5 text-xs',
        default: 'h-9 px-3 text-sm',
        lg: 'h-10 px-3.5 text-sm',
      },
      variant: {
        default: '',
        ghost: 'border-transparent bg-transparent shadow-none hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: { size: 'default', variant: 'default' },
  }
);

export type ModelSelectorProps = VariantProps<typeof modelSelectorTriggerVariants>;

/**
 * A compact picker for choosing which model a conversation should use.
 *
 * Implements `ControlValueAccessor`, so it binds with `ngModel` or a reactive
 * form control and round-trips the chosen model's `id`. Searching, keyboard
 * navigation and positioning are reused from `tolle-command` and
 * `tolle-popover` rather than reimplemented here.
 *
 * ```html
 * <tolle-model-selector [models]="models" [(ngModel)]="modelId"></tolle-model-selector>
 * ```
 * @new
 */
@Component({
  selector: 'tolle-model-selector',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [
    CommonModule,
    PopoverComponent,
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandEmptyComponent,
    CommandGroupComponent,
    CommandItemComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ModelSelectorComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tolle-popover [placement]="placement" (onClose)="onPopoverClose()">
      <button
        trigger
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        [attr.aria-label]="ariaLabel || 'Select a model'"
        [disabled]="disabled"
        [class]="computedTriggerClass"
      >
        <i *ngIf="icon" [class]="icon + ' shrink-0 text-muted-foreground'" aria-hidden="true"></i>
        <span [class]="selected ? 'truncate text-foreground' : 'truncate text-muted-foreground'">{{ triggerLabel }}</span>
        <i class="ri-expand-up-down-line shrink-0 text-muted-foreground" aria-hidden="true"></i>
      </button>

      <div class="w-72 overflow-hidden rounded-md border border-border bg-popover shadow-md">
        <tolle-command [ariaLabel]="ariaLabel || 'Select a model'" (selected)="onSelect($event)">
          <tolle-command-input *ngIf="searchable" [placeholder]="searchPlaceholder"></tolle-command-input>
          <tolle-command-list>
            <tolle-command-empty>{{ emptyMessage }}</tolle-command-empty>
            <tolle-command-group *ngFor="let group of groups" [heading]="group.provider">
              <tolle-command-item
                *ngFor="let model of group.models"
                [value]="model.id"
                [label]="model.name"
                [keywords]="[model.provider || '', model.description || '']"
                [disabled]="model.disabled || false"
                class="items-start"
              >
                <i
                  class="ri-check-line mt-0.5 shrink-0 text-primary"
                  [class.opacity-0]="model.id !== value"
                  aria-hidden="true"
                ></i>
                <span class="flex min-w-0 flex-1 flex-col">
                  <span class="flex items-center gap-1.5">
                    <span class="truncate font-medium">{{ model.name }}</span>
                    <span
                      *ngIf="model.badge"
                      class="shrink-0 rounded-full border border-border bg-muted px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                      >{{ model.badge }}</span
                    >
                  </span>
                  <span *ngIf="model.description" class="truncate text-xs text-muted-foreground">{{ model.description }}</span>
                </span>
              </tolle-command-item>
            </tolle-command-group>
          </tolle-command-list>
        </tolle-command>
      </div>
    </tolle-popover>
  `,
})
export class ModelSelectorComponent implements ControlValueAccessor, OnChanges {
  /** Models to choose from; grouped by `provider` when that field is set. @default [] */
  @Input() models: ModelOption[] = [];
  /** Text shown on the trigger when nothing is selected. @default 'Select a model' */
  @Input() placeholder = 'Select a model';
  /** Placeholder inside the search box. @default 'Search models…' */
  @Input() searchPlaceholder = 'Search models…';
  /** Message shown when the query matches no model. @default 'No models found.' */
  @Input() emptyMessage = 'No models found.';
  /** Shows the search box above the list. @default true */
  @Input() searchable = true;
  /** Prefixes the selected model's name with its provider on the trigger. @default false */
  @Input() showProviderOnTrigger = false;
  /** Height and text size of the trigger. @default 'default' */
  @Input() size: ModelSelectorProps['size'] = 'default';
  /** Visual style of the trigger. @default 'default' */
  @Input() variant: ModelSelectorProps['variant'] = 'default';
  /** Optional remixicon class shown at the start of the trigger. @default 'ri-sparkling-line' */
  @Input() icon = 'ri-sparkling-line';
  /** Where the list opens relative to the trigger. @default 'bottom-start' */
  @Input() placement: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' = 'bottom-start';
  /** Disables the control. @default false */
  @Input() disabled = false;
  /** Accessible name for the trigger and list. @default '' */
  @Input() ariaLabel = '';
  /** Extra Tailwind classes merged onto the trigger via `cn()` (last-wins). */
  @Input() class = '';

  /** Emitted with the chosen model's `id` whenever the selection changes. */
  @Output() valueChange = new EventEmitter<string | null>();
  /** Emitted with the whole `ModelOption` whenever the selection changes. */
  @Output() modelChange = new EventEmitter<ModelOption | null>();

  @ViewChild(PopoverComponent) popover?: PopoverComponent;

  /** Id of the currently selected model, or `null`. */
  value: string | null = null;
  /** Models bucketed by provider, recomputed whenever `models` changes. */
  groups: ModelSelectorGroup[] = [];

  private readonly cdr = inject(ChangeDetectorRef);
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnChanges(): void {
    this.groups = this.groupModels(this.models);
  }

  /** The selected `ModelOption`, or `null` when the value matches nothing. */
  get selected(): ModelOption | null {
    return this.models.find((model) => model.id === this.value) ?? null;
  }

  get triggerLabel(): string {
    const selected = this.selected;
    if (!selected) return this.placeholder;
    return this.showProviderOnTrigger && selected.provider
      ? selected.provider + ' / ' + selected.name
      : selected.name;
  }

  get computedTriggerClass() {
    return cn(
      modelSelectorTriggerVariants({ size: this.size, variant: this.variant }),
      this.class
    );
  }

  onSelect(id: string): void {
    this.value = id;
    this.onChange(id);
    this.valueChange.emit(id);
    this.modelChange.emit(this.selected);
    this.popover?.close();
    this.cdr.markForCheck();
  }

  onPopoverClose(): void {
    this.onTouched();
  }

  /**
   * Buckets models by provider, preserving input order both between and within
   * groups. Models with no provider land in a single unlabelled group so a flat
   * list still renders.
   */
  private groupModels(models: ModelOption[]): ModelSelectorGroup[] {
    const groups: ModelSelectorGroup[] = [];
    const byProvider = new Map<string, ModelSelectorGroup>();

    for (const model of models) {
      const provider = model.provider ?? '';
      let group = byProvider.get(provider);
      if (!group) {
        group = { provider, models: [] };
        byProvider.set(provider, group);
        groups.push(group);
      }
      group.models.push(model);
    }

    return groups;
  }

  writeValue(value: string | null): void {
    this.value = value ?? null;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string | null) => void): void {
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
