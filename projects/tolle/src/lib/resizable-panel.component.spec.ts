import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizablePanelComponent } from './resizable-panel.component';

describe('ResizablePanelComponent', () => {
  let component: ResizablePanelComponent;
  let fixture: ComponentFixture<ResizablePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizablePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizablePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Regression guard: the flex row/col wrapper that panel items are
   * projected into had no height/width classes of its own, so — even
   * though the host and its container div correctly filled a
   * parent-provided height — that wrapper defaulted to `height: auto` and
   * collapsed to its content's natural height, and every panel item
   * (stretched to the wrapper's cross-size per flexbox default) collapsed
   * with it. Panels rendered as thin, content-height strips instead of
   * filling the demo container.
   */
  it('gives the flex wrapper h-full/w-full so panel items have something to stretch against', () => {
    const wrapper = fixture.nativeElement.querySelector('div.flex') as HTMLElement;
    expect(wrapper.classList.contains('h-full')).toBe(true);
    expect(wrapper.classList.contains('w-full')).toBe(true);
  });
});

@Component({
  standalone: true,
  imports: [ResizablePanelComponent],
  template: `
    <div style="height: 300px; width: 400px;">
      <tolle-resizable-panel class="h-full"></tolle-resizable-panel>
    </div>
  `,
})
class HostComponent {}

describe('ResizablePanelComponent host sizing', () => {
  /**
   * Regression guard for the other half of the same bug: `:host` has no
   * height rule of its own, so a consumer must explicitly pass `class="h-full"`
   * (as every docs example does) for the parent-provided height to reach the
   * component at all. This is real CSS (not a Tailwind utility), so — unlike
   * the wrapper's h-full/w-full above — it's genuinely testable via layout in
   * this Karma bundle, which doesn't compile Tailwind.
   */
  it('fills a bounded parent when given class="h-full"', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('tolle-resizable-panel') as HTMLElement;
    expect(host.getBoundingClientRect().height).toBe(300);
  });
});
