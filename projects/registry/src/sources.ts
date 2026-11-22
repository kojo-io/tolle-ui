/**
 * Hand-authored inputs to the registry: `<name>.registry.ts` sidecars, and the
 * docs-app examples under `projects/docs/src/app/docs-examples/`.
 *
 * Examples are taken from the docs app rather than written a second time
 * because the docs app compiles them — an example an agent copies is one that
 * builds. They are rewritten to consumer form: lib-relative imports collapse
 * into one `import { … } from '@tolle_/tolle-ui'`, `templateUrl` is inlined,
 * and a sibling component an example depends on (a modal's content) is
 * appended so the snippet is complete.
 */
import * as fs from 'fs';
import * as path from 'path';
import { ExampleMeta, RegistrySidecar } from './types';

const PKG = '@tolle_/tolle-ui';

/** docs-examples folder → registry item, where the folder name drifted. */
const EXAMPLE_DIR_ALIASES: Record<string, string> = {
  'check-box': 'checkbox',
  'calendar-range': 'range-calendar',
};

/* -------------------------------- sidecars -------------------------------- */

export function loadSidecars(libDir: string): Map<string, RegistrySidecar> {
  const out = new Map<string, RegistrySidecar>();
  for (const file of walk(libDir).filter((f) => f.endsWith('.registry.ts'))) {
    const name = path.basename(file).replace(/\.registry\.ts$/, '');
    // Runs under ts-node, so requiring a .ts sidecar compiles it on the fly.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(file);
    const value = mod.default ?? Object.values(mod)[0];
    if (!value || typeof value !== 'object') throw new Error(`${file}: export the sidecar object`);
    out.set(name, value as RegistrySidecar);
  }
  return out;
}

/* -------------------------------- examples -------------------------------- */

export interface ExampleLoadResult {
  byItem: Map<string, ExampleMeta[]>;
  /** Imports of names the package doesn't export — the example would not build for a consumer. */
  problems: string[];
}

export function loadDocsExamples(examplesDir: string, publicNames: Set<string>, root: string): ExampleLoadResult {
  const byItem = new Map<string, ExampleMeta[]>();
  const problems: string[] = [];
  if (!fs.existsSync(examplesDir)) return { byItem, problems };

  for (const dir of fs.readdirSync(examplesDir)) {
    const full = path.join(examplesDir, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    const item = EXAMPLE_DIR_ALIASES[dir] ?? dir;
    const files = walk(full).filter((f) => f.endsWith('.component.ts') && !f.endsWith('.spec.ts'));

    // A file another example imports is a helper of that example (a modal's
    // content), not an example of its own.
    const imported = new Set<string>();
    for (const f of files) for (const dep of localImports(f)) imported.add(dep);

    const examples: ExampleMeta[] = [];
    for (const f of files) {
      if (imported.has(f)) continue;
      const code = toConsumerSource(f, publicNames, problems, root);
      examples.push({ title: titleOf(f), code, source: path.relative(root, f) });
    }
    examples.sort((a, b) => rank(a.title) - rank(b.title) || a.title.localeCompare(b.title));
    if (examples.length) byItem.set(item, examples);
  }
  return { byItem, problems };
}

/** Basic/default examples first: they are the ones an agent should copy. */
function rank(title: string): number {
  return /^(basic|default|demo|simple|usage)\b/i.test(title) ? 0 : 1;
}

function titleOf(file: string): string {
  const base = path.basename(file).replace(/\.component\.ts$/, '').replace(/-example$/, '');
  const words = base.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const LOCAL_IMPORT = /import\s+[^;]+?\s+from\s+['"](\.\.?\/[^'"]+\.component)['"];?/g;

function localImports(file: string): string[] {
  const src = fs.readFileSync(file, 'utf8');
  const out: string[] = [];
  for (const m of src.matchAll(LOCAL_IMPORT)) {
    if (m[1].includes('tolle/src/lib')) continue;
    const resolved = path.resolve(path.dirname(file), m[1] + '.ts');
    if (fs.existsSync(resolved)) out.push(resolved);
  }
  return out;
}

function toConsumerSource(file: string, publicNames: Set<string>, problems: string[], root: string, seen = new Set<string>()): string {
  seen.add(file);
  let src = fs.readFileSync(file, 'utf8');

  // Path-banner comments (`// projects/docs/...`) mean nothing in a consumer app.
  src = src.replace(/^\s*\/\/\s*(projects|src)\/\S+\s*\n/gm, '');

  // Collapse every lib-relative import into one package import.
  const names: string[] = [];
  const LIB_IMPORT = /import\s*(type\s+)?\{([^}]*)\}\s*from\s*['"][^'"]*tolle\/src\/lib\/[^'"]*['"];?[ \t]*\n?/g;
  let firstAt = -1;
  src = src.replace(LIB_IMPORT, (_m, _type, specs: string, offset: number) => {
    if (firstAt < 0) firstAt = offset;
    for (const s of specs.split(',').map((x) => x.trim()).filter(Boolean)) {
      if (!names.includes(s)) names.push(s);
      const exported = s.split(/\s+as\s+/)[0].replace(/^type\s+/, '');
      if (!publicNames.has(exported)) problems.push(`${path.relative(root, file)}: '${exported}' is not exported from ${PKG}`);
    }
    return '';
  });
  if (firstAt >= 0 && names.length) {
    const line = `import { ${names.join(', ')} } from '${PKG}';\n`;
    src = src.slice(0, firstAt) + line + src.slice(firstAt);
  }

  // Inline templateUrl; consumers paste one file.
  src = src.replace(/templateUrl\s*:\s*['"](\.\/[^'"]+)['"]/, (_m, rel: string) => {
    const htmlPath = path.resolve(path.dirname(file), rel);
    const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8').trim() : '';
    const body = html.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    return `template: \`\n${indent(body, '    ')}\n  \``;
  });
  src = src.replace(/^\s*styleUrls?\s*:\s*(\[[^\]]*\]|['"][^'"]*['"]),?\s*\n/m, '');

  src = src.replace(/\n{3,}/g, '\n\n').trim();

  // Append helpers this example imports so the snippet is complete.
  for (const dep of localImports(file)) {
    if (seen.has(dep)) continue;
    src += `\n\n// ${path.basename(dep)}\n` + toConsumerSource(dep, publicNames, problems, root, seen);
  }
  return src;
}

/** Every exported declaration reachable from `public-api.ts`. */
export function publicApiNames(publicApi: string, sourceFiles: { path: string; exported: string[] }[]): Set<string> {
  const names = new Set<string>();
  const dir = path.dirname(publicApi);
  const src = fs.readFileSync(publicApi, 'utf8');
  const byPath = new Map(sourceFiles.map((f) => [path.resolve(f.path), f.exported]));
  for (const m of src.matchAll(/export\s*\*\s*from\s*['"]([^'"]+)['"]/g)) {
    const target = path.resolve(dir, m[1]);
    for (const cand of [target + '.ts', path.join(target, 'index.ts')]) {
      for (const n of byPath.get(cand) ?? []) names.add(n);
    }
  }
  for (const m of src.matchAll(/export\s*\{([^}]*)\}\s*from/g)) {
    for (const s of m[1].split(',')) {
      const n = s.trim().split(/\s+as\s+/).pop();
      if (n) names.add(n);
    }
  }
  return names;
}

function indent(text: string, pad: string): string {
  return text
    .split('\n')
    .map((l) => (l.trim() ? pad + l : l))
    .join('\n');
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
