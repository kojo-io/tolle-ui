import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from './utils/cn';

@Component({
    selector: 'tolle-slider',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div [class]="cn('relative flex w-full touch-none select-none items-center', class)">
      <input
        type="range"
        [min]="min"
        [max]="max"
        [step]="step"
        [disabled]="disabled"
        [(ngModel)]="value"
        (input)="onInput($event)"
        class="absolute w-full h-1.5 opacity-0 cursor-pointer z-20"
      />
      <!-- Track -->
      <div class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
        <div
          class="absolute h-full bg-primary"
          [style.width.%]="percentage"
        ></div>
      </div>
      <!-- Thumb -->
      <div
        class="absolute block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 pointer-events-none z-10"
        [style.left.%]="percentage"
        [style.transform]="'translateX(-' + percentage + '%)'"
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

    value: number = 0;
    cn = cn;

    onChange: any = () => { };
    onTouched: any = () => { };

    get percentage() {
        return ((this.value - this.min) / (this.max - this.min)) * 100;
    }

    onInput(event: any) {
        this.value = +event.target.value;
        this.onChange(this.value);
    }

    writeValue(value: any): void {
        this.value = value || 0;
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
