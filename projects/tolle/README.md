## 🛡️ License & Attribution

This library is **Open Source** and free to use for both personal and commercial projects.

However, you **cannot** replicate this library and claim it as your own work.
If you redistribute the source code or use it in a public project, the original
copyright notice and author attribution must remain intact.

**Built with ❤️ by Bernard Kojo Ossei-Agyei**

# @tolle_/tolle-ui

A premium, high-performance Angular UI library meticulously crafted with a **Google Dark Mode** aesthetic. Built for speed, accessibility, and a modern "charcoal" look.

The package major tracks the Angular major: `@tolle_/tolle-ui@21` is for Angular 21, `@18` for Angular 18.

## ✨ Features

- 🌑 **Google Dark Mode First:** Optimized for `#121212` backgrounds using `color-mix` CSS technology.
- ⚡ **Zero-Animation Base:** Clean, instant state changes for a "snappy" enterprise feel.
- 🧩 **Angular Native:** Built with Reactive Forms and `ControlValueAccessor` integration.
- 📏 **Unified Sizing:** Every component scales perfectly from `xs` to `lg`.
- 🔍 **Searchable Comboboxes:** Select components with built-in real-time filtering.
- 🍞 **Advanced Toast System:** Stackable notifications with "Pause-on-Hover" and progress timers.

---

## 🚀 Installation

The quickest path is the CLI, which installs the package matching your Angular
major, wires the theme, and writes agent instructions for coding assistants:

```bash
npx @tolle_/cli init
```

Or by hand — npm 7+ installs the peer dependencies (Floating UI, cva,
tailwind-merge, Remix Icon, …) for you:

```bash
npm install @tolle_/tolle-ui@^21
```

```css
/* styles.css */
@import '@tolle_/tolle-ui/theme.css';
@import 'remixicon/fonts/remixicon.css';
```

```js
// tailwind.config.js
module.exports = {
  presets: [require('@tolle_/tolle-ui/preset')],
  content: ['./src/**/*.{html,ts}', './node_modules/@tolle_/tolle-ui/**/*.mjs'],
};
```

## 🤖 Using Tolle UI with coding agents

Component docs written for agents ship inside the package at
`node_modules/@tolle_/tolle-ui/registry/` (`llms.txt` plus one page per
component under `docs/`), so they always match the installed version.
`npx @tolle_/cli agents` points `AGENTS.md` / Claude Code at them, and
`npx -y @tolle_/mcp` serves them over MCP.
