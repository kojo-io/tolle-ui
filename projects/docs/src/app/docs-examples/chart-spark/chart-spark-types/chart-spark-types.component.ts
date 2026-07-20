import { Component } from '@angular/core';
import { ChartSparkComponent } from '../../../../../../tolle/src/lib/chart-spark.component';

@Component({
    selector: 'app-chart-spark-types',
    standalone: true,
    imports: [ChartSparkComponent],
    templateUrl: './chart-spark-types.component.html'
})
export class ChartSparkTypesComponent {
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
