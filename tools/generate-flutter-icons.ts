/**
 * Generates the Flutter icon layer from the Remix Icon package.
 *
 * 46 files in the Angular library reference `ri-*` classes, which a browser
 * resolves through an icon font. Flutter has no class strings, so the same font
 * is shipped as an asset and every glyph gets a named `IconData` constant.
 * Flutter's `--tree-shake-icons` then strips the unused glyphs at build time,
 * exactly as it does for Material's own icon font — so shipping the full set
 * costs consumers nothing while leaving them free to use any icon.
 *
 * Run: npm run generate:flutter-icons
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const CSS = path.join(ROOT, 'node_modules/remixicon/fonts/remixicon.css');
const TTF = path.join(ROOT, 'node_modules/remixicon/fonts/remixicon.ttf');
const PKG = path.join(ROOT, 'flutter/tolle_ui');
const ASSET_DIR = path.join(PKG, 'assets/fonts');
const OUT = path.join(PKG, 'lib/src/icons/tolle_icons.dart');

/** Dart keywords and Object members a constant cannot be named. */
const RESERVED = new Set([
  'class', 'switch', 'default', 'new', 'is', 'in', 'if', 'else', 'for', 'while',
  'do', 'return', 'this', 'super', 'null', 'true', 'false', 'var', 'final',
  'const', 'void', 'enum', 'extends', 'with', 'try', 'catch', 'throw', 'break',
  'continue', 'assert', 'rethrow', 'operator', 'static', 'abstract', 'export',
  'import', 'library', 'part', 'typedef', 'as', 'show', 'hide', 'sync', 'async',
  'await', 'yield', 'get', 'set', 'external', 'factory', 'implements', 'mixin',
  'hashCode', 'toString', 'runtimeType', 'noSuchMethod',
]);

/** `24-hours-fill` → `icon24HoursFill`, `a-b` → `aB`. */
function toDartName(raw: string): string {
  const parts = raw.split('-').filter(Boolean);
  let name =
    parts[0] +
    parts
      .slice(1)
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join('');
  // A Dart identifier cannot start with a digit.
  if (/^[0-9]/.test(name)) name = `icon${name[0].toUpperCase()}${name.slice(1)}`;
  if (RESERVED.has(name)) name = `${name}Icon`;
  return name;
}

function main() {
  if (!fs.existsSync(CSS) || !fs.existsSync(TTF)) {
    console.error(
      '✗ remixicon not found in node_modules — run `npm install` first.'
    );
    process.exit(1);
  }

  const css = fs.readFileSync(CSS, 'utf8');
  const re = /^\.ri-([a-z0-9-]+):before\s*\{\s*content:\s*"\\([0-9a-fA-F]+)";\s*\}/gm;

  const icons: { dart: string; raw: string; code: string }[] = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    const dart = toDartName(m[1]);
    if (seen.has(dart)) {
      console.warn(`  ! name collision, skipping: ri-${m[1]} → ${dart}`);
      continue;
    }
    seen.add(dart);
    icons.push({ dart, raw: m[1], code: m[2].toLowerCase() });
  }

  if (icons.length === 0) {
    console.error('✗ parsed zero icons — the remixicon CSS format has changed.');
    process.exit(1);
  }

  fs.mkdirSync(ASSET_DIR, { recursive: true });
  fs.copyFileSync(TTF, path.join(ASSET_DIR, 'RemixIcon.ttf'));

  const body = icons
    .map(
      (i) =>
        `  /// \`ri-${i.raw}\`\n` +
        `  static const IconData ${i.dart} = IconData(0x${i.code}, fontFamily: _family, fontPackage: _package);`
    )
    .join('\n\n');

  const src = `// GENERATED FILE — DO NOT EDIT.
//
// Produced by tools/generate-flutter-icons.ts from the \`remixicon\` package,
// the same icon set the Angular library uses. Regenerate with:
//
//     npm run generate:flutter-icons
//
// ${icons.length} icons. Flutter's \`--tree-shake-icons\` strips the glyphs your app
// does not reference, so the full set costs nothing to ship — provided you use
// the constants below and not the dynamic lookup in tolle_icons_by_name.dart.

import 'package:flutter/widgets.dart';

/// Remix Icon glyphs, named as \`IconData\` constants.
///
/// Use with the standard [Icon] widget — no Material ancestor required:
///
/// \`\`\`dart
/// Icon(TolleIcons.checkLine, size: 16, color: theme.colors.foreground)
/// \`\`\`
abstract final class TolleIcons {
  static const String _family = 'RemixIcon';
  static const String _package = 'tolle_ui';

${body}
}
`;

  // The name → IconData map lives in its own library, and is deliberately not
  // exported from `tolle_ui.dart`.
  //
  // Flutter's --tree-shake-icons keeps any IconData the compiled program can
  // reach. A map naming all ${icons.length} glyphs makes every one reachable, which
  // took the example app's font from a 99% reduction down to 18%. Isolating it
  // means an app pays for the full font only if it actually imports the
  // dynamic lookup.
  const byNameSrc = `// GENERATED FILE — DO NOT EDIT.
//
// Produced by tools/generate-flutter-icons.ts. Regenerate with:
//
//     npm run generate:flutter-icons

import 'package:flutter/widgets.dart';

import 'tolle_icons.dart';

/// Looks an icon up by its original \`ri-*\` name.
///
/// For porting a template that picks an icon at runtime. **Importing this
/// defeats icon tree-shaking** — it makes all ${icons.length} glyphs reachable, so the
/// full ~600KB font ships. Prefer the [TolleIcons] constants wherever the icon
/// is known at compile time; this file is not exported from \`tolle_ui.dart\`
/// for that reason, and has to be imported explicitly:
///
/// \`\`\`dart
/// import 'package:tolle_ui/src/icons/tolle_icons_by_name.dart';
/// \`\`\`
IconData? tolleIconByName(String riName) =>
    tolleIconsByName[riName.startsWith('ri-') ? riName.substring(3) : riName];

/// Every glyph, keyed by its \`ri-*\` name. See [tolleIconByName] for the
/// tree-shaking caveat.
const Map<String, IconData> tolleIconsByName = <String, IconData>{
${icons.map((i) => `  '${i.raw}': TolleIcons.${i.dart},`).join('\n')}
};
`;
  fs.writeFileSync(
    path.join(path.dirname(OUT), 'tolle_icons_by_name.dart'),
    byNameSrc
  );

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, src);

  console.log(`Generated ${path.relative(ROOT, OUT)}`);
  console.log(`  ${icons.length} icons`);
  console.log(`  font → ${path.relative(ROOT, path.join(ASSET_DIR, 'RemixIcon.ttf'))}`);

  reportDeadAngularReferences(new Set(icons.map((i) => i.raw)));
}

/**
 * Flags `ri-*` classes the Angular library references that the pinned Remix
 * Icon version does not define.
 *
 * In a browser these fail silently — the glyph is simply absent and the icon
 * renders as nothing, which is easy to ship without noticing. The Flutter port
 * has to resolve every icon to a real constant, so generating the map is the
 * natural moment to surface them for both libraries.
 */
function reportDeadAngularReferences(known: Set<string>) {
  const libDir = path.join(ROOT, 'projects/tolle/src/lib');
  if (!fs.existsSync(libDir)) return;

  const referenced = new Map<string, string[]>();
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
        const text = fs.readFileSync(full, 'utf8');
        for (const m of text.matchAll(/\bri-([a-z0-9-]+)\b/g)) {
          // Size and alignment helpers (ri-lg, ri-xl…) are not glyphs.
          if (['lg', 'xl', 'xxs', 'xs', 'sm', '1x', '2x', '3x', 'fw'].includes(m[1])) continue;
          const at = path.relative(ROOT, full);
          referenced.set(m[1], [...(referenced.get(m[1]) ?? []), at]);
        }
      }
    }
  };
  walk(libDir);

  const dead = [...referenced.keys()].filter((n) => !known.has(n)).sort();
  console.log(`  angular references: ${referenced.size} distinct icons`);
  if (dead.length === 0) {
    console.log('  ✓ every one resolves');
    return;
  }
  console.warn(
    `\n⚠ ${dead.length} icon(s) referenced by the Angular library do not exist in this\n` +
      `  Remix Icon version — they render as an empty glyph in the browser today:`
  );
  for (const name of dead) {
    const where = [...new Set(referenced.get(name))];
    console.warn(`    ri-${name}  ← ${where.join(', ')}`);
  }
}

if (require.main === module) main();
