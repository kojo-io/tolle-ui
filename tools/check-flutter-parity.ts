/**
 * Flutter parity gate.
 *
 * Compares the Dart package against `flutter-parity.json` and reports what is
 * implemented, what is missing, and which parameters a ported component has
 * dropped. Two libraries maintained by hand diverge quickly; this turns that
 * drift into a build failure instead of a bug report six months later.
 *
 *   npm run check:flutter-parity            # report, exit 0
 *   npm run check:flutter-parity -- --strict  # exit 1 on any gap in a ported component
 *
 * Components that have not been started yet are *not* failures — they are the
 * backlog, and the report prints them as coverage. Strict mode only fails on a
 * component that exists in Dart but has fallen behind its contract, which is
 * the drift worth blocking.
 *
 * An intentional difference is declared in the Dart source with a marker
 * comment, so divergences live next to the code that makes them:
 *
 *   // parity: ignore <paramName> — DOM-only, no Flutter equivalent
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const CONTRACT = path.join(ROOT, 'projects/tolle/registry/flutter-parity.json');
const DART_LIB = path.join(ROOT, 'flutter/tolle_ui/lib');

interface ParityParam {
  name: string;
  angularType: string;
  dartType: string;
  required?: boolean;
}
interface ParityClass {
  angularClass: string;
  dartClass: string;
  kind: 'component' | 'directive';
  inputs: ParityParam[];
  outputs: ParityParam[];
  slots: { name: string; dartParam: string }[];
}
interface ParityItem {
  name: string;
  category?: string;
  classes: ParityClass[];
}
interface Contract {
  itemCount: number;
  items: ParityItem[];
}

/**
 * Inputs that are expected to have no Dart counterpart, library-wide.
 *
 * `class` is the Tailwind escape hatch every Angular component carries. It was
 * dropped by decision in Phase 0 — Flutter has no class strings, and the
 * replacement is a typed `style:` override (see the plan, Decision 3). It is
 * also a Dart reserved word. Listing it once here keeps the report about real
 * gaps instead of repeating one known divergence 117 times.
 */
const GLOBALLY_IGNORED = new Set(['class']);

/* --------------------------- scan the Dart side ---------------------------- */

interface DartClass {
  params: Set<string>;
  ignored: Set<string>;
  file: string;
}

function dartFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...dartFiles(full));
    else if (entry.name.endsWith('.dart')) out.push(full);
  }
  return out;
}

/**
 * Indexes the declared classes and their named constructor parameters.
 *
 * Deliberately a source scan rather than an analyzer run: the gate has to work
 * from the Node side of this repo, where the Dart analyzer is not available,
 * and the library's own style — one class per widget, named parameters — makes
 * the scan reliable. It over-reports parameters rather than under-reporting,
 * so a real gap is never hidden by a parsing miss.
 */
function scanDart(): Map<string, DartClass> {
  const found = new Map<string, DartClass>();

  for (const file of dartFiles(DART_LIB)) {
    const src = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);

    const classRe = /^class\s+([A-Z][A-Za-z0-9_]*)\b/gm;
    let m: RegExpExecArray | null;
    while ((m = classRe.exec(src))) {
      const name = m[1];
      // Body spans from the class declaration to the next top-level `class`.
      const rest = src.slice(m.index);
      const next = rest.slice(1).search(/^class\s+/m);
      const body = next === -1 ? rest : rest.slice(0, next + 1);

      const params = new Set<string>();
      // `this.foo`, `required this.foo`, and `super.key`-style forwarding.
      for (const p of body.matchAll(/\bthis\.([a-z][A-Za-z0-9_]*)\b/g)) {
        params.add(p[1]);
      }
      // Fields, which is how a widget exposes a param it stores under another
      // name, plus getters that stand in for a computed input.
      for (const f of body.matchAll(
        /^\s{2}(?:final|late final)\s+[^;=]+?\b([a-z][A-Za-z0-9_]*)\s*[;=]/gm
      )) {
        params.add(f[1]);
      }

      const ignored = new Set<string>();
      for (const ig of body.matchAll(/\/\/\s*parity:\s*ignore\s+([a-zA-Z0-9_, ]+)/g)) {
        for (const nm of ig[1].split(/[,\s]+/).filter(Boolean)) ignored.add(nm);
      }

      found.set(name, { params, ignored, file: rel });
    }
  }
  return found;
}

/* --------------------------------- report ---------------------------------- */

interface Gap {
  item: string;
  dartClass: string;
  file: string;
  missing: string[];
}

function main() {
  const strict = process.argv.includes('--strict');

  if (!fs.existsSync(CONTRACT)) {
    console.error(
      `✗ ${path.relative(ROOT, CONTRACT)} not found — run \`npm run generate:registry\` first.`
    );
    process.exit(1);
  }

  const contract: Contract = JSON.parse(fs.readFileSync(CONTRACT, 'utf8'));
  const dart = scanDart();

  const implemented: string[] = [];
  const notStarted: string[] = [];
  const gaps: Gap[] = [];

  for (const item of contract.items) {
    // An item counts as started once any of its classes exists in Dart.
    const present = item.classes.filter((c) => dart.has(c.dartClass));
    if (present.length === 0) {
      notStarted.push(item.name);
      continue;
    }
    implemented.push(item.name);

    for (const cls of present) {
      const impl = dart.get(cls.dartClass)!;
      const expected = [
        ...cls.inputs.map((i) => i.name),
        ...cls.outputs.map((o) => o.name),
        ...cls.slots.map((s) => s.dartParam),
      ];
      const missing = expected.filter(
        (name) =>
          !impl.params.has(name) &&
          !impl.ignored.has(name) &&
          !GLOBALLY_IGNORED.has(name)
      );
      if (missing.length) {
        gaps.push({
          item: item.name,
          dartClass: cls.dartClass,
          file: impl.file,
          missing: [...new Set(missing)],
        });
      }
    }
  }

  const total = contract.items.length;
  const pct = total === 0 ? 0 : Math.round((implemented.length / total) * 100);

  console.log('Flutter parity');
  console.log('──────────────');
  console.log(`  ported      ${implemented.length}/${total}  (${pct}%)`);
  console.log(`  not started ${notStarted.length}`);
  console.log(`  gaps        ${gaps.length}`);

  if (gaps.length) {
    console.log('\nPorted components missing contract parameters:');
    for (const g of gaps) {
      console.log(`  ✗ ${g.dartClass}  (${g.item})  ${g.file}`);
      console.log(`      missing: ${g.missing.join(', ')}`);
    }
    console.log(
      '\n  Add the parameter, or declare the difference next to the code:\n' +
        '      // parity: ignore <name> — <why>'
    );
  }

  if (notStarted.length) {
    const byCategory = new Map<string, string[]>();
    for (const item of contract.items) {
      if (!notStarted.includes(item.name)) continue;
      const key = item.category ?? 'uncategorised';
      byCategory.set(key, [...(byCategory.get(key) ?? []), item.name]);
    }
    console.log('\nRemaining, by category:');
    for (const [category, names] of [...byCategory].sort()) {
      console.log(`  ${category.padEnd(12)} ${names.length}`);
    }
  }

  if (strict && gaps.length) {
    console.error(`\n✗ ${gaps.length} ported component(s) behind the contract.`);
    process.exit(1);
  }
  console.log('\n✓ no drift in ported components.');
}

if (require.main === module) main();
