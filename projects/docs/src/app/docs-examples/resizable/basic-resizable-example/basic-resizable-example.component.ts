import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizablePanelComponent } from '../../../../../../tolle/src/lib/resizable-panel.component';
import { ResizablePanelItemComponent } from '../../../../../../tolle/src/lib/resizable-panel-item.component';

@Component({
    selector: 'app-basic-resizable-example',
    imports: [CommonModule, ResizablePanelComponent, ResizablePanelItemComponent],
    template: `
    <div class="w-full h-[300px] rounded-lg border border-input overflow-hidden">
      <tolle-resizable-panel direction="horizontal" class="h-full">
        <tolle-resizable-panel-item [size]="30" class="bg-muted/30 flex items-center justify-center">
          <div class="text-sm font-medium">Sidebar</div>
        </tolle-resizable-panel-item>
        
        <tolle-resizable-panel-item [size]="70" class="bg-background flex items-center justify-center">
          <div class="text-sm font-medium">Main Content</div>
        </tolle-resizable-panel-item>
      </tolle-resizable-panel>
    </div>
  `
})
export class BasicResizableExampleComponent { }
