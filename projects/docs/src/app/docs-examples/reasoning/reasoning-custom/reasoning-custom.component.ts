import { Component } from '@angular/core';

import {
  ReasoningComponent,
  ReasoningTriggerComponent,
  ReasoningContentComponent,
} from '../../../../../../tolle/src/lib/reasoning.component';

@Component({
  selector: 'app-reasoning-custom',
  imports: [ReasoningComponent, ReasoningTriggerComponent, ReasoningContentComponent],
  templateUrl: './reasoning-custom.component.html',
})
export class ReasoningCustomComponent {
  open = false;

  onOpenChange(open: boolean): void {
    this.open = open;
  }
}
