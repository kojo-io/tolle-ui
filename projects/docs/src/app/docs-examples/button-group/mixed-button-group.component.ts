import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../../tolle/src/lib/button.component';
import { ButtonGroupComponent } from '../../../../../tolle/src/lib/button-group.component';
import { TooltipDirective } from '../../../../../tolle/src/lib/tooltip.directive';

@Component({
    selector: 'app-mixed-button-group',
    imports: [ButtonComponent, ButtonGroupComponent, TooltipDirective],
    template: `
    <tolle-button-group>
      <tolle-button variant="outline" size="lg">
        <i class="ri-github-line mr-2"></i>
        <span>View on GitHub</span>
      </tolle-button>

      <tolle-button
        variant="outline"
        size="icon-lg"
        tolleTooltip="Edit Profile"
        placement="top">
        <i class="ri-edit-line"></i>
      </tolle-button>
    </tolle-button-group>

    <div class="mt-8">
      <tolle-button-group>
        <tolle-button size="icon-lg">
          <i class="ri-arrow-left-s-line"></i>
        </tolle-button>
        <tolle-button size="icon-lg">
          <i class="ri-arrow-right-s-line"></i>
        </tolle-button>
      </tolle-button-group>
    </div>
  `
})
export class MixedButtonGroupComponent { }
