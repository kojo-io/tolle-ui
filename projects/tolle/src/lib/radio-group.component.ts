import {Component, Input, forwardRef, AfterContentInit, OnChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from './utils/cn';
import {RadioService} from './radio-service';

@Component({
  selector: 'tolle-radio-group',
  styles: [':host { display: block; }'],
  standalone: true,
  imports: [CommonModule],
  providers: [
    RadioService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ],
  host: {
    '(keydown)': 'onKeydown($event)'
  },
  template: `
    <div [class]="cn('grid gap-2', class)" role="radiogroup">
      <ng-content></ng-content>
    </div>
  `
})
export class RadioGroupComponent implements ControlValueAccessor, OnChanges {
  @Input() class = '';
  @Input() disabled = false;
  @Input() name = `radio-group-${Math.random().toString(36).substring(2, 9)}`;

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
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

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
      next = forward
        ? (current + 1) % items.length
        : (current - 1 + items.length) % items.length;
    }

    const targetItem = items[next];
    this.radioService.select(targetItem.value);
    targetItem.focusItem();
  }

  protected readonly cn = cn;
}
