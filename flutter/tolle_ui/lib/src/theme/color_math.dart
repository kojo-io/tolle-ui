/// Pure colour + theme-token maths for Tolle UI.
///
/// A port of `projects/tolle/src/lib/utils/color.ts`. Like its TypeScript
/// counterpart this library is deliberately framework-free — it imports only
/// `dart:math`, never `dart:ui` or Flutter — so the derivations can be unit
/// tested in isolation and reused by a build-time theme generator.
///
/// Two deliberate divergences from the TypeScript, both marked at their call
/// sites:
///
/// 1. The CSS *emitters* (`generateThemeCss`, `generateBaseCss`,
///    `generateChartCss`) are not ported. They serialise the derivations into
///    custom-property blocks, which has no meaning here. The derivations
///    themselves — the primary ramp, the ring colour, the contrast foreground,
///    the chart ramp — are ported as data-returning functions instead.
/// 2. [hexToRgb] returns null for malformed input. The TypeScript's `parseInt`
///    yields `NaN` channels for something like `#zzzzzz`, which propagates a
///    literal "NaN NaN NaN" into the stylesheet; returning null here routes such
///    input to the documented fallback instead.
library;

import 'dart:math' as math;

/// An 8-bit-per-channel sRGB colour, framework-free.
class Rgb {
  const Rgb(this.r, this.g, this.b);

  final int r;
  final int g;
  final int b;

  /// The `#rrggbb` form.
  String get hex => '#${_hex2(r)}${_hex2(g)}${_hex2(b)}';

  static String _hex2(int v) => v.toRadixString(16).padLeft(2, '0');

  @override
  bool operator ==(Object other) =>
      other is Rgb && other.r == r && other.g == g && other.b == b;

  @override
  int get hashCode => Object.hash(r, g, b);

  @override
  String toString() => 'Rgb($r, $g, $b)';
}

/// Hue/saturation/lightness, with `h` in 0–360 and `s`/`l` in 0–100.
class Hsl {
  const Hsl(this.h, this.s, this.l);

  final double h;
  final double s;
  final double l;

  @override
  String toString() => 'Hsl($h, $s, $l)';
}

/// Perceptual lightness/chroma/hue, with `l` in 0–1 and `h` in degrees.
class Oklch {
  const Oklch(this.l, this.c, this.h);

  final double l;
  final double c;
  final double h;

  @override
  String toString() => 'Oklch($l, $c, $h)';
}

/// The library's default primary, `#2563eb` — used wherever a malformed colour
/// needs a documented fallback.
const Rgb kDefaultPrimary = Rgb(37, 99, 235);

/// Parses a `#rgb` or `#rrggbb` string, returning null if malformed.
///
/// The leading `#` is optional. Unlike the TypeScript original, a string of the
/// right length containing non-hex characters is rejected rather than producing
/// NaN channels.
Rgb? hexToRgb(String hex) {
  final c = hex.replaceAll('#', '');
  if (c.length == 3) {
    final r = int.tryParse('${c[0]}${c[0]}', radix: 16);
    final g = int.tryParse('${c[1]}${c[1]}', radix: 16);
    final b = int.tryParse('${c[2]}${c[2]}', radix: 16);
    if (r == null || g == null || b == null) return null;
    return Rgb(r, g, b);
  }
  if (c.length == 6) {
    final r = int.tryParse(c.substring(0, 2), radix: 16);
    final g = int.tryParse(c.substring(2, 4), radix: 16);
    final b = int.tryParse(c.substring(4, 6), radix: 16);
    if (r == null || g == null || b == null) return null;
    return Rgb(r, g, b);
  }
  return null;
}

/// Parses a hex colour, falling back to [fallback] when malformed.
Rgb hexToRgbOr(String hex, [Rgb fallback = kDefaultPrimary]) =>
    hexToRgb(hex) ?? fallback;

/// Black or white, whichever contrasts better against [colour].
///
/// Uses the same weighted-luminance threshold as the TypeScript so a
/// configured primary resolves to the identical foreground on both platforms.
Rgb contrastColor(Rgb colour) {
  final luminance =
      (0.299 * colour.r + 0.587 * colour.g + 0.114 * colour.b) / 255;
  return luminance > 0.5 ? const Rgb(0, 0, 0) : const Rgb(255, 255, 255);
}

/// Lightens [colour] toward white by [percent] (0–100).
Rgb lighten(Rgb colour, double percent) {
  int ch(int v) => math.min(255, (v + (255 - v) * (percent / 100)).floor());
  return Rgb(ch(colour.r), ch(colour.g), ch(colour.b));
}

/// Darkens [colour] toward black by [percent] (0–100).
Rgb darken(Rgb colour, double percent) {
  final factor = 1 - percent / 100;
  int ch(int v) => math.max(0, (v * factor).floor());
  return Rgb(ch(colour.r), ch(colour.g), ch(colour.b));
}

double _clamp(double n, double min, double max) =>
    math.min(max, math.max(min, n));

/// Converts sRGB to HSL.
Hsl rgbToHsl(Rgb colour) {
  final r = colour.r / 255;
  final g = colour.g / 255;
  final b = colour.b / 255;
  final max = math.max(r, math.max(g, b));
  final min = math.min(r, math.min(g, b));
  var h = 0.0;
  var s = 0.0;
  final l = (max + min) / 2;
  if (max != min) {
    final d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max == r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max == g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return Hsl(h * 360, s * 100, l * 100);
}

/// Converts HSL back to sRGB.
Rgb hslToRgb(double h, double s, double l) {
  h = ((h % 360) + 360) % 360 / 360;
  s = _clamp(s, 0, 100) / 100;
  l = _clamp(l, 0, 100) / 100;

  double hue2rgb(double p, double q, double t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  double r, g, b;
  if (s == 0) {
    r = g = b = l;
  } else {
    final q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    final p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return Rgb((r * 255).round(), (g * 255).round(), (b * 255).round());
}

/* -------------------------------------------------------------------------- */
/* Primary ramp                                                               */
/* -------------------------------------------------------------------------- */

/// The 50–900 primary ramp for one appearance.
///
/// This is the derivation `generateThemeCss` encoded in its `:root` and `.dark`
/// blocks, lifted out of the CSS. Dark is not a flip of light: it darkens for
/// the low steps and lightens for the high ones, so the ramp always runs from
/// "closest to the surface" to "furthest from it".
Map<int, Rgb> primaryRamp(Rgb primary, {required bool dark}) {
  if (dark) {
    return {
      50: darken(primary, 85),
      100: darken(primary, 75),
      200: darken(primary, 65),
      300: darken(primary, 55),
      400: darken(primary, 45),
      500: primary,
      600: lighten(primary, 20),
      700: lighten(primary, 35),
      800: lighten(primary, 50),
      900: lighten(primary, 65),
    };
  }
  return {
    50: lighten(primary, 90),
    100: lighten(primary, 80),
    200: lighten(primary, 60),
    300: lighten(primary, 40),
    400: lighten(primary, 20),
    500: primary,
    600: darken(primary, 20),
    700: darken(primary, 40),
    800: darken(primary, 60),
    900: darken(primary, 80),
  };
}

/// The focus-ring colour derived from a configured primary.
///
/// Matches `generateThemeCss`: a 40% lift in light, 20% in dark. Note this only
/// applies when a primary is configured — the shipped `theme.css` default sets
/// `--ring` to `--primary` directly, which [ringFor] leaves to the caller.
Rgb ringFor(Rgb primary, {required bool dark}) =>
    lighten(primary, dark ? 20 : 40);

/* -------------------------------------------------------------------------- */
/* OKLab / OKLCH                                                              */
/* -------------------------------------------------------------------------- */

/* Chart steps are placed in OKLCH, not HSL. HSL "lightness" is not perceptual:
 * HSL 71% on a yellow reads as OKLab L 0.86 while the same 71% on a blue reads
 * ~0.55, so an HSL-based ramp silently produces steps far too light to sit
 * alongside the others. Working in OKLCH lets us set perceived lightness and
 * colourfulness directly. */

double _srgbToLinear(double c) =>
    c <= 0.04045 ? c / 12.92 : math.pow((c + 0.055) / 1.055, 2.4).toDouble();

double _linearToSrgb(double c) => c <= 0.0031308
    ? 12.92 * c
    : 1.055 * math.pow(c, 1 / 2.4).toDouble() - 0.055;

/// Cube root that accepts negatives, standing in for JavaScript's `Math.cbrt`.
double _cbrt(double x) =>
    x < 0 ? -math.pow(-x, 1 / 3).toDouble() : math.pow(x, 1 / 3).toDouble();

/// sRGB to OKLCH.
Oklch rgbToOklch(Rgb colour) {
  final r = _srgbToLinear(colour.r / 255);
  final g = _srgbToLinear(colour.g / 255);
  final b = _srgbToLinear(colour.b / 255);
  final l = _cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  final m = _cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  final s = _cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  final a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  final bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return Oklch(
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    _hypot(a, bb),
    math.atan2(bb, a) * 180 / math.pi,
  );
}

double _hypot(double a, double b) => math.sqrt(a * a + b * b);

List<double> _oklchToLinearRgb(double L, double C, double hDeg) {
  final h = hDeg * math.pi / 180;
  final a = C * math.cos(h);
  final b = C * math.sin(h);
  final l0 = L + 0.3963377774 * a + 0.2158037573 * b;
  final m0 = L - 0.1055613458 * a - 0.0638541728 * b;
  final s0 = L - 0.0894841775 * a - 1.291485548 * b;
  final l = l0 * l0 * l0;
  final m = m0 * m0 * m0;
  final s = s0 * s0 * s0;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

bool _inSrgbGamut(List<double> rgb) =>
    rgb.every((c) => c >= -0.0001 && c <= 1.0001);

/// The largest chroma this lightness and hue can carry inside sRGB.
double maxChroma(double l, double h) {
  var c = 0.4;
  while (c > 0.001 && !_inSrgbGamut(_oklchToLinearRgb(l, c, h))) {
    c -= 0.004;
  }
  return c;
}

/// OKLCH to sRGB, reducing chroma to fit the gamut while holding lightness and
/// hue.
Rgb oklchToRgb(double l, double c, double h) {
  final chroma = math.min(c, maxChroma(l, h));
  final linear = _oklchToLinearRgb(l, chroma, h);
  int ch(double v) =>
      (math.min(1.0, math.max(0.0, _linearToSrgb(v))) * 255).round();
  return Rgb(ch(linear[0]), ch(linear[1]), ch(linear[2]));
}

/* -------------------------------------------------------------------------- */
/* Chart ramp                                                                 */
/* -------------------------------------------------------------------------- */

/// Perceptual lightness bands a categorical chart mark must sit inside to read
/// as a distinct series against each surface. Below the band a mark muddies
/// into the background; above it, marks wash out and stop being separable.
/// Dark's band is both lower and narrower than light's — it is not a mirror.
const _chartBandLight = (0.43, 0.77);
const _chartBandDark = (0.48, 0.67);

/// Chroma below this reads as grey rather than as a colour.
const _chartChromaFloor = 0.115;

/// Nudges lightness within the band until this hue can carry the chroma floor.
///
/// Dark yellows and teals have a narrow sRGB gamut, so a step placed too dark
/// would be clamped into a muddy near-grey.
double _snapLightness(double targetL, double h, double lo, double hi) {
  if (maxChroma(targetL, h) >= _chartChromaFloor) return targetL;
  for (var d = 0.01; d <= hi - lo; d += 0.01) {
    if (targetL + d <= hi && maxChroma(targetL + d, h) >= _chartChromaFloor) {
      return targetL + d;
    }
    if (targetL - d >= lo && maxChroma(targetL - d, h) >= _chartChromaFloor) {
      return targetL - d;
    }
  }
  // No lightness in the band clears the floor for this hue — take the most
  // colourful point available rather than the target, which would otherwise be
  // gamut-clamped into a near-grey.
  var best = targetL;
  var bestC = maxChroma(targetL, h);
  for (var l = lo; l <= hi; l += 0.01) {
    final c = maxChroma(l, h);
    if (c > bestC) {
      bestC = c;
      best = l;
    }
  }
  return best;
}

/// Derives five chart colours from one base, spreading hues widely and
/// alternating lightness so adjacent series stay separable — including under
/// red-green colour blindness, where hue alone carries almost no information
/// and the lightness difference does the work.
///
/// A palette derived from an arbitrary brand hue cannot be *guaranteed*
/// colour-blind-safe: five hues spread from one starting point will, for some
/// bases, put a confusable pair next to each other. The shipped defaults in
/// [TolleChartPalette] are a fixed, validated palette; prefer those unless
/// brand-matched charts matter more than guaranteed separation. Whatever you
/// use, keep legends and direct labels on so colour is never the only channel.
List<Rgb> chartRamp(Rgb base, {required bool dark}) {
  final o = rgbToOklch(base);
  final (lo, hi) = dark ? _chartBandDark : _chartBandLight;

  // Hue offsets spread ~72–180° apart rather than an analogous ±30° set, which
  // would leave neighbouring series only 32° apart — under protanopia those
  // collapse to ΔE 1.5, i.e. the same colour. Lightness also alternates, so
  // hues that still converge under CVD differ in luminance.
  const light = [
    (0.0, 0.55),
    (180.0, 0.72),
    (90.0, 0.46),
    (270.0, 0.68),
    (45.0, 0.6),
  ];
  const darkSteps = [
    (0.0, 0.58),
    (180.0, 0.66),
    (90.0, 0.5),
    (270.0, 0.63),
    (45.0, 0.54),
  ];

  return [
    for (final (dh, l) in dark ? darkSteps : light)
      oklchToRgb(_snapLightness(l, o.h + dh, lo, hi), 0.15, o.h + dh),
  ];
}
