import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  BubbleComponent,
  BubbleActionsComponent,
  BubbleReactionsComponent,
  type BubbleReaction
} from './bubble.component';

@Component({
  standalone: true,
  imports: [BubbleComponent, BubbleActionsComponent],
  template: `
    <tolle-bubble [interactive]="true" (bubbleClick)="bubbleClicks = bubbleClicks + 1">
      Hello there
      <tolle-bubble-actions>
        <button type="button" id="copy" (click)="actionClicks = actionClicks + 1">Copy</button>
      </tolle-bubble-actions>
    </tolle-bubble>
  `
})
class BubbleHostComponent {
  bubbleClicks = 0;
  actionClicks = 0;
}

describe('BubbleComponent', () => {
  let component: BubbleComponent;
  let fixture: ComponentFixture<BubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BubbleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const surface = (): HTMLElement => fixture.nativeElement.querySelector('div');
  const toggle = (): HTMLButtonElement | null => fixture.nativeElement.querySelector('button');

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('squares the bottom-left corner when aligned to the start', () => {
    expect(surface().className).toContain('rounded-bl-sm');
    expect(surface().className).not.toContain('rounded-br-sm');
  });

  it('squares the bottom-right corner when aligned to the end', () => {
    fixture.componentRef.setInput('align', 'end');
    fixture.detectChanges();

    expect(surface().className).toContain('rounded-br-sm');
    expect(surface().className).not.toContain('rounded-bl-sm');
  });

  it('applies the primary variant surface colours', () => {
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();

    expect(surface().className).toContain('bg-primary');
    expect(surface().className).toContain('text-primary-foreground');
  });

  it('applies the outline variant surface colours', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();

    expect(surface().className).toContain('bg-transparent');
    expect(surface().className).toContain('border-border');
  });

  it('changes padding for the lg size variant', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(surface().className).toContain('px-4');
    expect(surface().className).toContain('text-base');
  });

  it('renders no toggle unless it is collapsible', () => {
    expect(toggle()).toBeNull();
  });

  it('clamps the content and offers a show-more toggle when collapsible', () => {
    fixture.componentRef.setInput('collapsible', true);
    fixture.detectChanges();

    const content: HTMLElement = surface().querySelector('div')!;
    expect(content.className).toContain('overflow-hidden');
    expect(content.style.maxHeight).toBe('6rem');
    expect(toggle()!.textContent!.trim()).toContain('Show more');
    expect(toggle()!.getAttribute('aria-expanded')).toBe('false');
  });

  it('expands when the toggle is pressed and emits the new state', () => {
    const emitted: boolean[] = [];
    fixture.componentRef.setInput('collapsible', true);
    component.collapsedChange.subscribe(v => emitted.push(v));
    fixture.detectChanges();

    toggle()!.click();
    fixture.detectChanges();

    expect(emitted).toEqual([false]);
    expect(component.collapsed).toBe(false);
    expect(component.isClamped).toBe(false);
    expect(toggle()!.textContent!.trim()).toContain('Show less');
    expect(toggle()!.getAttribute('aria-expanded')).toBe('true');

    const content: HTMLElement = surface().querySelector('div')!;
    expect(content.className).not.toContain('overflow-hidden');
    expect(content.style.maxHeight).toBe('');
  });

  it('honours a custom collapsed height', () => {
    fixture.componentRef.setInput('collapsible', true);
    fixture.componentRef.setInput('collapsedHeight', '3rem');
    fixture.detectChanges();

    const content: HTMLElement = surface().querySelector('div')!;
    expect(content.style.maxHeight).toBe('3rem');
  });

  it('stays inert on click unless it is interactive', () => {
    const emitted: Event[] = [];
    component.bubbleClick.subscribe(e => emitted.push(e));

    surface().click();

    expect(emitted.length).toBe(0);
    expect(surface().getAttribute('role')).toBeNull();
  });

  it('becomes a focusable trigger when interactive', () => {
    const emitted: Event[] = [];
    component.bubbleClick.subscribe(e => emitted.push(e));
    fixture.componentRef.setInput('interactive', true);
    fixture.detectChanges();

    expect(surface().getAttribute('role')).toBe('button');
    expect(surface().getAttribute('tabindex')).toBe('0');

    surface().click();
    expect(emitted.length).toBe(1);
  });

  it('merges extra classes passed through the class input', () => {
    fixture.componentRef.setInput('class', 'my-custom-bubble');
    fixture.detectChanges();

    expect(surface().className).toContain('my-custom-bubble');
  });
});

describe('BubbleActionsComponent', () => {
  let hostFixture: ComponentFixture<BubbleHostComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BubbleHostComponent]
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(BubbleHostComponent);
    hostFixture.detectChanges();
    host = hostFixture.nativeElement;
  });

  it('is revealed on bubble hover by default', () => {
    const actions: HTMLElement = host.querySelector('tolle-bubble-actions div')!;

    expect(actions.className).toContain('opacity-0');
    expect(actions.className).toContain('group-hover/bubble:opacity-100');
  });

  it('does not bubble an action click up to the bubble trigger', () => {
    const copy: HTMLButtonElement = host.querySelector('#copy')!;

    copy.click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.actionClicks).toBe(1);
    expect(hostFixture.componentInstance.bubbleClicks).toBe(0);
  });

  it('still fires the bubble trigger for a click on the surface itself', () => {
    const surface: HTMLElement = host.querySelector('tolle-bubble > div')!;

    surface.click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.bubbleClicks).toBe(1);
    expect(hostFixture.componentInstance.actionClicks).toBe(0);
  });
});

describe('BubbleReactionsComponent', () => {
  let component: BubbleReactionsComponent;
  let fixture: ComponentFixture<BubbleReactionsComponent>;

  const reactions: BubbleReaction[] = [
    { emoji: '👍', count: 3, reacted: true },
    { emoji: '🎉' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BubbleReactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BubbleReactionsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('reactions', reactions);
    fixture.detectChanges();
  });

  const chips = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('button'));

  it('renders one chip per reaction', () => {
    expect(chips().length).toBe(2);
    expect(chips()[0].textContent).toContain('👍');
    expect(chips()[0].textContent).toContain('3');
  });

  it('omits the tally when a reaction has no count', () => {
    expect(chips()[1].textContent!.trim()).toBe('🎉');
  });

  it('marks the chips the user reacted with as pressed', () => {
    expect(chips()[0].getAttribute('aria-pressed')).toBe('true');
    expect(chips()[0].className).toContain('text-primary');
    expect(chips()[1].getAttribute('aria-pressed')).toBe('false');
    expect(chips()[1].className).toContain('text-muted-foreground');
  });

  it('emits the reaction whose chip was clicked', () => {
    const emitted: BubbleReaction[] = [];
    component.react.subscribe(r => emitted.push(r));

    chips()[1].click();

    expect(emitted).toEqual([reactions[1]]);
  });
});
