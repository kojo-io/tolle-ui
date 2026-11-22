import { Component } from '@angular/core';
import { ScrollAreaComponent } from '../../../../../../tolle/src/lib/scroll-area.component';
import { SeparatorComponent } from '../../../../../../tolle/src/lib/separator.component';

@Component({
  selector: 'app-basic-scroll-area',
  imports: [ScrollAreaComponent, SeparatorComponent],
  template: `
    <!-- Give it a height (input or class); content taller than that scrolls. -->
    <tolle-scroll-area height="18rem" orientation="vertical" class="w-48 rounded-md border">
      <div class="p-4">
        <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
        @for (tag of tags; track tag) {
          <div class="text-sm">{{ tag }}</div>
          <tolle-separator class="my-2"></tolle-separator>
        }
      </div>
    </tolle-scroll-area>
  `,
})
export class BasicScrollAreaComponent {
  tags = Array.from({ length: 40 }, (_, i) => `v1.2.0-beta.${40 - i}`);
}
