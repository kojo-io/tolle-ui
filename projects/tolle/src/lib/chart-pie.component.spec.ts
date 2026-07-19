import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ChartPieComponent, arcPath, polarPoint } from './chart-pie.component';
import { ChartTableComponent } from './chart.component';
import { CHART_OVERFLOW_COLOR } from './chart.service';

const SLICES = [
  { label: 'Direct', value: 40 },
  { label: 'Search', value: 30 },
  { label: 'Social', value: 20 },
  { label: 'Email', value: 10 },
];

describe('polarPoint', () => {
  it('puts angle zero at twelve o clock', () => {
    const [x, y] = polarPoint(100, 100, 50, 0);
    expect(x).toBeCloseTo(100, 6);
    expect(y).toBeCloseTo(50, 6);
  });

  it('advances clockwise, so a quarter turn lands on the right edge', () => {
    const [x, y] = polarPoint(100, 100, 50, Math.PI / 2);
    expect(x).toBeCloseTo(150, 6);
    expect(y).toBeCloseTo(100, 6);
  });

  it('puts a half turn at six o clock', () => {
    const [x, y] = polarPoint(100, 100, 50, Math.PI);
    expect(x).toBeCloseTo(100, 6);
    expect(y).toBeCloseTo(150, 6);
  });
});

describe('arcPath', () => {
  it('draws a wedge back to the centre for a pie slice', () => {
    const d = arcPath(100, 100, 80, 0, 0, Math.PI / 2);
    expect(d.startsWith('M 100 100')).toBeTrue();
    expect(d).toContain('A 80 80');
    expect(d.trim().endsWith('Z')).toBeTrue();
  });

  it('draws a ring segment with two arcs for a donut slice', () => {
    const d = arcPath(100, 100, 80, 48, 0, Math.PI / 2);
    expect(d).toContain('A 80 80');
    expect(d).toContain('A 48 48');
    expect(d).not.toContain('M 100 100');
  });

  it('sets the large-arc flag only past a half turn', () => {
    expect(arcPath(100, 100, 80, 0, 0, Math.PI / 2)).toContain('0 0 1');
    expect(arcPath(100, 100, 80, 0, 0, Math.PI * 1.5)).toContain('0 1 1');
  });

  it('splits a full circle into two arcs, which would otherwise vanish', () => {
    const d = arcPath(100, 100, 80, 0, 0, Math.PI * 2);
    // A single arc whose start and end coincide renders nothing at all.
    expect((d.match(/A 80 80/g) ?? []).length).toBe(2);
  });

  it('returns nothing for an empty or inverted span', () => {
    expect(arcPath(100, 100, 80, 0, 1, 1)).toBe('');
    expect(arcPath(100, 100, 80, 0, 2, 1)).toBe('');
  });
});

describe('ChartPieComponent', () => {
  let fixture: ComponentFixture<ChartPieComponent>;
  let component: ChartPieComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ChartPieComponent] }).compileComponents();
    fixture = TestBed.createComponent(ChartPieComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', SLICES);
    fixture.componentRef.setInput('ariaLabel', 'Traffic by channel');
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('draws one path per slice', () => {
    expect(fixture.nativeElement.querySelectorAll('svg path').length).toBe(SLICES.length);
  });

  it('announces itself as an image with a title and description', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.querySelector('title').textContent.trim()).toBe('Traffic by channel');
  });

  it('points aria-describedby at a table that exists', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    const id = svg.getAttribute('aria-describedby');
    expect(id).toBe(component.tableId);
    expect(fixture.nativeElement.querySelector('#' + id)).toBeTruthy();
  });

  it('computes each slice percentage from the total', () => {
    const slices = component.slices;
    expect(slices[0].percent).toBeCloseTo(0.4, 6);
    expect(slices[3].percent).toBeCloseTo(0.1, 6);
    expect(slices.reduce((sum, s) => sum + s.percent, 0)).toBeCloseTo(1, 6);
  });

  it('assigns colour by slice label, in palette order', () => {
    const slices = component.slices;
    expect(slices[0].color).toBe('rgb(var(--chart-1))');
    expect(slices[1].color).toBe('rgb(var(--chart-2))');
  });

  it('keeps a slice colour when the data is re-sorted', () => {
    const before = component.slices.find((s) => s.label === 'Email')?.color;

    fixture.componentRef.setInput('data', [...SLICES].reverse());
    fixture.detectChanges();

    const after = component.slices.find((s) => s.label === 'Email')?.color;
    expect(after).toBe(before);
    // Email registered fourth, so it keeps step 4 despite now being first.
    expect(after).toBe('rgb(var(--chart-4))');
  });

  it('falls back to a neutral for a 6th slice rather than reusing chart-1', () => {
    fixture.componentRef.setInput('data', [
      ...SLICES,
      { label: 'Referral', value: 5 },
      { label: 'Other', value: 5 },
    ]);
    fixture.detectChanges();

    const slices = component.slices;
    expect(slices[4].color).toBe('rgb(var(--chart-5))');
    expect(slices[5].color).toBe(CHART_OVERFLOW_COLOR);
    expect(slices[5].color).not.toBe('rgb(var(--chart-1))');
  });

  it('leaves a real angular gap between slices instead of stroking them', () => {
    const slices = component.slices;
    for (const slice of slices) {
      expect(slice.d).not.toContain('stroke');
    }
    // Padding shrinks each wedge, so the drawn arcs cannot sum to a full turn.
    const paths = fixture.nativeElement.querySelectorAll('svg path');
    for (const path of paths) {
      expect(path.getAttribute('stroke')).toBeNull();
    }
  });

  it('draws a hole only when donut is set', () => {
    expect(component.slices[0].d).toContain('M 120 120');

    fixture.componentRef.setInput('donut', true);
    fixture.detectChanges();
    expect(component.slices[0].d).not.toContain('M 120 120');
  });

  it('ignores negative and non-numeric values, which have no share of a whole', () => {
    fixture.componentRef.setInput('data', [
      { label: 'Good', value: 10 },
      { label: 'Bad', value: -5 },
      { label: 'Ugly', value: 'nope' },
    ]);
    fixture.detectChanges();

    expect(component.slices.length).toBe(1);
    expect(component.slices[0].percent).toBeCloseTo(1, 6);
  });

  it('renders nothing rather than dividing by zero on an empty total', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    expect(component.slices).toEqual([]);
    expect(fixture.nativeElement.querySelectorAll('svg path').length).toBe(0);
  });

  it('renders a legend entry per slice when there are two or more', () => {
    const entries = fixture.nativeElement.querySelectorAll('ul li');
    expect(entries.length).toBe(SLICES.length);
    expect(entries[0].textContent).toContain('Direct');
  });

  it('renders no legend for a single slice', () => {
    fixture.componentRef.setInput('data', [{ label: 'Only', value: 1 }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('ul li').length).toBe(0);
  });

  it('shows a tooltip with the label, value and share on hover', () => {
    const path = fixture.nativeElement.querySelectorAll('svg path')[1];
    path.dispatchEvent(new PointerEvent('pointerenter'));
    fixture.detectChanges();

    const tooltip = fixture.nativeElement.querySelector('[role="status"]');
    expect(tooltip).toBeTruthy();
    expect(tooltip.textContent).toContain('Search');
    expect(tooltip.textContent).toContain('30');
    expect(tooltip.textContent).toContain('30.0%');
  });

  it('clears the tooltip when the pointer leaves', () => {
    fixture.nativeElement.querySelectorAll('svg path')[1].dispatchEvent(new PointerEvent('pointerenter'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('svg').dispatchEvent(new PointerEvent('pointerleave'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('emits the hovered slice index', () => {
    const seen: (number | null)[] = [];
    component.activeIndexChange.subscribe((i) => seen.push(i));

    fixture.nativeElement.querySelectorAll('svg path')[2].dispatchEvent(new PointerEvent('pointerenter'));
    fixture.detectChanges();

    expect(seen).toEqual([2]);
  });

  it('keeps the tooltip inside the frame for a slice on the right', () => {
    fixture.nativeElement.querySelectorAll('svg path')[0].dispatchEvent(new PointerEvent('pointerenter'));
    fixture.detectChanges();

    // The first slice starts at twelve and runs clockwise, so it sits right of centre.
    expect(component.tooltipLeft).toBeLessThan(component.size);
    expect(component.tooltipLeft).toBeGreaterThanOrEqual(0);
  });

  it('renders the accessible table fallback with every slice', () => {
    const table = fixture.debugElement.query(By.directive(ChartTableComponent)).nativeElement;
    const rows = table.querySelectorAll('tbody tr');

    expect(rows.length).toBe(SLICES.length);
    SLICES.forEach((slice, i) => {
      expect(rows[i].textContent).toContain(slice.label);
      expect(rows[i].textContent).toContain(String(slice.value));
    });
  });

  it('hides the table fallback visually by default', () => {
    const table = fixture.debugElement.query(By.directive(ChartTableComponent)).nativeElement;
    expect(table.querySelector('table').className).toContain('sr-only');
  });

  describe('change-detection stability', () => {
    // A hover handler lives on each slice path. If change detection recreates
    // those nodes, destroying the one under the cursor re-fires pointer events,
    // which calls markForCheck, which runs change detection again — the page
    // locks up. These tests pin the invariant that makes that impossible.

    it('does not recreate slice paths on a change-detection pass', () => {
      const before = Array.from(fixture.nativeElement.querySelectorAll('svg path'));

      fixture.detectChanges();
      fixture.detectChanges();

      const after = Array.from(fixture.nativeElement.querySelectorAll('svg path'));
      expect(after.length).toBe(before.length);
      after.forEach((node, i) => expect(node).toBe(before[i] as any));
    });

    it('returns a stable slices reference between reads', () => {
      // Three template bindings read `slices` per pass; rebuilding the array on
      // each read is what makes ngFor tear the DOM down.
      expect(component.slices).toBe(component.slices);
    });

    it('recomputes slices when the data actually changes', () => {
      const first = component.slices;

      fixture.componentRef.setInput('data', [
        { label: 'Only', value: 5 }
      ]);
      fixture.detectChanges();

      expect(component.slices).not.toBe(first);
      expect(component.slices.length).toBe(1);
      expect(component.slices[0].label).toBe('Only');
    });

    it('survives a hover without runaway change detection', () => {
      const path = fixture.nativeElement.querySelectorAll('svg path')[1];

      path.dispatchEvent(new PointerEvent('pointerenter'));
      fixture.detectChanges();
      // The node under the pointer must still be the same element afterwards.
      expect(fixture.nativeElement.querySelectorAll('svg path')[1]).toBe(path);
      expect(component.activeIndex).toBe(1);
    });
  });
});

describe('ChartPieComponent runaway-loop guard', () => {
  let fixture: ComponentFixture<ChartPieComponent>;
  let component: ChartPieComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ChartPieComponent] }).compileComponents();
    fixture = TestBed.createComponent(ChartPieComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', SLICES);
    fixture.detectChanges();
  });

  /**
   * End-to-end reproduction of the freeze, in a real browser with automatic
   * change detection on — the same conditions as the app.
   *
   * With the slice array rebuilt per read and no trackBy, hovering destroyed and
   * recreated the path under the pointer, which re-fired pointerenter, which
   * marked the component dirty, which recreated it again. This test never got
   * to its assertion; it hung until Karma killed it.
   */
  it('settles after a hover instead of looping forever', (done) => {
    fixture.autoDetectChanges(true);

    const path = fixture.nativeElement.querySelectorAll('svg path')[2];
    path.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));

    // Yield past several macrotasks; a runaway cycle would starve this callback.
    setTimeout(() => {
      expect(component.activeIndex).toBe(2);
      expect(fixture.nativeElement.querySelectorAll('svg path')[2]).toBe(path);
      done();
    }, 250);
  });

  it('settles after repeated enter/leave churn', (done) => {
    fixture.autoDetectChanges(true);
    const paths = fixture.nativeElement.querySelectorAll('svg path');

    for (let round = 0; round < 20; round++) {
      paths[round % paths.length].dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
      fixture.nativeElement.querySelector('svg').dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
    }

    setTimeout(() => {
      expect(component.activeIndex).toBeNull();
      // Same node objects as before the churn: nothing was torn down.
      const after = fixture.nativeElement.querySelectorAll('svg path');
      for (let i = 0; i < paths.length; i++) expect(after[i]).toBe(paths[i]);
      done();
    }, 250);
  });
});

@Component({
  standalone: true,
  imports: [ChartPieComponent],
  template: `<tolle-chart-pie [data]="data" labelKey="region" valueKey="users" />`,
})
class GetterBoundHostComponent {
  hidden = new Set<string>();
  private readonly all = [
    { region: 'North America', users: 5210 },
    { region: 'Europe', users: 4380 },
    { region: 'Asia Pacific', users: 3140 },
  ];

  /** Returns a NEW array on every read, as any `.filter()` in a template does. */
  get data() {
    return this.all.filter((row) => !this.hidden.has(row.region));
  }
}

describe('ChartPieComponent with a getter-bound data input', () => {
  /**
   * Binding `[data]` to a getter hands the component a fresh array reference on
   * every change-detection read. That made ngOnChanges fire every pass, which
   * called configure() -> recompute() -> scheduleEmit(), whose microtask told
   * subscribers to markForCheck, which scheduled another pass. The cycle never
   * closed and the page locked up.
   *
   * This is a normal thing for an app to write, so the component has to tolerate
   * it: a redundant configure must not announce a layout change.
   */
  it('settles instead of looping when data identity churns', (done) => {
    const fixture = TestBed.configureTestingModule({
      imports: [GetterBoundHostComponent],
    }).createComponent(GetterBoundHostComponent);

    fixture.autoDetectChanges(true);

    setTimeout(() => {
      const pie = fixture.debugElement.query(By.directive(ChartPieComponent));
      expect(pie.componentInstance.slices.length).toBe(3);
      done();
    }, 300);
  });

  it('still reacts when the filtered data actually changes', (done) => {
    const fixture = TestBed.configureTestingModule({
      imports: [GetterBoundHostComponent],
    }).createComponent(GetterBoundHostComponent);

    fixture.autoDetectChanges(true);
    fixture.componentInstance.hidden = new Set(['Europe']);

    setTimeout(() => {
      const pie = fixture.debugElement.query(By.directive(ChartPieComponent));
      expect(pie.componentInstance.slices.length).toBe(2);
      expect(pie.componentInstance.slices.map((s: any) => s.label)).not.toContain('Europe');
      done();
    }, 300);
  });
});
