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

/**
 * Generate the `:root` + `.dark` CSS custom-property block for a primary color
 * (full 50–900 ramp, contrast foreground, focus ring, and radius scale). This is
 * the theme-generator engine — identical to what `ThemeService` injects at runtime,
 * and suitable for emitting a copy-paste block a consumer can commit.
 */
export function generateThemeCss(primaryHex: string, radius = '0.5rem'): string {
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

  return `
      :root {
        --primary: ${base};
        --primary-foreground: ${fg};
        ${radiusVars}
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
