import { Component } from '@angular/core';
import {
    ChartComponent,
    ChartGridComponent,
    ChartXAxisComponent,
    ChartYAxisComponent,
    ChartLineComponent,
    ChartSeries
} from '../../../../../../tolle/src/lib/chart.component';

@Component({
    selector: 'app-chart-line',
    standalone: true,
    imports: [
        ChartComponent,
        ChartGridComponent,
        ChartXAxisComponent,
        ChartYAxisComponent,
        ChartLineComponent
    ],
    templateUrl: './chart-line.component.html'
})
export class ChartLineExampleComponent {
    months = [
        { month: 'Jan', revenue: 18400, expenses: 12100 },
        { month: 'Feb', revenue: 19250, expenses: 12800 },
        { month: 'Mar', revenue: 21800, expenses: 13400 },
        { month: 'Apr', revenue: 20900, expenses: 14200 },
        { month: 'May', revenue: 24300, expenses: 14900 },
        { month: 'Jun', revenue: 26750, expenses: 15300 },
        { month: 'Jul', revenue: 25100, expenses: 16100 },
        { month: 'Aug', revenue: 28400, expenses: 16700 }
    ];

    series: ChartSeries[] = [
        { key: 'revenue', label: 'Revenue' },
        { key: 'expenses', label: 'Expenses' }
    ];
}
