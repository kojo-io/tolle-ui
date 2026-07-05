/**
 * Data + codecs for the Tolle theme generator (the shadcn `/create`-style page).
 *
 * The design system themes three things at runtime — primary color, radius, and
 * typography — plus the light/dark appearance. Icon set is a preview/scaffold hint
 * (the library's own glyphs ship as Remix Icons). Everything a user configures is
 * captured in a `ThemePreset` and round-trips through a compact `?preset=` URL.
 */

export interface ColorPreset {
  name: string;
  hex: string;
}

export interface RadiusPreset {
  label: string;
  value: string;
}

export interface FontOption {
  label: string;
  stack: string;
}

export interface IconSet {
  id: string;
  label: string;
  hint: string;
}

export interface BaseColor {
  id: string;
  name: string;
  /** Representative swatch (the family's 500 shade). */
  swatch: string;
}

export interface ThemePreset {
  /** Neutral base-color family id (see BASE_COLORS). */
  base: string;
  /** Theme/accent color as a #RRGGBB hex (the `--primary`). */
  primary: string;
  /** Chart base color as a #RRGGBB hex (derives `--chart-1…5`). */
  chart: string;
  /** Base radius, e.g. `0.5rem`. */
  radius: string;
  appearance: 'light' | 'dark';
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  /** Icon-set id (see ICON_SETS). Skins the preview + is recorded in the scaffold. */
  icons: string;
}

/* -------------------------------------------------------------------------- */
/* Option catalogs                                                            */
/* -------------------------------------------------------------------------- */

/** Accent/primary colors. Our tokens theme `--primary`; neutrals stay fixed. */
export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Sky', hex: '#0284c7' },
  { name: 'Cyan', hex: '#0891b2' },
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Lime', hex: '#65a30d' },
  { name: 'Yellow', hex: '#ca8a04' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Pink', hex: '#db2777' },
  { name: 'Fuchsia', hex: '#c026d3' },
  { name: 'Purple', hex: '#9333ea' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Slate', hex: '#475569' },
  { name: 'Zinc', hex: '#52525b' },
  { name: 'Stone', hex: '#57534e' },
];

export const RADIUS_PRESETS: RadiusPreset[] = [
  { label: '0', value: '0rem' },
  { label: '0.25', value: '0.25rem' },
  { label: '0.5', value: '0.5rem' },
  { label: '0.75', value: '0.75rem' },
  { label: '1.0', value: '1rem' },
];

export const FONT_SANS: FontOption[] = [
  { label: 'System', stack: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { label: 'Inter', stack: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  { label: 'Helvetica', stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { label: 'Verdana', stack: 'Verdana, Geneva, Tahoma, sans-serif' },
  { label: 'Trebuchet', stack: '"Trebuchet MS", "Segoe UI", Tahoma, sans-serif' },
];

export const FONT_SERIF: FontOption[] = [
  { label: 'Georgia', stack: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  { label: 'Times', stack: '"Times New Roman", Times, serif' },
  { label: 'Cambria', stack: 'Cambria, Georgia, "Times New Roman", serif' },
  { label: 'Palatino', stack: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
];

export const FONT_MONO: FontOption[] = [
  { label: 'System Mono', stack: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace' },
  { label: 'Menlo', stack: 'Menlo, Consolas, "Liberation Mono", monospace' },
  { label: 'Consolas', stack: 'Consolas, "Lucida Console", Monaco, monospace' },
  { label: 'Courier', stack: '"Courier New", Courier, monospace' },
];

export const ICON_SETS: IconSet[] = [
  { id: 'remix', label: 'Remix', hint: 'Library default' },
  { id: 'lucide', label: 'Lucide', hint: 'Outline · round' },
  { id: 'tabler', label: 'Tabler', hint: 'Outline · square' },
  { id: 'phosphor', label: 'Phosphor', hint: 'Bold · filled' },
];

/** Neutral base-color families (drive background/foreground/muted/border…). */
export const BASE_COLORS: BaseColor[] = [
  { id: 'zinc', name: 'Zinc', swatch: '#71717a' },
  { id: 'slate', name: 'Slate', swatch: '#64748b' },
  { id: 'gray', name: 'Gray', swatch: '#6b7280' },
  { id: 'neutral', name: 'Neutral', swatch: '#737373' },
  { id: 'stone', name: 'Stone', swatch: '#78716c' },
];

/* -------------------------------------------------------------------------- */
/* Presets                                                                    */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PRESET: ThemePreset = {
  base: 'zinc',
  primary: '#2563eb',
  chart: '#2563eb',
  radius: '0.5rem',
  appearance: 'light',
  fontSans: FONT_SANS[0].stack,
  fontSerif: FONT_SERIF[0].stack,
  fontMono: FONT_MONO[0].stack,
  icons: 'remix',
};

export interface NamedPreset {
  id: string;
  name: string;
  swatch: string;
  preset: ThemePreset;
}

/** Curated starter themes surfaced in the preset dropdown. */
export const NAMED_PRESETS: NamedPreset[] = [
  {
    id: 'tolle',
    name: 'Tolle Blue',
    swatch: '#2563eb',
    preset: { ...DEFAULT_PRESET },
  },
  {
    id: 'violet',
    name: 'Violet Dusk',
    swatch: '#7c3aed',
    preset: { ...DEFAULT_PRESET, base: 'zinc', primary: '#7c3aed', chart: '#7c3aed', radius: '0.75rem', icons: 'lucide' },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    swatch: '#059669',
    preset: { ...DEFAULT_PRESET, base: 'gray', primary: '#059669', chart: '#10b981', radius: '0.5rem', icons: 'tabler' },
  },
  {
    id: 'rose',
    name: 'Rosé',
    swatch: '#e11d48',
    preset: { ...DEFAULT_PRESET, base: 'stone', primary: '#e11d48', chart: '#f43f5e', radius: '1rem', fontSans: FONT_SANS[1].stack, icons: 'phosphor' },
  },
  {
    id: 'amber',
    name: 'Amber Sand',
    swatch: '#d97706',
    preset: { ...DEFAULT_PRESET, base: 'stone', primary: '#d97706', chart: '#f59e0b', radius: '0.25rem', icons: 'lucide' },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    swatch: '#06b6d4',
    preset: { ...DEFAULT_PRESET, base: 'slate', primary: '#06b6d4', chart: '#22d3ee', radius: '0rem', appearance: 'dark', fontMono: FONT_MONO[1].stack, icons: 'tabler' },
  },
  {
    id: 'graphite',
    name: 'Graphite',
    swatch: '#475569',
    preset: { ...DEFAULT_PRESET, base: 'slate', primary: '#475569', chart: '#64748b', radius: '0.5rem', icons: 'remix' },
  },
];

/* -------------------------------------------------------------------------- */
/* ?preset= codec  (compact, shareable, agent-friendly)                       */
/* -------------------------------------------------------------------------- */

function labelForStack(list: FontOption[], stack: string): string {
  return list.find((f) => f.stack === stack)?.label ?? list[0].label;
}

function stackForLabel(list: FontOption[], label: string | undefined): string | null {
  if (!label) return null;
  return list.find((f) => f.label === label)?.stack ?? null;
}

function base64UrlEncode(input: string): string {
  if (typeof btoa === 'undefined') return '';
  const bytes = new TextEncoder().encode(input);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(code: string): string {
  if (typeof atob === 'undefined') return '';
  const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function normalizeHex(value: string | undefined, fallback: string): string {
  const hex = (value || '').replace(/[^0-9a-fA-F]/g, '');
  return hex.length === 6 || hex.length === 3 ? '#' + hex : fallback;
}

/** Encode a preset into an opaque, URL-safe token for `?preset=`. */
export function encodePreset(p: ThemePreset): string {
  const compact = {
    b: p.base,
    p: p.primary.replace('#', ''),
    c: p.chart.replace('#', ''),
    r: p.radius,
    a: p.appearance === 'dark' ? 'd' : 'l',
    fs: labelForStack(FONT_SANS, p.fontSans),
    fr: labelForStack(FONT_SERIF, p.fontSerif),
    fm: labelForStack(FONT_MONO, p.fontMono),
    i: p.icons,
  };
  return base64UrlEncode(JSON.stringify(compact));
}

/** Decode a `?preset=` token, falling back to defaults for any missing field. */
export function decodePreset(code: string): ThemePreset | null {
  try {
    const raw = base64UrlDecode(code);
    if (!raw) return null;
    const c = JSON.parse(raw) as Record<string, string>;
    return {
      base: BASE_COLORS.some((b) => b.id === c['b']) ? c['b'] : DEFAULT_PRESET.base,
      primary: normalizeHex(c['p'], DEFAULT_PRESET.primary),
      chart: normalizeHex(c['c'], DEFAULT_PRESET.chart),
      radius: c['r'] || DEFAULT_PRESET.radius,
      appearance: c['a'] === 'd' ? 'dark' : 'light',
      fontSans: stackForLabel(FONT_SANS, c['fs']) ?? DEFAULT_PRESET.fontSans,
      fontSerif: stackForLabel(FONT_SERIF, c['fr']) ?? DEFAULT_PRESET.fontSerif,
      fontMono: stackForLabel(FONT_MONO, c['fm']) ?? DEFAULT_PRESET.fontMono,
      icons: ICON_SETS.some((s) => s.id === c['i']) ? c['i'] : 'remix',
    };
  } catch {
    return null;
  }
}
