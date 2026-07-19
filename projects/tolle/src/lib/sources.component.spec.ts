import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SourceComponent,
  SourcesComponent,
  SourcesContentComponent,
  SourcesTriggerComponent,
} from './sources.component';

interface Citation {
  href: string;
  title: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SourcesComponent,
    SourcesTriggerComponent,
    SourcesContentComponent,
    SourceComponent,
  ],
  template: `
    <tolle-sources (openChange)="openEvents.push($event)">
      <tolle-sources-trigger></tolle-sources-trigger>
      <tolle-sources-content>
        <tolle-source
          *ngFor="let citation of citations"
          [href]="citation.href"
          [title]="citation.title"
        ></tolle-source>
      </tolle-sources-content>
    </tolle-sources>
  `,
})
class HostComponent {
  citations: Citation[] = [
    { href: 'https://example.com/a', title: 'Alpha' },
    { href: 'https://example.com/b', title: 'Beta' },
    { href: 'https://example.com/c', title: 'Gamma' },
  ];
  openEvents: boolean[] = [];
}

describe('SourcesComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const trigger = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('[data-sources-trigger]');

  const label = (): string =>
    fixture.nativeElement.querySelector('[data-sources-label]').textContent!.trim();

  const content = (): HTMLElement => fixture.nativeElement.querySelector('[data-sources-content]');

  const links = (): HTMLAnchorElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[data-source]'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('counts the projected sources in the trigger label', () => {
    expect(label()).toBe('Used 3 sources');
  });

  it('uses the singular form for a single source', () => {
    fixture.componentInstance.citations = [{ href: 'https://example.com/a', title: 'Alpha' }];
    fixture.detectChanges();

    expect(label()).toBe('Used 1 source');
  });

  it('keeps the count correct as sources are added and removed', () => {
    fixture.componentInstance.citations = [
      ...fixture.componentInstance.citations,
      { href: 'https://example.com/d', title: 'Delta' },
    ];
    fixture.detectChanges();
    expect(label()).toBe('Used 4 sources');

    fixture.componentInstance.citations = [];
    fixture.detectChanges();
    expect(label()).toBe('Used 0 sources');
  });

  it('starts collapsed and expands when the trigger is pressed', () => {
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(content().getAttribute('data-state')).toBe('closed');
    expect(content().className).toContain('hidden');
    expect(content().getAttribute('inert')).toBe('');

    trigger().click();
    fixture.detectChanges();

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(content().getAttribute('data-state')).toBe('open');
    expect(content().className).not.toContain('hidden');
    expect(content().getAttribute('inert')).toBeNull();
    expect(fixture.componentInstance.openEvents).toEqual([true]);
  });

  it('renders each source as a safely-targeted external link', () => {
    const first = links()[0];

    expect(first.tagName).toBe('A');
    expect(first.getAttribute('href')).toBe('https://example.com/a');
    expect(first.getAttribute('target')).toBe('_blank');
    expect(first.getAttribute('rel')).toBe('noreferrer noopener');
  });

  it('shows the source title', () => {
    expect(
      fixture.nativeElement.querySelector('[data-source-title]').textContent.trim()
    ).toBe('Alpha');
  });

  it('numbers the sources in document order', () => {
    const chips = links().map((link) => link.querySelector('span')!.textContent!.trim());

    expect(chips).toEqual(['1', '2', '3']);
  });
});
