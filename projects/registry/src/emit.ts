/**
 * Emitters — turn the registry model into published artifacts. One pipeline,
 * many outputs, all derived from source so nothing drifts:
 *
 *   registry.json        shadcn-style index (metadata only)
 *   r/<name>.json        self-describing CLI payloads (file contents + deps)
 *   docs-content.json    docs-app API tables (replaces the old extractor output)
 *   llms.txt             llmstxt.org index
 *   llms-full.txt        full per-component reference for agents
 *   manifest.json        MCP superset (everything, keyed for tools)
 */
import * as fs from 'fs';
import * as path from 'path';
import { RegistryItem, ComponentClassMeta } from './types';
import { fileKey, resolveTransitive, FileNode } from './dep-graph';

const PKG = '@tolle_/tolle-ui';

interface Payload {
  name: string;
  type: 'registry:ui';
  title: string;
  description: string;
  category: string;
  registryDependencies: string[];
  dependencies: string[];
  files: { path: string; content: string; target: string }[];
}

export function emitAll(
  items: RegistryItem[],
  graph: Map<string, FileNode>,
  libDir: string,
  outDir: string,
  libVersion: string
) {
  const itemKeys = new Map(items.map((i) => [fileKey(i.file), i.name]));
  const payloads = items.map((i) => buildPayload(i, graph, itemKeys, libDir));

  fs.mkdirSync(path.join(outDir, 'r'), { recursive: true });
  writeRegistryIndex(items, payloads, outDir);
  for (const p of payloads) write(path.join(outDir, 'r', `${p.name}.json`), json(p));
  writeDocsContent(items, outDir);
  write(path.join(outDir, 'llms.txt'), buildLlms(items));
  write(path.join(outDir, 'llms-full.txt'), buildLlmsFull(items));
  writeManifest(items, payloads, outDir, libVersion);

  return { payloads };
}

/* ------------------------------- payloads --------------------------------- */

function buildPayload(
  item: RegistryItem,
  graph: Map<string, FileNode>,
  itemKeys: Map<string, string>,
  libDir: string
): Payload {
  const self = fileKey(item.file);
  const r = resolveTransitive(self, graph);

  // Own files = self + support (services, cn, *.types, modal-ref…). Sibling
  // registry items are referenced via registryDependencies (CLI fetches them).
  const ownRel: string[] = [];
  const regDeps = new Set<string>();
  for (const rel of r.files) {
    const k = fileKey(rel);
    if (k === self) ownRel.push(rel);
    else if (itemKeys.has(k)) regDeps.add(itemKeys.get(k)!);
    else ownRel.push(rel);
  }
  if (r.usesCn) ownRel.push('utils/cn.ts');

  const files = ownRel
    .filter((rel, i) => ownRel.indexOf(rel) === i)
    .map((rel) => ({
      path: rel,
      target: `ui/${rel}`,
      content: safeRead(path.join(libDir, rel)),
    }));

  return {
    name: item.name,
    type: 'registry:ui',
    title: item.title ?? titleCase(item.name),
    description: item.description ?? describe(item),
    category: item.category ?? categorize(item.name),
    registryDependencies: [...regDeps].sort(),
    dependencies: Object.keys(r.npm).filter((p) => p !== 'rxjs').sort(),
    files,
  };
}

function writeRegistryIndex(items: RegistryItem[], payloads: Payload[], outDir: string) {
  const byName = new Map(payloads.map((p) => [p.name, p]));
  const index = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'tolle-ui',
    homepage: 'https://tolle-ui.dev',
    items: items.map((i) => {
      const p = byName.get(i.name)!;
      return {
        name: p.name,
        type: p.type,
        title: p.title,
        description: p.description,
        category: p.category,
        files: p.files.map((f) => ({ path: f.path, type: 'registry:ui' })),
        registryDependencies: p.registryDependencies,
        dependencies: p.dependencies,
      };
    }),
  };
  write(path.join(outDir, 'registry.json'), json(index));
}

/* ------------------------------ docs-content ------------------------------ */

function writeDocsContent(items: RegistryItem[], outDir: string) {
  const out: Record<string, any> = {};
  for (const i of items) {
    out[i.name] = {
      category: i.category ?? categorize(i.name),
      title: i.title ?? titleCase(i.name),
      selector: i.selector,
      import: importLine(i),
      install: `npx @tolle_/cli add ${i.name}`,
      components: i.components.map((c) => ({
        name: c.className,
        selector: c.selector,
        kind: c.kind,
        inputs: c.inputs,
        outputs: c.outputs,
        slots: c.slots,
        variants: c.variants,
      })),
    };
  }
  write(path.join(outDir, 'docs-content.json'), json(out));
}

/* --------------------------------- llms ----------------------------------- */

function buildLlms(items: RegistryItem[]): string {
  const lines = [
    '# Tolle UI',
    '',
    '> A high-performance Angular 18 UI library. shadcn-style components you can install from npm (`@tolle_/tolle-ui`) or own via the CLI (`npx @tolle_/cli add <component>`). Config-first theming with CSS variables.',
    '',
    '## Components',
    '',
  ];
  for (const i of items) {
    lines.push(`- [${i.title ?? titleCase(i.name)}](r/${i.name}.json): ${i.description ?? describe(i)}`);
  }
  lines.push('', '## Reference', '', '- [Full component reference](llms-full.txt): every component with inputs, outputs, slots, and variants.');
  return lines.join('\n') + '\n';
}

function buildLlmsFull(items: RegistryItem[]): string {
  const out: string[] = [
    '# Tolle UI — Full Component Reference',
    '',
    'Angular 18 standalone components. Install the package (`npm i @tolle_/tolle-ui`) and import, or own the source (`npx @tolle_/cli add <component>`).',
    '',
  ];
  for (const i of items) {
    out.push(`## ${i.title ?? titleCase(i.name)}`, '');
    out.push(`- Install: \`npx @tolle_/cli add ${i.name}\``);
    out.push(`- Import: \`${importLine(i)}\``);
    out.push('');
    for (const c of i.components) {
      out.push(`### \`<${c.selector ?? c.className}>\`${c.kind === 'directive' ? ' (directive)' : ''}`, '');
      if (c.inputs.length) {
        out.push('Inputs:', '', '| Name | Type | Default | Description |', '| --- | --- | --- | --- |');
        for (const p of c.inputs)
          out.push(`| ${p.name}${p.required ? ' (required)' : ''} | \`${p.type}\` | ${p.default ? `\`${p.default}\`` : '—'} | ${p.description ?? ''} |`);
        out.push('');
      }
      if (c.outputs.length) {
        out.push('Outputs:', '', '| Name | Payload | Description |', '| --- | --- | --- |');
        for (const o of c.outputs) out.push(`| ${o.name} | \`${o.type}\` | ${o.description ?? ''} |`);
        out.push('');
      }
      if (c.slots.length) {
        out.push('Slots: ' + c.slots.map((s) => (s.name === '' ? '_default_' : `\`${s.name}\``)).join(', '), '');
      }
      if (c.variants.length) {
        out.push('Variants:');
        for (const v of c.variants)
          out.push(`- \`${v.name}\`: ${v.options.map((o) => `\`${o}\``).join(', ')}${v.default ? ` (default \`${v.default}\`)` : ''}`);
        out.push('');
      }
    }
  }
  return out.join('\n') + '\n';
}

/* ------------------------------- manifest --------------------------------- */

function writeManifest(items: RegistryItem[], payloads: Payload[], outDir: string, libVersion: string) {
  const byName = new Map(payloads.map((p) => [p.name, p]));
  const manifest = {
    package: PKG,
    version: libVersion,
    registry: 'r/{name}.json',
    components: items.map((i) => {
      const p = byName.get(i.name)!;
      return {
        name: i.name,
        title: p.title,
        description: p.description,
        category: p.category,
        selector: i.selector,
        import: importLine(i),
        install: `npx @tolle_/cli add ${i.name}`,
        registryDependencies: p.registryDependencies,
        dependencies: p.dependencies,
        files: p.files.map((f) => f.path),
        components: i.components,
      };
    }),
  };
  write(path.join(outDir, 'manifest.json'), json(manifest));
}

/* -------------------------------- helpers --------------------------------- */

function importLine(i: RegistryItem): string {
  const classes = i.components.map((c) => c.className).join(', ');
  return `import { ${classes} } from '${PKG}';`;
}

function describe(i: RegistryItem): string {
  const c = i.components.find((x) => x.selector === i.selector) ?? i.components[0];
  const vs = c?.variants.map((v) => v.name) ?? [];
  const base = `${titleCase(i.name)} component`;
  return vs.length ? `${base} with ${vs.join(' and ')} options.` : `${base}.`;
}

const CATEGORY: [RegExp, string][] = [
  [/^button|toggle/, 'actions'],
  [/input|textarea|checkbox|switch|radio|select|slider|segment|tag|otp|country|phone|masked|label/, 'forms'],
  [/calendar|date/, 'date-time'],
  [/modal|sheet|popover|hover|tooltip|dropdown|context|alert-dialog/, 'overlays'],
  [/card|accordion|tabs|collapsible|sidebar|resizable|scroll|separator|aspect/, 'layout'],
  [/alert|badge|skeleton|progress|toast|empty/, 'feedback'],
  [/breadcrumb|pagination/, 'navigation'],
  [/table|cell/, 'data'],
  [/avatar|carousel/, 'media'],
];

function categorize(name: string): string {
  for (const [re, cat] of CATEGORY) if (re.test(name)) return cat;
  return 'components';
}

function titleCase(slug: string): string {
  return slug.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function safeRead(p: string): string {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return `/* NOT FOUND: ${p} */`;
  }
}

const json = (v: unknown) => JSON.stringify(v, null, 2);

function write(p: string, content: string) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}
