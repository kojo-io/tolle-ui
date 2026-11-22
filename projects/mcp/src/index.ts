#!/usr/bin/env node
/**
 * @tolle_/mcp — a Model Context Protocol server for Tolle UI.
 *
 * Serves the agent docs generated from the component source (registry/docs,
 * llms.txt, manifest.json) to MCP clients over stdio. By default it reads the
 * @tolle_/tolle-ui installed in the working directory, so answers match the
 * project's version; it falls back to the hosted registry.
 *
 * Deliberately dependency-free: the stdio transport is newline-delimited
 * JSON-RPC 2.0, and this server only needs initialize, ping, tools/list and
 * tools/call. stdout carries protocol messages only — logs go to stderr.
 *
 *   npx -y @tolle_/mcp [--registry <path|url>]
 */
import * as readline from 'readline';
import { Registry, resolveRegistry } from './registry';
import { TOOLS } from './tools';

const VERSION = '0.1.0';
const SUPPORTED = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];

interface Request {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: any;
}

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  process.stderr.write(`tolle-mcp ${VERSION} — MCP server for Tolle UI (stdio)

  npx -y @tolle_/mcp [--registry <path|url>]

Registry: --registry, else $TOLLE_REGISTRY, else the @tolle_/tolle-ui installed
in the working directory, else https://tolle-ui.com/registry.
Tools: ${TOOLS.map((t) => t.name).join(', ')}
`);
  process.exit(0);
}

const registry = new Registry(resolveRegistry(argValue('--registry') ?? process.env.TOLLE_REGISTRY));
process.stderr.write(`[tolle-mcp] registry: ${registry.source}\n`);

const send = (msg: unknown) => process.stdout.write(JSON.stringify(msg) + '\n');
const reply = (id: Request['id'], result: unknown) => send({ jsonrpc: '2.0', id, result });
const fail = (id: Request['id'], code: number, message: string) => send({ jsonrpc: '2.0', id, error: { code, message } });

async function handle(req: Request): Promise<void> {
  const isNotification = req.id === undefined || req.id === null;
  switch (req.method) {
    case 'initialize': {
      const asked = req.params?.protocolVersion;
      reply(req.id, {
        protocolVersion: SUPPORTED.includes(asked) ? asked : SUPPORTED[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'tolle-ui', version: VERSION },
        instructions:
          'Tolle UI component docs for this project. Call get_setup once, then get_component(name) before writing any tolle-* template. Use search_components to pick a component for a need.',
      });
      return;
    }
    case 'ping':
      reply(req.id, {});
      return;
    case 'tools/list':
      reply(req.id, {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({
          name,
          description,
          inputSchema,
          annotations: { readOnlyHint: true, openWorldHint: false },
        })),
      });
      return;
    case 'tools/call': {
      const tool = TOOLS.find((t) => t.name === req.params?.name);
      if (!tool) {
        fail(req.id, -32602, `Unknown tool: ${req.params?.name}`);
        return;
      }
      try {
        const text = await tool.run(req.params?.arguments ?? {}, registry);
        reply(req.id, { content: [{ type: 'text', text }] });
      } catch (e: any) {
        // Tool failures are results the model can read and recover from, not protocol errors.
        reply(req.id, { content: [{ type: 'text', text: String(e?.message ?? e) }], isError: true });
      }
      return;
    }
    default:
      if (!isNotification) fail(req.id, -32601, `Method not found: ${req.method}`);
  }
}

const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (raw) => {
  const text = raw.trim();
  if (!text) return;
  let msg: Request;
  try {
    msg = JSON.parse(text);
  } catch {
    send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
    return;
  }
  handle(msg).catch((e) => {
    process.stderr.write(`[tolle-mcp] ${e?.stack ?? e}\n`);
    if (msg.id !== undefined && msg.id !== null) fail(msg.id, -32603, String(e?.message ?? e));
  });
});
rl.on('close', () => process.exit(0));
