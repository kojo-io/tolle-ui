# Angular 21 Support — Migration Plan

**Status:** Phases 0–3 done on `feat/angular-21`. Library and docs build clean,
1103/1103 specs pass, registry generates. Not merged, not published.
**Target release:** `@tolle_/tolle-ui@21.2.0`
**Working branch:** `feat/angular-21` (off `master`)

> Execution turned up four things the plan did not anticipate. They are recorded
> in [§9 Findings](#9-findings-from-execution) rather than silently folded in.

---

## 1. Decisions

Four decisions frame everything below. They are recorded here so the plan can be
read without re-litigating them.

| Decision | Choice | Consequence |
| --- | --- | --- |
| Support model | **Dual-track 18 + 21** | `master` → Angular 21, published as npm `latest`. `release-18` stays alive publishing 18.x under the `v18` dist-tag. |
| Scope | **Compile-green upgrade first** | Bump + official schematics + fix breaks. Karma, zone.js and `@angular/animations` stay as-is; modernization is follow-up work. |
| Hosted registry | **Path-prefix the 18 registry** | `master` deploys the 21 registry to `/registry`; `release-18` deploys to `/v18/registry`. |
| This plan | **Lives in the repo** | Iterated on the branch, reviewable in the PR, doubles as the 21.2.0 changelog narrative. |

### Why not a single build for both majors

ng-packagr emits partial-Ivy declarations that the Angular linker reads at
consumer build time. Those declarations are **not backward compatible** — a
library compiled by Angular 21 cannot be linked by an Angular 18 app. Widening
`peerDependencies` to `^18 || ^21` would produce a package that installs cleanly
and then fails at build time. Two branches is the only honest option.

---

## 2. Version targets

Every version below was resolved against the live npm registry, not from memory.

| Package | Current (`master`) | Target |
| --- | --- | --- |
| `@angular/{core,common,compiler,forms,router,platform-browser,animations}` | `18.2.14` | **`21.2.19`** |
| `@angular/cdk` | `18.2.14` | **`21.2.14`** |
| `@angular/cli`, `@angular/build` | `18.2.21` (`@angular-devkit/build-angular`) | **`21.2.19`** |
| `@angular/compiler-cli` | `18.2.14` | **`21.2.19`** |
| `ng-packagr` | `18.2.1` | **`21.2.6`** |
| `typescript` | `~5.5.2` | **`~5.9.x`** |
| `zone.js` | `~0.14.10` | **`~0.15.x`** |
| Node (CI) | `20` (unpinned minor) | **`22` or `24`** |

Constraint sources:

- `@angular/compiler-cli@21` peer: `typescript >=5.9 <6.1`
- `ng-packagr@21` peer: `typescript >=5.9 <6.0` — the **binding** constraint, so pin `~5.9`
- `@angular/core@21` peer: `zone.js ~0.15.0 || ~0.16.0`
- `@angular/core@21` engines: `node ^20.19.0 || ^22.12.0 || >=24.0.0` — CI's bare
  `node-version: 20` resolves to a 20.x that satisfies this today, but it is
  unpinned and one minor away from breaking. Bump it.

### Release numbering

`21.1.1` and `21.1.2` were **already published** to npm during the abandoned
2026-01 attempt. The new line must start above them.

- Publish **`21.2.0`** as `latest` (above `21.1.2`, and aligned with the Angular 21.2.x target).
- Re-tag the frozen 18 line: `npm dist-tag add @tolle_/tolle-ui@18.3.3 v18`.

---

## 3. Prior art in this repository

This walk was completed once before and then reverted. The commits are still in
history and are the best available predictor of what breaks:

| Commit | Step | What it actually touched |
| --- | --- | --- |
| `e90125c` | migrate to angular 19 | Mass removal of redundant `standalone: true`, plus docs component churn |
| `0524820` | migrate to angular 20 | `angular.json` builders → `@angular/build:*`, `DOCUMENT` import move in `theme.service.ts`, schematics defaults block |
| `1dd24aa` | migrate to angular 21 | `package.json` versions + drop `lib` from `tsconfig.json`. Nothing else. |

`master` was then taken back to Angular 18 by the `angular-version-18` merge
(`280bed8`), and the `migration-to-21` branch is now a strict ancestor of
`master` — it holds **zero** commits master doesn't have.

**The gap that matters:** ~93 commits have landed since that attempt — the
shadcn-style registry generator, `@tolle_/cli`, five new chart families,
source-derived docs examples. None of it has ever been compiled against Angular
21. That is where the unknown breakage lives; the framework bump itself is
largely solved.

---

## Phase 0 — Branch and release topology

Do this before touching a single dependency.

1. **Cut the 18 line from current `master` HEAD.** The existing `origin/release-18`
   branch is **stale and must not be used as the 18 line** — see the audit below.

   ```
   git checkout master && git pull
   git branch -f release-18 master
   git push --force-with-lease origin release-18
   ```

   <details>
   <summary>Audit: why <code>release-18</code> is discarded, not merged</summary>

   `git diff master origin/release-18` → **956 insertions, 47,542 deletions** across
   601 files. The branch is a much older snapshot:

   | | `master` | `origin/release-18` |
   | --- | --- | --- |
   | Library components (`*.component.ts`) | **113** | 69 |

   It carries 4 commits `master` lacks. All are superseded:

   | Commit | Claim | Reality |
   | --- | --- | --- |
   | `96c217f` | deletes `.github/workflows/main.yml` | `master` already has no `main.yml` — no-op |
   | `bbf3c4c` | adds `ai-native-docs` | `master` has it, further evolved |
   | `f3fff5a` | "Update range-calendar.component.ts" | **`master` is the superset** — see below |
   | `9e93aab` | merge commit | no content |

   The `range-calendar` case is the one that looked like unique work and isn't.
   `release-18` exposes the month/year quick pickers only in the single-month
   view. `master` added `pickerMonthIndex`, the `pickerDate` getter,
   `headerBtnClass()` and `setView(view, monthIndex)` so the pickers work
   per-panel in the multi-month view as well. Adopting `release-18`'s copy would
   be a **regression**, not a backport.

   Nothing on the branch needs preserving. Force-updating it to `master` is safe.
   </details>

   This also removes the backport-conflict risk: the 18 and 21 lines start from an
   identical tree, so the only deltas are the Angular bump itself.

2. **Retarget CI.** `.github/workflows/deploy-release-18.yml` currently triggers on
   both `release-18` **and** `master`. Strip `master` from that trigger, or the
   first push after the upgrade will deploy the Angular 18 site over the 21 one.

3. **Set the npm dist-tag** for the frozen line:
   ```
   npm dist-tag add @tolle_/tolle-ui@18.3.3 v18
   ```

4. **Create the working branch:** `git checkout -b feat/angular-21` off `master`.

---

## Phase 1 — Sequential `ng update` (18 → 19 → 20 → 21)

Angular supports one major step at a time. Commit after each so a failure is
bisectable to a single hop.

### → 19

```
npx ng update @angular/core@19 @angular/cli@19 @angular/cdk@19
```

- Standalone becomes the default. The schematic strips redundant
  `standalone: true` from **647 files**. Enormous diff, near-zero risk —
  verify by building, not by reading.
- There is no `@NgModule` anywhere in this repo, so the `standalone: false`
  back-fill for NgModule declarables is a no-op here.

### → 20

```
npx ng update @angular/core@20 @angular/cli@20 @angular/cdk@20
```

- `angular.json`: every builder moves `@angular-devkit/build-angular:*` →
  `@angular/build:*` (`application`, `dev-server`, `extract-i18n`, `karma`,
  `ng-packagr`).
- `DOCUMENT` moves from `@angular/common` to `@angular/core`. **Exactly one
  site:** `projects/tolle/src/lib/theme.service.ts:10`.
- Replace `@angular-devkit/build-angular` with `@angular/build` in devDependencies.

### → 21

```
npx ng update @angular/core@21 @angular/cli@21 @angular/cdk@21
```

Migrations that run automatically at this hop:

| Migration | Effect here |
| --- | --- |
| `update-typescript-lib` | Drops/modernizes `lib` in tsconfig (matches `1dd24aa`) |
| `update-module-resolution` | `moduleResolution: bundler` — already set |
| `remove-default-karma-config` | No-op; this repo has no `karma.conf.js` |
| `application-config-core` | `ApplicationConfig` → `@angular/core` — already correct in `app.config.ts:1` |

Then manually: TypeScript → `~5.9.x`, zone.js → `~0.15.x`.

### Dependency hygiene (same phase)

Remove — all verified to have zero references in the workspace:

- `@angular/platform-browser-dynamic` — declared in dependencies, imported
  nowhere, and now deprecated upstream in favour of `@angular/platform-browser`
- `css-loader`, `style-loader` — webpack-era leftovers; `@angular/build` is esbuild/vite
- `@angular-devkit/architect` — unreferenced

---

## Phase 2 — Fix what the schematics don't

### 2.1 Packaging defect: undeclared CDK peer

`@angular/cdk` is imported by **9 non-spec library files** — `modal.component.ts`,
`modal.service.ts`, `modal-ref.ts`, `sheet.component.ts`, `sheet.service.ts`,
`sheet-ref.ts`, `sheet-wrapper.component.ts`, `alert-dialog.component.ts`,
`alert-dialog.service.ts` — but it is **absent from `peerDependencies`** in
`projects/tolle/package.json`.

This is a live defect on the 18 line too, currently masked by `projects/cli/src/init.ts:37`
installing CDK by hand. Fix on 21, and **backport to `release-18`**.

Also widen the framework peers to `^21.0.0`:

```jsonc
"peerDependencies": {
  "@angular/common": "^21.0.0",
  "@angular/core": "^21.0.0",
  "@angular/cdk": "^21.0.0",   // newly declared
  // ...unchanged non-Angular peers
}
```

### 2.2 Full build sweep

```
npm run build:lib
npm run build:docs
npm test
```

Expected fallout, ranked by uncertainty:

1. **Registry generator** (`projects/registry`, ts-node + ts-morph under TS 5.9).
   Highest risk — it post-dates the previous attempt and has never run on this
   toolchain. It also gates both `build:lib` and `build:docs` via `generate:registry`.
2. **`strictTemplates` under Angular 21's tighter template type-checking**,
   across the ~126 files still using `*ngIf` / `*ngFor` / `*ngSwitch`.
3. **The five newest chart families** — never compiled on 21.

### 2.3 Config follow-ups

- **Bundle budget:** `angular.json` caps the docs `initial` bundle at 1MB
  error / 500kB warning. esbuild output differs from the 18 baseline —
  re-baseline rather than blindly raising.
- **CI Node:** `node-version: 20` → `22` (or `24`).

---

## Phase 3 — Registry, CLI, and published surface

### 3.1 Regenerate

`npm run generate:registry`. `manifest.json`'s `version` field rolls
`18.3.3` → `21.2.0` automatically from root `package.json`.

### 3.2 Registry version routing

`projects/cli/src/registry.ts:29` (`resolveSource`) resolves in this order:

1. explicit `--registry` override
2. **`@tolle_/tolle-ui/registry/manifest.json` from the consumer's `node_modules`**
3. the hosted URL (`https://tolle-ui.com/registry`)

Step 2 means any consumer who has the package installed already gets the
correct flavour for their Angular major — the exposure is only the
before-install and `--registry` paths.

**Chosen fix:** add an scp step to the `release-18` workflow deploying its
registry assets to `/var/www/tolle-ui/v18/registry`, and document
`tolle init --registry https://tolle-ui.com/v18/registry` for Angular 18 users.
`master` continues to own `/registry` with the 21 build.

### 3.3 Documentation

| File | Change |
| --- | --- |
| `README.md:14,33,36` | Hardcodes "built for **Angular 18**" and `@angular/core@^18.2.0` in the install snippet. Replace with a support matrix. |
| `projects/docs/.../ai-native-docs.component.ts:51` | Prompt string tells the model "You have access to Tolle UI, an Angular 18 component library." |

Support matrix to publish:

| Angular | Install | npm tag |
| --- | --- | --- |
| 21.x | `npm i @tolle_/tolle-ui` | `latest` |
| 18.x | `npm i @tolle_/tolle-ui@v18` | `v18` |

### 3.4 CI

Add `.github/workflows/deploy-release-21.yml` for `master` (mirrors the 18
workflow, Node 22/24, deploys to `/var/www/tolle-ui`).

---

## Phase 4 — Verify and ship

1. `npm run build:lib` and `npm run build:docs` clean.
2. All **142 spec files** green under `@angular/build:karma`.
3. **End-to-end smoke test** — the step that actually validates "Angular 21 support":
   ```
   ng new probe --standalone && cd probe
   npm i <path-to>/tolle-ui-21.2.0.tgz
   npx @tolle_/cli init
   npx @tolle_/cli add button
   ng build
   ```
   Confirms the linker accepts our partial-Ivy output, the CDK peer resolves,
   and copied registry source compiles on a stock 21 app.
4. Publish `21.2.0` as `latest`.

---

## Deliberately deferred

Not in this release. Recorded so they don't get lost.

- **`@angular/animations` is deprecated upstream.** The npm package now carries a
  deprecation notice pointing at `animate.enter` / `animate.leave`. Used in three
  library files: `accordion-item.component.ts`, `alert.component.ts`,
  `collapsible.component.ts`. It still ships and works on 21.

  **Upgraded from "debt" to "recommend doing next"** after §9.1: the deprecation
  actively breaks `ng update`'s resolver at every major hop and will keep doing so
  on 22 and beyond. Removing it deletes that whole class of problem, and it is
  only three files.
- **Karma → Vitest.** Worth knowing before assuming otherwise: `@angular/build:karma`
  still exists in 21.2.19, and that release's Vitest builder (`@angular/build:unit-test`)
  is still flagged `[EXPERIMENTAL]` in its own `builders.json`. Staying on Karma
  is the *correct* call for this release, not merely the conservative one.
- **Signal inputs** — 124 files using `@Input`, 51 using `@Output`, against exactly
  1 file using the `input()` signal API today.
- **Zoneless.** `provideZoneChangeDetection({ eventCoalescing: true })` in
  `app.config.ts` stays. One library file uses `NgZone` directly
  (`message-scroller.component.ts:137`) and would need auditing first.

---

## 9. Findings from execution

### 9.1 The `@angular/animations` deprecation breaks `ng update`'s resolver

`ng update` refuses to complete the 19→20 and 20→21 hops. `@angular/animations`
at the current patch (e.g. `20.3.27`, `21.2.19`) carries an npm **deprecation
notice**; `ng update` avoids deprecated versions and falls back to the newest
non-deprecated build (`20.1.8`). But `@angular/platform-browser@20.3.27` peers on
`animations@20.3.27` *exactly*, so the resolver dead-ends.

`--force` "resolves" it by installing the mismatched pair. Instead: pin the
Angular versions in `package.json`, reinstall from a clean tree
(`rm -rf node_modules package-lock.json`), and run the schematics separately
with `--migrate-only`.

**This recurs at every hop**, and strengthens the case for actually migrating off
`@angular/animations` (see Deferred).

### 9.2 `ng update` needs `NG_DISABLE_VERSION_CHECK=1` here

Any `ng update` invocation — even `--migrate-only` with an explicit `--from`/`--to`
— version-checks against the *latest* published CLI and downloads a temporary
CLI 22, which requires Node `>=24.15.0`. This machine runs 24.14.1, so it aborts.
`NG_DISABLE_VERSION_CHECK=1` keeps it on the locally installed CLI.

### 9.3 `control-flow-migration` is **not** optional in v21

It has no `"optional": true` flag in `@angular/core@21`'s `migrations.json`, so
`ng update` runs it automatically: **295 files** converted from `*ngIf`/`*ngFor`
to `@if`/`@for`, with `CommonModule` dropped from `imports` where it became
unused. Two classes of fallout, both fixed:

- **15 × TS2554.** `bar-list`, `category-bar`, `chart`, `tracker` declared a
  1-arg helper `trackByIndex = (index: number): number => index`. `*ngFor`'s
  `trackBy` accepted it (fewer params is assignable to `TrackByFunction`), but
  the migration emitted `track trackByIndex($index, item)` — two args. Templates
  now use `track $index`; the 8 dead helpers were removed.
- **3 failing chart specs.** The migration reflowed `@for` bodies so
  `{{ tick.label }}` sat on its own indented line inside `<svg:text>`, making
  `textContent` `' Jan '` instead of `'Jan'`. Interpolations collapsed back
  against the tags.

### 9.4 `ng build docs` completes but never exits

The docs build writes complete, correct output and prints its summary, then hangs.
Diagnosed by bisection:

| Test | Result |
| --- | --- |
| `ng build tolle` (library) | exits normally |
| Stock Angular 21 app (`ng new`) | exits in 6s |
| Docs app, `assets: []` | **hangs** |
| Docs app, no `postcss.config.js` | **hangs** |
| Docs app, stub `main.ts` | exits in 4s |
| Docs app, `bootstrapApplication` with **no** providers | exits in 6s |
| Docs app, full `appConfig` (with `provideRouter`) | **hangs** |
| Node 20.20.2 instead of 24.14.1 | **hangs** |

So it is neither upstream nor builder config: the docs app's **lazy route graph**
(419 lines of routes → ~139 lazy chunks) leaves the `esbuild --service` child
alive, and killing that child alone lets `ng` exit immediately.

Not a correctness problem — the bundle is complete and the tests pass — but it
would stall CI. `deploy-release-21.yml` therefore bounds the build with `timeout`
and asserts on `dist/docs/browser/index.html` rather than on the exit code.

**Worth filing upstream**, with the bisection table above as the repro.

### 9.5 Six undeclared peer dependencies (found by the Phase 4 smoke test)

The plan called out one missing peer (`@angular/cdk`). Building the packed
library inside a stock Angular 21 app found **six**:

| Package | Library files importing it | Was it breaking? |
| --- | --- | --- |
| `rxjs` | 36 | latent |
| `@angular/forms` | 29 | latent |
| `@angular/animations` | 3 | **build failure** |
| `libphonenumber-js` | 2 | **build failure** |
| `@angular/platform-browser` | 1 | latent |
| `@angular/router` | 1 | latent |

The four "latent" ones never bite because every Angular app already has them
installed. The two that broke are the two a stock app lacks — and they fail hard,
because ng-packagr emits a single flat FESM bundle, so esbuild must resolve
*every* import in the library even when the consumer only imports `ButtonComponent`.

This is a **pre-existing defect that also affects the published 18.3.3** on the
npm-package path. (The copy-source CLI path is unaffected: the registry records
`phone-number-input -> libphonenumber-js` per item.) All six are now declared;
npm 7+ auto-installs peers, so consumers get them without action.

Follow-up worth considering: `libphonenumber-js` is only needed by
`phone-number-input`, but the flat bundle forces it on everyone. Splitting
secondary entry points would let it be genuinely optional.

### 9.6 `tolle init` would have installed the wrong major

`init.ts` pinned `@angular/cdk` to the detected Angular major — with a comment
explaining exactly why — but installed `@tolle_/tolle-ui` **bare**, one line
below. Harmless while `latest` was 18.3.3. The moment 21.2.0 takes `latest`:

1. an Angular 18 user runs `npx @tolle_/cli init`
2. npm resolves 21.2.0 → ERESOLVE against the `^21` peers
3. the `catch` retried with `--legacy-peer-deps` → **force-installed 21.2.0 into
   an Angular 18 app**
4. `node_modules` then served 21 registry source to every later `tolle add`

The tolerant fallback was the dangerous part: it converted a loud failure into a
silent wrong install, and defeated the `node_modules` resolution that would
otherwise have kept 18 users on 18 source.

Fixed in `@tolle_/cli@0.1.4`:

- `@tolle_/tolle-ui` is pinned to the detected major, symmetric with `@angular/cdk`
- `components.json` gets the matching registry (`VERSIONED_REGISTRIES`, currently
  just `18 → /v18/registry`; unlisted majors fall back to the default rather than
  pointing at a URL that would 404)
- `--legacy-peer-deps` is retried **only** when the Angular major could not be
  detected — if we pinned and it still failed, that is a real conflict worth surfacing

Verified end-to-end against a synthetic Angular 18 project: installs
`@tolle_/tolle-ui@18.3.3` + `@angular/cdk@18.2.14`, writes the `/v18/registry`
URL, and `tolle add button` copies source still using `*ngIf` — 18-era, not the
`@if` rewrite.

### 9.7 Smaller notes

- `projects/tolle/registry/` is **gitignored** — a build artifact regenerated by
  `generate:registry` and shipped via ng-packagr assets. Nothing to commit there.
- The registry generator (ts-node + ts-morph) ran clean under TypeScript 5.9 on
  the first try: 117 items, 255 classes, 854 inputs, 91 outputs. This was the
  plan's highest-rated risk and it did not materialise.
- The docs `initial` bundle is **828.82 kB** (194 kB transferred) against a
  500 kB warning / 1 MB error budget — it warns, it does not fail. Left alone
  deliberately; raising the budget to silence it is a separate decision.
- 4 × NG8113 unused-import warnings were **pre-existing** (unused on `master`
  too), newly surfaced by the v21 compiler. Removed.

## Risk summary

Scored before execution; outcomes filled in after.

| Risk | Predicted | Outcome |
| --- | --- | --- |
| Registry generator breaks under TS 5.9 | Medium | **Did not occur** — clean on first run |
| `strictTemplates` errors in newer components | Medium | **Did not occur**; the chart families broke instead via the trackBy artifact (§9.3) |
| 647-file standalone sweep hides a real change | Low | Did not occur |
| Bundle budget failure | Low | Warns only (828.82 kB vs 500 kB warning / 1 MB error) |
| Linker rejects output in a real 21 app | Low | **Still unverified** — Phase 4 smoke test outstanding |
| *(unforeseen)* animations deprecation blocks `ng update` | — | **Occurred** (§9.1) |
| *(unforeseen)* docs build never exits | — | **Occurred** (§9.4) |

The two real obstacles were both unforeseen, and neither was in the library
code — they were in the toolchain. The predicted code-level risks did not
materialise.

**Ongoing cost of dual-track:** every future fix needs a `release-18` backport
decision, two deploy workflows, and two npm publishes.
