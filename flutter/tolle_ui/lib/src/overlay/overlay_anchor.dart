/// The widget layer over [computeOverlayPosition].
///
/// Positioning needs the overlay's measured size before it can decide where to
/// put it — that is what `flip` and `shift` are reasoning about. Flutter's
/// `CompositedTransformFollower` applies a transform at paint time and never
/// sees layout, so it cannot express this. A [CustomSingleChildLayout] can:
/// its delegate is handed the child's size and returns the offset, which is
/// exactly floating-ui's measure-then-place flow.
library;

import 'package:flutter/scheduler.dart' show SchedulerBinding, SchedulerPhase;
import 'package:flutter/services.dart' show LogicalKeyboardKey;
import 'package:flutter/widgets.dart';

import 'compute_position.dart';

/// Anchors a floating [overlay] to a trigger [child].
///
/// Handles placement, collision, dismissal and keeping up with a moving anchor.
/// The 17 overlay components plus select, combobox and the date pickers all sit
/// on this — roughly 28 of the 117.
class TolleOverlayAnchor extends StatefulWidget {
  const TolleOverlayAnchor({
    super.key,
    required this.child,
    required this.overlayBuilder,
    required this.open,
    this.placement = const TollePlacement.bottom(),
    this.gap = 4,
    this.viewportPadding = 8,
    this.flip = const TolleFlip(),
    this.shift = const TolleShift(),
    this.sizing = const TolleSizing.disabled(),
    this.onDismiss,
    this.dismissOnTapOutside = true,
    this.dismissOnEscape = true,
    this.moveFocusToOverlay = true,
    this.constrainToAvailableSpace = true,
  });

  /// The trigger.
  final Widget child;

  /// Builds the floating content. Receives the resolved position so an arrow
  /// can point the right way and compensate for any shift.
  final Widget Function(BuildContext context, TolleOverlayPosition position)
  overlayBuilder;

  final bool open;
  final TollePlacement placement;
  final double gap;
  final double viewportPadding;
  final TolleFlip flip;
  final TolleShift shift;
  final TolleSizing sizing;

  final VoidCallback? onDismiss;
  final bool dismissOnTapOutside;
  final bool dismissOnEscape;

  /// Move focus into the overlay when it opens.
  ///
  /// Right for anything the user interacts with — a menu, a dialog, a select
  /// list — and also what makes Escape reachable, since key events follow
  /// focus. Turn it off for passive overlays like tooltips, which must never
  /// take focus away from the control that spawned them.
  final bool moveFocusToOverlay;

  /// Cap the overlay's height to the space available, so long content scrolls
  /// rather than running off screen.
  final bool constrainToAvailableSpace;

  @override
  State<TolleOverlayAnchor> createState() => _TolleOverlayAnchorState();
}

class _TolleOverlayAnchorState extends State<TolleOverlayAnchor>
    with WidgetsBindingObserver {
  final _controller = OverlayPortalController();
  final _anchorKey = GlobalKey();

  /// Drives relayout of the floating child without rebuilding the trigger.
  final _anchorRect = ValueNotifier<Rect?>(null);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    if (widget.open) _controller.show();
    _scheduleMeasure();
  }

  @override
  void didUpdateWidget(TolleOverlayAnchor oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.open != oldWidget.open) _syncVisibility();
    _scheduleMeasure();
  }

  /// Shows or hides the portal, deferring if a frame is already building.
  ///
  /// `OverlayPortalController` asserts when toggled during the persistent
  /// callbacks phase, and `didUpdateWidget` runs inside it — so a parent that
  /// simply rebuilds with a new `open` would crash. Deferring to the end of the
  /// frame costs one frame of latency and is the supported way to do this.
  void _syncVisibility() {
    void apply() {
      if (!mounted) return;
      if (widget.open) {
        _controller.show();
      } else {
        _controller.hide();
      }
    }

    if (SchedulerBinding.instance.schedulerPhase ==
        SchedulerPhase.persistentCallbacks) {
      WidgetsBinding.instance.addPostFrameCallback((_) => apply());
    } else {
      apply();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _anchorRect.dispose();
    super.dispose();
  }

  /// The `autoUpdate` equivalent: a window resize moves the anchor.
  @override
  void didChangeMetrics() => _scheduleMeasure();

  void _scheduleMeasure() {
    WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
  }

  void _measure() {
    if (!mounted) return;
    final box = _anchorKey.currentContext?.findRenderObject() as RenderBox?;
    if (box == null || !box.hasSize || !box.attached) return;
    final rect = box.localToGlobal(Offset.zero) & box.size;
    if (rect != _anchorRect.value) _anchorRect.value = rect;
  }

  void _dismiss() => widget.onDismiss?.call();

  @override
  Widget build(BuildContext context) {
    // A scroll anywhere above the trigger moves it, which is the other half of
    // `autoUpdate`. Measuring on the notification keeps the overlay attached
    // without polling every frame.
    return NotificationListener<ScrollNotification>(
      onNotification: (_) {
        _measure();
        return false;
      },
      child: OverlayPortal(
        controller: _controller,
        overlayChildBuilder: _buildOverlay,
        child: KeyedSubtree(key: _anchorKey, child: widget.child),
      ),
    );
  }

  Widget _buildOverlay(BuildContext context) {
    return ValueListenableBuilder<Rect?>(
      valueListenable: _anchorRect,
      builder: (context, anchor, _) {
        if (anchor == null) return const SizedBox.shrink();

        Widget floating = _PositionedOverlay(
          anchor: anchor,
          placement: widget.placement,
          gap: widget.gap,
          viewportPadding: widget.viewportPadding,
          flip: widget.flip,
          shift: widget.shift,
          sizing: widget.sizing,
          constrain: widget.constrainToAvailableSpace,
          overlayBuilder: widget.overlayBuilder,
        );

        if (widget.dismissOnEscape) {
          floating = Shortcuts(
            shortcuts: const {
              SingleActivator(LogicalKeyboardKey.escape): DismissIntent(),
            },
            child: Actions(
              actions: {
                DismissIntent: CallbackAction<DismissIntent>(
                  onInvoke: (_) {
                    _dismiss();
                    return null;
                  },
                ),
              },
              child: FocusScope(
                autofocus: widget.moveFocusToOverlay,
                child: floating,
              ),
            ),
          );
        }

        if (!widget.dismissOnTapOutside) return floating;

        // A full-screen listener behind the overlay. `HitTestBehavior.translucent`
        // keeps the overlay itself hittable — a taller barrier stacked in front
        // would swallow the content's own gestures.
        return Stack(
          children: [
            Positioned.fill(
              child: GestureDetector(
                behavior: HitTestBehavior.translucent,
                onTap: _dismiss,
              ),
            ),
            floating,
          ],
        );
      },
    );
  }
}

/// Lays the floating child out against a known anchor rect.
class _PositionedOverlay extends StatelessWidget {
  const _PositionedOverlay({
    required this.anchor,
    required this.placement,
    required this.gap,
    required this.viewportPadding,
    required this.flip,
    required this.shift,
    required this.sizing,
    required this.constrain,
    required this.overlayBuilder,
  });

  final Rect anchor;
  final TollePlacement placement;
  final double gap;
  final double viewportPadding;
  final TolleFlip flip;
  final TolleShift shift;
  final TolleSizing sizing;
  final bool constrain;
  final Widget Function(BuildContext, TolleOverlayPosition) overlayBuilder;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final viewport = Offset.zero & constraints.biggest;

        // Resolving the final placement needs the child's measured size, which
        // is only known inside the delegate. To let the child measure sensibly
        // first, it is given the best case — the roomier of the two sides —
        // and the delegate does the real placement afterwards.
        final position = computeOverlayPosition(
          anchor: anchor,
          floating: Size.zero,
          viewport: viewport,
          placement: placement,
          gap: gap,
          padding: viewportPadding,
          flip: flip,
          shift: shift,
          sizing: sizing,
        );

        if (position.hidden) return const SizedBox.shrink();

        return CustomSingleChildLayout(
          delegate: _OverlayLayoutDelegate(
            anchor: anchor,
            placement: placement,
            gap: gap,
            viewportPadding: viewportPadding,
            flip: flip,
            shift: shift,
            sizing: sizing,
            constrain: constrain,
          ),
          child: Builder(
            // The builder re-runs with the delegate's resolved position via an
            // inherited widget rather than a second layout pass.
            builder: (context) => _OverlayPositionScope(
              position: position,
              anchor: anchor,
              viewport: viewport,
              gap: gap,
              viewportPadding: viewportPadding,
              placement: placement,
              flip: flip,
              shift: shift,
              sizing: sizing,
              builder: overlayBuilder,
            ),
          ),
        );
      },
    );
  }
}

/// Recomputes the position once the content's size is known, so the builder
/// receives the placement the overlay actually ended up in.
class _OverlayPositionScope extends StatefulWidget {
  const _OverlayPositionScope({
    required this.position,
    required this.anchor,
    required this.viewport,
    required this.gap,
    required this.viewportPadding,
    required this.placement,
    required this.flip,
    required this.shift,
    required this.sizing,
    required this.builder,
  });

  final TolleOverlayPosition position;
  final Rect anchor;
  final Rect viewport;
  final double gap;
  final double viewportPadding;
  final TollePlacement placement;
  final TolleFlip flip;
  final TolleShift shift;
  final TolleSizing sizing;
  final Widget Function(BuildContext, TolleOverlayPosition) builder;

  @override
  State<_OverlayPositionScope> createState() => _OverlayPositionScopeState();
}

class _OverlayPositionScopeState extends State<_OverlayPositionScope> {
  TolleOverlayPosition? _resolved;

  @override
  Widget build(BuildContext context) {
    // First pass renders with the provisional position; once the box has a
    // size, the exact placement is known and the builder is re-run with it.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final box = context.findRenderObject() as RenderBox?;
      if (box == null || !box.hasSize) return;
      final exact = computeOverlayPosition(
        anchor: widget.anchor,
        floating: box.size,
        viewport: widget.viewport,
        placement: widget.placement,
        gap: widget.gap,
        padding: widget.viewportPadding,
        flip: widget.flip,
        shift: widget.shift,
        sizing: widget.sizing,
      );
      if (exact.placement != (_resolved ?? widget.position).placement ||
          exact.shiftedBy != (_resolved ?? widget.position).shiftedBy) {
        setState(() => _resolved = exact);
      }
    });

    return widget.builder(context, _resolved ?? widget.position);
  }
}

class _OverlayLayoutDelegate extends SingleChildLayoutDelegate {
  const _OverlayLayoutDelegate({
    required this.anchor,
    required this.placement,
    required this.gap,
    required this.viewportPadding,
    required this.flip,
    required this.shift,
    required this.sizing,
    required this.constrain,
  });

  final Rect anchor;
  final TollePlacement placement;
  final double gap;
  final double viewportPadding;
  final TolleFlip flip;
  final TolleShift shift;
  final TolleSizing sizing;
  final bool constrain;

  @override
  BoxConstraints getConstraintsForChild(BoxConstraints constraints) {
    final viewport = Offset.zero & constraints.biggest;

    if (!constrain) {
      return sizing.matchAnchorWidth
          ? BoxConstraints.tightFor(width: anchor.width)
          : constraints.loosen();
    }

    // The child measures against the best case — the roomier side — because the
    // side it lands on is not decided until its size is known.
    final above = anchor.top - viewport.top - gap - viewportPadding;
    final below = viewport.bottom - anchor.bottom - gap - viewportPadding;
    final maxHeight = (placement.side.isVertical
        ? (above > below ? above : below)
        : viewport.height - viewportPadding * 2);

    return BoxConstraints(
      minWidth: sizing.matchAnchorWidth ? anchor.width : 0,
      maxWidth: sizing.matchAnchorWidth
          ? anchor.width
          : (viewport.width - viewportPadding * 2).clamp(0.0, double.infinity),
      maxHeight: maxHeight.clamp(0.0, double.infinity),
    );
  }

  @override
  Offset getPositionForChild(Size size, Size childSize) {
    return computeOverlayPosition(
      anchor: anchor,
      floating: childSize,
      viewport: Offset.zero & size,
      placement: placement,
      gap: gap,
      padding: viewportPadding,
      flip: flip,
      shift: shift,
      sizing: sizing,
    ).offset;
  }

  @override
  bool shouldRelayout(_OverlayLayoutDelegate old) =>
      old.anchor != anchor ||
      old.placement != placement ||
      old.gap != gap ||
      old.viewportPadding != viewportPadding ||
      old.constrain != constrain;
}
