import { Component } from '@angular/core';
import {DataTableComponent, TableColumn} from '../../../../../../tolle/src/lib/data-table.component';
import {ButtonComponent} from '../../../../../../tolle/src/lib/button.component';
import {TolleCellDirective} from '../../../../../../tolle/src/lib/tolle-cell.directive';

@Component({
  selector: 'app-column-hiding',
  standalone: true,
  imports: [
    ButtonComponent,
    DataTableComponent,
    TolleCellDirective
  ],
  templateUrl: './column-hiding.component.html',
  styleUrl: './column-hiding.component.css'
})
export class ColumnHidingComponent {
  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'actions', label: 'Actions', class: 'text-right w-[100px]' }
  ];

  users = [
    { id: 1, name: 'Alex Rivera', email: 'alex@example.com' },
    { id: 2, name: 'Jordan Smith', email: 'jordan@example.com' },
    { id: 3, name: 'Taylor Johnson', email: 'taylor.johnson@example.com' },
    { id: 4, name: 'Morgan Lee', email: 'morgan.lee@example.com' },
    { id: 5, name: 'Casey Brown', email: 'casey.brown@example.com' },
    { id: 6, name: 'Riley Anderson', email: 'riley.anderson@example.com' },
    { id: 7, name: 'Jamie Clark', email: 'jamie.clark@example.com' },
    { id: 8, name: 'Avery Martinez', email: 'avery.martinez@example.com' },
    { id: 9, name: 'Quinn Walker', email: 'quinn.walker@example.com' },
    { id: 10, name: 'Drew Thompson', email: 'drew.thompson@example.com' }
  ];
}
