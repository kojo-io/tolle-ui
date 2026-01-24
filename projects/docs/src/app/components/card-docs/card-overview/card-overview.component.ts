import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
  selector: 'app-card-overview',
  standalone: true,
  imports: [BaseEditorComponent],
  template: `
    <section class="mb-16" id="overview">
      <h1 class="text-4xl font-extrabold tracking-tight mb-4">Card</h1>
      <p class="text-lg text-muted-foreground mb-8">
        Displays a card component with a header, content area, and footer. Cards provide a structured way to present content and actions.
      </p>

      <div class="mt-12" id="installation">
        <h2 class="text-2xl font-bold mb-4">Installation</h2>
        <div class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <app-base-editor [code]="installationCode" language="typescript" />
        </div>
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
