import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopoverComponent } from '../../../../../../tolle/src/lib/popover.component';
import { PopoverContentComponent } from '../../../../../../tolle/src/lib/popover-content.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-popover-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        PopoverComponent,
        PopoverContentComponent,
        ButtonComponent,
        SelectComponent,
        SelectItemComponent,
        PlaygroundComponent
    ],
    templateUrl: './popover-interactive.component.html'
})
export class PopoverInteractiveComponent {
    placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

    get playgroundCode(): string {
        return `<tolle-popover placement="${this.placement}">
  <button tolle-button trigger variant="outline">Open Popover</button>
  <tolle-popover-content>
    <div>Rich Content Here</div>
  </tolle-popover-content>
</tolle-popover>`;
    }
}
