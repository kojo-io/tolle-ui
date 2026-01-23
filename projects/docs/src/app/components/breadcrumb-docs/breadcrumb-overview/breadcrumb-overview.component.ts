import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
  selector: 'app-breadcrumb-overview',
  standalone: true,
  imports: [BaseEditorComponent],
  template: `
    <header class="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8" id="overview">
      <h1 class="text-4xl font-extrabold tracking-tight mb-4 text-foreground">Breadcrumb</h1>
      <p class="text-lg text-muted-foreground mb-6">
        Displays the path to the current resource using a hierarchy of links.
      </p>

      <section class="mt-8">
        <h2 class="text-xl font-bold mb-4 text-foreground" id="installation">Installation</h2>
        <div class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <app-base-editor [code]="installationCode" language="typescript" />
        </div>
      </section>
    </header>
  `
})
export class BreadcrumbOverviewComponent {
  installationCode = `import { 
  BreadcrumbComponent, 
  BreadcrumbItemComponent, 
  BreadcrumbLinkComponent, 
  BreadcrumbSeparatorComponent 
} from '@tolle_/tolle-ui';

imports: [
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent
]`;
}
