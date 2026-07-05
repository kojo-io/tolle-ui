import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
    selector: 'app-scroll-area-overview',
    standalone: true,
    imports: [BaseEditorComponent, DocHeroComponent],
    template: `
    <app-doc-hero
      slug="scroll-area"
      description="Augments native scroll functionality with custom-styled, cross-browser scrollbars."
      id="overview" />

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="installation">Installation</h2>
      <div class="overflow-hidden rounded-lg border border-border">
        <app-base-editor [code]="installationCode" language="typescript" />
      </div>
    </section>
  `
})
export class ScrollAreaOverviewComponent {
    installationCode = `import { ScrollAreaComponent } from '@tolle_/tolle-ui';

imports: [
  ScrollAreaComponent
]`;
}
