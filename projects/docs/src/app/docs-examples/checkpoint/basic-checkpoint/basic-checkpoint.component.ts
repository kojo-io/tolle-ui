import { Component } from '@angular/core';
import { CheckpointComponent } from '../../../../../../tolle/src/lib/checkpoint.component';

@Component({
    selector: 'app-basic-checkpoint',
    imports: [CheckpointComponent],
    templateUrl: './basic-checkpoint.component.html'
})
export class BasicCheckpointComponent {
  restored = '';

  onRestore(label: string) {
    this.restored = label;
  }
}
