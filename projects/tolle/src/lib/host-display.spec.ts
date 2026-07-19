import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import * as Tolle from '../public-api';

/**
 * Every component host must declare a display.
 *
 * Angular renders a component as a custom element (`<tolle-input>`), and an
 * unknown element defaults to `display: inline`. Vertical margins do not apply
 * to inline boxes, so `space-y-*` between two components collapsed to nothing
 * and everything looked stacked. `gap` inside a flex parent still worked, which
 * is why the docs examples — all wrapped in flex containers — hid the problem.
 *
 * IMPORTANT: these tests render each component through a host template so the
 * element under test is a real `<tolle-*>` node. `TestBed.createComponent()`
 * bootstraps the component into a plain `<div id="root0">` instead, and a div is
 * block by default — measuring that would pass no matter what the component
 * declares, which is exactly how an earlier version of this guard fooled itself.
 */

/** Blank shell whose template is swapped per component under test. */
@Component({ standalone: true, template: '' })
class ShellComponent {
  cls = '';
}

/** Renders `<selector></selector>` and hands back that element. */
function renderHost(type: any, selector: string): { el: HTMLElement; teardown: () => void } {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ imports: [ShellComponent, NoopAnimationsModule] });
  TestBed.overrideComponent(ShellComponent, {
    set: { imports: [type], template: `<${selector}></${selector}>` },
  });

  const fixture = TestBed.createComponent(ShellComponent);
  document.body.appendChild(fixture.nativeElement);
  fixture.detectChanges();

  const el = fixture.nativeElement.querySelector(selector) as HTMLElement;
  return {
    el,
    teardown: () => {
      document.body.removeChild(fixture.nativeElement);
      fixture.destroy();
    },
  };
}

/** First plain element selector Angular recorded for a component. */
function selectorOf(type: any): string | null {
  const raw = type?.ɵcmp?.selectors?.[0]?.[0];
  return typeof raw === 'string' && raw.startsWith('tolle-') ? raw : null;
}

describe('component host display', () => {
  const components = Object.entries(Tolle as Record<string, any>)
    .filter(([, value]) => typeof value === 'function' && value.ɵcmp)
    .map(([name, type]) => ({ name, type, selector: selectorOf(type) }))
    .filter((c) => c.selector);

  it('finds the components to check', () => {
    // Guards the guard: an empty list would make the assertion below vacuous.
    expect(components.length).toBeGreaterThan(150);
  });

  it('never leaves a host at display:inline', () => {
    const inline: string[] = [];
    let checked = 0;

    for (const { name, type, selector } of components) {
      let rendered: { el: HTMLElement; teardown: () => void };
      try {
        rendered = renderHost(type, selector!);
      } catch {
        // Needs a parent component or parent-provided service to exist at all;
        // those only ever appear inside a parent that supplies the context.
        continue;
      }

      if (rendered.el) {
        checked++;
        // A component may set its display through a class it puts on its own
        // host (`host: { '[class]': 'computedClass' }`). Karma loads no Tailwind,
        // so that class produces no computed style here — but it IS a real
        // display source, and overriding it from a :host rule is what broke tab
        // triggers into a vertical stack. Accept it.
        const classDisplay = /(^|\s)(inline-flex|inline-grid|inline-block|flex|grid|contents|table|block)(\s|$)/.test(
          rendered.el.getAttribute('class') || ''
        );
        if (getComputedStyle(rendered.el).display === 'inline' && !classDisplay) {
          inline.push(name + ' <' + selector + '>');
        }
      }
      rendered.teardown();
    }

    expect(checked).toBeGreaterThan(100);
    expect(inline)
      .withContext(
        'These hosts are display:inline, so vertical margins and space-y-* do ' +
          'nothing around them. Give each a :host display. Offenders: ' +
          inline.join(', ')
      )
      .toEqual([]);
  });

  it('lets a vertical margin actually separate two stacked components', () => {
    @Component({
      standalone: true,
      imports: [Tolle.CardComponent],
      template: `<tolle-card></tolle-card><tolle-card></tolle-card>`,
    })
    class StackHostComponent {}

    TestBed.resetTestingModule();
    const fixture = TestBed.configureTestingModule({
      imports: [StackHostComponent, NoopAnimationsModule],
    }).createComponent(StackHostComponent);

    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('tolle-card');
    // Karma loads no Tailwind, so these are otherwise zero-height boxes — and an
    // empty block collapses its own margins, which would mask what is under test.
    cards[0].style.height = '20px';
    cards[1].style.height = '20px';
    cards[1].style.marginTop = '40px';

    const gap = cards[1].getBoundingClientRect().top - cards[0].getBoundingClientRect().bottom;
    document.body.removeChild(fixture.nativeElement);

    expect(gap)
      .withContext('a 40px margin-top between two cards must produce a 40px gap')
      .toBeCloseTo(40, 0);
  });
});

/**
 * A bound `class` input must survive change detection on an OnPush component.
 *
 * Angular applies `[class]="expr"` on a component host through its STYLING
 * instruction path, and that path writes the matching `@Input() class` WITHOUT
 * calling markDirtyIfOnPush — unlike an ordinary property binding. An OnPush
 * component therefore renders the class it was born with, forever, and nothing
 * anywhere throws. Every affected component carries an ngOnChanges hook that
 * calls markForCheck; this proves the hooks are actually there.
 */
describe('OnPush components react to a changed class input', () => {
  const components = Object.entries(Tolle as Record<string, any>)
    .filter(([, v]) => typeof v === 'function' && v.ɵcmp && v.ɵcmp.onPush)
    .map(([name, type]) => ({ name, type, selector: selectorOf(type) }))
    .filter((c) => c.selector);

  it('finds OnPush components to check', () => {
    expect(components.length).toBeGreaterThan(50);
  });

  it('re-renders every OnPush component when its class binding changes', () => {
    const stale: string[] = [];
    let checked = 0;

    for (const { name, type, selector } of components) {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [ShellComponent, NoopAnimationsModule] });
      TestBed.overrideComponent(ShellComponent, {
        set: {
          imports: [type],
          template: `<${selector} [class]="cls"></${selector}>`,
        },
      });

      let fixture: any;
      try {
        fixture = TestBed.createComponent(ShellComponent);
        (fixture.componentInstance as any).cls = 'sentinel-before';
        fixture.detectChanges();
      } catch {
        continue; // needs a parent context; covered where it is used
      }

      const host: HTMLElement = fixture.nativeElement.querySelector(selector!);
      if (!host) { fixture.destroy(); continue; }

      (fixture.componentInstance as any).cls = 'sentinel-after';
      fixture.detectChanges();
      checked++;

      // The class lands either on the host or on the element the component
      // composes it onto, so look at the whole rendered subtree.
      const html = fixture.nativeElement.innerHTML;
      if (html.includes('sentinel-before') && !html.includes('sentinel-after')) {
        stale.push(name + ' <' + selector + '>');
      }
      fixture.destroy();
    }

    expect(checked).toBeGreaterThan(40);
    expect(stale)
      .withContext(
        'These OnPush components ignore a changed [class] binding. Add ' +
          'ngOnChanges() { this.cdr.markForCheck(); }. Offenders: ' + stale.join(', ')
      )
      .toEqual([]);
  });
});

