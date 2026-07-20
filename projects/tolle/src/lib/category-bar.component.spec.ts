import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBarComponent } from './category-bar.component';

describe('CategoryBarComponent', () => {
  let component: CategoryBarComponent;
  let fixture: ComponentFixture<CategoryBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryBarComponent);
    component = fixture.componentInstance;
  });

  function segments(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.relative > div'));
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('sizes each segment proportionally to its share of the total', () => {
    fixture.componentRef.setInput('values', [25, 50, 25]);
    fixture.detectChanges();

    const widths = segments().map((el) => el.style.width);
    expect(widths).toEqual(['25%', '50%', '25%']);
  });

  it('normalizes segments that do not sum to 100', () => {
    fixture.componentRef.setInput('values', [1, 1, 2]);
    fixture.detectChanges();

    const widths = segments().map((el) => parseFloat(el.style.width));
    expect(widths[0]).toBeCloseTo(25, 6);
    expect(widths[1]).toBeCloseTo(25, 6);
    expect(widths[2]).toBeCloseTo(50, 6);
  });

  it('drops non-finite and non-positive values rather than rendering a broken segment', () => {
    fixture.componentRef.setInput('values', [10, 0, -5, NaN, 30]);
    fixture.detectChanges();
    expect(segments().length).toBe(2);
  });

  it('renders no segments and no error for an all-zero or empty input', () => {
    fixture.componentRef.setInput('values', []);
    fixture.detectChanges();
    expect(segments().length).toBe(0);
  });

  it('colours segments from the chart palette by position, in order', () => {
    fixture.componentRef.setInput('values', [1, 1, 1]);
    fixture.detectChanges();

    const backgrounds = segments().map((el) => el.style.background);
    expect(backgrounds[0]).toContain('--chart-1');
    expect(backgrounds[1]).toContain('--chart-2');
    expect(backgrounds[2]).toContain('--chart-3');
  });

  it('lets an explicit colors array override the palette', () => {
    fixture.componentRef.setInput('values', [1, 1]);
    fixture.componentRef.setInput('colors', ['rgb(255, 0, 0)', 'rgb(0, 255, 0)']);
    fixture.detectChanges();

    const backgrounds = segments().map((el) => el.style.background);
    expect(backgrounds[0]).toBe('rgb(255, 0, 0)');
    expect(backgrounds[1]).toBe('rgb(0, 255, 0)');
  });

  it('renders no marker when markerValue is not set', () => {
    fixture.componentRef.setInput('values', [50, 50]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.relative > span')).toBeNull();
  });

  it('positions the marker at the given percent', () => {
    fixture.componentRef.setInput('values', [50, 50]);
    fixture.componentRef.setInput('markerValue', 72);
    fixture.detectChanges();

    const marker = fixture.nativeElement.querySelector('.relative > span');
    expect(marker.style.left).toBe('72%');
  });

  it('clamps an out-of-range marker rather than letting it overflow the bar', () => {
    fixture.componentRef.setInput('values', [50, 50]);
    fixture.componentRef.setInput('markerValue', 140);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.relative > span').style.left).toBe('100%');

    fixture.componentRef.setInput('markerValue', -10);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.relative > span').style.left).toBe('0%');
  });

  it('summarizes labels, shares and the marker position for screen readers', () => {
    fixture.componentRef.setInput('values', [30, 70]);
    fixture.componentRef.setInput('labels', ['Poor', 'Good']);
    fixture.componentRef.setInput('markerValue', 45);
    fixture.componentRef.setInput('ariaLabel', 'Credit score');
    fixture.detectChanges();

    const summary = fixture.nativeElement.querySelector('p.sr-only').textContent;
    expect(summary).toContain('Credit score');
    expect(summary).toContain('Poor: 30%');
    expect(summary).toContain('Good: 70%');
    expect(summary).toContain('45%');
  });
});
