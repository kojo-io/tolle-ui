# Contributing to Tolle UI

> [!IMPORTANT]
> **We are not accepting outside contributions at the moment.**
>
> Pull requests from outside the core team will be closed without review. Bug reports
> and feature requests are still welcome as GitHub issues — they help us prioritise
> even when we can't take patches.
>
> This document remains the authoring contract for the core team, and is worth reading
> if you maintain a fork or vendor components via the CLI.

This library is moving to a **single-source-of-truth** model: the component source under
`projects/tolle/src/lib/**` is the one place metadata lives, and a ts-morph generator
(`projects/registry/`, see the project plan) derives everything downstream from it —
the shadcn-style component **registry**, the **CLI** copy payloads, the docs **API tables**,
the published **`llms.txt`**, and the **MCP** manifest.

If you author components so the generator can read them, docs and agent tooling stay correct
for free. These conventions make that possible. Historically metadata was hand-written in the
docs app and drifted (`component-usage/DOCUMENTATION-REPORT.md` lists 13 such mismatches) — the
rules below exist to end that.

## 1. Variants — always use `cva`

Every component with visual `variant` / `size` / `intent` options defines its classes with
[`class-variance-authority`](https://cva.style), not hand-rolled `this.x === 'sm' && '...'`
ternaries. cva keys are trivially parseable by the generator; ternaries are not.

```ts
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const badgeVariants = cva('base classes here', {
  variants: {
    variant: { default: '...', secondary: '...', destructive: '...' },
    size: { sm: '...', default: '...', lg: '...' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

// Always export the prop type so consumers (and the generator) get the union.
export type BadgeProps = VariantProps<typeof badgeVariants>;
```

Compute the final class with `cn(xVariants({ ... }), this.class)` so consumer overrides win.
`button.component.ts` is the reference implementation.

## 2. JSDoc on every `@Input()` / `@Output()`

The generator captures the leading JSDoc as the prop description and reads `@default`.
Keep it to one line where possible; document units/allowed values when not obvious from the type.

```ts
/** Visual style of the badge. @default 'default' */
@Input() variant: BadgeProps['variant'] = 'default';

/** Emitted when the badge's dismiss control is clicked. */
@Output() dismiss = new EventEmitter<void>();
```

An input the **parent** component sets (select-item `active`, `selected`) gets an `@internal`
tag. It stays in the docs-app prop table but is left out of the agent docs, so agents don't
try to bind it:

```ts
/**
 * Keyboard highlight state, driven by the parent.
 * @internal
 */
@Input() active = false;
```

A cva group that no input feeds (checkbox `checked`) is reported to agents as a *styling state*
the component sets itself, not as a variant — so it is fine for a form control's visual state
to live in cva.

## 3. Selectors are `tolle-*`

Use the `tolle-` prefix on every component/directive selector. The generator records the real
selector (not a docs wrapper), so it must be correct here.

## 4. Content slots are discoverable

When you project content, prefer named `<ng-content select="[slotName]">` — the generator emits
these as documented slots. Give each a clear, stable attribute name.

## 5. Agent docs: an example and a sidecar

Every component ships an agent page (`registry/docs/<name>.md`, served by `@tolle_/mcp` and
pointed to by `tolle init`). Two things the AST can't infer make that page good:

**An example.** Add a standalone component under
`projects/docs/src/app/docs-examples/<name>/<example>/<example>.component.ts`, importing from
the lib by relative path like the existing ones. The generator rewrites it to
`import { … } from '@tolle_/tolle-ui'` and puts it on the page; files whose name starts with
`basic` come first. `npm run check:examples` type-checks every example with strict templates,
so an example an agent copies is one that compiles.

**A sidecar** `<name>.registry.ts` **next to the component** for what only a human knows:

```ts
// select.registry.ts
import type { RegistrySidecar } from '../../../registry/src/types';

export const selectRegistry: RegistrySidecar = {
  description: 'A single-value dropdown whose options are projected `<tolle-select-item>` children…',
  whenToUse: 'The user picks exactly one value from a short-to-medium list you write in the template.',
  alternatives: [{ name: 'combobox', when: 'the options come from an array and need type-to-filter search.' }],
  parts: ['select-item', 'select-group', 'select-separator'],
  forms: { SelectComponent: { notes: 'It holds the `value` of the chosen `<tolle-select-item>`.' } },
  pitfalls: ['Options are `<tolle-select-item value="…">` children — there is no `[options]` input.'],
  keywords: ['dropdown', 'picker'],
};
```

- `parts` — items documented on this page instead of as their own components. Items named
  `<name>-item` / `-trigger` / `-content` / `-link` / `-separator` / … are grouped
  automatically; declare the rest (`-group` parts, `dropdown-*` under `dropdown-menu`).
- `pitfalls` — the mistakes agents actually make. Write them as instructions.
- `forms` — what the form value holds, when `writeValue(value: any)` doesn't say.

Sidecars are not lib code: the generator excludes them from the registry items and the CLI
never copies them. Unknown items, parts or alternatives are reported as problems.

`npm run check:agent-docs` (CI) fails when coverage regresses — a new component without a
sidecar description or example, or a new input without JSDoc. After filling gaps, lower the
baseline with `npm run check:agent-docs -- --update`.

## 6. Modern Angular — but NOT signal inputs (yet)

> [!WARNING]
> **Use `@Input()` / `@Output()` decorators. Do not use `input()` / `output()` / `model()`.**
>
> The registry generator reads component metadata from the AST by looking for `Input` and
> `Output` **decorators** (`projects/registry/src/extract.ts`). It has no signal support. A
> component authored with signal inputs compiles and its tests pass, but it silently ships an
> **empty props table** — no docs API table, no `llms.txt` entry, no MCP metadata. That is
> exactly the drift this generator exists to prevent.
>
> Signal inputs can only land after `extract.ts` learns to parse them. Until then, decorators
> are mandatory.

Everything else about modern Angular does apply: `changeDetection: OnPush`, getters (or
`computed()` for non-input state) for derived classes, and `@if` / `@for` control flow.
Form controls keep the standard `ControlValueAccessor` contract.

Don't imperatively mutate a child component's `@Input()` from a parent, and — just as
important — **don't read a parent component's property from an OnPush child's getter**.
Nothing marks the child dirty when that property changes, so it renders stale forever. This
has bitten us more than once. Coordinate through a small parent-provided service that exposes
an observable, and `markForCheck()` when it emits — see `menubar.component.ts`,
`command.service.ts`, `select.service.ts`.

### Form controls share one label contract

Every form control takes `id`, `label`, `hint` and `errorMessage` (checkbox and switch: `id` and
an inline `label`), with the same look and ARIA wiring as `tolle-input`. Don't hand-roll it — use
`form-control-label.component.ts`:

```ts
host: { '[attr.id]': 'null' },   // the id belongs to the focusable element, not the host
template: `
  @if (label) { <tolle-form-control-label [for]="id" [disabled]="disabled">{{ label }}</tolle-form-control-label> }
  <button [id]="id" [attr.aria-invalid]="error || null"
          [attr.aria-describedby]="describedBy(id, hint, errorMessage, error, disabled)">…</button>
  @if (hasMessage(hint, errorMessage, error, disabled)) {
    <tolle-form-control-message [controlId]="id" [hint]="hint" [errorMessage]="errorMessage" [error]="error" />
  }
`,
```

The `host` binding matters: a static `id="x"` on a component is also copied onto its host
element, which leaves two elements with that id and makes an outside `<label for="x">` hit the
host. When the focusable element is not labelable (slider thumbs, a radiogroup `div`), pass
`[labelId]` instead of `[for]` and point `aria-labelledby` at it. New error flags are named
`error`; the pickers that already use `invalid` keep it.

## 7. Charts consume validated colour tokens

Chart marks use `--chart-1` … `--chart-5`. Those steps are validated for perceptual lightness,
chroma, colour-blind separation and contrast against each surface — light and dark are stepped
**separately**, because dark's usable lightness band is lower and narrower, not a mirror of
light's. Assign them **by series key, never by array index**, so filtering a series out doesn't
repaint the survivors. Cap at five; a sixth series is not a generated colour.

`generateChartRamp()` derives a ramp from an arbitrary brand hue and is explicitly best-effort
— five separable hues rotated from one starting point cannot be guaranteed colour-blind-safe
for every base. Prefer the shipped defaults, and always keep the legend and a table fallback so
colour is never the only channel carrying identity.

## Before you push

- `npm run build:lib` — the library compiles.
  Note: `ng build tolle` only walks what's reachable from `public-api.ts`. A new component that
  isn't exported yet **is not type-checked by that build** — its specs are what actually compile
  it. Export it, then build.
- `npm test` — component specs pass. Locally:
  `CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ng test tolle --watch=false --browsers=ChromeHeadless`
- `ng serve docs` (or `npm start`) — the component renders correctly in **light and dark**.
- `npm run generate:registry && npm run check:agent-docs && npm run check:examples` — the agent
  docs didn't regress and every example compiles. Read your component's
  `projects/tolle/registry/docs/<name>.md` once: it is what agents will see.
