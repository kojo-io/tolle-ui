import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { AccordionOverviewComponent } from './accordion-overview/accordion-overview.component';
import { AccordionInteractiveComponent } from './accordion-interactive/accordion-interactive.component';
import { AccordionExamplesComponent } from './accordion-examples/accordion-examples.component';
import { AccordionApiComponent } from './accordion-api/accordion-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
  selector: 'app-accordion-docs',
  standalone: true,
  imports: [
    AccordionOverviewComponent,
    AccordionInteractiveComponent,
    AccordionExamplesComponent,
    AccordionApiComponent,
    DocsWrapperComponent

  ],
  templateUrl: './accordion-docs.component.html',
  styleUrl: './accordion-docs.component.css'
})
export class AccordionDocsComponent {
  baseService = inject(BaseService);
}