import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../../../../../tolle/src/lib/data-table.component';

@Component({
  selector: 'app-data-table-sticky',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './data-table-sticky.component.html'
})
export class DataTableStickyComponent {
  @Input() maxHeight = '400px';

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true, class: 'w-[80px]' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status' }
  ];

  data = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'Admin' : 'User',
    status: i % 2 === 0 ? 'Active' : 'Inactive'
  }));
}
