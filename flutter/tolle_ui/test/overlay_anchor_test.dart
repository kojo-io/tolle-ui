/// End-to-end checks for the overlay layer.
///
/// The geometry is covered directly in compute_position_test.dart; what this
/// asserts is that a real overlay, laid out by Flutter against a real trigger,
/// ends up where the geometry says — that measure-then-place actually works
/// through `CustomSingleChildLayout`.
library;

import 'package:flutter/foundation.dart' show ValueListenable;
import 'package:flutter/services.dart' show LogicalKeyboardKey;
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tolle_ui/tolle_ui.dart';

const _screen = Size(800, 600);

/// `Overlay` only reads `initialEntries` once, so the entry's builder closure
/// is captured on the first pump. Driving `open` through a notifier the closure
/// reads keeps a rebuild reaching the widget under test.
Widget _app({
  required Alignment triggerAt,
  required ValueListenable<bool> open,
  Size overlaySize = const Size(200, 150),
  TollePlacement placement = const TollePlacement.bottom(),
  VoidCallback? onDismiss,
  TolleSizing sizing = const TolleSizing.disabled(),
}) {
  return Directionality(
    textDirection: TextDirection.ltr,
    child: MediaQuery(
      data: const MediaQueryData(size: _screen),
      child: Overlay(
        initialEntries: [
          OverlayEntry(
            builder: (context) => ValueListenableBuilder<bool>(
              valueListenable: open,
              builder: (context, isOpen, _) => Align(
                alignment: triggerAt,
                child: TolleOverlayAnchor(
                  open: isOpen,
                  placement: placement,
                  sizing: sizing,
                  onDismiss: onDismiss,
                  overlayBuilder: (context, position) => SizedBox(
                    key: const ValueKey('overlay'),
                    width: overlaySize.width,
                    height: overlaySize.height,
                    child: ColoredBox(
                      color: const Color(0xFF551A65),
                      child: Text('side:${position.placement.side.name}'),
                    ),
                  ),
                  child: const SizedBox(
                    key: ValueKey('trigger'),
                    width: 100,
                    height: 40,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

Rect _rectOf(WidgetTester tester, String key) {
  final finder = find.byKey(ValueKey(key));
  return tester.getRect(finder);
}

void main() {
  group('showing and hiding', () {
    testWidgets('nothing renders while closed', (tester) async {
      await tester.pumpWidget(
        _app(triggerAt: Alignment.center, open: ValueNotifier(false)),
      );
      await tester.pumpAndSettle();
      expect(find.byKey(const ValueKey('overlay')), findsNothing);
    });

    testWidgets('the overlay appears when opened', (tester) async {
      await tester.pumpWidget(
        _app(triggerAt: Alignment.center, open: ValueNotifier(true)),
      );
      await tester.pumpAndSettle();
      expect(find.byKey(const ValueKey('overlay')), findsOneWidget);
    });

    testWidgets('it disappears again when closed', (tester) async {
      // One notifier, toggled — a second pumpWidget with a fresh notifier
      // would never reach the captured entry builder.
      final open = ValueNotifier(true);
      addTearDown(open.dispose);

      await tester.pumpWidget(_app(triggerAt: Alignment.center, open: open));
      await tester.pumpAndSettle();
      expect(find.byKey(const ValueKey('overlay')), findsOneWidget);

      open.value = false;
      await tester.pumpAndSettle();
      expect(find.byKey(const ValueKey('overlay')), findsNothing);
    });
  });

  group('placement against real layout', () {
    testWidgets('opens below a centred trigger', (tester) async {
      await tester.pumpWidget(
        _app(triggerAt: Alignment.center, open: ValueNotifier(true)),
      );
      await tester.pumpAndSettle();

      final trigger = _rectOf(tester, 'trigger');
      final overlay = _rectOf(tester, 'overlay');

      expect(overlay.top, closeTo(trigger.bottom + 4, 0.01));
      expect(overlay.center.dx, closeTo(trigger.center.dx, 0.01));
    });

    testWidgets('flips above a trigger at the bottom edge', (tester) async {
      await tester.pumpWidget(
        _app(triggerAt: Alignment.bottomCenter, open: ValueNotifier(true)),
      );
      await tester.pumpAndSettle();

      final trigger = _rectOf(tester, 'trigger');
      final overlay = _rectOf(tester, 'overlay');

      expect(overlay.bottom, closeTo(trigger.top - 4, 0.01));
      // The builder is re-run with the resolved placement, so an arrow could
      // point the right way.
      expect(find.text('side:top'), findsOneWidget);
    });

    testWidgets('shifts inward at the left edge', (tester) async {
      await tester.pumpWidget(
        _app(triggerAt: Alignment.centerLeft, open: ValueNotifier(true)),
      );
      await tester.pumpAndSettle();

      final overlay = _rectOf(tester, 'overlay');
      expect(overlay.left, greaterThanOrEqualTo(8 - 0.01));
    });

    testWidgets('shifts inward at the right edge', (tester) async {
      await tester.pumpWidget(
        _app(triggerAt: Alignment.centerRight, open: ValueNotifier(true)),
      );
      await tester.pumpAndSettle();

      final overlay = _rectOf(tester, 'overlay');
      expect(overlay.right, lessThanOrEqualTo(_screen.width - 8 + 0.01));
    });

    testWidgets('stays on screen in every corner', (tester) async {
      for (final corner in [
        Alignment.topLeft,
        Alignment.topRight,
        Alignment.bottomLeft,
        Alignment.bottomRight,
      ]) {
        await tester.pumpWidget(
          _app(triggerAt: corner, open: ValueNotifier(true)),
        );
        await tester.pumpAndSettle();

        final overlay = _rectOf(tester, 'overlay');
        expect(overlay.left, greaterThanOrEqualTo(-0.01), reason: '$corner');
        expect(overlay.top, greaterThanOrEqualTo(-0.01), reason: '$corner');
        expect(
          overlay.right,
          lessThanOrEqualTo(_screen.width + 0.01),
          reason: '$corner',
        );
        expect(
          overlay.bottom,
          lessThanOrEqualTo(_screen.height + 0.01),
          reason: '$corner',
        );
      }
    });
  });

  group('sizing', () {
    testWidgets('matchAnchorWidth makes the overlay the trigger width', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          triggerAt: Alignment.center,
          open: ValueNotifier(true),
          sizing: const TolleSizing(enabled: true, matchAnchorWidth: true),
        ),
      );
      await tester.pumpAndSettle();

      final trigger = _rectOf(tester, 'trigger');
      final overlay = _rectOf(tester, 'overlay');
      expect(overlay.width, closeTo(trigger.width, 0.01));
    });

    testWidgets('tall content is capped to the space available', (
      tester,
    ) async {
      // 2000 tall in a 600 viewport: it must be constrained, not overflow.
      await tester.pumpWidget(
        _app(
          triggerAt: Alignment.center,
          open: ValueNotifier(true),
          overlaySize: const Size(200, 2000),
        ),
      );
      await tester.pumpAndSettle();

      final overlay = _rectOf(tester, 'overlay');
      expect(overlay.height, lessThan(_screen.height));
    });
  });

  group('dismissal', () {
    testWidgets('tapping outside dismisses', (tester) async {
      var dismissed = 0;
      await tester.pumpWidget(
        _app(
          triggerAt: Alignment.center,
          open: ValueNotifier(true),
          onDismiss: () => dismissed++,
        ),
      );
      await tester.pumpAndSettle();

      await tester.tapAt(const Offset(10, 10));
      await tester.pump();
      expect(dismissed, 1);
    });

    testWidgets('tapping the overlay itself does not dismiss', (tester) async {
      var dismissed = 0;
      await tester.pumpWidget(
        _app(
          triggerAt: Alignment.center,
          open: ValueNotifier(true),
          onDismiss: () => dismissed++,
        ),
      );
      await tester.pumpAndSettle();

      await tester.tapAt(_rectOf(tester, 'overlay').center);
      await tester.pump();
      expect(dismissed, 0);
    });

    testWidgets('Escape dismisses', (tester) async {
      var dismissed = 0;
      await tester.pumpWidget(
        _app(
          triggerAt: Alignment.center,
          open: ValueNotifier(true),
          onDismiss: () => dismissed++,
        ),
      );
      await tester.pumpAndSettle();

      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pump();
      expect(dismissed, 1);
    });
  });
}
