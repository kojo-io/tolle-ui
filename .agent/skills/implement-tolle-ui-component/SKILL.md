---
name: implement-tolle-ui-component
description: Standardized workflow for importing, configuring, and implementing Tolle UI components in an Angular application.
version: 1.0.0
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

1.  **Identify the Component**
    *   Review the requirements to select the appropriate Tolle UI component (e.g., `tolle-button`, `tolle-alert`).
    *   Refer to `llm-ctx.txt` or `projects/docs` for specific API details.

2.  **Verify Configuration**
    *   Ensure the `package.json` dependency is `@tolle_/tolle-ui` (not `@tolle/ui`).
    *   Check that `tailwind.config.js` includes the preset.

3.  **Import the Component**
    *   Open the target component's TypeScript file (e.g., `<FEATURE_NAME>.component.ts`).
    *   Import the component symbol from the correct package path:
        ```typescript
        import { <COMPONENT_CLASS_NAME> } from '@tolle_/tolle-ui';
        ```
    *   **Rule**: Always import from `@tolle_/tolle-ui`. Do not import from internal paths like `projects/tolle/src/...`.

4.  **Register the Component**
    *   Add the component class to the `imports` array of the standalone component decorator:
        ```typescript
        @Component({
          standalone: true,
          imports: [ <COMPONENT_CLASS_NAME>, ... ],
          // ...
        })
        ```
    *   If using a module-based architecture (legacy), add it to the `imports` array of the `NgModule`.

5.  **Implement in Template**
    *   Add the component to the HTML template using its selector (prefix `tolle-`):
        ```html
        <tolle-<COMPONENT_SELECTOR> [input]="<VALUE>">
          <!-- Content -->
        </tolle-<COMPONENT_SELECTOR>>
        ```
    *   **Best Practice**: Use semantic HTML and verify accessibility attributes if not automatically handled.

6.  **Configure Inputs and Outputs**
    *   Bind necessary inputs (e.g., `[variant]`, `[size]`, `[busy]`) as per the API reference.
    *   Handle outputs (e.g., `(click)`, `(openChange)`) in the component class.
    *   **Troubleshooting**: If you encounter `Can't bind to 'ngModel'`, ensure `FormsModule` or `ReactiveFormsModule` is imported.

# Validation

1.  **Compilation Check**
    *   Run `ng build` or the relevant build command to ensure no TypeScript errors (e.g., "Component not known").
2.  **Visual Verification**
    *   Serve the application (`npm start`) and navigate to the feature.
    *   Verify the component renders with the correct styling (checked against the design system).
3.  **Functionality Test**
    *   Interact with the component (click, toggle, etc.) to ensure expected behavior.
