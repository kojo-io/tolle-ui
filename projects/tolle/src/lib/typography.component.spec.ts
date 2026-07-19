import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypographyComponent } from './typography.component';

@Component({
  standalone: true,
  imports: [TypographyComponent],
  template: `<tolle-typography [variant]="variant" [class]="extraClass">{{ text }}</tolle-typography>`
})
class TypographyHostComponent {
  variant: any = 'p';
  extraClass = '';
  text = 'The quick brown fox';
}

describe('TypographyComponent', () => {
  let component: TypographyComponent;
  let fixture: ComponentFixture<TypographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypographyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a paragraph by default', () => {
    expect(fixture.nativeElement.querySelector('p')).toBeTruthy();
  });

  it('treats the untagged variants as paragraphs', () => {
    expect(component.isParagraph).toBe(true);

    for (const variant of ['lead', 'large', 'small', 'muted'] as const) {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      expect(component.isParagraph)
        .withContext(`variant "${variant}" should render as a paragraph`).toBe(true);
      expect(fixture.nativeElement.querySelector('p')).toBeTruthy();
    }
  });

  it('does not treat the tagged variants as paragraphs', () => {
    for (const variant of ['h1', 'h2', 'h3', 'h4', 'blockquote', 'code'] as const) {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      expect(component.isParagraph)
        .withContext(`variant "${variant}" should have its own tag`).toBe(false);
      expect(fixture.nativeElement.querySelector('p')).toBeNull();
    }
  });

  it('applies the variant type-scale classes', () => {
    fixture.componentRef.setInput('variant', 'h1');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').className).toContain('text-4xl');

    fixture.componentRef.setInput('variant', 'muted');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p').className).toContain('text-muted-foreground');
  });

  it('merges extra classes passed through the class input', () => {
    fixture.componentRef.setInput('class', 'my-custom-type');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p').className).toContain('my-custom-type');
  });
});

describe('TypographyComponent (tags and projection)', () => {
  let hostFixture: ComponentFixture<TypographyHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypographyHostComponent]
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(TypographyHostComponent);
    hostFixture.detectChanges();
  });

  const render = (variant: string): HTMLElement => {
    hostFixture.componentInstance.variant = variant;
    hostFixture.detectChanges();
    return hostFixture.nativeElement.querySelector('tolle-typography');
  };

  const cases: { variant: string; tag: string }[] = [
    { variant: 'h1', tag: 'h1' },
    { variant: 'h2', tag: 'h2' },
    { variant: 'h3', tag: 'h3' },
    { variant: 'h4', tag: 'h4' },
    { variant: 'blockquote', tag: 'blockquote' },
    { variant: 'code', tag: 'code' },
    { variant: 'p', tag: 'p' },
    { variant: 'lead', tag: 'p' },
    { variant: 'large', tag: 'p' },
    { variant: 'small', tag: 'p' },
    { variant: 'muted', tag: 'p' }
  ];

  for (const { variant, tag } of cases) {
    it(`renders variant "${variant}" as <${tag}>`, () => {
      const el = render(variant);
      expect(el.querySelector(tag))
        .withContext(`expected a <${tag}> for variant "${variant}"`).toBeTruthy();
    });

    it(`renders exactly one element for variant "${variant}"`, () => {
      const el = render(variant);
      expect(el.children.length).toBe(1);
    });
  }

  // The component projects once into an ng-template and stamps it with
  // ngTemplateOutlet — a duplicated <ng-content> per branch would leave every
  // branch but the first empty, so assert the text really survives.
  it('keeps the projected text for the h1 variant', () => {
    const el = render('h1');
    const h1 = el.querySelector('h1')!;

    expect(h1.textContent!.trim()).toBe('The quick brown fox');
  });

  it('keeps the projected text for the p variant', () => {
    const el = render('p');
    const p = el.querySelector('p')!;

    expect(p.textContent!.trim()).toBe('The quick brown fox');
  });

  it('keeps the projected text for every variant', () => {
    for (const { variant, tag } of cases) {
      const el = render(variant);

      expect(el.querySelector(tag)!.textContent!.trim())
        .withContext(`variant "${variant}" lost its projected content`)
        .toBe('The quick brown fox');
    }
  });

  it('keeps the projected text when switching variants back and forth', () => {
    render('h1');
    render('p');
    const el = render('h2');

    expect(el.querySelector('h2')!.textContent!.trim()).toBe('The quick brown fox');
  });
});
