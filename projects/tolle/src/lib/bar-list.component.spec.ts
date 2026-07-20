import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarListComponent } from './bar-list.component';

const ROWS = [
  { source: 'Organic search', sessions: 4820 },
  { source: 'Direct', sessions: 2140 },
  { source: 'Referral', sessions: 1275 },
];

describe('BarListComponent', () => {
  let component: BarListComponent;
  let fixture: ComponentFixture<BarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BarListComponent);
    component = fixture.componentInstance;
  });

  function rowEls(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll(':scope > div > div'));
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders one row per data item, in order', () => {
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('labelKey', 'source');
    fixture.componentRef.setInput('valueKey', 'sessions');
    fixture.detectChanges();

    const rows = rowEls();
    expect(rows.length).toBe(3);
    expect(rows[0].textContent).toContain('Organic search');
    expect(rows[0].textContent).toContain('4,820');
    expect(rows[1].textContent).toContain('Direct');
  });

  it('scales bar width to each row’s share of the largest value', () => {
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('labelKey', 'source');
    fixture.componentRef.setInput('valueKey', 'sessions');
    fixture.detectChanges();

    expect(component.rows[0].percent).toBeCloseTo(100, 6);
    expect(component.rows[1].percent).toBeCloseTo((2140 / 4820) * 100, 6);
    expect(component.rows[2].percent).toBeCloseTo((1275 / 4820) * 100, 6);
  });

  it('formats large numbers with thousands separators', () => {
    fixture.componentRef.setInput('data', [{ label: 'A', value: 12345 }]);
    fixture.detectChanges();
    expect(rowEls()[0].textContent).toContain('12,345');
  });

  it('treats a missing or non-numeric value as zero rather than throwing', () => {
    fixture.componentRef.setInput('data', [{ label: 'A' }, { label: 'B', value: 'nope' }, { label: 'C', value: 10 }]);
    fixture.detectChanges();

    expect(component.rows[0].value).toBe(0);
    expect(component.rows[1].value).toBe(0);
    expect(component.rows[2].percent).toBeCloseTo(100, 6);
  });

  it('gives every bar the same accent rather than a categorical colour', () => {
    fixture.componentRef.setInput('data', ROWS);
    fixture.componentRef.setInput('labelKey', 'source');
    fixture.componentRef.setInput('valueKey', 'sessions');
    fixture.detectChanges();

    const bars = Array.from(fixture.nativeElement.querySelectorAll('.bg-primary\\/15'));
    expect(bars.length).toBe(3);
  });

  it('renders no rows and no error for empty data', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    expect(rowEls().length).toBe(0);
  });
});
