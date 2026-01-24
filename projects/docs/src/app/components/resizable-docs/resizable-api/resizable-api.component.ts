import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-resizable-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './resizable-api.component.html'
})
export class ResizableApiComponent {
    panelProps: PropEntry[] = [
        { name: 'direction', description: 'The direction of the layout.', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
        { name: 'class', description: 'Additional CSS classes for the container.', type: 'string', default: "''" }
    ];

    itemProps: PropEntry[] = [
        { name: 'size', description: 'The relative size of the panel (flex value).', type: 'number', default: '1' },
        { name: 'minSize', description: 'The minimum size constraint.', type: 'number', default: '10' },
        { name: 'maxSize', description: 'The maximum size constraint.', type: 'number', default: 'undefined' },
        { name: 'resizable', description: 'Whether the panel is resizable.', type: 'boolean', default: 'true' },
        { name: 'class', description: 'Additional CSS classes for the panel item.', type: 'string', default: "''" }
    ];

    boxProps: PropEntry[] = [
        { name: 'width', description: 'Current width in pixels.', type: 'number', default: '300' },
        { name: 'height', description: 'Current height in pixels.', type: 'number', default: '200' },
        { name: 'minWidth', description: 'Minimum width in pixels.', type: 'number', default: '50' },
        { name: 'minHeight', description: 'Minimum height in pixels.', type: 'number', default: '50' },
        { name: 'maxWidth', description: 'Maximum width in pixels.', type: 'number', default: 'undefined' },
        { name: 'maxHeight', description: 'Maximum height in pixels.', type: 'number', default: 'undefined' },
        { name: 'resizable', description: 'Whether the element is resizable.', type: 'boolean', default: 'true' },
        { name: 'directions', description: 'Active resize handles.', type: "('right' | 'bottom' | 'both')[]", default: "['right', 'bottom', 'both']" }
    ];
}
