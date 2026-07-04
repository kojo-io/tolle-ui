/**
 * Transitive dependency resolution for the Tolle UI registry.
 *
 * A registry item (`add select`) must copy not just its own file but every
 * sibling component, service, and support file it transitively imports, plus
 * the npm packages to install. This builds a graph over ALL lib files (keyed by
 * module basename) and resolves the closure. Anything unresolved is surfaced,
 * never silently dropped — a broken copy is worse than a loud one.
 */
import * as path from 'path';
import { SourceFile } from 'ts-morph';
import { classifyDeps } from './extract';
import { Dependencies } from './types';

export interface FileNode {
  /** Graph key: module basename w/o .ts, or the folder name for an index.ts. */
  key: string;
  /** Path relative to the lib root, e.g. 'button.component.ts' or 'carousel/index.ts'. */
  relPath: string;
  deps: Dependencies;
}

/** Graph key for a lib file: 'x/index.ts' → 'x', else basename without '.ts'. */
export function fileKey(fp: string): string {
  const base = path.basename(fp);
  if (base === 'index.ts') return path.basename(path.dirname(fp));
  return base.replace(/\.ts$/, '');
}

export function buildFileGraph(
  sourceFiles: SourceFile[],
  libDir: string,
  versions: Record<string, string>
): Map<string, FileNode> {
  const graph = new Map<string, FileNode>();
  for (const sf of sourceFiles) {
    const fp = sf.getFilePath();
    if (fp.endsWith('.spec.ts')) continue;
    if (fp.includes('/utils/')) continue; // cn is copied via the usesCn flag
    const key = fileKey(fp);
    graph.set(key, {
      key,
      relPath: path.relative(libDir, fp),
      deps: classifyDeps(sf, key, versions),
    });
  }
  return graph;
}

export interface ResolvedDeps {
  /** All lib files to copy (self + transitive internal/services), lib-relative. */
  files: string[];
  /** Friendly slugs of transitive internal component deps (shadcn registryDependencies). */
  registryDependencies: string[];
  /** Transitive service module basenames, e.g. ['select.service']. */
  services: string[];
  /** Merged external npm packages → version range. */
  npm: Record<string, string>;
  /** Merged Angular package specifiers. */
  angular: string[];
  /** Whether the `cn` util must be copied. */
  usesCn: boolean;
  /** Internal refs that matched no graph node (edge cases to fix, not drop). */
  unresolved: string[];
}

const friendly = (ref: string) => ref.replace(/\.(component|directive)$/, '');

export function resolveTransitive(startKey: string, graph: Map<string, FileNode>): ResolvedDeps {
  const files = new Set<string>();
  const npm: Record<string, string> = {};
  const angular = new Set<string>();
  const services = new Set<string>();
  const regDeps = new Set<string>();
  const unresolved = new Set<string>();
  let usesCn = false;

  const visit = (key: string) => {
    const node = graph.get(key);
    if (!node) {
      unresolved.add(key);
      return;
    }
    if (files.has(node.relPath)) return;
    files.add(node.relPath);

    const d = node.deps;
    if (d.usesCn) usesCn = true;
    for (const a of d.angular) angular.add(a);
    for (const [p, v] of Object.entries(d.npm)) npm[p] = v;
    for (const s of d.services) {
      services.add(s);
      visit(s);
    }
    for (const inc of d.internal) {
      if (friendly(inc) !== friendly(startKey)) regDeps.add(friendly(inc));
      visit(inc);
    }
  };
  visit(startKey);

  return {
    files: [...files].sort(),
    registryDependencies: [...regDeps].sort(),
    services: [...services].sort(),
    npm,
    angular: [...angular].sort(),
    usesCn,
    unresolved: [...unresolved].sort(),
  };
}
