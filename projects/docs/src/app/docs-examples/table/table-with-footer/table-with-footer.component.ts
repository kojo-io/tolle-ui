import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TableComponent,
    TableHeaderDirective,
    TableBodyDirective,
    TableFooterDirective,
    TableRowDirective,
    TableHeadDirective,
    TableCellDirective
} from '../../../../../../tolle/src/lib/table.component';

interface LineItem {
    sku: string;
    description: string;
    quantity: number;
    total: number;
}

@Component({
    selector: 'app-table-with-footer',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        TableHeaderDirective,
        TableBodyDirective,
        TableFooterDirective,
        TableRowDirective,
        TableHeadDirective,
        TableCellDirective
    ],
    templateUrl: './table-with-footer.component.html'
})
export class TableWithFooterComponent {
    items: LineItem[] = [
        { sku: 'TB-100', description: 'Standing desk', quantity: 1, total: 620 },
        { sku: 'CH-220', description: 'Ergonomic chair', quantity: 2, total: 480 },
        { sku: 'LP-045', description: 'Desk lamp', quantity: 3, total: 135 }
    ];

    get grandTotal(): number {
        return this.items.reduce((sum, item) => sum + item.total, 0);
    }
}
