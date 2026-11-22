/// Neutral base-colour families.
///
/// A port of the `BASE_PALETTES` section of
/// `projects/tolle/src/lib/utils/color.ts`. Framework-free, like [color_math].
library;

import 'color_math.dart';

/// The neutral surface and foreground tokens a base colour drives, for one
/// appearance.
class BaseTokens {
  const BaseTokens({
    required this.background,
    required this.foreground,
    required this.card,
    required this.cardForeground,
    required this.popover,
    required this.popoverForeground,
    required this.muted,
    required this.mutedForeground,
    required this.accent,
    required this.accentForeground,
    required this.secondary,
    required this.secondaryForeground,
    required this.border,
    required this.input,
  });

  final Rgb background;
  final Rgb foreground;
  final Rgb card;
  final Rgb cardForeground;
  final Rgb popover;
  final Rgb popoverForeground;
  final Rgb muted;
  final Rgb mutedForeground;
  final Rgb accent;
  final Rgb accentForeground;
  final Rgb secondary;
  final Rgb secondaryForeground;
  final Rgb border;
  final Rgb input;
}

/// A light and dark pair of [BaseTokens].
class BasePalette {
  const BasePalette({required this.light, required this.dark});

  final BaseTokens light;
  final BaseTokens dark;

  BaseTokens forBrightness({required bool dark}) => dark ? this.dark : light;
}

/// One shade of a Tailwind-style neutral ramp.
typedef _Ramp = Map<int, Rgb>;

/// Builds a light+dark neutral palette from a Tailwind-style shade ramp.
BasePalette _neutralPalette(_Ramp s) => BasePalette(
  light: BaseTokens(
    background: const Rgb(255, 255, 255),
    foreground: s[950]!,
    card: const Rgb(255, 255, 255),
    cardForeground: s[950]!,
    popover: const Rgb(255, 255, 255),
    popoverForeground: s[950]!,
    muted: s[100]!,
    mutedForeground: s[500]!,
    accent: s[100]!,
    accentForeground: s[900]!,
    secondary: s[100]!,
    secondaryForeground: s[900]!,
    border: s[200]!,
    input: s[200]!,
  ),
  dark: BaseTokens(
    background: s[950]!,
    foreground: s[50]!,
    card: s[950]!,
    cardForeground: s[50]!,
    popover: s[950]!,
    popoverForeground: s[50]!,
    muted: s[800]!,
    mutedForeground: s[400]!,
    accent: s[800]!,
    accentForeground: s[50]!,
    secondary: s[800]!,
    secondaryForeground: s[50]!,
    border: s[800]!,
    input: s[800]!,
  ),
);

/// The neutral base-colour families, matching Tailwind's Zinc, Slate, Gray,
/// Neutral and Stone ramps. `zinc` reproduces the library's shipped defaults.
final Map<String, BasePalette> kBasePalettes = {
  'zinc': _neutralPalette({
    50: const Rgb(250, 250, 250),
    100: const Rgb(244, 244, 245),
    200: const Rgb(228, 228, 231),
    400: const Rgb(161, 161, 170),
    500: const Rgb(113, 113, 122),
    800: const Rgb(39, 39, 42),
    900: const Rgb(24, 24, 27),
    950: const Rgb(9, 9, 11),
  }),
  'slate': _neutralPalette({
    50: const Rgb(248, 250, 252),
    100: const Rgb(241, 245, 249),
    200: const Rgb(226, 232, 240),
    400: const Rgb(148, 163, 184),
    500: const Rgb(100, 116, 139),
    800: const Rgb(30, 41, 59),
    900: const Rgb(15, 23, 42),
    950: const Rgb(2, 6, 23),
  }),
  'gray': _neutralPalette({
    50: const Rgb(249, 250, 251),
    100: const Rgb(243, 244, 246),
    200: const Rgb(229, 231, 235),
    400: const Rgb(156, 163, 175),
    500: const Rgb(107, 114, 128),
    800: const Rgb(31, 41, 55),
    900: const Rgb(17, 24, 39),
    950: const Rgb(3, 7, 18),
  }),
  'neutral': _neutralPalette({
    50: const Rgb(250, 250, 250),
    100: const Rgb(245, 245, 245),
    200: const Rgb(229, 229, 229),
    400: const Rgb(163, 163, 163),
    500: const Rgb(115, 115, 115),
    800: const Rgb(38, 38, 38),
    900: const Rgb(23, 23, 23),
    950: const Rgb(10, 10, 10),
  }),
  'stone': _neutralPalette({
    50: const Rgb(250, 250, 249),
    100: const Rgb(245, 245, 244),
    200: const Rgb(231, 229, 228),
    400: const Rgb(168, 162, 158),
    500: const Rgb(120, 113, 108),
    800: const Rgb(41, 37, 36),
    900: const Rgb(28, 25, 23),
    950: const Rgb(12, 10, 9),
  }),
};

/// The default neutral family, matching the shipped `theme.css`.
const String kDefaultBaseColor = 'zinc';

/// Looks up a base palette by family id, falling back to [kDefaultBaseColor].
BasePalette basePalette(String? id) =>
    kBasePalettes[id] ?? kBasePalettes[kDefaultBaseColor]!;
