import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
    selector: 'app-accordion-overview',
    standalone: true,
    imports: [BaseEditorComponent, DocHeroComponent],
    templateUrl: './accordion-overview.component.html'
})
export class AccordionOverviewComponent {
    installation = `import { AccordionComponent, AccordionItemComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [AccordionComponent, AccordionItemComponent]
})`;
}
