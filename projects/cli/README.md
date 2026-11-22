# tolle — the Tolle UI CLI

Add Tolle UI components to your Angular app as **source you own** (shadcn-style),
instead of importing a compiled package. Components are copied from the registry
into your project so you can read, edit, and version them.

```bash
# in your Angular project
npx @tolle_/cli init
npx @tolle_/cli add button
npx @tolle_/cli add select data-table
```

## Commands

### `tolle init`
Creates `components.json`, imports `@tolle_/tolle-ui/theme.css` into your global
stylesheet, checks your Tailwind preset, and installs the base deps
(`clsx`, `tailwind-merge`, `class-variance-authority`, `@angular/cdk`).

It also writes **agent instructions**, so coding agents read the
version-matched component docs instead of guessing: a fenced section in
`AGENTS.md` (created if missing) and `CLAUDE.md` (only if it exists), plus a
Claude Code skill at `.claude/skills/tolle-ui/SKILL.md`. Re-running replaces
the section rather than duplicating it.

Flags: `--ui <dir>` (default `src/app/components/ui`), `--registry <url>`,
`--force`, `--skip-install`, `--no-agents` (skip the agent files), `--mcp`
(also register the `@tolle_/mcp` server in `.mcp.json`).

### `tolle docs [component]`
Prints a component's agent page — import line, compiled example, API, form
binding, services, pitfalls — or the `llms.txt` index with no name. Reads the
installed `@tolle_/tolle-ui` first, so it matches the project's version; works
without `init`.

```bash
npx @tolle_/cli docs select
npx @tolle_/cli docs            # index of every component
```

### `tolle agents [--mcp]`
Re-writes the agent instructions without re-running `init` — e.g. in a project
that was initialised before they existed.

### `tolle add <component> [...]`
Resolves the component **and everything it transitively needs** (sibling
components, services, the `cn` util) from the registry, writes the files under
your configured `ui` dir, and installs any required npm packages
(e.g. `@floating-ui/dom` for `select`).

Flags: `--registry <url|path>`, `--overwrite`, `--skip-install`.

## How it works

Files keep their library-relative paths under the `ui` dir, so their
`./sibling` and `./utils/cn` imports resolve as-is — **no import rewriting**,
which makes the copied source robust and easy to reason about. The registry is
generated from the component source (`projects/registry/`) and resolved in this
order: an explicit `--registry`, the installed `@tolle_/tolle-ui` package
(`@tolle_/tolle-ui/registry/*`), then the hosted URL in `components.json`.

## Build

```bash
npm run build   # tsc -> dist/index.js (the `tolle` bin)
```
