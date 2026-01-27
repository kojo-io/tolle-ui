import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from '../../../../../../tolle/src/lib/slider.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';

@Component({
  selector: 'app-slider-interactive',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SliderComponent,
    PlaygroundComponent,
    LabelComponent,
    InputComponent,
    SwitchComponent
  ],
  template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <div class="w-full max-w-sm">
             <div class="flex items-center justify-between mb-4">
                <tolle-label>Value: {{ displayValue }}</tolle-label>
             </div>
             <tolle-slider 
               [(ngModel)]="value" 
               [min]="min" 
               [max]="max" 
               [step]="step"
               [disabled]="isDisabled"
             ></tolle-slider>
          </div>
        </div>

        <div controls class="space-y-4">
          <div class="flex items-center justify-between">
             <tolle-label>Range Mode</tolle-label>
             <tolle-switch 
               [ngModel]="isRange" 
               (ngModelChange)="toggleRangeMode($event)"
             ></tolle-switch>
          </div>
          <div class="space-y-2">
            <tolle-label>Min</tolle-label>
            <tolle-input type="number" [(ngModel)]="min" />
          </div>
          <div class="space-y-2">
            <tolle-label>Max</tolle-label>
            <tolle-input type="number" [(ngModel)]="max" />
          </div>
          <div class="space-y-2">
            <tolle-label>Step</tolle-label>
            <tolle-input type="number" [(ngModel)]="step" />
          </div>
          <div class="flex items-center justify-between">
             <tolle-label>Disabled</tolle-label>
             <tolle-switch [(ngModel)]="isDisabled"></tolle-switch>
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class SliderInteractiveComponent {
  value: any = 50;
  min = 0;
  max = 100;
  step = 1;
  isDisabled = false;

  get isRange() {
    return Array.isArray(this.value);
  }

  get displayValue() {
    return this.isRange ? `[${this.value.join(', ')}]` : this.value;
  }

  toggleRangeMode(isRange: boolean) {
    if (isRange) {
      this.value = [20, 80];
    } else {
      this.value = 50;
    }
  }

  get playgroundCode() {
    const minAttr = this.min !== 0 ? ` [min]="${this.min}"` : '';
    const maxAttr = this.max !== 100 ? ` [max]="${this.max}"` : '';
    const stepAttr = this.step !== 1 ? ` [step]="${this.step}"` : '';
    const disabledAttr = this.isDisabled ? ` [disabled]="true"` : '';
    const valueStr = this.isRange ? `[${this.value.join(', ')}]` : this.value;

    return `// In component:
value = ${valueStr};

// In template:
<tolle-slider [(ngModel)]="value"${minAttr}${maxAttr}${stepAttr}${disabledAttr}></tolle-slider>`;
  }
}
