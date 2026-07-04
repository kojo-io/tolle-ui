# @tolle registry generator

The metadata pipeline "spine" for Tolle UI. One ts-morph walker reads the
component source under `projects/tolle/src/lib/**` (the single source of truth —
see `projects/tolle/CONTRIBUTING.md`) and emits every downstream artifact, so
docs, the CLI, `llms.txt`, and the MCP server never drift from the code.

## Run

```bash
npm run generate:registry
```

Also runs automatically inside `npm run build:lib` and `npm run build:docs`.
Output goes to `projects/tolle/registry/` (git-ignored, regenerated on build) and
is shipped in the npm package via `ng-package.json` assets, resolvable at
`@tolle_/tolle-ui/registry/*`.

## Pipeline

```
lib/**/*.ts ──▶ extract.ts ──▶ model (RegistryItem[]) ──▶ emit.ts ──▶ artifacts
                    │                    │
              (AST only, no        dep-graph.ts
               type checker)     (transitive closure)
```

- **`extract.ts`** — per file: real `tolle-*` selector, inputs (property + setter
  style, `@default`/JSDoc, `@Input({required})`), outputs, named `<ng-content>`
  slots, and `cva` variants. Variant unions are resolved from the AST by mapping
  `XProps['variant']` back to the cva keys — deterministic, no noisy checker types.
- **`dep-graph.ts`** — builds a graph over every lib file (keyed by module
  basename) and resolves each item's transitive closure of sibling components,
  services, `cn`, and npm packages. Unresolved refs are surfaced, never dropped.
- **`emit.ts`** — writes the artifacts below.

## Artifacts (`projects/tolle/registry/`)

| File | Purpose |
| --- | --- |
| `registry.json` | shadcn-style index (metadata only) |
| `r/<name>.json` | self-describing CLI payloads — file contents + resolved deps |
| `docs-content.json` | docs-app API tables (replaces the old `extract-docs.ts` output) |
| `llms.txt` | llmstxt.org index |
| `llms-full.txt` | full per-component reference for agents |
| `manifest.json` | MCP superset (everything, keyed for tools) |

## Adding metadata a component can't express in code

Author a `<name>.registry.ts` sidecar next to the component (title, description,
category, curated examples, a11y notes). See `projects/tolle/CONTRIBUTING.md`.
