import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface NavItem {
  title: string;
  url: string;
  icon?: string;
  external?: boolean;
  /** Trailing pill, e.g. 'New'. Rendered by `tolle-sidebar`. */
  badge?: string;
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
    { label: 'Actions', slugs: ['button', 'button-group', 'toggle', 'toggle-group', 'kbd'] },
    { label: 'Forms', slugs: ['field', 'input', 'input-group', 'textarea', 'label', 'checkbox', 'switch', 'radio-group', 'select', 'multi-select', 'native-select', 'combobox', 'slider', 'segment', 'otp', 'masked-input', 'country-selector', 'phone-number-input'] },
    { label: 'Date & Time', slugs: ['calendar', 'range-calendar', 'date-picker', 'date-range-picker', 'time-picker', 'date-time-picker'] },
    { label: 'Overlays', slugs: ['modal', 'alert-dialog', 'sheet', 'popover', 'hover-card', 'tooltip', 'dropdown-menu', 'context-menu', 'command', 'command-dialog'] },
    { label: 'Layout', slugs: ['card', 'accordion', 'tabs', 'collapsible', 'sidebar', 'resizable', 'scroll-area', 'separator', 'aspect-ratio', 'item', 'typography'] },
    { label: 'Feedback', slugs: ['alert', 'badge', 'progress', 'skeleton', 'spinner', 'toaster', 'empty-state'] },
    { label: 'Navigation', slugs: ['breadcrumb', 'pagination', 'menubar', 'navigation-menu'] },
    { label: 'Data', slugs: ['table', 'data-table', 'chart', 'chart-pie'] },
    { label: 'Media', slugs: ['avatar', 'carousel'] },
    {
      // Ordered by how a chat UI is assembled — transcript, then composer, then
      // the parts of a response, then agent workflow — rather than alphabetically.
      label: 'AI & Chat',
      slugs: [
        'conversation', 'message-scroller', 'message', 'bubble', 'marker', 'attachment',
        'prompt-input', 'suggestion',
        'reasoning', 'chain-of-thought', 'tool', 'sources', 'inline-citation', 'shimmer',
        'task', 'plan', 'queue', 'checkpoint', 'confirmation', 'context', 'model-selector',
      ],
    },
    { label: 'Utilities', slugs: ['direction'] },
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
    'input-group': 'Input Group',
    'navigation-menu': 'Navigation Menu',
    'command-dialog': 'Command Dialog',
    'time-picker': 'Time Picker',
    'date-time-picker': 'Date & Time Picker',
    'message-scroller': 'Message Scroller',
    'prompt-input': 'Prompt Input',
    'chain-of-thought': 'Chain of Thought',
    'inline-citation': 'Inline Citation',
    'model-selector': 'Model Selector',
    suggestion: 'Suggestions',
    'native-select': 'Native Select',
    kbd: 'Kbd',
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

  /** Groups in `groups()` that are navigation chrome rather than components. */
  private static readonly NON_COMPONENT_GROUPS = new Set(['Getting Started', 'AI Native']);

  /**
   * Every documented component, flattened and sorted by title — the source for
   * the `/components` index, so it can't drift from the sidebar the way a
   * hand-written list did.
   */
  readonly allComponents = computed<NavItem[]>(() =>
    this.groups()
      .filter((g) => !RegistryNavService.NON_COMPONENT_GROUPS.has(g.title))
      .flatMap((g) => g.items)
      .sort((a, b) => a.title.localeCompare(b.title))
  );

  constructor() {
    // Progressive sync: drop any category slug the shipped registry no longer
    // includes, and pick up each component's `isNew` flag (set from a `@new`
    // JSDoc tag on the component source) to badge it in the menu.
    this.http.get<{ components?: { name: string; isNew?: boolean }[] }>('registry/manifest.json').subscribe({
      next: (m) => {
        const components = m?.components ?? [];
        const shipped = new Set(components.map((c) => c.name));
        const isNew = new Set(components.filter((c) => c.isNew).map((c) => c.name));
        if (shipped.size) this.groups.set(this.build((slug) => shipped.has(slug), isNew));
      },
      error: () => {
        /* dev without generate:registry — keep the static baseline */
      },
    });
  }

  private humanize(slug: string): string {
    return this.SPECIAL[slug] ?? slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  private build(
    keep: (slug: string) => boolean = () => true,
    isNew: ReadonlySet<string> = new Set()
  ): NavGroup[] {
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
      const items = cat.slugs.filter(keep).map((slug) => ({
        title: this.humanize(slug),
        url: `/components/${slug}`,
        ...(isNew.has(slug) ? { badge: 'New' } : {}),
      }));
      if (items.length) groups.push({ title: cat.label, items });
    }
    return groups;
  }
}
