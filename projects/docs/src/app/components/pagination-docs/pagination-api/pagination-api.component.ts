import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-pagination-api',
    imports: [PropTableComponent],
    templateUrl: './pagination-api.component.html'
})
export class PaginationApiComponent {
    paginationProps: PropEntry[] = [
        { name: 'totalRecords', description: 'Total number of records in the dataset.', type: 'number', default: '0' },
        { name: 'currentPage', description: 'The current active page index (1-based).', type: 'number', default: '1' },
        { name: 'currentPageSize', description: 'Number of items per page.', type: 'number', default: '10' },
        { name: 'pageSizeOptions', description: 'Available options for page size selection.', type: 'number[]', default: '[10, 20, 30, 50]' },
        { name: 'showPageLinks', description: 'Whether to show the individual page number buttons.', type: 'boolean', default: 'true' },
        { name: 'showPageOptions', description: 'Whether to show the page size selector.', type: 'boolean', default: 'true' },
        { name: 'showCurrentPageInfo', description: 'Whether to show the entry count report (e.g. "Showing 1 to 10").', type: 'boolean', default: 'true' },
        { name: 'currentPageInfoTemplate', description: 'Custom template string for the report. Tokens: {first}, {last}, {totalRecords}, {totalPages}, {currentPage}, {currentPageSize}.', type: 'string', default: 'undefined' },
        { name: 'class', description: 'Additional CSS classes for the container.', type: 'string', default: "''" }
    ];

    paginationEvents: PropEntry[] = [
        { name: 'onPageNumberChange', description: 'Emitted when the current page index changes.', type: 'EventEmitter<number>', default: '-' },
        { name: 'onPageSizeChange', description: 'Emitted when the page size is updated.', type: 'EventEmitter<number>', default: '-' }
    ];
}
