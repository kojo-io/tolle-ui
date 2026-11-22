/// App-wide component style defaults.
///
/// The middle layer of the three-stage resolution every component runs:
/// variant default → **theme override** → per-instance `style:`. Setting
/// `TolleComponentThemes.button` restyles every button in the app without
/// touching a call site, which is what the Angular library achieves by letting
/// a consumer redefine utility classes.
///
/// One nullable field is added here per ported component. That is verbose by
/// design — the alternative is an untyped map, and a design system's override
/// surface is exactly the thing that should be type-checked.
library;

import 'package:flutter/widgets.dart';

import '../components/button.dart';

@immutable
class TolleComponentThemes {
  const TolleComponentThemes({this.button});

  /// Applied to every [TolleButton] under this theme.
  final TolleButtonStyle? button;

  TolleComponentThemes copyWith({TolleButtonStyle? button}) =>
      TolleComponentThemes(button: button ?? this.button);

  /// Folds [other]'s overrides on top of this one's, field by field.
  TolleComponentThemes merge(TolleComponentThemes? other) {
    if (other == null) return this;
    return TolleComponentThemes(
      button: button?.merge(other.button) ?? other.button,
    );
  }

  /// Component styles are discrete: interpolating a half-applied override
  /// produces a style neither side asked for, so they snap at the midpoint.
  static TolleComponentThemes lerp(
    TolleComponentThemes a,
    TolleComponentThemes b,
    double t,
  ) => t < 0.5 ? a : b;
}
