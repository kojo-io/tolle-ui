import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SegmentedComponent, SegmentItem } from '../../../../../../tolle/src/lib/segment.component';

@Component({
    selector: 'app-basic-segment-example',
    imports: [FormsModule, SegmentedComponent],
    template: `
    <div class="space-y-4 max-w-sm">
      <tolle-segment
        [items]="items"
        [(ngModel)]="selectedView"
      ></tolle-segment>
      
      <div class="p-4 border rounded-md bg-muted/20 text-center text-sm">
        Current View: <span class="font-bold">{{ getLabel(selectedView) }}</span>
      </div>
    </div>
  `
})
export class BasicSegmentExampleComponent {
    selectedView = 'daily';

    items: SegmentItem[] = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
    ];

    getLabel(value: string): string {
        return this.items.find(i => i.value === value)?.label || '';
    }
}
