import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-modal-api',
    imports: [PropTableComponent],
    templateUrl: './modal-api.component.html'
})
export class ModalApiComponent {
    serviceMethods: PropEntry[] = [
        { name: 'open(config: Modal)', description: 'Opens a modal with the given configuration. Returns a ModalRef.', type: 'ModalRef<R>', default: '-' },
        { name: 'closeAll()', description: 'Instantly closes all currently open modals.', type: 'void', default: '-' }
    ];

    configParams: PropEntry[] = [
        { name: 'content', description: 'The content to display. Can be a string, TemplateRef, or Component.', type: 'string | Type<any> | TemplateRef<any>', default: '-' },
        { name: 'title', description: 'Optional header title.', type: 'string', default: '-' },
        { name: 'size', description: 'Visual scale: xs, sm, default, lg, or fullscreen.', type: 'string', default: "'default'" },
        { name: 'backdropClose', description: 'If true, clicking the backdrop closes the modal.', type: 'boolean', default: 'true' },
        { name: 'showCloseButton', description: 'Whether to show the close icon in the header.', type: 'boolean', default: 'true' },
        { name: 'data', description: 'Key-value pairs to pass to a Component content via @Input.', type: 'object', default: '-' },
        { name: 'context', description: 'Explicit context to pass to a TemplateRef content.', type: 'any', default: '-' }
    ];

    refMethods: PropEntry[] = [
        { name: 'close(result?: R)', description: 'Closes the modal and emits the result.', type: 'void', default: '-' },
        { name: 'afterClosed$', description: 'Observable that emits when the modal is closed.', type: 'Observable<R | null>', default: '-' }
    ];
}
