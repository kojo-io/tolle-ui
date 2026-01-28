import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AspectRatioComponent } from '../../../../../../tolle/src/lib/aspect-ratio.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-aspect-ratio-interactive',
    imports: [FormsModule, AspectRatioComponent, PlaygroundComponent],
    templateUrl: './aspect-ratio-interactive.component.html'
})
export class AspectRatioInteractiveComponent {
  ratio = '16 / 9';
  imageUrl = 'https://picsum.photos/seed/aspect-ratio/1000/600';

  refreshImage() {
    this.imageUrl = `https://picsum.photos/seed/${Math.random()}/1000/1000`;
  }

  get playgroundCode(): string {
    return `<tolle-aspect-ratio ratio="${this.ratio}">
  <img src="${this.imageUrl}" alt="..." />
</tolle-aspect-ratio>`;
  }
}
