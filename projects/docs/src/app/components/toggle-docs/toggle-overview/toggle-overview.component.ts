import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
    selector: 'app-toggle-overview',
    standalone: true,
    imports: [BaseEditorComponent, DocHeroComponent],
    template: `
    <app-doc-hero slug="toggle" description="A two-state button that can be either on or off." id="overview" />

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="installation">Installation</h2>
      <p class="mb-4 text-muted-foreground">
        Add it with the CLI (you own the source), or import the component if you use the package.
      </p>
      <div class="overflow-hidden rounded-lg border border-border">
        <app-base-editor [code]="installationCode" language="typescript" />
      </div>
    </section>
  `
})
export class ToggleOverviewComponent {
    installationCode = `import { ToggleComponent } from '@tolle_/tolle-ui';

imports: [
  ToggleComponent
]`;
}
