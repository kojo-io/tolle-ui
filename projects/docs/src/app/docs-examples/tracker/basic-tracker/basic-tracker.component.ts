import { Component } from '@angular/core';
import { TrackerComponent, type TrackerBlock } from '../../../../../../tolle/src/lib/tracker.component';

@Component({
    selector: 'app-basic-tracker',
    standalone: true,
    imports: [TrackerComponent],
    styles: [':host { display: block; width: 100%; }'],
    templateUrl: './basic-tracker.component.html'
})
export class BasicTrackerComponent {
    hours: TrackerBlock[] = Array.from({ length: 24 }, (_, i) => {
        const status = i === 9 ? 'error' : i === 15 || i === 16 ? 'warning' : 'success';
        return { status, tooltip: i + ':00 — ' + (status === 'success' ? 'Operational' : status === 'warning' ? 'Degraded' : 'Outage') };
    });
}
