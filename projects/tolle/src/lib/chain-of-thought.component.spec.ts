import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ChainOfThoughtComponent,
  ChainOfThoughtHeaderComponent,
  ChainOfThoughtContentComponent,
  ChainOfThoughtStepComponent,
  ChainOfThoughtSearchResultsComponent,
  ChainOfThoughtSearchResultComponent,
  type ChainOfThoughtStepStatus,
} from './chain-of-thought.component';

@Component({
  standalone: true,
  imports: [
    ChainOfThoughtComponent,
    ChainOfThoughtHeaderComponent,
    ChainOfThoughtContentComponent,
    ChainOfThoughtStepComponent,
    ChainOfThoughtSearchResultsComponent,
    ChainOfThoughtSearchResultComponent,
  ],
  template: `
    <tolle-chain-of-thought [open]="open" (openChange)="lastOpen = $event">
      <tolle-chain-of-thought-header [label]="label"></tolle-chain-of-thought-header>
      <tolle-chain-of-thought-content>
        <tolle-chain-of-thought-step label="Read the docs" [status]="firstStatus" icon="ri-search-line">
          <tolle-chain-of-thought-search-results>
            <tolle-chain-of-thought-search-result icon="ri-link">tailwind.config</tolle-chain-of-thought-search-result>
            <tolle-chain-of-thought-search-result>preset.js</tolle-chain-of-thought-search-result>
          </tolle-chain-of-thought-search-results>
        </tolle-chain-of-thought-step>
        <tolle-chain-of-thought-step label="Wrote the answer" status="pending"></tolle-chain-of-thought-step>
      </tolle-chain-of-thought-content>
    </tolle-chain-of-thought>
  `,
})
class ChainOfThoughtHostComponent {
  @Input() open = false;
  @Input() label = 'Chain of Thought';
  @Input() firstStatus: ChainOfThoughtStepStatus = 'complete';
  lastOpen: boolean | null = null;
}

describe('ChainOfThoughtComponent', () => {
  let fixture: ComponentFixture<ChainOfThoughtHostComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ChainOfThoughtHostComponent] }).compileComponents();

    fixture = TestBed.createComponent(ChainOfThoughtHostComponent);
    fixture.detectChanges();
    host = fixture.nativeElement;
  });

  const header = (): HTMLButtonElement => host.querySelector('tolle-chain-of-thought-header button')!;
  const content = (): HTMLElement | null => host.querySelector('tolle-chain-of-thought-content div');
  const steps = (): HTMLElement[] => Array.from(host.querySelectorAll('tolle-chain-of-thought-step'));

  it('should create', () => {
    expect(host.querySelector('tolle-chain-of-thought')).toBeTruthy();
  });

  it('renders the header label', () => {
    expect(header().textContent).toContain('Chain of Thought');
  });

  it('accepts a custom header label', () => {
    fixture.componentRef.setInput('label', 'Thought for 4s');
    fixture.detectChanges();

    expect(header().textContent).toContain('Thought for 4s');
  });

  it('keeps the steps collapsed until the header is clicked', () => {
    expect(content()).toBeNull();
    expect(header().getAttribute('aria-expanded')).toBe('false');
  });

  it('expands and collapses when the header is clicked', () => {
    header().click();
    fixture.detectChanges();
    expect(content()).toBeTruthy();
    expect(header().getAttribute('aria-expanded')).toBe('true');

    header().click();
    fixture.detectChanges();
    expect(content()).toBeNull();
  });

  it('emits openChange on toggle but not on init', () => {
    expect(fixture.componentInstance.lastOpen).toBeNull();

    header().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastOpen).toBe(true);

    header().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastOpen).toBe(false);
  });

  it('expands from the open input', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    expect(content()).toBeTruthy();
    expect(steps().length).toBe(2);
  });

  it('renders a rail on every step so they read as a connected list', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    expect(host.querySelectorAll('.tolle-cot-rail').length).toBe(2);
    // The rail on the final step is hidden by the step's own last-child rule.
    expect(steps()[0].className).toContain('[&:last-child_.tolle-cot-rail]:hidden');
  });

  it('applies the complete status colours to a step marker', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const marker: HTMLElement = steps()[0].querySelector('span:not(.tolle-cot-rail)')!;
    expect(steps()[0].getAttribute('data-status')).toBe('complete');
    expect(marker.className).toContain('text-success');
  });

  it('applies the active status colours and bolds the label', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('firstStatus', 'active');
    fixture.detectChanges();

    const marker: HTMLElement = steps()[0].querySelector('span:not(.tolle-cot-rail)')!;
    const label: HTMLElement = steps()[0].querySelector('p')!;
    expect(marker.className).toContain('text-info');
    expect(label.className).toContain('font-medium');
  });

  it('applies the pending status colours to a step marker', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const marker: HTMLElement = steps()[1].querySelector('span:not(.tolle-cot-rail)')!;
    expect(marker.className).toContain('text-muted-foreground');
    expect(marker.className).toContain('bg-background');
  });

  it('renders the step icon and label', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    expect(steps()[0].querySelector('i')!.className).toContain('ri-search-line');
    expect(steps()[0].querySelector('p')!.textContent!.trim()).toBe('Read the docs');
  });

  it('renders search results as chips', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const chips = host.querySelectorAll('tolle-chain-of-thought-search-result span');
    expect(chips.length).toBe(2);
    expect(chips[0].textContent).toContain('tailwind.config');
    expect(chips[0].className).toContain('rounded-full');
    expect(chips[0].querySelector('i')!.className).toContain('ri-link');
    expect(chips[1].querySelector('i')).toBeNull();
  });

  it('wraps the chips in a flex-wrap row', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const results: HTMLElement = host.querySelector('tolle-chain-of-thought-search-results div')!;
    expect(results.className).toContain('flex-wrap');
  });
});
