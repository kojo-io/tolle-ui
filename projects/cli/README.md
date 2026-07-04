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

Flags: `--ui <dir>` (default `src/app/components/ui`), `--registry <url>`,
`--force`, `--skip-install`.

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
