import { Component } from '@angular/core';

import { ResizablePanelComponent } from '../../../../../../tolle/src/lib/resizable-panel.component';
import { ResizablePanelItemComponent } from '../../../../../../tolle/src/lib/resizable-panel-item.component';

@Component({
  selector: 'app-basic-resizable-example',
  imports: [ResizablePanelComponent, ResizablePanelItemComponent],
  template: `
    <div class="h-[300px] w-full overflow-hidden rounded-lg border border-input">
      <tolle-resizable-panel direction="horizontal" class="h-full">
        <tolle-resizable-panel-item
          [size]="30"
          class="flex items-center justify-center bg-muted/30">
          <div class="text-sm font-medium">Sidebar</div>
        </tolle-resizable-panel-item>

        <tolle-resizable-panel-item
          [size]="70"
          class="flex items-center justify-center bg-background">
          <div class="text-sm font-medium">Main Content</div>
        </tolle-resizable-panel-item>
      </tolle-resizable-panel>
    </div>
  `,
})
export class BasicResizableExampleComponent {}
