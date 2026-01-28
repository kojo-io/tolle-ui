import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DataTableOverviewComponent } from './data-table-overview/data-table-overview.component';
import { DataTableBasicComponent } from './data-table-basic/data-table-basic.component';
import { DataTableInteractiveComponent } from './data-table-interactive/data-table-interactive.component';
import { ColumnHidingDocsComponent } from './column-hiding-docs/column-hiding-docs.component';
import { PaginationDocsComponent } from './pagination-docs/pagination-docs.component';
import { SearchableDocsComponent } from './searchable-docs/searchable-docs.component';
import { DataTableApiComponent } from './data-table-api/data-table-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-data-table-docs',
    imports: [
        DataTableOverviewComponent,
        DataTableInteractiveComponent,
        DataTableBasicComponent,
        ColumnHidingDocsComponent,
        PaginationDocsComponent,
        SearchableDocsComponent,
        DataTableApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './data-table-docs.component.html',
    styleUrl: './data-table-docs.component.css'
})
export class DataTableDocsComponent {
  baseService = inject(BaseService);
}
