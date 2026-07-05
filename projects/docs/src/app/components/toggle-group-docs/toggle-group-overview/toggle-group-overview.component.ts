import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
    selector: 'app-toggle-group-overview',
    standalone: true,
    imports: [BaseEditorComponent, DocHeroComponent],
    template: `
    <app-doc-hero slug="toggle-group" description="A set of two-state buttons that can be toggled on or off." id="overview" />

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="installation">Installation</h2>
      <p class="mb-4 text-muted-foreground">
        Add it with the CLI (you own the source), or import the component if you use the package.
      </p>
      <div class="overflow-hidden rounded-lg border border-border">
        <app-base-editor [code]="installationCode" language="typescript" />
      </div>
    </section>

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="usage">Usage</h2>
      <div class="overflow-hidden rounded-lg border border-border">
        <app-base-editor [code]="usageCode" language="angular" />
      </div>
    </section>
  `
})
export class ToggleGroupOverviewComponent {
    installationCode = `import { ToggleGroupComponent, ToggleGroupItemComponent } from '@tolle_/tolle-ui';

imports: [
  ToggleGroupComponent,
  ToggleGroupItemComponent,
  ...
]`;

    usageCode = `<tolle-toggle-group type="single">
  <tolle-toggle-group-item value="bold" aria-label="Toggle bold">
    <lucide-icon name="bold" class="h-4 w-4" />
  </tolle-toggle-group-item>
  <tolle-toggle-group-item value="italic" aria-label="Toggle italic">
    <lucide-icon name="italic" class="h-4 w-4" />
  </tolle-toggle-group-item>
  <tolle-toggle-group-item value="underline" aria-label="Toggle underline">
    <lucide-icon name="underline" class="h-4 w-4" />
  </tolle-toggle-group-item>
</tolle-toggle-group>`;
}
