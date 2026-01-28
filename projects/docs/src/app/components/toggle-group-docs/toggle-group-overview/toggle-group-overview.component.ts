import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';

@Component({
    selector: 'app-toggle-group-overview',
    imports: [BaseEditorComponent],
    template: `
    <header class="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8" id="overview">
      <h1 class="text-4xl font-extrabold tracking-tight mb-4 text-foreground">Toggle Group</h1>
      <p class="text-lg text-muted-foreground mb-6">
        A set of two-state buttons that can be toggled on or off.
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
