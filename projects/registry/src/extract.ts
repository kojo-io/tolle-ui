/**
 * AST extraction for the Tolle UI registry generator.
 *
 * Pure ts-morph AST walking — no type checker. Variant unions are resolved by
 * mapping an input type like `ButtonProps['variant']` back to the keys of the
 * `cva()` call in the same file (via its `VariantProps<typeof x>` alias). This
 * is deterministic and avoids the noisy fully-qualified types the checker emits.
 */
import {
  SourceFile,
  ClassDeclaration,
  Node,
  SyntaxKind,
  ObjectLiteralExpression,
  Decorator,
  JSDocableNode,
} from 'ts-morph';
import * as path from 'path';
import {
  RegistryItem,
  ComponentClassMeta,
  InputMeta,
  OutputMeta,
  SlotMeta,
  VariantMeta,
  Dependencies,
} from './types';

const unquote = (s: string) => s.replace(/^['"`]|['"`]$/g, '');

/** Extract one registry item from a source file, or null if it declares no component/directive. */
export function extractItem(sf: SourceFile, versions: Record<string, string>): RegistryItem | null {
  const cvaGroups = parseCvaDecls(sf);
  const aliasToCva = parseVariantPropsAliases(sf);

  const components: ComponentClassMeta[] = [];
  for (const clazz of sf.getClasses()) {
    const meta = extractClass(clazz, cvaGroups, aliasToCva);
    if (meta) components.push(meta);
  }
  if (components.length === 0) return null;

  const file = path.basename(sf.getFilePath());
  const name = file.replace(/\.(component|directive)\.ts$/, '').replace(/\.ts$/, '');

  // Primary = the class whose selector is exactly `tolle-<slug>`, else the first.
  const primary =
    components.find((c) => c.selector === `tolle-${name}`) ?? components[0];

  return {
    name,
    file,
    selector: primary.selector,
    components,
    dependencies: classifyDeps(sf, name, versions),
  };
}

function extractClass(
  clazz: ClassDeclaration,
  cvaGroups: Map<string, VariantMeta[]>,
  aliasToCva: Map<string, string>
): ComponentClassMeta | null {
  const dec = clazz.getDecorator('Component') ?? clazz.getDecorator('Directive');
  if (!dec) return null;
  const kind = clazz.getDecorator('Component') ? 'component' : 'directive';
  const arg = getDecoratorObject(dec);

  const selector = arg ? getStringProp(arg, 'selector') : undefined;
  const template = arg ? getRawProp(arg, 'template') : undefined;

  // Variants owned by this class: any cva referenced by its inputs' Props alias.
  const usedCva = new Set<string>();
  const inputs = extractInputs(clazz, cvaGroups, aliasToCva, usedCva);
  const variants: VariantMeta[] = [];
  for (const cvaName of usedCva) {
    for (const g of cvaGroups.get(cvaName) ?? []) variants.push(g);
  }

  return {
    className: clazz.getName() ?? 'Anonymous',
    selector,
    kind,
    inputs,
    outputs: extractOutputs(clazz),
    slots: template ? extractSlots(template) : [],
    variants: dedupeVariants(variants),
  };
}

/* --------------------------------- inputs --------------------------------- */

function extractInputs(
  clazz: ClassDeclaration,
  cvaGroups: Map<string, VariantMeta[]>,
  aliasToCva: Map<string, string>,
  usedCva: Set<string>
): InputMeta[] {
  const inputs: InputMeta[] = [];

  for (const p of clazz.getProperties()) {
    const dec = p.getDecorator('Input');
    if (!dec) continue;
    const typeNode = p.getTypeNode()?.getText();
    const written = typeNode ?? inferTypeFromInitializer(p.getInitializer());
    const { type, cva } = resolveType(written, aliasToCva, cvaGroups);
    if (cva) usedCva.add(cva);
    const js = getJsDoc(p);
    inputs.push(clean({
      name: p.getName(),
      type,
      default: p.getInitializer()?.getText() ?? js.defaultTag,
      description: js.description,
      required: isRequired(dec),
    }));
  }

  // Setter-style inputs: `@Input() set pressed(v: boolean) {}` with backing `_pressed`.
  for (const acc of clazz.getSetAccessors()) {
    const dec = acc.getDecorator('Input');
    if (!dec) continue;
    const name = acc.getName();
    const written = acc.getParameters()[0]?.getTypeNode()?.getText() ?? 'any';
    const { type, cva } = resolveType(written, aliasToCva, cvaGroups);
    if (cva) usedCva.add(cva);
    const backing =
      clazz.getProperty(`_${name}`)?.getInitializer()?.getText() ??
      clazz.getProperty(name)?.getInitializer()?.getText();
    const js = getJsDoc(acc);
    inputs.push(clean({
      name,
      type,
      default: backing ?? js.defaultTag,
      description: js.description,
      required: isRequired(dec),
    }));
  }

  return inputs;
}

/** Resolve `AliasName['group']` → the cva group's literal union; else the written text. */
function resolveType(
  written: string,
  aliasToCva: Map<string, string>,
  cvaGroups: Map<string, VariantMeta[]>
): { type: string; cva?: string } {
  const m = written.match(/^(\w+)\[\s*['"](\w+)['"]\s*\]$/);
  if (m) {
    const cva = aliasToCva.get(m[1]);
    const group = cva && (cvaGroups.get(cva) ?? []).find((g) => g.name === m[2]);
    if (cva && group) {
      return { type: group.options.map((o) => `'${o}'`).join(' | '), cva };
    }
  }
  return { type: written.trim() };
}

function inferTypeFromInitializer(init?: Node): string {
  if (!init) return 'any';
  switch (init.getKind()) {
    case SyntaxKind.TrueKeyword:
    case SyntaxKind.FalseKeyword:
      return 'boolean';
    case SyntaxKind.StringLiteral:
    case SyntaxKind.NoSubstitutionTemplateLiteral:
      return 'string';
    case SyntaxKind.NumericLiteral:
      return 'number';
    case SyntaxKind.ArrayLiteralExpression:
      return 'any[]';
    default:
      return 'any';
  }
}

/* --------------------------------- outputs -------------------------------- */

function extractOutputs(clazz: ClassDeclaration): OutputMeta[] {
  const outputs: OutputMeta[] = [];
  for (const p of clazz.getProperties()) {
    if (!p.getDecorator('Output')) continue;
    let type = 'void';
    const init = p.getInitializer();
    if (init && Node.isNewExpression(init)) {
      const targ = init.getTypeArguments()[0];
      if (targ) type = targ.getText();
    }
    const js = getJsDoc(p);
    outputs.push(clean({ name: p.getName(), type, description: js.description }));
  }
  return outputs;
}

/* ---------------------------------- slots --------------------------------- */

function extractSlots(template: string): SlotMeta[] {
  const slots: SlotMeta[] = [];
  const seen = new Set<string>();
  const re = /<ng-content([^>]*)>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(template))) {
    const sel = m[1].match(/select\s*=\s*["']([^"']+)["']/);
    const nm = sel ? sel[1] : '';
    if (!seen.has(nm)) {
      seen.add(nm);
      slots.push({ name: nm });
    }
  }
  return slots;
}

/* --------------------------------- cva ------------------------------------ */

/** name of each `const x = cva(...)` → its variant groups. */
function parseCvaDecls(sf: SourceFile): Map<string, VariantMeta[]> {
  const map = new Map<string, VariantMeta[]>();
  for (const v of sf.getVariableDeclarations()) {
    const init = v.getInitializer();
    if (!init || !Node.isCallExpression(init)) continue;
    if (init.getExpression().getText() !== 'cva') continue;

    const config = init.getArguments()[1]?.asKind(SyntaxKind.ObjectLiteralExpression);
    const groups: VariantMeta[] = [];
    const variantsObj = config && getObjectProp(config, 'variants');
    const defaultsObj = config && getObjectProp(config, 'defaultVariants');
    if (variantsObj) {
      for (const gp of variantsObj.getProperties()) {
        if (!Node.isPropertyAssignment(gp)) continue;
        const gname = unquote(gp.getName());
        const gobj = gp.getInitializer()?.asKind(SyntaxKind.ObjectLiteralExpression);
        const options = gobj
          ? gobj
              .getProperties()
              .filter(Node.isPropertyAssignment)
              .map((o) => unquote(o.getName()))
          : [];
        let def: string | undefined;
        if (defaultsObj) {
          const dp = defaultsObj.getProperty(gname);
          if (dp && Node.isPropertyAssignment(dp)) def = unquote(dp.getInitializer()?.getText() ?? '');
        }
        groups.push({ name: gname, options, default: def || undefined });
      }
    }
    map.set(v.getName(), groups);
  }
  return map;
}

/** `type XProps = VariantProps<typeof xVariants>` → { XProps: 'xVariants' }. */
function parseVariantPropsAliases(sf: SourceFile): Map<string, string> {
  const map = new Map<string, string>();
  for (const ta of sf.getTypeAliases()) {
    const m = (ta.getTypeNode()?.getText() ?? '').match(/VariantProps<\s*typeof\s+(\w+)\s*>/);
    if (m) map.set(ta.getName(), m[1]);
  }
  return map;
}

/* ------------------------------ dependencies ------------------------------ */

/** Module-basename slug for any lib file, e.g. 'button.component.ts' → 'button'. */
export function slugOf(fileNameOrPath: string): string {
  return path
    .basename(fileNameOrPath)
    .replace(/\.(component|directive)\.ts$/, '')
    .replace(/\.ts$/, '');
}

export function classifyDeps(sf: SourceFile, self: string, versions: Record<string, string>): Dependencies {
  const deps: Dependencies = { internal: [], usesCn: false, services: [], npm: {}, angular: [] };
  for (const imp of sf.getImportDeclarations()) {
    const spec = imp.getModuleSpecifierValue();
    if (spec.startsWith('.')) {
      const rel = spec.replace(/^\.\//, '').replace(/^\.\.\//, '');
      if (rel.startsWith('utils/')) {
        if (rel === 'utils/cn') deps.usesCn = true;
        continue;
      }
      // Keep the full module basename (e.g. 'toggle.component', 'modal', 'select.service')
      // so files that differ only by suffix (modal.ts vs modal.component.ts) stay distinct.
      const base = rel.split('/').pop()!;
      if (base === self) continue;
      if (base.endsWith('.service')) push(deps.services, base);
      else push(deps.internal, base);
    } else if (spec.startsWith('@angular/')) {
      push(deps.angular, spec);
    } else {
      const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      deps.npm[pkg] = versions[pkg] ?? '*';
    }
  }
  return deps;
}

/* -------------------------------- helpers --------------------------------- */

function getDecoratorObject(dec: Decorator): ObjectLiteralExpression | undefined {
  return dec.getArguments()[0]?.asKind(SyntaxKind.ObjectLiteralExpression);
}

function getStringProp(obj: ObjectLiteralExpression, name: string): string | undefined {
  const p = obj.getProperty(name);
  if (p && Node.isPropertyAssignment(p)) return unquote(p.getInitializer()?.getText() ?? '');
  return undefined;
}

/** Raw initializer text (keeps backticks/quotes) — used for template scanning. */
function getRawProp(obj: ObjectLiteralExpression, name: string): string | undefined {
  const p = obj.getProperty(name);
  if (p && Node.isPropertyAssignment(p)) return p.getInitializer()?.getText();
  return undefined;
}

function getObjectProp(obj: ObjectLiteralExpression, name: string): ObjectLiteralExpression | undefined {
  const p = obj.getProperty(name);
  if (p && Node.isPropertyAssignment(p)) return p.getInitializer()?.asKind(SyntaxKind.ObjectLiteralExpression);
  return undefined;
}

function isRequired(dec: Decorator): boolean {
  const arg = dec.getArguments()[0]?.asKind(SyntaxKind.ObjectLiteralExpression);
  const p = arg?.getProperty('required');
  return !!(p && Node.isPropertyAssignment(p) && p.getInitializer()?.getText() === 'true');
}

function getJsDoc(node: JSDocableNode): { description?: string; defaultTag?: string } {
  const docs = node.getJsDocs();
  if (!docs.length) return {};
  const doc = docs[docs.length - 1];
  let defaultTag: string | undefined;
  for (const tag of doc.getTags()) {
    if (tag.getTagName() === 'default') defaultTag = unquote((tag.getCommentText() ?? '').trim());
  }
  const description = doc.getDescription().trim();
  return { description: description || undefined, defaultTag };
}

function dedupeVariants(variants: VariantMeta[]): VariantMeta[] {
  const seen = new Set<string>();
  return variants.filter((v) => (seen.has(v.name) ? false : (seen.add(v.name), true)));
}

function push(arr: string[], v: string) {
  if (!arr.includes(v)) arr.push(v);
}

/** Drop undefined fields so JSON output stays compact. */
function clean<T extends Record<string, any>>(obj: T): T {
  for (const k of Object.keys(obj)) if (obj[k] === undefined) delete obj[k];
  return obj;
}
