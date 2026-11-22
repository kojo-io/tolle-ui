# @tolle_/mcp — Tolle UI for coding agents

A [Model Context Protocol](https://modelcontextprotocol.io) server that gives
coding agents the Tolle UI component docs: import lines, compiled examples,
the full API, form binding, services, types and known pitfalls.

The docs are generated from the component source and ship inside
`@tolle_/tolle-ui` (`registry/`), so the server reads **the version installed in
your project** — no drift between what the agent is told and what you have.

## Setup

Claude Code:

```bash
claude mcp add tolle-ui -- npx -y @tolle_/mcp
```

Any client that reads `.mcp.json` (or run `npx @tolle_/cli agents --mcp`):

```json
{
  "mcpServers": {
    "tolle-ui": { "command": "npx", "args": ["-y", "@tolle_/mcp"] }
  }
}
```

Start the client from the project root so the server finds
`node_modules/@tolle_/tolle-ui`.

## Tools

| Tool | What it returns |
| --- | --- |
| `get_setup` | Rules every component follows and the one-time app setup. |
| `list_components` | All components by category, tagged *form control* / *service*, with parts. Optional `category`. |
| `search_components` | Best matches for a need: `"searchable dropdown"`, `"confirm delete"`. |
| `get_component` | The full page for one component. Accepts a name (`select`), part (`select-item`), selector (`tolle-select-item`, `[tolleTooltip]`) or class (`SelectItemComponent`). |
| `get_examples` | Every example for a component as a complete standalone Angular component. |

All tools are read-only.

## Registry source

1. `--registry <path|url>` or `TOLLE_REGISTRY`
2. `@tolle_/tolle-ui` installed in the working directory
3. `https://tolle-ui.com/registry` (latest major)

`@tolle_/tolle-ui` versions built before the agent docs existed have no
`pages` in their manifest; the server says so and suggests upgrading or
`--registry https://tolle-ui.com/registry`.

## Development

```bash
npm run generate:registry   # repo root: build the registry this reads
npm test                    # here: build + stdio smoke test against it
```

No runtime dependencies: the stdio transport is newline-delimited JSON-RPC,
implemented in `src/index.ts`.
