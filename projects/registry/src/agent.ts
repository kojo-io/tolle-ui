/**
 * Agent-facing documentation: what an AI coding agent reads before it writes a
 * Tolle UI template.
 *
 * The raw model is one item per source file, which is the right unit for the
 * CLI (copy select-item.component.ts) and the wrong unit for an agent (it needs
 * to know `<tolle-select>` takes `<tolle-select-item>` children). So this
 * module regroups items into pages — a component plus its parts — and renders
 * each page with everything needed to use it correctly:
 *
 *   - how to bind its value when it is a form control (`[(ngModel)]`)
 *   - variants that are inputs vs. cva states the component sets itself
 *   - the binding name of aliased inputs (`tolleTooltip`, not `content`)
 *   - the services that drive it (ToastService.show) and the types they take
 *   - compiled examples from the docs app
 *   - hand-written when-to-use / alternatives / pitfalls from sidecars
 *
 * Outputs (under `registry/`): docs/<page>.md, llms.txt, llms-full.txt, and the
 * page index inside manifest.json. Every file is small enough to read whole.
 */
import {
  RegistryItem,
  ComponentClassMeta,
  InputMeta,
  ServiceMeta,
  ExampleMeta,
  VariantMeta,
} from './types';
import { TypeDecl, referencedTypes } from './services';

export const PKG = '@tolle_/tolle-ui';

/** Examples printed on a page; the rest stay in the manifest (MCP `get_examples`). */
const PAGE_EXAMPLES = 3;
/** Long examples (carousel demos) crowd out the API; keep them for the manifest. */
const MAX_EXAMPLE_CHARS = 4500;
/** llms-full.txt keeps one example per page only when it is this short. */
const FULL_EXAMPLE_CHARS = 1400;

export interface Page {
  name: string;
  title: string;
  description: string;
  /** True when no sidecar gave a real description. */
  generatedDescription: boolean;
  category: string;
  isNew?: boolean;
  whenToUse?: string;
  alternatives: { name: string; when: string }[];
  pitfalls: string[];
  a11yNotes?: string;
  keywords: string[];
  /** Primary item first, then parts. */
  items: RegistryItem[];
  classes: ComponentClassMeta[];
  services: ServiceMeta[];
  types: TypeDecl[];
  examples: ExampleMeta[];
  npm: string[];
}

export interface LibInfo {
  version: string;
  /** e.g. '21' — from the package's @angular/core peer range. */
  angularMajor: string;
}

/* -------------------------------- grouping -------------------------------- */

/**
 * Suffixes that mark an item as a part of the item it is prefixed by
 * (`accordion-item` → accordion). `group` is deliberately absent: button-group
 * and input-group are components in their own right; the few real `-group`
 * parts are declared in sidecars.
 */
const PART_SUFFIX = /^(item|trigger|content|fallback|link|separator|label|slot|panel|panel-item|wrapper)$/;

export function assignParents(items: RegistryItem[]): void {
  const names = new Set(items.map((i) => i.name));
  const byName = new Map(items.map((i) => [i.name, i]));

  // Explicit sidecar parts win.
  for (const i of items) {
    for (const p of i.parts ?? []) {
      const part = byName.get(p);
      if (!part) throw new Error(`${i.name}.registry.ts: unknown part '${p}'`);
      part.parent = i.name;
    }
  }
  // Then the naming heuristic, longest matching prefix first.
  for (const i of items) {
    if (i.parent || i.parts?.length) continue;
    const segs = i.name.split('-');
    for (let n = segs.length - 1; n >= 1; n--) {
      const prefix = segs.slice(0, n).join('-');
      const suffix = segs.slice(n).join('-');
      if (names.has(prefix) && PART_SUFFIX.test(suffix)) {
        i.parent = prefix;
        break;
      }
    }
  }
  // Flatten chains (resizable-panel-item → resizable-panel → resizable).
  for (const i of items) {
    let p = i.parent;
    while (p && byName.get(p)?.parent) p = byName.get(p)!.parent;
    i.parent = p;
  }
  for (const i of items) i.parts = items.filter((x) => x.parent === i.name).map((x) => x.name);
}

export function buildPages(
  items: RegistryItem[],
  typeIndex: Map<string, TypeDecl>,
  describe: (i: RegistryItem) => string,
  categorize: (name: string) => string,
  npmFor: (i: RegistryItem) => string[]
): Page[] {
  const byName = new Map(items.map((i) => [i.name, i]));
  const pages: Page[] = [];
  for (const primary of items) {
    if (primary.parent) continue;
    // Internal building blocks (and abstract bases) are not something to write in a template.
    if (primary.components.length && primary.components.every((c) => c.internal || isAbstract(c))) continue;
    const members = [primary, ...(primary.parts ?? []).map((p) => byName.get(p)!)];
    const classes = members.flatMap((m) => m.components).filter((c) => !isAbstract(c) && !c.internal);
    const services = dedupe(members.flatMap((m) => m.services ?? []), (s) => s.className);
    const classNames = new Set(items.flatMap((i) => i.components.map((c) => c.className)));

    const typeTexts = [
      ...classes.flatMap((c) => [...c.inputs.map((i) => i.type), ...c.outputs.map((o) => o.type), c.forms?.valueType ?? '']),
      ...services.flatMap((s) => s.members.map((m) => m.signature)),
    ];

    pages.push({
      name: primary.name,
      title: primary.title ?? titleCase(primary.name),
      description: primary.description ?? describe(primary),
      generatedDescription: !primary.description,
      category: primary.category ?? categorize(primary.name),
      isNew: members.some((m) => m.isNew) || undefined,
      whenToUse: primary.whenToUse,
      alternatives: primary.alternatives ?? [],
      pitfalls: members.flatMap((m) => m.pitfalls ?? []),
      a11yNotes: primary.a11yNotes,
      keywords: dedupe(members.flatMap((m) => [m.name, ...(m.keywords ?? [])]), (k) => k),
      items: members,
      classes,
      services,
      types: referencedTypes(typeTexts, typeIndex, classNames),
      examples: members.flatMap((m) => m.examples ?? []),
      npm: dedupe(members.flatMap(npmFor), (x) => x).sort(),
    });
  }
  return pages;
}

/** Abstract bases exported for subclassing (ChartChild, ToolPayloadBase) aren't used in templates. */
function isAbstract(c: ComponentClassMeta): boolean {
  return !c.selector;
}

/* ------------------------------- rendering -------------------------------- */

export function renderPage(page: Page, lib: LibInfo, opts: { full?: boolean } = {}): string {
  const out: string[] = [];
  const h = opts.full ? '##' : '#';
  const hh = opts.full ? '###' : '##';
  const hhh = opts.full ? '####' : '###';

  out.push(`${h} ${page.title}`, '');
  out.push(`> ${page.description}`, '');
  if (page.whenToUse) out.push(`**Use it when:** ${page.whenToUse}`, '');
  if (page.alternatives.length) {
    out.push('**Consider instead:**', '');
    for (const a of page.alternatives) out.push(`- [${titleCase(a.name)}](${a.name}.md) — ${a.when}`);
    out.push('');
  }

  // Setup: imports first — the commonest agent failure is a missing class in `imports`.
  const classNames = page.classes.map((c) => c.className);
  const serviceNames = page.services.map((s) => s.className);
  const forms = page.classes.filter((c) => c.forms);
  if (opts.full) {
    out.push(`- Import: \`import { ${[...classNames, ...serviceNames].join(', ')} } from '${PKG}';\``);
    if (forms.length) out.push(`- Form control${forms.length > 1 ? 's' : ''}: ${forms.map((c) => `\`${tagOf(c)}\` (value: \`${c.forms!.valueType}\`)`).join(', ')} — bind with \`[(ngModel)]\` / \`formControlName\`.`);
    out.push('');
  } else {
  out.push(`${hh} Setup`, '');
  out.push('```ts', `import { ${[...classNames, ...serviceNames].join(', ')} } from '${PKG}';`, '```', '');
  out.push(
    `Add each class you use in the template to your standalone component's \`imports\` array${
      page.classes.length > 1 ? ' — every part is its own class' : ''
    }.${page.services.length ? ' Services are injected, not imported into `imports`.' : ''}`
  );
  if (forms.length) out.push('Form controls also need `FormsModule` (for `ngModel`) or `ReactiveFormsModule` (for `formControlName` / `[formControl]`).');
  out.push('', `To own the source instead of importing the package: \`npx @tolle_/cli add ${page.name}\`.`, '');
  }

  // Examples: the first one carries most of the value. The all-in-one file
  // keeps only short ones; the per-page file is where the full demos live.
  const examples = opts.full
    ? page.examples.filter((e) => e.code.length <= FULL_EXAMPLE_CHARS).slice(0, 1)
    : page.examples.filter((e, i) => i === 0 || e.code.length <= MAX_EXAMPLE_CHARS).slice(0, PAGE_EXAMPLES);
  const shown = examples;
  if (shown.length) {
    out.push(`${hh} Example${shown.length > 1 ? 's' : ''}`, '');
    for (const e of shown) {
      if (shown.length > 1 || !opts.full) out.push(`${hhh} ${e.title}`, '');
      out.push('```ts', e.code, '```', '');
    }
    const more = page.examples.length - shown.length;
    if (more > 0 && !opts.full) out.push(`_${more} more example${more > 1 ? 's' : ''}: MCP \`get_examples("${page.name}")\`, or \`manifest.json\`._`, '');
  } else if (!opts.full || !page.examples.length) {
    out.push(`${hh} Example`, '', '```html', fallbackUsage(page), '```', '');
  }

  if (forms.length && !opts.full) {
    out.push(`${hh} Forms`, '');
    for (const c of forms) {
      const tag = tagOf(c);
      out.push(
        `\`${tag}\` is a form control. Bind its value with \`[(ngModel)]\`, \`formControlName\` or \`[formControl]\` — not with an input. Value type: \`${c.forms!.valueType}\`.${
          c.forms!.notes ? ' ' + c.forms!.notes : ''
        }`,
        ''
      );
    }
    out.push('React to changes with `(ngModelChange)` or the form control\'s `valueChanges`. `disabled` follows the form control when you use reactive forms.', '');
  }

  out.push(`${hh} API`, '');
  for (const c of page.classes) out.push(...renderClass(c, hhh), '');

  for (const s of page.services) out.push(...renderService(s, hhh), '');

  if (page.types.length) {
    out.push(`${hh} Types`, '', 'Exported from `' + PKG + '`.', '', '```ts');
    out.push(page.types.map((t) => t.text).join('\n\n'));
    out.push('```', '');
  }

  if (page.pitfalls.length) {
    out.push(`${hh} Pitfalls`, '');
    for (const p of page.pitfalls) out.push(`- ${p}`);
    out.push('');
  }
  if (page.a11yNotes) out.push(`${hh} Accessibility`, '', page.a11yNotes, '');

  if (!opts.full) out.push('---', '', `_Generated from the ${PKG}@${lib.version} source (Angular ${lib.angularMajor}). Do not edit by hand._`, '');
  return out.join('\n');
}

function renderClass(c: ComponentClassMeta, h: string): string[] {
  const out: string[] = [];
  const tag = tagOf(c);
  out.push(`${h} \`${tag}\` — ${c.className}${c.kind === 'directive' ? ' (directive)' : ''}`, '');
  if (c.kind === 'directive' && c.selector) out.push(`Apply as an attribute: \`${directiveUsage(c)}\`.`, '');
  if (c.exportAs) out.push(`Template reference: \`#ref="${c.exportAs}"\`.`, '');

  const { variants, states } = classifyVariants(c);
  const inputs = c.inputs.filter((i) => !i.internal);

  if (inputs.length) {
    out.push('| Input | Type | Default | Description |', '| --- | --- | --- | --- |');
    for (const i of inputs) {
      out.push(
        `| \`${bindingName(i)}\`${i.required ? ' **(required)**' : ''} | \`${esc(i.type)}\` | ${i.default ? `\`${esc(i.default)}\`` : '—'} | ${esc(i.description ?? '')} |`
      );
    }
    out.push('');
  } else {
    out.push('No inputs.', '');
  }

  if (c.outputs.length) {
    out.push('| Output | Payload | Description |', '| --- | --- | --- |');
    for (const o of c.outputs) out.push(`| \`(${o.alias ?? o.name})\` | \`${esc(o.type)}\` | ${esc(o.description ?? '')} |`);
    out.push('');
  }

  if (variants.length) {
    const v0 = variants[0];
    const sample = v0.options.find((o) => o !== v0.default) ?? v0.options[0];
    out.push(`Variants — set as a plain attribute (\`${v0.name}="${sample}"\`) or bind (\`[${v0.name}]="value"\`):`, '');
    for (const v of variants) out.push(`- \`${v.name}\`: ${v.options.map((o) => `\`${o}\``).join(' · ')}${v.default ? ` (default \`${v.default}\`)` : ''}`);
    out.push('');
  }
  if (states.length) {
    out.push(
      `Styling states set by the component itself — **not inputs, do not bind them**: ${states.map((s) => `\`${s.name}\``).join(', ')}.${
        c.forms ? ' They follow the bound form value.' : ''
      }`,
      ''
    );
  }

  const slots = c.slots.filter((s) => s.name !== '');
  if (c.slots.length) {
    const parts = c.slots.map((s) => (s.name === '' ? 'default content' : `\`${s.name}\``));
    out.push(`Content: ${parts.join(', ')}.${slots.length ? ' ' + slotHint(slots.map((s) => s.name)) : ''}`, '');
  }
  return out;
}

function renderService(s: ServiceMeta, h: string): string[] {
  const out = [`${h} ${s.className} (service)`, ''];
  if (s.description) out.push(s.description, '');
  const varName = s.className.charAt(0).toLowerCase() + s.className.slice(1).replace(/Service$/, '');
  out.push('```ts', `private ${varName} = inject(${s.className});`, '```', '');
  if (s.members.length) {
    out.push('| Member | Description |', '| --- | --- |');
    for (const m of s.members) out.push(`| \`${esc(m.signature)}\` | ${esc(m.description ?? '')} |`);
  }
  return out;
}

/**
 * A cva group is a variant when an input feeds it and it has real options. A
 * group no input feeds (checkbox `checked`, select `open`) is state the
 * component applies to itself; listing it beside variants is what made agents
 * write `[checked]="true"` on a form control. Boolean groups that do match an
 * input (button `busy`) are already in the inputs table.
 */
export function classifyVariants(c: ComponentClassMeta): { variants: VariantMeta[]; states: VariantMeta[] } {
  const inputs = new Map(c.inputs.map((i) => [bindingName(i), i]));
  const variants: VariantMeta[] = [];
  const states: VariantMeta[] = [];
  for (const v of c.variants) {
    const isBool = v.options.every((o) => o === 'true' || o === 'false');
    if (inputs.has(v.name) || c.inputs.some((i) => i.name === v.name)) {
      if (!isBool) variants.push(v);
    } else {
      states.push(v);
    }
  }
  return { variants, states };
}

export function bindingName(i: InputMeta): string {
  return i.alias ?? i.name;
}

function tagOf(c: ComponentClassMeta): string {
  if (!c.selector) return c.className;
  const first = c.selector.split(',')[0].trim();
  return first.startsWith('[') ? first : `<${first}>`;
}

function directiveUsage(c: ComponentClassMeta): string {
  const sel = c.selector!.split(',')[0].trim();
  const attr = sel.match(/\[([\w-]+)\]/)?.[1];
  const host = sel.replace(/\[[^\]]+\]/g, '').trim() || 'button';
  if (!attr) return `<${host} ${sel}>`;
  const main = c.inputs.find((i) => bindingName(i) === attr);
  const val = main ? (/string/.test(main.type) ? `${attr}="…"` : `[${attr}]="…"`) : attr;
  return `<${host} ${val}>…</${host}>`;
}

function slotHint(names: string[]): string {
  const attr = names.find((n) => /^\[[\w-]+\]$/.test(n));
  if (attr) {
    const a = attr.slice(1, -1);
    return `Named slots match an attribute on the projected element, e.g. \`<span ${a}>…</span>\`.`;
  }
  return 'Named slots match the projected element\'s selector.';
}

function fallbackUsage(page: Page): string {
  const c = page.classes.find((x) => x.kind === 'component') ?? page.classes[0];
  if (!c?.selector) return `<!-- see API below -->`;
  if (c.kind === 'directive') return directiveUsage(c);
  const tag = c.selector.split(',')[0].trim();
  const parts = page.classes.filter((x) => x !== c && x.selector && !x.selector.startsWith('[')).slice(0, 3);
  const inner = parts.map((p) => `  <${p.selector!.split(',')[0].trim()}>…</${p.selector!.split(',')[0].trim()}>`);
  return [`<${tag}>`, ...(inner.length ? inner : ['  …']), `</${tag}>`].join('\n');
}

/* --------------------------------- llms ----------------------------------- */

export function globalRules(lib: LibInfo): string[] {
  return [
    `1. **Imports.** Import every class from \`'${PKG}'\` and list it in the standalone component's \`imports\`. Parts are separate classes: \`<tolle-select-item>\` needs \`SelectItemComponent\`, not just \`SelectComponent\`. Never import from internal paths.`,
    '2. **Form controls bind with forms APIs.** Components marked "form control" take `[(ngModel)]` (import `FormsModule`), `formControlName` or `[formControl]` (import `ReactiveFormsModule`). They have no `[value]` / `[checked]` input for the bound value.',
    '3. **Labels are inputs.** Form controls take `label`, `hint` and `errorMessage` (checkbox and switch take an inline `label`). Show the error with `[error]="…"` — `[invalid]` on combobox, native select and the date/time pickers. Don\'t wrap a control in your own `<label>`; an `id` you set lands on the focusable element, so an outside `<label for="…">` also works.',
    '4. **Variants are string inputs.** `variant="outline" size="sm"` — the allowed values are listed per component. Anything listed as a "styling state" is set by the component; never bind it.',
    '5. **`class` merges, last wins.** Most components take a `class` input merged with tailwind-merge (Textarea calls it `className`; each page lists it when present). Use it for layout (`class="w-full"`), not to fight variants — pick the right variant instead.',
    '6. **Theme tokens, not raw colours.** Style with the preset tokens (`bg-primary`, `text-muted-foreground`, `border-border`, `bg-card`) so light/dark themes work.',
    '7. **Icons are Remix Icon classes.** `<i class="ri-add-line"></i>`. Components project icons through named slots documented on each page.',
    '8. **Imperative overlays use services.** Toasts: `ToastService.show()` plus one `<tolle-toaster>` in the app shell. Modals: `ModalService.open()`. Sheets and alert dialogs have services too — see their pages.',
    `9. **Setup (once per app).** \`npm i ${PKG}@^${lib.angularMajor}\` (or \`npx @tolle_/cli init\`), \`@import '${PKG}/theme.css';\` in global styles, \`presets: [require('${PKG}/preset')]\` in tailwind.config.js with \`'./node_modules/${PKG}/**/*.mjs'\` in \`content\`, and \`@import 'remixicon/fonts/remixicon.css';\`.`,
  ];
}

export function renderLlms(pages: Page[], lib: LibInfo, base: string): string {
  const out: string[] = [
    '# Tolle UI',
    '',
    `> Angular ${lib.angularMajor} component library (standalone components, Tailwind CSS, CSS-variable theming). Install from npm as \`${PKG}\` or copy the source with \`npx @tolle_/cli add <component>\`. This index is for ${PKG}@${lib.version}.`,
    '',
    '## How to use these docs',
    '',
    `- Before you write a Tolle component into a template, read its page: \`${base}docs/<name>.md\`. Each page has the import line, a compiled example, the full API, form binding, services and pitfalls.`,
    `- In a project that has ${PKG} installed, the same files ship at \`node_modules/${PKG}/registry/\` and match the installed version — prefer them to the website.`,
    '- MCP server: `npx -y @tolle_/mcp` exposes `list_components`, `search_components`, `get_component`, `get_examples` and `get_setup` over these files.',
    `- Everything in one file: [llms-full.txt](${base}llms-full.txt).`,
    '',
    '## Rules that apply to every component',
    '',
    ...globalRules(lib),
    '',
  ];

  const byCat = new Map<string, Page[]>();
  for (const p of pages) byCat.set(p.category, [...(byCat.get(p.category) ?? []), p]);
  out.push('## Components', '');
  for (const cat of [...byCat.keys()].sort((a, b) => catOrder(a) - catOrder(b) || a.localeCompare(b))) {
    out.push(`### ${CATEGORY_TITLES[cat] ?? titleCase(cat)}`, '');
    for (const p of byCat.get(cat)!) {
      const parts = p.items.length > 1 ? ` Parts: ${p.items.slice(1).map((i) => i.name).join(', ')}.` : '';
      const tags = [p.classes.some((c) => c.forms) ? 'form control' : '', p.services.length ? 'service' : ''].filter(Boolean);
      out.push(`- [${p.title}](${base}docs/${p.name}.md)${tags.length ? ` _(${tags.join(', ')})_` : ''}: ${p.description}${parts}`);
    }
    out.push('');
  }
  return out.join('\n');
}

export function renderLlmsFull(pages: Page[], lib: LibInfo): string {
  const out = [
    `# Tolle UI — full component reference (${PKG}@${lib.version}, Angular ${lib.angularMajor})`,
    '',
    'Every component page in one file, one example each. Per-component pages with more examples are under `docs/<name>.md`.',
    '',
    '## Rules that apply to every component',
    '',
    ...globalRules(lib),
    '',
  ];
  for (const p of pages) out.push(renderPage(p, lib, { full: true }));
  return out.join('\n');
}

/** Stub for a part, so `docs/select-item.md` still leads somewhere. */
export function renderPartStub(part: RegistryItem, page: Page): string {
  return `# ${part.title ?? titleCase(part.name)}\n\nPart of **${page.title}** — documented on [${page.name}.md](${page.name}.md), with the classes it is used alongside and a complete example.\n`;
}

const CATEGORY_TITLES: Record<string, string> = {
  forms: 'Forms',
  actions: 'Actions',
  layout: 'Layout',
  overlays: 'Overlays',
  navigation: 'Navigation',
  feedback: 'Feedback',
  data: 'Data & charts',
  'date-time': 'Date & time',
  media: 'Media',
  ai: 'AI & chat',
  utilities: 'Utilities',
  services: 'Services',
  components: 'Other',
};
const ORDER = ['forms', 'actions', 'layout', 'overlays', 'navigation', 'feedback', 'data', 'date-time', 'media', 'ai', 'utilities', 'services', 'components'];
const catOrder = (c: string) => (ORDER.indexOf(c) < 0 ? 99 : ORDER.indexOf(c));

/* -------------------------------- helpers --------------------------------- */

export function titleCase(slug: string): string {
  return slug.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/** Pipes break markdown tables. */
function esc(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n+/g, ' ');
}

function dedupe<T>(arr: T[], key: (t: T) => string): T[] {
  const seen = new Set<string>();
  return arr.filter((x) => (seen.has(key(x)) ? false : (seen.add(key(x)), true)));
}
