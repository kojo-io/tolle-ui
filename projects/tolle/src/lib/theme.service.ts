import { Injectable, Inject, PLATFORM_ID, Optional, Renderer2, RendererFactory2 } from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import { TOLLE_CONFIG, TolleConfig } from './tolle-config';
import { BehaviorSubject } from 'rxjs';
import { hexToRgb, radiusScale, generateThemeCss } from './utils/color';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private _isDark = new BehaviorSubject<boolean>(false);
  public isDark$ = this._isDark.asObservable();

  private styleId = 'tolle-dynamic-theme';

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

    if (!savedTheme) {
      localStorage.setItem('tolle-theme', shouldBeDark ? 'dark' : 'light');
    }
  }

  setRadius(radius: string, persist = true) {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = this.document.documentElement;
    this.renderer.setStyle(root, '--radius', radius);
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
      this.renderer.setStyle(root, name, value);
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
      this.renderer.setStyle(
        this.document.documentElement,
        '--primary',
        `${rgb.r} ${rgb.g} ${rgb.b}`
      );
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

    localStorage.removeItem('tolle-theme');
    localStorage.removeItem('tolle-primary-color');
    localStorage.removeItem('tolle-radius');

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

    localStorage.removeItem('tolle-theme');
    localStorage.removeItem('tolle-primary-color');
    localStorage.removeItem('tolle-radius');

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
