import { Component } from '@angular/core';
import {
    ChartComponent,
    ChartGridComponent,
    ChartXAxisComponent,
    ChartYAxisComponent,
    ChartAreaComponent,
    ChartSeries
} from '../../../../../../tolle/src/lib/chart.component';

@Component({
    selector: 'app-chart-area',
    standalone: true,
    imports: [
        ChartComponent,
        ChartGridComponent,
        ChartXAxisComponent,
        ChartYAxisComponent,
        ChartAreaComponent
    ],
    templateUrl: './chart-area.component.html'
})
export class ChartAreaExampleComponent {
    weeks = [
        { week: 'W1', trial: 320, paid: 180 },
        { week: 'W2', trial: 410, paid: 205 },
        { week: 'W3', trial: 380, paid: 240 },
        { week: 'W4', trial: 455, paid: 268 },
        { week: 'W5', trial: 520, paid: 310 },
        { week: 'W6', trial: 495, paid: 352 },
        { week: 'W7', trial: 560, paid: 390 },
        { week: 'W8', trial: 610, paid: 445 }
    ];

    series: ChartSeries[] = [
        { key: 'trial', label: 'Trial' },
        { key: 'paid', label: 'Paid' }
    ];
}
