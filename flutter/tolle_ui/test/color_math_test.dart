/// Asserts the Dart colour maths against reference output captured from the
/// real TypeScript in `projects/tolle/src/lib/utils/color.ts`.
///
/// The fixture is generated, not hand-written — regenerate it with
/// `node tools/dump-color-reference.js` whenever the TypeScript maths changes.
/// A diff in this test means the two platforms would render different colours
/// from the same config, which is the one failure mode this port cannot absorb.
library;

import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:tolle_ui/src/theme/color_math.dart';

Rgb _parseTriplet(String triplet) {
  final parts = triplet.split(' ').map(int.parse).toList();
  return Rgb(parts[0], parts[1], parts[2]);
}

void main() {
  final fixture =
      jsonDecode(File('test/fixtures/color_reference.json').readAsStringSync())
          as Map<String, dynamic>;

  final samples = fixture['samples'] as Map<String, dynamic>;
  final hslRef = fixture['hsl'] as Map<String, dynamic>;
  final chartRef = fixture['chart'] as Map<String, dynamic>;

  group('hexToRgb', () {
    test('matches the TypeScript for every sample', () {
      samples.forEach((hex, data) {
        final expected = (data['rgb'] as List).cast<int>();
        expect(
          hexToRgb(hex),
          Rgb(expected[0], expected[1], expected[2]),
          reason: hex,
        );
      });
    });

    test('accepts shorthand and a missing leading hash', () {
      expect(hexToRgb('#abc'), const Rgb(0xaa, 0xbb, 0xcc));
      expect(hexToRgb('2563eb'), const Rgb(37, 99, 235));
    });

    test('returns null for malformed input', () {
      // The TypeScript yields NaN channels here — see the divergence note in
      // color_math.dart. Null routes callers to the documented fallback.
      expect(hexToRgb('#12'), isNull);
      expect(hexToRgb('#nothex'), isNull);
      expect(hexToRgb(''), isNull);
      expect(hexToRgbOr('#nothex'), kDefaultPrimary);
    });
  });

  group('contrastColor', () {
    test('matches the TypeScript for every sample', () {
      samples.forEach((hex, data) {
        final expected = hexToRgb(data['contrast'] as String)!;
        expect(contrastColor(hexToRgb(hex)!), expected, reason: hex);
      });
    });
  });

  group('lighten', () {
    test('matches the TypeScript at every step used by the ramp', () {
      samples.forEach((hex, data) {
        final steps = data['lighten'] as Map<String, dynamic>;
        steps.forEach((percent, expectedHex) {
          expect(
            lighten(hexToRgb(hex)!, double.parse(percent)).hex,
            expectedHex,
            reason: 'lighten($hex, $percent)',
          );
        });
      });
    });
  });

  group('darken', () {
    test('matches the TypeScript at every step used by the ramp', () {
      samples.forEach((hex, data) {
        final steps = data['darken'] as Map<String, dynamic>;
        steps.forEach((percent, expectedHex) {
          expect(
            darken(hexToRgb(hex)!, double.parse(percent)).hex,
            expectedHex,
            reason: 'darken($hex, $percent)',
          );
        });
      });
    });
  });

  group('HSL', () {
    test('rgbToHsl matches the TypeScript', () {
      hslRef.forEach((hex, data) {
        final expected = (data['hsl'] as List).cast<num>();
        final actual = rgbToHsl(hexToRgb(hex)!);
        expect(
          actual.h,
          closeTo(expected[0].toDouble(), 1e-9),
          reason: '$hex h',
        );
        expect(
          actual.s,
          closeTo(expected[1].toDouble(), 1e-9),
          reason: '$hex s',
        );
        expect(
          actual.l,
          closeTo(expected[2].toDouble(), 1e-9),
          reason: '$hex l',
        );
      });
    });

    test('round-trips through hslToRgb identically', () {
      hslRef.forEach((hex, data) {
        final hsl = rgbToHsl(hexToRgb(hex)!);
        expect(
          hslToRgb(hsl.h, hsl.s, hsl.l).hex,
          data['roundTrip'],
          reason: hex,
        );
      });
    });
  });

  group('chartRamp', () {
    // The OKLCH path is the one place where a last-ULP difference between
    // Dart's pow-based cube root and JavaScript's Math.cbrt could surface. It
    // resolves to 8-bit channels, so exact equality is the right assertion —
    // if this ever goes off by one, the maths diverged, not the rounding.
    test('matches the TypeScript in light mode', () {
      chartRef.forEach((hex, data) {
        final expected = (data['light'] as List)
            .cast<String>()
            .map(_parseTriplet)
            .toList();
        expect(chartRamp(hexToRgb(hex)!, dark: false), expected, reason: hex);
      });
    });

    test('matches the TypeScript in dark mode', () {
      chartRef.forEach((hex, data) {
        final expected = (data['dark'] as List)
            .cast<String>()
            .map(_parseTriplet)
            .toList();
        expect(chartRamp(hexToRgb(hex)!, dark: true), expected, reason: hex);
      });
    });

    test('holds the chroma floor for narrow-gamut hues', () {
      // #facc15 and #14b8a6 are in the fixture precisely because their dark
      // steps get pushed by snapLightness. Assert the intent, not just the
      // captured bytes: no derived mark should collapse to grey.
      for (final hex in ['#facc15', '#14b8a6']) {
        for (final dark in [false, true]) {
          for (final mark in chartRamp(hexToRgb(hex)!, dark: dark)) {
            final o = rgbToOklch(mark);
            expect(
              o.c,
              greaterThan(0.02),
              reason: '$hex dark=$dark produced a near-grey mark: $mark',
            );
          }
        }
      }
    });
  });

  group('primaryRamp', () {
    test('runs 50→900 away from the surface in both appearances', () {
      final primary = hexToRgb('#2563eb')!;

      final light = primaryRamp(primary, dark: false);
      expect(light[500], primary);
      // In light mode the ramp starts near white and darkens.
      expect(_luminance(light[50]!), greaterThan(_luminance(light[900]!)));

      final dark = primaryRamp(primary, dark: true);
      expect(dark[500], primary);
      // In dark mode it starts near black and lightens — not a flip of light.
      expect(_luminance(dark[50]!), lessThan(_luminance(dark[900]!)));
    });

    test('matches generateThemeCss step for step', () {
      final primary = hexToRgb('#551a65')!;
      final steps = samples['#551a65'] as Map<String, dynamic>;
      final lightened = steps['lighten'] as Map<String, dynamic>;
      final darkened = steps['darken'] as Map<String, dynamic>;

      final light = primaryRamp(primary, dark: false);
      expect(light[50]!.hex, lightened['90']);
      expect(light[100]!.hex, lightened['80']);
      expect(light[200]!.hex, lightened['60']);
      expect(light[300]!.hex, lightened['40']);
      expect(light[400]!.hex, lightened['20']);
      expect(light[600]!.hex, darkened['20']);
      expect(light[700]!.hex, darkened['40']);
      expect(light[800]!.hex, darkened['60']);
      expect(light[900]!.hex, darkened['80']);

      final dark = primaryRamp(primary, dark: true);
      expect(dark[50]!.hex, darkened['85']);
      expect(dark[100]!.hex, darkened['75']);
      expect(dark[200]!.hex, darkened['65']);
      expect(dark[300]!.hex, darkened['55']);
      expect(dark[400]!.hex, darkened['45']);
      expect(dark[600]!.hex, lightened['20']);
      expect(dark[700]!.hex, lightened['35']);
      expect(dark[800]!.hex, lightened['50']);
      expect(dark[900]!.hex, lightened['65']);
    });
  });

  group('ringFor', () {
    test('lifts the primary 40% in light and 20% in dark', () {
      final primary = hexToRgb('#2563eb')!;
      final steps =
          (samples['#2563eb'] as Map<String, dynamic>)['lighten']
              as Map<String, dynamic>;
      expect(ringFor(primary, dark: false).hex, steps['40']);
      expect(ringFor(primary, dark: true).hex, steps['20']);
    });
  });
}

double _luminance(Rgb c) => (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
