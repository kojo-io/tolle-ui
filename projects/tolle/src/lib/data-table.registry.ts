import type { RegistrySidecar } from '../../../registry/src/types';

export const dataTableRegistry: RegistrySidecar = {
  description:
    'A data grid from `[data]` and `[columns]`, with built-in search, sorting, pagination, column hiding, expandable rows and custom cell templates.',
  whenToUse: 'Tabular records that users search, sort or page through.',
  alternatives: [{ name: 'table', when: 'you want plain table markup and full control, with no built-in behaviour.' }],
  parts: ['tolle-cell'],
  pitfalls: [
    'Columns are `TableColumn[]`: `{ key: \'email\', label: \'Email\', sortable: true }`. `key` must match a property of each row.',
    'Customise a cell with `<ng-template tolleCell="status" let-value let-row="row">` inside the table; `tolleCell` is a column `key`. Import `TolleCellDirective`.',
    'A template for a key that is not a real property (e.g. "actions") still needs a column entry for it in `columns`.',
    'Search and pagination are on by default; turn them off with `[searchable]="false"` / `[paginate]="false"`.',
  ],
  keywords: ['table', 'grid', 'datagrid', 'rows', 'pagination', 'sort'],
};
