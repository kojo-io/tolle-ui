import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface NavItem {
  title: string;
  url: string;
  icon?: string;
  external?: boolean;
}
export interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * Builds the docs sidebar "menu items" grouped by the component registry's
 * categories (Actions, Forms, Overlays, …). The categorized baseline is derived
 * from the registry manifest; on load it re-syncs with the shipped
 * `/registry/manifest.json` so the menu only lists components the library
 * actually ships. Emits the same shape the existing `tolle-sidebar` renders.
 */
@Injectable({ providedIn: 'root' })
export class RegistryNavService {
  private http = inject(HttpClient);

  /** Category → primary (documented) component slugs. Slugs match /components/:slug routes. */
  private readonly CATS: { label: string; slugs: string[] }[] = [
    { label: 'Actions', slugs: ['button', 'button-group', 'toggle', 'toggle-group'] },
    { label: 'Forms', slugs: ['input', 'textarea', 'label', 'checkbox', 'switch', 'radio-group', 'select', 'multi-select', 'slider', 'segment', 'otp', 'masked-input', 'country-selector', 'phone-number-input'] },
    { label: 'Date & Time', slugs: ['calendar', 'range-calendar', 'date-picker', 'date-range-picker'] },
    { label: 'Overlays', slugs: ['modal', 'alert-dialog', 'sheet', 'popover', 'hover-card', 'tooltip', 'dropdown-menu', 'context-menu'] },
    { label: 'Layout', slugs: ['card', 'accordion', 'tabs', 'collapsible', 'sidebar', 'resizable', 'scroll-area', 'separator', 'aspect-ratio'] },
    { label: 'Feedback', slugs: ['alert', 'badge', 'progress', 'skeleton', 'toaster', 'empty-state'] },
    { label: 'Navigation', slugs: ['breadcrumb', 'pagination'] },
    { label: 'Data', slugs: ['data-table'] },
    { label: 'Media', slugs: ['avatar', 'carousel'] },
  ];

  private readonly SPECIAL: Record<string, string> = {
    otp: 'OTP',
    'data-table': 'Data Table',
    'date-picker': 'Date Picker',
    'date-range-picker': 'Date Range Picker',
    'range-calendar': 'Range Calendar',
    'context-menu': 'Context Menu',
    'dropdown-menu': 'Dropdown Menu',
    'hover-card': 'Hover Card',
    'alert-dialog': 'Alert Dialog',
    'scroll-area': 'Scroll Area',
    'aspect-ratio': 'Aspect Ratio',
    'multi-select': 'Multi-select',
    'masked-input': 'Masked Input',
    'country-selector': 'Country Selector',
    'phone-number-input': 'Phone Number Input',
    'radio-group': 'Radio Group',
    'button-group': 'Button Group',
    'toggle-group': 'Toggle Group',
    'empty-state': 'Empty State',
    toaster: 'Toast',
    modal: 'Dialog',
  };

  /** The sidebar model, consumed by `<tolle-sidebar [items]="groups()">`. */
  readonly groups = signal<NavGroup[]>(this.build());

  constructor() {
    // Progressive sync: drop any category slug the shipped registry no longer includes.
    this.http.get<{ components?: { name: string }[] }>('registry/manifest.json').subscribe({
      next: (m) => {
        const shipped = new Set((m?.components ?? []).map((c) => c.name));
        if (shipped.size) this.groups.set(this.build((slug) => shipped.has(slug)));
      },
      error: () => {
        /* dev without generate:registry — keep the static baseline */
      },
    });
  }

  private humanize(slug: string): string {
    return this.SPECIAL[slug] ?? slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  private build(keep: (slug: string) => boolean = () => true): NavGroup[] {
    const groups: NavGroup[] = [
      {
        title: 'Getting Started',
        items: [
          { title: 'Introduction', url: '/getting-started' },
          { title: 'Theming', url: '/theming' },
          { title: 'All Components', url: '/components' },
        ],
      },
      {
        title: 'AI Native',
        items: [
          { title: 'Overview', url: '/ai-native', icon: 'ri-sparkling-2-line' },
          { title: 'llms.txt', url: '/llms.txt', icon: 'ri-robot-line', external: true },
          { title: 'Full reference', url: '/llms-full.txt', icon: 'ri-file-list-3-line', external: true },
          { title: 'Registry manifest', url: '/registry/manifest.json', icon: 'ri-braces-line', external: true },
        ],
      },
    ];
    for (const cat of this.CATS) {
      const items = cat.slugs
        .filter(keep)
        .map((slug) => ({ title: this.humanize(slug), url: `/components/${slug}` }));
      if (items.length) groups.push({ title: cat.label, items });
    }
    return groups;
  }
}
