import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressCircleComponent } from './progress-circle.component';

describe('ProgressCircleComponent', () => {
  let component: ProgressCircleComponent;
  let fixture: ComponentFixture<ProgressCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressCircleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const root = (): HTMLElement => fixture.nativeElement.querySelector('[role="progressbar"]');
  const circles = (): SVGCircleElement[] => Array.from(fixture.nativeElement.querySelectorAll('circle'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes progressbar semantics with a 0-100 range', () => {
    fixture.componentRef.setInput('value', 42);
    fixture.detectChanges();

    const el = root();
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    expect(el.getAttribute('aria-valuenow')).toBe('42');
  });

  it('clamps a value outside 0-100', () => {
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();
    expect(root().getAttribute('aria-valuenow')).toBe('100');

    fixture.componentRef.setInput('value', -20);
    fixture.detectChanges();
    expect(root().getAttribute('aria-valuenow')).toBe('0');
  });

  it('treats a null value as zero rather than throwing', () => {
    fixture.componentRef.setInput('value', null);
    fixture.detectChanges();
    expect(root().getAttribute('aria-valuenow')).toBe('0');
  });

  it('draws a track circle and a progress circle at the same radius', () => {
    const [track, ring] = circles();
    expect(circles().length).toBe(2);
    expect(track.getAttribute('r')).toBe(ring.getAttribute('r'));
    expect(track.getAttribute('fill')).toBe('none');
    expect(ring.getAttribute('fill')).toBe('none');
  });

  it('offsets the dash array so the ring visually reads as the given percent', () => {
    fixture.componentRef.setInput('value', 0);
    fixture.detectChanges();
    const [, emptyRing] = circles();
    const circumference = Number(emptyRing.getAttribute('stroke-dasharray'));
    expect(Number(emptyRing.getAttribute('stroke-dashoffset'))).toBeCloseTo(circumference, 6);

    fixture.componentRef.setInput('value', 100);
    fixture.detectChanges();
    const [, fullRing] = circles();
    expect(Number(fullRing.getAttribute('stroke-dashoffset'))).toBeCloseTo(0, 6);
  });

  it('starts the ring at 12 o’clock by rotating it -90deg about its own centre', () => {
    fixture.componentRef.setInput('size', 100);
    fixture.detectChanges();
    const [, ring] = circles();
    expect(ring.getAttribute('transform')).toBe('rotate(-90 50 50)');
  });

  it('leaves room for the stroke so the ring does not clip the frame', () => {
    fixture.componentRef.setInput('size', 100);
    fixture.componentRef.setInput('strokeWidth', 10);
    fixture.detectChanges();
    const [track] = circles();
    expect(Number(track.getAttribute('r'))).toBeCloseTo(45, 6);
  });

  it('resizes the svg viewBox with the size input', () => {
    fixture.componentRef.setInput('size', 64);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 64 64');
    expect(svg.getAttribute('width')).toBe('64');
  });
});
