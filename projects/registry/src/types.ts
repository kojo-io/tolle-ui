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
  name: string;
  /** Resolved type text — a clean literal union where derivable, else the written type. */
  type: string;
  /** Default value text, from the initializer, backing field, or a `@default` JSDoc tag. */
  default?: string;
  /** Leading JSDoc description. */
  description?: string;
  /** True for `@Input({ required: true })`. */
  required?: boolean;
}

/** A component `@Output()`. */
export interface OutputMeta {
  name: string;
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

/** Optional, author-provided metadata that can't be inferred from source. */
export interface RegistrySidecar {
  title?: string;
  description?: string;
  category?: string;
  a11yNotes?: string;
  examples?: { title: string; code: string }[];
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
  examples?: { title: string; code: string }[];
  a11yNotes?: string;
  components: ComponentClassMeta[];
  dependencies: Dependencies;
}
