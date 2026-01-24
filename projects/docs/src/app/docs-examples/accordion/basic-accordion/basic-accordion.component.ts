import { Component } from '@angular/core';
import { AccordionComponent } from '../../../../../../tolle/src/lib/accordion.component';
import { AccordionItemComponent } from '../../../../../../tolle/src/lib/accordion-item.component';

@Component({
    selector: 'app-basic-accordion',
    standalone: true,
    imports: [AccordionComponent, AccordionItemComponent],
    templateUrl: './basic-accordion.component.html'
})
export class BasicAccordionComponent { }
