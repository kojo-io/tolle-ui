# Plan: Export Resizable Panel Components

## Task
Add `resizable-panel.component` and `resizable-panel-item.component` to the library's public API exports.

## Steps
1. Add two new export lines to `projects/tolle/src/public-api.ts`:
   - `export * from './lib/resizable-panel.component';`
   - `export * from './lib/resizable-panel-item.component';`

## Files to Modify
- `projects/tolle/src/public-api.ts`: Append the two export statements at the end of the file.
