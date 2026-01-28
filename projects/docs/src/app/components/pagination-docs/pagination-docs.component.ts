import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { PaginationOverviewComponent } from './pagination-overview/pagination-overview.component';
import { PaginationInteractiveComponent } from './pagination-interactive/pagination-interactive.component';
import { PaginationApiComponent } from './pagination-api/pagination-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-pagination-docs',
    imports: [
        PaginationOverviewComponent,
        PaginationInteractiveComponent,
        PaginationApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './pagination-docs.component.html',
    styleUrl: './pagination-docs.component.css'
})
export class PaginationDocsComponent {
    baseService = inject(BaseService);
}
