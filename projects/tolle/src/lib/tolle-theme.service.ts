import { Injectable, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TOLLE_CONFIG, TolleConfig } from './tolle-config';

@Injectable({ providedIn: 'root' })
export class TolleThemeService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(TOLLE_CONFIG) private config: TolleConfig
  ) {}

  init(): void {
    if (!isPlatformBrowser(this.platformId) || !this.config) return;

    this.applyTheme(this.config);
    this.applyDarkMode(this.config);
  }

  /* --------------------------------------------
     THEME APPLICATION
     -------------------------------------------- */
  private applyTheme(config: TolleConfig): void {
    const root = this.document.documentElement;

    if (config.primaryColor) {
      const { h, s, l } = this.hexToHslRaw(config.primaryColor);
      const primary = `${h} ${s}% ${l}%`;

      root.style.setProperty('--primary', primary);
      root.style.setProperty('--accent', primary);
      root.style.setProperty('--ring', primary);

      const foreground =
        l > 60 ? '222 47% 11%' : '0 0% 100%';

      root.style.setProperty('--primary-foreground', foreground);
      root.style.setProperty('--accent-foreground', foreground);
    }

    if (config.radius) {
      root.style.setProperty('--radius', config.radius);
    }
  }

  /* --------------------------------------------
     DARK MODE (GOOGLE PRESET)
     -------------------------------------------- */
  private applyDarkMode(config: TolleConfig): void {
    const root = this.document.documentElement;

    const saved = localStorage.getItem('tolle-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const shouldBeDark =
      saved === 'dark' ||
      (!saved && (config.darkByDefault ?? prefersDark));

    root.classList.toggle('dark', shouldBeDark);
  }

  /* --------------------------------------------
     COLOR UTILS
     -------------------------------------------- */
  private hexToHslRaw(hex: string) {
    hex = hex.replace('#', '');

    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }
}
