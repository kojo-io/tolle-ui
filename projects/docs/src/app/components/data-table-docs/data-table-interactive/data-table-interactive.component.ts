import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, TableColumn } from '../../../../../../tolle/src/lib/data-table.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { TolleCellDirective } from '../../../../../../tolle/src/lib/tolle-cell.directive';

@Component({
    selector: 'app-data-table-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DataTableComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent,
        CheckboxComponent
    ],
    templateUrl: './data-table-interactive.component.html'
})
export class DataTableInteractiveComponent {
    searchable = true;
    paginate = true;
    expandable = false;
    allowColumnHiding = true;
    size: 'xs' | 'sm' | 'default' | 'lg' = 'default';

    columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'role', label: 'Role', sortable: true },
        { key: 'status', label: 'Status' }
    ];

    data = [
        { id: 1, name: 'Alex Rivera', email: 'alex@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jordan Smith', email: 'jordan@example.com', role: 'User', status: 'Inactive' },
        { id: 3, name: 'Taylor Johnson', email: 'taylor@example.com', role: 'User', status: 'Active' },
        { id: 4, name: 'Morgan Lee', email: 'morgan@example.com', role: 'Manager', status: 'Active' },
        { id: 5, name: 'Casey Brown', email: 'casey@example.com', role: 'User', status: 'Pending' },
        { id: 6, name: 'Peyton Jones', email: 'peyton@example.com', role: 'Admin', status: 'Active' },
        { id: 7, name: 'Avery Davis', email: 'avery@example.com', role: 'User', status: 'Inactive' },
        { id: 8, name: 'Quinn Miller', email: 'quinn@example.com', role: 'User', status: 'Active' },
        { id: 9, name: 'Riley Wilson', email: 'riley@example.com', role: 'Manager', status: 'Active' },
        { id: 10, name: 'Skyler Moore', email: 'skyler@example.com', role: 'User', status: 'Pending' },
        { id: 11, name: 'Cameron Taylor', email: 'cameron@example.com', role: 'User', status: 'Active' },
        { id: 12, name: 'Reese Anderson', email: 'reese@example.com', role: 'User', status: 'Active' },
    ];

    get playgroundCode() {
        return `<tolle-data-table
  [data]="data"
  [columns]="columns"
  [searchable]="${this.searchable}"
  [paginate]="${this.paginate}"
  [allowColumnHiding]="${this.allowColumnHiding}"
  [expandable]="${this.expandable}"
  [size]="${this.size}">

  ${this.expandable ? `<ng-template #expandedTemplate let-row="row">
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span class="font-medium text-muted-foreground">ID:</span>
        <span class="ml-2">{{ row.id }}</span>
      </div>
      <div>
        <span class="font-medium text-muted-foreground">Role:</span>
        <span class="ml-2">{{ row.role }}</span>
      </div>
    </div>
  </ng-template>` : ''}
</tolle-data-table>`;
    }
}
