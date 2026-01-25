import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalOverviewComponent } from './modal-overview/modal-overview.component';
import { ModalInteractiveComponent } from './modal-interactive/modal-interactive.component';
import { ModalApiComponent } from './modal-api/modal-api.component';
import { BaseService } from '../../shared/base.service';

@Component({
    selector: 'app-modal-docs',
    standalone: true,
    imports: [
        CommonModule,
        ModalOverviewComponent,
        ModalInteractiveComponent,
        ModalApiComponent
    ],
    templateUrl: './modal-docs.component.html'
})
export class ModalDocsComponent {
    baseService = inject(BaseService);
}
