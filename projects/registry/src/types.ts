/**
 * Canonical metadata schema for the Tolle UI registry.
 *
 * Every downstream artifact — the shadcn-style registry index, the CLI copy
 * payloads, the docs API tables, llms.txt, and the MCP manifest — is derived
 * from these shapes. The single source of truth is the component source under
 * `projects/tolle/src/lib/**` (see `projects/tolle/CONTRIBUTING.md`).
 */

/** A `cva` variant group, e.g. `variant: ['default','outline']`. */
export interface VariantMeta {
  /** Group name, e.g. 'variant' | 'size'. */
  name: string;
  /** Allowed values, e.g. ['default','outline']. */
  options: string[];
  /** Default from the cva `defaultVariants`, if declared. */
  default?: string;
}

/** A component `@Input()` (property- or setter-style). */
export interface InputMeta {
  /** Class property name. Consumers bind `alias` when it is set. */
  name: string;
  /**
   * Template binding name when it differs from the property, e.g.
   * `@Input('tolleTooltip') content` → alias 'tolleTooltip'. This is what a
   * consumer actually writes, so every agent/docs artifact prints it.
   */
  alias?: string;
  /** Resolved type text — a clean literal union where derivable, else the written type. */
  type: string;
  /** Default value text, from the initializer, backing field, or a `@default` JSDoc tag. */
  default?: string;
  /** Leading JSDoc description. */
  description?: string;
  /** True for `@Input({ required: true })`. */
  required?: boolean;
  /**
   * `@internal` JSDoc tag: the parent component sets it (select-item `active`).
   * Still in the docs-app tables; left out of agent docs so agents don't bind it.
   */
  internal?: boolean;
}

/** A component `@Output()`. */
export interface OutputMeta {
  name: string;
  /** Template event name when it differs from the property (`@Output('x')`). */
  alias?: string;
  /** Event payload type, e.g. 'void' | 'boolean' | 'MouseEvent'. */
  type: string;
  description?: string;
}

/** A content-projection slot: `''` = default `<ng-content>`, else the `select` value. */
export interface SlotMeta {
  name: string;
  description?: string;
}

/** One exported component/directive class within a file. */
export interface ComponentClassMeta {
  className: string;
  selector?: string;
  kind: 'component' | 'directive';
  inputs: InputMeta[];
  outputs: OutputMeta[];
  slots: SlotMeta[];
  variants: VariantMeta[];
  /**
   * Set when the class is a form control (implements `writeValue`, i.e. a
   * ControlValueAccessor). Its value is bound with `[(ngModel)]` /
   * `formControlName`, not with an input.
   */
  forms?: FormsMeta;
  /** `exportAs` name, for `#ref="name"` template references. */
  exportAs?: string;
  /**
   * `@internal` on the class: a building block other components use
   * (form-control label). Still a registry item so the CLI copies it; left out
   * of the agent docs.
   */
  internal?: boolean;
}

export interface FormsMeta {
  /** Type the control reads and writes, from the `writeValue` parameter. */
  valueType: string;
  /** Extra guidance from the sidecar, e.g. what the value holds. */
  notes?: string;
}

/** A public root service (e.g. ToastService) — the imperative half of a component's API. */
export interface ServiceMeta {
  className: string;
  /** Lib-relative file, e.g. 'toast.service.ts'. */
  file: string;
  description?: string;
  /** Public methods and properties, as one-line signatures. */
  members: { name: string; signature: string; description?: string }[];
  /** Supporting exported types (config objects, refs) a caller must construct or read. */
  types: { name: string; text: string }[];
}

/** One usage example. Docs-app examples compile in CI, so they are preferred. */
export interface ExampleMeta {
  title: string;
  code: string;
  /** Where it came from: a docs-app example path, or 'sidecar'. */
  source: string;
}

/** Resolved dependencies of a registry item, used by the CLI to copy/install. */
export interface Dependencies {
  /** Sibling registry item slugs this file imports, e.g. ['toggle']. */
  internal: string[];
  /** Whether it imports the `cn` util. */
  usesCn: boolean;
  /** Internal service/support files (module basename), e.g. ['select.service']. */
  services: string[];
  /** External npm packages → version range (from the workspace package.json). */
  npm: Record<string, string>;
  /** Angular package specifiers, e.g. ['@angular/forms','@angular/cdk/overlay']. */
  angular: string[];
}

/**
 * Optional, author-provided metadata that can't be inferred from source.
 * Lives in `<name>.registry.ts` next to the component; see CONTRIBUTING.md.
 */
export interface RegistrySidecar {
  title?: string;
  /** One or two sentences: what it is. Replaces the generated placeholder. */
  description?: string;
  category?: string;
  /** When an agent should reach for this component. */
  whenToUse?: string;
  /** Nearby components and when to pick them instead. */
  alternatives?: { name: string; when: string }[];
  /** Mistakes agents and people actually make with this component. */
  pitfalls?: string[];
  a11yNotes?: string;
  /**
   * Other registry items that only make sense inside this one
   * (e.g. select → ['select-item', 'select-group']). They are documented on
   * this item's page instead of as separate components.
   */
  parts?: string[];
  /** Per-class form-control notes, keyed by class name. */
  forms?: Record<string, { valueType?: string; notes?: string }>;
  /**
   * Hand-written examples. Prefer a docs-app example under
   * `projects/docs/src/app/docs-examples/<name>/` — those are type-checked.
   */
  examples?: { title: string; code: string }[];
  /** Extra search terms, e.g. ['dropdown', 'picker'] for select. */
  keywords?: string[];
  /** Force-add registry item dependencies the AST can't see. */
  registryDependencies?: string[];
}

/** A registry item = one source file and everything derived from it. */
export interface RegistryItem {
  /** Slug, e.g. 'button' | 'tabs'. */
  name: string;
  /** Source path relative to the lib root, e.g. 'button.component.ts'. */
  file: string;
  /** Primary selector, e.g. 'tolle-button'. */
  selector?: string;
  title?: string;
  description?: string;
  category?: string;
  /**
   * Set by a `@new` JSDoc tag on the component class. Surfaces a "New" badge in
   * the docs sidebar, the components index and the component page hero.
   * Remove the tag when the component is no longer newly released.
   */
  isNew?: boolean;
  examples?: ExampleMeta[];
  a11yNotes?: string;
  whenToUse?: string;
  alternatives?: { name: string; when: string }[];
  pitfalls?: string[];
  keywords?: string[];
  /** Items documented on this page (see RegistrySidecar.parts). */
  parts?: string[];
  /** Set on a part: the item whose page documents it. */
  parent?: string;
  /** Public root services that drive this component imperatively. */
  services?: ServiceMeta[];
  components: ComponentClassMeta[];
  dependencies: Dependencies;
}
