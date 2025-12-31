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

    // 1. Determine Initial Mode (Dark/Light)
    const savedTheme = localStorage.getItem('tolle-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Logic: Saved Preference > Config Default > System Preference
    const shouldBeDark = savedTheme
      ? savedTheme === 'dark'
      : (this.config?.darkByDefault ?? systemPrefersDark);

    if (shouldBeDark) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }

    const savedPrimary = localStorage.getItem('tolle-primary-color');

    if (savedPrimary) {
      this.setPrimaryColor(savedPrimary, false);
    } else if (this.config?.primaryColor) {
      this.setPrimaryColor(this.config.primaryColor, false);
    }

    if (this.config?.radius) {
      this.renderer.setStyle(
        this.document.documentElement,
        '--radius',
        this.config.radius
      );
    }
    // 2. Apply Brand Config - This will generate full palette
    if (this.config) {
      this.applyBrandConfig(this.config);
    }
  }

  /**
   * Applies the brand identity variables with full shade palette
   */
  applyBrandConfig(config: TolleConfig) {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = this.document.documentElement;

    // Set primary color if provided
    if (config.primaryColor) {
      this.renderer.setStyle(root, '--primary', config.primaryColor);
      this.generatePrimaryShades(config.primaryColor);
    }

    // Set border radius if provided
    if (config.radius) {
      this.renderer.setStyle(root, '--radius', config.radius);
    }
  }

  /**
   * Generates full primary color palette (50-900) based on base color
   * Uses color-mix() for consistency with your existing approach
   */
  private generatePrimaryShades(baseColor: string) {
    const css = `
      :root {
        /* Primary Shades */
        --primary-50: color-mix(in srgb, ${baseColor}, white 90%);
        --primary-100: color-mix(in srgb, ${baseColor}, white 80%);
        --primary-200: color-mix(in srgb, ${baseColor}, white 60%);
        --primary-300: color-mix(in srgb, ${baseColor}, white 40%);
        --primary-400: color-mix(in srgb, ${baseColor}, white 20%);
        --primary-500: ${baseColor};
        --primary-600: color-mix(in srgb, ${baseColor}, black 20%);
        --primary-700: color-mix(in srgb, ${baseColor}, black 40%);
        --primary-800: color-mix(in srgb, ${baseColor}, black 60%);
        --primary-900: color-mix(in srgb, ${baseColor}, black 80%);

        /* Your existing derived colors - updated to use new shades */
        --primary-foreground: white;
        --secondary: color-mix(in srgb, var(--primary-200), transparent 40%);
        --secondary-foreground: var(--primary-900);
        --muted: color-mix(in srgb, var(--primary-50), #f3f4f6 50%);
        --muted-foreground: color-mix(in srgb, var(--primary-400), #4b5563 60%);
        --accent: color-mix(in srgb, var(--primary-100), transparent 70%);
        --accent-foreground: var(--primary-700);
        --ring: color-mix(in srgb, var(--primary-300), transparent 50%);
      }

      .dark {
        /* Dark mode variants */
        --primary-50: color-mix(in srgb, ${baseColor}, black 85%);
        --primary-100: color-mix(in srgb, ${baseColor}, black 75%);
        --primary-200: color-mix(in srgb, ${baseColor}, black 65%);
        --primary-300: color-mix(in srgb, ${baseColor}, black 55%);
        --primary-400: color-mix(in srgb, ${baseColor}, black 45%);
        --primary-500: ${baseColor};
        --primary-600: color-mix(in srgb, ${baseColor}, white 20%);
        --primary-700: color-mix(in srgb, ${baseColor}, white 35%);
        --primary-800: color-mix(in srgb, ${baseColor}, white 50%);
        --primary-900: color-mix(in srgb, ${baseColor}, white 65%);

        /* Dark mode derived colors */
        --primary-foreground: color-mix(in srgb, ${baseColor}, white 90%);
        --secondary: color-mix(in srgb, var(--primary-900), transparent 70%);
        --secondary-foreground: var(--primary-100);
        --muted: color-mix(in srgb, var(--primary-950), #1f2937 50%);
        --muted-foreground: color-mix(in srgb, var(--primary-300), #9ca3af 40%);
        --accent: color-mix(in srgb, var(--primary-800), transparent 80%);
        --accent-foreground: var(--primary-200);
        --ring: color-mix(in srgb, var(--primary-600), transparent 60%);
      }
    `;

    this.injectDynamicStyles(css);
  }

  private injectDynamicStyles(css: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    // Remove existing dynamic styles
    const existingStyle = this.document.getElementById(this.styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject new styles
    const styleElement = this.document.createElement('style');
    styleElement.id = this.styleId;
    styleElement.textContent = css;
    this.renderer.appendChild(this.document.head, styleElement);
  }

  toggleTheme() {
    const isCurrentlyDark = this.document.documentElement.classList.contains('dark');
    isCurrentlyDark ? this.disableDarkMode() : this.enableDarkMode();
  }

  private enableDarkMode() {
    this.renderer.addClass(this.document.documentElement, 'dark');
    localStorage.setItem('tolle-theme', 'dark');
    this.isDarkSubject.next(true);
  }

  private disableDarkMode() {
    this.renderer.removeClass(this.document.documentElement, 'dark');
    localStorage.setItem('tolle-theme', 'light');
    this.isDarkSubject.next(false);
  }

  setPrimaryColor(color: string, persist = true) {
    if (!isPlatformBrowser(this.platformId)) return;

    // Update CSS variables + palette
    this.renderer.setStyle(
      this.document.documentElement,
      '--primary',
      color
    );

    this.generatePrimaryShades(color);

    // Persist user preference
    if (persist) {
      localStorage.setItem('tolle-primary-color', color);
    }
  }

  get currentTheme(): 'dark' | 'light' {
    return this.isDarkSubject.value ? 'dark' : 'light';
  }

  get primaryColor() {
    return localStorage.getItem('tolle-primary-color');
  }
}
