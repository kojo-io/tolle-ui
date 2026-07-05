import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
    selector: 'app-hover-card-overview',
    standalone: true,
    imports: [BaseEditorComponent, DocHeroComponent],
    template: `
    <app-doc-hero
      slug="hover-card"
      description="For sighted users to preview content available behind a link."
      id="overview" />

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="installation">Installation</h2>
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
