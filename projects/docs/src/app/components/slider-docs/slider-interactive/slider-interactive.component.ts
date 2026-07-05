import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SliderComponent } from '../../../../../../tolle/src/lib/slider.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';

@Component({
    selector: 'app-slider-interactive',
    imports: [
    FormsModule,
    SliderComponent,
    PlaygroundComponent,
    LabelComponent,
    InputComponent,
    SwitchComponent
],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-xl font-semibold tracking-tight mb-6">Interactive Playground</h2>
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

        <div controls class="space-y-5">
          <label class="flex items-center justify-between text-sm font-medium">
            <span>Range Mode</span>
            <tolle-switch [ngModel]="isRange" (ngModelChange)="toggleRangeMode($event)" size="sm" />
          </label>
          <div class="space-y-1.5">
            <tolle-label>Min</tolle-label>
            <tolle-input type="number" [(ngModel)]="min" size="sm" />
          </div>
          <div class="space-y-1.5">
            <tolle-label>Max</tolle-label>
            <tolle-input type="number" [(ngModel)]="max" size="sm" />
          </div>
          <div class="space-y-1.5">
            <tolle-label>Step</tolle-label>
            <tolle-input type="number" [(ngModel)]="step" size="sm" />
          </div>
          <label class="flex items-center justify-between text-sm font-medium">
            <span>Disabled</span>
            <tolle-switch [(ngModel)]="isDisabled" size="sm" />
          </label>
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
