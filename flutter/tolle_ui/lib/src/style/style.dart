/// The style-override system — what replaces `class` + `tailwind-merge`.
///
/// On the Angular side every component takes a `class` input and folds it in
/// with `cn()`, so the last-declared utility wins at CSS-property granularity.
/// Flutter has no class strings to merge, so the same contract is expressed
/// with typed, all-nullable style objects:
///
/// * a null field means "not specified here, inherit from the layer below";
/// * [TolleStyle.merge] lets the outer layer win field by field;
/// * resolution runs theme default → variant → per-instance `style:`.
///
/// The result is the same last-wins behaviour with three properties the class
/// string never had: it is type-checked, it cannot produce an unresolvable
/// conflict, and a style can be inspected before it is applied.
library;

import 'package:flutter/widgets.dart';

/// Contract for a component's style object.
///
/// Implementations are immutable, have all-nullable fields, and treat a null
/// field as "defer to the layer below".
abstract class TolleStyle<T extends TolleStyle<T>> {
  const TolleStyle();

  /// Returns a style in which [other]'s specified fields win over this one's.
  ///
  /// Null [other] returns this unchanged, so callers can merge an optional
  /// override without a null check.
  T merge(covariant T? other);
}

/// Merges two state-dependent properties, per state.
///
/// [override] wins for any state it resolves to a non-null value, and [base]
/// fills in the rest. This is the part that mirrors `tailwind-merge` most
/// closely: an override that only speaks to the hovered state leaves the
/// default and disabled states alone rather than blanking them.
WidgetStateProperty<T?>? mergeStateProperty<T>(
  WidgetStateProperty<T?>? base,
  WidgetStateProperty<T?>? override,
) {
  if (base == null) return override;
  if (override == null) return base;
  return WidgetStateProperty.resolveWith(
    (states) => override.resolve(states) ?? base.resolve(states),
  );
}

/// Wraps a constant as a [WidgetStateProperty] that ignores state.
WidgetStateProperty<T?> always<T>(T? value) =>
    WidgetStatePropertyAll<T?>(value);

/// Builds a state property from a default plus per-state overrides.
///
/// States are checked in the order a component should honour them: disabled
/// first (it outranks everything), then pressed, hovered, focused, selected.
/// Getting that order wrong is the usual cause of a control that keeps its
/// hover colour while disabled.
WidgetStateProperty<T?> states<T>({
  T? normal,
  T? disabled,
  T? pressed,
  T? hovered,
  T? focused,
  T? selected,
}) {
  return WidgetStateProperty.resolveWith((s) {
    if (disabled != null && s.contains(WidgetState.disabled)) return disabled;
    if (pressed != null && s.contains(WidgetState.pressed)) return pressed;
    if (hovered != null && s.contains(WidgetState.hovered)) return hovered;
    if (focused != null && s.contains(WidgetState.focused)) return focused;
    if (selected != null && s.contains(WidgetState.selected)) return selected;
    return normal;
  });
}

/// Resolves a nullable state property against a state set, with a fallback.
T resolveOr<T>(
  WidgetStateProperty<T?>? property,
  Set<WidgetState> widgetStates,
  T fallback,
) => property?.resolve(widgetStates) ?? fallback;
