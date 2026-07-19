import { Component } from '@angular/core';
import { ConfirmationComponent } from '../../../../../../tolle/src/lib/confirmation.component';

type State = 'pending' | 'confirmed' | 'cancelled';

@Component({
    selector: 'app-basic-confirmation',
    standalone: true,
    imports: [ConfirmationComponent],
    templateUrl: './basic-confirmation.component.html'
})
export class BasicConfirmationComponent {
  state: State = 'pending';

  approve() {
    this.state = 'confirmed';
  }

  deny() {
    this.state = 'cancelled';
  }

  reset() {
    this.state = 'pending';
  }
}
