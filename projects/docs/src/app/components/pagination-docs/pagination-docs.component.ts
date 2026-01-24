import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { PaginationOverviewComponent } from './pagination-overview/pagination-overview.component';
import { PaginationInteractiveComponent } from './pagination-interactive/pagination-interactive.component';
import { PaginationApiComponent } from './pagination-api/pagination-api.component';

@Component({
    selector: 'app-pagination-docs',
    standalone: true,
    imports: [
        PaginationOverviewComponent,
        PaginationInteractiveComponent,
        PaginationApiComponent
    ],
    templateUrl: './pagination-docs.component.html',
    styleUrl: './pagination-docs.component.css'
})
export class PaginationDocsComponent {
    baseService = inject(BaseService);
}
