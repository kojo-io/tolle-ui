import { Component } from '@angular/core';
import { SeparatorComponent } from '../../../../../../tolle/src/lib/separator.component';

@Component({
  selector: 'app-basic-separator',
  imports: [SeparatorComponent],
  template: `
    <div class="w-full max-w-sm">
      <h4 class="text-sm font-medium">Tolle UI</h4>
      <p class="text-sm text-muted-foreground">Angular components you can own.</p>
      <tolle-separator class="my-4"></tolle-separator>
      <!-- A vertical separator needs a parent with a height. -->
      <div class="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <tolle-separator orientation="vertical"></tolle-separator>
        <span>Components</span>
        <tolle-separator orientation="vertical"></tolle-separator>
        <span>Themes</span>
      </div>
    </div>
  `,
})
export class BasicSeparatorComponent {}
