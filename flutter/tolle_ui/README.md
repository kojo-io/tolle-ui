# tolle_ui

Config-first UI for Flutter — the Flutter line of [Tolle UI](https://github.com/kojo-io/tolle-ui).

> **Status: Phase 0.** The theming and interaction foundation is in place and
> tested. No components have been ported yet. See
> [`docs/flutter-port-plan.md`](../../docs/flutter-port-plan.md) for the build
> order, and run `npm run check:flutter-parity` from the repo root for live
> coverage against the Angular API contract.

## What config-first means

Define your brand once. Every token — surfaces, semantic colours, the primary
ramp, the chart palette, radii — is derived from it, for both appearances.

```dart
import 'package:flutter/widgets.dart';
import 'package:tolle_ui/tolle_ui.dart';

final controller = TolleThemeController(
  config: const TolleConfig(
    primaryColor: '#551a65',
    radius: 12,
    baseColor: 'zinc',
  ),
);

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return TolleThemeProvider(
      controller: controller,
      child: const HomePage(),
    );
  }
}
```

Read tokens anywhere below it:

```dart
final t = TolleTheme.of(context);

Container(
  decoration: BoxDecoration(
    color: t.colors.card,
    border: Border.all(color: t.colors.border),
    borderRadius: t.radii.lgRadius,
    boxShadow: t.shadows.sm,
  ),
);
```

`TolleTheme.of` never throws. An unthemed component falls back to the shipped
defaults, so a widget still renders in a bare test harness.

## Using it with Material

`TolleThemeData` is a `ThemeExtension`, so it can ride along inside a
`MaterialApp` instead of using `TolleThemeProvider`:

```dart
MaterialApp(
  theme: ThemeData(
    extensions: [TolleThemeData.resolve(config: config, brightness: Brightness.light)],
  ),
);
```

`TolleTheme.of` checks both wirings. Material is otherwise not required —
nothing in the library depends on a `Material` ancestor.

## Appearance and persistence

`TolleThemeController` is the counterpart of the Angular `ThemeService`. A saved
user preference beats the config default, which beats the platform setting.

The package has **no runtime dependencies** beyond the Flutter SDK, so
persistence is an interface rather than a bundled plugin:

```dart
class PrefsStore implements TolleThemeStore {
  PrefsStore(this._prefs);
  final SharedPreferences _prefs;

  @override
  Future<String?> read(String key) async => _prefs.getString(key);
  @override
  Future<void> write(String key, String value) => _prefs.setString(key, value);
  @override
  Future<void> remove(String key) => _prefs.remove(key);
}

final controller = TolleThemeController(config: config, store: PrefsStore(prefs));
await controller.load();
```

Storage keys match the web library exactly (`tolle-theme`,
`tolle-primary-color`, …), so a Flutter client and a web client backed by the
same synced store agree on what they read.

## Overriding styles

There is no `class` prop here and no `tailwind-merge`. Component styles are
typed, all-nullable objects that resolve **theme default → variant →
per-instance `style:`**, last wins. Overrides merge per interaction state, so an
override that only speaks to hover leaves the disabled state alone:

```dart
final merged = mergeStateProperty(base, override);
```

## Relationship to the Angular library

Both libraries implement one design system, and that is enforced rather than
intended:

- `lib/src/theme/color_math.dart` is a port of
  `projects/tolle/src/lib/utils/color.ts`, asserted against reference output
  generated from the TypeScript itself. If the Angular maths changes and the
  Dart port does not, CI fails.
- `flutter-parity.json`, emitted by the registry from the Angular source, is the
  canonical API contract. A ported component that falls behind its contract
  fails CI; a component not yet started is simply backlog.

## Running the example

```bash
cd example
flutter run -d chrome
```

Every value on that page is resolved from a `TolleConfig`. Change the primary,
neutrals, radius or appearance at the top and the whole page follows — which is
the property Phase 1 builds components on top of.
