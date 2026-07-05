/**
 * Pure color + theme-token math for Tolle UI.
 *
 * Framework- and DOM-free so it can back both the runtime `ThemeService` and a
 * build-time theme generator (the shadcn-style "copy this CSS block" flow), and
 * to centralize the math ahead of a future oklch migration. No side effects.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Parse a #RGB or #RRGGBB hex string to RGB, or null if malformed. */
export function hexToRgb(hex: string): Rgb | null {
  const c = hex.replace('#', '');
  if (c.length === 3) {
    return {
      r: parseInt(c[0] + c[0], 16),
      g: parseInt(c[1] + c[1], 16),
      b: parseInt(c[2] + c[2], 16),
    };
  }
  if (c.length === 6) {
    return {
      r: parseInt(c.substring(0, 2), 16),
      g: parseInt(c.substring(2, 4), 16),
      b: parseInt(c.substring(4, 6), 16),
    };
  }
  return null;
}

/** Space-separated RGB triplet for a hex color (Tailwind `<alpha-value>` form). */
export function rgbTriplet(hex: string, fallback = '37 99 235'): string {
  const rgb = hexToRgb(hex);
  return rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : fallback;
}

/** Black or white, whichever contrasts better with the given color. */
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#ffffff';
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/** Contrast color as an RGB triplet (for `--primary-foreground`). */
export function contrastTriplet(hex: string): string {
  return rgbTriplet(getContrastColor(hex), '255 255 255');
}

/** Lighten a hex color toward white by `percent` (0–100). */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * (percent / 100)));
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * (percent / 100)));
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * (percent / 100)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

/** Convert a hex color to HSL (h 0–360, s/l 0–100), or null if malformed. */
export function hexToHsl(hex: string): Hsl | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/** Convert HSL (h 0–360, s/l 0–100) to a #RRGGBB hex string. */
export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360 / 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const to = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** Darken a hex color toward black by `percent` (0–100). */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 1 - percent / 100;
  const r = Math.max(0, Math.floor(rgb.r * factor));
  const g = Math.max(0, Math.floor(rgb.g * factor));
  const b = Math.max(0, Math.floor(rgb.b * factor));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Derived radius scale from a base radius (e.g. '0.5rem'), or null if malformed. */
export function radiusScale(radius: string): Record<string, string> | null {
  const m = radius.match(/^(\d*\.?\d+)([a-z]+|%)$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const u = m[2];
  return {
    '--radius': radius,
    '--radius-sm': `${n * 0.5}${u}`,
    '--radius-md': `${n}${u}`,
    '--radius-lg': `${n * 1.5}${u}`,
    '--radius-xl': `${n * 2}${u}`,
    '--radius-2xl': `${n * 3}${u}`,
    '--radius-3xl': `${n * 4}${u}`,
    '--radius-full': '9999px',
  };
}

/** Optional typography stacks for the theme generator. */
export interface FontTokens {
  sans?: string;
  serif?: string;
  mono?: string;
}

/**
 * Generate the `:root` + `.dark` CSS custom-property block for a primary color
 * (full 50–900 ramp, contrast foreground, focus ring, and radius scale). This is
 * the theme-generator engine — identical to what `ThemeService` injects at runtime,
 * and suitable for emitting a copy-paste block a consumer can commit.
 *
 * Pass `fonts` to also emit `--font-sans` / `--font-serif` / `--font-mono` (they
 * do not vary between light and dark, so they land in `:root` only).
 */
export function generateThemeCss(primaryHex: string, radius = '0.5rem', fonts?: FontTokens): string {
  const base = rgbTriplet(primaryHex);
  const ringLight = rgbTriplet(lightenColor(primaryHex, 40), '96 165 250');
  const ringDark = rgbTriplet(lightenColor(primaryHex, 20), '147 197 253');
  const fg = contrastTriplet(primaryHex);

  const scale = radiusScale(radius);
  const radiusVars = scale
    ? Object.entries(scale)
        .map(([k, v]) => `${k}: ${v};`)
        .join('\n        ')
    : `--radius: ${radius};`;

  const fontVars = fonts
    ? [
        fonts.sans ? `--font-sans: ${fonts.sans};` : '',
        fonts.serif ? `--font-serif: ${fonts.serif};` : '',
        fonts.mono ? `--font-mono: ${fonts.mono};` : '',
      ]
        .filter(Boolean)
        .join('\n        ')
    : '';

  return `
      :root {
        --primary: ${base};
        --primary-foreground: ${fg};
        ${radiusVars}${fontVars ? '\n        ' + fontVars : ''}
        --primary-50: ${rgbTriplet(lightenColor(primaryHex, 90))};
        --primary-100: ${rgbTriplet(lightenColor(primaryHex, 80))};
        --primary-200: ${rgbTriplet(lightenColor(primaryHex, 60))};
        --primary-300: ${rgbTriplet(lightenColor(primaryHex, 40))};
        --primary-400: ${rgbTriplet(lightenColor(primaryHex, 20))};
        --primary-500: ${base};
        --primary-600: ${rgbTriplet(darkenColor(primaryHex, 20))};
        --primary-700: ${rgbTriplet(darkenColor(primaryHex, 40))};
        --primary-800: ${rgbTriplet(darkenColor(primaryHex, 60))};
        --primary-900: ${rgbTriplet(darkenColor(primaryHex, 80))};
        --ring: ${ringLight};
      }

      .dark {
        --primary: ${base};
        --primary-foreground: ${fg};
        ${radiusVars}
        --primary-50: ${rgbTriplet(darkenColor(primaryHex, 85))};
        --primary-100: ${rgbTriplet(darkenColor(primaryHex, 75))};
        --primary-200: ${rgbTriplet(darkenColor(primaryHex, 65))};
        --primary-300: ${rgbTriplet(darkenColor(primaryHex, 55))};
        --primary-400: ${rgbTriplet(darkenColor(primaryHex, 45))};
        --primary-500: ${base};
        --primary-600: ${rgbTriplet(lightenColor(primaryHex, 20))};
        --primary-700: ${rgbTriplet(lightenColor(primaryHex, 35))};
        --primary-800: ${rgbTriplet(lightenColor(primaryHex, 50))};
        --primary-900: ${rgbTriplet(lightenColor(primaryHex, 65))};
        --ring: ${ringDark};
      }
    `;
}

/* -------------------------------------------------------------------------- */
/* Base (neutral) color families                                              */
/* -------------------------------------------------------------------------- */

/** The neutral surface/foreground tokens a base color drives (one appearance). */
export interface BaseTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  secondary: string;
  secondaryForeground: string;
  border: string;
  input: string;
}

export interface BasePalette {
  light: BaseTokens;
  dark: BaseTokens;
}

/** Build a light+dark neutral palette from a Tailwind-style shade ramp. */
function neutralPalette(s: Record<50 | 100 | 200 | 400 | 500 | 800 | 900 | 950, string>): BasePalette {
  return {
    light: {
      background: '255 255 255',
      foreground: s[950],
      card: '255 255 255',
      cardForeground: s[950],
      popover: '255 255 255',
      popoverForeground: s[950],
      muted: s[100],
      mutedForeground: s[500],
      accent: s[100],
      accentForeground: s[900],
      secondary: s[100],
      secondaryForeground: s[900],
      border: s[200],
      input: s[200],
    },
    dark: {
      background: s[950],
      foreground: s[50],
      card: s[950],
      cardForeground: s[50],
      popover: s[950],
      popoverForeground: s[50],
      muted: s[800],
      mutedForeground: s[400],
      accent: s[800],
      accentForeground: s[50],
      secondary: s[800],
      secondaryForeground: s[50],
      border: s[800],
      input: s[800],
    },
  };
}

/**
 * Neutral base-color families (RGB triplets), matching Tailwind's Zinc / Slate /
 * Gray / Neutral / Stone ramps. `zinc` reproduces the library's shipped defaults.
 */
export const BASE_PALETTES: Record<string, BasePalette> = {
  zinc: neutralPalette({ 50: '250 250 250', 100: '244 244 245', 200: '228 228 231', 400: '161 161 170', 500: '113 113 122', 800: '39 39 42', 900: '24 24 27', 950: '9 9 11' }),
  slate: neutralPalette({ 50: '248 250 252', 100: '241 245 249', 200: '226 232 240', 400: '148 163 184', 500: '100 116 139', 800: '30 41 59', 900: '15 23 42', 950: '2 6 23' }),
  gray: neutralPalette({ 50: '249 250 251', 100: '243 244 246', 200: '229 231 235', 400: '156 163 175', 500: '107 114 128', 800: '31 41 55', 900: '17 24 39', 950: '3 7 18' }),
  neutral: neutralPalette({ 50: '250 250 250', 100: '245 245 245', 200: '229 229 229', 400: '163 163 163', 500: '115 115 115', 800: '38 38 38', 900: '23 23 23', 950: '10 10 10' }),
  stone: neutralPalette({ 50: '250 250 249', 100: '245 245 244', 200: '231 229 228', 400: '168 162 158', 500: '120 113 108', 800: '41 37 36', 900: '28 25 23', 950: '12 10 9' }),
};

function baseTokenBlock(t: BaseTokens): string {
  return Object.entries({
    '--background': t.background,
    '--foreground': t.foreground,
    '--card': t.card,
    '--card-foreground': t.cardForeground,
    '--popover': t.popover,
    '--popover-foreground': t.popoverForeground,
    '--muted': t.muted,
    '--muted-foreground': t.mutedForeground,
    '--accent': t.accent,
    '--accent-foreground': t.accentForeground,
    '--secondary': t.secondary,
    '--secondary-foreground': t.secondaryForeground,
    '--border': t.border,
    '--input': t.input,
  })
    .map(([k, v]) => `${k}: ${v};`)
    .join('\n        ');
}

/** Emit the `:root` + `.dark` neutral-token block for a base color id. */
export function generateBaseCss(baseId: string): string {
  const p = BASE_PALETTES[baseId] ?? BASE_PALETTES['zinc'];
  return `
      :root {
        ${baseTokenBlock(p.light)}
      }

      .dark {
        ${baseTokenBlock(p.dark)}
      }
    `;
}

/* -------------------------------------------------------------------------- */
/* Chart palette                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Derive 5 harmonious chart colors from one base hex — the base hue plus
 * analogous hues at ±30°/±60°, with paired lightness shifts for separation.
 * Returns RGB triplets for `--chart-1`…`--chart-5`.
 */
export function generateChartRamp(hex: string): string[] {
  const hsl = hexToHsl(hex) ?? { h: 220, s: 70, l: 55 };
  const defs = [
    { dh: 0, s: hsl.s, l: hsl.l },
    { dh: 32, s: hsl.s * 0.9, l: clamp(hsl.l + 8, 32, 74) },
    { dh: -28, s: hsl.s * 0.95, l: clamp(hsl.l - 8, 28, 70) },
    { dh: 64, s: hsl.s * 0.82, l: clamp(hsl.l + 15, 38, 80) },
    { dh: -58, s: hsl.s, l: clamp(hsl.l - 16, 24, 66) },
  ];
  return defs.map((d) => rgbTriplet(hslToHex(hsl.h + d.dh, clamp(d.s, 24, 92), d.l)));
}

/** Emit the `:root` + `.dark` `--chart-1…5` block for a chart base color. */
export function generateChartCss(hex: string): string {
  const ramp = generateChartRamp(hex);
  const vars = ramp.map((t, i) => `--chart-${i + 1}: ${t};`).join('\n        ');
  return `
      :root {
        ${vars}
      }

      .dark {
        ${vars}
      }
    `;
}
