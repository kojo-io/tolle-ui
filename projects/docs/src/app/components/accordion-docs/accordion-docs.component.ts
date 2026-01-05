import {Component, inject} from '@angular/core';
import {BaseService} from '../../shared/base.service';
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AccordionItemComponent} from '../../../../../tolle/src/lib/accordion-item.component';
import {AccordionComponent} from '../../../../../tolle/src/lib/accordion.component';

@Component({
  selector: 'app-accordion-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    SegmentedComponent,
    FormsModule,
    NgIf,
    AccordionComponent,
    AccordionItemComponent,
  ],
  templateUrl: './accordion-docs.component.html',
  styleUrl: './accordion-docs.component.css'
})
export class AccordionDocsComponent {
  baseService = inject(BaseService);
  selectedTab = "preview";
  singleUsage = "preview";
  multiUsage = "preview";
  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];


  accordionBasic = "<tolle-accordion>\n" +
    "  <tolle-accordion-item title=\"Can I open many at once?\">\n" +
    "    Yes, because the type is set to multiple.\n" +
    "  </tolle-accordion-item>\n" +
    "  <tolle-accordion-item title=\"Is it animated?\">\n" +
    "    No, it uses static rendering for a snappy, high-performance feel.\n" +
    "  </tolle-accordion-item>\n" +
    "</tolle-accordion>";

  installation = "import {AccordionItemComponent} from '@tolle_/tolle-ui';\n" +
    "import {AccordionComponent} from '@tolle_/tolle-ui';";

  accordionMultiple = "<tolle-accordion type='multiple'>\n" +
    "  <tolle-accordion-item title=\"Can I open many at once?\">\n" +
    "    Yes, because the type is set to multiple.\n" +
    "  </tolle-accordion-item>\n" +
    "  <tolle-accordion-item title=\"Is it animated?\">\n" +
    "    No, it uses static rendering for a snappy, high-performance feel.\n" +
    "  </tolle-accordion-item>\n" +
    "</tolle-accordion>";
}
