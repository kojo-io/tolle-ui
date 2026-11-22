/// Interaction state tracking, shared by every pressable component.
///
/// The Angular components are real `<button>`s and `<input>`s, so hover, focus
/// ring, active press and disabled semantics come free from the browser. None
/// of that is free in Flutter, and Material's `InkWell` brings a ripple and a
/// Material ancestor requirement that this library does not want. This is the
/// small replacement: it tracks the states, exposes them as a [WidgetState]
/// set, and handles pointer, keyboard and accessibility activation.
library;

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

/// Tracks hover, focus, press, disabled and selected, and rebuilds [builder]
/// with the current state set.
///
/// Keyboard activation is included deliberately: Enter and Space fire [onTap]
/// exactly as a native button does, which is the behaviour the browser was
/// providing on the Angular side. Losing it is the most common way a ported
/// control silently stops being keyboard-operable.
class TolleInteractionDetector extends StatefulWidget {
  const TolleInteractionDetector({
    super.key,
    required this.builder,
    this.onTap,
    this.onLongPress,
    this.onFocusChange,
    this.enabled = true,
    this.selected = false,
    this.focusNode,
    this.autofocus = false,
    this.canRequestFocus = true,
    this.mouseCursor,
    this.behavior = HitTestBehavior.opaque,
    this.semanticLabel,
    this.isSemanticButton = true,
    this.excludeFromSemantics = false,
    this.statesController,
  });

  /// Rebuilt whenever the state set changes.
  final Widget Function(BuildContext context, Set<WidgetState> states) builder;

  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final ValueChanged<bool>? onFocusChange;

  /// When false, adds [WidgetState.disabled], blocks activation, and stops the
  /// control taking focus.
  final bool enabled;

  /// When true, adds [WidgetState.selected].
  final bool selected;

  final FocusNode? focusNode;
  final bool autofocus;
  final bool canRequestFocus;

  /// Defaults to a click cursor when actionable and a basic cursor when not.
  final MouseCursor? mouseCursor;

  final HitTestBehavior behavior;
  final String? semanticLabel;

  /// Whether to announce this as a button. Set false for pressable surfaces
  /// that are not buttons — a list row, a card — so screen readers do not
  /// promise an action that is not there.
  final bool isSemanticButton;

  final bool excludeFromSemantics;

  /// Supply one to observe or drive the states from outside.
  final WidgetStatesController? statesController;

  @override
  State<TolleInteractionDetector> createState() =>
      _TolleInteractionDetectorState();
}

class _TolleInteractionDetectorState extends State<TolleInteractionDetector> {
  WidgetStatesController? _internalController;
  WidgetStatesController get _controller =>
      widget.statesController ??
      (_internalController ??= WidgetStatesController());

  bool get _actionable => widget.enabled && widget.onTap != null;

  @override
  void initState() {
    super.initState();
    _controller
      ..update(WidgetState.disabled, !widget.enabled)
      ..update(WidgetState.selected, widget.selected);
    _controller.addListener(_onStatesChanged);
  }

  @override
  void didUpdateWidget(TolleInteractionDetector oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.statesController != oldWidget.statesController) {
      oldWidget.statesController?.removeListener(_onStatesChanged);
      _internalController?.removeListener(_onStatesChanged);
      _controller.addListener(_onStatesChanged);
    }
    if (widget.enabled != oldWidget.enabled) {
      _controller.update(WidgetState.disabled, !widget.enabled);
      // A control disabled mid-press or mid-hover would otherwise keep those
      // states and render as active while refusing input.
      if (!widget.enabled) {
        _controller
          ..update(WidgetState.pressed, false)
          ..update(WidgetState.hovered, false);
      }
    }
    if (widget.selected != oldWidget.selected) {
      _controller.update(WidgetState.selected, widget.selected);
    }
  }

  @override
  void dispose() {
    widget.statesController?.removeListener(_onStatesChanged);
    _internalController?.removeListener(_onStatesChanged);
    _internalController?.dispose();
    super.dispose();
  }

  void _onStatesChanged() {
    if (mounted) setState(() {});
  }

  void _handleTap() {
    if (!_actionable) return;
    widget.onTap!.call();
  }

  void _handleFocusChange(bool focused) {
    _controller.update(WidgetState.focused, focused);
    widget.onFocusChange?.call(focused);
  }

  @override
  Widget build(BuildContext context) {
    final states = _controller.value;

    Widget result = widget.builder(context, states);

    result = GestureDetector(
      behavior: widget.behavior,
      // The Semantics wrapper below owns the tap action for assistive tech.
      // Left on, this would contribute a second, nested tap node.
      excludeFromSemantics: true,
      onTap: _actionable ? _handleTap : null,
      onLongPress: widget.enabled && widget.onLongPress != null
          ? widget.onLongPress
          : null,
      onTapDown: _actionable
          ? (_) => _controller.update(WidgetState.pressed, true)
          : null,
      onTapUp: _actionable
          ? (_) => _controller.update(WidgetState.pressed, false)
          : null,
      onTapCancel: _actionable
          ? () => _controller.update(WidgetState.pressed, false)
          : null,
      child: result,
    );

    result = MouseRegion(
      cursor:
          widget.mouseCursor ??
          (_actionable ? SystemMouseCursors.click : MouseCursor.defer),
      onEnter: (_) {
        if (widget.enabled) _controller.update(WidgetState.hovered, true);
      },
      onExit: (_) => _controller.update(WidgetState.hovered, false),
      child: result,
    );

    result = FocusableActionDetector(
      enabled: widget.enabled && widget.canRequestFocus,
      focusNode: widget.focusNode,
      autofocus: widget.autofocus,
      onFocusChange: _handleFocusChange,
      // Hover is handled by the MouseRegion above so that a disabled control
      // registers no hover at all; leaving it on here too would double-count.
      mouseCursor: MouseCursor.defer,
      shortcuts: const {
        SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
        SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        SingleActivator(LogicalKeyboardKey.numpadEnter): ActivateIntent(),
      },
      actions: {
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (_) {
            _handleTap();
            return null;
          },
        ),
      },
      child: result,
    );

    if (widget.excludeFromSemantics) return result;

    // MergeSemantics collapses the focus node and the content into the single
    // node a control should present. Without it a screen reader walks into a
    // focusable child inside the button and announces the pair separately.
    return MergeSemantics(
      child: Semantics(
        container: true,
        button: widget.isSemanticButton,
        enabled: widget.enabled,
        selected: widget.selected ? true : null,
        label: widget.semanticLabel,
        onTap: _actionable ? _handleTap : null,
        child: result,
      ),
    );
  }
}

/// A focus ring drawn outside the child's bounds.
///
/// Mirrors `focus-visible:ring-2 ring-ring ring-offset-2` — the ring the
/// Angular components share. Two details carry across from the web build:
///
/// * The default width is 3px, not 2px. `theme.css` overrides Tailwind's
///   `.ring-2` to `--tw-ring-width: 3px`, so 3 is what actually renders.
/// * It is `focus-visible`, not `focus`. The ring appears for keyboard focus
///   and stays hidden when focus arrives by pointer or touch, which is why
///   this listens to [FocusManager.highlightMode] rather than trusting
///   [WidgetState.focused] alone. Set [onlyWhenKeyboard] false to opt out.
///
/// Drawn as a foreground painter rather than a border so appearing never
/// changes layout.
class TolleFocusRing extends StatefulWidget {
  const TolleFocusRing({
    super.key,
    required this.visible,
    required this.color,
    required this.borderRadius,
    this.width = 3.0,
    this.offset = 2.0,
    this.onlyWhenKeyboard = true,
    required this.child,
  });

  /// Whether the control is focused at all.
  final bool visible;

  final Color color;
  final BorderRadius borderRadius;
  final double width;

  /// Gap between the child's edge and the ring.
  final double offset;

  /// Restricts the ring to keyboard focus, matching CSS `:focus-visible`.
  final bool onlyWhenKeyboard;

  final Widget child;

  @override
  State<TolleFocusRing> createState() => _TolleFocusRingState();
}

class _TolleFocusRingState extends State<TolleFocusRing> {
  late FocusHighlightMode _mode;

  @override
  void initState() {
    super.initState();
    _mode = FocusManager.instance.highlightMode;
    FocusManager.instance.addHighlightModeListener(_onHighlightModeChanged);
  }

  @override
  void dispose() {
    FocusManager.instance.removeHighlightModeListener(_onHighlightModeChanged);
    super.dispose();
  }

  void _onHighlightModeChanged(FocusHighlightMode mode) {
    if (mounted && mode != _mode) setState(() => _mode = mode);
  }

  bool get _shouldPaint {
    if (!widget.visible) return false;
    if (!widget.onlyWhenKeyboard) return true;
    return _mode == FocusHighlightMode.traditional;
  }

  @override
  Widget build(BuildContext context) {
    if (!_shouldPaint) return widget.child;
    return CustomPaint(
      foregroundPainter: _RingPainter(
        color: widget.color,
        borderRadius: widget.borderRadius,
        width: widget.width,
        offset: widget.offset,
      ),
      child: widget.child,
    );
  }
}

class _RingPainter extends CustomPainter {
  const _RingPainter({
    required this.color,
    required this.borderRadius,
    required this.width,
    required this.offset,
  });

  final Color color;
  final BorderRadius borderRadius;
  final double width;
  final double offset;

  @override
  void paint(Canvas canvas, Size size) {
    // The ring sits `offset` outside the child and is `width` thick, so its
    // stroke centre is half a width beyond the offset.
    final inflate = offset + width / 2;
    final rect = Offset.zero & size;
    final rrect = borderRadius.toRRect(rect).inflate(inflate);
    canvas.drawRRect(
      rrect,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_RingPainter old) =>
      old.color != color ||
      old.borderRadius != borderRadius ||
      old.width != width ||
      old.offset != offset;
}
