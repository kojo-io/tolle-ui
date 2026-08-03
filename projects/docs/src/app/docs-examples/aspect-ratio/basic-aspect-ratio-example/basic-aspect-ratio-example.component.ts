import { Component } from '@angular/core';

import { AspectRatioComponent } from '../../../../../../tolle/src/lib/aspect-ratio.component';

@Component({
  selector: 'app-basic-aspect-ratio-example',
  imports: [AspectRatioComponent],
  template: `
    <div class="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
      <div class="space-y-4">
        <p class="text-sm font-medium italic text-muted-foreground">16 / 9 (Video)</p>
        <tolle-aspect-ratio ratio="16 / 9" class="rounded-lg shadow-sm">
          <img src="https://picsum.photos/seed/tolle1/1600/900" alt="Random image 1" />
        </tolle-aspect-ratio>
      </div>

      <div class="space-y-4">
        <p class="text-sm font-medium italic text-muted-foreground">1 / 1 (Square)</p>
        <tolle-aspect-ratio ratio="1 / 1" class="rounded-lg shadow-sm">
          <img src="https://picsum.photos/seed/tolle2/1000/1000" alt="Random image 2" />
        </tolle-aspect-ratio>
      </div>

      <div class="space-y-4 md:col-span-2">
        <p class="text-sm font-medium italic text-destructive">Broken Image (Error State)</p>
        <tolle-aspect-ratio
          ratio="16 / 9"
          class="rounded-lg border border-destructive/20 shadow-sm">
          <img src="https://picsum.photos/invalid-url-that-causes-error" alt="Broken image" />
        </tolle-aspect-ratio>
      </div>
    </div>
  `,
})
export class BasicAspectRatioExampleComponent {}
