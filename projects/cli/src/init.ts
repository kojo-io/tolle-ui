import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { configPath, writeJson, log, TolleConfig } from './util';

const DEFAULT: TolleConfig = {
  style: 'default',
  ui: 'src/app/components/ui',
  tailwind: { config: 'tailwind.config.js', css: 'src/styles.css' },
  registry: 'https://tolle-ui.com/registry',
  aliases: { ui: '@/components/ui' },
};

/** `tolle init` — scaffold components.json, wire theming, install base deps. */
export async function runInit(flags: Record<string, string | boolean>): Promise<void> {
  const cwd = process.cwd();
  const p = configPath(cwd);
  if (fs.existsSync(p) && !flags.force) {
    throw new Error(`${p} already exists. Use --force to overwrite.`);
  }

  const config: TolleConfig = {
    ...DEFAULT,
    ui: (flags.ui as string) || DEFAULT.ui,
    registry: (flags.registry as string) || DEFAULT.registry,
  };
  writeJson(p, config);
  log.ok('Created components.json');

  ensureTailwindPreset(cwd, config);
  ensureThemeCss(cwd, config);

  if (!flags['skip-install']) {
    const base = ['@tolle_/tolle-ui', 'clsx', 'tailwind-merge', 'class-variance-authority', '@angular/cdk'];
    log.step(`Installing base deps: ${base.join(', ')}`);
    try {
      execSync(`npm install ${base.join(' ')}`, { stdio: 'inherit', cwd });
    } catch {
      log.warn(`Install manually: npm i ${base.join(' ')}`);
    }
  }

  log.info('\nDone. Next: tolle add button');
}

function ensureTailwindPreset(cwd: string, config: TolleConfig): void {
  const p = path.join(cwd, config.tailwind.config);
  if (!fs.existsSync(p)) {
    log.warn(`${config.tailwind.config} not found — add presets: [require('@tolle_/tolle-ui/preset')].`);
    return;
  }
  const src = fs.readFileSync(p, 'utf8');
  if (src.includes('@tolle_/tolle-ui/preset')) {
    log.step('Tailwind preset already configured');
    return;
  }
  log.warn(
    `Add to ${config.tailwind.config}: presets: [require('@tolle_/tolle-ui/preset')], and include ` +
      `'./node_modules/@tolle_/tolle-ui/**/*.mjs' in content globs.`
  );
}

function ensureThemeCss(cwd: string, config: TolleConfig): void {
  const p = path.join(cwd, config.tailwind.css);
  if (!fs.existsSync(p)) {
    log.warn(`${config.tailwind.css} not found — import '@tolle_/tolle-ui/theme.css' in your global styles.`);
    return;
  }
  const src = fs.readFileSync(p, 'utf8');
  if (src.includes('tolle-ui/theme.css')) {
    log.step('theme.css already imported');
    return;
  }
  fs.writeFileSync(p, `@import '@tolle_/tolle-ui/theme.css';\n${src}`);
  log.ok(`Imported theme.css into ${config.tailwind.css}`);
}
