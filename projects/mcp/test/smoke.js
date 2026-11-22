#!/usr/bin/env node
/**
 * Smoke test: drive the built server over stdio like an MCP client would and
 * assert on the answers. Uses the registry generated in this repo
 * (npm run generate:registry), or TOLLE_REGISTRY when set.
 *
 *   npm test        (from projects/mcp)
 */
const { spawn } = require('child_process');
const path = require('path');
const assert = require('assert');

const registry = process.env.TOLLE_REGISTRY || path.resolve(__dirname, '../../tolle/registry');
const server = spawn(process.execPath, [path.resolve(__dirname, '../dist/index.js'), '--registry', registry], {
  stdio: ['pipe', 'pipe', 'inherit'],
});

let buf = '';
const pending = new Map();
server.stdout.on('data', (d) => {
  buf += d;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i);
    buf = buf.slice(i + 1);
    const msg = JSON.parse(line);
    pending.get(msg.id)?.(msg);
    pending.delete(msg.id);
  }
});

let nextId = 1;
function call(method, params) {
  const id = nextId++;
  server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  return new Promise((resolve) => pending.set(id, resolve));
}
const tool = async (name, args = {}) => {
  const r = await call('tools/call', { name, arguments: args });
  return { text: r.result.content[0].text, isError: !!r.result.isError };
};

(async () => {
  const init = await call('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '0' } });
  assert.strictEqual(init.result.protocolVersion, '2025-06-18');
  assert.ok(init.result.capabilities.tools);
  server.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

  const list = await call('tools/list', {});
  const names = list.result.tools.map((t) => t.name).sort();
  assert.deepStrictEqual(names, ['get_component', 'get_examples', 'get_setup', 'list_components', 'search_components']);

  const setup = await tool('get_setup');
  assert.match(setup.text, /Rules that apply to every component/);

  const comps = await tool('list_components', { category: 'forms' });
  assert.match(comps.text, /- select \[form control\]/);

  const found = await tool('search_components', { query: 'toast notification' });
  assert.match(found.text.split('\n')[0], /toaster/);

  // A part, a selector and a class name all resolve to the parent page.
  for (const q of ['select-item', 'tolle-select-item', 'SelectItemComponent']) {
    const page = await tool('get_component', { name: q });
    assert.match(page.text, /^# Select/, q);
    assert.match(page.text, /\[\(ngModel\)\]/, q);
  }
  const tip = await tool('get_component', { name: '[tolleTooltip]' });
  assert.match(tip.text, /`tolleTooltip`/);

  const ex = await tool('get_examples', { name: 'button', limit: 2 });
  assert.match(ex.text, /from '@tolle_\/tolle-ui'/);
  assert.doesNotMatch(ex.text, /tolle\/src\/lib/);

  const missing = await tool('get_component', { name: 'definitely-not-a-component' });
  assert.ok(missing.isError);

  const unknown = await call('nope/method', {});
  assert.strictEqual(unknown.error.code, -32601);

  console.log('mcp smoke test: all assertions passed');
  server.kill();
})().catch((e) => {
  console.error(e);
  server.kill();
  process.exit(1);
});
