# @tolle registry generator

The metadata pipeline "spine" for Tolle UI. One ts-morph walker reads the
component source under `projects/tolle/src/lib/**` (the single source of truth —
see `projects/tolle/CONTRIBUTING.md`) and emits every downstream artifact, so
the docs site, the CLI, the agent docs (`docs/*.md`, `llms.txt`) and the MCP
server (`projects/mcp`) never drift from the code.

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
lib/**/*.ts ──▶ extract.ts ──▶ model (RegistryItem[]) ──▶ enrich.ts ──▶ agent pages ──▶ emit.ts ──▶ artifacts
                    │                    │                    │
              (AST only, no        dep-graph.ts         sources.ts   ← *.registry.ts sidecars,
               type checker)     (transitive closure)    services.ts    docs-app examples,
                                                                        root services + types
```

- **`extract.ts`** — per file: real `tolle-*` selector, inputs (property + setter
  style, `@default`/JSDoc, `@Input({required})`, the binding **alias** of
  `@Input('tolleTooltip')`, `@internal`), outputs, named `<ng-content>` slots,
  `cva` variants, `exportAs`, and whether the class is a **form control**
  (`writeValue`, with its value type). Variant unions are resolved from the AST
  by mapping `XProps['variant']` back to the cva keys.
- **`dep-graph.ts`** — builds a graph over every lib file (keyed by module
  basename) and resolves each item's transitive closure of sibling components,
  services, `cn`, and npm packages. Unresolved refs are surfaced, never dropped.
- **`sources.ts`** — loads `<name>.registry.ts` sidecars and the docs-app
  examples (`projects/docs/src/app/docs-examples/<name>/`), rewritten to consumer
  form (one `@tolle_/tolle-ui` import, `templateUrl` inlined, helper components
  appended). An example importing something the package doesn't export is a
  reported problem.
- **`services.ts`** — public root services (`@Injectable({ providedIn: 'root' })`,
  not `@internal`) with their member signatures, and an index of exported types
  so each page can print the types its API mentions (`Toast`, `Modal`, `ModalRef`).
- **`enrich.ts` / `agent.ts`** — merge all of the above and regroup items into
  **pages**: a component plus its parts (select + select-item + select-group…),
  by sidecar `parts` or the `-item` / `-trigger` / `-content` naming rule. Each
  page separates real variants from cva states the component sets itself.
- **`emit.ts`** — writes the artifacts below.
- **`check.ts`** — the coverage ratchet CI runs (`npm run check:agent-docs`).

## Artifacts (`projects/tolle/registry/`)

| File | Purpose |
| --- | --- |
| `registry.json` | shadcn-style index (metadata only) |
| `r/<name>.json` | self-describing CLI payloads — file contents + resolved deps |
| `docs-content.json` | docs-app API tables |
| `docs/<page>.md` | **agent page per component**: imports, compiled examples, API, forms, services, types, pitfalls (~1–13 KB each). Parts get a stub pointing at their page |
| `llms.txt` | llmstxt.org index: how to use the docs, global rules, components by category |
| `llms-full.txt` | every page in one file, one short example each |
| `manifest.json` | MCP superset: `components` (one per item) and `pages` (agent grouping, examples, services) |
| `site/llms*.txt` | copies for the site root, with `/registry/`-prefixed links (not shipped in npm) |
| `flutter-parity.json` | Flutter port contract (not shipped in npm) |

Everything except `site/` and `flutter-parity.json` ships in the npm package at
`@tolle_/tolle-ui/registry/*`, so an agent in a consumer project reads docs that
match the installed version (`tolle init` / `tolle agents` tell it where).

## Adding metadata a component can't express in code

- **JSDoc** on every `@Input()` / `@Output()` — that is the description column.
  Tag parent-managed inputs `@internal` to keep them out of agent docs.
- **An example** under `projects/docs/src/app/docs-examples/<name>/` — it is
  type-checked by `npm run check:examples` and becomes the page's example.
- **A sidecar** `<name>.registry.ts` next to the component for description,
  when-to-use, alternatives, pitfalls, parts and form-value notes. See
  `projects/tolle/CONTRIBUTING.md`.

## Checks

```bash
npm run check:agent-docs              # coverage ratchet + example problems (CI)
npm run check:agent-docs -- --list    # every gap
npm run check:agent-docs -- --update  # lower the baseline after filling gaps
npm run check:examples                # strict-template type-check of every example (CI)
```
