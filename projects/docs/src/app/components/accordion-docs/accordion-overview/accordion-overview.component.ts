import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
    selector: 'app-accordion-overview',
    imports: [BaseEditorComponent],
    templateUrl: './accordion-overview.component.html'
})
export class AccordionOverviewComponent {
    installation = `import { AccordionComponent, AccordionItemComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [AccordionComponent, AccordionItemComponent]
})`;
}
