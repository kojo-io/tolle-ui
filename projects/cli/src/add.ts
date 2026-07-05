import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { readConfig, log, INVOKE } from './util';
import { resolveSource, loadPayload, Payload } from './registry';

/**
 * `tolle add <component> [...]` — copy component source (and everything it
 * transitively needs) into the project. Files keep their lib-relative paths
 * under the configured `ui` dir, so their `./sibling` / `./utils/cn` imports
 * resolve as-is — no import rewriting required.
 */
export async function runAdd(names: string[], flags: Record<string, string | boolean>): Promise<void> {
  if (!names.length) throw new Error(`Usage: ${INVOKE} add <component> [...more]`);
  const cwd = process.cwd();
  const config = readConfig(cwd);
  const source = resolveSource(config.registry, flags.registry as string);
  log.info(`Registry: ${source}`);

  const seen = new Set<string>();
  const files = new Map<string, string>();
  const npm = new Set<string>();
  const resolved: string[] = [];

  const resolve = async (name: string): Promise<void> => {
    if (seen.has(name)) return;
    seen.add(name);
    let payload: Payload;
    try {
      payload = await loadPayload(name, source);
    } catch (e: any) {
      throw new Error(`Cannot resolve "${name}": ${e.message}`);
    }
    resolved.push(name);
    for (const f of payload.files) if (!files.has(f.path)) files.set(f.path, f.content);
    for (const d of payload.dependencies) npm.add(d);
    for (const dep of payload.registryDependencies) await resolve(dep);
  };

  for (const n of names) await resolve(n);

  const uiDir = path.resolve(cwd, config.ui);
  let written = 0;
  let skipped = 0;
  for (const [rel, content] of files) {
    const dest = path.join(uiDir, rel);
    if (fs.existsSync(dest) && !flags.overwrite) {
      skipped++;
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
    written++;
  }

  log.ok(`Added ${resolved.join(', ')}`);
  log.step(
    `${written} file(s) → ${config.ui}` +
      (skipped ? `, ${skipped} existing skipped (use --overwrite)` : '')
  );

  if (npm.size) {
    const pkgs = [...npm].sort();
    if (flags['skip-install']) {
      log.warn(`Install peer deps: npm i ${pkgs.join(' ')}`);
    } else {
      log.step(`Installing: ${pkgs.join(', ')}`);
      try {
        execSync(`npm install ${pkgs.join(' ')}`, { stdio: 'inherit', cwd });
      } catch {
        log.warn(`Install failed — run: npm i ${pkgs.join(' ')}`);
      }
    }
  }
}
