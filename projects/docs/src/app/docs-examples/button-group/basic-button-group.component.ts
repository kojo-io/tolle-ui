import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../../tolle/src/lib/button.component';
import { ButtonGroupComponent } from '../../../../../tolle/src/lib/button-group.component';

@Component({
    selector: 'app-basic-button-group',
    imports: [ButtonComponent, ButtonGroupComponent],
    template: `
    <tolle-button-group>
      <tolle-button variant="outline">Year</tolle-button>
      <tolle-button variant="outline">Month</tolle-button>
      <tolle-button variant="outline">Day</tolle-button>
    </tolle-button-group>

    <div class="mt-8">
      <tolle-button-group>
        <tolle-button>Primary</tolle-button>
        <tolle-button variant="secondary">Secondary</tolle-button>
        <tolle-button variant="outline">Outline</tolle-button>
        <tolle-button variant="destructive">Destructive</tolle-button>
      </tolle-button-group>
    </div>
  `
})
export class BasicButtonGroupComponent { }
