#!/usr/bin/env node
import { runInit } from './init';
import { runAdd } from './add';
import { log, INVOKE } from './util';

function parseFlags(args: string[]): { flags: Record<string, string | boolean>; positionals: string[] } {
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positionals.push(a);
    }
  }
  return { flags, positionals };
}

function printHelp(): void {
  log.info(`tolle — add Tolle UI components to your Angular app (copy the source you own)

Usage:
  ${INVOKE} init [--ui <dir>] [--registry <url>] [--force] [--skip-install]
  ${INVOKE} add <component> [...more] [--registry <url|path>] [--overwrite] [--skip-install]

Examples:
  ${INVOKE} init
  ${INVOKE} add button
  ${INVOKE} add select data-table
`);
}

async function main(): Promise<void> {
  const [, , cmd, ...rest] = process.argv;
  const { flags, positionals } = parseFlags(rest);

  switch (cmd) {
    case 'init':
      await runInit(flags);
      break;
    case 'add':
      await runAdd(positionals, flags);
      break;
    case undefined:
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;
    default:
      log.warn(`Unknown command: ${cmd}`);
      printHelp();
      process.exit(1);
  }
}

main().catch((e: any) => {
  console.error(`✖ ${e.message}`);
  process.exit(1);
});
