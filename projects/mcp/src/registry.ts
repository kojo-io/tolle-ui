import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';

export const DEFAULT_REGISTRY = 'https://tolle-ui.com/registry';

export interface ExampleMeta {
  title: string;
  code: string;
  source: string;
}

export interface PageEntry {
  name: string;
  title: string;
  description: string;
  category: string;
  isNew?: boolean;
  doc: string;
  whenToUse?: string;
  alternatives?: { name: string; when: string }[];
  pitfalls?: string[];
  keywords?: string[];
  parts: string[];
  classes: string[];
  selectors: string[];
  formControls: { className: string; valueType: string; notes?: string }[];
  services: { className: string; members: { name: string; signature: string }[] }[];
  types: string[];
  examples: ExampleMeta[];
}

export interface Manifest {
  package: string;
  version: string;
  angular?: string;
  pages?: PageEntry[];
  components: { name: string; page?: string }[];
}

/**
 * Where the registry lives, in order: `--registry` / `TOLLE_REGISTRY`, the
 * `@tolle_/tolle-ui` installed in the working directory (version-matched to
 * the project — the reason to prefer it), then the hosted registry.
 */
export function resolveRegistry(override?: string, cwd = process.cwd()): string {
  if (override) return override;
  try {
    const req = createRequire(path.join(cwd, 'noop.js'));
    return path.dirname(req.resolve('@tolle_/tolle-ui/registry/manifest.json'));
  } catch {
    return DEFAULT_REGISTRY;
  }
}

const fetchFn: ((url: string) => Promise<any>) | undefined = (globalThis as any).fetch;

export class Registry {
  private cache = new Map<string, string>();
  private manifest?: Manifest;

  constructor(readonly source: string) {}

  get isRemote(): boolean {
    return /^https?:/i.test(this.source);
  }

  async read(rel: string): Promise<string> {
    const hit = this.cache.get(rel);
    if (hit !== undefined) return hit;
    let text: string;
    if (this.isRemote) {
      if (!fetchFn) throw new Error('global fetch unavailable — use Node 18+ or install @tolle_/tolle-ui in the project');
      const res = await fetchFn(`${this.source.replace(/\/$/, '')}/${rel}`);
      if (!res.ok) throw new Error(`${rel}: HTTP ${res.status}`);
      text = await res.text();
    } else {
      const p = path.join(this.source, rel);
      if (!fs.existsSync(p)) throw new Error(`${rel} not found in ${this.source}`);
      text = fs.readFileSync(p, 'utf8');
    }
    this.cache.set(rel, text);
    return text;
  }

  async getManifest(): Promise<Manifest> {
    if (!this.manifest) {
      const m = JSON.parse(await this.read('manifest.json')) as Manifest;
      if (!m.pages) {
        throw new Error(
          `${m.package}@${m.version} predates agent docs (no "pages" in manifest.json). Upgrade @tolle_/tolle-ui, or start the server with --registry ${DEFAULT_REGISTRY}.`
        );
      }
      this.manifest = m;
    }
    return this.manifest;
  }

  /** Accepts a page name, a part name, a selector (`tolle-select-item`, `[tolleTooltip]`) or a class name. */
  async findPage(query: string): Promise<PageEntry | undefined> {
    const m = await this.getManifest();
    const q = query.trim().replace(/^<|>$/g, '').toLowerCase();
    const pages = m.pages!;
    const byName = pages.find((p) => p.name === q || p.title.toLowerCase() === q);
    if (byName) return byName;
    const viaPart = pages.find((p) => p.parts.includes(q));
    if (viaPart) return viaPart;
    const bare = q.replace(/^tolle-/, '').replace(/^\[|\]$/g, '');
    return (
      pages.find((p) => p.name === bare) ??
      pages.find((p) => p.selectors.some((s) => s.toLowerCase().split(',').map((x) => x.trim()).includes(q) || s.toLowerCase() === `[${bare}]`)) ??
      pages.find((p) => p.classes.some((c) => c.toLowerCase() === q)) ??
      pages.find((p) => p.services.some((s) => s.className.toLowerCase() === q))
    );
  }
}
