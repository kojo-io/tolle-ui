/// Covers the interaction layer every pressable component sits on.
///
/// These behaviours came free from the browser on the Angular side — a real
/// `<button>` gives hover, focus, keyboard activation and disabled semantics
/// without anyone writing them. Nothing here is free in Flutter, so each one
/// gets an explicit test.
library;

import 'package:flutter/gestures.dart' show PointerDeviceKind;
import 'package:flutter/services.dart' show LogicalKeyboardKey;
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tolle_ui/tolle_ui.dart';

/// Pumps a detector and exposes the state set it last built with.
class _Harness {
  Set<WidgetState> states = const {};
}

Widget _detector(
  _Harness harness, {
  VoidCallback? onTap,
  bool enabled = true,
  bool selected = false,
  FocusNode? focusNode,
}) {
  return Directionality(
    textDirection: TextDirection.ltr,
    child: Center(
      child: TolleInteractionDetector(
        onTap: onTap,
        enabled: enabled,
        selected: selected,
        focusNode: focusNode,
        builder: (context, states) {
          harness.states = states;
          return const SizedBox(width: 100, height: 40);
        },
      ),
    ),
  );
}

void main() {
  group('TolleInteractionDetector', () {
    testWidgets('starts with no states', (tester) async {
      final h = _Harness();
      await tester.pumpWidget(_detector(h, onTap: () {}));
      expect(h.states, isEmpty);
    });

    testWidgets('tracks hover', (tester) async {
      final h = _Harness();
      await tester.pumpWidget(_detector(h, onTap: () {}));

      final gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
      await gesture.addPointer(location: Offset.zero);
      addTearDown(gesture.removePointer);

      await gesture.moveTo(tester.getCenter(find.byType(SizedBox)));
      await tester.pump();
      expect(h.states, contains(WidgetState.hovered));

      await gesture.moveTo(Offset.zero);
      await tester.pump();
      expect(h.states, isNot(contains(WidgetState.hovered)));
    });

    testWidgets('tracks press and releases it on tap-up', (tester) async {
      final h = _Harness();
      await tester.pumpWidget(_detector(h, onTap: () {}));

      final gesture = await tester.startGesture(
        tester.getCenter(find.byType(SizedBox)),
      );
      await tester.pump();
      expect(h.states, contains(WidgetState.pressed));

      await gesture.up();
      await tester.pump();
      expect(h.states, isNot(contains(WidgetState.pressed)));
    });

    testWidgets('clears press when the gesture is cancelled', (tester) async {
      final h = _Harness();
      await tester.pumpWidget(_detector(h, onTap: () {}));

      final gesture = await tester.startGesture(
        tester.getCenter(find.byType(SizedBox)),
      );
      await tester.pump();
      expect(h.states, contains(WidgetState.pressed));

      // Dragging far away cancels rather than completing the tap.
      await gesture.moveTo(const Offset(500, 500));
      await gesture.up();
      await tester.pump();
      expect(h.states, isNot(contains(WidgetState.pressed)));
    });

    testWidgets('tracks focus', (tester) async {
      final h = _Harness();
      final node = FocusNode();
      addTearDown(node.dispose);
      await tester.pumpWidget(_detector(h, onTap: () {}, focusNode: node));

      node.requestFocus();
      await tester.pump();
      expect(h.states, contains(WidgetState.focused));

      node.unfocus();
      await tester.pump();
      expect(h.states, isNot(contains(WidgetState.focused)));
    });

    testWidgets('reflects disabled and selected', (tester) async {
      final h = _Harness();
      await tester.pumpWidget(_detector(h, onTap: () {}, enabled: false));
      expect(h.states, contains(WidgetState.disabled));

      await tester.pumpWidget(_detector(h, onTap: () {}, selected: true));
      expect(h.states, contains(WidgetState.selected));
      expect(h.states, isNot(contains(WidgetState.disabled)));
    });

    testWidgets('activates on Enter and Space like a native button', (
      tester,
    ) async {
      final h = _Harness();
      var taps = 0;
      final node = FocusNode();
      addTearDown(node.dispose);
      await tester.pumpWidget(
        _detector(h, onTap: () => taps++, focusNode: node),
      );

      node.requestFocus();
      await tester.pump();

      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pump();
      expect(taps, 1);

      await tester.sendKeyEvent(LogicalKeyboardKey.space);
      await tester.pump();
      expect(taps, 2);
    });

    testWidgets('does not fire when disabled', (tester) async {
      final h = _Harness();
      var taps = 0;
      await tester.pumpWidget(
        _detector(h, onTap: () => taps++, enabled: false),
      );
      await tester.tap(find.byType(SizedBox), warnIfMissed: false);
      await tester.pump();
      expect(taps, 0);
    });

    testWidgets('drops hover and press when disabled mid-interaction', (
      tester,
    ) async {
      // A control that keeps its hover colour after being disabled reads as
      // interactive while refusing input — the exact bug this guards.
      final h = _Harness();
      await tester.pumpWidget(_detector(h, onTap: () {}));

      final gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
      await gesture.addPointer(location: Offset.zero);
      addTearDown(gesture.removePointer);
      await gesture.moveTo(tester.getCenter(find.byType(SizedBox)));
      await tester.pump();
      expect(h.states, contains(WidgetState.hovered));

      await tester.pumpWidget(_detector(h, onTap: () {}, enabled: false));
      expect(h.states, contains(WidgetState.disabled));
      expect(h.states, isNot(contains(WidgetState.hovered)));
      expect(h.states, isNot(contains(WidgetState.pressed)));
    });

    testWidgets('exposes button semantics that follow enablement', (
      tester,
    ) async {
      final h = _Harness();
      await tester.pumpWidget(_detector(h, onTap: () {}));
      expect(
        tester.getSemantics(find.byType(SizedBox)),
        isSemantics(
          isButton: true,
          hasEnabledState: true,
          isEnabled: true,
          hasTapAction: true,
        ),
      );

      await tester.pumpWidget(_detector(h, onTap: () {}, enabled: false));
      expect(
        tester.getSemantics(find.byType(SizedBox)),
        isSemantics(
          isButton: true,
          hasEnabledState: true,
          isEnabled: false,
          hasTapAction: false,
        ),
      );
    });
  });

  group('style merging', () {
    test('an override wins only for the states it speaks to', () {
      final base = states<Color>(
        normal: const Color(0xFF000001),
        hovered: const Color(0xFF000002),
        disabled: const Color(0xFF000003),
      );
      final override = states<Color>(hovered: const Color(0xFFFF0000));

      final merged = mergeStateProperty(base, override)!;

      // The override only named hover, so the other states fall through.
      expect(merged.resolve({WidgetState.hovered}), const Color(0xFFFF0000));
      expect(merged.resolve({}), const Color(0xFF000001));
      expect(merged.resolve({WidgetState.disabled}), const Color(0xFF000003));
    });

    test('merging with null on either side is identity', () {
      final base = always<Color>(const Color(0xFF000001));
      expect(mergeStateProperty<Color>(base, null), same(base));
      expect(mergeStateProperty<Color>(null, base), same(base));
      expect(mergeStateProperty<Color>(null, null), isNull);
    });

    test('disabled outranks every other state', () {
      final property = states<Color>(
        normal: const Color(0xFF000001),
        hovered: const Color(0xFF000002),
        pressed: const Color(0xFF000003),
        disabled: const Color(0xFF000004),
      );
      expect(
        property.resolve({
          WidgetState.disabled,
          WidgetState.hovered,
          WidgetState.pressed,
        }),
        const Color(0xFF000004),
      );
    });

    test('pressed outranks hovered', () {
      final property = states<Color>(
        hovered: const Color(0xFF000002),
        pressed: const Color(0xFF000003),
      );
      expect(
        property.resolve({WidgetState.hovered, WidgetState.pressed}),
        const Color(0xFF000003),
      );
    });

    test('resolveOr falls back when nothing matches', () {
      expect(
        resolveOr<Color>(null, const {}, const Color(0xFF00FF00)),
        const Color(0xFF00FF00),
      );
      expect(
        resolveOr<Color>(
          states<Color>(hovered: const Color(0xFFFF0000)),
          const {},
          const Color(0xFF00FF00),
        ),
        const Color(0xFF00FF00),
      );
    });
  });
}
