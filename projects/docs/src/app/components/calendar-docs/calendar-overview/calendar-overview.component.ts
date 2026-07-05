import { Component } from '@angular/core';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
    selector: 'app-calendar-overview',
    standalone: true,
    imports: [BaseEditorComponent, DocHeroComponent],
    template: `
    <app-doc-hero slug="calendar" description="A versatile component that allows users to view and select dates, supporting various modes like date, month, and year selection." id="overview" />

    <section class="mb-14" id="installation">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight">Installation</h2>
      <div class="overflow-hidden rounded-lg border border-border">
        <app-base-editor [code]="installCode" language="typescript" />
      </div>
    </section>
  `
})
export class CalendarOverviewComponent {
    installCode = `import { CalendarComponent } from '@tolle-ui';`;
}
