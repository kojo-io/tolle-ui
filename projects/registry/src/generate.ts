/**
 * Tolle UI registry generator — entry point.
 *
 * Walks `projects/tolle/src/lib/**`, extracts one RegistryItem per
 * component/directive file, and builds the transitive file-dependency graph.
 * The emitters (registry.json, r/<name>.json, docs-content.json, llms.txt,
 * manifest.json) consume this model in a later build step.
 *
 * Run: npx ts-node -P projects/registry/tsconfig.json projects/registry/src/generate.ts
 */
import { Project, SourceFile } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';
import { extractItem } from './extract';
import { buildFileGraph, resolveTransitive, fileKey, FileNode } from './dep-graph';
import { emitAll, describe, categorize, npmDeps } from './emit';
import { emitFlutterParity } from './flutter-parity';
import { enrich, AgentModel } from './enrich';
import { LibInfo } from './agent';
import { RegistryItem } from './types';

const ROOT = path.resolve(__dirname, '../../..');
const LIB_DIR = path.join(ROOT, 'projects/tolle/src/lib');
const OUT_DIR = path.join(ROOT, 'projects/tolle/registry');
const EXAMPLES_DIR = path.join(ROOT, 'projects/docs/src/app/docs-examples');
const PUBLIC_API = path.join(ROOT, 'projects/tolle/src/public-api.ts');

function loadVersions(): Record<string, string> {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  return { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}), ...(pkg.peerDependencies ?? {}) };
}

export interface Model {
  items: RegistryItem[];
  graph: Map<string, FileNode>;
  versions: Record<string, string>;
  sourceFiles: SourceFile[];
}

export function buildModel(): Model {
  const versions = loadVersions();
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { allowJs: false, skipLibCheck: true, strict: true },
  });
  // Sidecars are metadata, not lib code: never a registry item or a CLI file.
  project.addSourceFilesAtPaths([path.join(LIB_DIR, '**/*.ts'), '!' + path.join(LIB_DIR, '**/*.registry.ts')]);
  const sourceFiles = project.getSourceFiles();

  const items: RegistryItem[] = [];
  for (const sf of sourceFiles) {
    if (sf.getFilePath().endsWith('.spec.ts')) continue;
    const item = extractItem(sf, versions);
    if (item) items.push(item);
  }
  items.sort((a, b) => a.name.localeCompare(b.name));

  const graph = buildFileGraph(sourceFiles, LIB_DIR, versions);
  return { items, graph, versions, sourceFiles };
}

/** Model + sidecars, examples, services, and the agent page grouping. */
export function buildAgentModel(model: Model): AgentModel {
  return enrich(
    model.items,
    model.graph,
    model.sourceFiles,
    { root: ROOT, libDir: LIB_DIR, examplesDir: EXAMPLES_DIR, publicApi: PUBLIC_API },
    { describe, categorize, npmFor: (i) => npmDeps(i, model.graph) }
  );
}

export function libInfo(): LibInfo {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'projects/tolle/package.json'), 'utf8'));
    const major = String(pkg.peerDependencies?.['@angular/core'] ?? '').match(/(\d+)/)?.[1] ?? '?';
    return { version: pkg.version ?? '0.0.0', angularMajor: major };
  } catch {
    return { version: '0.0.0', angularMajor: '?' };
  }
}

function main() {
  const model = buildModel();
  const { items, graph } = model;
  const agent = buildAgentModel(model);
  if (agent.problems.length) {
    // Loud but not fatal here, so a local build still produces artifacts;
    // `npm run check:agent-docs` (CI) fails on them.
    console.warn(`⚠ ${agent.problems.length} agent-doc problem(s):\n  ${agent.problems.join('\n  ')}`);
  }

  // Surface any unresolved internal refs — a broken copy is worse than a loud one.
  const allUnresolved = new Set<string>();
  for (const item of items) {
    for (const u of resolveTransitive(fileKey(item.file), graph).unresolved) allUnresolved.add(u);
  }
  if (allUnresolved.size) {
    console.warn(`⚠ unresolved internal refs: ${[...allUnresolved].sort().join(', ')}`);
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { payloads } = emitAll(items, graph, LIB_DIR, OUT_DIR, libInfo(), agent);
  const parity = emitFlutterParity(items, OUT_DIR);

  const totalComponents = items.reduce((n, i) => n + i.components.length, 0);
  const totalInputs = items.reduce((n, i) => n + i.components.reduce((m, c) => m + c.inputs.length, 0), 0);
  const totalOutputs = items.reduce((n, i) => n + i.components.reduce((m, c) => m + c.outputs.length, 0), 0);

  console.log(`Registry generated → ${path.relative(ROOT, OUT_DIR)}/`);
  console.log(
    `  ${items.length} items · ${totalComponents} classes · ${totalInputs} inputs · ${totalOutputs} outputs`
  );
  console.log(`  artifacts: registry.json, r/*.json (${payloads.length}), docs/*.md (${agent.pages.length} pages), docs-content.json, llms.txt, llms-full.txt, manifest.json, flutter-parity.json`);
  console.log(`  flutter parity contract: ${parity.items.length} items · ${parity.items.reduce((n, i) => n + i.classes.length, 0)} classes`);
}

if (require.main === module) main();
