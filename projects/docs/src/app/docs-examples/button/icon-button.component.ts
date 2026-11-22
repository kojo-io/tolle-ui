import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../../tolle/src/lib/button.component';
import { TooltipDirective } from '../../../../../tolle/src/lib/tooltip.directive';

@Component({
    selector: 'app-icon-button',
    imports: [ButtonComponent, TooltipDirective],
    template: `
    <div class="flex flex-wrap gap-4 items-center">
      <tolle-button variant="outline">
        <i class="ri-github-line mr-2"></i>
        <span>View on GitHub</span>
      </tolle-button>

      <tolle-button variant="outline" size="icon" tolleTooltip="Edit Profile" placement="top">
        <i class="ri-edit-line"></i>
      </tolle-button>

      <tolle-button size="icon-lg">
        <i class="ri-more-2-fill"></i>
      </tolle-button>

      <tolle-button size="icon" variant="destructive">
        <i class="ri-more-2-fill"></i>
      </tolle-button>

      <tolle-button size="icon-sm" variant="secondary">
        <i class="ri-more-2-fill"></i>
      </tolle-button>

      <tolle-button size="icon-xs">
        <i class="ri-more-2-fill"></i>
      </tolle-button>
    </div>
  `
})
export class IconButtonComponent { }
