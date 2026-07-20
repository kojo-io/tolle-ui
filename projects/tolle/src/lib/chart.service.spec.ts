import {
  ChartService,
  ChartColorScale,
  niceScale,
  niceStep,
  decimalsFor,
  monotoneTangents,
  buildPath,
  CHART_OVERFLOW_COLOR,
  type ChartSeries,
} from './chart.service';

/** Zero margins keep the arithmetic in the assertions readable. */
const NO_MARGIN = { top: 0, right: 0, bottom: 0, left: 0 };

function makeService(overrides: Partial<Parameters<ChartService['configure']>[0]> = {}): ChartService {
  const service = new ChartService();
  service.configure({
    data: [
      { month: 'Jan', a: 10, b: 5 },
      { month: 'Feb', a: 30, b: 15 },
      { month: 'Mar', a: 20, b: 25 },
      { month: 'Apr', a: 40, b: 10 },
    ],
    series: [
      { key: 'a', label: 'Series A' },
      { key: 'b', label: 'Series B' },
    ],
    xKey: 'month',
    width: 400,
    height: 200,
    margin: NO_MARGIN,
    ...overrides,
  });
  return service;
}

describe('niceStep', () => {
  it('snaps a raw step up to the next 1/2/5 x 10^n', () => {
    expect(niceStep(19.4)).toBe(20);
    expect(niceStep(0.74)).toBe(1);
    expect(niceStep(13)).toBe(20);
    expect(niceStep(3)).toBe(5);
    expect(niceStep(1)).toBe(1);
    expect(niceStep(0.03)).toBe(0.05);
  });

  it('falls back to 1 for a non-positive or non-finite step', () => {
    expect(niceStep(0)).toBe(1);
    expect(niceStep(-4)).toBe(1);
    expect(niceStep(NaN)).toBe(1);
  });
});

describe('decimalsFor', () => {
  it('shows no decimals for whole steps and enough for fractional ones', () => {
    expect(decimalsFor(20)).toBe(0);
    expect(decimalsFor(1)).toBe(0);
    expect(decimalsFor(0.2)).toBe(1);
    expect(decimalsFor(0.05)).toBe(2);
  });
});

describe('niceScale', () => {
  it('covers [0, 97] with round ticks rather than fifths of the range', () => {
    const [min, max, step, ticks] = niceScale([0, 97]);
    expect(min).toBe(0);
    expect(max).toBe(100);
    expect(step).toBe(20);
    expect(ticks).toEqual([0, 20, 40, 60, 80, 100]);
    // The naive range/N would have produced 19.4, 38.8, ... — unreadable.
    expect(ticks).not.toContain(19.4);
  });

  it('covers a small fractional domain [0, 3.7] with whole ticks', () => {
    const [min, max, , ticks] = niceScale([0, 3.7]);
    expect(min).toBe(0);
    expect(max).toBe(4);
    expect(ticks).toEqual([0, 1, 2, 3, 4]);
  });

  it('spans a domain crossing zero and puts a tick on zero', () => {
    const [min, max, , ticks] = niceScale([-20, 45]);
    expect(min).toBe(-20);
    expect(max).toBe(60);
    expect(ticks).toEqual([-20, 0, 20, 40, 60]);
    expect(ticks).toContain(0);
  });

  it('opens a degenerate [0, 0] domain to a usable one-unit range', () => {
    const [min, max, , ticks] = niceScale([0, 0]);
    expect(min).toBe(0);
    expect(max).toBe(1);
    expect(max).toBeGreaterThan(min);
    expect(ticks.length).toBeGreaterThan(1);
  });

  it('gives a single-point domain a real span anchored at zero', () => {
    const [min, max, , ticks] = niceScale([42]);
    expect(min).toBe(0);
    expect(max).toBe(50);
    expect(ticks).toEqual([0, 10, 20, 30, 40, 50]);
  });

  it('anchors a single negative point at zero from below', () => {
    const [min, max] = niceScale([-5]);
    expect(min).toBe(-5);
    expect(max).toBe(0);
  });

  it('handles an empty value list without collapsing the plot', () => {
    const [min, max, , ticks] = niceScale([]);
    expect(max).toBeGreaterThan(min);
    expect(ticks.length).toBeGreaterThan(1);
  });

  it('never emits a phantom tick past an already-round maximum', () => {
    const [, max, , ticks] = niceScale([0, 100]);
    expect(max).toBe(100);
    expect(ticks[ticks.length - 1]).toBe(100);
  });

  it('produces ticks that are exact multiples of the step', () => {
    for (const domain of [[0, 97], [0, 3.7], [-20, 45], [0, 12345], [0, 0.07]]) {
      const [, , step, ticks] = niceScale(domain);
      for (const tick of ticks) {
        expect(Math.abs(Math.round(tick / step) - tick / step)).toBeLessThan(1e-6);
      }
    }
  });
});

describe('ChartService y scale', () => {
  it('inverts y so the domain maximum lands on the top of the plot', () => {
    const service = makeService();
    const [min, max] = service.domain;

    expect(service.yFor(max)).toBeCloseTo(service.plotTop, 6);
    expect(service.yFor(min)).toBeCloseTo(service.plotBottom, 6);
    // Bigger value, smaller y — the whole point of the inversion.
    expect(service.yFor(max)).toBeLessThan(service.yFor(min));
  });

  it('maps the domain midpoint to the middle of the plot', () => {
    const service = makeService();
    const [min, max] = service.domain;
    const mid = (min + max) / 2;
    expect(service.yFor(mid)).toBeCloseTo(service.plotTop + service.plotHeight / 2, 6);
  });

  it('honours margins when resolving the plot box', () => {
    const service = makeService({ margin: { top: 10, right: 20, bottom: 30, left: 40 } });
    expect(service.plotLeft).toBe(40);
    expect(service.plotTop).toBe(10);
    expect(service.plotWidth).toBe(400 - 40 - 20);
    expect(service.plotHeight).toBe(200 - 10 - 30);
    expect(service.yFor(service.domain[1])).toBeCloseTo(10, 6);
  });

  it('includes zero in the domain once a baseline-anchored mark asks for it', () => {
    const service = makeService({
      data: [{ month: 'Jan', a: 80 }, { month: 'Feb', a: 100 }],
      series: [{ key: 'a', label: 'A' }],
    });
    service.requireZero();
    expect(service.domain[0]).toBe(0);
  });

  it('formats tick labels at the tick step precision', () => {
    const service = makeService({
      data: [{ month: 'Jan', a: 0 }, { month: 'Feb', a: 1 }],
      series: [{ key: 'a', label: 'A' }],
    });
    // Step is 0.2 here, so a whole tick still shows one decimal place.
    expect(service.ticks.map((t) => t.label)).toContain('0.4');
  });
});

describe('ChartService band scale', () => {
  it('tiles the plot exactly with one band per row', () => {
    const service = makeService();
    service.useBandScale();

    expect(service.bandStep * service.count).toBeCloseTo(service.plotWidth, 6);
    expect(service.bandStep).toBeCloseTo(100, 6);
  });

  it('splits the padding evenly either side of each band', () => {
    const service = makeService();
    service.useBandScale();

    expect(service.bandWidth).toBeCloseTo(80, 6);

    const first = service.bandFor(0);
    expect(first.start).toBeCloseTo(10, 6);
    expect(first.width).toBeCloseTo(80, 6);
    expect(first.centre).toBeCloseTo(50, 6);

    const last = service.bandFor(3);
    expect(last.centre).toBeCloseTo(350, 6);
    // Symmetric: the gap before the first band equals the gap after the last.
    expect(first.start - service.plotLeft).toBeCloseTo(service.plotRight - (last.start + last.width), 6);
  });

  it('centres bands inside their step and keeps them in ascending order', () => {
    const service = makeService();
    service.useBandScale();

    for (let i = 0; i < service.count; i++) {
      const band = service.bandFor(i);
      expect(band.centre).toBeCloseTo(band.start + band.width / 2, 6);
      expect(band.centre).toBeCloseTo(service.plotLeft + service.bandStep * (i + 0.5), 6);
    }
  });

  it('spreads point-scale positions across the full plot width', () => {
    const service = makeService();
    expect(service.mode).toBe('point');
    expect(service.pointX(0)).toBeCloseTo(service.plotLeft, 6);
    expect(service.pointX(3)).toBeCloseTo(service.plotRight, 6);
  });

  it('centres a single point rather than pinning it to the left edge', () => {
    const service = makeService({ data: [{ month: 'Jan', a: 5 }] });
    expect(service.pointX(0)).toBeCloseTo(service.plotLeft + service.plotWidth / 2, 6);
  });

  it('gives every row a contiguous hit band covering the whole plot', () => {
    const service = makeService();
    const bands = [0, 1, 2, 3].map((i) => service.hitBandFor(i));

    expect(bands[0].start).toBeCloseTo(service.plotLeft, 6);
    expect(bands[3].start + bands[3].width).toBeCloseTo(service.plotRight, 6);
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i].start).toBeCloseTo(bands[i - 1].start + bands[i - 1].width, 6);
    }
  });

  it('makes each hit band wider than the marks it has to catch', () => {
    const service = makeService();
    // An 8px dot is a pinpoint; the catchment has to be far bigger.
    for (let i = 0; i < service.count; i++) {
      expect(service.hitBandFor(i).width).toBeGreaterThan(24);
    }
  });

  it('switches xFor onto the band scale once bars register', () => {
    const service = makeService();
    const asPoint = service.xFor(0);
    service.useBandScale();
    expect(service.mode).toBe('band');
    expect(service.xFor(0)).not.toBeCloseTo(asPoint, 6);
    expect(service.xFor(0)).toBeCloseTo(service.bandFor(0).centre, 6);
  });
});

describe('ChartService horizontal orientation', () => {
  it('reproduces the exact vertical formulas when orientation is left at its default', () => {
    // The whole point of the transpose: an untouched chart must be byte-identical.
    const service = makeService();
    service.useBandScale();
    expect(service.orientation).toBe('vertical');
    expect(service.bandStep).toBeCloseTo(100, 6);
    expect(service.yFor(service.domain[1])).toBeCloseTo(service.plotTop, 6);
  });

  it('lays bands out along plotHeight instead of plotWidth', () => {
    const service = makeService({ orientation: 'horizontal' });
    service.useBandScale();

    expect(service.bandStep * service.count).toBeCloseTo(service.plotHeight, 6);
    const first = service.bandFor(0);
    expect(first.start).toBeGreaterThanOrEqual(service.plotTop - 1e-6);
  });

  it('maps yFor onto the x axis instead of the y axis', () => {
    const service = makeService({ orientation: 'horizontal' });
    const [min, max] = service.domain;

    expect(service.yFor(min)).toBeCloseTo(service.plotLeft, 6);
    expect(service.yFor(max)).toBeCloseTo(service.plotRight, 6);
    // Bigger value, bigger x — the opposite inversion from the vertical axis.
    expect(service.yFor(max)).toBeGreaterThan(service.yFor(min));
  });

  it('anchors hit bands to plotTop instead of plotLeft', () => {
    const service = makeService({ orientation: 'horizontal' });
    service.useBandScale();
    const band = service.hitBandFor(0);
    expect(band.start).toBeCloseTo(service.plotTop, 6);
  });
});

describe('ChartService colour assignment', () => {
  it('assigns palette steps in fixed series order', () => {
    const service = makeService({
      series: [
        { key: 'a', label: 'A' },
        { key: 'b', label: 'B' },
        { key: 'c', label: 'C' },
      ],
    });
    expect(service.colorFor('a')).toBe('rgb(var(--chart-1))');
    expect(service.colorFor('b')).toBe('rgb(var(--chart-2))');
    expect(service.colorFor('c')).toBe('rgb(var(--chart-3))');
  });

  it('keeps a series colour when an EARLIER series is filtered out', () => {
    const service = makeService({
      series: [
        { key: 'a', label: 'A' },
        { key: 'b', label: 'B' },
        { key: 'c', label: 'C' },
      ],
    });
    const before = { b: service.colorFor('b'), c: service.colorFor('c') };

    // Drop 'a'. Colour follows the entity, so the survivors must not repaint.
    service.configure({
      series: [
        { key: 'b', label: 'B' },
        { key: 'c', label: 'C' },
      ],
    });

    expect(service.colorFor('b')).toBe(before.b);
    expect(service.colorFor('c')).toBe(before.c);
    expect(service.colorFor('c')).toBe('rgb(var(--chart-3))');
  });

  it('gives a series its original colour back when it is filtered in again', () => {
    const service = makeService({
      series: [
        { key: 'a', label: 'A' },
        { key: 'b', label: 'B' },
      ],
    });
    const original = service.colorFor('a');

    service.configure({ series: [{ key: 'b', label: 'B' }] });
    service.configure({
      series: [
        { key: 'b', label: 'B' },
        { key: 'a', label: 'A' },
      ],
    });

    expect(service.colorFor('a')).toBe(original);
  });

  it('does not repaint survivors when the series array is reordered', () => {
    const service = makeService({
      series: [
        { key: 'a', label: 'A' },
        { key: 'b', label: 'B' },
      ],
    });
    const a = service.colorFor('a');
    const b = service.colorFor('b');

    service.configure({
      series: [
        { key: 'b', label: 'B' },
        { key: 'a', label: 'A' },
      ],
    });

    expect(service.colorFor('a')).toBe(a);
    expect(service.colorFor('b')).toBe(b);
  });

  it('falls back to a neutral for a 6th series instead of wrapping to chart-1', () => {
    const series: ChartSeries[] = ['a', 'b', 'c', 'd', 'e', 'f'].map((key) => ({
      key,
      label: key.toUpperCase(),
    }));
    const service = makeService({ series });

    expect(service.colorFor('e')).toBe('rgb(var(--chart-5))');
    expect(service.colorFor('f')).toBe(CHART_OVERFLOW_COLOR);
    expect(service.colorFor('f')).not.toBe('rgb(var(--chart-1))');
    expect(service.isOverflowSeries('f')).toBeTrue();
    expect(service.isOverflowSeries('e')).toBeFalse();
  });

  it('keeps every series past the cap on the same neutral', () => {
    const series: ChartSeries[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((key) => ({
      key,
      label: key,
    }));
    const service = makeService({ series });
    expect(service.colorFor('g')).toBe(service.colorFor('f'));
  });

  it('emits a paint value the browser can actually use', () => {
    const service = makeService();
    // The tokens are space-separated channels, so a bare var() is not a colour.
    expect(service.colorFor('a')).toMatch(/^rgb\(var\(--chart-\d\)\)$/);
  });
});

describe('ChartColorScale', () => {
  it('is stable by key independently of the chart service', () => {
    const scale = new ChartColorScale();
    scale.register(['x', 'y', 'z']);
    expect(scale.slotOf('z')).toBe(2);

    scale.register(['y', 'z']);
    expect(scale.slotOf('z')).toBe(2);
    expect(scale.colorFor('z')).toBe('rgb(var(--chart-3))');
  });

  it('registers unknown keys lazily on first paint request', () => {
    const scale = new ChartColorScale();
    expect(scale.colorFor('first')).toBe('rgb(var(--chart-1))');
    expect(scale.colorFor('second')).toBe('rgb(var(--chart-2))');
    expect(scale.colorFor('first')).toBe('rgb(var(--chart-1))');
  });
});

describe('ChartService values and stacking', () => {
  it('reads numeric values and reports missing ones as null', () => {
    const service = makeService({
      data: [{ month: 'Jan', a: 10 }, { month: 'Feb' }, { month: 'Mar', a: 'nope' }],
      series: [{ key: 'a', label: 'A' }],
    });
    expect(service.valueAt('a', 0)).toBe(10);
    expect(service.valueAt('a', 1)).toBeNull();
    expect(service.valueAt('a', 2)).toBeNull();
  });

  it('stacks each series on the sum of the ones below it', () => {
    const service = makeService({ stacked: true });
    expect(service.stackBase('a', 0)).toBe(0);
    expect(service.stackBase('b', 0)).toBe(10);
    expect(service.stackTotal(0)).toBe(15);
  });

  it('grows the stacked domain to the tallest total, not the tallest series', () => {
    const service = makeService({ stacked: true });
    // Tallest total is Apr: 40 + 10 = 50.
    expect(service.domain[1]).toBeGreaterThanOrEqual(50);
  });

  it('skips rows where a series has no value when building its points', () => {
    const service = makeService({
      data: [{ month: 'Jan', a: 10 }, { month: 'Feb' }, { month: 'Mar', a: 30 }],
      series: [{ key: 'a', label: 'A' }],
    });
    const points = service.pointsFor('a');
    expect(points.length).toBe(2);
    expect(points.map((p) => p.index)).toEqual([0, 2]);
  });

  it('exposes the x labels as strings', () => {
    expect(makeService().xLabels).toEqual(['Jan', 'Feb', 'Mar', 'Apr']);
  });
});

describe('ChartService hover state', () => {
  it('publishes the active index to subscribers', () => {
    const service = makeService();
    const seen: (number | null)[] = [];
    service.activeIndex$.subscribe((index) => seen.push(index));

    service.setActiveIndex(2);
    service.setActiveIndex(2);
    service.setActiveIndex(null);

    expect(seen).toEqual([null, 2, null]);
  });
});

describe('monotone curve', () => {
  /** Evaluates the cubic Bezier that buildPath emits for one segment. */
  function sampleSegment(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    m0: number,
    m1: number,
    t: number
  ): number {
    const dx = x1 - x0;
    const c1y = y0 + (m0 * dx) / 3;
    const c2y = y1 - (m1 * dx) / 3;
    const mt = 1 - t;
    return mt * mt * mt * y0 + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * y1;
  }

  it('never leaves the range of the two points a segment joins', () => {
    // A spike like this is exactly what makes a naive Catmull-Rom invent a
    // value above 90 and below 10 that was never measured.
    const xs = [0, 1, 2, 3, 4, 5];
    const ys = [10, 10, 90, 10, 10, 50];
    const m = monotoneTangents(xs, ys);

    for (let i = 0; i < xs.length - 1; i++) {
      const lo = Math.min(ys[i], ys[i + 1]);
      const hi = Math.max(ys[i], ys[i + 1]);
      for (let t = 0; t <= 1.0001; t += 0.02) {
        const y = sampleSegment(xs[i], ys[i], xs[i + 1], ys[i + 1], m[i], m[i + 1], Math.min(t, 1));
        expect(y).toBeGreaterThanOrEqual(lo - 1e-6);
        expect(y).toBeLessThanOrEqual(hi + 1e-6);
      }
    }
  });

  it('stays flat across a plateau instead of bulging through it', () => {
    const xs = [0, 1, 2, 3];
    const ys = [5, 5, 5, 40];
    const m = monotoneTangents(xs, ys);

    for (let t = 0; t <= 1; t += 0.05) {
      expect(sampleSegment(xs[0], ys[0], xs[1], ys[1], m[0], m[1], t)).toBeCloseTo(5, 6);
    }
  });

  it('keeps a monotone rise monotone', () => {
    const xs = [0, 1, 2, 3, 4];
    const ys = [1, 2, 8, 9, 30];
    const m = monotoneTangents(xs, ys);

    let previous = -Infinity;
    for (let i = 0; i < xs.length - 1; i++) {
      for (let t = 0; t <= 1; t += 0.05) {
        const y = sampleSegment(xs[i], ys[i], xs[i + 1], ys[i + 1], m[i], m[i + 1], t);
        expect(y).toBeGreaterThanOrEqual(previous - 1e-6);
        previous = y;
      }
    }
  });

  it('emits control points inside each segment range, so the hull cannot overshoot', () => {
    const service = makeService({
      data: [
        { month: 'Jan', a: 10 },
        { month: 'Feb', a: 10 },
        { month: 'Mar', a: 90 },
        { month: 'Apr', a: 10 },
      ],
      series: [{ key: 'a', label: 'A' }],
    });
    const points = service.pointsFor('a');
    const path = service.smoothPath('a');

    const segments = path.split(' C ').slice(1);
    expect(segments.length).toBe(points.length - 1);

    segments.forEach((segment, i) => {
      const nums = segment.trim().split(/\s+/).map(Number);
      const [, c1y, , c2y] = nums;
      const lo = Math.min(points[i].y, points[i + 1].y);
      const hi = Math.max(points[i].y, points[i + 1].y);
      expect(c1y).toBeGreaterThanOrEqual(lo - 1e-6);
      expect(c1y).toBeLessThanOrEqual(hi + 1e-6);
      expect(c2y).toBeGreaterThanOrEqual(lo - 1e-6);
      expect(c2y).toBeLessThanOrEqual(hi + 1e-6);
    });
  });
});

describe('buildPath', () => {
  it('returns nothing for an empty series', () => {
    expect(buildPath([], false)).toBe('');
    expect(buildPath([], true)).toBe('');
  });

  it('emits a bare move for a single point', () => {
    expect(buildPath([{ x: 5, y: 6 }], true)).toBe('M 5 6');
  });

  it('emits straight segments when not smoothing', () => {
    const d = buildPath([{ x: 0, y: 0 }, { x: 10, y: 20 }], false);
    expect(d).toBe('M 0 0 L 10 20');
    expect(d).not.toContain('C');
  });

  it('emits cubic segments when smoothing', () => {
    const d = buildPath([{ x: 0, y: 0 }, { x: 10, y: 20 }, { x: 20, y: 5 }], true);
    expect(d).toContain('C');
  });
});

describe('ChartService paths', () => {
  it('closes an area back along its baseline', () => {
    const service = makeService({ series: [{ key: 'a', label: 'A' }] });
    service.requireZero();
    const d = service.areaPath('a', false);
    expect(d.startsWith('M ')).toBeTrue();
    expect(d.trim().endsWith('Z')).toBeTrue();
  });

  it('returns an empty area path when the series has no values', () => {
    const service = makeService({ series: [{ key: 'missing', label: 'Missing' }] });
    expect(service.areaPath('missing', false)).toBe('');
  });
});
