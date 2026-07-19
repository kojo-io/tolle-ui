import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableComponent } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('background colors', () => {
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

    beforeEach(() => {
      component.data = rows;
      component.columns = [{ key: 'id', label: 'ID' }];
      // ngOnInit already ran with empty inputs; re-run it to pick up the data
      // (ngOnChanges only refreshes on a non-first `data` change).
      component.ngOnInit();
      fixture.detectChanges();
    });

    const tableSurface = (): HTMLElement =>
      fixture.nativeElement.querySelector('table').closest('div').parentElement;
    const thead = (): HTMLElement => fixture.nativeElement.querySelector('thead');
    const bodyRows = (): HTMLElement[] =>
      Array.from(fixture.nativeElement.querySelectorAll('tbody tr'));

    it('applies tableBackground to the table surface', () => {
      component.tableBackground = 'bg-card';
      fixture.detectChanges();
      expect(tableSurface().className).toContain('bg-card');
    });

    it('applies headerBackground to the header', () => {
      component.headerBackground = 'bg-muted';
      fixture.detectChanges();
      expect(thead().className).toContain('bg-muted');
      expect(thead().className).not.toContain('bg-background');
    });

    // A transparent sticky header lets rows scroll visibly through it.
    it('keeps a sticky header opaque even if headerBackground is cleared', () => {
      component.stickyHeader = true;
      component.headerBackground = '';
      fixture.detectChanges();
      expect(component.resolvedHeaderBackground).toBe('bg-background');
      expect(thead().className).toContain('bg-background');
    });

    it('allows a transparent header when not sticky', () => {
      component.stickyHeader = false;
      component.headerBackground = '';
      fixture.detectChanges();
      expect(component.resolvedHeaderBackground).toBe('');
    });

    it('stripes odd rows only', () => {
      component.striped = true;
      fixture.detectChanges();

      expect(component.getRowBackground(rows[0], 0)).toBe('');
      expect(component.getRowBackground(rows[1], 1)).toBe('bg-muted/30');
      expect(component.getRowBackground(rows[2], 2)).toBe('');
    });

    it('does not stripe when striped is off', () => {
      component.striped = false;
      expect(component.getRowBackground(rows[1], 1)).toBe('');
    });

    it('honours a custom stripeBackground', () => {
      component.striped = true;
      component.stripeBackground = 'bg-accent/20';
      expect(component.getRowBackground(rows[1], 1)).toBe('bg-accent/20');
    });

    it('resolves rowBackground against the row data', () => {
      component.rowBackground = (row: any) => (row.id === 2 ? 'bg-destructive/10' : '');
      fixture.detectChanges();

      expect(component.getRowBackground(rows[0], 0)).toBe('');
      expect(component.getRowBackground(rows[1], 1)).toBe('bg-destructive/10');
    });

    it('lets rowBackground win over striping', () => {
      component.striped = true;
      component.rowBackground = (row: any) => (row.id === 2 ? 'bg-destructive/10' : '');

      // Index 1 would otherwise be striped.
      expect(component.getRowBackground(rows[1], 1)).toBe('bg-destructive/10');
      // Falls back to the stripe where the callback returns nothing.
      expect(component.getRowBackground(rows[3], 3)).toBe('bg-muted/30');
    });

    it('renders the resolved row background and preserves hover', () => {
      component.striped = true;
      fixture.detectChanges();

      const dataRows = bodyRows();
      expect(dataRows[1].className).toContain('bg-muted/30');
      // Striping must not knock out the hover affordance.
      expect(dataRows[1].className).toContain('hover:bg-muted/50');
    });
  });
});
