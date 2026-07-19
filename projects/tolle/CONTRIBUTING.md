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

## 3. Selectors are `tolle-*`

Use the `tolle-` prefix on every component/directive selector. The generator records the real
selector (not a docs wrapper), so it must be correct here.

## 4. Content slots are discoverable

When you project content, prefer named `<ng-content select="[slotName]">` — the generator emits
these as documented slots. Give each a clear, stable attribute name.

## 5. Sidecar for metadata that can't be inferred

Anything the AST can't carry — human title, long description, category, curated usage examples,
a11y notes, or explicit registry-dependency overrides — goes in a typed sidecar **next to the
component** so it can't drift:

```ts
// button.registry.ts
import type { RegistryMeta } from '../registry/types'; // added in Phase 1
export const buttonRegistry: RegistryMeta = {
  title: 'Button',
  category: 'actions',
  description: 'A clickable button with variants, sizes, and a busy state.',
  examples: [{ title: 'Variants', code: `<tolle-button variant="secondary">Save</tolle-button>` }],
};
```

Sidecars are optional — only add fields the generator can't infer from source.

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
