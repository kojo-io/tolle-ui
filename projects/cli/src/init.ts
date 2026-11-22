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

/**
 * Angular majors that publish their own registry alongside the current line.
 * The apex `/registry` always serves the newest supported major, so older
 * still-maintained lines get a versioned path. Only majors listed here are
 * actually deployed — anything else falls through to the default rather than
 * pointing at a URL that would 404.
 */
const VERSIONED_REGISTRIES: Record<number, string> = {
  18: 'https://tolle-ui.com/v18/registry',
};

/** The hosted registry matching this project's Angular major. */
function registryFor(ngMajor: number | null): string {
  return (ngMajor !== null && VERSIONED_REGISTRIES[ngMajor]) || DEFAULT.registry;
}

/** `tolle init` — scaffold components.json, wire theming, install base deps. */
export async function runInit(flags: Record<string, string | boolean>): Promise<void> {
  const cwd = process.cwd();
  const p = configPath(cwd);
  if (fs.existsSync(p) && !flags.force) {
    throw new Error(`${p} already exists. Use --force to overwrite.`);
  }

  // Detected once: it decides both the registry written to components.json and
  // the versions installed below.
  const ngMajor = detectAngularMajor(cwd);
  if (ngMajor) log.step(`Detected Angular ${ngMajor}`);

  const config: TolleConfig = {
    ...DEFAULT,
    ui: (flags.ui as string) || DEFAULT.ui,
    registry: (flags.registry as string) || registryFor(ngMajor),
  };
  writeJson(p, config);
  log.ok('Created components.json');

  ensureTailwindPreset(cwd, config);
  ensureThemeCss(cwd, config);

  if (!flags['skip-install']) {
    // Pin BOTH @tolle_/tolle-ui and @angular/cdk to the project's Angular major.
    // The library version tracks the Angular major it was built against, and
    // `latest` points at the newest line — so a bare `@tolle_/tolle-ui` installs
    // e.g. 21.x into an Angular 18 app, whose peer range rejects it. Angular's
    // partial-Ivy output is not backward compatible, so that combination does
    // not merely warn, it fails to build.
    const lib = ngMajor ? `@tolle_/tolle-ui@^${ngMajor}` : '@tolle_/tolle-ui';
    const cdk = ngMajor ? `@angular/cdk@^${ngMajor}` : '@angular/cdk';
    const base = [lib, 'clsx', 'tailwind-merge', 'class-variance-authority', cdk];
    log.step(`Installing base deps: ${base.join(', ')}`);
    try {
      execSync(`npm install ${base.join(' ')}`, { stdio: 'inherit', cwd });
    } catch {
      if (ngMajor) {
        // Everything was pinned to the detected major, so a conflict here is a
        // real problem. Retrying with --legacy-peer-deps would force a
        // mismatched install and silently poison `tolle add`, which resolves
        // the registry out of node_modules.
        log.warn(`Install failed — resolve the conflict, then: npm i ${base.join(' ')}`);
      } else {
        // Angular major unknown, so nothing could be pinned. Here a tolerant
        // retry is reasonable: there is no known-good version to protect.
        try {
          log.warn('Install hit a peer conflict — retrying with --legacy-peer-deps');
          execSync(`npm install ${base.join(' ')} --legacy-peer-deps`, { stdio: 'inherit', cwd });
        } catch {
          log.warn(`Install manually: npm i ${base.join(' ')}`);
        }
      }
    }
  }

  log.info(`\nDone. Next: ${INVOKE} add button`);
}

/**
 * Best-effort read of the project's Angular major (e.g. 18) so `@tolle_/tolle-ui`,
 * `@angular/cdk` and the hosted registry are all selected to match. Prefers the
 * installed @angular/core, then the version declared in the project's package.json.
 * Returns null when neither is readable, in which case nothing is pinned.
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
