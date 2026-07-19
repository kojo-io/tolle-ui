import { Component } from '@angular/core';
import {
    ChartComponent,
    ChartGridComponent,
    ChartXAxisComponent,
    ChartYAxisComponent,
    ChartBarComponent,
    ChartSeries
} from '../../../../../../tolle/src/lib/chart.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-chart-stacked-bar',
    standalone: true,
    imports: [
        ChartComponent,
        ChartGridComponent,
        ChartXAxisComponent,
        ChartYAxisComponent,
        ChartBarComponent,
        ButtonComponent
    ],
    templateUrl: './chart-stacked-bar.component.html'
})
export class ChartStackedBarComponent {
    stacked = true;

    quarters = [
        { quarter: 'Q1', desktop: 4200, mobile: 3100, tablet: 900 },
        { quarter: 'Q2', desktop: 4600, mobile: 3800, tablet: 1050 },
        { quarter: 'Q3', desktop: 4400, mobile: 4500, tablet: 1120 },
        { quarter: 'Q4', desktop: 5100, mobile: 5400, tablet: 1240 }
    ];

    series: ChartSeries[] = [
        { key: 'desktop', label: 'Desktop' },
        { key: 'mobile', label: 'Mobile' },
        { key: 'tablet', label: 'Tablet' }
    ];
}
