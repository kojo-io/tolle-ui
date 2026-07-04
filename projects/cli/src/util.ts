import * as fs from 'fs';
import * as path from 'path';

export const CONFIG_FILE = 'components.json';

export interface TolleConfig {
  /** Reserved for future style variants. */
  style: string;
  /** Directory (relative to the project root) copied components are written to. */
  ui: string;
  tailwind: { config: string; css: string };
  /** Hosted registry base URL, used when the package isn't installed locally. */
  registry: string;
  aliases: { ui: string };
}

export function configPath(cwd = process.cwd()): string {
  return path.join(cwd, CONFIG_FILE);
}

export function readConfig(cwd = process.cwd()): TolleConfig {
  const p = configPath(cwd);
  if (!fs.existsSync(p)) throw new Error(`No ${CONFIG_FILE} found. Run "tolle init" first.`);
  return JSON.parse(fs.readFileSync(p, 'utf8')) as TolleConfig;
}

export function writeJson(p: string, value: unknown): void {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n');
}

export const log = {
  info: (m = '') => console.log(m),
  ok: (m: string) => console.log(`✔ ${m}`),
  warn: (m: string) => console.warn(`⚠ ${m}`),
  step: (m: string) => console.log(`  ${m}`),
};
