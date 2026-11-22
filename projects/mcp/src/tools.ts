import { Registry, PageEntry } from './registry';

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  run(args: Record<string, unknown>, registry: Registry): Promise<string>;
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');

function tags(p: PageEntry): string {
  const t = [p.formControls.length ? 'form control' : '', p.services.length ? 'service' : ''].filter(Boolean);
  return t.length ? ` [${t.join(', ')}]` : '';
}

function line(p: PageEntry): string {
  const parts = p.parts.length ? ` Parts: ${p.parts.join(', ')}.` : '';
  return `- ${p.name}${tags(p)}: ${p.description}${parts}`;
}

async function notFound(registry: Registry, name: string): Promise<string> {
  const hits = await search(registry, name, 5);
  const hint = hits.length ? ` Closest: ${hits.map((h) => h.name).join(', ')}.` : '';
  throw new Error(`No Tolle UI component matches "${name}".${hint} Use list_components to see them all.`);
}

/** Small, dependency-free relevance score over the fields an agent would search by. */
async function search(registry: Registry, query: string, limit: number): Promise<PageEntry[]> {
  const m = await registry.getManifest();
  const terms = query.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean);
  if (!terms.length) return [];
  const scored = m.pages!.map((p) => {
    const name = p.name.toLowerCase();
    const kw = (p.keywords ?? []).join(' ').toLowerCase();
    const title = p.title.toLowerCase();
    const desc = `${p.description} ${p.whenToUse ?? ''}`.toLowerCase();
    const api = [...p.classes, ...p.selectors, ...p.services.map((s) => s.className)].join(' ').toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (name === t) score += 10;
      else if (name.includes(t)) score += 5;
      if (kw.includes(t)) score += 4;
      if (title.includes(t)) score += 3;
      if (api.includes(t)) score += 2;
      if (desc.includes(t)) score += 1;
    }
    return { p, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name))
    .slice(0, limit)
    .map((s) => s.p);
}

export const TOOLS: Tool[] = [
  {
    name: 'get_setup',
    description:
      'Rules that apply to every Tolle UI component (imports, form binding, variants, theming, icons, services) and the one-time app setup. Call this once before writing Tolle UI code.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    async run(_args, registry) {
      const m = await registry.getManifest();
      const llms = await registry.read('llms.txt');
      const rules = llms.slice(llms.indexOf('## Rules'), llms.indexOf('## Components')).trim();
      return `Tolle UI ${m.package}@${m.version} (Angular ${m.angular ?? '?'}) — registry: ${registry.source}\n\n${rules}\n`;
    },
  },
  {
    name: 'list_components',
    description:
      'List Tolle UI components grouped by category, with a one-line description, whether each is a form control or has a service, and its parts. Optionally filter by category (forms, actions, layout, overlays, navigation, feedback, data, date-time, media, ai, utilities, services).',
    inputSchema: {
      type: 'object',
      properties: { category: { type: 'string', description: 'Only this category.' } },
      additionalProperties: false,
    },
    async run(args, registry) {
      const m = await registry.getManifest();
      const cat = str(args.category).toLowerCase();
      const pages = m.pages!.filter((p) => !cat || p.category === cat);
      if (!pages.length) throw new Error(`No components in category "${cat}".`);
      const byCat = new Map<string, PageEntry[]>();
      for (const p of pages) byCat.set(p.category, [...(byCat.get(p.category) ?? []), p]);
      const out = [`${m.package}@${m.version} — ${pages.length} components. Call get_component(name) before using one.`, ''];
      for (const [c, ps] of byCat) out.push(`## ${c}`, ...ps.map(line), '');
      return out.join('\n');
    },
  },
  {
    name: 'search_components',
    description:
      'Find Tolle UI components for a need, e.g. "searchable dropdown", "confirm delete", "toast notification", "date range". Returns the best matches with descriptions.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'What you need, in a few words.' },
        limit: { type: 'number', description: 'Max results (default 6).' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    async run(args, registry) {
      const q = str(args.query);
      if (!q) throw new Error('query is required');
      const limit = typeof args.limit === 'number' && args.limit > 0 ? Math.min(args.limit, 20) : 6;
      const hits = await search(registry, q, limit);
      if (!hits.length) return `No match for "${q}". Try list_components.`;
      return hits
        .map((p) => `${line(p)}${p.whenToUse ? `\n  Use when: ${p.whenToUse}` : ''}`)
        .join('\n') + '\n\nCall get_component(name) for the full page.';
    },
  },
  {
    name: 'get_component',
    description:
      'The full usage page for one Tolle UI component: import line, a compiled example, every input/output with types and defaults, variants, how to bind it in forms, related services and types, and known pitfalls. Accepts a component name ("select"), a part ("select-item"), a selector ("tolle-select-item", "[tolleTooltip]") or a class name ("SelectItemComponent").',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'Component name, part, selector or class name.' } },
      required: ['name'],
      additionalProperties: false,
    },
    async run(args, registry) {
      const name = str(args.name);
      if (!name) throw new Error('name is required');
      const page = await registry.findPage(name);
      if (!page) return notFound(registry, name);
      return registry.read(page.doc);
    },
  },
  {
    name: 'get_examples',
    description:
      'All usage examples for a Tolle UI component as complete standalone Angular components (they compile in the Tolle docs app). get_component shows only the first few.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Component name, part, selector or class name.' },
        limit: { type: 'number', description: 'Max examples (default all).' },
      },
      required: ['name'],
      additionalProperties: false,
    },
    async run(args, registry) {
      const name = str(args.name);
      if (!name) throw new Error('name is required');
      const page = await registry.findPage(name);
      if (!page) return notFound(registry, name);
      const limit = typeof args.limit === 'number' && args.limit > 0 ? args.limit : page.examples.length;
      const ex = page.examples.slice(0, limit);
      if (!ex.length) return `${page.title} has no examples yet — see get_component("${page.name}").`;
      return ex.map((e) => `## ${e.title}\n\n\`\`\`ts\n${e.code}\n\`\`\``).join('\n\n') + '\n';
    },
  },
];
