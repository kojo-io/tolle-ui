import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import {
  ConversationComponent,
  ConversationContentComponent,
  ConversationEmptyStateComponent,
  ConversationScrollButtonComponent,
} from './conversation.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ConversationComponent,
    ConversationContentComponent,
    ConversationEmptyStateComponent,
    ConversationScrollButtonComponent,
  ],
  template: `
    <tolle-conversation [empty]="empty" (atBottomChange)="atBottomEvents.push($event)">
      <tolle-conversation-empty-state title="Nothing here"></tolle-conversation-empty-state>
      <tolle-conversation-content>
        <div *ngFor="let message of messages" style="height: 100px">{{ message }}</div>
      </tolle-conversation-content>
      <tolle-conversation-scroll-button (jumped)="jumps = jumps + 1"></tolle-conversation-scroll-button>
    </tolle-conversation>
  `,
})
class HostComponent {
  empty = false;
  messages = ['one', 'two', 'three', 'four', 'five'];
  atBottomEvents: boolean[] = [];
  jumps = 0;
}

describe('ConversationComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const viewport = (): HTMLElement =>
    fixture.nativeElement.querySelector('[data-conversation-viewport]');

  const scrollButton = (): HTMLElement | null =>
    fixture.nativeElement.querySelector('[data-conversation-scroll-button]');

  const emptyState = (): HTMLElement | null =>
    fixture.nativeElement.querySelector('[data-conversation-empty]');

  /**
   * Tailwind classes are not compiled into the spec bundle, so the viewport is
   * given a real height inline to make it genuinely overflow.
   */
  const makeScrollable = () => {
    const el = viewport();
    el.style.height = '100px';
    el.style.overflowY = 'auto';
    void el.offsetHeight;
  };

  const scrollTo = (top: number) => {
    const el = viewport();
    el.scrollTop = top;
    el.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('marks the scroll region as a polite log', () => {
    expect(viewport().getAttribute('role')).toBe('log');
    expect(viewport().getAttribute('aria-live')).toBe('polite');
  });

  it('renders the empty state only while the transcript is empty', () => {
    expect(emptyState()).toBeNull();

    fixture.componentInstance.empty = true;
    fixture.detectChanges();

    expect(emptyState()).toBeTruthy();
    expect(emptyState()!.textContent).toContain('Nothing here');

    fixture.componentInstance.empty = false;
    fixture.detectChanges();

    expect(emptyState()).toBeNull();
  });

  it('hides the scroll button while pinned to the newest message', () => {
    expect(scrollButton()).toBeNull();
  });

  it('shows the scroll button once scrolled away from the bottom, and hides it again', () => {
    makeScrollable();

    scrollTo(0);
    expect(scrollButton()).toBeTruthy();

    const el = viewport();
    scrollTo(el.scrollHeight - el.clientHeight);
    expect(scrollButton()).toBeNull();
  });

  it('emits atBottomChange as the reader leaves and returns to the bottom', () => {
    makeScrollable();
    fixture.componentInstance.atBottomEvents = [];

    scrollTo(0);
    const el = viewport();
    scrollTo(el.scrollHeight - el.clientHeight);

    expect(fixture.componentInstance.atBottomEvents).toEqual([false, true]);
  });

  it('scrolls back to the newest message on scrollToBottom()', () => {
    makeScrollable();
    scrollTo(0);
    expect(scrollButton()).toBeTruthy();

    const conversation = fixture.debugElement.query(By.directive(ConversationComponent))
      .componentInstance as ConversationComponent;
    conversation.scrollToBottom('auto');
    fixture.detectChanges();

    const el = viewport();
    expect(el.scrollTop).toBe(el.scrollHeight - el.clientHeight);
    expect(scrollButton()).toBeNull();
  });

  it('emits jumped when the scroll button is pressed', () => {
    makeScrollable();
    scrollTo(0);

    scrollButton()!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.jumps).toBe(1);
  });
});
