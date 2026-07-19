import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PropEntry } from './types';

/**
 * Reads the source-generated registry (`/registry/docs-content.json`, produced by
 * `npm run generate:registry`) so docs pages render API tables straight from the
 * component source instead of hand-written arrays that drift.
 *
 * Usage in a docs page:
 *   registry = inject(RegistryDocsService);
 *   alertProps  = computed(() => this.registry.inputs('alert'));
 *   alertOutputs = computed(() => this.registry.outputs('alert'));
 * Then bind `[props]="alertProps()"`.
 */
interface RegComponent {
  name: string;
  selector?: string;
  kind: string;
  inputs: { name: string; type: string; default?: string; description?: string; required?: boolean }[];
  outputs: { name: string; type: string; description?: string }[];
  slots: { name: string; description?: string }[];
  variants: { name: string; options: string[]; default?: string }[];
}
interface RegItem {
  category: string;
  title: string;
  selector?: string;
  /** Set from a `@new` JSDoc tag on the component source. Drives the "New" badge. */
  isNew?: boolean;
  import: string;
  install: string;
  components: RegComponent[];
}
type DocsContent = Record<string, RegItem>;

@Injectable({ providedIn: 'root' })
export class RegistryDocsService {
  private http = inject(HttpClient);
  private data = signal<DocsContent | null>(null);

  constructor() {
    // Relative URL resolves against <base href>, so it works under a subpath deploy.
    this.http.get<DocsContent>('registry/docs-content.json').subscribe({
      next: (d) => this.data.set(d ?? {}),
      error: () => this.data.set({}),
    });
  }

  /** The registry entry for a component slug, e.g. 'alert'. */
  item(slug: string): RegItem | undefined {
    return this.data()?.[slug];
  }

  private component(slug: string, className?: string): RegComponent | undefined {
    const it = this.item(slug);
    if (!it) return undefined;
    if (className) return it.components.find((c) => c.name === className);
    return it.components.find((c) => c.selector === it.selector) ?? it.components[0];
  }

  /** Inputs as PropEntry rows for `app-prop-table`. Required inputs are marked with `*`. */
  inputs(slug: string, className?: string): PropEntry[] {
    return (this.component(slug, className)?.inputs ?? []).map((i) => ({
      name: i.required ? `${i.name} *` : i.name,
      type: i.type,
      default: i.default,
      description: i.description ?? '',
    }));
  }

  /** Outputs as PropEntry rows (payload type shown as `EventEmitter<T>`). */
  outputs(slug: string, className?: string): PropEntry[] {
    return (this.component(slug, className)?.outputs ?? []).map((o) => ({
      name: o.name,
      type: `EventEmitter<${o.type}>`,
      description: o.description ?? '',
    }));
  }
}
