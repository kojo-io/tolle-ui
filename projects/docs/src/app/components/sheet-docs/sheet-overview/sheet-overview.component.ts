import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
  selector: 'app-sheet-overview',
  standalone: true,
  imports: [
    CommonModule,
    BaseEditorComponent,
    DocHeroComponent
  ],
  template: `
    <app-doc-hero slug="sheet" description="Extends the Dialog component to display content that complements the main content of the screen." id="overview" />

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="import">Import</h2>
      <div class="overflow-hidden rounded-lg border border-border">
        <app-base-editor code="import {
  SheetComponent,
  SheetTriggerComponent,
  SheetContentComponent,
  SheetHeaderComponent,
  SheetTitleComponent,
  SheetDescriptionComponent
} from 'tolle-ui';" language="typescript"></app-base-editor>
      </div>
    </section>

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="usage">Usage</h2>
      <div class="overflow-hidden rounded-lg border border-border">
         <app-base-editor [code]="usageCode" language="html"></app-base-editor>
      </div>
    </section>

    <section class="mb-14">
      <h2 class="mb-4 scroll-m-20 text-xl font-semibold tracking-tight" id="service">Programmatic Usage</h2>
      <div class="space-y-6">
        <p class="text-muted-foreground">
          The <code>SheetService</code> allows you to open sheets programmatically from anywhere in your application. This is particularly useful for complex workflows, dynamic content, or when you need to handle results after the sheet is closed.
        </p>

        <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Basic Example</h3>
        <p class="text-sm text-muted-foreground">
          Inject the service and call the <code>open</code> method with a configuration object.
        </p>
        <div class="overflow-hidden rounded-lg border border-border">
          <app-base-editor [code]="serviceCode" language="typescript"></app-base-editor>
        </div>

        <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Handling Results</h3>
        <p class="text-sm text-muted-foreground">
          The <code>open</code> method returns a <code>SheetRef</code>, which provides an <code>afterClosed$</code> observable to handle data returned when the sheet is closed.
        </p>
        <div class="overflow-hidden rounded-lg border border-border">
          <app-base-editor [code]="resultCode" language="typescript"></app-base-editor>
        </div>
      </div>
    </section>
  `
})
export class SheetOverviewComponent {
  usageCode = `<tolle-sheet>
  <tolle-sheet-trigger>Open</tolle-sheet-trigger>
  <tolle-sheet-content>
    <tolle-sheet-header>
      <tolle-sheet-title>Edit profile</tolle-sheet-title>
      <tolle-sheet-description>
        Make changes to your profile here. Click save when you're done.
      </tolle-sheet-description>
    </tolle-sheet-header>
  </tolle-sheet-content>
</tolle-sheet>`;

  serviceCode = `import { SheetService } from 'tolle-ui';

constructor(private sheetService: SheetService) {}

openSheet() {
  this.sheetService.open({
    title: 'Programmatic Sheet',
    description: 'This sheet was opened via service.',
    content: 'Hello World', // Can be a string, TemplateRef, or Component
    side: 'right',
    rounded: true
  });
}`;

  resultCode = `const sheetRef = this.sheetService.open({
  content: MyComponent,
  data: { id: 123 }
});

sheetRef.afterClosed$.subscribe(result => {
  console.log('Sheet closed with result:', result);
});`;
}
