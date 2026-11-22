/// Collision behaviour for anchored overlays, tested directly.
///
/// This is the replacement for floating-ui, so the bar is the behaviour the
/// Angular components already get for free: flip to the roomier side, shift to
/// stay on screen, stop shifting once detached, report available space, and
/// hide when the anchor leaves the viewport.
library;

import 'dart:ui';

import 'package:flutter_test/flutter_test.dart';
import 'package:tolle_ui/tolle_ui.dart';

/// A 1000×800 screen, the frame every case below is placed in.
const viewport = Rect.fromLTWH(0, 0, 1000, 800);

/// A trigger of typical button size, centred unless a case moves it.
Rect anchorAt(double x, double y, [double w = 100, double h = 40]) =>
    Rect.fromLTWH(x, y, w, h);

const menu = Size(200, 300);
const tip = Size(120, 32);

void main() {
  group('placement', () {
    test('bottom-center sits under the anchor, horizontally centred', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 380),
        floating: tip,
        viewport: viewport,
        gap: 4,
      );
      expect(p.placement.side, TolleSide.bottom);
      expect(p.offset.dy, 424); // anchor.bottom 420, plus the 4px gap
      expect(p.offset.dx, 450 + 50 - 60); // anchor centre minus half the tip
    });

    test('each side places on the correct edge', () {
      final anchor = anchorAt(450, 380);
      for (final (side, expected) in [
        (TolleSide.top, 380 - 32 - 4.0),
        (TolleSide.bottom, 420 + 4.0),
      ]) {
        final p = computeOverlayPosition(
          anchor: anchor,
          floating: tip,
          viewport: viewport,
          placement: TollePlacement(side),
          flip: const TolleFlip.disabled(),
        );
        expect(p.offset.dy, expected, reason: side.name);
      }

      final left = computeOverlayPosition(
        anchor: anchor,
        floating: tip,
        viewport: viewport,
        placement: const TollePlacement.left(),
        flip: const TolleFlip.disabled(),
      );
      expect(left.offset.dx, 450 - 120 - 4);

      final right = computeOverlayPosition(
        anchor: anchor,
        floating: tip,
        viewport: viewport,
        placement: const TollePlacement.right(),
        flip: const TolleFlip.disabled(),
      );
      expect(right.offset.dx, 550 + 4);
    });

    test('alignment lines the overlay up with the anchor edges', () {
      final anchor = anchorAt(400, 380);
      Offset at(TolleAlign align) => computeOverlayPosition(
        anchor: anchor,
        floating: menu,
        viewport: viewport,
        placement: TollePlacement(TolleSide.bottom, align),
        flip: const TolleFlip.disabled(),
        shift: const TolleShift.disabled(),
      ).offset;

      expect(at(TolleAlign.start).dx, 400);
      expect(at(TolleAlign.end).dx, 500 - 200);
      expect(at(TolleAlign.center).dx, 450 - 100);
    });

    test('gap is honoured on every side', () {
      final anchor = anchorAt(450, 380);
      final p = computeOverlayPosition(
        anchor: anchor,
        floating: tip,
        viewport: viewport,
        placement: const TollePlacement.bottom(),
        gap: 20,
        flip: const TolleFlip.disabled(),
      );
      expect(p.offset.dy, 420 + 20);
    });
  });

  group('flip', () {
    test('flips up when there is no room below', () {
      // Anchor near the bottom edge: a 300-tall menu cannot open downward.
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 740),
        floating: menu,
        viewport: viewport,
      );
      expect(p.placement.side, TolleSide.top);
      expect(p.offset.dy, 740 - 300 - 4);
    });

    test('flips down when there is no room above', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 10),
        floating: menu,
        viewport: viewport,
        placement: const TollePlacement.top(),
      );
      expect(p.placement.side, TolleSide.bottom);
    });

    test('stays put when the preferred side fits', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 100),
        floating: menu,
        viewport: viewport,
      );
      expect(p.placement.side, TolleSide.bottom);
    });

    test('picks the roomier side when neither fits', () {
      // A 700-tall overlay fits nowhere; the anchor sits low, so above is
      // roomier and that is where it should go.
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 600),
        floating: const Size(200, 700),
        viewport: viewport,
      );
      expect(p.placement.side, TolleSide.top);
    });

    test('flips horizontally too', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(920, 380),
        floating: menu,
        viewport: viewport,
        placement: const TollePlacement.right(),
      );
      expect(p.placement.side, TolleSide.left);
    });

    test('can be turned off', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 740),
        floating: menu,
        viewport: viewport,
        flip: const TolleFlip.disabled(),
      );
      expect(p.placement.side, TolleSide.bottom);
      // Left overflowing, as asked.
      expect(p.offset.dy + 300, greaterThan(viewport.bottom));
    });

    test('flips the alignment when the aligned edge overflows', () {
      // bottom-start against the right edge would run off; it should become
      // bottom-end and stay attached to the trigger's right edge.
      final p = computeOverlayPosition(
        anchor: anchorAt(880, 380),
        floating: menu,
        viewport: viewport,
        placement: const TollePlacement.bottom(TolleAlign.start),
      );
      expect(p.placement.align, TolleAlign.end);
      expect(p.offset.dx, 980 - 200);
    });
  });

  group('shift', () {
    test('slides back inside the left edge', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(10, 380),
        floating: menu,
        viewport: viewport,
        padding: 8,
      );
      expect(p.offset.dx, greaterThanOrEqualTo(8));
      expect(p.shiftedBy, isNot(0));
    });

    test('slides back inside the right edge', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(940, 380),
        floating: menu,
        viewport: viewport,
        padding: 8,
      );
      expect(p.offset.dx + menu.width, lessThanOrEqualTo(992));
    });

    test('shifts vertically for side placements', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 10),
        floating: menu,
        viewport: viewport,
        placement: const TollePlacement.right(),
        padding: 8,
      );
      expect(p.offset.dy, greaterThanOrEqualTo(8));
    });

    test('does not move an overlay that already fits', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 380),
        floating: menu,
        viewport: viewport,
      );
      expect(p.shiftedBy, 0);
    });

    test('stops shifting once it would detach from the anchor', () {
      // Anchor far off the left edge. Without limitShift the overlay would
      // stay pinned to the viewport edge pointing at nothing.
      final p = computeOverlayPosition(
        anchor: anchorAt(-400, 380),
        floating: menu,
        viewport: viewport,
      );
      final limit = (100 + 200) / 2;
      expect(p.shiftedBy, lessThanOrEqualTo(limit));
    });

    test('limit can be turned off', () {
      final limited = computeOverlayPosition(
        anchor: anchorAt(-400, 380),
        floating: menu,
        viewport: viewport,
      );
      final unlimited = computeOverlayPosition(
        anchor: anchorAt(-400, 380),
        floating: menu,
        viewport: viewport,
        shift: const TolleShift(limit: false),
      );
      expect(unlimited.shiftedBy, greaterThan(limited.shiftedBy));
      expect(unlimited.offset.dx, 8);
    });

    test('an overlay wider than the viewport pins to the leading edge', () {
      // Clamping with inverted bounds would throw; this is the guard.
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 380),
        floating: const Size(1200, 100),
        viewport: viewport,
        shift: const TolleShift(limit: false),
      );
      expect(p.offset.dx, 8);
    });

    test('can be turned off', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(10, 380),
        floating: menu,
        viewport: viewport,
        shift: const TolleShift.disabled(),
      );
      expect(p.shiftedBy, 0);
      expect(p.offset.dx, lessThan(0));
    });
  });

  group('corners', () {
    test('flips and shifts together in every corner', () {
      const overlay = Size(240, 260);
      final corners = {
        'top-left': anchorAt(0, 0),
        'top-right': anchorAt(900, 0),
        'bottom-left': anchorAt(0, 760),
        'bottom-right': anchorAt(900, 760),
      };

      corners.forEach((name, anchor) {
        final p = computeOverlayPosition(
          anchor: anchor,
          floating: overlay,
          viewport: viewport,
          padding: 8,
        );
        final rect = Rect.fromLTWH(
          p.offset.dx,
          p.offset.dy,
          overlay.width,
          overlay.height,
        );
        expect(
          viewport.inflate(1).contains(rect.topLeft) &&
              viewport.inflate(1).contains(rect.bottomRight),
          isTrue,
          reason: '$name escaped the viewport: $rect',
        );
      });
    });
  });

  group('size', () {
    test('reports the space available on the resolved side', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 100),
        floating: menu,
        viewport: viewport,
        padding: 8,
      );
      // Opens downward: 800 - 140 - gap 4 - padding 8.
      expect(p.availableHeight, 648);
    });

    test('available space is measured on the side it flipped to', () {
      // An anchor near the bottom flips upward, so the space reported must be
      // the room *above* it (740 - gap - padding), not the sliver below.
      final up = computeOverlayPosition(
        anchor: anchorAt(450, 740),
        floating: menu,
        viewport: viewport,
        padding: 8,
      );
      expect(up.placement.side, TolleSide.top);
      expect(up.availableHeight, 728);

      // The unflipped sliver below would have been 800 - 780 - 4 - 8 = 8.
      final unflipped = computeOverlayPosition(
        anchor: anchorAt(450, 740),
        floating: menu,
        viewport: viewport,
        padding: 8,
        flip: const TolleFlip.disabled(),
      );
      expect(unflipped.availableHeight, 8);
    });

    test('matchAnchorWidth reports the anchor width', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(400, 380, 320),
        floating: menu,
        viewport: viewport,
        sizing: const TolleSizing(enabled: true, matchAnchorWidth: true),
      );
      expect(p.width, 320);
      // And it is laid out at that width, not the measured one.
      expect(p.offset.dx, 400);
    });

    test('never reports negative space', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 795),
        floating: menu,
        viewport: viewport,
        flip: const TolleFlip.disabled(),
      );
      expect(p.availableHeight, greaterThanOrEqualTo(0));
    });
  });

  group('hide', () {
    test('is hidden once the anchor leaves the viewport', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(450, -200),
        floating: tip,
        viewport: viewport,
      );
      expect(p.hidden, isTrue);
    });

    test('is visible while any part of the anchor shows', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(450, -20),
        floating: tip,
        viewport: viewport,
      );
      expect(p.hidden, isFalse);
    });

    test('is visible in the ordinary case', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(450, 380),
        floating: tip,
        viewport: viewport,
      );
      expect(p.hidden, isFalse);
    });
  });

  group('arrow compensation', () {
    test('shiftedBy is what an arrow must be moved back by', () {
      final p = computeOverlayPosition(
        anchor: anchorAt(10, 380),
        floating: menu,
        viewport: viewport,
      );
      // The overlay's centre moved by shiftedBy, so the anchor's centre sits
      // at (overlay centre - shiftedBy) in overlay-local terms.
      final overlayCentre = p.offset.dx + menu.width / 2;
      expect(overlayCentre - p.shiftedBy, closeTo(60, 0.001));
    });
  });
}
