import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
  selector: 'app-card-overview',
  standalone: true,
  imports: [BaseEditorComponent, DocHeroComponent],
  template: `
    <app-doc-hero
      slug="card"
      description="Displays a card component with a header, content area, and footer. Cards provide a structured way to present content and actions."
      id="overview" />

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="installation">Installation</h2>
      <div class="overflow-hidden rounded-lg border border-border">
        <app-base-editor [code]="installationCode" language="typescript" />
      </div>
    </section>
  `
})
export class CardOverviewComponent {
  installationCode = `import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
  CardFooterComponent
} from '@tolle-ui';`;
}
