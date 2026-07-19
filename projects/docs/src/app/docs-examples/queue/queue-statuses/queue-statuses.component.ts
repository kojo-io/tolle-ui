import { Component } from '@angular/core';
import { QueueComponent, QueueItemComponent } from '../../../../../../tolle/src/lib/queue.component';

@Component({
    selector: 'app-queue-statuses',
    standalone: true,
    imports: [QueueComponent, QueueItemComponent],
    templateUrl: './queue-statuses.component.html'
})
export class QueueStatusesComponent { }
