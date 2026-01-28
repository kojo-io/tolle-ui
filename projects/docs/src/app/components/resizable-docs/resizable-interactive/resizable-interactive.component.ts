import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ResizablePanelComponent } from '../../../../../../tolle/src/lib/resizable-panel.component';
import { ResizablePanelItemComponent } from '../../../../../../tolle/src/lib/resizable-panel-item.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-resizable-interactive',
    imports: [
    FormsModule,
    ResizablePanelComponent,
    ResizablePanelItemComponent,
    SelectComponent,
    SelectItemComponent,
    PlaygroundComponent
],
    templateUrl: './resizable-interactive.component.html'
})
export class ResizableInteractiveComponent {
    direction: 'horizontal' | 'vertical' = 'horizontal';

    get playgroundCode(): string {
        return `<tolle-resizable-panel direction="${this.direction}" class="h-[400px]">
  <tolle-resizable-panel-item [size]="25">
    <div>Panel 1</div>
  </tolle-resizable-panel-item>
  
  <tolle-resizable-panel-item [size]="50">
    <div>Panel 2</div>
  </tolle-resizable-panel-item>
  
  <tolle-resizable-panel-item [size]="25">
    <div>Panel 3</div>
  </tolle-resizable-panel-item>
</tolle-resizable-panel>`;
    }
}
