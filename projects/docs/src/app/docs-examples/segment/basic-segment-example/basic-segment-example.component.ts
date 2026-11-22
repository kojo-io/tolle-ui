import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SegmentComponent, SegmentItem } from '../../../../../../tolle/src/lib/segment.component';

@Component({
  selector: 'app-basic-segment-example',
  imports: [FormsModule, SegmentComponent],
  template: `
    <div class="max-w-sm space-y-4">
      <tolle-segment [items]="items" [(ngModel)]="selectedView"></tolle-segment>

      <div class="rounded-md border bg-muted/20 p-4 text-center text-sm">
        Current View: <span class="font-bold">{{ getLabel(selectedView) }}</span>
      </div>
    </div>
  `,
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
