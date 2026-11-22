/// The Tolle design tokens, mirroring the custom properties in
/// `projects/tolle/theme.css` one for one.
///
/// Token *names* are the contract shared with the Angular library: a value
/// named `mutedForeground` here must resolve to whatever `--muted-foreground`
/// resolves to there, for the same config. Where the web build's rendered
/// output and its stated intent disagree, the divergence is documented at the
/// token rather than silently reconciled.
library;

import 'package:flutter/widgets.dart';

import 'color_math.dart';

/// Converts a framework-free [Rgb] to a Flutter [Color].
Color rgbToColor(Rgb c) => Color.fromARGB(255, c.r, c.g, c.b);

/* -------------------------------------------------------------------------- */
/* Colours                                                                     */
/* -------------------------------------------------------------------------- */

/// The full colour token set for one appearance.
@immutable
class TolleColors {
  const TolleColors({
    required this.background,
    required this.foreground,
    required this.card,
    required this.cardForeground,
    required this.popover,
    required this.popoverForeground,
    required this.primary,
    required this.primaryForeground,
    required this.secondary,
    required this.secondaryForeground,
    required this.muted,
    required this.mutedForeground,
    required this.accent,
    required this.accentForeground,
    required this.destructive,
    required this.destructiveForeground,
    required this.success,
    required this.successForeground,
    required this.warning,
    required this.warningForeground,
    required this.info,
    required this.infoForeground,
    required this.border,
    required this.input,
    required this.ring,
    required this.primaryShades,
    required this.chart,
  });

  final Color background;
  final Color foreground;
  final Color card;
  final Color cardForeground;
  final Color popover;
  final Color popoverForeground;
  final Color primary;
  final Color primaryForeground;
  final Color secondary;
  final Color secondaryForeground;
  final Color muted;
  final Color mutedForeground;
  final Color accent;
  final Color accentForeground;
  final Color destructive;
  final Color destructiveForeground;
  final Color success;
  final Color successForeground;
  final Color warning;
  final Color warningForeground;
  final Color info;
  final Color infoForeground;

  /// Default border colour for any bordered surface.
  final Color border;

  /// Border colour for form controls specifically.
  final Color input;

  /// Focus-ring colour. Equal to [primary] unless a primary is configured, in
  /// which case it is a lightened derivation — see [ringFor].
  final Color ring;

  /// The 50–900 primary ramp, `--primary-50` … `--primary-900`.
  final Map<int, Color> primaryShades;

  /// The five categorical chart colours, `--chart-1` … `--chart-5`.
  final List<Color> chart;

  /// The shipped light defaults, taken literally from `theme.css`.
  ///
  /// These are *close to* but not identical with the `zinc` base palette: the
  /// stylesheet's light foreground is `10 10 10` (Tailwind neutral-950) while
  /// `zinc-950` is `9 9 11`. The Angular runtime only swaps in a base palette
  /// when `baseColor` is configured, so the untouched default must reproduce
  /// the stylesheet, not the ramp.
  factory TolleColors.light() => TolleColors(
    background: const Color(0xFFFFFFFF),
    foreground: const Color(0xFF0A0A0A),
    card: const Color(0xFFFFFFFF),
    cardForeground: const Color(0xFF0A0A0A),
    popover: const Color(0xFFFFFFFF),
    popoverForeground: const Color(0xFF0A0A0A),
    primary: const Color(0xFF2563EB),
    primaryForeground: const Color(0xFFFFFFFF),
    secondary: const Color(0xFFF4F4F5),
    secondaryForeground: const Color(0xFF18181B),
    muted: const Color(0xFFF4F4F5),
    mutedForeground: const Color(0xFF71717A),
    accent: const Color(0xFFF4F4F5),
    accentForeground: const Color(0xFF18181B),
    destructive: const Color(0xFFEF4444),
    destructiveForeground: const Color(0xFFFAFAFA),
    success: const Color(0xFF16A34A),
    successForeground: const Color(0xFFFFFFFF),
    warning: const Color(0xFFD97706),
    warningForeground: const Color(0xFFFFFFFF),
    info: const Color(0xFF2563EB),
    infoForeground: const Color(0xFFFFFFFF),
    border: const Color(0xFFE4E4E7),
    input: const Color(0xFFE4E4E7),
    // theme.css sets `--ring: var(--primary)`; it only becomes a derived
    // lift once a primary is configured.
    ring: const Color(0xFF2563EB),
    primaryShades: _shadesOf(const Rgb(37, 99, 235), dark: false),
    chart: const [
      Color(0xFF2563EB),
      Color(0xFF14B8A6),
      Color(0xFFEA580C),
      Color(0xFF8B5CF6),
      Color(0xFFEC4899),
    ],
  );

  /// The shipped dark defaults, taken literally from `theme.css`.
  factory TolleColors.dark() => TolleColors(
    background: const Color(0xFF09090B),
    foreground: const Color(0xFFFAFAFA),
    card: const Color(0xFF09090B),
    cardForeground: const Color(0xFFFAFAFA),
    popover: const Color(0xFF09090B),
    popoverForeground: const Color(0xFFFAFAFA),
    primary: const Color(0xFF3B82F6),
    primaryForeground: const Color(0xFFFAFAFA),
    secondary: const Color(0xFF27272A),
    secondaryForeground: const Color(0xFFFAFAFA),
    muted: const Color(0xFF27272A),
    mutedForeground: const Color(0xFFA1A1AA),
    accent: const Color(0xFF27272A),
    accentForeground: const Color(0xFFFAFAFA),
    destructive: const Color(0xFF7F1D1D),
    destructiveForeground: const Color(0xFFFEF2F2),
    success: const Color(0xFF4ADE80),
    successForeground: const Color(0xFF052E16),
    warning: const Color(0xFFFBBF24),
    warningForeground: const Color(0xFF422006),
    info: const Color(0xFF60A5FA),
    infoForeground: const Color(0xFF172554),
    border: const Color(0xFF27272A),
    input: const Color(0xFF27272A),
    ring: const Color(0xFF3B82F6),
    primaryShades: _shadesOf(const Rgb(59, 130, 246), dark: true),
    // Dark chart steps are selected, not a lightened flip of the light
    // ones: the Tailwind-400 steps sit at OKLCH L 0.71–0.79, too bright to
    // read as distinct marks on a dark surface. These keep each series' hue
    // so it holds its identity across themes, re-stepped into the dark band.
    chart: const [
      Color(0xFF558CFF),
      Color(0xFF0EA998),
      Color(0xFFEB6124),
      Color(0xFF9973FE),
      Color(0xFFEA4F9A),
    ],
  );

  static Map<int, Color> _shadesOf(Rgb primary, {required bool dark}) =>
      primaryRamp(
        primary,
        dark: dark,
      ).map((step, rgb) => MapEntry(step, rgbToColor(rgb)));

  TolleColors copyWith({
    Color? background,
    Color? foreground,
    Color? card,
    Color? cardForeground,
    Color? popover,
    Color? popoverForeground,
    Color? primary,
    Color? primaryForeground,
    Color? secondary,
    Color? secondaryForeground,
    Color? muted,
    Color? mutedForeground,
    Color? accent,
    Color? accentForeground,
    Color? destructive,
    Color? destructiveForeground,
    Color? success,
    Color? successForeground,
    Color? warning,
    Color? warningForeground,
    Color? info,
    Color? infoForeground,
    Color? border,
    Color? input,
    Color? ring,
    Map<int, Color>? primaryShades,
    List<Color>? chart,
  }) {
    return TolleColors(
      background: background ?? this.background,
      foreground: foreground ?? this.foreground,
      card: card ?? this.card,
      cardForeground: cardForeground ?? this.cardForeground,
      popover: popover ?? this.popover,
      popoverForeground: popoverForeground ?? this.popoverForeground,
      primary: primary ?? this.primary,
      primaryForeground: primaryForeground ?? this.primaryForeground,
      secondary: secondary ?? this.secondary,
      secondaryForeground: secondaryForeground ?? this.secondaryForeground,
      muted: muted ?? this.muted,
      mutedForeground: mutedForeground ?? this.mutedForeground,
      accent: accent ?? this.accent,
      accentForeground: accentForeground ?? this.accentForeground,
      destructive: destructive ?? this.destructive,
      destructiveForeground:
          destructiveForeground ?? this.destructiveForeground,
      success: success ?? this.success,
      successForeground: successForeground ?? this.successForeground,
      warning: warning ?? this.warning,
      warningForeground: warningForeground ?? this.warningForeground,
      info: info ?? this.info,
      infoForeground: infoForeground ?? this.infoForeground,
      border: border ?? this.border,
      input: input ?? this.input,
      ring: ring ?? this.ring,
      primaryShades: primaryShades ?? this.primaryShades,
      chart: chart ?? this.chart,
    );
  }

  static TolleColors lerp(TolleColors a, TolleColors b, double t) {
    Color c(Color x, Color y) => Color.lerp(x, y, t)!;
    return TolleColors(
      background: c(a.background, b.background),
      foreground: c(a.foreground, b.foreground),
      card: c(a.card, b.card),
      cardForeground: c(a.cardForeground, b.cardForeground),
      popover: c(a.popover, b.popover),
      popoverForeground: c(a.popoverForeground, b.popoverForeground),
      primary: c(a.primary, b.primary),
      primaryForeground: c(a.primaryForeground, b.primaryForeground),
      secondary: c(a.secondary, b.secondary),
      secondaryForeground: c(a.secondaryForeground, b.secondaryForeground),
      muted: c(a.muted, b.muted),
      mutedForeground: c(a.mutedForeground, b.mutedForeground),
      accent: c(a.accent, b.accent),
      accentForeground: c(a.accentForeground, b.accentForeground),
      destructive: c(a.destructive, b.destructive),
      destructiveForeground: c(
        a.destructiveForeground,
        b.destructiveForeground,
      ),
      success: c(a.success, b.success),
      successForeground: c(a.successForeground, b.successForeground),
      warning: c(a.warning, b.warning),
      warningForeground: c(a.warningForeground, b.warningForeground),
      info: c(a.info, b.info),
      infoForeground: c(a.infoForeground, b.infoForeground),
      border: c(a.border, b.border),
      input: c(a.input, b.input),
      ring: c(a.ring, b.ring),
      primaryShades: {
        for (final step in a.primaryShades.keys)
          step: c(
            a.primaryShades[step]!,
            b.primaryShades[step] ?? a.primaryShades[step]!,
          ),
      },
      chart: [
        for (var i = 0; i < a.chart.length; i++)
          c(a.chart[i], i < b.chart.length ? b.chart[i] : a.chart[i]),
      ],
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Radii                                                                       */
/* -------------------------------------------------------------------------- */

/// The corner-radius scale, derived from a single [base].
///
/// The web build resolves these through two competing rule sets: the Tailwind
/// preset defines `rounded-sm/md/lg` in terms of `--radius`, while a later
/// block in `theme.css` redefines the same classes against a `--radius-*`
/// scale. The preset's rules come later in the emitted stylesheet and win, so
/// [sm], [md] and [lg] below reproduce the preset — which is also shadcn's
/// convention and what actually renders today.
///
/// One deliberate divergence: the web's bare `rounded` class (53 uses in the
/// library) resolves to a fixed 4px and silently stops tracking `--radius`, so
/// raising the radius leaves those corners behind. At the default radius it is
/// identical to `rounded-sm`, which is why it goes unnoticed. Here it folds
/// into [sm] and tracks the token as intended.
@immutable
class TolleRadii {
  const TolleRadii({this.base = 8.0});

  /// `--radius`. Defaults to 8.0 logical pixels, the 0.5rem shipped default.
  final double base;

  double get none => 0.0;
  double get sm => base - 4 < 0 ? 0.0 : base - 4;
  double get md => base - 2 < 0 ? 0.0 : base - 2;
  double get lg => base;
  double get xl => base * 1.5;
  double get full => 9999.0;

  BorderRadius get smRadius => BorderRadius.circular(sm);
  BorderRadius get mdRadius => BorderRadius.circular(md);
  BorderRadius get lgRadius => BorderRadius.circular(lg);
  BorderRadius get xlRadius => BorderRadius.circular(xl);
  BorderRadius get fullRadius => BorderRadius.circular(full);

  TolleRadii copyWith({double? base}) => TolleRadii(base: base ?? this.base);

  static TolleRadii lerp(TolleRadii a, TolleRadii b, double t) =>
      TolleRadii(base: a.base + (b.base - a.base) * t);
}

/* -------------------------------------------------------------------------- */
/* Typography                                                                  */
/* -------------------------------------------------------------------------- */

/// A font role: a preferred family plus its fallback chain.
///
/// The web tokens are CSS font stacks (`--font-sans` and friends). Flutter
/// splits the same idea into `fontFamily` plus `fontFamilyFallback`, so a stack
/// maps onto this pair. A null [family] means the platform default, which is
/// the right behaviour for an unconfigured app.
@immutable
class TolleFontStack {
  const TolleFontStack({this.family, this.fallback = const []});

  final String? family;
  final List<String> fallback;

  TolleFontStack copyWith({String? family, List<String>? fallback}) =>
      TolleFontStack(
        family: family ?? this.family,
        fallback: fallback ?? this.fallback,
      );
}

/// The type scale, matching Tailwind's defaults so sizes carry across from the
/// Angular components' `text-*` classes.
@immutable
class TolleTextScale {
  const TolleTextScale();

  TextStyle get xs => const TextStyle(fontSize: 12, height: 16 / 12);
  TextStyle get sm => const TextStyle(fontSize: 14, height: 20 / 14);
  TextStyle get base => const TextStyle(fontSize: 16, height: 24 / 16);
  TextStyle get lg => const TextStyle(fontSize: 18, height: 28 / 18);
  TextStyle get xl => const TextStyle(fontSize: 20, height: 28 / 20);
  TextStyle get xl2 => const TextStyle(fontSize: 24, height: 32 / 24);
  TextStyle get xl3 => const TextStyle(fontSize: 30, height: 36 / 30);
  TextStyle get xl4 => const TextStyle(fontSize: 36, height: 40 / 36);
}

/// The three font roles plus the shared type scale.
@immutable
class TolleTypographyTokens {
  const TolleTypographyTokens({
    this.sans = const TolleFontStack(),
    this.serif = const TolleFontStack(),
    this.mono = const TolleFontStack(),
    this.scale = const TolleTextScale(),
  });

  final TolleFontStack sans;
  final TolleFontStack serif;
  final TolleFontStack mono;
  final TolleTextScale scale;

  TolleTypographyTokens copyWith({
    TolleFontStack? sans,
    TolleFontStack? serif,
    TolleFontStack? mono,
    TolleTextScale? scale,
  }) => TolleTypographyTokens(
    sans: sans ?? this.sans,
    serif: serif ?? this.serif,
    mono: mono ?? this.mono,
    scale: scale ?? this.scale,
  );
}

/* -------------------------------------------------------------------------- */
/* Shadows                                                                     */
/* -------------------------------------------------------------------------- */

/// Elevation tokens, ported from the `--shadow-*` custom properties.
///
/// The CSS values are multi-layer box-shadows; each layer becomes one
/// [BoxShadow]. Negative CSS spread maps to [BoxShadow.spreadRadius], and the
/// CSS blur is halved because CSS blur-radius is twice the Gaussian sigma
/// Flutter takes.
@immutable
class TolleShadows {
  const TolleShadows({
    required this.sm,
    required this.base,
    required this.md,
    required this.lg,
  });

  final List<BoxShadow> sm;
  final List<BoxShadow> base;
  final List<BoxShadow> md;
  final List<BoxShadow> lg;

  static List<BoxShadow> _layers(double opacity, List<List<double>> specs) => [
    for (final s in specs)
      BoxShadow(
        color: Color.fromRGBO(0, 0, 0, opacity),
        offset: Offset(s[0], s[1]),
        blurRadius: s[2] / 2,
        spreadRadius: s[3],
      ),
  ];

  factory TolleShadows.light() => TolleShadows(
    sm: _layers(0.05, [
      [0, 1, 2, 0],
    ]),
    base: _layers(0.1, [
      [0, 1, 3, 0],
      [0, 1, 2, -1],
    ]),
    md: _layers(0.1, [
      [0, 4, 6, -1],
      [0, 2, 4, -2],
    ]),
    lg: _layers(0.1, [
      [0, 10, 15, -3],
      [0, 4, 6, -4],
    ]),
  );

  /// The dark set. `theme.css` raises every layer to 0.3 alpha and does not
  /// define `--shadow-lg` for dark, so it inherits the light geometry at the
  /// dark opacity rather than falling back to a lighter shadow.
  factory TolleShadows.dark() => TolleShadows(
    sm: _layers(0.3, [
      [0, 1, 2, 0],
    ]),
    base: _layers(0.3, [
      [0, 1, 3, 0],
      [0, 1, 2, -1],
    ]),
    md: _layers(0.3, [
      [0, 4, 6, -1],
      [0, 2, 4, -2],
    ]),
    lg: _layers(0.3, [
      [0, 10, 15, -3],
      [0, 4, 6, -4],
    ]),
  );
}

/* -------------------------------------------------------------------------- */
/* Motion                                                                      */
/* -------------------------------------------------------------------------- */

/// Motion tokens. [easing] is the preset's named `ease-tolle` curve, so
/// transitions match the Angular components rather than Flutter's defaults.
@immutable
class TolleMotion {
  const TolleMotion();

  Curve get easing => const Cubic(0.2, 0.0, 0.2, 1.0);

  /// `animate-in` / `animate-out` in `theme.css`.
  Duration get fast => const Duration(milliseconds: 200);

  /// The sheet slide transitions.
  Duration get medium => const Duration(milliseconds: 300);
}
