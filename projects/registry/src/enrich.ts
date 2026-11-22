/**
 * Enrichment: merge the hand-authored inputs (sidecars, docs-app examples) and
 * the service/type extraction into the AST model, then group it into agent
 * pages. Kept separate from extract.ts so the CLI payloads and the Flutter
 * parity contract see exactly the model they always did.
 */
import * as path from 'path';
import { SourceFile } from 'ts-morph';
import { RegistryItem, ServiceMeta } from './types';
import { FileNode, fileKey } from './dep-graph';
import { loadSidecars, loadDocsExamples, publicApiNames } from './sources';
import { buildTypeIndex, extractServices, TypeDecl } from './services';
import { assignParents, buildPages, Page, titleCase } from './agent';

export interface AgentModel {
  pages: Page[];
  typeIndex: Map<string, TypeDecl>;
  /** Problems that make an example unusable for a consumer. Fatal in CI. */
  problems: string[];
}

export interface EnrichPaths {
  root: string;
  libDir: string;
  examplesDir: string;
  publicApi: string;
}

export function enrich(
  items: RegistryItem[],
  graph: Map<string, FileNode>,
  sourceFiles: SourceFile[],
  p: EnrichPaths,
  helpers: { describe: (i: RegistryItem) => string; categorize: (n: string) => string; npmFor: (i: RegistryItem) => string[] }
): AgentModel {
  const problems: string[] = [];
  const byName = new Map(items.map((i) => [i.name, i]));

  /* sidecars */
  for (const [name, sc] of loadSidecars(p.libDir)) {
    const item = byName.get(name);
    if (!item) {
      problems.push(`${name}.registry.ts: no registry item named '${name}'`);
      continue;
    }
    Object.assign(item, strip({
      title: sc.title,
      description: sc.description,
      category: sc.category,
      whenToUse: sc.whenToUse,
      alternatives: sc.alternatives,
      pitfalls: sc.pitfalls,
      a11yNotes: sc.a11yNotes,
      parts: sc.parts,
      keywords: sc.keywords,
    }));
    for (const alt of sc.alternatives ?? []) {
      if (!byName.has(alt.name)) problems.push(`${name}.registry.ts: alternative '${alt.name}' is not a registry item`);
    }
    for (const [cls, f] of Object.entries(sc.forms ?? {})) {
      const c = item.components.find((x) => x.className === cls);
      if (!c?.forms) {
        problems.push(`${name}.registry.ts: forms.${cls} — no form-control class of that name in ${item.file}`);
        continue;
      }
      if (f.valueType) c.forms.valueType = f.valueType;
      if (f.notes) c.forms.notes = f.notes;
    }
    if (sc.examples?.length) {
      item.examples = [...(item.examples ?? []), ...sc.examples.map((e) => ({ ...e, source: `${name}.registry.ts` }))];
    }
  }

  /* docs-app examples (compiled) go before sidecar ones */
  const exported = sourceFiles.map((sf) => ({
    path: sf.getFilePath(),
    exported: [...sf.getExportedDeclarations().keys()],
  }));
  const publicNames = publicApiNames(p.publicApi, exported);
  const ex = loadDocsExamples(p.examplesDir, publicNames, p.root);
  problems.push(...ex.problems);
  for (const [name, examples] of ex.byItem) {
    const item = byName.get(name);
    if (!item) {
      problems.push(`docs-examples/${name}: no registry item named '${name}' (add it to EXAMPLE_DIR_ALIASES)`);
      continue;
    }
    item.examples = [...examples, ...(item.examples ?? [])];
  }

  /* services → the item they drive */
  const services = extractServices(sourceFiles, p.libDir);
  const typeIndex = buildTypeIndex(sourceFiles, p.libDir);
  const orphans: ServiceMeta[] = [];
  for (const s of services) {
    const owner = ownerOf(s, items, graph);
    if (owner) owner.services = [...(owner.services ?? []), s];
    else orphans.push(s);
  }

  assignParents(items);
  const pages = buildPages(items, typeIndex, helpers.describe, helpers.categorize, helpers.npmFor);

  // A service no component imports (ThemeService) still needs a page.
  for (const s of orphans) {
    const slug = path.basename(s.file).replace(/\.service\.ts$/, '').replace(/\.ts$/, '');
    const pseudo: RegistryItem = {
      name: slug,
      file: s.file,
      title: titleCase(slug),
      components: [],
      dependencies: { internal: [], usesCn: false, services: [], npm: {}, angular: [] },
      services: [s],
    };
    const [page] = buildPages([pseudo], typeIndex, () => s.description ?? `${s.className}: programmatic API.`, () => 'services', () => []);
    page.generatedDescription = !s.description;
    pages.push(page);
  }

  return { pages, typeIndex, problems };
}

/**
 * The item a service belongs to: same file (direction), an item named like the
 * service (modal.service → modal), else the item that imports it (toaster
 * imports toast.service) or that it imports.
 */
function ownerOf(s: ServiceMeta, items: RegistryItem[], graph: Map<string, FileNode>): RegistryItem | undefined {
  const key = fileKey(s.file);
  const same = items.find((i) => i.file === s.file);
  if (same) return same;
  const slug = key.replace(/\.service$/, '');
  const named = items.find((i) => i.name === slug) ?? items.find((i) => i.name.startsWith(slug + '-'));
  if (named) return named;
  const importers = items.filter((i) => graph.get(fileKey(i.file))?.deps.services.includes(key));
  if (importers.length) return importers.sort((a, b) => a.name.length - b.name.length)[0];
  const node = graph.get(key);
  const imported = items.filter((i) => node?.deps.internal.includes(fileKey(i.file)));
  return imported.sort((a, b) => a.name.length - b.name.length)[0];
}

function strip<T extends Record<string, any>>(o: T): Partial<T> {
  const out: Partial<T> = {};
  for (const k of Object.keys(o) as (keyof T)[]) if (o[k] !== undefined) out[k] = o[k];
  return out;
}
