import { Component } from '@angular/core';
import { TrackerComponent, type TrackerBlock } from '../../../../../../tolle/src/lib/tracker.component';

@Component({
    selector: 'app-tracker-status-card',
    standalone: true,
    imports: [TrackerComponent],
    styles: [':host { display: block; width: 100%; }'],
    templateUrl: './tracker-status-card.component.html'
})
export class TrackerStatusCardComponent {
    days: TrackerBlock[] = Array.from({ length: 30 }, (_, i) => {
        const status = i === 6 ? 'error' : i === 18 ? 'warning' : 'success';
        return { status, tooltip: 'Day ' + (i + 1) };
    });

    get uptime(): string {
        const down = this.days.filter((d) => d.status !== 'success').length;
        return (((this.days.length - down) / this.days.length) * 100).toFixed(2) + '%';
    }
}
