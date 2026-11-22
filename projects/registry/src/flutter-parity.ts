/**
 * Flutter parity emitter.
 *
 * The registry already knows every input, output, slot and variant in the
 * Angular library. That makes it the natural place to define what "the same
 * component" means across two frameworks, so `flutter-parity.json` is emitted
 * as a framework-neutral contract: the Flutter port implements against this
 * file, and `tools/check-flutter-parity.ts` fails the build when the two sides
 * drift apart.
 *
 * Naming is mechanical on purpose. `tolle-button` becomes `TolleButton` with no
 * per-component judgement calls, so a reviewer never has to remember which name
 * a component was given on the other side.
 */
import * as fs from 'fs';
import * as path from 'path';
import { RegistryItem, ComponentClassMeta, InputMeta, OutputMeta } from './types';
// Shared with the registry index so both artifacts agree on where a component
// belongs. Categories are inferred from the name, not declared in source, so
// re-deriving them here would let the two drift.
import { categorize } from './emit';

/** One parameter of a ported component. */
export interface ParityParam {
  /** Canonical name, shared across both frameworks. */
  name: string;
  /** The type as written in the Angular source. */
  angularType: string;
  /** Suggested Dart type. A hint for the implementer, not a guarantee. */
  dartType: string;
  default?: string;
  required?: boolean;
  description?: string;
}

/** One class within a ported component. */
export interface ParityClass {
  angularClass: string;
  dartClass: string;
  selector?: string;
  kind: 'component' | 'directive';
  inputs: ParityParam[];
  outputs: ParityParam[];
  slots: { name: string; dartParam: string; description?: string }[];
  variants: { name: string; options: string[]; default?: string; dartEnum: string }[];
}

export interface ParityItem {
  name: string;
  category?: string;
  title?: string;
  description?: string;
  classes: ParityClass[];
}

export interface ParityContract {
  /** Bumped when the shape of this file changes, not when components change. */
  schemaVersion: 1;
  generatedFrom: string;
  itemCount: number;
  items: ParityItem[];
}

/* ------------------------------- naming ----------------------------------- */

const pascal = (s: string) =>
  s
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');

const camel = (s: string) => {
  const p = pascal(s);
  return p[0].toLowerCase() + p.slice(1);
};

/**
 * The Dart class name for one Angular class.
 *
 * Derived from the selector where there is one (`tolle-button` → `TolleButton`),
 * because the selector is the name consumers actually type. Falls back to the
 * class name with the Angular suffix stripped and the prefix applied, which
 * covers directives whose selector is an attribute.
 */
export function dartClassName(cls: ComponentClassMeta, itemName: string): string {
  const sel = cls.selector?.trim();
  if (sel && /^[a-z][a-z0-9-]*$/.test(sel)) return pascal(sel);

  const attr = sel?.match(/^\[([a-zA-Z][a-zA-Z0-9]*)\]$/)?.[1];
  if (attr) return pascal(attr.replace(/^tolle/i, 'tolle-'));

  const stripped = cls.className.replace(/(Component|Directive)$/, '');
  return /^Tolle/.test(stripped) ? stripped : `Tolle${stripped || pascal(itemName)}`;
}

/* ---------------------------- type mapping -------------------------------- */

/**
 * Suggests a Dart type for an Angular one.
 *
 * Heuristic by design: it covers the shapes that actually appear in this
 * library and leaves anything else as the original text, flagged for a human.
 * A wrong guess is visible in review; a silently-invented type would not be.
 */
export function toDartType(tsType: string | undefined, memberName = ''): string {
  if (!tsType) return 'dynamic';
  const t = tsType.trim().replace(/\s+/g, ' ');

  // A union of string literals is an enum on the Dart side.
  const literals = t.match(/^(?:'[^']*'\s*\|\s*)+'[^']*'$/);
  if (literals) return `enum:${pascal(memberName || 'value')}`;

  const nullable = /\|\s*(null|undefined)\b/.test(t);
  const core = t.replace(/\s*\|\s*(null|undefined)\b/g, '').trim();

  const arr = core.match(/^(.*)\[\]$/) || core.match(/^Array<(.*)>$/);
  if (arr) return `List<${toDartType(arr[1])}>${nullable ? '?' : ''}`;

  const base = ((): string => {
    switch (core) {
      case 'string':
        return 'String';
      case 'number':
        return 'double';
      case 'boolean':
        return 'bool';
      case 'Date':
        return 'DateTime';
      case 'void':
        return 'void';
      case 'any':
      case 'unknown':
        return 'dynamic';
      case 'TemplateRef':
      case 'TemplateRef<any>':
        return 'WidgetBuilder';
      case 'MouseEvent':
      case 'KeyboardEvent':
      case 'FocusEvent':
      case 'Event':
        // The DOM event object has no Flutter counterpart; ported callbacks
        // carry the payload the component actually needs, or nothing.
        return 'void';
      default:
        return core;
    }
  })();

  return nullable && base !== 'dynamic' && base !== 'void' ? `${base}?` : base;
}

const inputToParam = (i: InputMeta): ParityParam => ({
  name: i.name,
  angularType: i.type,
  dartType: toDartType(i.type, i.name),
  default: i.default,
  required: i.required,
  description: i.description,
});

/**
 * Outputs become callbacks. A void payload is a `VoidCallback`; anything else
 * is a `ValueChanged` of the mapped type.
 */
const outputToParam = (o: OutputMeta): ParityParam => {
  const payload = toDartType(o.type, o.name);
  const dartType =
    payload === 'void' || payload === 'dynamic'
      ? 'VoidCallback?'
      : `ValueChanged<${payload.replace(/\?$/, '')}>?`;
  return {
    name: o.name,
    angularType: o.type,
    dartType,
    description: o.description,
  };
};

/* ------------------------------- emitter ---------------------------------- */

export function buildContract(items: RegistryItem[]): ParityContract {
  return {
    schemaVersion: 1,
    generatedFrom: 'projects/tolle/src/lib',
    itemCount: items.length,
    items: items.map((item) => ({
      name: item.name,
      category: item.category ?? categorize(item.name),
      title: item.title,
      description: item.description,
      classes: item.components.map((cls) => ({
        angularClass: cls.className,
        dartClass: dartClassName(cls, item.name),
        selector: cls.selector,
        kind: cls.kind,
        inputs: cls.inputs.map(inputToParam),
        outputs: cls.outputs.map(outputToParam),
        slots: cls.slots.map((s) => ({
          name: s.name,
          // The default <ng-content> slot is the Flutter `child`; named slots
          // become their own widget parameters.
          dartParam: s.name === '' ? 'child' : camel(s.name),
          description: s.description,
        })),
        variants: cls.variants.map((v) => ({
          name: v.name,
          options: v.options,
          default: v.default,
          dartEnum: `${dartClassName(cls, item.name)}${pascal(v.name)}`,
        })),
      })),
    })),
  };
}

export function emitFlutterParity(items: RegistryItem[], outDir: string): ParityContract {
  const contract = buildContract(items);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'flutter-parity.json'),
    JSON.stringify(contract, null, 2) + '\n'
  );
  return contract;
}
