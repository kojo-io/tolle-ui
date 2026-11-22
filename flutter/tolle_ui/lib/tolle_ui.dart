/// Tolle UI for Flutter — config-first theming and components.
///
/// A Flutter re-implementation of the Angular library in this repository. The
/// token names, derivations and component API surface are shared; see
/// `docs/flutter-port-plan.md` for how parity is kept.
///
/// ```dart
/// final controller = TolleThemeController(
///   config: const TolleConfig(primaryColor: '#551a65', radius: 12),
/// );
///
/// TolleThemeProvider(
///   controller: controller,
///   child: const MyApp(),
/// );
/// ```
library;

export 'src/components/button.dart';
export 'src/icons/tolle_icons.dart';
export 'src/overlay/compute_position.dart';
export 'src/overlay/overlay_anchor.dart';
export 'src/style/interaction.dart';
export 'src/style/style.dart';
export 'src/theme/base_palettes.dart';
export 'src/theme/component_themes.dart';
export 'src/theme/color_math.dart';
export 'src/theme/theme.dart';
export 'src/theme/theme_data.dart';
export 'src/theme/tokens.dart';
