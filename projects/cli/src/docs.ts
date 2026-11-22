import * as fs from 'fs';
import * as path from 'path';
import { resolveSource } from './registry';
import { readConfigOrDefault } from './util';

const fetchFn: ((url: string) => Promise<any>) | undefined = (globalThis as any).fetch;

/**
 * `tolle docs [name]` — print a component's agent page (or the llms.txt index
 * with no name). Resolves like `add`: the installed package first, so the page
 * matches the version in node_modules, then the hosted registry.
 */
export async function runDocs(positionals: string[], flags: Record<string, string | boolean>): Promise<void> {
  const config = readConfigOrDefault();
  const source = resolveSource(config.registry, flags.registry as string | undefined);
  const name = positionals[0];
  const rel = name ? `docs/${name}.md` : 'llms.txt';
  process.stdout.write(await readRegistryFile(source, rel, name));
}

async function readRegistryFile(source: string, rel: string, name?: string): Promise<string> {
  if (/^https?:/i.test(source)) {
    if (!fetchFn) throw new Error('global fetch unavailable — use Node 18+ or install @tolle_/tolle-ui locally');
    const res = await fetchFn(`${source.replace(/\/$/, '')}/${rel}`);
    if (!res.ok) throw new Error(name ? `No docs page for "${name}" (${res.status}). Run with no name to list components.` : `llms.txt not found (${res.status})`);
    return res.text();
  }
  const p = path.join(source, rel);
  if (!fs.existsSync(p)) {
    throw new Error(
      name
        ? `No docs page for "${name}" at ${p}. Run "tolle docs" with no name to list components.`
        : `${p} not found — this @tolle_/tolle-ui version predates agent docs; upgrade it or pass --registry https://tolle-ui.com/registry`
    );
  }
  return fs.readFileSync(p, 'utf8');
}
