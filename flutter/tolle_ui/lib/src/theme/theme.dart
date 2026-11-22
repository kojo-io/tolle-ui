/// Theme delivery: the inherited scope, and the runtime controller that
/// replaces `ThemeService`.
library;

// Material is imported for one thing only: so `TolleTheme.of` can find a
// `TolleThemeData` that was installed through `ThemeData.extensions`. Apps
// built on `WidgetsApp` never touch that path and the code tree-shakes away.
// Nothing else in the library depends on Material.
import 'package:flutter/material.dart' show Theme;
import 'package:flutter/widgets.dart';

import 'theme_data.dart';
import 'tokens.dart';

/* -------------------------------------------------------------------------- */
/* Scope                                                                       */
/* -------------------------------------------------------------------------- */

class _TolleThemeScope extends InheritedWidget {
  const _TolleThemeScope({required this.data, required super.child});

  final TolleThemeData data;

  @override
  bool updateShouldNotify(_TolleThemeScope oldWidget) => data != oldWidget.data;
}

/// Installs a [TolleThemeData] for the subtree.
///
/// Also sets a [DefaultTextStyle] from the theme, so text renders in the
/// configured stack and foreground colour without a Material ancestor.
class TolleTheme extends StatelessWidget {
  const TolleTheme({super.key, required this.data, required this.child});

  final TolleThemeData data;
  final Widget child;

  /// The nearest theme, or null if there is none.
  ///
  /// Looks for a [TolleTheme] first, then for a [TolleThemeData] registered as
  /// a Material theme extension, so both wiring styles work.
  static TolleThemeData? maybeOf(BuildContext context) {
    final scope = context
        .dependOnInheritedWidgetOfExactType<_TolleThemeScope>();
    if (scope != null) return scope.data;
    return Theme.of(context).extension<TolleThemeData>();
  }

  /// The nearest theme, falling back to the shipped defaults at the platform
  /// brightness.
  ///
  /// Unlike Material's `Theme.of`, this never throws: an unthemed component
  /// renders with the library defaults rather than failing at runtime, which
  /// keeps a component usable in a bare test harness.
  static TolleThemeData of(BuildContext context) {
    final found = maybeOf(context);
    if (found != null) return found;
    final brightness =
        MediaQuery.maybePlatformBrightnessOf(context) ?? Brightness.light;
    return TolleThemeData.resolve(brightness: brightness);
  }

  @override
  Widget build(BuildContext context) {
    return _TolleThemeScope(
      data: data,
      child: DefaultTextStyle(style: data.defaultTextStyle, child: child),
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Persistence                                                                 */
/* -------------------------------------------------------------------------- */

/// Where appearance preferences are kept between launches.
///
/// The library ships no storage dependency. `ThemeService` writes to
/// `localStorage`; the Flutter equivalent would be `shared_preferences`, but a
/// plugin dependency inside a UI package forces platform setup on every
/// consumer for a feature many apps do not use. Implement this against
/// whatever the app already has, or pass nothing and preferences last for the
/// session only.
///
/// A `shared_preferences` implementation is about ten lines:
///
/// ```dart
/// class PrefsStore implements TolleThemeStore {
///   PrefsStore(this._prefs);
///   final SharedPreferences _prefs;
///   @override
///   Future<String?> read(String key) async => _prefs.getString(key);
///   @override
///   Future<void> write(String key, String value) => _prefs.setString(key, value);
///   @override
///   Future<void> remove(String key) => _prefs.remove(key);
/// }
/// ```
abstract class TolleThemeStore {
  Future<String?> read(String key);
  Future<void> write(String key, String value);
  Future<void> remove(String key);
}

/// A store that forgets everything when the process exits.
class InMemoryTolleThemeStore implements TolleThemeStore {
  final Map<String, String> _values = {};

  @override
  Future<String?> read(String key) async => _values[key];

  @override
  Future<void> write(String key, String value) async => _values[key] = value;

  @override
  Future<void> remove(String key) async => _values.remove(key);
}

/// Storage keys, matching `ThemeService` exactly so a Flutter client and a web
/// client backed by the same synced store agree on what they read.
abstract final class TolleThemeKeys {
  static const appearance = 'tolle-theme';
  static const primaryColor = 'tolle-primary-color';
  static const radius = 'tolle-radius';
  static const baseColor = 'tolle-base-color';
  static const chartColor = 'tolle-chart-color';
  static const fontSans = 'tolle-font-sans';
  static const fontSerif = 'tolle-font-serif';
  static const fontMono = 'tolle-font-mono';

  static const all = [
    appearance,
    primaryColor,
    radius,
    baseColor,
    chartColor,
    fontSans,
    fontSerif,
    fontMono,
  ];
}

/// Which appearance to use.
enum TolleAppearance {
  /// Follow the platform setting.
  system,
  light,
  dark,
}

/* -------------------------------------------------------------------------- */
/* Controller                                                                  */
/* -------------------------------------------------------------------------- */

/// The runtime half of `ThemeService`: holds the live config, resolves themes,
/// and persists user overrides.
///
/// Precedence matches the Angular service — a saved user preference beats the
/// config default, which beats the platform setting.
class TolleThemeController extends ChangeNotifier {
  TolleThemeController({
    TolleConfig config = const TolleConfig(),
    TolleThemeStore? store,
    TolleAppearance? appearance,
  }) : _config = config,
       _store = store ?? InMemoryTolleThemeStore(),
       _appearance =
           appearance ??
           (config.darkByDefault == null
               ? TolleAppearance.system
               : config.darkByDefault!
               ? TolleAppearance.dark
               : TolleAppearance.light);

  final TolleThemeStore _store;
  TolleConfig _config;
  TolleAppearance _appearance;

  TolleConfig get config => _config;
  TolleAppearance get appearance => _appearance;

  /// Hydrates saved preferences over the config defaults.
  ///
  /// Call once during startup and await it before the first frame if you want
  /// to avoid a flash of the unsaved theme.
  Future<void> load() async {
    final saved = <String, String?>{
      for (final key in TolleThemeKeys.all) key: await _store.read(key),
    };

    final savedAppearance = saved[TolleThemeKeys.appearance];
    if (savedAppearance == 'dark') {
      _appearance = TolleAppearance.dark;
    } else if (savedAppearance == 'light') {
      _appearance = TolleAppearance.light;
    }

    final radius = saved[TolleThemeKeys.radius];
    _config = _config.copyWith(
      primaryColor: saved[TolleThemeKeys.primaryColor],
      baseColor: saved[TolleThemeKeys.baseColor],
      chartColor: saved[TolleThemeKeys.chartColor],
      radius: radius == null ? null : double.tryParse(radius),
    );

    notifyListeners();
  }

  /// Resolves the theme for a platform brightness.
  ///
  /// Pass `MediaQuery.platformBrightnessOf(context)`; it is only consulted when
  /// [appearance] is [TolleAppearance.system].
  TolleThemeData resolve(Brightness platformBrightness) {
    final brightness = switch (_appearance) {
      TolleAppearance.system => platformBrightness,
      TolleAppearance.light => Brightness.light,
      TolleAppearance.dark => Brightness.dark,
    };
    return TolleThemeData.resolve(config: _config, brightness: brightness);
  }

  /// True when the resolved appearance is dark. [platformBrightness] is only
  /// needed while following the system.
  bool isDark(Brightness platformBrightness) =>
      resolve(platformBrightness).isDark;

  Future<void> setAppearance(
    TolleAppearance value, {
    bool persist = true,
  }) async {
    if (_appearance == value) return;
    _appearance = value;
    notifyListeners();
    if (!persist) return;
    if (value == TolleAppearance.system) {
      await _store.remove(TolleThemeKeys.appearance);
    } else {
      await _store.write(
        TolleThemeKeys.appearance,
        value == TolleAppearance.dark ? 'dark' : 'light',
      );
    }
  }

  /// Flips between light and dark.
  ///
  /// While following the system this needs to know what the system currently
  /// says, so it can flip to the opposite rather than to a fixed side.
  Future<void> toggleAppearance(
    Brightness platformBrightness, {
    bool persist = true,
  }) {
    final currentlyDark = isDark(platformBrightness);
    return setAppearance(
      currentlyDark ? TolleAppearance.light : TolleAppearance.dark,
      persist: persist,
    );
  }

  Future<void> setPrimaryColor(String hex, {bool persist = true}) => _update(
    TolleThemeKeys.primaryColor,
    hex,
    persist,
    (c) => c.copyWith(primaryColor: hex),
  );

  Future<void> setBaseColor(String id, {bool persist = true}) => _update(
    TolleThemeKeys.baseColor,
    id,
    persist,
    (c) => c.copyWith(baseColor: id),
  );

  Future<void> setChartColor(String hex, {bool persist = true}) => _update(
    TolleThemeKeys.chartColor,
    hex,
    persist,
    (c) => c.copyWith(chartColor: hex),
  );

  Future<void> setRadius(double radius, {bool persist = true}) => _update(
    TolleThemeKeys.radius,
    radius.toString(),
    persist,
    (c) => c.copyWith(radius: radius),
  );

  Future<void> setFont(
    TolleFontRole role,
    TolleFontStack stack, {
    bool persist = true,
  }) async {
    _config = switch (role) {
      TolleFontRole.sans => _config.copyWith(fontSans: stack),
      TolleFontRole.serif => _config.copyWith(fontSerif: stack),
      TolleFontRole.mono => _config.copyWith(fontMono: stack),
    };
    notifyListeners();
    if (!persist) return;
    // Only the family round-trips through storage; a fallback chain is a build
    // -time decision, not a user preference.
    final key = switch (role) {
      TolleFontRole.sans => TolleThemeKeys.fontSans,
      TolleFontRole.serif => TolleThemeKeys.fontSerif,
      TolleFontRole.mono => TolleThemeKeys.fontMono,
    };
    if (stack.family == null) {
      await _store.remove(key);
    } else {
      await _store.write(key, stack.family!);
    }
  }

  Future<void> _update(
    String key,
    String value,
    bool persist,
    TolleConfig Function(TolleConfig) apply,
  ) async {
    _config = apply(_config);
    notifyListeners();
    if (persist) await _store.write(key, value);
  }

  /// Drops every saved override and returns to the config the controller was
  /// built with.
  Future<void> reset(TolleConfig original) async {
    for (final key in TolleThemeKeys.all) {
      await _store.remove(key);
    }
    _config = original;
    _appearance = original.darkByDefault == null
        ? TolleAppearance.system
        : original.darkByDefault!
        ? TolleAppearance.dark
        : TolleAppearance.light;
    notifyListeners();
  }
}

/// The three font roles a theme carries.
enum TolleFontRole { sans, serif, mono }

/* -------------------------------------------------------------------------- */
/* Convenience host                                                            */
/* -------------------------------------------------------------------------- */

/// Wires a [TolleThemeController] to the widget tree.
///
/// Rebuilds the subtree when the controller changes or the platform brightness
/// flips, and installs the resolved theme via [TolleTheme]. Use it directly
/// under your app widget when you are not routing tokens through Material.
class TolleThemeProvider extends StatelessWidget {
  const TolleThemeProvider({
    super.key,
    required this.controller,
    required this.child,
  });

  final TolleThemeController controller;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final platformBrightness = MediaQuery.platformBrightnessOf(context);
    return ListenableBuilder(
      listenable: controller,
      builder: (context, child) => TolleTheme(
        data: controller.resolve(platformBrightness),
        child: child!,
      ),
      child: child,
    );
  }
}
