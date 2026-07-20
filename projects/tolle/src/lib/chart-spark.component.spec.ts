import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ChartSparkComponent } from './chart-spark.component';
import { ChartLineComponent, ChartAreaComponent, ChartBarComponent } from './chart.component';

const ROWS = [
  { day: 'Mon', sales: 10 },
  { day: 'Tue', sales: 30 },
  { day: 'Wed', sales: 20 },
  { day: 'Thu', sales: 40 },
];

@Component({
  standalone: true,
  imports: [ChartSparkComponent],
  template: `
    <tolle-chart-spark
      [data]="data"
      valueKey="sales"
      xKey="day"
      [type]="type"
      [hover]="hover"
    ></tolle-chart-spark>
  `,
})
class HostComponent {
  data = ROWS;
  type: 'line' | 'area' | 'bar' = 'line';
  hover = false;
}

describe('ChartSparkComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('reads values off the row property named by valueKey, not a hard-coded key', () => {
    const line = fixture.debugElement.query(By.directive(ChartLineComponent));
    expect(line.componentInstance.seriesKey).toBe('sales');

    const path = fixture.nativeElement.querySelector('g[tolle-chart-line] path');
    // A flat "M 0 0" path means the series never found any values to plot.
    expect(path.getAttribute('d')).not.toBe('');
    expect(path.getAttribute('stroke')).toBe('rgb(var(--chart-1))');
  });

  it('switches marks with the type input', () => {
    fixture.componentInstance.type = 'area';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(ChartAreaComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ChartLineComponent))).toBeNull();

    fixture.componentInstance.type = 'bar';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(ChartBarComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ChartAreaComponent))).toBeNull();
  });

  it('renders no hit layer or tooltip by default', () => {
    expect(fixture.nativeElement.querySelectorAll('rect[fill="transparent"]').length).toBe(0);
  });

  it('renders no grid, axis or legend chrome', () => {
    expect(fixture.nativeElement.querySelector('g[tolle-chart-grid]')).toBeNull();
    expect(fixture.nativeElement.querySelector('g[tolle-chart-x-axis]')).toBeNull();
    expect(fixture.nativeElement.querySelector('g[tolle-chart-y-axis]')).toBeNull();
  });

  it('still renders the accessible table fallback', () => {
    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeTruthy();
    expect(table.className).toContain('sr-only');
  });

  it('defaults to a tight 32px height with minimal margin', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('height')).toBe('32');
  });
});
