import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicCardComponent } from '../../../docs-examples/card/basic-card.component';
import { FullCardComponent } from '../../../docs-examples/card/full-card.component';
import { FormCardComponent } from '../../../docs-examples/card/form-card.component';

@Component({
    selector: 'app-card-examples',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SegmentedComponent,
        BaseEditorComponent,
        BasicCardComponent,
        FullCardComponent,
        FormCardComponent
    ],
    template: `
    <section class="mb-16" id="examples">
      <h2 class="text-2xl font-bold mb-6">Examples</h2>

      <div class="space-y-12">
        <div id="basic">
          <h3 class="text-xl font-semibold mb-4">Basic</h3>
          <p class="text-muted-foreground mb-4">A simple card with a title and content area.</p>
          <div class="w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="basicTab" />
          </div>
          <div *ngIf="basicTab === 'preview'" class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
            <app-basic-card />
          </div>
          <div *ngIf="basicTab === 'code'" class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <app-base-editor [code]="basicCode" language="typescript" />
          </div>
        </div>

        <div id="full">
          <h3 class="text-xl font-semibold mb-4">Full Card</h3>
          <p class="text-muted-foreground mb-4">A complete card using header, content, and footer sub-components.</p>
          <div class="w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="fullTab" />
          </div>
          <div *ngIf="fullTab === 'preview'" class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
            <app-full-card />
          </div>
          <div *ngIf="fullTab === 'code'" class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <app-base-editor [code]="fullCode" language="typescript" />
          </div>
        </div>

        <div id="form">
          <h3 class="text-xl font-semibold mb-4">Form Card</h3>
          <p class="text-muted-foreground mb-4">A complex card containing input fields and mixed content.</p>
          <div class="w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="formTab" />
          </div>
          <div *ngIf="formTab === 'preview'" class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
            <app-form-card />
          </div>
          <div *ngIf="formTab === 'code'" class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <app-base-editor [code]="formCode" language="typescript" />
          </div>
        </div>
      </div>
    </section>
  `
})
export class CardExamplesComponent {
    sourceService = inject(SourceCodeService);

    viewOptions = [
        { label: 'Preview', value: 'preview' },
        { label: 'Code', value: 'code' }
    ];

    basicTab = 'preview';
    fullTab = 'preview';
    formTab = 'preview';

    basicCode = '';
    fullCode = '';
    formCode = '';

    constructor() {
        this.sourceService.getFile('card/basic-card.component.ts').subscribe(code => this.basicCode = code);
        this.sourceService.getFile('card/full-card.component.ts').subscribe(code => this.fullCode = code);
        this.sourceService.getFile('card/form-card.component.ts').subscribe(code => this.formCode = code);
    }
}
