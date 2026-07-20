import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  ChartComponent,
  ChartGridComponent,
  ChartXAxisComponent,
  ChartYAxisComponent,
  ChartLineComponent,
  ChartAreaComponent,
  ChartBarComponent,
  ChartLegendComponent,
  ChartTableComponent,
  ChartTooltipComponent,
  barPath,
  barPathHorizontal,
} from './chart.component';
import { ChartService, type ChartSeries, type ChartOrientation } from './chart.service';

const ROWS = [
  { month: 'Jan', a: 10, b: 5 },
  { month: 'Feb', a: 30, b: 15 },
  { month: 'Mar', a: 20, b: 25 },
  { month: 'Apr', a: 40, b: 10 },
];

const TWO_SERIES: ChartSeries[] = [
  { key: 'a', label: 'Revenue' },
  { key: 'b', label: 'Cost' },
];

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ChartComponent,
    ChartGridComponent,
    ChartXAxisComponent,
    ChartYAxisComponent,
    ChartLineComponent,
    ChartAreaComponent,
    ChartBarComponent,
  ],
  template: `
    <tolle-chart
      [data]="data"
      [series]="series"
      xKey="month"
      ariaLabel="Monthly revenue"
      description="Revenue and cost by month"
      [stacked]="stacked"
      [orientation]="orientation"
      [showTable]="showTable"
      [hover]="hover"
    >
      <svg:g tolle-chart-grid></svg:g>
      <svg:g tolle-chart-y-axis></svg:g>
      <svg:g tolle-chart-x-axis></svg:g>
      <svg:g *ngIf="mark === 'line'" tolle-chart-line seriesKey="a" curve="smooth" [showDots]="true"></svg:g>
      <svg:g *ngIf="mark === 'area'" tolle-chart-area seriesKey="a"></svg:g>
      <svg:g *ngIf="mark === 'bar'" tolle-chart-bar seriesKey="a" [maxWidth]="100"></svg:g>
      <svg:g *ngIf="mark === 'bar'" tolle-chart-bar seriesKey="b" [maxWidth]="100"></svg:g>
    </tolle-chart>
  `,
})
class HostComponent {
  @ViewChild(ChartComponent) chart!: ChartComponent;
  data: Record<string, any>[] = ROWS;
  series: ChartSeries[] = TWO_SERIES;
  stacked = false;
  orientation: ChartOrientation = 'vertical';
  showTable = false;
  hover = true;
  mark: 'line' | 'area' | 'bar' | 'none' = 'line';
}

/** Pins the plot box so geometry assertions do not depend on the karma window. */
function pinLayout(fixture: ComponentFixture<HostComponent>, width = 400, height = 200): ChartService {
  const service = fixture.debugElement
    .query(By.directive(ChartComponent))
    .injector.get(ChartService);
  service.configure({ width, height, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  return service;
}

describe('ChartComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(host.chart).toBeTruthy();
  });

  it('renders an svg that announces itself as an image with a title and description', () => {
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.querySelector('title')?.textContent?.trim()).toBe('Monthly revenue');
    expect(svg.querySelector('desc')?.textContent?.trim()).toBe('Revenue and cost by month');
  });

  it('falls back to the aria label when no description is supplied', () => {
    const chartRef = fixture.debugElement.query(By.directive(ChartComponent));
    chartRef.componentInstance.description = '';
    fixture.detectChanges();

    const desc = fixture.nativeElement.querySelector('svg desc');
    expect(desc.textContent.trim()).toBe('Monthly revenue');
  });

  it('points aria-describedby at the table fallback it renders', () => {
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    const describedBy = svg.getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();
    expect(describedBy).toBe(host.chart.tableId);
    // The referenced node has to actually exist, or the reference is dead.
    expect(fixture.nativeElement.querySelector('#' + describedBy)).toBeTruthy();
  });

  it('renders projected marks in the SVG namespace, not the HTML one', () => {
    // This is why the parts use svg:g attribute selectors: a custom element is
    // created in the HTML namespace, and an HTML node inside an <svg> never
    // renders its SVG subtree, so the whole chart would silently draw nothing.
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const line = fixture.nativeElement.querySelector('g[tolle-chart-line] path');

    expect(line.namespaceURI).toBe(SVG_NS);
    expect(fixture.nativeElement.querySelector('g[tolle-chart-grid]').namespaceURI).toBe(SVG_NS);
    expect(fixture.nativeElement.querySelector('g[tolle-chart-x-axis] text').namespaceURI).toBe(SVG_NS);
  });

  it('uses a viewBox so the plot scales with its container', () => {
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('viewBox')).toMatch(/^0 0 \d+ 260$/);
  });

  it('disconnects its ResizeObserver on destroy', () => {
    const disconnect = jasmine.createSpy('disconnect');
    // The observer is private; assert through the teardown path it guards.
    (host.chart as any).resizeObserver = { disconnect, observe: () => {} };
    fixture.destroy();
    expect(disconnect).toHaveBeenCalled();
  });
});

describe('ChartComponent legend', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders a legend entry per series when there are two or more', () => {
    const legend = fixture.debugElement.query(By.directive(ChartLegendComponent));
    expect(legend).toBeTruthy();

    const entries = legend.nativeElement.querySelectorAll('li');
    expect(entries.length).toBe(2);
    expect(entries[0].textContent).toContain('Revenue');
    expect(entries[1].textContent).toContain('Cost');
  });

  it('renders no legend for a single series, since the title already names it', () => {
    fixture.componentInstance.series = [{ key: 'a', label: 'Revenue' }];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(ChartLegendComponent))).toBeNull();
  });

  it('colours legend swatches by series identity, in palette order', () => {
    const swatches = fixture.debugElement
      .query(By.directive(ChartLegendComponent))
      .nativeElement.querySelectorAll('li span:first-child');

    expect(swatches[0].style.background).toContain('--chart-1');
    expect(swatches[1].style.background).toContain('--chart-2');
  });

  it('keeps a series swatch when an earlier series is filtered out', () => {
    fixture.componentInstance.series = [{ key: 'b', label: 'Cost' }, { key: 'a', label: 'Revenue' }];
    fixture.detectChanges();

    const legend = fixture.debugElement.query(By.directive(ChartLegendComponent));
    const items = legend.nativeElement.querySelectorAll('li');
    const cost = Array.from(items as NodeListOf<HTMLElement>).find((li) =>
      li.textContent?.includes('Cost')
    );
    // 'Cost' registered second, so it keeps step 2 no matter where it now sits.
    expect(cost?.querySelector('span')?.getAttribute('style')).toContain('--chart-2');
  });
});

describe('ChartComponent table fallback', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders a real table holding every data row', () => {
    const table = fixture.debugElement.query(By.directive(ChartTableComponent)).nativeElement;
    const rows = table.querySelectorAll('tbody tr');

    expect(rows.length).toBe(ROWS.length);
    ROWS.forEach((row, i) => {
      expect(rows[i].textContent).toContain(row.month);
      expect(rows[i].textContent).toContain(String(row.a));
      expect(rows[i].textContent).toContain(String(row.b));
    });
  });

  it('renders a header cell per series plus the category column', () => {
    const table = fixture.debugElement.query(By.directive(ChartTableComponent)).nativeElement;
    const headers = table.querySelectorAll('thead th');

    expect(headers.length).toBe(TWO_SERIES.length + 1);
    expect(headers[0].textContent).toContain('Category');
    expect(headers[1].textContent).toContain('Revenue');
  });

  it('is visually hidden by default but still in the accessibility tree', () => {
    const table = fixture.debugElement.query(By.directive(ChartTableComponent)).nativeElement;
    expect(table.querySelector('table').className).toContain('sr-only');
  });

  it('becomes visible when asked', () => {
    fixture.componentInstance.showTable = true;
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.directive(ChartTableComponent)).nativeElement;
    expect(table.querySelector('table').className).not.toContain('sr-only');
  });

  it('renders a dash rather than a blank for a missing value', () => {
    fixture.componentInstance.data = [{ month: 'Jan', a: 10 }];
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.directive(ChartTableComponent)).nativeElement;
    expect(table.querySelector('tbody tr').textContent).toContain('—');
  });
});

describe('ChartComponent hover layer', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    pinLayout(fixture);
    fixture.detectChanges();
  });

  function hitRects(): SVGRectElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('svg > rect'));
  }

  it('lays one invisible hit rect over every x band', () => {
    const rects = hitRects();
    expect(rects.length).toBe(ROWS.length);
    expect(rects[0].getAttribute('fill')).toBe('transparent');
  });

  it('gives each hit rect a target far larger than the marks under it', () => {
    for (const rect of hitRects()) {
      expect(Number(rect.getAttribute('width'))).toBeGreaterThan(24);
      expect(Number(rect.getAttribute('height'))).toBeGreaterThan(24);
    }
  });

  it('shows a tooltip listing every series when a band is hovered', fakeAsync(() => {
    hitRects()[1].dispatchEvent(new PointerEvent('pointerenter'));
    tick();
    fixture.detectChanges();

    const tooltip = fixture.debugElement.query(By.directive(ChartTooltipComponent)).nativeElement;
    expect(tooltip.textContent).toContain('Feb');
    expect(tooltip.textContent).toContain('Revenue');
    expect(tooltip.textContent).toContain('Cost');
    expect(tooltip.textContent).toContain('30');
    expect(tooltip.textContent).toContain('15');
  }));

  it('draws a crosshair at the hovered point on a point scale', fakeAsync(() => {
    hitRects()[2].dispatchEvent(new PointerEvent('pointerenter'));
    tick();
    fixture.detectChanges();

    const line = fixture.nativeElement.querySelector('svg > line');
    expect(line).toBeTruthy();
    expect(line.getAttribute('x1')).toBe(line.getAttribute('x2'));
  }));

  it('clears the tooltip when the pointer leaves the plot', fakeAsync(() => {
    hitRects()[1].dispatchEvent(new PointerEvent('pointerenter'));
    tick();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('svg').dispatchEvent(new PointerEvent('pointerleave'));
    tick();
    fixture.detectChanges();

    const tooltip = fixture.debugElement.query(By.directive(ChartTooltipComponent));
    expect(tooltip.componentInstance.index).toBeNull();
  }));

  it('emits the hovered index', fakeAsync(() => {
    const seen: (number | null)[] = [];
    fixture.componentInstance.chart.activeIndexChange.subscribe((i) => seen.push(i));

    hitRects()[3].dispatchEvent(new PointerEvent('pointerenter'));
    tick();
    fixture.detectChanges();

    expect(seen).toContain(3);
  }));

  it('flips the tooltip inward rather than letting it overflow the right edge', fakeAsync(() => {
    hitRects()[3].dispatchEvent(new PointerEvent('pointerenter'));
    tick();
    fixture.detectChanges();

    const tooltip = fixture.debugElement.query(By.directive(ChartTooltipComponent)).componentInstance;
    // Last band sits at the right edge, so the readout has to flip left of it.
    expect(tooltip.left).toBeLessThan(400 - tooltip.estimatedWidth);
  }));

  it('renders no hit layer when hover is switched off', () => {
    fixture.componentInstance.hover = false;
    fixture.detectChanges();
    expect(hitRects().length).toBe(0);
    expect(fixture.debugElement.query(By.directive(ChartTooltipComponent))).toBeNull();
  });
});

describe('ChartXAxisComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function axisLabels(): string[] {
    const axis = fixture.nativeElement.querySelector('g[tolle-chart-x-axis]');
    return Array.from(axis.querySelectorAll('text')).map((t) => (t as SVGTextElement).textContent ?? '');
  }

  it('draws every label when they all fit', () => {
    pinLayout(fixture, 600);
    fixture.detectChanges();
    expect(axisLabels()).toEqual(['Jan', 'Feb', 'Mar', 'Apr']);
  });

  it('thins labels rather than overprinting them when space runs out', () => {
    fixture.componentInstance.data = Array.from({ length: 40 }, (_, i) => ({
      month: 'Week ' + (i + 1),
      a: i,
      b: i,
    }));
    fixture.detectChanges();
    pinLayout(fixture, 300);
    fixture.detectChanges();

    const labels = axisLabels();
    expect(labels.length).toBeLessThan(40);
    expect(labels.length).toBeGreaterThan(0);
    expect(labels[0]).toBe('Week 1');
  });

  it('keeps the drawn labels evenly spaced when thinning', () => {
    fixture.componentInstance.data = Array.from({ length: 24 }, (_, i) => ({
      month: 'Label ' + i,
      a: i,
      b: i,
    }));
    fixture.detectChanges();
    pinLayout(fixture, 300);
    fixture.detectChanges();

    const axis = fixture.debugElement.query(By.directive(ChartXAxisComponent)).componentInstance;
    const stride = axis.stride;
    expect(stride).toBeGreaterThan(1);
    expect(axis.visibleTicks.length).toBe(Math.ceil(24 / stride));
  });

  it('never returns a stride below one, even with no room at all', () => {
    pinLayout(fixture, 0);
    fixture.detectChanges();
    const axis = fixture.debugElement.query(By.directive(ChartXAxisComponent)).componentInstance;
    expect(axis.stride).toBeGreaterThanOrEqual(1);
  });

  it('paints axis text with a text token, never the series colour', () => {
    const axis = fixture.nativeElement.querySelector('g[tolle-chart-x-axis]');
    const text = axis.querySelector('text');
    expect(text.getAttribute('class')).toContain('fill-muted-foreground');
    expect(text.getAttribute('class')).not.toContain('chart-');
  });
});

describe('ChartYAxisComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    pinLayout(fixture);
    fixture.detectChanges();
  });

  it('draws a label per nice tick, in a text token', () => {
    const axis = fixture.nativeElement.querySelector('g[tolle-chart-y-axis]');
    const texts = Array.from(axis.querySelectorAll('text')) as SVGTextElement[];

    expect(texts.length).toBeGreaterThan(1);
    expect(texts[0].getAttribute('class')).toContain('fill-muted-foreground');
    expect(texts.map((t) => t.textContent)).toContain('40');
  });

  it('puts the largest tick at the top of the plot', () => {
    const axis = fixture.nativeElement.querySelector('g[tolle-chart-y-axis]');
    const texts = Array.from(axis.querySelectorAll('text')) as SVGTextElement[];
    const ys = texts.map((t) => Number(t.getAttribute('y')));
    const values = texts.map((t) => Number(t.textContent));

    const topIndex = ys.indexOf(Math.min(...ys));
    expect(values[topIndex]).toBe(Math.max(...values));
  });
});

describe('horizontal orientation axis roles', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mark = 'bar';
    fixture.componentInstance.orientation = 'horizontal';
    fixture.detectChanges();
    pinLayout(fixture);
    fixture.detectChanges();
  });

  it('swaps the bottom axis to show value ticks instead of category labels', () => {
    const axis = fixture.debugElement.query(By.directive(ChartXAxisComponent)).componentInstance;
    const labels = axis.visibleTicks.map((t: { label: string }) => t.label);
    // Value ticks are numeric ("nice" round numbers), not the month labels.
    expect(labels).not.toContain('Jan');
    expect(labels.every((l: string) => /^-?[\d,.]+$/.test(l))).toBeTrue();
  });

  it('swaps the left axis to show category labels instead of value ticks', () => {
    const axis = fixture.debugElement.query(By.directive(ChartYAxisComponent)).componentInstance;
    const labels = axis.visibleTicks.map((t: { label: string }) => t.label);
    expect(labels).toEqual(['Jan', 'Feb', 'Mar', 'Apr']);
  });
});

describe('ChartGridComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    pinLayout(fixture);
    fixture.detectChanges();
  });

  it('draws a recessive horizontal rule at each y tick', () => {
    const grid = fixture.nativeElement.querySelector('g[tolle-chart-grid]');
    const lines = Array.from(grid.querySelectorAll('line')) as SVGLineElement[];

    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) {
      expect(line.getAttribute('class')).toContain('stroke-border');
      expect(line.getAttribute('class')).toContain('opacity-60');
      expect(line.getAttribute('stroke-width')).toBe('1');
      // Horizontal: same y at both ends.
      expect(line.getAttribute('y1')).toBe(line.getAttribute('y2'));
    }
  });

  it('adds category rules only when asked', () => {
    const grid = fixture.debugElement.query(By.directive(ChartGridComponent));
    expect(grid.componentInstance.categoryLines.length).toBe(0);

    grid.componentInstance.vertical = true;
    fixture.detectChanges();
    expect(grid.componentInstance.categoryLines.length).toBe(ROWS.length);
  });
});

describe('ChartGridComponent horizontal orientation', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mark = 'bar';
    fixture.componentInstance.orientation = 'horizontal';
    fixture.detectChanges();
    pinLayout(fixture);
    fixture.detectChanges();
  });

  it('draws value rules as vertical lines instead of horizontal ones', () => {
    const grid = fixture.debugElement.query(By.directive(ChartGridComponent)).componentInstance;
    expect(grid.valueLines.length).toBeGreaterThan(1);
    for (const line of grid.valueLines) {
      // Vertical: same x at both ends.
      expect(line.x1).toBe(line.x2);
    }
  });

  it('draws category rules as horizontal lines instead of vertical ones', () => {
    const grid = fixture.debugElement.query(By.directive(ChartGridComponent)).componentInstance;
    grid.vertical = true;
    fixture.detectChanges();
    expect(grid.categoryLines.length).toBe(ROWS.length);
    for (const line of grid.categoryLines) {
      expect(line.y1).toBe(line.y2);
    }
  });
});

describe('ChartLineComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    pinLayout(fixture);
    fixture.detectChanges();
  });

  it('strokes the line at 2px in the series colour, with no fill', () => {
    const path = fixture.nativeElement.querySelector('g[tolle-chart-line] path');
    expect(path.getAttribute('stroke-width')).toBe('2');
    expect(path.getAttribute('fill')).toBe('none');
    expect(path.getAttribute('stroke')).toBe('rgb(var(--chart-1))');
  });

  it('emits cubic segments for a smooth curve', () => {
    const path = fixture.nativeElement.querySelector('g[tolle-chart-line] path');
    expect(path.getAttribute('d')).toContain('C');
  });

  it('emits straight segments for a linear curve', () => {
    const line = fixture.debugElement.query(By.directive(ChartLineComponent)).componentInstance;
    line.curve = 'linear';
    fixture.detectChanges();

    const path = fixture.nativeElement.querySelector('g[tolle-chart-line] path');
    expect(path.getAttribute('d')).toContain('L');
    expect(path.getAttribute('d')).not.toContain('C');
  });

  it('draws markers at least 8px across, ringed in the surface colour', () => {
    const dots = fixture.nativeElement.querySelectorAll('g[tolle-chart-line] circle');
    expect(dots.length).toBe(ROWS.length);
    for (const dot of dots) {
      expect(Number(dot.getAttribute('r')) * 2).toBeGreaterThanOrEqual(8);
      expect(dot.getAttribute('class')).toContain('stroke-background');
    }
  });

  it('draws no markers when showDots is off', () => {
    const line = fixture.debugElement.query(By.directive(ChartLineComponent)).componentInstance;
    line.showDots = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('g[tolle-chart-line] circle').length).toBe(0);
  });
});

describe('ChartAreaComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mark = 'area';
    fixture.detectChanges();
    pinLayout(fixture);
    fixture.detectChanges();
  });

  it('washes the fill and keeps a 2px stroke on top', () => {
    const paths = fixture.nativeElement.querySelectorAll('g[tolle-chart-area] path');
    expect(paths.length).toBe(2);

    expect(paths[0].getAttribute('fill')).toBe('rgb(var(--chart-1))');
    expect(Number(paths[0].getAttribute('fill-opacity'))).toBeLessThanOrEqual(0.15);
    expect(paths[1].getAttribute('stroke-width')).toBe('2');
    expect(paths[1].getAttribute('fill')).toBe('none');
  });

  it('closes the fill back along the baseline', () => {
    const path = fixture.nativeElement.querySelector('g[tolle-chart-area] path');
    expect(path.getAttribute('d').trim().endsWith('Z')).toBeTrue();
  });

  it('pulls zero into the domain so the fill has a real floor', fakeAsync(() => {
    const service = fixture.debugElement
      .query(By.directive(ChartComponent))
      .injector.get(ChartService);
    tick();
    expect(service.domain[0]).toBe(0);
  }));
});

describe('ChartBarComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let service: ChartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mark = 'bar';
    fixture.detectChanges();
    service = pinLayout(fixture);
    fixture.detectChanges();
  });

  function barsFor(key: string) {
    const index = key === 'a' ? 0 : 1;
    return fixture.debugElement.queryAll(By.directive(ChartBarComponent))[index].componentInstance
      .bars as { d: string; x: number; width: number; yBase: number; yValue: number }[];
  }

  it('switches the chart onto a band scale', () => {
    expect(service.mode).toBe('band');
  });

  it('forces zero into the domain so bars are not truncated', () => {
    expect(service.domain[0]).toBe(0);
  });

  it('draws one bar per row per series', () => {
    const paths = fixture.nativeElement.querySelectorAll('g[tolle-chart-bar] path');
    expect(paths.length).toBe(ROWS.length * 2);
  });

  it('rounds only the data end and leaves the baseline square', () => {
    // Two quadratic corners at the top, and the path starts and ends on the baseline.
    const d = barsFor('a')[0].d;
    expect((d.match(/Q/g) ?? []).length).toBe(2);

    const baseline = service.yFor(0);
    const numbers = d.split(/[^\d.\-]+/).filter(Boolean).map(Number);
    expect(numbers[1]).toBeCloseTo(baseline, 6);
    expect(numbers[numbers.length - 1]).toBeCloseTo(baseline, 6);
  });

  it('anchors every bar to the shared baseline', () => {
    const baseline = service.yFor(0);
    for (const bar of barsFor('a')) {
      expect(bar.d.startsWith('M ')).toBeTrue();
      expect(bar.d).toContain(String(baseline));
    }
  });

  it('leaves exactly a 2px gap between adjacent grouped bars', () => {
    const first = barsFor('a')[0];
    const second = barsFor('b')[0];
    expect(second.x - (first.x + first.width)).toBeCloseTo(2, 6);
  });

  it('caps bar thickness so a wide band becomes air, not a fatter bar', () => {
    const bar = fixture.debugElement.queryAll(By.directive(ChartBarComponent))[0].componentInstance;
    bar.maxWidth = 24;
    fixture.detectChanges();
    for (const drawn of bar.bars) {
      expect(drawn.width).toBeLessThanOrEqual(24);
    }
  });

  it('keeps grouped bars inside their own band', () => {
    for (let i = 0; i < ROWS.length; i++) {
      const band = service.bandFor(i);
      const bar = barsFor('a')[i];
      expect(bar.x).toBeGreaterThanOrEqual(band.start - 1e-6);
      expect(bar.x + bar.width).toBeLessThanOrEqual(band.start + band.width + 1e-6);
    }
  });

  it('stacks segments with a 2px surface gap between them', fakeAsync(() => {
    fixture.componentInstance.stacked = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const lower = barsFor('a')[0];
    const upper = barsFor('b')[0];

    // The upper segment starts where the lower one's value sits; the 2px comes
    // off the lower segment's data end, so surface shows through the join.
    expect(lower.yValue - upper.yBase).toBeCloseTo(2, 6);
  }));

  it('gives stacked segments the full band rather than splitting it', fakeAsync(() => {
    fixture.componentInstance.stacked = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const lower = barsFor('a')[0];
    const upper = barsFor('b')[0];
    expect(lower.x).toBeCloseTo(upper.x, 6);
    expect(lower.width).toBeCloseTo(upper.width, 6);
  }));
});

describe('ChartBarComponent horizontal orientation', () => {
  let fixture: ComponentFixture<HostComponent>;
  let service: ChartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mark = 'bar';
    fixture.componentInstance.orientation = 'horizontal';
    fixture.detectChanges();
    service = pinLayout(fixture);
    fixture.detectChanges();
  });

  function barsFor(key: string) {
    const index = key === 'a' ? 0 : 1;
    return fixture.debugElement.queryAll(By.directive(ChartBarComponent))[index].componentInstance
      .bars as { d: string; x: number; width: number; yBase: number; yValue: number }[];
  }

  it('still switches onto a band scale and forces zero into the domain', () => {
    expect(service.mode).toBe('band');
    expect(service.domain[0]).toBe(0);
  });

  it('lays bars out along the vertical axis instead of the horizontal one', () => {
    // In horizontal mode `x`/`width` hold the bar's vertical footprint, so
    // successive rows should be stacked top-to-bottom rather than side-by-side.
    const bars = barsFor('a');
    expect(bars[1].x).toBeGreaterThan(bars[0].x);
  });

  it('extends bars from the value-axis baseline horizontally', () => {
    const baseline = service.yFor(0);
    for (const bar of barsFor('a')) {
      expect(bar.d.startsWith('M ' + baseline)).toBeTrue();
    }
  });

  it('renders hit rects spanning the full plot width instead of full height', () => {
    // Reads the getter directly rather than the rendered DOM: ChartComponent is
    // OnPush and pinLayout's direct service.configure() marks it dirty via a
    // microtask, which a synchronous detectChanges() here would race.
    const chart = fixture.debugElement.query(By.directive(ChartComponent)).componentInstance as ChartComponent;
    const rect = chart.hitRects[0];
    expect(rect.width).toBeCloseTo(service.plotWidth, 6);
  });
});

describe('barPathHorizontal', () => {
  it('rounds the right end when the value sits to the right of the baseline', () => {
    const d = barPathHorizontal(0, 20, 100, 160, 4);
    expect(d.startsWith('M 100 0')).toBeTrue();
    expect(d.trim().endsWith('Z')).toBeTrue();
    expect((d.match(/Q/g) ?? []).length).toBe(2);
  });

  it('rounds the left end when the value sits to the left of the baseline', () => {
    const d = barPathHorizontal(0, 20, 100, 40, 4);
    // Corner control steps rightward from the data end, mirroring the positive case.
    expect(d).toContain('L 44 0');
  });

  it('clamps the radius on a bar shorter or narrower than the radius', () => {
    const shallow = barPathHorizontal(0, 20, 100, 102, 4);
    expect(shallow).toContain('Q 102 0 102 2');

    const narrow = barPathHorizontal(0, 4, 100, 160, 4);
    expect(narrow).toContain('Q 160 0 160 2');
  });
});

describe('barPath', () => {
  it('rounds the top when the value sits above the baseline', () => {
    const d = barPath(0, 20, 100, 40, 4);
    expect(d).toContain('Q 0 40 4 40');
    expect(d.startsWith('M 0 100')).toBeTrue();
    expect(d.trim().endsWith('Z')).toBeTrue();
  });

  it('rounds the bottom when the value sits below the baseline', () => {
    const d = barPath(0, 20, 100, 160, 4);
    // Corner control steps downward from the data end, mirroring the positive case.
    expect(d).toContain('L 0 156');
  });

  it('clamps the radius on a bar shorter or narrower than the radius', () => {
    const shallow = barPath(0, 20, 100, 98, 4);
    expect(shallow).toContain('Q 0 98 2 98');

    const narrow = barPath(0, 4, 100, 40, 4);
    expect(narrow).toContain('Q 0 40 2 40');
  });

  it('produces a closed path with two rounded corners', () => {
    const d = barPath(10, 30, 200, 50, 4);
    expect((d.match(/Q/g) ?? []).length).toBe(2);
    expect(d.trim().endsWith('Z')).toBeTrue();
  });
});

describe('ChartComponent change-detection stability', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    pinLayout(fixture);
    fixture.detectChanges();
  });

  // The hit bands carry the hover handler. If a change-detection pass replaces
  // them, destroying the band under the cursor re-fires pointerenter, which
  // marks the chart dirty and schedules another pass — the page locks up.
  it('does not recreate hit bands on a change-detection pass', () => {
    const before = Array.from(fixture.nativeElement.querySelectorAll('rect[fill="transparent"]'));
    expect(before.length).toBeGreaterThan(0);

    fixture.detectChanges();
    fixture.detectChanges();

    const after = Array.from(fixture.nativeElement.querySelectorAll('rect[fill="transparent"]'));
    expect(after.length).toBe(before.length);
    after.forEach((node, i) => expect(node).toBe(before[i] as any));
  });

  it('keeps the hovered band alive across the redraw it triggers', () => {
    const bands = fixture.nativeElement.querySelectorAll('rect[fill="transparent"]');
    const target = bands[1];

    target.dispatchEvent(new PointerEvent('pointerenter'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('rect[fill="transparent"]')[1]).toBe(target);
  });

  it('does not recreate axis ticks or grid lines on a redraw', () => {
    const beforeText = Array.from(fixture.nativeElement.querySelectorAll('text'));
    const beforeLines = Array.from(fixture.nativeElement.querySelectorAll('line'));

    fixture.detectChanges();

    Array.from(fixture.nativeElement.querySelectorAll('text')).forEach((n, i) =>
      expect(n).toBe(beforeText[i] as any)
    );
    Array.from(fixture.nativeElement.querySelectorAll('line')).forEach((n, i) =>
      expect(n).toBe(beforeLines[i] as any)
    );
  });
});
