/// The Phase 0 gate for the Flutter port.
///
/// Everything on screen is drawn from resolved tokens, so the whole page —
/// including the ported components at the bottom — re-skins from a single
/// [TolleConfig] change and from the controls at the top.
library;

import 'package:flutter/widgets.dart';
import 'package:tolle_ui/tolle_ui.dart';

void main() => runApp(const ExampleApp());

/// The starting brand. Change this one object and the entire page follows.
const kConfig = TolleConfig(
  primaryColor: '#551a65',
  radius: 12,
  baseColor: 'zinc',
);

class ExampleApp extends StatefulWidget {
  const ExampleApp({super.key});

  @override
  State<ExampleApp> createState() => _ExampleAppState();
}

class _ExampleAppState extends State<ExampleApp> {
  late final TolleThemeController controller = TolleThemeController(
    config: kConfig,
  );

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WidgetsApp(
      color: const Color(0xFF551A65),
      debugShowCheckedModeBanner: false,
      builder: (context, _) => TolleThemeProvider(
        controller: controller,
        child: _Gallery(controller: controller),
      ),
    );
  }
}

class _Gallery extends StatelessWidget {
  const _Gallery({required this.controller});

  final TolleThemeController controller;

  @override
  Widget build(BuildContext context) {
    final t = TolleTheme.of(context);
    final c = t.colors;

    return Container(
      color: c.background,
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 880),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _Header(theme: t),
                  const SizedBox(height: 32),
                  _Controls(controller: controller, theme: t),
                  const SizedBox(height: 40),
                  _Section(
                    theme: t,
                    title: 'Surfaces',
                    child: _Swatches(
                      theme: t,
                      entries: [
                        ('background', c.background, c.foreground),
                        ('card', c.card, c.cardForeground),
                        ('popover', c.popover, c.popoverForeground),
                        ('muted', c.muted, c.mutedForeground),
                        ('accent', c.accent, c.accentForeground),
                        ('secondary', c.secondary, c.secondaryForeground),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  _Section(
                    theme: t,
                    title: 'Semantic',
                    child: _Swatches(
                      theme: t,
                      entries: [
                        ('primary', c.primary, c.primaryForeground),
                        ('destructive', c.destructive, c.destructiveForeground),
                        ('success', c.success, c.successForeground),
                        ('warning', c.warning, c.warningForeground),
                        ('info', c.info, c.infoForeground),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  _Section(
                    theme: t,
                    title: 'Primary ramp',
                    subtitle:
                        'Derived from one hex, re-stepped per appearance — '
                        'dark is not a flip of light.',
                    child: _Ramp(theme: t),
                  ),
                  const SizedBox(height: 32),
                  _Section(
                    theme: t,
                    title: 'Chart palette',
                    subtitle:
                        'Placed in OKLCH so the five marks stay separable, '
                        'including under red-green colour blindness.',
                    child: _Charts(theme: t),
                  ),
                  const SizedBox(height: 32),
                  _Section(
                    theme: t,
                    title: 'Radius scale',
                    subtitle: 'sm / md / lg all track the radius token.',
                    child: _Radii(theme: t),
                  ),
                  const SizedBox(height: 32),
                  _Section(
                    theme: t,
                    title: 'Interaction states',
                    subtitle:
                        'Hover, focus (Tab to it), press and disabled — the '
                        'layer every component sits on.',
                    child: _Interactions(theme: t),
                  ),
                  const SizedBox(height: 32),
                  _Section(
                    theme: t,
                    title: 'Button',
                    subtitle:
                        'The first ported component. Every variant, size and '
                        'state resolves from the tokens above.',
                    child: const _Buttons(),
                  ),
                  const SizedBox(height: 56),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/* -------------------------------------------------------------------------- */

class _Header extends StatelessWidget {
  const _Header({required this.theme});

  final TolleThemeData theme;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Tolle UI · Flutter',
          style: theme.typography.scale.xl3.copyWith(
            color: theme.colors.foreground,
            fontWeight: FontWeight.w600,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Every value below is resolved from a TolleConfig — the tokens, and '
          'the components built on them.',
          style: theme.typography.scale.base.copyWith(
            color: theme.colors.mutedForeground,
          ),
        ),
      ],
    );
  }
}

/* -------------------------------------------------------------------------- */

class _Controls extends StatelessWidget {
  const _Controls({required this.controller, required this.theme});

  final TolleThemeController controller;
  final TolleThemeData theme;

  static const _brands = [
    ('Plum', '#551a65'),
    ('Blue', '#2563eb'),
    ('Green', '#16a34a'),
    ('Amber', '#f59e0b'),
    ('Rose', '#e11d48'),
  ];

  static const _bases = ['zinc', 'slate', 'gray', 'neutral', 'stone'];
  static const _radii = [0.0, 4.0, 8.0, 12.0, 20.0];

  @override
  Widget build(BuildContext context) {
    final c = theme.colors;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: c.card,
        border: Border.all(color: c.border),
        borderRadius: theme.radii.lgRadius,
        boxShadow: theme.shadows.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _ControlRow(
            theme: theme,
            label: 'Primary',
            children: [
              for (final (name, hex) in _brands)
                _Chip(
                  theme: theme,
                  label: name,
                  selected: controller.config.primaryColor == hex,
                  swatch: hexToRgb(hex) == null
                      ? null
                      : rgbToColor(hexToRgb(hex)!),
                  onTap: () => controller.setPrimaryColor(hex),
                ),
            ],
          ),
          const SizedBox(height: 14),
          _ControlRow(
            theme: theme,
            label: 'Neutrals',
            children: [
              for (final id in _bases)
                _Chip(
                  theme: theme,
                  label: id,
                  selected: controller.config.baseColor == id,
                  onTap: () => controller.setBaseColor(id),
                ),
            ],
          ),
          const SizedBox(height: 14),
          _ControlRow(
            theme: theme,
            label: 'Radius',
            children: [
              for (final r in _radii)
                _Chip(
                  theme: theme,
                  label: '${r.toInt()}',
                  selected: controller.config.radius == r,
                  onTap: () => controller.setRadius(r),
                ),
            ],
          ),
          const SizedBox(height: 14),
          _ControlRow(
            theme: theme,
            label: 'Appearance',
            children: [
              for (final a in TolleAppearance.values)
                _Chip(
                  theme: theme,
                  label: a.name,
                  selected: controller.appearance == a,
                  onTap: () => controller.setAppearance(a),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ControlRow extends StatelessWidget {
  const _ControlRow({
    required this.theme,
    required this.label,
    required this.children,
  });

  final TolleThemeData theme;
  final String label;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 96,
          child: Padding(
            padding: const EdgeInsets.only(top: 7),
            child: Text(
              label,
              style: theme.typography.scale.sm.copyWith(
                color: theme.colors.mutedForeground,
              ),
            ),
          ),
        ),
        Expanded(child: Wrap(spacing: 8, runSpacing: 8, children: children)),
      ],
    );
  }
}

/// A pressable chip built straight from tokens and [TolleInteractionDetector].
///
/// This is not a component — it is the smallest thing that proves the state
/// layer and the token layer meet correctly.
class _Chip extends StatelessWidget {
  const _Chip({
    required this.theme,
    required this.label,
    required this.selected,
    required this.onTap,
    this.swatch,
  });

  final TolleThemeData theme;
  final String label;
  final bool selected;
  final VoidCallback onTap;
  final Color? swatch;

  @override
  Widget build(BuildContext context) {
    final c = theme.colors;

    final background = states<Color>(
      normal: selected ? c.primary : c.card,
      hovered: selected ? c.primary : c.accent,
      pressed: selected ? c.primary : c.muted,
    );
    final foreground = states<Color>(
      normal: selected ? c.primaryForeground : c.foreground,
    );

    return TolleInteractionDetector(
      onTap: onTap,
      selected: selected,
      semanticLabel: label,
      builder: (context, widgetStates) {
        return TolleFocusRing(
          visible: widgetStates.contains(WidgetState.focused),
          color: c.ring,
          borderRadius: theme.radii.mdRadius,
          child: AnimatedContainer(
            duration: theme.motion.fast,
            curve: theme.motion.easing,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            decoration: BoxDecoration(
              color: resolveOr(background, widgetStates, c.card),
              border: Border.all(color: selected ? c.primary : c.border),
              borderRadius: theme.radii.mdRadius,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (swatch != null) ...[
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: swatch,
                      borderRadius: BorderRadius.circular(3),
                      border: Border.all(color: c.border),
                    ),
                  ),
                  const SizedBox(width: 7),
                ],
                Text(
                  label,
                  style: theme.typography.scale.sm.copyWith(
                    color: resolveOr(foreground, widgetStates, c.foreground),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

/* -------------------------------------------------------------------------- */

class _Section extends StatelessWidget {
  const _Section({
    required this.theme,
    required this.title,
    this.subtitle,
    required this.child,
  });

  final TolleThemeData theme;
  final String title;
  final String? subtitle;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: theme.typography.scale.lg.copyWith(
            color: theme.colors.foreground,
            fontWeight: FontWeight.w600,
          ),
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 4),
          Text(
            subtitle!,
            style: theme.typography.scale.sm.copyWith(
              color: theme.colors.mutedForeground,
            ),
          ),
        ],
        const SizedBox(height: 14),
        child,
      ],
    );
  }
}

class _Swatches extends StatelessWidget {
  const _Swatches({required this.theme, required this.entries});

  final TolleThemeData theme;
  final List<(String, Color, Color)> entries;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: [
        for (final (name, bg, fg) in entries)
          Container(
            width: 132,
            height: 78,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: bg,
              borderRadius: theme.radii.mdRadius,
              border: Border.all(color: theme.colors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  name,
                  style: theme.typography.scale.sm.copyWith(
                    color: fg,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  _hex(bg),
                  style: theme.typography.scale.xs.copyWith(
                    color: fg.withValues(alpha: 0.65),
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

class _Ramp extends StatelessWidget {
  const _Ramp({required this.theme});

  final TolleThemeData theme;

  @override
  Widget build(BuildContext context) {
    final shades = theme.colors.primaryShades;
    final steps = shades.keys.toList()..sort();
    return ClipRRect(
      borderRadius: theme.radii.mdRadius,
      child: Row(
        children: [
          for (final step in steps)
            Expanded(
              child: Container(
                height: 62,
                color: shades[step],
                alignment: Alignment.bottomCenter,
                padding: const EdgeInsets.only(bottom: 6),
                child: Text(
                  '$step',
                  style: theme.typography.scale.xs.copyWith(
                    color: _readableOn(shades[step]!),
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _Charts extends StatelessWidget {
  const _Charts({required this.theme});

  final TolleThemeData theme;

  @override
  Widget build(BuildContext context) {
    // A stand-in bar group: enough to see whether five series stay separable
    // on this surface, which is what the palette is actually for.
    const heights = [0.95, 0.62, 0.78, 0.45, 0.88];
    return Container(
      height: 128,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colors.card,
        borderRadius: theme.radii.mdRadius,
        border: Border.all(color: theme.colors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          for (var i = 0; i < theme.colors.chart.length; i++) ...[
            Expanded(
              child: FractionallySizedBox(
                heightFactor: heights[i],
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: theme.colors.chart[i],
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(theme.radii.sm),
                    ),
                  ),
                ),
              ),
            ),
            if (i < theme.colors.chart.length - 1) const SizedBox(width: 10),
          ],
        ],
      ),
    );
  }
}

class _Radii extends StatelessWidget {
  const _Radii({required this.theme});

  final TolleThemeData theme;

  @override
  Widget build(BuildContext context) {
    final r = theme.radii;
    final entries = [('sm', r.sm), ('md', r.md), ('lg', r.lg), ('xl', r.xl)];
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: [
        for (final (name, value) in entries)
          Container(
            width: 104,
            height: 66,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: theme.colors.muted,
              borderRadius: BorderRadius.circular(value),
              border: Border.all(color: theme.colors.border),
            ),
            child: Text(
              '$name · ${value.toStringAsFixed(0)}',
              style: theme.typography.scale.sm.copyWith(
                color: theme.colors.mutedForeground,
              ),
            ),
          ),
      ],
    );
  }
}

class _Interactions extends StatelessWidget {
  const _Interactions({required this.theme});

  final TolleThemeData theme;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: [
        _StateProbe(theme: theme, label: 'Interactive', enabled: true),
        _StateProbe(theme: theme, label: 'Disabled', enabled: false),
      ],
    );
  }
}

/// Every button variant, size and state, straight from the library.
class _Buttons extends StatelessWidget {
  const _Buttons();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            for (final variant in TolleButtonVariant.values)
              TolleButton(
                onPressed: () {},
                variant: variant,
                child: Text(variant.name),
              ),
          ],
        ),
        const SizedBox(height: 14),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            for (final size in [
              TolleButtonSize.xs,
              TolleButtonSize.sm,
              TolleButtonSize.medium,
              TolleButtonSize.lg,
            ])
              TolleButton(
                onPressed: () {},
                size: size,
                variant: TolleButtonVariant.secondary,
                child: Text(size.name),
              ),
            for (final size in [
              TolleButtonSize.iconSm,
              TolleButtonSize.icon,
              TolleButtonSize.iconLg,
            ])
              TolleButton(
                onPressed: () {},
                size: size,
                variant: TolleButtonVariant.outline,
                semanticLabel: 'Check',
                child: const Icon(TolleIcons.checkLine),
              ),
          ],
        ),
        const SizedBox(height: 14),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            const TolleButton(disabled: true, child: Text('Disabled')),
            TolleButton(
              onPressed: () {},
              busy: true,
              child: const Text('Saving'),
            ),
            TolleButton(
              onPressed: () {},
              variant: TolleButtonVariant.destructive,
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(TolleIcons.deleteBinLine),
                  SizedBox(width: 6),
                  Text('Delete'),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}

/// Renders its own live state set, so the interaction layer is observable
/// rather than something you have to take on trust.
class _StateProbe extends StatelessWidget {
  const _StateProbe({
    required this.theme,
    required this.label,
    required this.enabled,
  });

  final TolleThemeData theme;
  final String label;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final c = theme.colors;
    return TolleInteractionDetector(
      enabled: enabled,
      onTap: () {},
      semanticLabel: label,
      builder: (context, widgetStates) {
        final active =
            widgetStates
                .where((s) => s != WidgetState.selected)
                .map((s) => s.name)
                .toList()
              ..sort();
        return TolleFocusRing(
          visible: widgetStates.contains(WidgetState.focused),
          color: c.ring,
          borderRadius: theme.radii.mdRadius,
          child: AnimatedContainer(
            duration: theme.motion.fast,
            curve: theme.motion.easing,
            width: 210,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: switch (widgetStates) {
                _ when widgetStates.contains(WidgetState.disabled) => c.muted,
                _ when widgetStates.contains(WidgetState.pressed) =>
                  c.primaryShades[700] ?? c.primary,
                _ when widgetStates.contains(WidgetState.hovered) =>
                  c.primaryShades[600] ?? c.primary,
                _ => c.primary,
              },
              borderRadius: theme.radii.mdRadius,
              boxShadow: widgetStates.contains(WidgetState.disabled)
                  ? null
                  : theme.shadows.sm,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: theme.typography.scale.sm.copyWith(
                    color: enabled ? c.primaryForeground : c.mutedForeground,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  active.isEmpty ? 'no states' : active.join(' · '),
                  style: theme.typography.scale.xs.copyWith(
                    color: (enabled ? c.primaryForeground : c.mutedForeground)
                        .withValues(alpha: 0.75),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

/* -------------------------------------------------------------------------- */

String _hex(Color c) {
  String two(double channel) =>
      (channel * 255).round().toRadixString(16).padLeft(2, '0');
  return '#${two(c.r)}${two(c.g)}${two(c.b)}'.toUpperCase();
}

/// Black or white over an arbitrary swatch, using the same weighted luminance
/// the token maths uses for `primary-foreground`.
Color _readableOn(Color c) {
  final rgb = Rgb(
    (c.r * 255).round(),
    (c.g * 255).round(),
    (c.b * 255).round(),
  );
  return rgbToColor(contrastColor(rgb));
}
