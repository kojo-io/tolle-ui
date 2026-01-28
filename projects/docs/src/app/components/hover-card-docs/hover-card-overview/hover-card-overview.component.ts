import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
    selector: 'app-hover-card-overview',
    imports: [BaseEditorComponent],
    template: `
    <header class="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8" id="overview">
      <h1 class="text-4xl font-extrabold tracking-tight mb-4 text-foreground">Hover Card</h1>
      <p class="text-lg text-muted-foreground mb-6">
        For sighted users to preview content available behind a link.
      </p>

      <section class="mt-8">
        <h2 class="text-xl font-bold mb-4 text-foreground" id="installation">Installation</h2>
        <div class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <app-base-editor [code]="installationCode" language="typescript" />
        </div>
      </section>

      <section class="mt-8">
        <h2 class="text-xl font-bold mb-4 text-foreground" id="usage">Usage</h2>
        <div class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <app-base-editor [code]="usageCode" language="angular" />
        </div>
      </section>
    </header>
  `
})
export class HoverCardOverviewComponent {
    installationCode = `import { HoverCardComponent, HoverCardTriggerComponent, HoverCardContentComponent } from '@tolle_/tolle-ui';

imports: [
  HoverCardComponent,
  HoverCardTriggerComponent,
  HoverCardContentComponent,
  ...
]`;

    usageCode = `<tolle-hover-card>
  <tolle-hover-card-trigger>
    <a href="https://github.com/angular" class="text-primary hover:underline">&#64;angular</a>
  </tolle-hover-card-trigger>
  <tolle-hover-card-content>
    <div class="flex justify-between space-x-4">
      <div class="space-y-1">
        <h4 class="text-sm font-semibold">&#64;angular</h4>
        <p class="text-sm">
          The web framework for modern web applications.
        </p>
        <div class="flex items-center pt-2">
          <span class="text-xs text-muted-foreground">
            Joined December 2021
          </span>
        </div>
      </div>
    </div>
  </tolle-hover-card-content>
</tolle-hover-card>`;
}
