/**
 * The imperative half of the API: public root services (ToastService,
 * ModalService, …) and the exported types callers must construct or read
 * (Toast, Modal, ModalRef, ContextMenuItem, DateRange, …).
 *
 * Inputs alone don't tell an agent how to show a toast or open a modal — these
 * do. Uses the type checker only to name the type of an unannotated member
 * (`toasts$ = subject.asObservable()`), and prints it relative to its own file
 * so the result reads like source, not like `import("…").Observable<…>`.
 */
import {
  SourceFile,
  ClassDeclaration,
  Node,
  Scope,
  TypeFormatFlags,
  MethodDeclaration,
} from 'ts-morph';
import * as path from 'path';
import { ServiceMeta } from './types';

export interface TypeDecl {
  name: string;
  file: string;
  text: string;
}

const FORMAT = TypeFormatFlags.UseAliasDefinedOutsideCurrentScope | TypeFormatFlags.NoTruncation;

/* ------------------------------- type index ------------------------------- */

/**
 * Every exported interface / type alias / enum in the lib, plus a member
 * summary of every exported plain class (ModalRef, SheetRef) — but not
 * components, directives or services, which are documented on their own.
 */
export function buildTypeIndex(sourceFiles: SourceFile[], libDir: string): Map<string, TypeDecl> {
  const index = new Map<string, TypeDecl>();
  for (const sf of sourceFiles) {
    const file = path.relative(libDir, sf.getFilePath());
    if (file.endsWith('.spec.ts')) continue;
    for (const d of [...sf.getInterfaces(), ...sf.getTypeAliases(), ...sf.getEnums()]) {
      if (!d.isExported()) continue;
      // `XProps = VariantProps<typeof x>` aliases are already printed as unions.
      if (/VariantProps</.test(d.getText())) continue;
      index.set(d.getName(), { name: d.getName(), file, text: withDocs(d) });
    }
    for (const c of sf.getClasses()) {
      const name = c.getName();
      if (!name || !c.isExported() || c.getDecorators().length) continue;
      index.set(name, { name, file, text: classSummary(c) });
    }
  }
  return index;
}

/** Types named in `texts`, resolved transitively (so Modal pulls in ModalSize). */
export function referencedTypes(texts: string[], index: Map<string, TypeDecl>, exclude = new Set<string>()): TypeDecl[] {
  const found = new Map<string, TypeDecl>();
  const queue = [...texts];
  while (queue.length) {
    const t = queue.shift()!;
    for (const id of t.match(/\b[A-Z]\w*\b/g) ?? []) {
      if (found.has(id) || exclude.has(id)) continue;
      const decl = index.get(id);
      if (!decl) continue;
      found.set(id, decl);
      queue.push(decl.text);
    }
  }
  return [...found.values()];
}

/* -------------------------------- services -------------------------------- */

/**
 * Public root services: `@Injectable({ providedIn: 'root' })`, not tagged
 * `@internal`. Component-scoped coordination services (select.service) are
 * implementation details and are skipped by the providedIn rule.
 */
export function extractServices(sourceFiles: SourceFile[], libDir: string): ServiceMeta[] {
  const out: ServiceMeta[] = [];
  for (const sf of sourceFiles) {
    const file = path.relative(libDir, sf.getFilePath());
    if (file.endsWith('.spec.ts')) continue;
    for (const c of sf.getClasses()) {
      const dec = c.getDecorator('Injectable');
      if (!dec || !c.isExported()) continue;
      if (!/providedIn\s*:\s*['"]root['"]/.test(dec.getText())) continue;
      if (c.getJsDocs().some((d) => d.getTags().some((t) => t.getTagName() === 'internal'))) continue;
      out.push({
        className: c.getName()!,
        file,
        description: c.getJsDocs().at(-1)?.getDescription().trim() || undefined,
        members: publicMembers(c),
        types: [],
      });
    }
  }
  return out.sort((a, b) => a.className.localeCompare(b.className));
}

function isPublic(n: { getScope(): Scope | undefined; getName(): string }): boolean {
  const scope = n.getScope();
  return (scope === undefined || scope === Scope.Public) && !n.getName().startsWith('_') && !n.getName().startsWith('#');
}

const LIFECYCLE = /^ng(OnInit|OnDestroy|OnChanges|AfterViewInit|AfterContentInit|DoCheck|AfterViewChecked|AfterContentChecked)$/;

function publicMembers(c: ClassDeclaration): ServiceMeta['members'] {
  const members: ServiceMeta['members'] = [];
  for (const m of c.getMethods()) {
    if (!isPublic(m) || LIFECYCLE.test(m.getName()) || m.isStatic()) continue;
    members.push(clean({ name: m.getName(), signature: methodSignature(m), description: doc(m) }));
  }
  for (const p of c.getProperties()) {
    if (!isPublic(p) || p.isStatic()) continue;
    if (p.getDecorators().length) continue;
    const type = p.getTypeNode()?.getText() ?? p.getType().getText(p, FORMAT);
    const ro = p.isReadonly() ? 'readonly ' : '';
    members.push(clean({ name: p.getName(), signature: `${ro}${p.getName()}: ${type}`, description: doc(p) }));
  }
  // `constructor(public modal: Modal)` — a property the AST lists as a parameter.
  for (const p of c.getConstructors()[0]?.getParameters() ?? []) {
    if (!p.isParameterProperty()) continue;
    const scope = p.getScope();
    if (scope === Scope.Private || scope === Scope.Protected) continue;
    const type = p.getTypeNode()?.getText() ?? p.getType().getText(p, FORMAT);
    const ro = p.isReadonly() ? 'readonly ' : '';
    members.push({ name: p.getName(), signature: `${ro}${p.getName()}: ${type}` });
  }
  for (const g of c.getGetAccessors()) {
    if (!isPublic(g)) continue;
    const type = g.getReturnTypeNode()?.getText() ?? g.getReturnType().getText(g, FORMAT);
    members.push(clean({ name: g.getName(), signature: `get ${g.getName()}: ${type}`, description: doc(g) }));
  }
  return members;
}

function methodSignature(m: MethodDeclaration): string {
  const tps = m.getTypeParameters().map((t) => t.getText());
  const params = m
    .getParameters()
    .map((p) => {
      const t = p.getTypeNode()?.getText() ?? p.getType().getText(p, FORMAT);
      const opt = p.isOptional() || p.hasInitializer() ? '?' : '';
      return `${p.isRestParameter() ? '...' : ''}${p.getName()}${opt}: ${t}`;
    })
    .join(', ');
  const ret = m.getReturnTypeNode()?.getText() ?? m.getReturnType().getText(m, FORMAT);
  return `${m.getName()}${tps.length ? `<${tps.join(', ')}>` : ''}(${params}): ${ret}`;
}

/** `class ModalRef<R> { close(result?: R): void; … }` — signatures only. */
function classSummary(c: ClassDeclaration): string {
  const tps = c.getTypeParameters().map((t) => t.getText());
  const head = `class ${c.getName()}${tps.length ? `<${tps.join(', ')}>` : ''}`;
  const lines = publicMembers(c).map(
    (m) => `${m.description ? `  /** ${m.description.replace(/\s+/g, ' ')} */\n` : ''}  ${m.signature};`
  );
  const jsdoc = c.getJsDocs().at(-1)?.getDescription().trim();
  return `${jsdoc ? `/** ${jsdoc} */\n` : ''}${head} {\n${lines.join('\n')}\n}`;
}

function doc(n: Node): string | undefined {
  if (!Node.isJSDocable(n)) return undefined;
  const d = n.getJsDocs().at(-1)?.getDescription().trim();
  return d || undefined;
}

/** Declaration text with its leading JSDoc, minus line comments that only narrate internals. */
function withDocs(d: Node): string {
  const docs = Node.isJSDocable(d) ? d.getJsDocs().map((j) => j.getText()).join('\n') : '';
  let text = d.getText();
  if (docs && text.startsWith(docs)) text = text.slice(docs.length).trimStart();
  text = text.replace(/^export\s+/, '');
  return docs ? `${docs}\n${text}` : text;
}

function clean<T extends Record<string, any>>(obj: T): T {
  for (const k of Object.keys(obj)) if (obj[k] === undefined) delete obj[k];
  return obj;
}
