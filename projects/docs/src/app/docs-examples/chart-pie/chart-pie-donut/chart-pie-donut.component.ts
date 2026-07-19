import { Component } from '@angular/core';
import { ChartPieComponent } from '../../../../../../tolle/src/lib/chart-pie.component';

@Component({
    selector: 'app-chart-pie-donut',
    standalone: true,
    imports: [ChartPieComponent],
    templateUrl: './chart-pie-donut.component.html'
})
export class ChartPieDonutComponent {
    plans = [
        { plan: 'Pro', revenue: 48200 },
        { plan: 'Team', revenue: 31500 },
        { plan: 'Starter', revenue: 12800 },
        { plan: 'Enterprise', revenue: 9400 }
    ];

    get total(): string {
        const sum = this.plans.reduce((acc, row) => acc + row.revenue, 0);
        return '$' + sum.toLocaleString('en-US');
    }
}
