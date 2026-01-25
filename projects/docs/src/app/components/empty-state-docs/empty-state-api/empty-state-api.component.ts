import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-empty-state-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './empty-state-api.component.html'
})
export class EmptyStateApiComponent {
    componentProps: PropEntry[] = [
        { name: 'title', description: 'The main heading text.', type: 'string', default: "'No items found'" },
        { name: 'description', description: 'Optional helper text to provide context.', type: 'string', default: '-' },
        { name: 'variant', description: 'The visual style of the container.', type: "'default' | 'minimal'", default: "'default'" },
        { name: 'class', description: 'Additional CSS classes.', type: 'string', default: "''" }
    ];
}
