import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TableComponent,
    TableHeaderDirective,
    TableBodyDirective,
    TableRowDirective,
    TableHeadDirective,
    TableCellDirective
} from '../../../../../../tolle/src/lib/table.component';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    email: string;
}

@Component({
    selector: 'app-selectable-rows',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        TableHeaderDirective,
        TableBodyDirective,
        TableRowDirective,
        TableHeadDirective,
        TableCellDirective
    ],
    templateUrl: './selectable-rows.component.html'
})
export class SelectableRowsComponent {
    selectedId: number | null = 2;

    rows: TeamMember[] = [
        { id: 1, name: 'Ada Lovelace', role: 'Engineering', email: 'ada@example.com' },
        { id: 2, name: 'Grace Hopper', role: 'Engineering', email: 'grace@example.com' },
        { id: 3, name: 'Katherine Johnson', role: 'Research', email: 'katherine@example.com' }
    ];

    toggle(row: TeamMember): void {
        this.selectedId = this.selectedId === row.id ? null : row.id;
    }
}
