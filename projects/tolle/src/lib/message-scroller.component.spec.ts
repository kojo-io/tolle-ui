import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MessageScrollerComponent,
  MessageScrollerViewportComponent,
  MessageScrollerContentComponent,
  MessageScrollerButtonComponent,
  MessageScrollerItemDirective,
} from './message-scroller.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MessageScrollerComponent,
    MessageScrollerViewportComponent,
    MessageScrollerContentComponent,
    MessageScrollerButtonComponent,
    MessageScrollerItemDirective,
  ],
  template: `
    <div style="height: 100px; width: 200px;">
      <tolle-message-scroller startPosition="top" (atBottomChange)="atBottomEvents.push($event)">
        <tolle-message-scroller-viewport>
          <tolle-message-scroller-content>
            <div *ngFor="let m of messages" tolleMessageScrollerItem style="height: 40px">{{ m }}</div>
          </tolle-message-scroller-content>
        </tolle-message-scroller-viewport>
        <tolle-message-scroller-button>Jump to latest</tolle-message-scroller-button>
      </tolle-message-scroller>
    </div>
  `,
})
class HostComponent {
  messages = Array.from({ length: 20 }, (_, i) => `message ${i}`);
  atBottomEvents: boolean[] = [];
}

describe('MessageScrollerComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const scrollerHost = (): HTMLElement => fixture.nativeElement.querySelector('tolle-message-scroller');
  const viewportHost = (): HTMLElement => fixture.nativeElement.querySelector('tolle-message-scroller-viewport');
  const viewportInner = (): HTMLElement => viewportHost().querySelector('div')!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.removeChild(fixture.nativeElement);
  });

  it('creates the scroller, viewport, content and button', () => {
    expect(scrollerHost()).toBeTruthy();
    expect(viewportHost()).toBeTruthy();
    expect(fixture.nativeElement.querySelector('tolle-message-scroller-content')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('tolle-message-scroller-button')).toBeTruthy();
  });

  /**
   * Regression guard: the scroller and viewport hosts used to be
   * `display: block` with no height rule, so each grew to fit its (much
   * taller) projected content instead of respecting the parent-provided
   * height — the scroller never actually scrolled, it just kept growing.
   * Tailwind classes aren't compiled in this test bundle, so this exercises
   * the components' own `:host {}` CSS, which is real CSS and does apply here.
   * A block box with an explicit height sizes itself to that height
   * regardless of its children, so this fails on the old `display: block`
   * host (which measures ~800px, the height of all 20 rows) and passes once
   * the host declares `height: 100%` against the bounded parent.
   */
  it('bounds the scroller host to the parent-provided height instead of growing to fit content', () => {
    expect(scrollerHost().getBoundingClientRect().height).toBe(100);
  });

  it('lets the viewport scroll once content exceeds the bounded height', () => {
    // The template's own divs rely on Tailwind (flex/min-h-0/overflow-y-auto)
    // to size correctly, and Tailwind isn't compiled in this test bundle —
    // simulate it inline, as conversation.component.spec.ts does for the
    // same reason, so the full chain can be exercised end to end.
    const scrollerInner = scrollerHost().querySelector(':scope > div') as HTMLElement;
    scrollerInner.style.display = 'flex';
    scrollerInner.style.flexDirection = 'column';
    scrollerInner.style.minHeight = '0';

    const vpInner = viewportInner();
    vpInner.style.flex = '1 1 auto';
    vpInner.style.minHeight = '0';
    vpInner.style.overflowY = 'auto';
    void vpInner.offsetHeight;

    expect(vpInner.scrollHeight).toBeGreaterThan(vpInner.clientHeight);
  });
});
