import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  TableComponent,
  TableHeaderDirective,
  TableBodyDirective,
  TableRowDirective,
  TableHeadDirective,
  TableCellDirective,
  TableCaptionDirective,
} from './table.component';

@Component({
  standalone: true,
  imports: [
    TableComponent,
    TableHeaderDirective,
    TableBodyDirective,
    TableRowDirective,
    TableHeadDirective,
    TableCellDirective,
    TableCaptionDirective,
  ],
  template: `
    <tolle-table>
      <caption tolleTableCaption>Recent invoices</caption>
      <thead tolleTableHeader>
        <tr tolleTableRow>
          <th tolleTableHead sort="ascending">Invoice</th>
          <th tolleTableHead>Amount</th>
        </tr>
      </thead>
      <tbody tolleTableBody>
        <tr tolleTableRow [selected]="firstSelected">
          <td tolleTableCell>INV-001</td>
          <td tolleTableCell>$250.00</td>
        </tr>
      </tbody>
    </tolle-table>
  `,
})
class HostComponent {
  firstSelected = false;
}

describe('TableComponent', () => {
  it('should create', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TableComponent] }).createComponent(
      TableComponent
    );
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('wraps the table in a horizontally scrolling container', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TableComponent] }).createComponent(
      TableComponent
    );
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('div');
    expect(wrapper.className).toContain('overflow-x-auto');
    expect(wrapper.querySelector('table')).toBeTruthy();
  });
});

describe('Table composition', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('keeps a valid table structure with no wrapper elements inside <table>', () => {
    const table: HTMLTableElement = fixture.nativeElement.querySelector('table');

    // The directives must style the native elements in place — any custom
    // element between <table> and <thead>/<tbody> would break table layout.
    const childTags = Array.from(table.children).map((c) => c.tagName.toLowerCase());
    expect(childTags).toEqual(['caption', 'thead', 'tbody']);

    const tbody = table.querySelector('tbody')!;
    expect(Array.from(tbody.children).every((c) => c.tagName.toLowerCase() === 'tr')).toBe(true);

    const row = tbody.querySelector('tr')!;
    expect(Array.from(row.children).every((c) => c.tagName.toLowerCase() === 'td')).toBe(true);
  });

  it('renders the projected cell content', () => {
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('INV-001');
    expect(fixture.nativeElement.querySelector('caption').textContent).toContain('Recent invoices');
  });

  it('defaults th scope to col and surfaces sort as aria-sort', () => {
    const heads = fixture.nativeElement.querySelectorAll('th');
    expect(heads[0].getAttribute('scope')).toBe('col');
    expect(heads[0].getAttribute('aria-sort')).toBe('ascending');
    expect(heads[1].getAttribute('aria-sort')).toBeNull();
  });

  it('reflects the selected row via data-state', () => {
    const row = () => fixture.nativeElement.querySelector('tbody tr');
    expect(row().getAttribute('data-state')).toBeNull();

    fixture.componentInstance.firstSelected = true;
    fixture.detectChanges();

    expect(row().getAttribute('data-state')).toBe('selected');
  });

  it('applies the directive styling to the native elements', () => {
    expect(fixture.nativeElement.querySelector('tbody tr').className).toContain('border-b');
    expect(fixture.nativeElement.querySelector('td').className).toContain('align-middle');
  });
});
