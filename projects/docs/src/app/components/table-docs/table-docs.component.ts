import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicTableComponent } from '../../docs-examples/table/basic-table/basic-table.component';
import { TableWithFooterComponent } from '../../docs-examples/table/table-with-footer/table-with-footer.component';
import { SelectableRowsComponent } from '../../docs-examples/table/selectable-rows/selectable-rows.component';


@Component({
  selector: 'app-table-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicTableComponent,
    TableWithFooterComponent,
    SelectableRowsComponent
  ],
  templateUrl: './table-docs.component.html',
  styleUrl: './table-docs.component.css'
})
export class TableDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  TableComponent,
  TableHeaderDirective,
  TableBodyDirective,
  TableFooterDirective,
  TableRowDirective,
  TableHeadDirective,
  TableCellDirective,
  TableCaptionDirective
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [
    TableComponent,
    TableHeaderDirective,
    TableBodyDirective,
    TableRowDirective,
    TableHeadDirective,
    TableCellDirective
  ]
})`;

  basicCode = `<tolle-table>
  <caption tolleTableCaption>A list of your recent invoices.</caption>
  <thead tolleTableHeader>
    <tr tolleTableRow>
      <th tolleTableHead>Invoice</th>
      <th tolleTableHead>Status</th>
      <th tolleTableHead>Method</th>
      <th tolleTableHead class="text-right">Amount</th>
    </tr>
  </thead>
  <tbody tolleTableBody>
    <tr tolleTableRow>
      <td tolleTableCell class="font-medium">INV-001</td>
      <td tolleTableCell>Paid</td>
      <td tolleTableCell>Credit Card</td>
      <td tolleTableCell class="text-right">$250.00</td>
    </tr>
    <tr tolleTableRow>
      <td tolleTableCell class="font-medium">INV-002</td>
      <td tolleTableCell>Pending</td>
      <td tolleTableCell>PayPal</td>
      <td tolleTableCell class="text-right">$150.00</td>
    </tr>
    <tr tolleTableRow>
      <td tolleTableCell class="font-medium">INV-003</td>
      <td tolleTableCell>Unpaid</td>
      <td tolleTableCell>Bank Transfer</td>
      <td tolleTableCell class="text-right">$350.00</td>
    </tr>
  </tbody>
</tolle-table>`;

  footerCode = `<tolle-table>
  <thead tolleTableHeader>
    <tr tolleTableRow>
      <th tolleTableHead>SKU</th>
      <th tolleTableHead>Description</th>
      <th tolleTableHead class="text-right">Qty</th>
      <th tolleTableHead class="text-right">Total</th>
    </tr>
  </thead>
  <tbody tolleTableBody>
    <tr tolleTableRow *ngFor="let item of items">
      <td tolleTableCell class="font-medium">{{ item.sku }}</td>
      <td tolleTableCell>{{ item.description }}</td>
      <td tolleTableCell class="text-right">{{ item.quantity }}</td>
      <td tolleTableCell class="text-right">{{ item.total | currency }}</td>
    </tr>
  </tbody>
  <tfoot tolleTableFooter>
    <tr tolleTableRow>
      <td tolleTableCell colspan="3">Total</td>
      <td tolleTableCell class="text-right">{{ grandTotal | currency }}</td>
    </tr>
  </tfoot>
</tolle-table>`;

  selectableCode = `<tolle-table>
  <thead tolleTableHeader>
    <tr tolleTableRow>
      <th tolleTableHead sort="ascending">Name</th>
      <th tolleTableHead>Role</th>
      <th tolleTableHead>Email</th>
    </tr>
  </thead>
  <tbody tolleTableBody>
    <tr tolleTableRow *ngFor="let row of rows"
        [selected]="row.id === selectedId"
        class="cursor-pointer"
        (click)="toggle(row)">
      <td tolleTableCell class="font-medium">{{ row.name }}</td>
      <td tolleTableCell>{{ row.role }}</td>
      <td tolleTableCell>{{ row.email }}</td>
    </tr>
  </tbody>
</tolle-table>`;

  tableProps: PropEntry[] = [
    { name: 'containerClass', type: 'string', default: "''", description: 'Additional CSS classes for the scrolling container that wraps the table.' },
    { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes for the inner <table> element.' }
  ];

  subComponents: PropEntry[] = [
    { name: '[tolleTableHeader]', type: 'directive', description: 'Styles a native <thead>. Accepts class.' },
    { name: '[tolleTableBody]', type: 'directive', description: 'Styles a native <tbody>, dropping the border on the last row. Accepts class.' },
    { name: '[tolleTableFooter]', type: 'directive', description: 'Styles a native <tfoot> for summary or total rows. Accepts class.' },
    { name: '[tolleTableRow]', type: 'directive', description: 'Styles a native <tr>. Input selected: boolean (default false) applies the selected background and sets data-state="selected". Accepts class.' },
    { name: '[tolleTableHead]', type: 'directive', description: "Styles a native <th>. Inputs scope: 'col' | 'row' | 'colgroup' | 'rowgroup' (default 'col') and sort: 'ascending' | 'descending' | 'none' | null (default null, surfaced as aria-sort). Accepts class." },
    { name: '[tolleTableCell]', type: 'directive', description: 'Styles a native <td> data cell. Accepts class.' },
    { name: '[tolleTableCaption]', type: 'directive', description: 'Styles a native <caption>, rendered below the table. Accepts class.' }
  ];
}
