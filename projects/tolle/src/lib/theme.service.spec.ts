import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

/**
 * These pin the one thing every themed token depends on: the value actually
 * reaching the CSS custom property on `<html>`.
 *
 * `Renderer2.setStyle(el, '--x', v)` compiles to `el.style['--x'] = v`, which is
 * a silent no-op for custom properties — the renderer needs
 * `RendererStyleFlags2.DashCase` so it calls `style.setProperty` instead.
 * Nothing throws when that flag is missing; the theme control just does nothing.
 */
describe('ThemeService custom properties', () => {
  let service: ThemeService;

  const readVar = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    for (const name of ['--font-sans', '--font-serif', '--font-mono', '--radius',
                        '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--primary']) {
      document.documentElement.style.removeProperty(name);
    }
    ['sans', 'serif', 'mono'].forEach((k) => localStorage.removeItem(`tolle-font-${k}`));
  });

  it('applies a sans font stack to --font-sans', () => {
    service.setFont('sans', 'Inter, sans-serif');
    expect(readVar('--font-sans')).toBe('Inter, sans-serif');
  });

  it('applies a serif font stack to --font-serif', () => {
    service.setFont('serif', 'Lora, serif');
    expect(readVar('--font-serif')).toBe('Lora, serif');
  });

  it('applies a mono font stack to --font-mono', () => {
    service.setFont('mono', 'JetBrains Mono, monospace');
    expect(readVar('--font-mono')).toBe('JetBrains Mono, monospace');
  });

  it('reads the applied stack back through getFont', () => {
    service.setFont('sans', 'Inter, sans-serif');
    expect(service.getFont('sans')).toBe('Inter, sans-serif');
  });

  it('persists the stack so a reload keeps the choice', () => {
    service.setFont('sans', 'Inter, sans-serif');
    expect(localStorage.getItem('tolle-font-sans')).toBe('Inter, sans-serif');
  });

  it('applies the radius to --radius (same bug class as fonts)', () => {
    service.setRadius('0.75rem');
    expect(readVar('--radius')).toBe('0.75rem');
  });

  it('applies the derived radius scale, not just the base value', () => {
    service.setRadius('0.75rem');
    // radiusScale() emits --radius-sm/md/lg/xl alongside --radius; those went
    // through the same broken call and were equally silent.
    const derived = ['--radius-sm', '--radius-md', '--radius-lg']
      .map(readVar)
      .filter((v) => v !== '');
    expect(derived.length).toBeGreaterThan(0);
  });

  it('applies the primary colour to --primary as an rgb triplet', () => {
    service.setPrimaryColor('#2563eb');
    expect(readVar('--primary')).toBe('37 99 235');
  });
});

/**
 * End-to-end path for the theming "Typography" control: picking a stack must
 * change the font actually used to render text, not just a variable in the void.
 */
describe('font token reaches rendered text', () => {
  it('re-renders text in the chosen stack', () => {
    const service = TestBed.configureTestingModule({}).inject(ThemeService);

    // theme.css maps Tailwind's font-sans to var(--font-sans); emulate that
    // mapping here since Karma loads no stylesheet.
    const style = document.createElement('style');
    style.textContent = '.probe { font-family: var(--font-sans); }';
    document.head.appendChild(style);

    const probe = document.createElement('p');
    probe.className = 'probe';
    probe.textContent = 'The quick brown fox';
    document.body.appendChild(probe);

    service.setFont('sans', 'Verdana, Geneva, sans-serif');
    const applied = getComputedStyle(probe).fontFamily;

    document.body.removeChild(probe);
    document.head.removeChild(style);
    document.documentElement.style.removeProperty('--font-sans');
    localStorage.removeItem('tolle-font-sans');

    expect(applied).toContain('Verdana');
  });
});
