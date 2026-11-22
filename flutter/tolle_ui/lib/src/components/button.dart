/// The button — the first ported component, and the one that proves the
/// variant system for the other 116.
///
/// Ported from `projects/tolle/src/lib/button.component.ts`. The Angular
/// version is a `cva` class map over a native `<button>`; here the same
/// variants resolve to a [TolleButtonStyle] built from theme tokens.
library;

import 'dart:math' as math;

import 'package:flutter/widgets.dart';

import '../style/interaction.dart';
import '../style/style.dart';
import '../theme/theme.dart';
import '../theme/theme_data.dart';

/// Visual style of the button.
enum TolleButtonVariant {
  primary,
  destructive,
  outline,
  secondary,
  ghost,
  link,
}

/// Size of the button, including the icon-only sizes.
enum TolleButtonSize {
  medium,
  xs,
  sm,
  lg,
  iconXs,
  iconSm,
  icon,
  iconLg;

  /// Icon sizes are square: they set a width as well as a height, and drop the
  /// horizontal padding.
  bool get isIcon =>
      this == iconXs || this == iconSm || this == icon || this == iconLg;
}

/* -------------------------------------------------------------------------- */
/* Style                                                                       */
/* -------------------------------------------------------------------------- */

/// Per-instance style overrides for a [TolleButton].
///
/// Every field is nullable: a null field defers to the layer below, and
/// resolution runs variant default → theme override → this. See
/// `TolleStyle` for why the library replaced the `class` prop with this.
@immutable
class TolleButtonStyle implements TolleStyle<TolleButtonStyle> {
  const TolleButtonStyle({
    this.backgroundColor,
    this.foregroundColor,
    this.borderColor,
    this.textStyle,
    this.padding,
    this.height,
    this.width,
    this.borderRadius,
    this.borderWidth,
    this.pressedScale,
    this.underlineOnHover,
    this.mouseCursor,
  });

  final WidgetStateProperty<Color?>? backgroundColor;
  final WidgetStateProperty<Color?>? foregroundColor;
  final WidgetStateProperty<Color?>? borderColor;
  final WidgetStateProperty<TextStyle?>? textStyle;

  final EdgeInsetsGeometry? padding;
  final double? height;

  /// Fixed width, used by the icon-only sizes.
  final double? width;

  final BorderRadius? borderRadius;
  final double? borderWidth;

  /// Scale applied while pressed — `active:scale-[0.98]` in the web build.
  final double? pressedScale;

  /// Underline the label on hover, which only the `link` variant does.
  final bool? underlineOnHover;

  final WidgetStateProperty<MouseCursor?>? mouseCursor;

  @override
  TolleButtonStyle merge(TolleButtonStyle? other) {
    if (other == null) return this;
    return TolleButtonStyle(
      backgroundColor: mergeStateProperty(
        backgroundColor,
        other.backgroundColor,
      ),
      foregroundColor: mergeStateProperty(
        foregroundColor,
        other.foregroundColor,
      ),
      borderColor: mergeStateProperty(borderColor, other.borderColor),
      textStyle: mergeStateProperty(textStyle, other.textStyle),
      padding: other.padding ?? padding,
      height: other.height ?? height,
      width: other.width ?? width,
      borderRadius: other.borderRadius ?? borderRadius,
      borderWidth: other.borderWidth ?? borderWidth,
      pressedScale: other.pressedScale ?? pressedScale,
      underlineOnHover: other.underlineOnHover ?? underlineOnHover,
      mouseCursor: mergeStateProperty(mouseCursor, other.mouseCursor),
    );
  }

  TolleButtonStyle copyWith({
    WidgetStateProperty<Color?>? backgroundColor,
    WidgetStateProperty<Color?>? foregroundColor,
    WidgetStateProperty<Color?>? borderColor,
    WidgetStateProperty<TextStyle?>? textStyle,
    EdgeInsetsGeometry? padding,
    double? height,
    double? width,
    BorderRadius? borderRadius,
    double? borderWidth,
    double? pressedScale,
    bool? underlineOnHover,
    WidgetStateProperty<MouseCursor?>? mouseCursor,
  }) {
    return TolleButtonStyle(
      backgroundColor: backgroundColor ?? this.backgroundColor,
      foregroundColor: foregroundColor ?? this.foregroundColor,
      borderColor: borderColor ?? this.borderColor,
      textStyle: textStyle ?? this.textStyle,
      padding: padding ?? this.padding,
      height: height ?? this.height,
      width: width ?? this.width,
      borderRadius: borderRadius ?? this.borderRadius,
      borderWidth: borderWidth ?? this.borderWidth,
      pressedScale: pressedScale ?? this.pressedScale,
      underlineOnHover: underlineOnHover ?? this.underlineOnHover,
      mouseCursor: mouseCursor ?? this.mouseCursor,
    );
  }
}

/// The variant defaults, derived from theme tokens.
///
/// Each case reproduces one `cva` entry from `button.component.ts`. The
/// hover colours use alpha rather than a separate token because the web build
/// does — `hover:bg-primary/90` is the primary at 90% over whatever is behind.
TolleButtonStyle _variantStyle(
  TolleThemeData theme,
  TolleButtonVariant variant,
) {
  final c = theme.colors;

  return switch (variant) {
    TolleButtonVariant.primary => TolleButtonStyle(
      backgroundColor: states(
        normal: c.primary,
        hovered: c.primary.withValues(alpha: 0.9),
      ),
      foregroundColor: always(c.primaryForeground),
    ),
    TolleButtonVariant.destructive => TolleButtonStyle(
      backgroundColor: states(
        normal: c.destructive,
        hovered: c.destructive.withValues(alpha: 0.9),
      ),
      foregroundColor: always(c.destructiveForeground),
    ),
    TolleButtonVariant.outline => TolleButtonStyle(
      backgroundColor: states(
        normal: const Color(0x00000000),
        hovered: c.accent,
      ),
      foregroundColor: states(
        normal: c.foreground,
        hovered: c.accentForeground,
      ),
      borderColor: always(c.input),
      borderWidth: 1,
    ),
    TolleButtonVariant.secondary => TolleButtonStyle(
      backgroundColor: states(
        normal: c.secondary,
        hovered: c.secondary.withValues(alpha: 0.8),
      ),
      foregroundColor: always(c.secondaryForeground),
    ),
    TolleButtonVariant.ghost => TolleButtonStyle(
      backgroundColor: states(
        normal: const Color(0x00000000),
        hovered: c.accent,
      ),
      foregroundColor: states(
        normal: c.foreground,
        hovered: c.accentForeground,
      ),
    ),
    // `link` changes colour and adds an underline on hover, and nothing else.
    // It keeps the size box: in the Angular `cva` the size classes still apply,
    // so a link button occupies the same 40px as any other. Stripping the box
    // here would be an invented divergence, not a port.
    TolleButtonVariant.link => TolleButtonStyle(
      backgroundColor: always(const Color(0x00000000)),
      foregroundColor: always(c.primary),
      underlineOnHover: true,
    ),
  };
}

/// The size defaults, reproducing the `cva` size map.
TolleButtonStyle _sizeStyle(TolleThemeData theme, TolleButtonSize size) {
  final scale = theme.typography.scale;
  return switch (size) {
    TolleButtonSize.medium => TolleButtonStyle(
      height: 40,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      textStyle: always(scale.sm),
    ),
    TolleButtonSize.xs => TolleButtonStyle(
      height: 32,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      textStyle: always(scale.xs),
    ),
    TolleButtonSize.sm => TolleButtonStyle(
      height: 36,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      textStyle: always(scale.sm),
    ),
    TolleButtonSize.lg => TolleButtonStyle(
      height: 44,
      padding: const EdgeInsets.symmetric(horizontal: 32),
      textStyle: always(scale.sm),
    ),
    TolleButtonSize.iconXs => TolleButtonStyle(
      height: 32,
      width: 32,
      padding: EdgeInsets.zero,
      textStyle: always(scale.sm),
    ),
    TolleButtonSize.iconSm => TolleButtonStyle(
      height: 36,
      width: 36,
      padding: EdgeInsets.zero,
      textStyle: always(scale.sm),
    ),
    TolleButtonSize.icon => TolleButtonStyle(
      height: 40,
      width: 40,
      padding: EdgeInsets.zero,
      textStyle: always(scale.sm),
    ),
    TolleButtonSize.iconLg => TolleButtonStyle(
      height: 44,
      width: 44,
      padding: EdgeInsets.zero,
      textStyle: always(scale.sm),
    ),
  };
}

/* -------------------------------------------------------------------------- */
/* Widget                                                                      */
/* -------------------------------------------------------------------------- */

/// A button.
///
/// ```dart
/// TolleButton(
///   onPressed: save,
///   variant: TolleButtonVariant.destructive,
///   child: const Text('Delete'),
/// )
/// ```
///
/// Two notes on parity with the Angular component:
///
/// * It has no `class` input. Use [style] — see `TolleStyle`.
/// * It has no `type` input. HTML's implicit form submission has no Flutter
///   equivalent; a form component wires submission explicitly instead.
class TolleButton extends StatelessWidget {
  const TolleButton({
    super.key,
    required this.child,
    this.onPressed,
    this.onLongPress,
    this.variant = TolleButtonVariant.primary,
    this.size = TolleButtonSize.medium,
    this.disabled = false,
    this.busy = false,
    this.style,
    this.focusNode,
    this.autofocus = false,
    this.semanticLabel,
  });

  // parity: ignore class — replaced by the typed `style` override; see TolleStyle.
  // parity: ignore type — HTML form-submission semantics have no Flutter
  // equivalent. Phase 3 may reintroduce this once TolleForm exists.

  /// The button's content, usually a [Text] or an [Icon].
  final Widget child;

  final VoidCallback? onPressed;
  final VoidCallback? onLongPress;

  /// Visual style of the button.
  final TolleButtonVariant variant;

  /// Size of the button, including icon-only sizes.
  final TolleButtonSize size;

  /// Disables the button and blocks pointer events.
  final bool disabled;

  /// Shows a spinner and prevents interaction while a task runs.
  ///
  /// The label stays laid out but invisible, so the button does not resize
  /// when it becomes busy — same trick the Angular template uses.
  final bool busy;

  /// Overrides layered over the variant and theme defaults.
  final TolleButtonStyle? style;

  final FocusNode? focusNode;
  final bool autofocus;
  final String? semanticLabel;

  bool get _enabled => !disabled && !busy;

  @override
  Widget build(BuildContext context) {
    final theme = TolleTheme.of(context);

    final resolved = _variantStyle(theme, variant)
        .merge(_sizeStyle(theme, size))
        .merge(theme.components.button)
        .merge(style);

    final radius = resolved.borderRadius ?? theme.radii.mdRadius;
    final pressedScale = resolved.pressedScale ?? 0.98;

    return TolleInteractionDetector(
      enabled: _enabled,
      onTap: onPressed,
      onLongPress: onLongPress,
      focusNode: focusNode,
      autofocus: autofocus,
      semanticLabel: semanticLabel,
      mouseCursor: busy ? SystemMouseCursors.wait : null,
      builder: (context, widgetStates) {
        final foreground = resolveOr(
          resolved.foregroundColor,
          widgetStates,
          theme.colors.foreground,
        );
        final background = resolveOr(
          resolved.backgroundColor,
          widgetStates,
          const Color(0x00000000),
        );
        final border = resolved.borderColor?.resolve(widgetStates);
        final text = resolveOr(
          resolved.textStyle,
          widgetStates,
          theme.typography.scale.sm,
        );

        final underline =
            (resolved.underlineOnHover ?? false) &&
            widgetStates.contains(WidgetState.hovered);

        Widget label = DefaultTextStyle.merge(
          style: text.copyWith(
            color: foreground,
            fontWeight: FontWeight.w500,
            fontFamily: theme.typography.sans.family,
            fontFamilyFallback: theme.typography.sans.fallback,
            decoration: underline
                ? TextDecoration.underline
                : TextDecoration.none,
            decorationColor: foreground,
            // `underline-offset-4` in the web build.
            decorationThickness: 1,
          ),
          child: IconTheme.merge(
            data: IconThemeData(color: foreground, size: text.fontSize),
            child: child,
          ),
        );

        // Busy keeps the label in the layout but invisible, so the button holds
        // its width, and overlays the spinner on top.
        if (busy) {
          label = Stack(
            alignment: Alignment.center,
            children: [
              Opacity(opacity: 0, child: label),
              _ButtonSpinner(
                color: foreground,
                size: (text.fontSize ?? 14) + 6,
              ),
            ],
          );
        }

        Widget content = Container(
          height: resolved.height,
          width: resolved.width,
          padding: resolved.padding,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: background,
            borderRadius: radius,
            border: border == null
                ? null
                : Border.all(color: border, width: resolved.borderWidth ?? 1),
          ),
          child: label,
        );

        // `disabled:opacity-50`. Applied to the whole button rather than to the
        // colours so border and label dim together, as the CSS does.
        if (!_enabled) {
          content = Opacity(opacity: 0.5, child: content);
        }

        if (widgetStates.contains(WidgetState.pressed)) {
          content = Transform.scale(scale: pressedScale, child: content);
        }

        return TolleFocusRing(
          visible: widgetStates.contains(WidgetState.focused),
          color: theme.colors.ring,
          borderRadius: radius,
          child: content,
        );
      },
    );
  }
}

/// The busy indicator.
///
/// A private stand-in for the spinner component, which is a Phase 1 item of its
/// own; when `TolleSpinner` lands this collapses into it.
class _ButtonSpinner extends StatefulWidget {
  const _ButtonSpinner({required this.color, required this.size});

  final Color color;
  final double size;

  @override
  State<_ButtonSpinner> createState() => _ButtonSpinnerState();
}

class _ButtonSpinnerState extends State<_ButtonSpinner>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1000),
  )..repeat();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) => CustomPaint(
          painter: _SpinnerPainter(
            color: widget.color,
            turns: _controller.value,
          ),
        ),
      ),
    );
  }
}

class _SpinnerPainter extends CustomPainter {
  const _SpinnerPainter({required this.color, required this.turns});

  final Color color;
  final double turns;

  @override
  void paint(Canvas canvas, Size size) {
    final stroke = size.width / 8;
    final rect =
        Offset(stroke / 2, stroke / 2) &
        Size(size.width - stroke, size.height - stroke);

    // The track plus a brighter arc, matching the web spinner's opacity-25
    // circle under an opacity-75 arc.
    canvas.drawArc(
      rect,
      0,
      math.pi * 2,
      false,
      Paint()
        ..color = color.withValues(alpha: 0.25)
        ..style = PaintingStyle.stroke
        ..strokeWidth = stroke,
    );
    canvas.drawArc(
      rect,
      turns * math.pi * 2,
      math.pi * 0.6,
      false,
      Paint()
        ..color = color.withValues(alpha: 0.75)
        ..style = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round
        ..strokeWidth = stroke,
    );
  }

  @override
  bool shouldRepaint(_SpinnerPainter old) =>
      old.turns != turns || old.color != color;
}
