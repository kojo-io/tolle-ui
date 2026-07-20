import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerComponent, type TrackerBlock } from './tracker.component';

describe('TrackerComponent', () => {
  let component: TrackerComponent;
  let fixture: ComponentFixture<TrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackerComponent);
    component = fixture.componentInstance;
  });

  function blocks(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button'));
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders one real, focusable button per block', () => {
    const data: TrackerBlock[] = [{ status: 'success' }, { status: 'error' }, { status: 'neutral' }];
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();

    const els = blocks();
    expect(els.length).toBe(3);
    els.forEach((el) => expect(el.tagName).toBe('BUTTON'));
  });

  it('colours a block from its status token', () => {
    fixture.componentRef.setInput('data', [{ status: 'success' }, { status: 'warning' }, { status: 'error' }] as TrackerBlock[]);
    fixture.detectChanges();

    const [ok, warn, err] = blocks();
    expect(ok.style.background).toContain('--success');
    expect(warn.style.background).toContain('--warning');
    expect(err.style.background).toContain('--destructive');
  });

  it('defaults an unset status to neutral', () => {
    fixture.componentRef.setInput('data', [{}] as TrackerBlock[]);
    fixture.detectChanges();
    expect(blocks()[0].style.background).toContain('--muted');
  });

  it('lets a per-block colour override the status token', () => {
    fixture.componentRef.setInput('data', [{ status: 'success', color: 'rgb(1, 2, 3)' }] as TrackerBlock[]);
    fixture.detectChanges();
    expect(blocks()[0].style.background).toBe('rgb(1, 2, 3)');
  });

  it('gives every block a screen-reader name even without a tooltip', () => {
    fixture.componentRef.setInput('data', [{ status: 'success' }, { status: 'error', tooltip: 'Down 14:00-14:20' }] as TrackerBlock[]);
    fixture.detectChanges();

    const els = blocks();
    expect(els[0].getAttribute('aria-label')).toBe('Period 1');
    expect(els[1].getAttribute('aria-label')).toBe('Down 14:00-14:20');
  });

  it('sizes every block equally regardless of how many there are', () => {
    fixture.componentRef.setInput('data', Array.from({ length: 30 }, (): TrackerBlock => ({ status: 'success' })));
    fixture.detectChanges();
    for (const el of blocks()) {
      expect(el.className).toContain('flex-1');
    }
  });

  it('applies the block height input', () => {
    fixture.componentRef.setInput('data', [{ status: 'success' }] as TrackerBlock[]);
    fixture.componentRef.setInput('blockHeight', 20);
    fixture.detectChanges();
    expect(blocks()[0].style.height).toBe('20px');
  });

  it('exposes the strip as a labelled group rather than an opaque image', () => {
    fixture.componentRef.setInput('data', [{ status: 'success' }] as TrackerBlock[]);
    fixture.componentRef.setInput('ariaLabel', 'Uptime, last 30 days');
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('[role="group"]');
    expect(group.getAttribute('aria-label')).toBe('Uptime, last 30 days');
    // A role="img" container would strip its descendants from the a11y tree,
    // hiding every button's own name — this must not be that role.
    expect(group.getAttribute('role')).not.toBe('img');
  });
});
