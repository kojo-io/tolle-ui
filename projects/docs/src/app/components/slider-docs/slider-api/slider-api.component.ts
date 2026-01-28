import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-slider-api',
    imports: [PropTableComponent],
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>

      <div class="space-y-10">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-foreground">Slider</h3>
          <app-prop-table [props]="sliderProps" />
        </div>
      </div>
    </section>
  `
})
export class SliderApiComponent {
    sliderProps: PropEntry[] = [
        {
            name: 'ngModel / value',
            type: 'number',
            default: '0',
            description: 'The current value of the slider.'
        },
        {
            name: 'min',
            type: 'number',
            default: '0',
            description: 'The minimum value of the slider.'
        },
        {
            name: 'max',
            type: 'number',
            default: '100',
            description: 'The maximum value of the slider.'
        },
        {
            name: 'step',
            type: 'number',
            default: '1',
            description: 'The step increment of the slider.'
        },
        {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            description: 'Whether the slider is disabled.'
        },
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the slider container.'
        }
    ];
}
