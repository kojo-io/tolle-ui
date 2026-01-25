import { Component, Input, forwardRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      #container
      [class]="cn('relative flex w-full touch-none select-none items-center py-4 cursor-pointer', class, disabled ? 'opacity-50 pointer-events-none' : '')"
      (pointerdown)="onPointerDown($event)"
    >
      <!-- Track -->
      <div class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
        <div
          class="absolute h-full bg-primary transition-all duration-75"
          [style.left.%]="rangeStart"
          [style.width.%]="rangeWidth"
        ></div>
      </div>
      
      <!-- Thumbs -->
      <div
        *ngFor="let val of values; let i = index"
        class="absolute block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary cursor-grab active:cursor-grabbing z-10"
        [style.left.%]="getPercentage(val)"
        [style.transform]="'translateX(-50%)'"
        [attr.tabindex]="disabled ? null : 0"
        [attr.role]="'slider'"
        [attr.aria-valuenow]="val"
        [attr.aria-valuemin]="min"
        [attr.aria-valuemax]="max"
        (keydown)="onKeyDown($event, i)"
        (focus)="activeIndex = i"
      ></div>
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
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() disabled: boolean = false;
  @Input() class: string = '';

  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;

  values: number[] = [0];
  activeIndex: number = -1;
  isDragging = false;
  cn = cn;

  onChange: any = () => { };
  onTouched: any = () => { };

  get isRange() {
    return this.values.length > 1;
  }

  get rangeStart() {
    if (!this.isRange) return 0;
    const minVal = Math.min(...this.values);
    return this.getPercentage(minVal);
  }

  get rangeWidth() {
    if (!this.isRange) {
      return this.getPercentage(this.values[0]);
    }
    const minVal = Math.min(...this.values);
    const maxVal = Math.max(...this.values);
    return this.getPercentage(maxVal) - this.getPercentage(minVal);
  }

  getPercentage(value: number) {
    const p = ((value - this.min) / (this.max - this.min)) * 100;
    return Math.max(0, Math.min(100, p));
  }

  getValueFromPosition(clientX: number) {
    const rect = this.container.nativeElement.getBoundingClientRect();
    const percentage = (clientX - rect.left) / rect.width;
    let value = this.min + percentage * (this.max - this.min);

    // Snapping to step
    value = Math.round(value / this.step) * this.step;
    return Math.max(this.min, Math.min(this.max, value));
  }

  onPointerDown(event: PointerEvent) {
    if (this.disabled) return;

    this.isDragging = true;
    this.onTouched();
    this.container.nativeElement.setPointerCapture(event.pointerId);

    const newValue = this.getValueFromPosition(event.clientX);

    // Find closest thumb
    let closestIndex = 0;
    let minDistance = Math.abs(this.values[0] - newValue);

    for (let i = 1; i < this.values.length; i++) {
      const distance = Math.abs(this.values[i] - newValue);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    this.activeIndex = closestIndex;
    this.updateValue(newValue, closestIndex);
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    if (!this.isDragging || this.activeIndex === -1) return;

    const newValue = this.getValueFromPosition(event.clientX);
    this.updateValue(newValue, this.activeIndex);
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.nativeElement.releasePointerCapture(event.pointerId);
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (this.disabled) return;

    let delta = 0;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') delta = this.step;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') delta = -this.step;

    if (delta !== 0) {
      event.preventDefault();
      const newValue = Math.max(this.min, Math.min(this.max, this.values[index] + delta));
      this.updateValue(newValue, index);
    }
  }

  private updateValue(value: number, index: number) {
    if (this.values[index] === value) return;

    const newValues = [...this.values];
    newValues[index] = value;

    if (this.isRange) {
      // Track the value we are dragging
      const draggingValue = newValues[index];

      // Sort
      newValues.sort((a, b) => a - b);

      // Find new index of the dragging value
      // This ensures that the activeIndex follows the thumb even if it crosses another
      this.activeIndex = newValues.indexOf(draggingValue);
    }

    this.values = newValues;
    this.emitValue();
  }

  private emitValue() {
    const valueToEmit = this.isRange ? this.values : this.values[0];
    this.onChange(valueToEmit);
  }

  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.values = [this.min];
    } else if (Array.isArray(value)) {
      this.values = [...value].sort((a, b) => a - b);
    } else {
      this.values = [+value];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
