import { Component } from '@angular/core';
import {
    TableComponent,
    TableCaptionDirective,
    TableHeaderDirective,
    TableBodyDirective,
    TableRowDirective,
    TableHeadDirective,
    TableCellDirective
} from '../../../../../../tolle/src/lib/table.component';

@Component({
    selector: 'app-basic-table',
    standalone: true,
    imports: [
        TableComponent,
        TableCaptionDirective,
        TableHeaderDirective,
        TableBodyDirective,
        TableRowDirective,
        TableHeadDirective,
        TableCellDirective
    ],
    templateUrl: './basic-table.component.html'
})
export class BasicTableComponent { }
