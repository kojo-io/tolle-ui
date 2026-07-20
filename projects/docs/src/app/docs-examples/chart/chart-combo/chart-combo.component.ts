import { Component } from '@angular/core';
import {
    ChartComponent,
    ChartGridComponent,
    ChartXAxisComponent,
    ChartYAxisComponent,
    ChartBarComponent,
    ChartLineComponent,
    ChartSeries
} from '../../../../../../tolle/src/lib/chart.component';

@Component({
    selector: 'app-chart-combo',
    standalone: true,
    imports: [
        ChartComponent,
        ChartGridComponent,
        ChartXAxisComponent,
        ChartYAxisComponent,
        ChartBarComponent,
        ChartLineComponent
    ],
    templateUrl: './chart-combo.component.html'
})
export class ChartComboExampleComponent {
    months = [
        { month: 'Jan', revenue: 18400, target: 20000 },
        { month: 'Feb', revenue: 19250, target: 20000 },
        { month: 'Mar', revenue: 21800, target: 21000 },
        { month: 'Apr', revenue: 20900, target: 21000 },
        { month: 'May', revenue: 24300, target: 22000 },
        { month: 'Jun', revenue: 26750, target: 22000 }
    ];

    series: ChartSeries[] = [
        { key: 'revenue', label: 'Revenue' },
        { key: 'target', label: 'Target' }
    ];
}
