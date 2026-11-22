import { Component } from '@angular/core';

import { ContextComponent } from '../../../../../../tolle/src/lib/context.component';

@Component({
  selector: 'app-context-levels',
  imports: [ContextComponent],
  templateUrl: './context-levels.component.html',
})
export class ContextLevelsComponent {
  readonly total = 128_000;

  /** One sample per colour band, using the default 0.75 / 0.9 thresholds. */
  readonly levels = [
    { label: 'Normal', used: 32_000 },
    { label: 'Warning', used: 100_000 },
    { label: 'Critical', used: 121_000 },
  ];
}
