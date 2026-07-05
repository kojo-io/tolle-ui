import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * A semantic icon whose rendering follows the theme generator's selected icon set.
 *
 * `remix` renders the real library glyph (`ri-*` font class). The other sets render
 * inline SVGs in that set's stroke convention — enough for the icon-set control to
 * visibly re-skin the preview. The library's own compiled components always ship
 * Remix Icons; this component only governs the preview canvas + scaffold hint.
 */

/** Inner SVG markup (24×24 viewBox) for each semantic glyph. */
const PATHS: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7.7 1.6 1.6 0 0 1-3.2 0 1.6 1.6 0 0 0-2.7-.7l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-.7-2.7 1.6 1.6 0 0 1 0-3.2 1.6 1.6 0 0 0 .7-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-.7 1.6 1.6 0 0 1 3.2 0 1.6 1.6 0 0 0 2.7.7l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  'chevron-down': '<path d="M6 9l6 6 6-6"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
  home: '<path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  dollar: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M14.8 9.4A2.4 2 0 0 0 12 8c-1.5 0-2.3.9-2.3 1.8s.7 1.5 2.3 1.9 2.3 1 2.3 2-1 1.8-2.3 1.8a2.6 2 0 0 1-2.8-1.3"/>',
  users: '<path d="M16 21v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1"/><circle cx="9" cy="7" r="3"/><path d="M22 21v-1a4 4 0 0 0-3-3.8M16 3.1a4 4 0 0 1 0 7.7"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
};

/** Remix Icon class per glyph (the library default). */
const REMIX: Record<string, string> = {
  search: 'ri-search-line',
  bell: 'ri-notification-3-line',
  calendar: 'ri-calendar-line',
  user: 'ri-user-line',
  check: 'ri-check-line',
  plus: 'ri-add-line',
  'arrow-right': 'ri-arrow-right-line',
  card: 'ri-bank-card-line',
  settings: 'ri-settings-3-line',
  sun: 'ri-sun-line',
  moon: 'ri-moon-line',
  star: 'ri-star-line',
  'chevron-down': 'ri-arrow-down-s-line',
  mail: 'ri-mail-line',
  home: 'ri-home-5-line',
  dollar: 'ri-money-dollar-circle-line',
  users: 'ri-group-line',
  activity: 'ri-pulse-line',
};

/** Stroke width per set — the honest visual difference between them. */
const STROKE: Record<string, number> = {
  lucide: 2,
  tabler: 1.75,
  phosphor: 2.75,
};

@Component({
  selector: 'app-demo-icon',
  standalone: true,
  template: `
    @if (iconSet === 'remix') {
      <i [class]="remixClass" [style.fontSize.px]="size" [style.lineHeight]="1"></i>
    } @else {
      <span class="inline-flex shrink-0" [style.width.px]="size" [style.height.px]="size" [innerHTML]="svg"></span>
    }
  `,
  host: { class: 'inline-flex items-center justify-center' },
})
export class DemoIconComponent {
  @Input() name = 'star';
  @Input() iconSet = 'remix';
  @Input() size = 18;

  constructor(private sanitizer: DomSanitizer) {}

  get remixClass(): string {
    return REMIX[this.name] ?? 'ri-square-line';
  }

  get svg(): SafeHtml {
    const sw = STROKE[this.iconSet] ?? 2;
    const body = PATHS[this.name] ?? '<rect x="4" y="4" width="16" height="16" rx="2"/>';
    const markup =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" ` +
      `fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ` +
      `style="display:block">${body}</svg>`;
    return this.sanitizer.bypassSecurityTrustHtml(markup);
  }
}
