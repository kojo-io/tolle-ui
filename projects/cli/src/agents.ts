import * as fs from 'fs';
import * as path from 'path';
import { log, INVOKE } from './util';

const START = '<!-- tolle-ui:start -->';
const END = '<!-- tolle-ui:end -->';
const PKG = '@tolle_/tolle-ui';
const DOCS = `node_modules/${PKG}/registry`;

export interface AgentFileOptions {
  /** Angular major, for the version note. */
  ngMajor: number | null;
  /** Where `tolle add` copies components (from components.json). */
  ui: string;
  /** Also register the MCP server in `.mcp.json`. */
  mcp?: boolean;
}

/**
 * Tell coding agents how to use Tolle UI in THIS project. Without this an agent
 * has no reason to look in node_modules and writes Tolle templates from memory,
 * which is how it ends up inventing `[options]` on a select or `[checked]` on a
 * checkbox.
 *
 *   AGENTS.md                         read by Codex, Cursor, Copilot, Gemini CLI, Zed, …
 *   CLAUDE.md                         updated only if it already exists
 *   .claude/skills/tolle-ui/SKILL.md  Claude Code loads it when Tolle work comes up
 *   .mcp.json                         with --mcp: registers @tolle_/mcp
 *
 * The section is fenced with markers, so re-running replaces it instead of
 * appending a second copy, and anything else in those files is left alone.
 */
export function writeAgentFiles(cwd: string, opts: AgentFileOptions): void {
  const section = agentSection(opts);
  upsertSection(path.join(cwd, 'AGENTS.md'), section, true);
  upsertSection(path.join(cwd, 'CLAUDE.md'), section, false);
  writeSkill(cwd, opts);
  if (opts.mcp) writeMcpConfig(cwd);
}

export function agentSection(opts: AgentFileOptions): string {
  const ng = opts.ngMajor ? ` (Angular ${opts.ngMajor})` : '';
  return `${START}
## Tolle UI

This project uses Tolle UI — \`${PKG}\`${ng}. Do not write \`tolle-*\` templates from memory. Before you add or change one:

1. Read \`${DOCS}/llms.txt\` once per task: the rules every component follows and an index of all components.
2. Read the component's page, \`${DOCS}/docs/<name>.md\` (or run \`${INVOKE} docs <name>\`). It has the import line, a compiled example, the full API, how to bind it in forms, and known pitfalls.

These files ship with the installed package, so they match the version in this project.

Rules that catch most mistakes:

- Import every class the template uses from \`${PKG}\` into the standalone component's \`imports\` — parts too (\`<tolle-select-item>\` needs \`SelectItemComponent\`).
- Form controls (select, checkbox, switch, input, date-picker, …) bind with \`[(ngModel)]\` or \`formControlName\`. They have no \`[value]\` / \`[checked]\` input for their value.
- Form controls take \`label\`, \`hint\` and \`errorMessage\` inputs — use them instead of your own label markup. The error flag is \`[error]\`, or \`[invalid]\` on combobox, native select and the date/time pickers.
- \`variant\` / \`size\` take only the values listed on the component's page. Anything the page calls a "styling state" is not an input.
- Toasts, modals, sheets and confirm dialogs open from services: \`ToastService\` (plus one \`<tolle-toaster>\` in the app shell), \`ModalService\`, \`SheetService\`, \`AlertDialogService\`.
- Components copied with \`${INVOKE} add\` live in \`${opts.ui}\`. If one is there, import it from that folder instead of \`${PKG}\`; the API is the same.
${END}`;
}

function upsertSection(file: string, section: string, create: boolean): void {
  const name = path.basename(file);
  if (!fs.existsSync(file)) {
    if (!create) return;
    fs.writeFileSync(file, `# Agent instructions\n\n${section}\n`);
    log.ok(`Created ${name} with Tolle UI agent instructions`);
    return;
  }
  const src = fs.readFileSync(file, 'utf8');
  const start = src.indexOf(START);
  const end = src.indexOf(END);
  if (start >= 0 && end > start) {
    const next = src.slice(0, start) + section + src.slice(end + END.length);
    if (next !== src) {
      fs.writeFileSync(file, next);
      log.ok(`Updated the Tolle UI section in ${name}`);
    } else {
      log.step(`${name} already up to date`);
    }
    return;
  }
  fs.writeFileSync(file, `${src.replace(/\s*$/, '')}\n\n${section}\n`);
  log.ok(`Added Tolle UI agent instructions to ${name}`);
}

function writeSkill(cwd: string, opts: AgentFileOptions): void {
  const dir = path.join(cwd, '.claude', 'skills', 'tolle-ui');
  const file = path.join(dir, 'SKILL.md');
  const body = `---
name: tolle-ui
description: Use whenever you add, change or debug Angular templates that use Tolle UI (tolle-* elements, @tolle_/tolle-ui imports) — forms, dialogs, toasts, tables, menus. Reads the version-matched component docs shipped in node_modules before writing code.
---

# Tolle UI

${agentSection(opts).replace(START, '').replace(END, '').replace(/^\s*## Tolle UI\s*/m, '').trim()}

## Workflow

1. Find the component in \`${DOCS}/llms.txt\` (grouped by category; "form control" and "service" tags tell you how it is driven).
2. Read \`${DOCS}/docs/<name>.md\`. Copy the structure of its example, not just the tag name.
3. Add every class you used to \`imports\`, and \`FormsModule\` / \`ReactiveFormsModule\` for form controls.
4. Build (\`ng build\`) — unknown inputs and wrong variant values are compile errors with Angular's strict templates.
`;
  fs.mkdirSync(dir, { recursive: true });
  const existed = fs.existsSync(file);
  if (existed && fs.readFileSync(file, 'utf8') === body) {
    log.step('.claude/skills/tolle-ui/SKILL.md already up to date');
    return;
  }
  fs.writeFileSync(file, body);
  log.ok(`${existed ? 'Updated' : 'Created'} .claude/skills/tolle-ui/SKILL.md`);
}

function writeMcpConfig(cwd: string): void {
  const file = path.join(cwd, '.mcp.json');
  let config: { mcpServers?: Record<string, unknown> } = {};
  if (fs.existsSync(file)) {
    try {
      config = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      log.warn('.mcp.json is not valid JSON — left unchanged. Add: "tolle-ui": { "command": "npx", "args": ["-y", "@tolle_/mcp"] }');
      return;
    }
  }
  config.mcpServers = { ...(config.mcpServers ?? {}), 'tolle-ui': { command: 'npx', args: ['-y', '@tolle_/mcp'] } };
  fs.writeFileSync(file, JSON.stringify(config, null, 2) + '\n');
  log.ok('Registered the tolle-ui MCP server in .mcp.json');
}
