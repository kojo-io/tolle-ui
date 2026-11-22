---
name: implement-tolle-ui-component
description: Standardized workflow for importing, configuring, and implementing Tolle UI components in an Angular application.
version: 1.1.0
tags:
  - angular
  - tolle-ui
  - components
  - frontend
---

# Introduction

Activate this skill when you need to add a Tolle UI component (e.g., Button, Alert, Data Table, etc.) to an existing Angular feature or page. This protocol ensures consistent import paths, correct configuration, and adherence to the library's design patterns.

# Prerequisites

*   **Angular Project**: The workspace must be an Angular application (verified by `angular.json`).
*   **Tolle UI Library**: The `@tolle_/tolle-ui` package must be installed in `package.json`.
*   **Tailwind CSS**: `tailwind.config.js` must be configured with `require('@tolle_/tolle-ui/preset')`.
*   **Global Styles**: `theme.css` must be imported in `styles.css` or `angular.json` (e.g., `"node_modules/@tolle_/tolle-ui/theme.css"`).

# The Protocol

1.  **Read the docs for the installed version — don't work from memory**
    *   Index and global rules: `node_modules/@tolle_/tolle-ui/registry/llms.txt`.
    *   The component's page: `node_modules/@tolle_/tolle-ui/registry/docs/<name>.md`
        (or `npx @tolle_/cli docs <name>`, or the `get_component` tool of the `@tolle_/mcp` server).
    *   Inside this repo, the same files are generated into `projects/tolle/registry/`
        by `npm run generate:registry`.
    *   Each page has the import line, a compiled example, the API, form binding, services, types and pitfalls.

2.  **Verify Configuration**
    *   Ensure the `package.json` dependency is `@tolle_/tolle-ui` (not `@tolle/ui`).
    *   Check that `tailwind.config.js` includes the preset.

3.  **Import the Component — and its parts**
    *   Import every class the template uses from the package path:
        ```typescript
        import { SelectComponent, SelectItemComponent } from '@tolle_/tolle-ui';
        ```
    *   **Rule**: Always import from `@tolle_/tolle-ui`. Do not import from internal paths like `projects/tolle/src/...`.
    *   Parts are separate classes (`<tolle-select-item>` → `SelectItemComponent`). The page's Setup block lists them all.

4.  **Register the Component**
    *   Add the classes to the `imports` array of the standalone component decorator. Services (`ToastService`, `ModalService`, …) are injected with `inject()`, not imported into `imports`.

5.  **Implement in Template**
    *   Copy the structure of the page's example (which parts nest where), not just the tag name.
    *   Directives are attributes on an existing element: `<tolle-button tolleTooltip="Edit">`.

6.  **Configure Inputs, Outputs and Form Binding**
    *   Use only the inputs and variant values listed on the page.
    *   Pages marked **form control** bind their value with `[(ngModel)]` (import `FormsModule`) or `formControlName` (import `ReactiveFormsModule`) — they have no `[value]` / `[checked]` input for it.
    *   Anything a page lists as a "styling state" is set by the component; never bind it.

# Validation

1.  **Compilation Check**
    *   Run `ng build` or the relevant build command. With strict templates, unknown inputs and invalid variant values are compile errors.
2.  **Visual Verification**
    *   Serve the application (`npm start`) and navigate to the feature.
    *   Verify the component renders with the correct styling (checked against the design system).
3.  **Functionality Test**
    *   Interact with the component (click, toggle, etc.) to ensure expected behavior.

# Authoring or modifying library components

If you are working *inside* this repo on the library itself (not just consuming it), follow
`projects/tolle/CONTRIBUTING.md`. Tolle UI derives its component registry, docs API tables,
agent docs (`registry/docs/*.md`, `llms.txt`) and MCP manifest from the component source via a
single ts-morph generator, so the source must carry the metadata:

*   Define variants with `cva` + `export type XProps = VariantProps<typeof xVariants>` (see `button.component.ts`).
*   Put one-line JSDoc on every `@Input()` / `@Output()` (with `@default` where relevant; `@internal` for parent-managed inputs).
*   Keep selectors `tolle-*`; name projected slots via `<ng-content select="[slot]">`.
*   Add a docs-app example under `projects/docs/src/app/docs-examples/<name>/`.
*   Put what only a human knows (description, when to use, alternatives, pitfalls, parts) in a typed
    `<name>.registry.ts` sidecar beside the component.
*   Before pushing: `npm run generate:registry && npm run check:agent-docs && npm run check:examples`.
