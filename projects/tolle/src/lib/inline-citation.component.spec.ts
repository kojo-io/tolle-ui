import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  InlineCitationComponent,
  InlineCitationCardComponent,
  InlineCitationQuoteComponent,
} from './inline-citation.component';

@Component({
  standalone: true,
  imports: [InlineCitationComponent, InlineCitationCardComponent, InlineCitationQuoteComponent],
  template: `
    <p>
      The library ships a preset.<tolle-inline-citation [index]="3" placement="bottom">
        <tolle-inline-citation-card
          title="Tailwind preset"
          url="https://example.com/docs/preset"
          snippet="Import the preset to inherit the theme tokens."
        >
          <tolle-inline-citation-quote cite="Docs">Tokens are the contract.</tolle-inline-citation-quote>
        </tolle-inline-citation-card>
      </tolle-inline-citation>
    </p>
  `,
})
class InlineCitationHostComponent {}

describe('InlineCitationComponent', () => {
  let fixture: ComponentFixture<InlineCitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InlineCitationComponent] }).compileComponents();

    fixture = TestBed.createComponent(InlineCitationComponent);
    fixture.detectChanges();
  });

  const marker = (): HTMLElement => fixture.nativeElement.querySelector('sup');

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the index inside a superscript marker', () => {
    expect(marker().textContent!.trim()).toBe('1');

    fixture.componentRef.setInput('index', 7);
    fixture.detectChanges();
    expect(marker().textContent!.trim()).toBe('7');
  });

  it('applies the default variant and size classes', () => {
    expect(marker().className).toContain('text-primary');
    expect(marker().className).toContain('text-[10px]');
    expect(marker().className).toContain('align-super');
  });

  it('changes classes for the muted variant', () => {
    fixture.componentRef.setInput('variant', 'muted');
    fixture.detectChanges();

    expect(marker().className).toContain('text-muted-foreground');
    expect(marker().className).not.toContain('text-primary');
  });

  it('changes classes for the subtle variant', () => {
    fixture.componentRef.setInput('variant', 'subtle');
    fixture.detectChanges();

    expect(marker().className).toContain('text-foreground/60');
  });

  it('supports the small size variant', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    expect(marker().className).toContain('text-[9px]');
  });

  it('derives an accessible label from the index', () => {
    fixture.componentRef.setInput('index', 4);
    fixture.detectChanges();

    expect(marker().getAttribute('aria-label')).toBe('Citation 4');
  });

  it('lets the accessible label be overridden', () => {
    fixture.componentRef.setInput('ariaLabel', 'Source: release notes');
    fixture.detectChanges();

    expect(marker().getAttribute('aria-label')).toBe('Source: release notes');
  });

  it('is reachable by keyboard', () => {
    expect(marker().getAttribute('tabindex')).toBe('0');
    expect(marker().getAttribute('role')).toBe('button');
  });

  it('positions the source card with the existing hover card', () => {
    const hostEl: HTMLElement = fixture.nativeElement;
    expect(hostEl.querySelector('tolle-hover-card')).toBeTruthy();
    expect(hostEl.querySelector('tolle-hover-card-trigger')).toBeTruthy();
    expect(hostEl.querySelector('tolle-hover-card-content')).toBeTruthy();
  });

  it('merges extra classes onto the marker and the card panel', () => {
    fixture.componentRef.setInput('class', 'my-marker');
    fixture.componentRef.setInput('cardClass', 'my-card');
    fixture.detectChanges();

    expect(marker().className).toContain('my-marker');
    expect(fixture.componentInstance.contentClass).toContain('my-card');
  });
});

describe('InlineCitationCardComponent', () => {
  let fixture: ComponentFixture<InlineCitationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InlineCitationCardComponent] }).compileComponents();

    fixture = TestBed.createComponent(InlineCitationCardComponent);
    fixture.componentRef.setInput('title', 'Release notes');
    fixture.componentRef.setInput('url', 'https://example.com/notes');
    fixture.componentRef.setInput('snippet', 'Shipped on 14 March.');
    fixture.detectChanges();
  });

  it('renders the source title', () => {
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('Release notes');
  });

  it('links to the source and strips the scheme for display', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('https://example.com/notes');
    expect(link.textContent).toContain('example.com/notes');
    expect(link.textContent).not.toContain('https://');
    expect(link.getAttribute('rel')).toContain('noopener');
  });

  it('renders the snippet', () => {
    expect(fixture.nativeElement.textContent).toContain('Shipped on 14 March.');
  });

  it('omits the link when no url is given', () => {
    fixture.componentRef.setInput('url', '');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });

  it('omits the snippet paragraph when no snippet is given', () => {
    fixture.componentRef.setInput('snippet', '');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Shipped on 14 March.');
  });
});

describe('InlineCitationQuoteComponent', () => {
  let fixture: ComponentFixture<InlineCitationQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InlineCitationQuoteComponent] }).compileComponents();

    fixture = TestBed.createComponent(InlineCitationQuoteComponent);
    fixture.detectChanges();
  });

  it('renders as an italic blockquote', () => {
    const quote: HTMLElement = fixture.nativeElement.querySelector('blockquote');
    expect(quote).toBeTruthy();
    expect(quote.className).toContain('italic');
    expect(quote.className).toContain('border-l-2');
  });

  it('shows the attribution only when cite is set', () => {
    expect(fixture.nativeElement.querySelector('footer')).toBeNull();

    fixture.componentRef.setInput('cite', 'Release notes');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('footer').textContent).toContain('Release notes');
  });
});

describe('Inline citation composition', () => {
  it('renders the marker inline and keeps the source card until it is hovered', async () => {
    await TestBed.configureTestingModule({ imports: [InlineCitationHostComponent] }).compileComponents();

    const hostFixture = TestBed.createComponent(InlineCitationHostComponent);
    hostFixture.detectChanges();
    const host: HTMLElement = hostFixture.nativeElement;

    expect(host.querySelector('sup')!.textContent!.trim()).toBe('3');
    // The card lives behind the hover card's own *ngIf, so it stays out of the
    // document (and out of the reading order) until the marker is hovered.
    expect(host.textContent).not.toContain('Tokens are the contract.');
    expect(host.querySelector('tolle-hover-card-trigger sup')).toBeTruthy();

    const citation = hostFixture.debugElement.query(By.directive(InlineCitationComponent));
    expect(citation.componentInstance.placement).toBe('bottom');
  });
});
