import { Injectable, Inject, PLATFORM_ID, Optional, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { TOLLE_CONFIG, TolleConfig } from './tolle-config';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDarkSubject.asObservable();
  private styleId = 'tolle-dynamic-theme';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
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

    console.log('Theme initialization:', {
      savedTheme,
      savedPrimary,
      savedRadius,
      config: this.config,
      systemPrefersDark
    });

    // 1. Determine Dark/Light Mode
    // Priority: Saved Theme > Config Default > System Preference
    let shouldBeDark = systemPrefersDark; // Start with system

    if (savedTheme) {
      // User has saved preference
      shouldBeDark = savedTheme === 'dark';
    } else if (this.config?.darkByDefault !== undefined) {
      // Use config default if no user preference
      shouldBeDark = this.config.darkByDefault;
    }

    // Apply theme mode
    if (shouldBeDark) {
      this.enableDarkMode(false); // Don't save, we'll save after checking all preferences
    } else {
      this.disableDarkMode(false);
    }

    // 2. Apply Primary Color
    // Priority: Saved Color > Config Color
    if (savedPrimary) {
      // User has saved color preference
      this.setPrimaryColor(savedPrimary, false); // Don't save again
    } else if (this.config?.primaryColor) {
      // Use config default if no user preference
      this.setPrimaryColor(this.config.primaryColor, false); // Save this as user preference
    }

    // 3. Apply Radius
    // Priority: Saved Radius > Config Radius
    if (savedRadius) {
      // User has saved radius preference
      this.setRadius(savedRadius, false);
    } else if (this.config?.radius) {
      // Use config default if no user preference
      this.setRadius(this.config.radius, false);
    }

    // Save theme mode preference if it came from config or system
    if (!savedTheme) {
      localStorage.setItem('tolle-theme', shouldBeDark ? 'dark' : 'light');
    }
  }
  /**
   * Sets the border radius for all components
   */
  setRadius(radius: string, persist = true) {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = this.document.documentElement;

    // Set the CSS variable
    this.renderer.setStyle(root, '--radius', radius);

    // Also update the dynamic styles to include radius calculations
    this.updateRadiusInDynamicStyles(radius);

    // Persist if needed
    if (persist) {
      localStorage.setItem('tolle-radius', radius);
    }
  }

  /**
   * Updates the radius calculations in dynamic styles
   */
  private updateRadiusInDynamicStyles(radius: string) {
    const existingStyle = this.document.getElementById(this.styleId);

    if (existingStyle) {
      let css = existingStyle.textContent || '';

      // Update or add radius calculations
      if (css.includes('--radius:')) {
        // Replace existing radius declarations
        css = css.replace(/--radius:[^;]+;/g, `--radius: ${radius};`);
      } else {
        // Add radius to the beginning of :root
        css = css.replace(/:root\s*{/, `:root {\n      --radius: ${radius};`);
      }

      // Update the calculated radius values in the CSS
      const radiusCalcRegex = /calc\(var\(--radius[^)]+\)/g;
      css = css.replace(radiusCalcRegex, (match) => {
        if (match.includes('- 2px')) {
          return `calc(${radius} - 2px)`;
        } else if (match.includes('- 4px')) {
          return `calc(${radius} - 4px)`;
        }
        return match;
      });

      existingStyle.textContent = css;
    }
  }

  /**
   * Generates full primary color palette (50-900) based on base color
   */
  private generatePrimaryShades(baseColor: string) {
    // Convert hex to RGB
    const rgb = this.hexToRgb(baseColor);
    const rgbString = rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : '37 99 235';

    // Create lighter ring colors in RGB
    const ringLight = this.lightenColor(baseColor, 40);
    const ringLightRgb = this.hexToRgb(ringLight);
    const ringLightRgbString = ringLightRgb ? `${ringLightRgb.r} ${ringLightRgb.g} ${ringLightRgb.b}` : '96 165 250';

    const ringDark = this.lightenColor(baseColor, 20);
    const ringDarkRgb = this.hexToRgb(ringDark);
    const ringDarkRgbString = ringDarkRgb ? `${ringDarkRgb.r} ${ringDarkRgb.g} ${ringDarkRgb.b}` : '147 197 253';

    // Get current radius or use default
    const root = this.document.documentElement;
    const currentRadius = getComputedStyle(root).getPropertyValue('--radius').trim() || '0.5rem';

    const css = `
      /* Override primary colors - this needs to come AFTER your main CSS */
      :root {
        /* Primary in RGB format for Tailwind opacity support */
        --primary: ${rgbString};
        --primary-foreground: ${this.getContrastColorRgb(baseColor)};

        /* Radius */
        --radius: ${currentRadius};

        /* Primary shades for light mode */
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

        /* Update ring color to be lighter */
        --ring: ${ringLightRgbString};
      }

      .dark {
        /* For dark mode, we keep the primary color but adjust shades */
        --primary: ${rgbString};
        --primary-foreground: ${this.getContrastColorRgb(baseColor)};

        /* Dark mode shades */
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

        /* Update ring color for dark mode - lighter variant */
        --ring: ${ringDarkRgbString};
      }
    `;

    this.injectDynamicStyles(css);
  }

  /**
   * Convert hex color to RGB object
   */
  private hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    // Remove # if present
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

  /**
   * Convert hex to RGB string format for CSS (space-separated)
   */
  private hexToRgbString(hexColor: string): string {
    const rgb = this.hexToRgb(hexColor);
    return rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : '37 99 235';
  }

  /**
   * Get contrast color in RGB format
   */
  private getContrastColorRgb(hexColor: string): string {
    const contrast = this.getContrastColor(hexColor);
    const rgb = this.hexToRgb(contrast);
    return rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : '255 255 255';
  }

  /**
   * Lighten a hex color by a percentage
   */
  private lightenColor(color: string, percent: number): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    // Lighten by percentage
    const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * (percent / 100)));
    const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * (percent / 100)));
    const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * (percent / 100)));

    // Convert back to hex
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  /**
   * Darken a hex color by a percentage
   */
  private darkenColor(color: string, percent: number): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    const factor = 1 - (percent / 100);
    const r = Math.max(0, Math.floor(rgb.r * factor));
    const g = Math.max(0, Math.floor(rgb.g * factor));
    const b = Math.max(0, Math.floor(rgb.b * factor));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Calculate contrast color (black or white) based on background color
   */
  private getContrastColor(hexColor: string): string {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return '#ffffff';

    // Calculate relative luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    // Return black for light colors, white for dark colors
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
    this.isDarkSubject.next(true);
  }

  private disableDarkMode(saveToStorage = true) {
    this.renderer.removeClass(this.document.documentElement, 'dark');
    if (saveToStorage) {
      localStorage.setItem('tolle-theme', 'light');
    }
    this.isDarkSubject.next(false);
  }
  setPrimaryColor(color: string, persist = true) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.generatePrimaryShades(color);

    // Also set inline for immediate update
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
    return this.isDarkSubject.value ? 'dark' : 'light';
  }

  get primaryColor(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const root = this.document.documentElement;
    const cssValue = getComputedStyle(root).getPropertyValue('--primary').trim();

    if (cssValue && cssValue !== '') {
      // Convert RGB string back to hex for external use
      const rgbParts = cssValue.split(' ').map(Number);
      if (rgbParts.length === 3) {
        return `#${rgbParts[0].toString(16).padStart(2, '0')}${rgbParts[1].toString(16).padStart(2, '0')}${rgbParts[2].toString(16).padStart(2, '0')}`;
      }
    }

    return localStorage.getItem('tolle-primary-color');
  }

  /**
   * Reset to config defaults (clears user preferences)
   */
  resetToConfigDefaults() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Clear user preferences
    localStorage.removeItem('tolle-theme');
    localStorage.removeItem('tolle-primary-color');
    localStorage.removeItem('tolle-radius');

    // Re-initialize with config defaults
    this.initializeTheme();
  }

  /**
   * Get current user preferences
   */
  getUserPreferences() {
    if (!isPlatformBrowser(this.platformId)) return null;

    return {
      theme: localStorage.getItem('tolle-theme'),
      primaryColor: localStorage.getItem('tolle-primary-color'),
      radius: localStorage.getItem('tolle-radius')
    };
  }

  /**
   * Clear all user preferences
   */
  clearUserPreferences() {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem('tolle-theme');
    localStorage.removeItem('tolle-primary-color');
    localStorage.removeItem('tolle-radius');

    // Reset to system defaults (not config defaults)
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      this.enableDarkMode(false);
    } else {
      this.disableDarkMode(false);
    }

    // Remove CSS variables
    const root = this.document.documentElement;
    this.renderer.removeStyle(root, '--primary');
    this.renderer.removeStyle(root, '--radius');

    // Clear dynamic styles
    const existingStyle = this.document.getElementById(this.styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
  }
}
