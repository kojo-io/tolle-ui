import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-data-table-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './data-table-api.component.html'
})
export class DataTableApiComponent {
    dataTableProps: PropEntry[] = [
        {
            name: 'data',
            description: 'The dataset to display in the table.',
            type: 'any[]',
            default: '[]'
        },
        {
            name: 'columns',
            description: 'Configuration for table columns.',
            type: 'TableColumn[]',
            default: '[]'
        },
        {
            name: 'searchable',
            description: 'If true, shows a search input for filtering data.',
            type: 'boolean',
            default: 'true'
        },
        {
            name: 'paginate',
            description: 'If true, enables pagination for the table.',
            type: 'boolean',
            default: 'true'
        },
        {
            name: 'pageSize',
            description: 'The number of rows per page.',
            type: 'number',
            default: '10'
        },
        {
            name: 'pageSizeOptions',
            description: 'Options for the user to select page size.',
            type: 'number[]',
            default: '[]'
        },
        {
            name: 'size',
            description: 'The size of the table (density).',
            type: "'xs' | 'sm' | 'default' | 'lg'",
            default: "'default'"
        },
        {
            name: 'allowColumnHiding',
            description: 'If true, allows users to toggle column visibility.',
            type: 'boolean',
            default: 'true'
        },
        {
            name: 'showSettings',
            description: 'If true, shows the settings button (e.g., for column hiding).',
            type: 'boolean',
            default: 'true'
        },
        {
            name: 'expandable',
            description: 'If true, allows rows to be expanded to show more details.',
            type: 'boolean',
            default: 'false'
        },
        {
            name: 'expandedTemplate',
            description: 'The template to render when a row is expanded.',
            type: 'TemplateRef<any>',
            default: 'undefined'
        }
    ];
}
