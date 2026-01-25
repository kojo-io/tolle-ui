import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipDirective } from '../../../../../../tolle/src/lib/tooltip.directive';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-tooltip-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TooltipDirective,
        ButtonComponent,
        SelectComponent,
        SelectItemComponent,
        PlaygroundComponent
    ],
    templateUrl: './tooltip-interactive.component.html'
})
export class TooltipInteractiveComponent {
    content = 'Hover over me!';
    placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

    get playgroundCode() {
        return `
<button 
  tolleTooltip="${this.content}" 
  placement="${this.placement}"
  class="...">
  Hover over me
</button>
    `.trim();
    }
}
