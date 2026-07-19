import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ContextComponent,
  ContextContentComponent,
  ContextService,
  formatTokens,
  type ContextUsage,
} from './context.component';

describe('formatTokens', () => {
  it('leaves small counts alone', () => {
    expect(formatTokens(0)).toBe('0');
    expect(formatTokens(842)).toBe('842');
  });

  it('abbreviates thousands and millions', () => {
    expect(formatTokens(1000)).toBe('1K');
    expect(formatTokens(12_300)).toBe('12.3K');
    expect(formatTokens(1_000_000)).toBe('1M');
    expect(formatTokens(2_450_000)).toBe('2.5M');
  });
});

describe('ContextComponent', () => {
  let component: ContextComponent;
  let fixture: ComponentFixture<ContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ContextComponent] }).compileComponents();

    fixture = TestBed.createComponent(ContextComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('used', 32_000);
    fixture.componentRef.setInput('total', 128_000);
    fixture.detectChanges();
  });

  const meter = (): HTMLElement => fixture.nativeElement.querySelector('[role="meter"]');
  // Children of the meter, in order: the bar track, the bar fill, the label.
  const bar = (): HTMLElement => meter().querySelectorAll('span')[1] as HTMLElement;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the usage as a whole percentage', () => {
    expect(meter().textContent).toContain('25%');
    expect(meter().getAttribute('aria-valuenow')).toBe('25');
  });

  it('sizes the bar to the usage', () => {
    expect(bar().style.width).toBe('25%');
  });

  it('uses the normal colours below the warning threshold', () => {
    expect(meter().getAttribute('data-level')).toBe('normal');
    expect(meter().className).toContain('text-muted-foreground');
    expect(bar().className).toContain('bg-primary');
  });

  it('shifts to the warning tokens at 75% usage', () => {
    fixture.componentRef.setInput('used', 100_000);
    fixture.detectChanges();

    expect(component.level).toBe('warning');
    expect(meter().getAttribute('data-level')).toBe('warning');
    expect(meter().className).toContain('text-warning');
    expect(bar().className).toContain('bg-warning');
  });

  it('shifts to the destructive tokens at 90% usage', () => {
    fixture.componentRef.setInput('used', 120_000);
    fixture.detectChanges();

    expect(component.level).toBe('critical');
    expect(meter().getAttribute('data-level')).toBe('critical');
    expect(meter().className).toContain('text-destructive');
    expect(bar().className).toContain('bg-destructive');
  });

  it('honours custom thresholds', () => {
    fixture.componentRef.setInput('warningThreshold', 0.2);
    fixture.componentRef.setInput('criticalThreshold', 0.24);
    fixture.detectChanges();

    expect(component.level).toBe('critical');
  });

  it('clamps the ratio when the usage overruns the window', () => {
    fixture.componentRef.setInput('used', 200_000);
    fixture.detectChanges();

    expect(component.ratio).toBe(1);
    expect(meter().textContent).toContain('100%');
  });

  it('reports zero usage when the total is unknown', () => {
    fixture.componentRef.setInput('total', 0);
    fixture.detectChanges();

    expect(component.ratio).toBe(0);
    expect(component.level).toBe('normal');
    expect(meter().textContent).toContain('0%');
  });

  it('opens the breakdown through the existing hover card', () => {
    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('tolle-hover-card')).toBeTruthy();
    expect(host.querySelector('tolle-hover-card-trigger tolle-context-trigger')).toBeTruthy();
  });
});

describe('ContextContentComponent', () => {
  let fixture: ComponentFixture<ContextContentComponent>;
  let service: ContextService;

  const usage = (overrides: Partial<ContextUsage> = {}): ContextUsage => ({
    used: 82_000,
    total: 128_000,
    inputTokens: 61_000,
    outputTokens: 21_000,
    cost: 0.42,
    ratio: 82_000 / 128_000,
    level: 'normal',
    ...overrides,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextContentComponent],
      providers: [ContextService],
    }).compileComponents();

    service = TestBed.inject(ContextService);
    fixture = TestBed.createComponent(ContextContentComponent);
    fixture.detectChanges();
  });

  it('shows the used and total tokens once the parent publishes them', () => {
    service.setUsage(usage());
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('82K / 128K');
  });

  it('lists the input and output breakdown', () => {
    service.setUsage(usage());
    fixture.detectChanges();

    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Input');
    expect(text).toContain('61K');
    expect(text).toContain('Output');
    expect(text).toContain('21K');
  });

  it('shows the cost with the configured currency symbol', () => {
    service.setUsage(usage());
    fixture.componentRef.setInput('currency', '€');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('€0.42');
  });

  it('omits rows that were not supplied', () => {
    service.setUsage(usage({ inputTokens: null, outputTokens: null, cost: null }));
    fixture.detectChanges();

    const text: string = fixture.nativeElement.textContent;
    expect(text).not.toContain('Input');
    expect(text).not.toContain('Output');
    expect(text).not.toContain('Cost');
  });
});
