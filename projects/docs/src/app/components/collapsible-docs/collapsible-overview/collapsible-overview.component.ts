import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
    selector: 'app-collapsible-overview',
    standalone: true,
    imports: [BaseEditorComponent, DocHeroComponent],
    template: `
    <app-doc-hero
      slug="collapsible"
      description="An interactive component which expands/collapses a panel."
      id="overview" />

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="installation">Installation</h2>
      <div class="overflow-hidden rounded-lg border border-border">
        <app-base-editor [code]="installationCode" language="typescript" />
      </div>
    </section>
  `
})
export class CollapsibleOverviewComponent {
    installationCode = `import { CollapsibleComponent, CollapsibleTriggerComponent, CollapsibleContentComponent } from '@tolle_/tolle-ui';

imports: [
  CollapsibleComponent,
  CollapsibleTriggerComponent,
  CollapsibleContentComponent
]`;
}
