import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-segment-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './segment-api.component.html'
})
export class SegmentApiComponent {
    componentProps: PropEntry[] = [
        { name: 'items', description: 'Array of segment options.', type: 'SegmentItem[]', default: '[]' },
        { name: 'disabled', description: 'Disables the entire control.', type: 'boolean', default: 'false' },
        { name: 'class', description: 'Additional CSS classes for the container.', type: 'string', default: "''" },
        { name: 'itemTemplate', description: 'Custom template for rendering items.', type: 'TemplateRef<any>', default: 'undefined' }
    ];

    typeProps: PropEntry[] = [
        { name: 'label', description: 'Display text for the segment.', type: 'string', default: '-' },
        { name: 'value', description: 'Unique value associated with the segment.', type: 'any', default: '-' },
        { name: 'disabled', description: 'Disables specific segment item.', type: 'boolean', default: 'false' },
        { name: 'icon', description: 'Icon class string (e.g. Remix Icon).', type: 'string', default: 'undefined' },
        { name: 'class', description: 'Custom class for the item wrapper.', type: 'string', default: 'undefined' },
        { name: 'data', description: 'Arbitrary data payload.', type: 'any', default: 'undefined' }
    ];
}
