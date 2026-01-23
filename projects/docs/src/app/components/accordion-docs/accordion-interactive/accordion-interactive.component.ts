import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionComponent } from '../../../../../../tolle/src/lib/accordion.component';
import { AccordionItemComponent } from '../../../../../../tolle/src/lib/accordion-item.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';

@Component({
    selector: 'app-accordion-interactive',
    standalone: true,
    imports: [
        FormsModule,
        AccordionComponent,
        AccordionItemComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent
    ],
    templateUrl: './accordion-interactive.component.html'
})
export class AccordionInteractiveComponent {
    playgroundType: 'single' | 'multiple' = 'single';

    get playgroundCode() {
        return `<tolle-accordion type="${this.playgroundType}">
  <tolle-accordion-item title="Is it accessible?">
    Yes. It adheres to the WAI-ARIA design pattern.
  </tolle-accordion-item>
  <tolle-accordion-item title="Is it styled?">
    Yes. It comes with default styles that match the other components' aesthetic.
  </tolle-accordion-item>
  <tolle-accordion-item title="Is it animated?">
    Yes. It features smooth open/close animations.
  </tolle-accordion-item>
</tolle-accordion>`;
    }
}
