/// Positioning geometry for anchored overlays.
///
/// This is the Flutter replacement for `@floating-ui/dom`, which 15 components
/// in the Angular library depend on. Measured from that source, the middleware
/// actually in use is `offset`, `flip` and `shift` on all 15, `hide` and
/// `autoUpdate` on 13, and `size` on 7 — so those are what this reproduces.
/// Nothing in the Flutter ecosystem provides them, which makes this the single
/// largest piece of original work in the port.
///
/// Deliberately pure: it takes rectangles and returns a rectangle, with no
/// widgets, no build context and no side effects. Collision behaviour is the
/// part that is easy to get subtly wrong and painful to debug through a widget
/// tree, so it is tested directly instead.
library;

import 'dart:math' as math;
import 'dart:ui' show Offset, Rect, Size;

/// Which side of the anchor the overlay sits on.
enum TolleSide {
  top,
  right,
  bottom,
  left;

  /// The side directly across the anchor, used by [TolleFlip].
  TolleSide get opposite => switch (this) {
    TolleSide.top => TolleSide.bottom,
    TolleSide.bottom => TolleSide.top,
    TolleSide.left => TolleSide.right,
    TolleSide.right => TolleSide.left,
  };

  /// True when the overlay is placed above or below, so the main axis is
  /// vertical and the cross axis horizontal.
  bool get isVertical => this == TolleSide.top || this == TolleSide.bottom;
}

/// How the overlay lines up along the anchor's cross axis.
enum TolleAlign { start, center, end }

/// Where the overlay is placed relative to its anchor.
class TollePlacement {
  const TollePlacement(this.side, [this.align = TolleAlign.center]);

  const TollePlacement.top([this.align = TolleAlign.center])
    : side = TolleSide.top;
  const TollePlacement.bottom([this.align = TolleAlign.center])
    : side = TolleSide.bottom;
  const TollePlacement.left([this.align = TolleAlign.center])
    : side = TolleSide.left;
  const TollePlacement.right([this.align = TolleAlign.center])
    : side = TolleSide.right;

  final TolleSide side;
  final TolleAlign align;

  TollePlacement get flipped => TollePlacement(side.opposite, align);

  @override
  bool operator ==(Object other) =>
      other is TollePlacement && other.side == side && other.align == align;

  @override
  int get hashCode => Object.hash(side, align);

  @override
  String toString() => '${side.name}-${align.name}';
}

/// Flip behaviour: move to the opposite side when the preferred one overflows.
class TolleFlip {
  const TolleFlip({this.enabled = true, this.crossAxis = true});

  const TolleFlip.disabled() : enabled = false, crossAxis = false;

  final bool enabled;

  /// Also flip the alignment when the overlay overflows along the cross axis.
  ///
  /// Matches floating-ui's `crossAxis` option: a `bottom-start` menu that runs
  /// off the right edge becomes `bottom-end` rather than being slid by [shift],
  /// which keeps it visually attached to the correct end of its trigger.
  final bool crossAxis;
}

/// Shift behaviour: slide along the cross axis to stay inside the viewport.
class TolleShift {
  const TolleShift({this.enabled = true, this.limit = true});

  const TolleShift.disabled() : enabled = false, limit = false;

  final bool enabled;

  /// Stop shifting once the overlay would detach from the anchor.
  ///
  /// floating-ui's `limitShift`. Without it a tooltip on an anchor scrolled far
  /// off-screen stays pinned to the viewport edge, pointing at nothing.
  final bool limit;
}

/// Size behaviour: report the space available so the caller can constrain.
class TolleSizing {
  const TolleSizing({
    this.enabled = false,
    this.matchAnchorWidth = false,
    this.padding = 0,
  });

  const TolleSizing.disabled()
    : enabled = false,
      matchAnchorWidth = false,
      padding = 0;

  final bool enabled;

  /// Force the overlay's width to the anchor's, which is what a select
  /// dropdown wants and one of the reasons `size` appears 7 times on the
  /// Angular side.
  final bool matchAnchorWidth;

  /// Extra breathing room subtracted from the available space.
  final double padding;
}

/// The resolved position of an overlay.
class TolleOverlayPosition {
  const TolleOverlayPosition({
    required this.offset,
    required this.placement,
    required this.hidden,
    required this.availableWidth,
    required this.availableHeight,
    this.width,
    this.shiftedBy = 0,
  });

  /// Top-left of the overlay, in the same coordinate space as the inputs.
  final Offset offset;

  /// Where it actually ended up, after any flip. Read this to point an arrow.
  final TollePlacement placement;

  /// True when the anchor is entirely outside the viewport, so the overlay
  /// should be hidden rather than left pointing at nothing.
  final bool hidden;

  /// Space available on the resolved side, for a caller that wants to scroll
  /// its content rather than overflow.
  final double availableWidth;
  final double availableHeight;

  /// Set when [TolleSizing.matchAnchorWidth] is on.
  final double? width;

  /// How far [TolleShift] moved the overlay along the cross axis. An arrow
  /// must be moved back by this amount to stay over the anchor.
  final double shiftedBy;

  @override
  String toString() =>
      'TolleOverlayPosition($offset, $placement, hidden: $hidden, '
      'shiftedBy: $shiftedBy)';
}

/// Places [floating] against [anchor] inside [viewport].
///
/// All rectangles share one coordinate space; the result is in that space too.
/// [padding] is the minimum gap kept between the overlay and the viewport edge,
/// and [gap] the distance between the overlay and its anchor (floating-ui's
/// `offset`).
TolleOverlayPosition computeOverlayPosition({
  required Rect anchor,
  required Size floating,
  required Rect viewport,
  TollePlacement placement = const TollePlacement.bottom(),
  double gap = 4,
  double padding = 8,
  TolleFlip flip = const TolleFlip(),
  TolleShift shift = const TolleShift(),
  TolleSizing sizing = const TolleSizing.disabled(),
}) {
  final size = sizing.matchAnchorWidth
      ? Size(anchor.width, floating.height)
      : floating;

  var resolved = placement;

  // --- flip, main axis ------------------------------------------------------
  // Try the preferred side; if it overflows and the opposite side has more
  // room, use that instead. Comparing free space rather than simply taking the
  // first side that fits means a tooltip in a cramped viewport lands on the
  // roomier side rather than the first one tried.
  if (flip.enabled) {
    final preferred = _mainAxisFree(
      resolved.side,
      anchor,
      viewport,
      gap,
      padding,
    );
    final needed = resolved.side.isVertical ? size.height : size.width;
    if (preferred < needed) {
      final opposite = _mainAxisFree(
        resolved.side.opposite,
        anchor,
        viewport,
        gap,
        padding,
      );
      if (opposite > preferred) resolved = resolved.flipped;
    }
  }

  // --- flip, cross axis -----------------------------------------------------
  if (flip.enabled && flip.crossAxis && resolved.align != TolleAlign.center) {
    final trial = _place(anchor, size, resolved, gap);
    final overflows = resolved.side.isVertical
        ? (trial.dx < viewport.left + padding ||
              trial.dx + size.width > viewport.right - padding)
        : (trial.dy < viewport.top + padding ||
              trial.dy + size.height > viewport.bottom - padding);
    if (overflows) {
      final swapped = TollePlacement(
        resolved.side,
        resolved.align == TolleAlign.start ? TolleAlign.end : TolleAlign.start,
      );
      final alt = _place(anchor, size, swapped, gap);
      final altOverflows = resolved.side.isVertical
          ? (alt.dx < viewport.left + padding ||
                alt.dx + size.width > viewport.right - padding)
          : (alt.dy < viewport.top + padding ||
                alt.dy + size.height > viewport.bottom - padding);
      if (!altOverflows) resolved = swapped;
    }
  }

  var offset = _place(anchor, size, resolved, gap);

  // --- shift ----------------------------------------------------------------
  var shiftedBy = 0.0;
  if (shift.enabled) {
    if (resolved.side.isVertical) {
      final min = viewport.left + padding;
      final max = viewport.right - padding - size.width;
      // When the overlay is wider than the viewport, clamping would invert the
      // bounds and throw; pin to the leading edge instead.
      final target = max < min ? min : offset.dx.clamp(min, max);
      var dx = target - offset.dx;
      if (shift.limit) dx = _limit(dx, anchor.width, size.width);
      shiftedBy = dx;
      offset = Offset(offset.dx + dx, offset.dy);
    } else {
      final min = viewport.top + padding;
      final max = viewport.bottom - padding - size.height;
      final target = max < min ? min : offset.dy.clamp(min, max);
      var dy = target - offset.dy;
      if (shift.limit) dy = _limit(dy, anchor.height, size.height);
      shiftedBy = dy;
      offset = Offset(offset.dx, offset.dy + dy);
    }
  }

  // --- size -----------------------------------------------------------------
  final availableMain =
      _mainAxisFree(resolved.side, anchor, viewport, gap, padding) -
      sizing.padding;
  final availableCross = resolved.side.isVertical
      ? viewport.width - padding * 2
      : viewport.height - padding * 2;

  return TolleOverlayPosition(
    offset: offset,
    placement: resolved,
    hidden: !anchor.overlaps(viewport),
    availableWidth: math.max(
      0,
      resolved.side.isVertical ? availableCross : availableMain,
    ),
    availableHeight: math.max(
      0,
      resolved.side.isVertical ? availableMain : availableCross,
    ),
    width: sizing.matchAnchorWidth ? anchor.width : null,
    shiftedBy: shiftedBy,
  );
}

/// Free space on [side] of the anchor, after the gap and viewport padding.
double _mainAxisFree(
  TolleSide side,
  Rect anchor,
  Rect viewport,
  double gap,
  double padding,
) {
  return switch (side) {
    TolleSide.top => anchor.top - viewport.top - gap - padding,
    TolleSide.bottom => viewport.bottom - anchor.bottom - gap - padding,
    TolleSide.left => anchor.left - viewport.left - gap - padding,
    TolleSide.right => viewport.right - anchor.right - gap - padding,
  };
}

/// The unclamped top-left for a placement.
Offset _place(Rect anchor, Size size, TollePlacement placement, double gap) {
  final double main = switch (placement.side) {
    TolleSide.top => anchor.top - size.height - gap,
    TolleSide.bottom => anchor.bottom + gap,
    TolleSide.left => anchor.left - size.width - gap,
    TolleSide.right => anchor.right + gap,
  };

  if (placement.side.isVertical) {
    final dx = switch (placement.align) {
      TolleAlign.start => anchor.left,
      TolleAlign.center => anchor.center.dx - size.width / 2,
      TolleAlign.end => anchor.right - size.width,
    };
    return Offset(dx, main);
  }

  final dy = switch (placement.align) {
    TolleAlign.start => anchor.top,
    TolleAlign.center => anchor.center.dy - size.height / 2,
    TolleAlign.end => anchor.bottom - size.height,
  };
  return Offset(main, dy);
}

/// Caps a shift so the overlay never fully detaches from its anchor.
///
/// floating-ui's `limitShift`: once the overlay's trailing edge would clear the
/// anchor, further shifting is pointless — it is no longer pointing at
/// anything — so the movement is capped at that boundary.
double _limit(double delta, double anchorExtent, double floatingExtent) {
  final max = (anchorExtent + floatingExtent) / 2;
  return delta.clamp(-max, max);
}
