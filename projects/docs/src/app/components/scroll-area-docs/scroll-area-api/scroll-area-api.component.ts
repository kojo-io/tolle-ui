import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-scroll-area-api',
    standalone: true,
    imports: [PropTableComponent, CommonModule],
    template: `
    <section class="mb-16" id="api-reference">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>

      <div class="space-y-12">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-foreground">Scroll Area</h3>
          <app-prop-table [props]="scrollAreaProps" />
        </div>
      </div>
    </section>
  `
})
export class ScrollAreaApiComponent {
    scrollAreaProps: PropEntry[] = [
        {
            name: 'height',
            type: 'string',
            default: "'100%'",
            description: 'The height of the scrollable area.'
        },
        {
            name: 'orientation',
            type: "'vertical' | 'horizontal' | 'both'",
            default: "'both'",
            description: 'The scroll orientation allowed.'
        },
        {
            name: 'class',
            type: 'string',
            default: "''",
            description: 'Additional CSS classes to apply to the container.'
        }
    ];
}
