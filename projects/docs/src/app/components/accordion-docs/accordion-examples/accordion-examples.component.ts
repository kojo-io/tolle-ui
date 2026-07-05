import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { BasicAccordionComponent } from '../../../docs-examples/accordion/basic-accordion/basic-accordion.component';
import { MultipleAccordionComponent } from '../../../docs-examples/accordion/multiple-accordion/multiple-accordion.component';

@Component({
    selector: 'app-accordion-examples',
    standalone: true,
    imports: [
        CommonModule,
        ComponentPreviewComponent,
        BasicAccordionComponent,
        MultipleAccordionComponent
    ],
    templateUrl: './accordion-examples.component.html'
})
export class AccordionExamplesComponent {
    basicCode = `<tolle-accordion>
  <tolle-accordion-item title="Can I open many at once?">
    Yes, because the type is set to multiple by default or explicitly.
  </tolle-accordion-item>
  <tolle-accordion-item title="Is it animated?">
    No, it uses static rendering for a snappy, high-performance feel.
  </tolle-accordion-item>
</tolle-accordion>`;

    multiCode = `<tolle-accordion type="multiple">
  <tolle-accordion-item title="Can I open many at once?">
    Yes, because the type is set to multiple.
  </tolle-accordion-item>
  <tolle-accordion-item title="Is it animated?">
    No, it uses static rendering for a snappy, high-performance feel.
  </tolle-accordion-item>
</tolle-accordion>`;
}
