import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RegistryDocsService } from '../registry-docs.service';

/**
 * Modern, consistent docs page header. Pulls title/description/category/selector/
 * install straight from the generated registry via `slug`, with optional overrides.
 *
 *   <app-doc-hero slug="badge" id="overview" />
 */
@Component({
  selector: 'app-doc-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="mb-10">
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <a routerLink="/components" class="transition-colors hover:text-foreground hover:no-underline">Components</a>
        <i class="ri-arrow-right-s-line text-base" aria-hidden="true"></i>
        <span class="font-medium text-foreground">{{ resolvedTitle }}</span>
      </nav>

      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight text-foreground">{{ resolvedTitle }}</h1>

      @if (resolvedDescription) {
        <p class="mt-3 max-w-2xl text-lg text-balance text-muted-foreground">{{ resolvedDescription }}</p>
      }

      <div class="mt-5 flex flex-wrap items-center gap-2">
        @if (resolvedCategory) {
          <span class="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
            {{ resolvedCategory }}
          </span>
        }
        @if (resolvedSelector) {
          <span class="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">&lt;{{ resolvedSelector }}&gt;</span>
        }
        <a href="https://github.com/kojo-io/tolle-ui" target="_blank" rel="noreferrer"
           class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:no-underline">
          <i class="ri-github-fill" aria-hidden="true"></i> Source
        </a>
      </div>

      <!-- Install command -->
      @if (resolvedInstall) {
        <div class="mt-6 flex max-w-xl items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
          <span class="select-none font-mono text-sm text-primary">$</span>
          <code class="flex-1 truncate font-mono text-[13px] text-foreground">{{ resolvedInstall }}</code>
          <button type="button" (click)="copyInstall()" aria-label="Copy install command"
                  class="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <i [class]="copied ? 'ri-check-line' : 'ri-file-copy-line'"></i>
          </button>
        </div>
      }
    </header>
  `,
})
export class DocHeroComponent {
  private registry = inject(RegistryDocsService);

  /** Registry slug (e.g. 'badge'); drives title/description/category/selector/install. */
  @Input() slug = '';
  // Optional explicit overrides (used when the registry has no entry, e.g. composite pages).
  @Input() title?: string;
  @Input() description?: string;
  @Input() category?: string;
  @Input() selector?: string;
  @Input() install?: string;

  copied = false;

  private get reg() {
    return this.slug ? this.registry.item(this.slug) : undefined;
  }

  get resolvedTitle(): string {
    return this.title ?? this.reg?.title ?? this.slug;
  }
  get resolvedDescription(): string | undefined {
    return this.description ?? undefined;
  }
  get resolvedCategory(): string | undefined {
    return this.category ?? this.reg?.category;
  }
  get resolvedSelector(): string | undefined {
    return this.selector ?? this.reg?.selector;
  }
  get resolvedInstall(): string | undefined {
    return this.install ?? this.reg?.install ?? (this.slug ? `npx tolle add ${this.slug}` : undefined);
  }

  copyInstall(): void {
    const cmd = this.resolvedInstall;
    if (cmd && typeof navigator !== 'undefined') navigator.clipboard?.writeText(cmd);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1400);
  }
}
