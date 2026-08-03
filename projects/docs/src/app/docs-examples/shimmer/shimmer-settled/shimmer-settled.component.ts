import { Component } from '@angular/core';

import { ShimmerComponent } from '../../../../../../tolle/src/lib/shimmer.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
  selector: 'app-shimmer-settled',
  imports: [ShimmerComponent, ButtonComponent],
  templateUrl: './shimmer-settled.component.html',
})
export class ShimmerSettledComponent {
  streaming = true;

  get label(): string {
    return this.streaming ? 'Generating response…' : 'Generated response';
  }

  toggle(): void {
    this.streaming = !this.streaming;
  }
}
