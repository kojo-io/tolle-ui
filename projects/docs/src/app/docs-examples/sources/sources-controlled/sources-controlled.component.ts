import { Component } from '@angular/core';

import {
  SourcesComponent,
  SourcesTriggerComponent,
  SourcesContentComponent,
  SourceComponent,
} from '../../../../../../tolle/src/lib/sources.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
  selector: 'app-sources-controlled',
  imports: [
    SourcesComponent,
    SourcesTriggerComponent,
    SourcesContentComponent,
    SourceComponent,
    ButtonComponent,
  ],
  templateUrl: './sources-controlled.component.html',
})
export class SourcesControlledComponent {
  open = false;
  lastEvent = '';

  onOpenChange(open: boolean): void {
    this.lastEvent = `openChange emitted ${open}`;
  }
}
