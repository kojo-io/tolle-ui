import { Component } from '@angular/core';
import { CheckpointComponent } from '../../../../../../tolle/src/lib/checkpoint.component';

@Component({
    selector: 'app-checkpoint-active',
    standalone: true,
    imports: [CheckpointComponent],
    templateUrl: './checkpoint-active.component.html'
})
export class CheckpointActiveComponent {
  /** The checkpoint the conversation currently sits on. */
  activeLabel = 'Added tests';

  checkpoints = [
    { label: 'Initial scaffold', timestamp: '14:02' },
    { label: 'Added tests', timestamp: '14:18' },
    { label: 'Before refactor', timestamp: '14:32' }
  ];

  restore(label: string) {
    this.activeLabel = label;
  }
}
