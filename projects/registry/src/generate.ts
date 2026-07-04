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
import { emitAll } from './emit';
import { RegistryItem } from './types';

const ROOT = path.resolve(__dirname, '../../..');
const LIB_DIR = path.join(ROOT, 'projects/tolle/src/lib');
const OUT_DIR = path.join(ROOT, 'projects/tolle/registry');

function loadVersions(): Record<string, string> {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  return { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}), ...(pkg.peerDependencies ?? {}) };
}

export interface Model {
  items: RegistryItem[];
  graph: Map<string, FileNode>;
  versions: Record<string, string>;
}

export function buildModel(): Model {
  const versions = loadVersions();
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { allowJs: false, skipLibCheck: true },
  });
  project.addSourceFilesAtPaths(path.join(LIB_DIR, '**/*.ts'));
  const sourceFiles = project.getSourceFiles();

  const items: RegistryItem[] = [];
  for (const sf of sourceFiles) {
    if (sf.getFilePath().endsWith('.spec.ts')) continue;
    const item = extractItem(sf, versions);
    if (item) items.push(item);
  }
  items.sort((a, b) => a.name.localeCompare(b.name));

  const graph = buildFileGraph(sourceFiles, LIB_DIR, versions);
  return { items, graph, versions };
}

function libVersion(): string {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'projects/tolle/package.json'), 'utf8')).version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function main() {
  const { items, graph } = buildModel();

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
  const { payloads } = emitAll(items, graph, LIB_DIR, OUT_DIR, libVersion());

  const totalComponents = items.reduce((n, i) => n + i.components.length, 0);
  const totalInputs = items.reduce((n, i) => n + i.components.reduce((m, c) => m + c.inputs.length, 0), 0);
  const totalOutputs = items.reduce((n, i) => n + i.components.reduce((m, c) => m + c.outputs.length, 0), 0);

  console.log(`Registry generated → ${path.relative(ROOT, OUT_DIR)}/`);
  console.log(
    `  ${items.length} items · ${totalComponents} classes · ${totalInputs} inputs · ${totalOutputs} outputs`
  );
  console.log(`  artifacts: registry.json, r/*.json (${payloads.length}), docs-content.json, llms.txt, llms-full.txt, manifest.json`);
}

if (require.main === module) main();
