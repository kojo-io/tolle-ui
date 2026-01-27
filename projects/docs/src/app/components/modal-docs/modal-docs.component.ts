import { Component, inject } from '@angular/core';

import { ModalOverviewComponent } from './modal-overview/modal-overview.component';
import { ModalInteractiveComponent } from './modal-interactive/modal-interactive.component';
import { ModalApiComponent } from './modal-api/modal-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';

import { BaseService } from '../../shared/base.service';

@Component({
    selector: 'app-modal-docs',
    imports: [
    ModalOverviewComponent,
    ModalInteractiveComponent,
    ModalApiComponent,
    DocsWrapperComponent
],
    templateUrl: './modal-docs.component.html'
})
export class ModalDocsComponent {
    baseService = inject(BaseService);
}
