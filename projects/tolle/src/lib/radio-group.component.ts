import { Component, Input, forwardRef, AfterContentInit, OnChanges } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from './utils/cn';
import { RadioService } from './radio-service';
import {
  FormControlLabelComponent,
  FormControlMessageComponent,
  describedBy,
  hasMessage,
} from './form-control-label.component';

@Component({
  selector: 'tolle-radio-group',
  styles: [':host { display: block; }'],
  imports: [FormControlLabelComponent, FormControlMessageComponent],
  providers: [
    RadioService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  host: {
    '(keydown)': 'onKeydown($event)',
    // The id names the group's label/hint elements; keep it off the host.
    '[attr.id]': 'null',
  },
  template: `
    @if (label) {
      <tolle-form-control-label [labelId]="id + '-label'" [disabled]="disabled">{{ label }}</tolle-form-control-label>
    }
    <div
      [class]="cn('grid gap-2', class)"
      role="radiogroup"
      [attr.aria-labelledby]="label ? id + '-label' : null"
      [attr.aria-invalid]="error || null"
      [attr.aria-describedby]="describedBy(id, hint, errorMessage, error, disabled)">
      <ng-content></ng-content>
    </div>
    @if (hasMessage(hint, errorMessage, error, disabled)) {
      <tolle-form-control-message [controlId]="id" [hint]="hint" [errorMessage]="errorMessage" [error]="error" />
    }
  `,
})
export class RadioGroupComponent implements ControlValueAccessor, OnChanges {
  /** Extra Tailwind classes merged onto the options grid via `cn()` (last-wins). @default '' */
  @Input() class = '';
  /** Disables every option. @default false */
  @Input() disabled = false;
  /** Shared `name` of the underlying radios. @default auto-generated */
  @Input() name = `radio-group-${Math.random().toString(36).substring(2, 9)}`;
  /** Base id for the group's label and message elements. @default auto-generated */
  @Input() id = `tolle-radio-group-${Math.random().toString(36).slice(2, 11)}`;
  /** Group label shown above the options and used as the radiogroup's accessible name. @default '' */
  @Input() label = '';
  /** Help text shown below the options while there is no error. @default '' */
  @Input() hint = '';
  /** Error text shown below the options while `error` is true. @default '' */
  @Input() errorMessage = '';
  /** Marks the group invalid: `aria-invalid` and shows `errorMessage`. @default false */
  @Input() error = false;

  protected readonly describedBy = describedBy;
  protected readonly hasMessage = hasMessage;

  value: any;
  onChange: any = () => {};
  onTouched: any = () => {};

  /** Suppresses onChange while applying a programmatic writeValue(). */
  private suppress = false;

  constructor(private radioService: RadioService) {
    this.radioService.selectedValue$.subscribe(val => {
      this.value = val;
      if (!this.suppress) {
        this.onChange(val);
        this.onTouched();
      }
    });
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.radioService.setDisabled(isDisabled);
  }

  ngOnChanges() {
    this.radioService.setDisabled(this.disabled);
  }

  writeValue(value: any): void {
    this.value = value;
    this.suppress = true;
    this.radioService.select(value);
    this.suppress = false;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * WAI-ARIA radio group keyboard nav: Arrow Down/Right select+focus the next
   * enabled item, Arrow Up/Left the previous. Wraps around and skips disabled
   * items; moving selection also moves focus.
   */
  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;

    const key = event.key;
    const forward = key === 'ArrowDown' || key === 'ArrowRight';
    const backward = key === 'ArrowUp' || key === 'ArrowLeft';
    if (!forward && !backward) return;

    const items = this.radioService.getEnabledItems();
    if (!items.length) return;

    event.preventDefault();

    const target = event.target as HTMLElement | null;
    let current = target
      ? items.findIndex(i => i.hostElement === target || i.hostElement.contains(target))
      : -1;
    if (current < 0) {
      // Fall back to the currently selected item.
      current = items.findIndex(i => i.value === this.value);
    }

    let next: number;
    if (current < 0) {
      next = forward ? 0 : items.length - 1;
    } else {
      next = forward ? (current + 1) % items.length : (current - 1 + items.length) % items.length;
    }

    const targetItem = items[next];
    this.radioService.select(targetItem.value);
    targetItem.focusItem();
  }

  protected readonly cn = cn;
}
