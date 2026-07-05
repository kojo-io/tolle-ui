import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { configPath, writeJson, log, TolleConfig, INVOKE } from './util';

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
    // Pin @angular/cdk to the project's Angular major — a bare `@angular/cdk`
    // installs the latest (e.g. 22), whose peer range rejects an Angular 18 app.
    const ngMajor = detectAngularMajor(cwd);
    const cdk = ngMajor ? `@angular/cdk@^${ngMajor}` : '@angular/cdk';
    const base = ['@tolle_/tolle-ui', 'clsx', 'tailwind-merge', 'class-variance-authority', cdk];
    log.step(`Installing base deps: ${base.join(', ')}`);
    try {
      execSync(`npm install ${base.join(' ')}`, { stdio: 'inherit', cwd });
    } catch {
      // A remaining peer-dep conflict shouldn't hard-fail init — retry tolerantly.
      try {
        log.warn('Install hit a peer conflict — retrying with --legacy-peer-deps');
        execSync(`npm install ${base.join(' ')} --legacy-peer-deps`, { stdio: 'inherit', cwd });
      } catch {
        log.warn(`Install manually: npm i ${base.join(' ')}`);
      }
    }
  }

  log.info(`\nDone. Next: ${INVOKE} add button`);
}

/**
 * Best-effort read of the project's Angular major (e.g. 18) so peer deps like
 * @angular/cdk are installed at a compatible version. Prefers the installed
 * @angular/core, then the version declared in the project's package.json.
 */
function detectAngularMajor(cwd: string): number | null {
  const fromVersion = (v: unknown): number | null => {
    const m = String(v ?? '').match(/(\d+)/);
    return m ? Number(m[1]) : null;
  };
  try {
    const core = JSON.parse(fs.readFileSync(path.join(cwd, 'node_modules/@angular/core/package.json'), 'utf8'));
    const major = fromVersion(core.version);
    if (major) return major;
  } catch {
    /* not installed yet — fall through to the declared range */
  }
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    return fromVersion(pkg.dependencies?.['@angular/core'] ?? pkg.devDependencies?.['@angular/core']);
  } catch {
    return null;
  }
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
