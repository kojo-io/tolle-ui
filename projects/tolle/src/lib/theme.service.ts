import { Injectable, Inject, PLATFORM_ID, Optional, Renderer2, RendererFactory2, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TOLLE_CONFIG, TolleConfig } from './tolle-config';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private _isDark = signal<boolean>(false);
  public isDark = this._isDark.asReadonly();
  public isDark$ = toObservable(this._isDark);

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

    // Parse the radius to extract numeric value and unit
    const radiusMatch = baseRadius.match(/^(\d*\.?\d+)([a-z]+|%)$/);
    if (!radiusMatch) {
      console.warn(`Invalid radius format: ${baseRadius}. Using default values.`);
      return;
    }

    const numericValue = parseFloat(radiusMatch[1]);
    const unit = radiusMatch[2];

    // Set all radius variables according to your CSS classes
    this.renderer.setStyle(root, '--radius-sm', `${numericValue * 0.5}${unit}`);
    this.renderer.setStyle(root, '--radius-md', `${numericValue}${unit}`);
    this.renderer.setStyle(root, '--radius-lg', `${numericValue * 1.5}${unit}`);
    this.renderer.setStyle(root, '--radius-xl', `${numericValue * 2}${unit}`);
    this.renderer.setStyle(root, '--radius-2xl', `${numericValue * 3}${unit}`);
    this.renderer.setStyle(root, '--radius-3xl', `${numericValue * 4}${unit}`);
    this.renderer.setStyle(root, '--radius-full', '9999px');
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
    const rgb = this.hexToRgb(baseColor);
    const rgbString = rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : '37 99 235';

    const ringLight = this.lightenColor(baseColor, 40);
    const ringLightRgb = this.hexToRgb(ringLight);
    const ringLightRgbString = ringLightRgb ? `${ringLightRgb.r} ${ringLightRgb.g} ${ringLightRgb.b}` : '96 165 250';

    const ringDark = this.lightenColor(baseColor, 20);
    const ringDarkRgb = this.hexToRgb(ringDark);
    const ringDarkRgbString = ringDarkRgb ? `${ringDarkRgb.r} ${ringDarkRgb.g} ${ringDarkRgb.b}` : '147 197 253';

    // Get current radius or default
    const root = this.document.documentElement;
    const currentRadius = getComputedStyle(root).getPropertyValue('--radius').trim() || '0.5rem';

    // Calculate all derived radius values
    const radiusMatch = currentRadius.match(/^(\d*\.?\d+)([a-z]+|%)$/);
    let radiusVariables = '';

    if (radiusMatch) {
      const numericValue = parseFloat(radiusMatch[1]);
      const unit = radiusMatch[2];

      radiusVariables = `
        --radius: ${currentRadius};
        --radius-sm: ${numericValue * 0.5}${unit};
        --radius-md: ${numericValue}${unit};
        --radius-lg: ${numericValue * 1.5}${unit};
        --radius-xl: ${numericValue * 2}${unit};
        --radius-2xl: ${numericValue * 3}${unit};
        --radius-3xl: ${numericValue * 4}${unit};
        --radius-full: 9999px;
      `;
    } else {
      radiusVariables = `--radius: ${currentRadius};`;
    }

    const css = `
      :root {
        --primary: ${rgbString};
        --primary-foreground: ${this.getContrastColorRgb(baseColor)};
        ${radiusVariables}
        --primary-50: ${this.hexToRgbString(this.lightenColor(baseColor, 90))};
        --primary-100: ${this.hexToRgbString(this.lightenColor(baseColor, 80))};
        --primary-200: ${this.hexToRgbString(this.lightenColor(baseColor, 60))};
        --primary-300: ${this.hexToRgbString(this.lightenColor(baseColor, 40))};
        --primary-400: ${this.hexToRgbString(this.lightenColor(baseColor, 20))};
        --primary-500: ${rgbString};
        --primary-600: ${this.hexToRgbString(this.darkenColor(baseColor, 20))};
        --primary-700: ${this.hexToRgbString(this.darkenColor(baseColor, 40))};
        --primary-800: ${this.hexToRgbString(this.darkenColor(baseColor, 60))};
        --primary-900: ${this.hexToRgbString(this.darkenColor(baseColor, 80))};
        --ring: ${ringLightRgbString};
      }

      .dark {
        --primary: ${rgbString};
        --primary-foreground: ${this.getContrastColorRgb(baseColor)};
        ${radiusVariables}
        --primary-50: ${this.hexToRgbString(this.darkenColor(baseColor, 85))};
        --primary-100: ${this.hexToRgbString(this.darkenColor(baseColor, 75))};
        --primary-200: ${this.hexToRgbString(this.darkenColor(baseColor, 65))};
        --primary-300: ${this.hexToRgbString(this.darkenColor(baseColor, 55))};
        --primary-400: ${this.hexToRgbString(this.darkenColor(baseColor, 45))};
        --primary-500: ${rgbString};
        --primary-600: ${this.hexToRgbString(this.lightenColor(baseColor, 20))};
        --primary-700: ${this.hexToRgbString(this.lightenColor(baseColor, 35))};
        --primary-800: ${this.hexToRgbString(this.lightenColor(baseColor, 50))};
        --primary-900: ${this.hexToRgbString(this.lightenColor(baseColor, 65))};
        --ring: ${ringDarkRgbString};
      }
    `;

    this.injectDynamicStyles(css);
  }

  private hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const cleanedHex = hex.replace('#', '');
    let r = 0, g = 0, b = 0;

    if (cleanedHex.length === 3) {
      r = parseInt(cleanedHex[0] + cleanedHex[0], 16);
      g = parseInt(cleanedHex[1] + cleanedHex[1], 16);
      b = parseInt(cleanedHex[2] + cleanedHex[2], 16);
      return { r, g, b };
    }

    if (cleanedHex.length === 6) {
      r = parseInt(cleanedHex.substring(0, 2), 16);
      g = parseInt(cleanedHex.substring(2, 4), 16);
      b = parseInt(cleanedHex.substring(4, 6), 16);
      return { r, g, b };
    }

    return null;
  }

  private hexToRgbString(hexColor: string): string {
    const rgb = this.hexToRgb(hexColor);
    return rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : '37 99 235';
  }

  private getContrastColorRgb(hexColor: string): string {
    const contrast = this.getContrastColor(hexColor);
    const rgb = this.hexToRgb(contrast);
    return rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : '255 255 255';
  }

  private lightenColor(color: string, percent: number): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * (percent / 100)));
    const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * (percent / 100)));
    const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * (percent / 100)));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private darkenColor(color: string, percent: number): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    const factor = 1 - (percent / 100);
    const r = Math.max(0, Math.floor(rgb.r * factor));
    const g = Math.max(0, Math.floor(rgb.g * factor));
    const b = Math.max(0, Math.floor(rgb.b * factor));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private getContrastColor(hexColor: string): string {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return '#ffffff';

    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
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
    this._isDark.set(true);
  }

  private disableDarkMode(saveToStorage = true) {
    this.renderer.removeClass(this.document.documentElement, 'dark');
    if (saveToStorage) {
      localStorage.setItem('tolle-theme', 'light');
    }
    this._isDark.set(false);
  }

  setPrimaryColor(color: string, persist = true) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.generatePrimaryShades(color);

    const rgb = this.hexToRgb(color);
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
    return this._isDark() ? 'dark' : 'light';
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
