import { Component } from '@angular/core';

import { TooltipDirective } from '../../../../../../tolle/src/lib/tooltip.directive';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-basic-tooltip-example',
    imports: [TooltipDirective, ButtonComponent],
    template: `
    <div class="flex flex-wrap gap-4 items-center justify-center p-8">
      <tolle-button variant="outline" tolleTooltip="Tooltip on top" placement="top">
        Top
      </tolle-button>
      
      <tolle-button variant="outline" tolleTooltip="Tooltip on bottom" placement="bottom">
        Bottom
      </tolle-button>
      
      <tolle-button variant="outline" tolleTooltip="Tooltip on left" placement="left">
        Left
      </tolle-button>
      
      <tolle-button variant="outline" tolleTooltip="Tooltip on right" placement="right">
        Right
      </tolle-button>
    </div>
  `
})
export class BasicTooltipExampleComponent { }
