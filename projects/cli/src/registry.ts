import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';

export interface PayloadFile {
  path: string;
  content: string;
  target: string;
}

export interface Payload {
  name: string;
  type: string;
  title: string;
  description: string;
  registryDependencies: string[];
  dependencies: string[];
  files: PayloadFile[];
}

const fetchFn: ((url: string) => Promise<any>) | undefined = (globalThis as any).fetch;

/**
 * Resolve the registry base: explicit `--registry` override → the `@tolle_/tolle-ui`
 * package installed in the target project → the configured hosted URL.
 */
export function resolveSource(configUrl: string, override?: string): string {
  if (override) return override;
  try {
    const req = createRequire(path.join(process.cwd(), 'noop.js'));
    const manifest = req.resolve('@tolle_/tolle-ui/registry/manifest.json');
    return path.dirname(manifest);
  } catch {
    /* package not installed locally — fall back to the hosted registry */
  }
  return configUrl;
}

export async function loadPayload(name: string, source: string): Promise<Payload> {
  if (/^https?:/i.test(source)) {
    if (!fetchFn) throw new Error('global fetch unavailable — use Node 18+ or a local registry');
    const res = await fetchFn(`${source.replace(/\/$/, '')}/r/${name}.json`);
    if (!res.ok) throw new Error(`"${name}" not found in registry (${res.status})`);
    return res.json();
  }
  const p = path.join(source, 'r', `${name}.json`);
  if (!fs.existsSync(p)) throw new Error(`"${name}" not found at ${p}`);
  return JSON.parse(fs.readFileSync(p, 'utf8')) as Payload;
}
