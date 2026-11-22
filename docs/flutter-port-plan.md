# Tolle UI → Flutter

**Feasibility and build plan — 14 Aug 2026**

Yes, it can be done, and the API surface is already machine-readable, which is the
unusual advantage here. But it is a re-implementation, not a port. Roughly a tenth of
the existing 32k lines carries over as logic; the rest is rewritten against a different
rendering model.

| | |
| --- | --- |
| Registry items | 117 |
| Component files | 112 |
| Services / directives | 14 / 4 |
| Lines (excl. specs) | ~32,000 |
| Form controls (`ControlValueAccessor`) | 27 |
| Estimated solo effort | 7–9 months |

---

## 1. Inventory

Difficulty below is about the Flutter side, not the Angular side — a component that is
trivial in HTML can be the hard one in a widget tree, and vice versa.

| Category | Items | Difficulty | Why |
| --- | ---: | --- | --- |
| forms | 26 | Medium | 27 `ControlValueAccessor` classes collapse onto one Flutter form pattern; focus traversal and IME are the real work |
| ai | 21 | Medium | Mostly composition and text rendering — but needs a markdown/streaming decision |
| overlays | 17 | **Hard** | No `floating-ui` equivalent; positioning gets built from scratch |
| layout | 15 | Low | Flutter has native analogues for most of it (`AspectRatio`, `Scrollbar`, `Divider`) |
| feedback | 8 | Low | Paint and animation only; toaster needs an overlay host |
| date-time | 6 | Medium | `date-fns` → `package:intl`; calendars are grid plus a lot of edge cases |
| data | 6 | **Hard** | SVG charts become `CustomPainter` with manual hit-testing |
| navigation | 6 | Medium | Menubar and navigation-menu depend on the overlay engine |
| actions | 5 | Low | First thing to build; proves the variant system |
| components | 3 | Medium | bar-list, category-bar, tracker — small custom paint |
| media | 3 | Medium | Carousel loses Embla and its five plugins |
| utilities | 1 | Low | direction |

---

## 2. What survives the crossing

Two files carry real value across untouched. `utils/color.ts` was written framework- and
DOM-free on purpose, and `chart.service.ts` is pure scale math. Everything expressed as a
template or a class string is rewritten.

| Layer | Angular today | Flutter | Verdict |
| --- | --- | --- | --- |
| Colour & token math | `utils/color.ts` (516 LOC) | near line-for-line Dart | **Transfers** |
| Chart scales & ticks | `chart.service.ts` (658 LOC) | near line-for-line Dart | **Transfers** |
| API surface | `registry.json` | generated Dart signatures | **Transfers** |
| Behaviour specs | `*.spec.ts` | widget tests | Translate |
| Date handling | `date-fns` | `DateTime` + `package:intl` | Translate |
| Persistence | `localStorage` | `shared_preferences` | Translate |
| Markup | Angular templates | widget trees | Rewrite |
| Styling | Tailwind + CSS vars | `ThemeExtension` + style objects | Rewrite |
| Variants | `cva` | enum + style resolver | Rewrite |
| Class escape hatch | `cn()` / `tailwind-merge` | no analogue — see Decision 3 | **Drop** |
| Injection | `provideTolleConfig` | `InheritedWidget` | Rewrite |
| Reactivity | RxJS `BehaviorSubject` | `ValueNotifier` / `ChangeNotifier` | Rewrite |
| Projection | `<ng-content>` | `Widget` / `WidgetBuilder` params | Rewrite |
| Forms | `ControlValueAccessor` ×27 | `FormField<T>` + `ValueChanged` | Rewrite |

### Third-party dependencies

| npm package | Files | Flutter replacement | Risk |
| --- | ---: | --- | --- |
| `@floating-ui/dom` | 14 | custom engine — `CompositedTransformFollower` + collision logic | **High** |
| `@angular/cdk/overlay` | 9 | `OverlayPortal` + custom host | Medium |
| `remixicon` | 46 | Remix Icon TTF + generated `IconData` map | Low |
| `date-fns` | 5 | `package:intl` | Low |
| `libphonenumber-js` | 2 | `phone_numbers_parser` | Low |
| `embla-carousel` + 5 plugins | 1 | `PageView`; autoplay / auto-scroll / fade hand-rolled | Medium |
| `cva` + `clsx` + `tailwind-merge` | ~all | none — replaced by the style system | Design change |

---

## 3. Architecture

**Theming keeps its config-first promise.** `TolleThemeData` carries the same token names
as `theme.css` — background, foreground, primary, muted, accent, destructive, border,
ring, radius, chart-1…5, the three font stacks. Light and dark are both derived by the
ported colour math, so one `primaryColor` still rebrands the app. A `TolleTheme`
inherited widget replaces `provideTolleConfig`; `shared_preferences` replaces the
localStorage layer in `ThemeService`.

**Variants become style objects.** Each component gets a variant enum plus an immutable
style class with `copyWith` and `merge`. Resolution order is theme default → variant →
per-instance `style:` argument. Last wins, which is the same contract `twMerge` gives
today, only at token level instead of class-string level.

**One overlay engine, built before any overlay.** Anchoring, flip/shift collision,
arrows, dismissal, focus trapping and scroll-lock get built once as an internal layer.
It is consumed by all 17 overlay components *plus* select, multi-select, combobox,
country-selector and the five date/time pickers — around 28 components in total. Nothing
in that set should start before the engine is done, and nothing else in the plan is as
easy to underestimate.

**Charts repaint, they don't re-render.** SVG output becomes `CustomPainter`. The scale,
tick and band math ports across as-is — only the paint and hit-test layers are new, and
hit-testing is where the tooltip work lands, which is why data comes after overlays.

---

## 4. The lever: the registry becomes the parity contract

This is the piece that makes the project tractable, and it already exists.
`projects/registry` walks the library with ts-morph and extracts every input, output,
slot, variant and dependency into `registry.json`. Three additions turn that into a
cross-framework contract:

1. A new emitter producing `flutter-parity.json` — the canonical API per component,
   framework-neutral.
2. Codegen for Dart class and constructor stubs with doc comments, so nobody hand-types
   117 signatures or silently renames a parameter.
3. A CI check that fails when an Angular input has no Dart counterpart and no explicit
   divergence marker.

Without that gate, the two libraries become two different products inside two releases.
With it, drift is a build failure rather than a bug report.

---

## 5. Phases

Order is set by what blocks what, not by what is easiest. Estimates assume one
experienced Flutter developer and are rough — the spike in §7 is the calibration.

### Phase 0 — Foundation · 2–3 weeks · **mostly complete**
No components. Tokens, `TolleThemeData`, light/dark derivation, ported colour math, the
style-merge system, interaction-state layer, icon font, type scale, and the parity
emitter with codegen.
**Gate:** a demo app fully rebranded from a config object, containing zero components.
**Status:** gate met — `flutter/tolle_ui` with 60 passing tests, and
`flutter/tolle_ui/example` re-skins entirely from a `TolleConfig`. Landed:

- `color_math.dart` — port of `utils/color.ts`, asserted against reference output
  generated from the TypeScript itself (`npm run generate:flutter-color-reference`).
  The OKLCH chart ramp matches byte for byte across 12 colours in both appearances.
- `tokens.dart` / `base_palettes.dart` / `theme_data.dart` — the full token set and the
  config → token resolution, in the same order as `ThemeService.initializeTheme`.
- `theme.dart` — `TolleTheme` scope, `TolleThemeController`, pluggable persistence.
- `style.dart` / `interaction.dart` — the style-merge system and the hover/focus/press/
  disabled layer, including keyboard activation and merged semantics.
- `flutter-parity.json` + `npm run check:flutter-parity` — the contract and its gate,
  wired into `.github/workflows/flutter.yml`.

Also landed since: the icon layer (`npm run generate:flutter-icons` — 3229 `IconData`
constants plus the TTF, and it now flags `ri-*` classes the Angular library references
that Remix Icon does not define), and **`TolleButton`**, the first ported component,
which took the parity gate to 1/117 with zero gaps.

**Still outstanding in Phase 0:** Dart stub codegen from the parity contract, and one
open defect below.

> **Open: the icon font does not tree-shake.** In the example app the Remix Icon TTF
> reduces by only 18% (613KB → 502KB), against ~99% for Material and Cupertino in the
> same build. It is not usage-driven — a build with *zero* icon references retains the
> same 502KB — and it is not the name→`IconData` lookup map, which was moved to its own
> unexported library with no effect. All 3229 `static const IconData` fields appear to
> reach the kernel regardless of reference. Cupertino's class has the same shape and does
> shake, so the cause is still unidentified. Roughly 500KB of avoidable payload for every
> consuming app; worth resolving before Phase 1 ships, not before it starts.

### Phase 1 — Primitives · 3–4 weeks
~25 items across actions, feedback and layout: button, badge, card, alert, avatar,
skeleton, spinner, progress, toggle-group, accordion, tabs, table, and the rest.
**Gate:** the variant system holds across six or more variant groups without special-casing.

### Phase 2 — Overlay engine, then overlays · **re-costed 4.5–6 weeks** (was 5–7)
Engine first, then tooltip → popover → dropdown → context-menu → hover-card → modal →
sheet → alert-dialog → command. 17 items.
**Gate:** flip, shift and arrow placement match the Angular build at every viewport edge.

The engine must reach feature parity with the floating-ui middleware the Angular library
actually uses, measured from source: `flip`, `shift` and `offset` on all 15 positioned
components, `hide` and `autoUpdate` on 13, `size` on 7.

**Probe result — the largest unknown in the plan is retired.** The positioning core is
built and tested (`compute_position.dart`, `overlay_anchor.dart`; 41 tests). It covers
placement across 4 sides × 3 alignments, `offset`, `flip` on both main and cross axis,
`shift` with `limitShift`, `size` including match-anchor-width, and `hide`, plus the
widget layer: `OverlayPortal`, measure-then-place, `autoUpdate` on scroll and resize,
outside-tap and Escape dismissal. It took well under the 2–3 weeks budgeted for the
engine, which is the main reason for the re-cost — and the variance drops more than the
mean, because the part nobody could estimate is now known.

Two findings worth carrying forward:

* `CompositedTransformFollower` cannot express this. It applies a transform at paint
  time and never sees layout, whereas flip and shift are decisions about a measured
  size. `CustomSingleChildLayout` is the right primitive — its delegate receives the
  child's size and returns the offset, which is floating-ui's flow exactly.
* `OverlayPortalController.show()/hide()` asserts if called during the persistent
  callbacks phase, and `didUpdateWidget` runs inside it — so the obvious "rebuild the
  parent with a new `open`" crashes. The toggle has to defer to the end of the frame.

**Still outstanding in the engine**, and the basis of the remaining estimate: arrow
rendering against `shiftedBy`, a real focus trap, scroll lock, overlay stacking (the
Angular side has `modal-stack.service`), enter/exit animation, RTL-aware start/end
placement, and hover-intent for tooltips and submenus. All mechanical rather than
uncertain.

`shadcn_ui`'s MIT-licensed `portal.dart` remains available as a reference but is no
longer needed as a starting point (see Decision 1).

### Phase 3 — Forms · 5–6 weeks
26 items — inputs, selects, checkbox and radio, slider, OTP, tag and masked input,
segment, phone number and country selector.
**Gate:** all 27 form controls sit on one pattern, with validation and keyboard traversal
working end to end.

### Phase 4 — Dates, navigation, media · 4–5 weeks
The five calendars and pickers, menubar, navigation-menu, pagination, sidebar, the
resizable family, carousel. ~21 items.
**Gate:** locale-correct date rendering and carousel autoplay parity without Embla.

### Phase 5 — Data visualisation · 4–5 weeks
chart, chart-pie, chart-spark, data-table, bar-list, category-bar, tracker. Custom paint,
gesture hit-testing, chart tooltips.
**Gate:** ported scale math produces pixel-comparable output against the Angular charts.

### Phase 6 — AI kit · 5–6 weeks
The 21 differentiated components — conversation, message, prompt-input, reasoning,
chain-of-thought, task, tool, plan, sources, citations, attachments and the rest. This is
the set with no equivalent in any other Flutter library.
**Gate:** streaming text and markdown render smoothly in a long scrolling conversation.

### Gallery & docs · 3–4 weeks
A Flutter gallery app for mobile and web, fed from the registry's existing
`docs-content.json` so both sites document from one source.
**Gate:** every shipped component has a live example and a generated API table.

---

## 6. Five decisions to make before Phase 0

**1. Greenfield, or build on an existing Flutter shadcn port?** — **decided: greenfield, with two harvests**

Evaluated `shadcn_ui` 0.56.1 and `forui` 0.25.0 against the real contract, not on
reputation. Findings:

| | shadcn_ui 0.56.1 | forui 0.25.0 |
| --- | --- | --- |
| Coverage of the 117 | 52 (44%) | 61 (52%) |
| Union of both | \-- 65 (56%) \-- | |
| Colour tokens matching Tolle | 19 of 20, 1:1 | ~11, vocabulary diverges |
| Hosts the Tolle token system | **yes, proven** | no — lacks `popover`, `input`, `ring`, `cardForeground` |
| Overlay engine | anchor + offset + one vertical fallback | richer, but its own model |
| Transitive dependencies | 55 added packages | — |

The theming question came back positive for `shadcn_ui`: a spike built `ShadColorScheme`
straight from `TolleThemeData` (19 fields map by name; `ShadColorScheme.custom`, a lerped
`Map<String, Color>`, absorbs Tolle's other 21 tokens — 6 semantic, 5 chart, 10 ramp
steps), and a real `ShadButton` rendered in `#551a65` from a `TolleConfig` alone, with
both systems resolving an identical `ring`. So the blocking question passed.

Adoption still loses, for four reasons the coverage number hides:

1. **The saving misses the differentiated half.** 52 of 117 are covered by *neither*
   package — the entire 21-component AI kit, the charts and data table, and the
   Tolle-specific forms. That is where the work actually is.
2. **It does not solve Phase 2.** All 15 positioned components use floating-ui's `flip`
   *and* `shift` *and* `offset`; 13 use `hide` and `autoUpdate`; 7 use `size`.
   `shadcn_ui`'s portal offers anchoring, offset, resize-follow and a single
   hand-specified *vertical* fallback — no shift, no size, no hide. The hardest item in
   the plan survives adoption largely intact.
3. **Parity would break or the saving would evaporate.** `ShadButton` exposes shadcn's
   API, not Tolle's. Re-exporting it abandons the parity contract; wrapping it preserves
   parity but the wrapper *is* most of the work for primitives, where the internals are
   a day each anyway.
4. **A library must not inherit a pre-1.0 dependency tree.** `shadcn_ui` adds 55
   transitive packages — including `slang`, imposing its own i18n framework on every
   consumer — and both candidates are pre-1.0, so Tolle's public API stability would be
   hostage to someone else's churn. Tolle ships zero runtime dependencies today.

*Decided:* build greenfield, and harvest rather than depend. Both packages are MIT, the
same licence as Tolle, so two things can be lifted with attribution:

- `shadcn_ui`'s `raw_components/portal.dart` (543 lines) as a **starting point** for the
  overlay engine — the portal lifecycle and anchor plumbing are sound; flip, shift, size
  and hide still have to be written.
- `forui`'s overlay handling as a second reference for the same work.

The interop adapter is worth keeping as an *optional* published shim, so an app that
already uses `shadcn_ui` can drive both from one `TolleConfig`. That is a nice-to-have,
not a dependency.

**2. Full parity, or the differentiated subset first?**
117 components is a long time before anything ships.
*Recommendation:* ship Phases 0–3 as v0.1 — around 70 components, enough to build a real
app. Lead v0.2 with the AI kit, which is the reason to pick Tolle over anything else on
pub. Full parity as a direction, not a launch gate.

**3. Does the `class` escape hatch survive?** — **decided: no**
Every Angular component takes a `class` input and merges it with `twMerge`. Flutter has
nothing equivalent, and no amount of API design will make it feel the same.
*Decided in Phase 0:* replaced with typed, all-nullable style objects resolving
theme default → variant → per-instance `style:`, last wins, merging per interaction
state (`mergeStateProperty`). Built on Flutter's own `WidgetStateProperty` rather than a
parallel mechanism. `class` appears in the parity contract as an input with no Dart
counterpart and is the one expected divergence across all 117 components.

**4. pub package, or a source-copy CLI?**
The Angular story leans hard on `npx @tolle_/cli add` — you own the source you copy.
Dart's norm is a plain dependency.
*Recommendation:* publish `tolle_ui` as a pub package first. Add a Mason brick or a
`tolle` CLI later if the copy-source story proves as load-bearing as it is on the web side.

**5. Naming and API idiom.**
Inputs become constructor parameters, outputs become `ValueChanged<T>` callbacks, and the
prefix question — `TolleButton` versus a bare `Button` — needs answering once.
*Recommendation:* prefix everything, matching the `tolle-` selector convention and the
norm for Flutter design systems. Codify it in the parity emitter so `tolle-button` →
`TolleButton` is mechanical rather than a judgement call per component.

---

## 7. A two-week spike before committing

Build eight components that each prove a different axis — deliberately not the eight
easiest. Every estimate above depends on assumptions this spike either confirms or destroys.

| Component | What it proves |
| --- | --- |
| button | Variant system and style merging |
| card | Content projection mapped to child and builder parameters |
| input | The form-control pattern, focus and validation |
| select | Overlay positioning, keyboard navigation and form value in one component |
| tooltip | Anchored overlay that never steals focus |
| chart-spark | `CustomPainter` driven by the ported scale math |
| calendar | Date handling with no `date-fns` |
| message | The AI-kit shape and text rendering |

If all eight land inside two weeks on top of Phase 0 theming, the phase estimates hold.
If `select` alone consumes a week, Phase 2 is understated and the whole plan needs
re-costing before anyone commits to a date.

---

## 8. Risks

- **The positioning engine.** Fourteen components lean on `floating-ui` and Flutter has
  no equivalent. Underestimating this sinks Phase 2 and everything downstream of it.
- **Drift.** Two libraries maintained by hand diverge fast. The parity CI gate is not
  optional polish — it is the thing that keeps this one product.
- **Docs are a second product.** The Angular docs app is substantial. A Flutter gallery
  is a real line item, and sharing `docs-content.json` between them is the only version
  of this that stays affordable.
- **Icons.** 46 files reference Remix Icon CSS classes. The TTF ships fine in a Dart
  package, but it needs a generated `IconData` map and the tree-shaking story differs
  from the web build.
- **Markdown and streaming.** Phase 6 depends on a markdown renderer, and the Flutter
  markdown ecosystem has been unsettled. Verify what's currently maintained before
  designing the AI kit around any one package.
- **Maintainer load.** This doubles the surface one person supports, on a project that
  already states it isn't taking outside contributions. That constraint applies twice as
  hard to a second framework.

---

*Source: `projects/tolle/registry/registry.json` · 117 items · branch `feat/angular-21`*
