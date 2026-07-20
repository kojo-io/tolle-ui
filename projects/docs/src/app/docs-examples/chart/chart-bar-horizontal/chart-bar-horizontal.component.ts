import { Component } from '@angular/core';
import {
    ChartComponent,
    ChartGridComponent,
    ChartXAxisComponent,
    ChartYAxisComponent,
    ChartBarComponent,
    ChartSeries
} from '../../../../../../tolle/src/lib/chart.component';

@Component({
    selector: 'app-chart-bar-horizontal',
    standalone: true,
    imports: [
        ChartComponent,
        ChartGridComponent,
        ChartXAxisComponent,
        ChartYAxisComponent,
        ChartBarComponent
    ],
    templateUrl: './chart-bar-horizontal.component.html'
})
export class ChartBarHorizontalExampleComponent {
    platforms = [
        { platform: 'iOS', users: 18200 },
        { platform: 'Android', users: 24500 },
        { platform: 'Web', users: 31800 },
        { platform: 'Desktop', users: 9600 }
    ];

    series: ChartSeries[] = [
        { key: 'users', label: 'Weekly active users' }
    ];
}
