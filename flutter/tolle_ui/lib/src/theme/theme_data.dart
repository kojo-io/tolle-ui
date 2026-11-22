/// Config-first theming: one brand setting resolves the whole token set.
///
/// This is the Flutter counterpart of `provideTolleConfig` plus the derivation
/// half of `ThemeService`. The resolution order below mirrors
/// `ThemeService.initializeTheme` exactly, so the same [TolleConfig] produces
/// the same tokens on both platforms.
library;

// `ThemeExtension` is defined in the Material layer, so interoperating with
// `ThemeData.extensions` costs this one import. Nothing else here needs
// Material, and apps built on `WidgetsApp` never reach the extension path.
import 'package:flutter/material.dart' show ThemeExtension;
import 'package:flutter/widgets.dart';

import 'base_palettes.dart';
import 'component_themes.dart';
import 'color_math.dart';
import 'tokens.dart';

/// Brand settings for a Tolle app — the Flutter form of `TolleConfig`.
///
/// Every field is optional; an empty config yields the shipped defaults from
/// `theme.css`. Two fields differ in type from the Angular interface:
///
/// * [radius] is logical pixels rather than a CSS length string. There is no
///   `rem` in Flutter, and parsing `'0.75rem'` only to multiply by 16 would
///   import a unit system the framework does not have. 8.0 is the 0.5rem default.
/// * The font fields take a [TolleFontStack] rather than a CSS stack string,
///   because Flutter splits family from fallback chain.
@immutable
class TolleConfig {
  const TolleConfig({
    this.primaryColor,
    this.radius = 8.0,
    this.defaultToastDuration = const Duration(seconds: 4),
    this.darkByDefault,
    this.baseColor,
    this.chartColor,
    this.fontSans,
    this.fontSerif,
    this.fontMono,
  });

  /// Brand primary as a hex string, e.g. `'#551a65'`. Drives the primary ramp,
  /// the contrast foreground and the focus ring.
  final String? primaryColor;

  /// Global corner radius in logical pixels. See [TolleRadii] for the scale.
  final double radius;

  /// How long a toast stays up when the caller does not say.
  final Duration defaultToastDuration;

  /// Initial appearance when the user has expressed no preference. Null defers
  /// to the platform setting.
  final bool? darkByDefault;

  /// Neutral family id: `zinc` | `slate` | `gray` | `neutral` | `stone`.
  final String? baseColor;

  /// Chart base colour as hex; derives the five categorical chart colours.
  final String? chartColor;

  final TolleFontStack? fontSans;
  final TolleFontStack? fontSerif;
  final TolleFontStack? fontMono;

  TolleConfig copyWith({
    String? primaryColor,
    double? radius,
    Duration? defaultToastDuration,
    bool? darkByDefault,
    String? baseColor,
    String? chartColor,
    TolleFontStack? fontSans,
    TolleFontStack? fontSerif,
    TolleFontStack? fontMono,
  }) => TolleConfig(
    primaryColor: primaryColor ?? this.primaryColor,
    radius: radius ?? this.radius,
    defaultToastDuration: defaultToastDuration ?? this.defaultToastDuration,
    darkByDefault: darkByDefault ?? this.darkByDefault,
    baseColor: baseColor ?? this.baseColor,
    chartColor: chartColor ?? this.chartColor,
    fontSans: fontSans ?? this.fontSans,
    fontSerif: fontSerif ?? this.fontSerif,
    fontMono: fontMono ?? this.fontMono,
  );
}

/// The resolved token set for one appearance.
///
/// Extends [ThemeExtension] so it can either ride along inside a Material
/// `ThemeData.extensions` or stand alone under a `TolleTheme` — the library
/// does not require `MaterialApp`.
@immutable
class TolleThemeData extends ThemeExtension<TolleThemeData> {
  const TolleThemeData({
    required this.brightness,
    required this.colors,
    required this.radii,
    required this.typography,
    required this.shadows,
    required this.motion,
    required this.config,
    this.components = const TolleComponentThemes(),
  });

  final Brightness brightness;
  final TolleColors colors;
  final TolleRadii radii;
  final TolleTypographyTokens typography;
  final TolleShadows shadows;
  final TolleMotion motion;
  final TolleConfig config;

  /// App-wide component style overrides, applied between the variant defaults
  /// and any per-instance `style:`.
  final TolleComponentThemes components;

  bool get isDark => brightness == Brightness.dark;

  /// Resolves a config into tokens for one appearance.
  ///
  /// Order matches `ThemeService.initializeTheme`: start from the stylesheet
  /// defaults, swap the neutral family if one is configured, then apply the
  /// primary derivation, then the chart derivation. Each step only touches the
  /// tokens its Angular counterpart touches — notably, setting a base colour
  /// never disturbs the primary, and setting a primary never disturbs the
  /// neutrals.
  factory TolleThemeData.resolve({
    TolleConfig config = const TolleConfig(),
    required Brightness brightness,
    TolleComponentThemes components = const TolleComponentThemes(),
  }) {
    final dark = brightness == Brightness.dark;
    var colors = dark ? TolleColors.dark() : TolleColors.light();

    if (config.baseColor != null) {
      final tokens = basePalette(config.baseColor).forBrightness(dark: dark);
      colors = colors.copyWith(
        background: rgbToColor(tokens.background),
        foreground: rgbToColor(tokens.foreground),
        card: rgbToColor(tokens.card),
        cardForeground: rgbToColor(tokens.cardForeground),
        popover: rgbToColor(tokens.popover),
        popoverForeground: rgbToColor(tokens.popoverForeground),
        muted: rgbToColor(tokens.muted),
        mutedForeground: rgbToColor(tokens.mutedForeground),
        accent: rgbToColor(tokens.accent),
        accentForeground: rgbToColor(tokens.accentForeground),
        secondary: rgbToColor(tokens.secondary),
        secondaryForeground: rgbToColor(tokens.secondaryForeground),
        border: rgbToColor(tokens.border),
        input: rgbToColor(tokens.input),
      );
    }

    if (config.primaryColor != null) {
      final primary = hexToRgb(config.primaryColor!);
      if (primary != null) {
        colors = colors.copyWith(
          primary: rgbToColor(primary),
          primaryForeground: rgbToColor(contrastColor(primary)),
          ring: rgbToColor(ringFor(primary, dark: dark)),
          primaryShades: primaryRamp(
            primary,
            dark: dark,
          ).map((step, rgb) => MapEntry(step, rgbToColor(rgb))),
        );
      }
    }

    if (config.chartColor != null) {
      final base = hexToRgb(config.chartColor!);
      if (base != null) {
        colors = colors.copyWith(
          chart: chartRamp(base, dark: dark).map(rgbToColor).toList(),
        );
      }
    }

    return TolleThemeData(
      brightness: brightness,
      colors: colors,
      radii: TolleRadii(base: config.radius),
      typography: TolleTypographyTokens(
        sans: config.fontSans ?? const TolleFontStack(),
        serif: config.fontSerif ?? const TolleFontStack(),
        mono: config.fontMono ?? const TolleFontStack(),
      ),
      shadows: dark ? TolleShadows.dark() : TolleShadows.light(),
      motion: const TolleMotion(),
      config: config,
      components: components,
    );
  }

  /// The shipped light theme with no config applied.
  factory TolleThemeData.light() =>
      TolleThemeData.resolve(brightness: Brightness.light);

  /// The shipped dark theme with no config applied.
  factory TolleThemeData.dark() =>
      TolleThemeData.resolve(brightness: Brightness.dark);

  /// The default text style for content under this theme — the sans stack at
  /// the base size, in the foreground colour.
  TextStyle get defaultTextStyle => typography.scale.base.copyWith(
    color: colors.foreground,
    fontFamily: typography.sans.family,
    fontFamilyFallback: typography.sans.fallback,
  );

  @override
  TolleThemeData copyWith({
    Brightness? brightness,
    TolleColors? colors,
    TolleRadii? radii,
    TolleTypographyTokens? typography,
    TolleShadows? shadows,
    TolleMotion? motion,
    TolleConfig? config,
    TolleComponentThemes? components,
  }) => TolleThemeData(
    brightness: brightness ?? this.brightness,
    colors: colors ?? this.colors,
    radii: radii ?? this.radii,
    typography: typography ?? this.typography,
    shadows: shadows ?? this.shadows,
    motion: motion ?? this.motion,
    config: config ?? this.config,
  );

  @override
  TolleThemeData lerp(covariant TolleThemeData? other, double t) {
    if (other == null) return this;
    return TolleThemeData(
      // Brightness, typography and shadows are discrete: interpolating them
      // produces states that are not a theme. They snap at the midpoint so a
      // cross-fade never renders a half-resolved appearance.
      brightness: t < 0.5 ? brightness : other.brightness,
      colors: TolleColors.lerp(colors, other.colors, t),
      radii: TolleRadii.lerp(radii, other.radii, t),
      typography: t < 0.5 ? typography : other.typography,
      shadows: t < 0.5 ? shadows : other.shadows,
      motion: t < 0.5 ? motion : other.motion,
      config: t < 0.5 ? config : other.config,
      components: TolleComponentThemes.lerp(components, other.components, t),
    );
  }
}
