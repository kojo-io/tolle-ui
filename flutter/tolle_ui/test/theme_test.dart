/// Covers the config → token resolution, which is the whole promise of
/// config-first theming: one brand setting must reach every token, and must
/// reach exactly the tokens its Angular counterpart reaches.
library;

import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tolle_ui/tolle_ui.dart';

void main() {
  group('shipped defaults', () {
    test('light matches theme.css', () {
      final c = TolleThemeData.light().colors;
      expect(c.background, const Color(0xFFFFFFFF));
      expect(c.foreground, const Color(0xFF0A0A0A));
      expect(c.primary, const Color(0xFF2563EB));
      expect(c.mutedForeground, const Color(0xFF71717A));
      expect(c.border, const Color(0xFFE4E4E7));
      expect(c.destructive, const Color(0xFFEF4444));
      expect(c.success, const Color(0xFF16A34A));
      // theme.css sets `--ring: var(--primary)` until a primary is configured.
      expect(c.ring, c.primary);
    });

    test('dark matches theme.css', () {
      final c = TolleThemeData.dark().colors;
      expect(c.background, const Color(0xFF09090B));
      expect(c.foreground, const Color(0xFFFAFAFA));
      expect(c.primary, const Color(0xFF3B82F6));
      expect(c.mutedForeground, const Color(0xFFA1A1AA));
      expect(c.destructive, const Color(0xFF7F1D1D));
      expect(c.ring, c.primary);
    });

    test(
      'default chart palettes are the validated fixed sets, not derived',
      () {
        // The shipped chart colours were hand-validated for CVD separation. An
        // unconfigured theme must use them rather than running the ramp on the
        // default primary, which would produce a different, unvalidated set.
        expect(
          TolleThemeData.light().colors.chart.first,
          const Color(0xFF2563EB),
        );
        expect(
          TolleThemeData.dark().colors.chart.first,
          const Color(0xFF558CFF),
        );
        expect(
          TolleThemeData.light().colors.chart,
          isNot(TolleThemeData.dark().colors.chart),
        );
      },
    );
  });

  group('primaryColor', () {
    const config = TolleConfig(primaryColor: '#551a65');

    test('drives primary, its contrast foreground and the ring', () {
      final light = TolleThemeData.resolve(
        config: config,
        brightness: Brightness.light,
      );
      expect(light.colors.primary, const Color(0xFF551A65));
      // Dark plum needs white on top.
      expect(light.colors.primaryForeground, const Color(0xFFFFFFFF));
      // Ring is a 40% lift in light.
      expect(light.colors.ring, const Color(0xFF9975A2));
      expect(light.colors.ring, isNot(light.colors.primary));
    });

    test('resolves the same primary in both appearances', () {
      // generateThemeCss emits the configured primary into both :root and
      // .dark unchanged — a configured brand colour does not shift with the
      // appearance, unlike the shipped default which does.
      final light = TolleThemeData.resolve(
        config: config,
        brightness: Brightness.light,
      );
      final dark = TolleThemeData.resolve(
        config: config,
        brightness: Brightness.dark,
      );
      expect(light.colors.primary, dark.colors.primary);
      // The ring still differs: 40% lift in light, 20% in dark.
      expect(light.colors.ring, isNot(dark.colors.ring));
    });

    test('picks a black foreground on a light primary', () {
      final t = TolleThemeData.resolve(
        config: const TolleConfig(primaryColor: '#facc15'),
        brightness: Brightness.light,
      );
      expect(t.colors.primaryForeground, const Color(0xFF000000));
    });

    test('populates the full 50–900 ramp', () {
      final t = TolleThemeData.resolve(
        config: config,
        brightness: Brightness.light,
      );
      expect(t.colors.primaryShades.keys.toSet(), {
        50,
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        800,
        900,
      });
      expect(t.colors.primaryShades[500], t.colors.primary);
    });

    test('leaves the neutrals alone', () {
      final base = TolleThemeData.light().colors;
      final themed = TolleThemeData.resolve(
        config: config,
        brightness: Brightness.light,
      );
      expect(themed.colors.background, base.background);
      expect(themed.colors.muted, base.muted);
      expect(themed.colors.border, base.border);
    });

    test('falls back to the defaults on malformed hex', () {
      final t = TolleThemeData.resolve(
        config: const TolleConfig(primaryColor: 'not-a-colour'),
        brightness: Brightness.light,
      );
      expect(t.colors.primary, TolleThemeData.light().colors.primary);
    });
  });

  group('baseColor', () {
    test('swaps every neutral token', () {
      final t = TolleThemeData.resolve(
        config: const TolleConfig(baseColor: 'slate'),
        brightness: Brightness.light,
      );
      // slate-950 / slate-100 / slate-200.
      expect(t.colors.foreground, const Color(0xFF020617));
      expect(t.colors.muted, const Color(0xFFF1F5F9));
      expect(t.colors.border, const Color(0xFFE2E8F0));
    });

    test('leaves the primary and semantic colours alone', () {
      final base = TolleThemeData.light().colors;
      final t = TolleThemeData.resolve(
        config: const TolleConfig(baseColor: 'stone'),
        brightness: Brightness.light,
      );
      expect(t.colors.primary, base.primary);
      expect(t.colors.destructive, base.destructive);
      expect(t.colors.success, base.success);
    });

    test('an unknown family falls back to zinc rather than throwing', () {
      final t = TolleThemeData.resolve(
        config: const TolleConfig(baseColor: 'chartreuse'),
        brightness: Brightness.light,
      );
      expect(t.colors.muted, const Color(0xFFF4F4F5));
    });

    test('zinc is close to, but not identical with, the untouched default', () {
      // theme.css ships foreground `10 10 10`; zinc-950 is `9 9 11`. The
      // Angular runtime only injects a base palette once one is configured, so
      // the two must stay distinguishable here or the port has papered over a
      // real difference.
      final untouched = TolleThemeData.light().colors;
      final zinc = TolleThemeData.resolve(
        config: const TolleConfig(baseColor: 'zinc'),
        brightness: Brightness.light,
      );
      expect(zinc.colors.muted, untouched.muted);
      expect(zinc.colors.foreground, const Color(0xFF09090B));
      expect(zinc.colors.foreground, isNot(untouched.foreground));
    });
  });

  group('chartColor', () {
    test('derives five distinct marks per appearance', () {
      final light = TolleThemeData.resolve(
        config: const TolleConfig(chartColor: '#551a65'),
        brightness: Brightness.light,
      );
      expect(light.colors.chart, hasLength(5));
      expect(light.colors.chart.toSet(), hasLength(5));
      expect(light.colors.chart, isNot(TolleThemeData.light().colors.chart));
    });

    test('re-steps for the dark surface rather than reusing light', () {
      final light = TolleThemeData.resolve(
        config: const TolleConfig(chartColor: '#551a65'),
        brightness: Brightness.light,
      );
      final dark = TolleThemeData.resolve(
        config: const TolleConfig(chartColor: '#551a65'),
        brightness: Brightness.dark,
      );
      expect(light.colors.chart, isNot(dark.colors.chart));
    });
  });

  group('radius', () {
    test('derives the scale the preset actually renders', () {
      final r = TolleThemeData.resolve(
        config: const TolleConfig(radius: 12),
        brightness: Brightness.light,
      ).radii;
      expect(r.lg, 12.0); // --radius
      expect(r.md, 10.0); // calc(--radius - 2px)
      expect(r.sm, 8.0); //  calc(--radius - 4px)
    });

    test('clamps rather than going negative at tiny radii', () {
      const r = TolleRadii(base: 2);
      expect(r.sm, 0.0);
      expect(r.md, 0.0);
      expect(r.lg, 2.0);
    });

    test('defaults to the 0.5rem shipped value', () {
      expect(const TolleRadii().base, 8.0);
    });
  });

  group('TolleTheme.of', () {
    testWidgets('finds an installed theme', (tester) async {
      late TolleThemeData found;
      await tester.pumpWidget(
        TolleTheme(
          data: TolleThemeData.resolve(
            config: const TolleConfig(primaryColor: '#551a65'),
            brightness: Brightness.light,
          ),
          child: Builder(
            builder: (context) {
              found = TolleTheme.of(context);
              return const SizedBox();
            },
          ),
        ),
      );
      expect(found.colors.primary, const Color(0xFF551A65));
    });

    testWidgets('falls back to defaults when unthemed', (tester) async {
      // A component dropped into a bare harness should render, not throw.
      late TolleThemeData found;
      await tester.pumpWidget(
        Builder(
          builder: (context) {
            found = TolleTheme.of(context);
            return const SizedBox();
          },
        ),
      );
      expect(found.colors.primary, const Color(0xFF2563EB));
    });

    testWidgets('installs a default text style from the theme', (tester) async {
      late TextStyle style;
      await tester.pumpWidget(
        TolleTheme(
          data: TolleThemeData.dark(),
          child: Builder(
            builder: (context) {
              style = DefaultTextStyle.of(context).style;
              return const SizedBox();
            },
          ),
        ),
      );
      expect(style.color, const Color(0xFFFAFAFA));
      expect(style.fontSize, 16);
    });
  });

  group('TolleThemeController', () {
    test('darkByDefault seeds the appearance', () {
      expect(
        TolleThemeController(
          config: const TolleConfig(darkByDefault: true),
        ).appearance,
        TolleAppearance.dark,
      );
      expect(
        TolleThemeController(config: const TolleConfig()).appearance,
        TolleAppearance.system,
      );
    });

    test('system appearance follows the platform', () {
      final c = TolleThemeController();
      expect(c.resolve(Brightness.dark).isDark, isTrue);
      expect(c.resolve(Brightness.light).isDark, isFalse);
    });

    test('an explicit appearance overrides the platform', () async {
      final c = TolleThemeController();
      await c.setAppearance(TolleAppearance.light);
      expect(c.resolve(Brightness.dark).isDark, isFalse);
    });

    test('toggle flips relative to what is currently showing', () async {
      final c = TolleThemeController();
      // Following a dark system, the first toggle must go to light.
      await c.toggleAppearance(Brightness.dark);
      expect(c.appearance, TolleAppearance.light);
      await c.toggleAppearance(Brightness.dark);
      expect(c.appearance, TolleAppearance.dark);
    });

    test('saved preferences win over config defaults', () async {
      final store = InMemoryTolleThemeStore();
      await store.write(TolleThemeKeys.appearance, 'light');
      await store.write(TolleThemeKeys.primaryColor, '#16a34a');
      await store.write(TolleThemeKeys.radius, '16.0');

      final c = TolleThemeController(
        config: const TolleConfig(
          primaryColor: '#551a65',
          radius: 8,
          darkByDefault: true,
        ),
        store: store,
      );
      await c.load();

      expect(c.appearance, TolleAppearance.light);
      final theme = c.resolve(Brightness.dark);
      expect(theme.colors.primary, const Color(0xFF16A34A));
      expect(theme.radii.base, 16.0);
    });

    test('setters persist under the same keys as the web', () async {
      final store = InMemoryTolleThemeStore();
      final c = TolleThemeController(store: store);
      await c.setPrimaryColor('#551a65');
      await c.setBaseColor('slate');
      await c.setRadius(12);
      expect(await store.read(TolleThemeKeys.primaryColor), '#551a65');
      expect(await store.read(TolleThemeKeys.baseColor), 'slate');
      expect(await store.read(TolleThemeKeys.radius), '12.0');
    });

    test('reset clears every stored key', () async {
      final store = InMemoryTolleThemeStore();
      final c = TolleThemeController(store: store);
      await c.setPrimaryColor('#551a65');
      await c.setAppearance(TolleAppearance.dark);
      await c.reset(const TolleConfig());
      for (final key in TolleThemeKeys.all) {
        expect(await store.read(key), isNull, reason: key);
      }
      expect(c.appearance, TolleAppearance.system);
      expect(
        c.resolve(Brightness.light).colors.primary,
        const Color(0xFF2563EB),
      );
    });

    test('notifies listeners on change', () async {
      final c = TolleThemeController();
      var notifications = 0;
      c.addListener(() => notifications++);
      await c.setPrimaryColor('#551a65', persist: false);
      await c.setAppearance(TolleAppearance.dark, persist: false);
      expect(notifications, 2);
    });
  });

  group('lerp', () {
    test('interpolates colours and snaps discrete fields at the midpoint', () {
      final light = TolleThemeData.light();
      final dark = TolleThemeData.dark();

      final quarter = light.lerp(dark, 0.25);
      expect(quarter.brightness, Brightness.light);
      expect(quarter.colors.background, isNot(light.colors.background));

      final most = light.lerp(dark, 0.75);
      expect(most.brightness, Brightness.dark);
    });

    test('is identity against null', () {
      final light = TolleThemeData.light();
      expect(light.lerp(null, 0.5), same(light));
    });
  });
}
