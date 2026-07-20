import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartSparkComponent } from '../../../../../../tolle/src/lib/chart-spark.component';

@Component({
    selector: 'app-chart-spark-in-a-list',
    standalone: true,
    imports: [CommonModule, ChartSparkComponent],
    templateUrl: './chart-spark-in-a-list.component.html'
})
export class ChartSparkInAListComponent {
    rows = [
        {
            product: 'Acme Widget',
            latest: '$4,820',
            trend: [
                { week: 'W1', revenue: 3600 }, { week: 'W2', revenue: 3900 }, { week: 'W3', revenue: 3700 },
                { week: 'W4', revenue: 4200 }, { week: 'W5', revenue: 4500 }, { week: 'W6', revenue: 4820 }
            ]
        },
        {
            product: 'Widget Pro',
            latest: '$2,140',
            trend: [
                { week: 'W1', revenue: 2600 }, { week: 'W2', revenue: 2500 }, { week: 'W3', revenue: 2300 },
                { week: 'W4', revenue: 2250 }, { week: 'W5', revenue: 2180 }, { week: 'W6', revenue: 2140 }
            ]
        }
    ];
}
