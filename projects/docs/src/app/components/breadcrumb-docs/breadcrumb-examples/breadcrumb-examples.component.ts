import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicBreadcrumbComponent } from '../../../docs-examples/breadcrumb/basic-breadcrumb.component';
import { CustomSeparatorBreadcrumbComponent } from '../../../docs-examples/breadcrumb/custom-separator-breadcrumb.component';

@Component({
  selector: 'app-breadcrumb-examples',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SegmentedComponent,
    BaseEditorComponent,
    BasicBreadcrumbComponent,
    CustomSeparatorBreadcrumbComponent
  ],
  template: `
    <section class="mb-16" id="examples">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Examples</h2>

      <!-- Basic -->
      <div class="space-y-4 mb-12" id="basic">
        <h3 class="text-xl font-semibold text-foreground">Basic</h3>
        <p class="text-muted-foreground">Standard breadcrumb hierarchy.</p>
        <div class="w-1/4">
          <tolle-segment [items]="viewOptions" [(ngModel)]="basicTab" />
        </div>
        <div *ngIf="basicTab === 'preview'" class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
          <app-basic-breadcrumb />
        </div>
        <div *ngIf="basicTab === 'code'" class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <app-base-editor [code]="basicCode" language="typescript" />
        </div>
      </div>

      <!-- Custom Separator -->
      <div class="space-y-4 mb-12" id="custom-separator">
        <h3 class="text-xl font-semibold text-foreground">Custom Separator</h3>
        <p class="text-muted-foreground">Use any icon or character as a separator using the <code>tolle-breadcrumb-separator</code> component.</p>
        <div class="w-1/4">
          <tolle-segment [items]="viewOptions" [(ngModel)]="separatorTab" />
        </div>
        <div *ngIf="separatorTab === 'preview'" class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
          <app-custom-separator-breadcrumb />
        </div>
        <div *ngIf="separatorTab === 'code'" class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <app-base-editor [code]="separatorCode" language="typescript" />
        </div>
      </div>
    </section>
  `
})
export class BreadcrumbExamplesComponent {
  sourceService = inject(SourceCodeService);

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  basicTab = 'preview';
  separatorTab = 'preview';

  basicCode = '';
  separatorCode = '';

  constructor() {
    this.sourceService.getFile('breadcrumb/basic-breadcrumb.component.ts').subscribe(code => this.basicCode = code);
    this.sourceService.getFile('breadcrumb/custom-separator-breadcrumb.component.ts').subscribe(code => this.separatorCode = code);
  }
}
