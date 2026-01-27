import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SegmentedComponent, SegmentItem } from '../../../../../../tolle/src/lib/segment.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-segment-interactive',
    imports: [
        CommonModule,
        FormsModule,
        SegmentedComponent,
        SwitchComponent,
        SelectComponent,
        SelectItemComponent,
        PlaygroundComponent
    ],
    templateUrl: './segment-interactive.component.html'
})
export class SegmentInteractiveComponent {
    disabled = false;
    dataSet: 'text' | 'icons' = 'text';
    currentValue = 'daily';

    get items(): SegmentItem[] {
        if (this.dataSet === 'icons') {
            return [
                { label: 'Map', value: 'map', icon: 'ri-map-pin-line' },
                { label: 'Transit', value: 'transit', icon: 'ri-bus-line' },
                { label: 'Satellite', value: 'satellite', icon: 'ri-earth-line' }
            ];
        }
        return [
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' }
        ];
    }

    get playgroundCode(): string {
        const itemsJson = JSON.stringify(this.items, null, 2).replace(/"([^"]+)":/g, '$1:');
        return `<tolle-segment
  [items]="${this.dataSet === 'text' ? "[{...}]" : "items"}"
  [(ngModel)]="value"${this.disabled ? '\n  [disabled]="true"' : ''}
></tolle-segment>`;
    }

    onValueChange(value: string) {
        console.log('Value changed to:', value);
    }
}
