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
import { RegistryItem } from './types';
import { fileKey, resolveTransitive, FileNode } from './dep-graph';
import { LibInfo, renderPage, renderPartStub, renderLlms, renderLlmsFull, bindingName, classifyVariants } from './agent';
import type { AgentModel } from './enrich';

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
  lib: LibInfo,
  agent: AgentModel
) {
  const itemKeys = new Map(items.map((i) => [fileKey(i.file), i.name]));
  const payloads = items.map((i) => buildPayload(i, graph, itemKeys, libDir));

  fs.mkdirSync(path.join(outDir, 'r'), { recursive: true });
  writeRegistryIndex(items, payloads, outDir);
  for (const p of payloads) write(path.join(outDir, 'r', `${p.name}.json`), json(p));
  writeDocsContent(items, outDir);
  writeAgentDocs(items, agent, lib, outDir);
  writeManifest(items, payloads, outDir, lib, agent);

  return { payloads };
}

/* ------------------------------ agent docs -------------------------------- */

/**
 * docs/<page>.md per component page (+ a stub per part), and llms.txt /
 * llms-full.txt. Links in `llms.txt` are relative to the registry folder, which
 * is how the npm package and `/registry/` on the site lay it out; `site/`
 * holds a copy for the site root, where the links need the `/registry/` prefix.
 */
function writeAgentDocs(items: RegistryItem[], agent: AgentModel, lib: LibInfo, outDir: string) {
  const byName = new Map(items.map((i) => [i.name, i]));
  for (const page of agent.pages) {
    write(path.join(outDir, 'docs', `${page.name}.md`), renderPage(page, lib));
    for (const part of page.items.slice(1)) {
      write(path.join(outDir, 'docs', `${part.name}.md`), renderPartStub(byName.get(part.name)!, page));
    }
  }
  write(path.join(outDir, 'llms.txt'), renderLlms(agent.pages, lib, ''));
  write(path.join(outDir, 'llms-full.txt'), renderLlmsFull(agent.pages, lib));
  write(path.join(outDir, 'site', 'llms.txt'), renderLlms(agent.pages, lib, '/registry/'));
  write(path.join(outDir, 'site', 'llms-full.txt'), renderLlmsFull(agent.pages, lib));
}

/** npm packages an item needs at runtime (rxjs ships with Angular). */
export function npmDeps(item: RegistryItem, graph: Map<string, FileNode>): string[] {
  return Object.keys(resolveTransitive(fileKey(item.file), graph).npm).filter((p) => p !== 'rxjs');
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
    homepage: 'https://tolle-ui.com',
    items: items.map((i) => {
      const p = byName.get(i.name)!;
      return {
        name: p.name,
        type: p.type,
        title: p.title,
        description: p.description,
        category: p.category,
        isNew: i.isNew,
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
      isNew: i.isNew,
      import: importLine(i),
      install: `npx @tolle_/cli add ${i.name}`,
      components: i.components.map((c) => ({
        name: c.className,
        selector: c.selector,
        kind: c.kind,
        // Prop tables show what a consumer writes: the alias when there is one.
        inputs: c.inputs.map(({ alias, ...i }) => ({ ...i, name: bindingName({ alias, ...i }) })),
        outputs: c.outputs.map(({ alias, ...o }) => ({ ...o, name: alias ?? o.name })),
        slots: c.slots,
        variants: c.variants,
        forms: c.forms,
      })),
    };
  }
  write(path.join(outDir, 'docs-content.json'), json(out));
}

/* ------------------------------- manifest --------------------------------- */

/**
 * The MCP superset. `components` is one entry per registry item (the docs nav
 * reads `name` / `isNew` from it); `pages` is the agent-facing grouping, each
 * with its doc path, examples, services and types, so a server can answer
 * every tool call from this file plus `docs/`.
 */
function writeManifest(items: RegistryItem[], payloads: Payload[], outDir: string, lib: LibInfo, agent: AgentModel) {
  const byName = new Map(payloads.map((p) => [p.name, p]));
  const pageOf = new Map<string, string>();
  for (const pg of agent.pages) for (const it of pg.items) pageOf.set(it.name, pg.name);
  const manifest = {
    package: PKG,
    version: lib.version,
    angular: lib.angularMajor,
    registry: 'r/{name}.json',
    docs: 'docs/{name}.md',
    components: items.map((i) => {
      const p = byName.get(i.name)!;
      return {
        name: i.name,
        title: p.title,
        description: p.description,
        category: p.category,
        selector: i.selector,
        isNew: i.isNew,
        page: pageOf.get(i.name),
        parent: i.parent,
        import: importLine(i),
        install: `npx @tolle_/cli add ${i.name}`,
        registryDependencies: p.registryDependencies,
        dependencies: p.dependencies,
        files: p.files.map((f) => f.path),
        components: i.components.map((c) => ({
          ...c,
          inputs: c.inputs.map((x) => ({ ...x, binding: bindingName(x) })),
          ...classifyVariants(c),
        })),
      };
    }),
    pages: agent.pages.map((pg) => ({
      name: pg.name,
      title: pg.title,
      description: pg.description,
      category: pg.category,
      isNew: pg.isNew,
      doc: `docs/${pg.name}.md`,
      whenToUse: pg.whenToUse,
      alternatives: pg.alternatives,
      pitfalls: pg.pitfalls,
      keywords: pg.keywords,
      parts: pg.items.slice(1).map((i) => i.name),
      classes: pg.classes.map((c) => c.className),
      selectors: pg.classes.map((c) => c.selector).filter(Boolean),
      formControls: pg.classes.filter((c) => c.forms).map((c) => ({ className: c.className, ...c.forms })),
      services: pg.services,
      types: pg.types.map((t) => t.name),
      examples: pg.examples,
    })),
  };
  write(path.join(outDir, 'manifest.json'), json(manifest));
}

/* -------------------------------- helpers --------------------------------- */

function importLine(i: RegistryItem): string {
  const classes = i.components.map((c) => c.className).join(', ');
  return `import { ${classes} } from '${PKG}';`;
}

/** Placeholder description, used until a sidecar provides a real one. */
export function describe(i: RegistryItem): string {
  const c = i.components.find((x) => x.selector === i.selector) ?? i.components[0];
  const vs = c?.variants.map((v) => v.name) ?? [];
  const base = `${titleCase(i.name)} component`;
  return vs.length ? `${base} with ${vs.join(' and ')} options.` : `${base}.`;
}

const CATEGORY: [RegExp, string][] = [
  // Anchored entries come first so they win outright. Matching these loosely
  // would shadow existing names further down — an unanchored /item/ would
  // steal `breadcrumb-item` from navigation, /select/ would steal it from forms.
  // AI & chat. Anchored and listed before the generic rules so `prompt-input`
  // isn't captured by /input/ → forms, `context` by /context/ → overlays, or
  // `message-scroller` by /scroll/ → layout.
  [
    /^(message|message-scroller|bubble|marker|attachment|conversation|prompt-input|reasoning|tool|sources|suggestion|inline-citation|shimmer|task|chain-of-thought|plan|queue|checkpoint|confirmation|context|model-selector)$/,
    'ai',
  ],
  [/^direction$/, 'utilities'],
  [/^time-picker$|^date-time-picker$/, 'date-time'],
  [/^chart/, 'data'],

  [/^spinner/, 'feedback'],
  [/^kbd/, 'actions'],
  [/^item/, 'layout'],
  [/^typography/, 'layout'],
  [/^field/, 'forms'],
  [/^combobox/, 'forms'],
  [/^command/, 'overlays'],
  [/^menubar|^navigation-menu/, 'navigation'],

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

export function categorize(name: string): string {
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
