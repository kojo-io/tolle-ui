import { Component } from '@angular/core';
import { ChartSparkComponent } from '../../../../../../tolle/src/lib/chart-spark.component';

@Component({
    selector: 'app-basic-chart-spark',
    standalone: true,
    imports: [ChartSparkComponent],
    templateUrl: './basic-chart-spark.component.html'
})
export class BasicChartSparkComponent {
    days = [
        { day: 'Mon', visits: 220 },
        { day: 'Tue', visits: 260 },
        { day: 'Wed', visits: 240 },
        { day: 'Thu', visits: 310 },
        { day: 'Fri', visits: 290 },
        { day: 'Sat', visits: 340 },
        { day: 'Sun', visits: 360 }
    ];
}
