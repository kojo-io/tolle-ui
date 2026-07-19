import { Component } from '@angular/core';
import { ChartPieComponent } from '../../../../../../tolle/src/lib/chart-pie.component';

@Component({
    selector: 'app-basic-chart-pie',
    standalone: true,
    imports: [ChartPieComponent],
    templateUrl: './basic-chart-pie.component.html'
})
export class BasicChartPieComponent {
    traffic = [
        { source: 'Organic search', sessions: 4820 },
        { source: 'Direct', sessions: 2140 },
        { source: 'Referral', sessions: 1275 },
        { source: 'Social', sessions: 640 }
    ];
}
