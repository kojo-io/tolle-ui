import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-accordion-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './accordion-api.component.html'
})
export class AccordionApiComponent {
    accordionProps: PropEntry[] = [
        { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'Determines whether one or multiple items can be opened at the same time.' },
        { name: 'class', type: 'string', description: 'Additional CSS classes for the accordion container.' }
    ];

    accordionItemProps: PropEntry[] = [
        { name: 'title', type: 'string', description: 'The text displayed in the accordion item header.' },
        { name: 'id', type: 'string | number', description: 'Unique identifier for the item. Auto-generated if not provided.' },
        { name: 'class', type: 'string', description: 'Additional CSS classes for the accordion item.' }
    ];
}
