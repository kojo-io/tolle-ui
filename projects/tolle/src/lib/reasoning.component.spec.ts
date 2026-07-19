import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  ReasoningComponent,
  ReasoningContentComponent,
  ReasoningTriggerComponent,
} from './reasoning.component';

@Component({
  standalone: true,
  imports: [ReasoningComponent, ReasoningTriggerComponent, ReasoningContentComponent],
  template: `
    <tolle-reasoning
      [open]="open"
      [streaming]="streaming"
      [duration]="duration"
      (openChange)="openEvents.push($event)"
    >
      <tolle-reasoning-trigger></tolle-reasoning-trigger>
      <tolle-reasoning-content text="First I considered the options."></tolle-reasoning-content>
    </tolle-reasoning>
  `,
})
class HostComponent {
  open = false;
  streaming = false;
  duration = 0;
  openEvents: boolean[] = [];
}

describe('ReasoningComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const trigger = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('[data-reasoning-trigger]');

  const content = (): HTMLElement | null =>
    fixture.nativeElement.querySelector('[data-reasoning-content]');

  const label = (): string =>
    fixture.nativeElement.querySelector('[data-reasoning-label]').textContent!.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('starts collapsed', () => {
    expect(content()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('does not emit openChange just by being mounted', () => {
    expect(fixture.componentInstance.openEvents).toEqual([]);
  });

  it('expands and collapses when the trigger is pressed', () => {
    trigger().click();
    fixture.detectChanges();

    expect(content()).toBeTruthy();
    expect(content()!.textContent).toContain('First I considered the options.');
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(fixture.componentInstance.openEvents).toEqual([true]);

    trigger().click();
    fixture.detectChanges();

    expect(content()).toBeNull();
    expect(fixture.componentInstance.openEvents).toEqual([true, false]);
  });

  it('opens from the open input', () => {
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    expect(content()).toBeTruthy();
  });

  it('shows a live thinking label while streaming', () => {
    fixture.componentInstance.streaming = true;
    fixture.componentInstance.duration = 0;
    fixture.detectChanges();

    expect(label()).toBe('Thinking…');
  });

  it('reports how long it thought once streaming finishes', () => {
    fixture.componentInstance.streaming = true;
    fixture.detectChanges();
    expect(label()).toBe('Thinking…');

    fixture.componentInstance.streaming = false;
    fixture.componentInstance.duration = 12;
    fixture.detectChanges();

    expect(label()).toBe('Thought for 12 seconds');
  });

  it('uses the singular form for a one second trace', () => {
    fixture.componentInstance.duration = 1;
    fixture.detectChanges();

    expect(label()).toBe('Thought for 1 second');
  });

  it('falls back to a vague label when no duration was measured', () => {
    expect(label()).toBe('Thought for a few seconds');
  });
});
