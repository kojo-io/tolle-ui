import { Component, input, forwardRef, ElementRef, viewChild, HostListener, signal, computed, inject } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-slider',
  standalone: true,
  imports: [],
  template: `
    <div
      #container
      [class]="cn('relative flex w-full touch-none select-none items-center py-4 cursor-pointer', class(), disabled() ? 'opacity-50 pointer-events-none' : '')"
      (pointerdown)="onPointerDown($event)"
      >
      <!-- Track -->
      <div class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
        <div
          class="absolute h-full bg-primary transition-all duration-75"
          [style.left.%]="rangeStart()"
          [style.width.%]="rangeWidth()"
        ></div>
      </div>
    
      <!-- Thumbs -->
      @for (val of values(); track i; let i = $index) {
        <div
          class="absolute block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary cursor-grab active:cursor-grabbing z-10"
          [style.left.%]="getPercentage(val)"
          [style.transform]="'translateX(-50%)'"
          [attr.tabindex]="disabled() ? null : 0"
          [attr.role]="'slider'"
          [attr.aria-valuenow]="val"
          [attr.aria-valuemin]="min()"
          [attr.aria-valuemax]="max()"
          (keydown)="onKeyDown($event, i)"
          (focus)="activeIndex.set(i)"
        ></div>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ],
  styles: [`
    :host { display: block; width: 100%; }
  `]
})
export class SliderComponent implements ControlValueAccessor {
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(1);
  disabled = input<boolean>(false);
  class = input<string>('');

  container = viewChild<ElementRef<HTMLElement>>('container');

  values = signal<number[]>([0]);
  activeIndex = signal<number>(-1);
  isDragging = signal(false);

  onChange: (val: any) => void = () => { };
  onTouched: () => void = () => { };

  isRange = computed(() => this.values().length > 1);

  rangeStart = computed(() => {
    if (!this.isRange()) return 0;
    const minVal = Math.min(...this.values());
    return this.getPercentage(minVal);
  });

  rangeWidth = computed(() => {
    const vals = this.values();
    if (!this.isRange()) {
      return this.getPercentage(vals[0]);
    }
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    return this.getPercentage(maxVal) - this.getPercentage(minVal);
  });

  getPercentage(value: number) {
    const min = this.min();
    const max = this.max();
    const p = ((value - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, p));
  }

  getValueFromPosition(clientX: number) {
    const containerEl = this.container()?.nativeElement;
    if (!containerEl) return this.min();

    const rect = containerEl.getBoundingClientRect();
    const percentage = (clientX - rect.left) / rect.width;
    const min = this.min();
    const max = this.max();
    const step = this.step();

    let value = min + percentage * (max - min);
    value = Math.round(value / step) * step;
    return Math.max(min, Math.min(max, value));
  }

  onPointerDown(event: PointerEvent) {
    if (this.disabled()) return;

    const containerEl = this.container()?.nativeElement;
    if (!containerEl) return;

    this.isDragging.set(true);
    this.onTouched();
    containerEl.setPointerCapture(event.pointerId);

    const newValue = this.getValueFromPosition(event.clientX);
    const currentValues = this.values();

    let closestIndex = 0;
    let minDistance = Math.abs(currentValues[0] - newValue);

    for (let i = 1; i < currentValues.length; i++) {
      const distance = Math.abs(currentValues[i] - newValue);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    this.activeIndex.set(closestIndex);
    this.updateValue(newValue, closestIndex);
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    const active = this.activeIndex();
    if (!this.isDragging() || active === -1) return;

    const newValue = this.getValueFromPosition(event.clientX);
    this.updateValue(newValue, active);
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent) {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    this.container()?.nativeElement.releasePointerCapture(event.pointerId);
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (this.disabled()) return;

    let delta = 0;
    const step = this.step();
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') delta = step;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') delta = -step;

    if (delta !== 0) {
      event.preventDefault();
      const currentValues = this.values();
      const newValue = Math.max(this.min(), Math.min(this.max(), currentValues[index] + delta));
      this.updateValue(newValue, index);
    }
  }

  private updateValue(value: number, index: number) {
    const currentValues = this.values();
    if (currentValues[index] === value) return;

    const newValues = [...currentValues];
    newValues[index] = value;

    if (this.isRange()) {
      const draggingValue = newValues[index];
      newValues.sort((a, b) => a - b);
      this.activeIndex.set(newValues.indexOf(draggingValue));
    }

    this.values.set(newValues);
    this.emitValue();
  }

  private emitValue() {
    const vals = this.values();
    const valueToEmit = this.isRange() ? vals : vals[0];
    this.onChange(valueToEmit);
  }

  writeValue(value: any): void {
    const min = this.min();
    if (value === null || value === undefined) {
      this.values.set([min]);
    } else if (Array.isArray(value)) {
      this.values.set([...value].sort((a: number, b: number) => a - b));
    } else {
      this.values.set([+value]);
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState?(isDisabled: boolean): void {
    // handled by input() signal but CVA protocol might still call this
  }

  protected readonly cn = cn;
}
