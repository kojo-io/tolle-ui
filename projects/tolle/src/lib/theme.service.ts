import {
  Injectable,
  Inject,
  PLATFORM_ID,
  Optional,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import { TOLLE_CONFIG, TolleConfig } from './tolle-config';
import { BehaviorSubject } from 'rxjs';
import { hexToRgb, radiusScale, generateThemeCss, generateBaseCss, generateChartCss } from './utils/color';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private _isDark = new BehaviorSubject<boolean>(false);
  public isDark$ = this._isDark.asObservable();

  private styleId = 'tolle-dynamic-theme';
  private baseStyleId = 'tolle-base-theme';
  private chartStyleId = 'tolle-chart-theme';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(TOLLE_CONFIG) private config: TolleConfig,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeTheme();
  }

  private initializeTheme() {
    if (!isPlatformBrowser(this.platformId)) return;

    // LOGIC: User Saved Preferences > Config Defaults > System Preference
    const savedTheme = localStorage.getItem('tolle-theme');
    const savedPrimary = localStorage.getItem('tolle-primary-color');
    const savedRadius = localStorage.getItem('tolle-radius');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determine Dark/Light Mode
    let shouldBeDark = systemPrefersDark;

    if (savedTheme) {
      shouldBeDark = savedTheme === 'dark';
    } else if (this.config?.darkByDefault !== undefined) {
      shouldBeDark = this.config.darkByDefault;
    }

    // Apply theme mode
    if (shouldBeDark) {
      this.enableDarkMode(false);
    } else {
      this.disableDarkMode(false);
    }

    // Apply Primary Color
    if (savedPrimary) {
      this.setPrimaryColor(savedPrimary, false);
    } else if (this.config?.primaryColor) {
      this.setPrimaryColor(this.config.primaryColor, false);
    }

    // Apply Radius
    if (savedRadius) {
      this.setRadius(savedRadius, false);
    } else if (this.config?.radius) {
      this.setRadius(this.config.radius, false);
    }

    // Apply Base (neutral) color (saved > config > theme.css default = zinc)
    const savedBase = localStorage.getItem('tolle-base-color');
    if (savedBase) {
      this.setBaseColor(savedBase, false);
    } else if (this.config?.baseColor) {
      this.setBaseColor(this.config.baseColor, false);
    }

    // Apply Chart color (saved > config)
    const savedChart = localStorage.getItem('tolle-chart-color');
    if (savedChart) {
      this.setChartColor(savedChart, false);
    } else if (this.config?.chartColor) {
      this.setChartColor(this.config.chartColor, false);
    }

    // Apply Typography (saved preference > config default > theme.css default)
    for (const kind of ['sans', 'serif', 'mono'] as const) {
      const saved = localStorage.getItem(`tolle-font-${kind}`);
      const fromConfig = this.config?.[`font${kind[0].toUpperCase()}${kind.slice(1)}` as 'fontSans' | 'fontSerif' | 'fontMono'];
      if (saved) {
        this.setFont(kind, saved, false);
      } else if (fromConfig) {
        this.setFont(kind, fromConfig, false);
      }
    }

    if (!savedTheme) {
      localStorage.setItem('tolle-theme', shouldBeDark ? 'dark' : 'light');
    }
  }


  /**
   * Sets a CSS custom property on an element.
   *
   * `Renderer2.setStyle(el, '--x', v)` without `DashCase` compiles to
   * `el.style['--x'] = v`, which is a silent no-op for custom properties — the
   * theme control appears to work and simply changes nothing. Every custom
   * property goes through here so no call site can forget the flag.
   */
  private setCssVar(el: HTMLElement, name: string, value: string): void {
    this.renderer.setStyle(el, name, value, RendererStyleFlags2.DashCase);
  }

  /** Set a typography stack (`--font-sans` / `--font-serif` / `--font-mono`). */
  setFont(kind: 'sans' | 'serif' | 'mono', stack: string, persist = true) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setCssVar(this.document.documentElement, `--font-${kind}`, stack);
    if (persist) {
      localStorage.setItem(`tolle-font-${kind}`, stack);
    }
  }

  /** Read the current stack for a font role from the live document. */
  getFont(kind: 'sans' | 'serif' | 'mono'): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    return getComputedStyle(this.document.documentElement).getPropertyValue(`--font-${kind}`).trim();
  }

  /** Set light/dark explicitly (a directional companion to `toggleTheme`). */
  setAppearance(mode: 'light' | 'dark', persist = true) {
    mode === 'dark' ? this.enableDarkMode(persist) : this.disableDarkMode(persist);
  }

  /**
   * Set the neutral base-color family (background/foreground/card/muted/border…).
   * Accepts a family id: `zinc` | `slate` | `gray` | `neutral` | `stone`.
   */
  setBaseColor(baseId: string, persist = true) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.injectStyleById(this.baseStyleId, generateBaseCss(baseId));
    if (persist) localStorage.setItem('tolle-base-color', baseId);
  }

  /** Set the chart palette from a base hex; derives `--chart-1…5`. */
  setChartColor(hex: string, persist = true) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.injectStyleById(this.chartStyleId, generateChartCss(hex));
    if (persist) localStorage.setItem('tolle-chart-color', hex);
  }

  /** Read the current base-color family id (persisted), or null. */
  get baseColor(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('tolle-base-color');
  }

  /** Read the current chart base color (persisted), or null. */
  get chartColor(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('tolle-chart-color');
  }

  /** Upsert a keyed <style> element in <head> with the given CSS text. */
  private injectStyleById(id: string, css: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    const existing = this.document.getElementById(id);
    if (existing) existing.remove();
    const el = this.document.createElement('style');
    el.id = id;
    el.textContent = css;
    this.renderer.appendChild(this.document.head, el);
  }

  setRadius(radius: string, persist = true) {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = this.document.documentElement;
    this.setCssVar(root, '--radius', radius);
    this.updateRadiusInDynamicStyles(radius);
    this.updateAllRadiusVariables(radius);

    if (persist) {
      localStorage.setItem('tolle-radius', radius);
    }
  }

  private updateAllRadiusVariables(baseRadius: string) {
    const root = this.document.documentElement;
    const scale = radiusScale(baseRadius);
    if (!scale) {
      console.warn(`Invalid radius format: ${baseRadius}. Using default values.`);
      return;
    }
    // `--radius` itself is set by setRadius(); apply the derived scale here.
    for (const [name, value] of Object.entries(scale)) {
      if (name === '--radius') continue;
      this.setCssVar(root, name, value);
    }
  }

  private updateRadiusInDynamicStyles(radius: string) {
    const existingStyle = this.document.getElementById(this.styleId);

    if (existingStyle) {
      let css = existingStyle.textContent || '';

      // Parse the radius to calculate derived values
      const radiusMatch = radius.match(/^(\d*\.?\d+)([a-z]+|%)$/);
      if (radiusMatch) {
        const numericValue = parseFloat(radiusMatch[1]);
        const unit = radiusMatch[2];

        const derivedRadii = {
          '--radius-sm': `${numericValue * 0.5}${unit}`,
          '--radius-md': `${numericValue}${unit}`,
          '--radius-lg': `${numericValue * 1.5}${unit}`,
          '--radius-xl': `${numericValue * 2}${unit}`,
          '--radius-2xl': `${numericValue * 3}${unit}`,
          '--radius-3xl': `${numericValue * 4}${unit}`,
          '--radius-full': '9999px'
        };

        // Update base radius
        if (css.includes('--radius:')) {
          css = css.replace(/--radius:[^;]+;/g, `--radius: ${radius};`);
        }

        // Update all derived radius variables
        Object.entries(derivedRadii).forEach(([varName, value]) => {
          if (css.includes(varName)) {
            const regex = new RegExp(`${varName}:[^;]+;`, 'g');
            css = css.replace(regex, `${varName}: ${value};`);
          } else {
            // Add the variable if it doesn't exist
            css = css.replace(/:root\s*{/, `:root {\n      ${varName}: ${value};`);
          }
        });
      }

      existingStyle.textContent = css;
    }
  }

  private generatePrimaryShades(baseColor: string) {
    // Radius is read from the DOM here; the token math lives in utils/color.
    const root = this.document.documentElement;
    const currentRadius = getComputedStyle(root).getPropertyValue('--radius').trim() || '0.5rem';
    this.injectDynamicStyles(generateThemeCss(baseColor, currentRadius));
  }

  private injectDynamicStyles(css: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    const existingStyle = this.document.getElementById(this.styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    const styleElement = this.document.createElement('style');
    styleElement.id = this.styleId;
    styleElement.textContent = css;
    this.renderer.appendChild(this.document.head, styleElement);
  }

  toggleTheme() {
    const isCurrentlyDark = this.document.documentElement.classList.contains('dark');
    isCurrentlyDark ? this.disableDarkMode() : this.enableDarkMode();
  }

  private enableDarkMode(saveToStorage = true) {
    this.renderer.addClass(this.document.documentElement, 'dark');
    if (saveToStorage) {
      localStorage.setItem('tolle-theme', 'dark');
    }
    this._isDark.next(true);
  }

  private disableDarkMode(saveToStorage = true) {
    this.renderer.removeClass(this.document.documentElement, 'dark');
    if (saveToStorage) {
      localStorage.setItem('tolle-theme', 'light');
    }
    this._isDark.next(false);
  }

  setPrimaryColor(color: string, persist = true) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.generatePrimaryShades(color);

    const rgb = hexToRgb(color);
    if (rgb) {
      this.setCssVar(this.document.documentElement, '--primary', `${rgb.r} ${rgb.g} ${rgb.b}`);
    }

    if (persist) {
      localStorage.setItem('tolle-primary-color', color);
    }
  }

  get currentTheme(): 'dark' | 'light' {
    return this._isDark.getValue() ? 'dark' : 'light';
  }

  get isDark(): boolean {
    return this._isDark.getValue();
  }

  get primaryColor(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const root = this.document.documentElement;
    const cssValue = getComputedStyle(root).getPropertyValue('--primary').trim();

    if (cssValue && cssValue !== '') {
      const rgbParts = cssValue.split(' ').map(Number);
      if (rgbParts.length === 3) {
        return `#${rgbParts[0].toString(16).padStart(2, '0')}${rgbParts[1].toString(16).padStart(2, '0')}${rgbParts[2].toString(16).padStart(2, '0')}`;
      }
    }

    return localStorage.getItem('tolle-primary-color');
  }

  resetToConfigDefaults() {
    if (!isPlatformBrowser(this.platformId)) return;

    ['tolle-theme', 'tolle-primary-color', 'tolle-radius', 'tolle-base-color', 'tolle-chart-color',
     'tolle-font-sans', 'tolle-font-serif', 'tolle-font-mono']
      .forEach((k) => localStorage.removeItem(k));

    this.document.getElementById(this.baseStyleId)?.remove();
    this.document.getElementById(this.chartStyleId)?.remove();

    this.initializeTheme();
  }

  getUserPreferences() {
    if (!isPlatformBrowser(this.platformId)) return null;

    return {
      theme: localStorage.getItem('tolle-theme'),
      primaryColor: localStorage.getItem('tolle-primary-color'),
      radius: localStorage.getItem('tolle-radius')
    };
  }

  clearUserPreferences() {
    if (!isPlatformBrowser(this.platformId)) return;

    ['tolle-theme', 'tolle-primary-color', 'tolle-radius', 'tolle-base-color', 'tolle-chart-color',
     'tolle-font-sans', 'tolle-font-serif', 'tolle-font-mono']
      .forEach((k) => localStorage.removeItem(k));

    this.document.getElementById(this.baseStyleId)?.remove();
    this.document.getElementById(this.chartStyleId)?.remove();

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      this.enableDarkMode(false);
    } else {
      this.disableDarkMode(false);
    }

    const root = this.document.documentElement;
    this.renderer.removeStyle(root, '--primary');
    this.renderer.removeStyle(root, '--radius');

    // Also remove all derived radius variables
    ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl', '--radius-3xl', '--radius-full']
      .forEach(varName => {
        this.renderer.removeStyle(root, varName);
      });

    const existingStyle = this.document.getElementById(this.styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
  }
}
