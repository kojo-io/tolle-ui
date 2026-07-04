# Contributing to Tolle UI

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

## 6. Modern Angular (rolling out in Phase 4)

New/edited components should trend toward: `input()` / `model()` / `output()` signals,
`computed()` for derived classes, `changeDetection: OnPush`, and `@if` / `@for` control flow.
Form controls keep the standard `ControlValueAccessor` contract. Don't imperatively mutate a
child component's `@Input()` from a parent — coordinate through a signal or a small service
(see `select.service.ts` / `radio-service.ts`).

## Before you push

- `npm run build:lib` — the library compiles.
- `npm test` — component specs pass.
- `ng serve docs` (or `npm start`) — the component renders correctly in **light and dark**.
