import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { SelectOverviewComponent } from './select-overview/select-overview.component';
import { SelectInteractiveComponent } from './select-interactive/select-interactive.component';
import { SelectApiComponent } from './select-api/select-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-select-docs',
    imports: [
        SelectOverviewComponent,
        SelectInteractiveComponent,
        SelectApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './select-docs.component.html',
    styleUrl: './select-docs.component.css'
})
export class SelectDocsComponent {
    baseService = inject(BaseService);
}
