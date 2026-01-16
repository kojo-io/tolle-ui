import {TableColumn} from '../../../../../tolle/src/lib/data-table.component';

export const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'actions', label: 'Actions', class: 'text-right w-[100px]' }
];
