/**
 * Captures reference output from the Angular colour maths for the Flutter port
 * to assert against.
 *
 * The Dart port in `flutter/tolle_ui/lib/src/theme/color_math.dart` must derive
 * the exact same tokens from the same config, or the two libraries render
 * different colours from one brand setting. Rather than trust a reading of the
 * source, `color_math_test.dart` diffs against the fixture this writes.
 *
 * Run: npm run generate:flutter-color-reference
 */
import {
  hexToRgb,
  getContrastColor,
  lightenColor,
  darkenColor,
  hexToHsl,
  hslToHex,
  generateChartRamp,
  rgbTriplet,
} from '../projects/tolle/src/lib/utils/color';
import * as fs from 'fs';
import * as path from 'path';

const OUT = path.resolve(
  __dirname,
  '../flutter/tolle_ui/test/fixtures/color_reference.json'
);

/**
 * Chosen to exercise the branches, not just the happy path: the shipped default
 * and the README brand colour, the semantic hues, two narrow-gamut colours that
 * force `snapLightness` to move a chart step, and the achromatic extremes.
 */
const SAMPLES = [
  '#2563eb', // library default primary
  '#551a65', // README brand example
  '#ef4444',
  '#16a34a',
  '#facc15', // narrow-gamut yellow — exercises snapLightness
  '#14b8a6', // teal, likewise
  '#000000',
  '#ffffff',
  '#8b5cf6',
  '#ec4899',
  '#0a0a0a',
  '#f4f4f5',
];

/** Every percentage the primary ramp and ring derivation actually use. */
const LIGHTEN_STEPS = [20, 35, 40, 50, 60, 65, 80, 90];
const DARKEN_STEPS = [20, 40, 45, 55, 60, 65, 75, 80, 85];

const out: Record<string, any> = { samples: {}, chart: {}, hsl: {} };

for (const hex of SAMPLES) {
  const rgb = hexToRgb(hex)!;
  out.samples[hex] = {
    rgb: [rgb.r, rgb.g, rgb.b],
    contrast: getContrastColor(hex),
    lighten: Object.fromEntries(LIGHTEN_STEPS.map((p) => [p, lightenColor(hex, p)])),
    darken: Object.fromEntries(DARKEN_STEPS.map((p) => [p, darkenColor(hex, p)])),
  };

  const hsl = hexToHsl(hex)!;
  out.hsl[hex] = { hsl: [hsl.h, hsl.s, hsl.l], roundTrip: hslToHex(hsl.h, hsl.s, hsl.l) };

  out.chart[hex] = {
    light: generateChartRamp(hex, 'light'),
    dark: generateChartRamp(hex, 'dark'),
  };
}

/**
 * Pinned so the divergence stays visible: `rgbTriplet('#nothex')` returns
 * "NaN NaN 14" because `parseInt` gives up mid-string. The Dart port rejects
 * malformed hex outright and falls back — see the note in color_math.dart.
 */
out.malformed = {
  tooShort: hexToRgb('#12'),
  triplet: rgbTriplet('#nothex'),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${SAMPLES.length} samples)`);
