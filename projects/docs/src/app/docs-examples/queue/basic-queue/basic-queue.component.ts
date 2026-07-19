import { Component } from '@angular/core';
import { QueueComponent, QueueItemComponent } from '../../../../../../tolle/src/lib/queue.component';

@Component({
    selector: 'app-basic-queue',
    standalone: true,
    imports: [QueueComponent, QueueItemComponent],
    templateUrl: './basic-queue.component.html'
})
export class BasicQueueComponent {
  items = [
    { id: 1, label: 'Summarise the design doc' },
    { id: 2, label: 'Draft migration plan' },
    { id: 3, label: 'Open a pull request' }
  ];

  remove(id: number) {
    this.items = this.items.filter((i) => i.id !== id);
  }
}
