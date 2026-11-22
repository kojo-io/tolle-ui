/// Asserts TolleButton against the behaviour of
/// `projects/tolle/src/lib/button.component.ts`, variant by variant.
///
/// The point of the first ported component is to prove the three-layer style
/// resolution works before 116 more are built on it, so the merge order gets
/// as much attention here as the rendering.
library;

import 'package:flutter/gestures.dart' show PointerDeviceKind;
import 'package:flutter/services.dart' show LogicalKeyboardKey;
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tolle_ui/tolle_ui.dart';

final _theme = TolleThemeData.resolve(
  config: const TolleConfig(primaryColor: '#551a65', radius: 12),
  brightness: Brightness.light,
);

Widget _host(Widget child, {TolleThemeData? theme}) => TolleTheme(
  data: theme ?? _theme,
  child: Directionality(
    textDirection: TextDirection.ltr,
    child: Center(child: child),
  ),
);

/// The button's own painted surface — the innermost decorated container.
BoxDecoration _surface(WidgetTester tester) {
  final containers = tester.widgetList<Container>(find.byType(Container));
  final decorated = containers
      .map((c) => c.decoration)
      .whereType<BoxDecoration>()
      .toList();
  expect(decorated, isNotEmpty, reason: 'button painted no surface');
  return decorated.first;
}

TextStyle _labelStyle(WidgetTester tester) => tester
    .widget<DefaultTextStyle>(
      find
          .ancestor(
            of: find.text('Save'),
            matching: find.byType(DefaultTextStyle),
          )
          .first,
    )
    .style;

void main() {
  group('variants', () {
    testWidgets('primary uses the configured brand colour', (tester) async {
      await tester.pumpWidget(
        _host(TolleButton(onPressed: () {}, child: const Text('Save'))),
      );
      expect(_surface(tester).color, const Color(0xFF551A65));
      expect(_labelStyle(tester).color, _theme.colors.primaryForeground);
    });

    testWidgets('destructive uses the destructive token', (tester) async {
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            variant: TolleButtonVariant.destructive,
            child: const Text('Save'),
          ),
        ),
      );
      expect(_surface(tester).color, _theme.colors.destructive);
    });

    testWidgets('outline is transparent with an input-coloured border', (
      tester,
    ) async {
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            variant: TolleButtonVariant.outline,
            child: const Text('Save'),
          ),
        ),
      );
      final d = _surface(tester);
      expect(d.color, const Color(0x00000000));
      expect(d.border?.top.color, _theme.colors.input);
      expect(d.border?.top.width, 1);
    });

    testWidgets('ghost has neither background nor border', (tester) async {
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            variant: TolleButtonVariant.ghost,
            child: const Text('Save'),
          ),
        ),
      );
      final d = _surface(tester);
      expect(d.color, const Color(0x00000000));
      expect(d.border, isNull);
    });

    testWidgets('link is primary-coloured but keeps its size box', (
      tester,
    ) async {
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            variant: TolleButtonVariant.link,
            child: const Text('Save'),
          ),
        ),
      );
      expect(_labelStyle(tester).color, _theme.colors.primary);
      expect(_surface(tester).color, const Color(0x00000000));
      // The Angular `cva` applies the size classes to every variant, link
      // included — it is not laid out inline.
      expect(tester.getSize(find.byType(TolleButton)).height, 40);
      expect(_labelStyle(tester).decoration, TextDecoration.none);
    });

    testWidgets('link underlines on hover', (tester) async {
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            variant: TolleButtonVariant.link,
            child: const Text('Save'),
          ),
        ),
      );
      final gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
      await gesture.addPointer(location: Offset.zero);
      addTearDown(gesture.removePointer);
      await gesture.moveTo(tester.getCenter(find.byType(TolleButton)));
      await tester.pumpAndSettle();

      expect(_labelStyle(tester).decoration, TextDecoration.underline);
    });
  });

  group('sizes', () {
    testWidgets('default is 40 high', (tester) async {
      await tester.pumpWidget(
        _host(TolleButton(onPressed: () {}, child: const Text('Save'))),
      );
      expect(tester.getSize(find.byType(TolleButton)).height, 40);
    });

    testWidgets('lg is 44 high, sm is 36', (tester) async {
      for (final (size, height) in [
        (TolleButtonSize.lg, 44.0),
        (TolleButtonSize.sm, 36.0),
        (TolleButtonSize.xs, 32.0),
      ]) {
        await tester.pumpWidget(
          _host(
            TolleButton(
              onPressed: () {},
              size: size,
              child: const Text('Save'),
            ),
          ),
        );
        expect(
          tester.getSize(find.byType(TolleButton)).height,
          height,
          reason: '$size',
        );
      }
    });

    testWidgets('icon sizes are square', (tester) async {
      for (final (size, side) in [
        (TolleButtonSize.iconXs, 32.0),
        (TolleButtonSize.iconSm, 36.0),
        (TolleButtonSize.icon, 40.0),
        (TolleButtonSize.iconLg, 44.0),
      ]) {
        await tester.pumpWidget(
          _host(
            TolleButton(
              onPressed: () {},
              size: size,
              child: const Icon(TolleIcons.checkLine),
            ),
          ),
        );
        final box = tester.getSize(find.byType(TolleButton));
        expect(box.width, side, reason: '$size width');
        expect(box.height, side, reason: '$size height');
      }
    });

    testWidgets('xs drops to the smaller type step', (tester) async {
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            size: TolleButtonSize.xs,
            child: const Text('Save'),
          ),
        ),
      );
      expect(_labelStyle(tester).fontSize, 12);
    });
  });

  group('radius', () {
    testWidgets('corners track the radius token', (tester) async {
      await tester.pumpWidget(
        _host(TolleButton(onPressed: () {}, child: const Text('Save'))),
      );
      // rounded-md = radius - 2, and the config sets radius to 12.
      expect(_surface(tester).borderRadius, BorderRadius.circular(10));
    });
  });

  group('disabled and busy', () {
    testWidgets('disabled blocks the callback', (tester) async {
      var taps = 0;
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () => taps++,
            disabled: true,
            child: const Text('Save'),
          ),
        ),
      );
      await tester.tap(find.byType(TolleButton), warnIfMissed: false);
      expect(taps, 0);
    });

    testWidgets('busy blocks the callback too', (tester) async {
      var taps = 0;
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () => taps++,
            busy: true,
            child: const Text('Save'),
          ),
        ),
      );
      await tester.tap(find.byType(TolleButton), warnIfMissed: false);
      expect(taps, 0);
      await tester.pumpWidget(const SizedBox());
    });

    testWidgets('busy keeps the button the same width', (tester) async {
      await tester.pumpWidget(
        _host(TolleButton(onPressed: () {}, child: const Text('Save'))),
      );
      final idle = tester.getSize(find.byType(TolleButton));

      await tester.pumpWidget(
        _host(
          TolleButton(onPressed: () {}, busy: true, child: const Text('Save')),
        ),
      );
      expect(tester.getSize(find.byType(TolleButton)), idle);
      await tester.pumpWidget(const SizedBox());
    });

    testWidgets('disabled dims to 50%', (tester) async {
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            disabled: true,
            child: const Text('Save'),
          ),
        ),
      );
      final opacities = tester
          .widgetList<Opacity>(find.byType(Opacity))
          .map((o) => o.opacity);
      expect(opacities, contains(0.5));
    });

    testWidgets('a button with no callback is inert', (tester) async {
      await tester.pumpWidget(_host(const TolleButton(child: Text('Save'))));
      await tester.tap(find.byType(TolleButton), warnIfMissed: false);
      // Nothing to assert beyond not throwing — the point is it stays usable
      // as a static label without a handler.
      expect(find.text('Save'), findsOneWidget);
    });
  });

  group('interaction', () {
    testWidgets('hover lightens the primary to 90%', (tester) async {
      await tester.pumpWidget(
        _host(TolleButton(onPressed: () {}, child: const Text('Save'))),
      );
      final gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
      await gesture.addPointer(location: Offset.zero);
      addTearDown(gesture.removePointer);

      await gesture.moveTo(tester.getCenter(find.byType(TolleButton)));
      await tester.pumpAndSettle();

      expect(
        _surface(tester).color,
        const Color(0xFF551A65).withValues(alpha: 0.9),
      );
    });

    testWidgets('activates from the keyboard', (tester) async {
      var taps = 0;
      final node = FocusNode();
      addTearDown(node.dispose);
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () => taps++,
            focusNode: node,
            child: const Text('Save'),
          ),
        ),
      );
      node.requestFocus();
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pump();
      expect(taps, 1);
    });
  });

  group('style resolution', () {
    testWidgets('per-instance style beats the variant default', (tester) async {
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            style: TolleButtonStyle(
              backgroundColor: always(const Color(0xFF00FF00)),
            ),
            child: const Text('Save'),
          ),
        ),
      );
      expect(_surface(tester).color, const Color(0xFF00FF00));
    });

    testWidgets('theme override beats the variant default', (tester) async {
      final themed = TolleThemeData.resolve(
        config: const TolleConfig(primaryColor: '#551a65'),
        brightness: Brightness.light,
        components: TolleComponentThemes(button: TolleButtonStyle(height: 56)),
      );
      await tester.pumpWidget(
        _host(
          TolleButton(onPressed: () {}, child: const Text('Save')),
          theme: themed,
        ),
      );
      expect(tester.getSize(find.byType(TolleButton)).height, 56);
    });

    testWidgets('per-instance style beats the theme override', (tester) async {
      final themed = TolleThemeData.resolve(
        brightness: Brightness.light,
        components: TolleComponentThemes(button: TolleButtonStyle(height: 56)),
      );
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            style: const TolleButtonStyle(height: 72),
            child: const Text('Save'),
          ),
          theme: themed,
        ),
      );
      expect(tester.getSize(find.byType(TolleButton)).height, 72);
    });

    testWidgets('an override for one state leaves the others intact', (
      tester,
    ) async {
      // The property that makes this a real tailwind-merge analogue: naming
      // only the hovered colour must not blank the resting one.
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            style: TolleButtonStyle(
              backgroundColor: states(hovered: const Color(0xFF00FF00)),
            ),
            child: const Text('Save'),
          ),
        ),
      );
      expect(_surface(tester).color, const Color(0xFF551A65));

      final gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
      await gesture.addPointer(location: Offset.zero);
      addTearDown(gesture.removePointer);
      await gesture.moveTo(tester.getCenter(find.byType(TolleButton)));
      await tester.pumpAndSettle();

      expect(_surface(tester).color, const Color(0xFF00FF00));
    });
  });

  group('theming', () {
    testWidgets('follows the appearance', (tester) async {
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            variant: TolleButtonVariant.secondary,
            child: const Text('Save'),
          ),
          theme: TolleThemeData.dark(),
        ),
      );
      expect(_surface(tester).color, TolleThemeData.dark().colors.secondary);
    });

    testWidgets('renders unthemed without throwing', (tester) async {
      await tester.pumpWidget(
        Directionality(
          textDirection: TextDirection.ltr,
          child: Center(
            child: TolleButton(onPressed: () {}, child: const Text('Save')),
          ),
        ),
      );
      expect(_surface(tester).color, const Color(0xFF2563EB));
    });
  });

  group('semantics', () {
    testWidgets('announces as an enabled button', (tester) async {
      await tester.pumpWidget(
        _host(TolleButton(onPressed: () {}, child: const Text('Save'))),
      );
      expect(
        tester.getSemantics(find.text('Save')),
        isSemantics(
          isButton: true,
          hasEnabledState: true,
          isEnabled: true,
          hasTapAction: true,
          label: 'Save',
        ),
      );
    });

    testWidgets('a disabled button announces as disabled', (tester) async {
      await tester.pumpWidget(
        _host(
          TolleButton(
            onPressed: () {},
            disabled: true,
            child: const Text('Save'),
          ),
        ),
      );
      expect(
        tester.getSemantics(find.text('Save')),
        isSemantics(
          isButton: true,
          hasEnabledState: true,
          isEnabled: false,
          hasTapAction: false,
          label: 'Save',
        ),
      );
    });
  });
}
