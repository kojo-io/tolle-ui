import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicButtonGroupComponent } from '../../../docs-examples/button-group/basic-button-group.component';
import { MixedButtonGroupComponent } from '../../../docs-examples/button-group/mixed-button-group.component';

@Component({
  selector: 'app-button-group-examples',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SegmentedComponent,
    BaseEditorComponent,
    BasicButtonGroupComponent,
    MixedButtonGroupComponent
  ],
  template: `
    <section class="mb-16" id="examples">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Examples</h2>

      <!-- Basic -->
      <div class="space-y-4 mb-12" id="basic">
        <h3 class="text-xl font-semibold text-foreground">Basic</h3>
        <p class="text-muted-foreground">Standard button grouping with various variants.</p>
        <div class="w-1/4">
          <tolle-segment [items]="viewOptions" [(ngModel)]="basicTab" />
        </div>
        <div *ngIf="basicTab === 'preview'" class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
          <app-basic-button-group />
        </div>
        <div *ngIf="basicTab === 'code'" class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <app-base-editor [code]="basicCode" language="typescript" />
        </div>
      </div>

      <!-- Mixed -->
      <div class="space-y-4 mb-12" id="mixed">
        <h3 class="text-xl font-semibold text-foreground">Mixed Content</h3>
        <p class="text-muted-foreground">Combining text, icons, and different sizes within a group.</p>
        <div class="w-1/4">
          <tolle-segment [items]="viewOptions" [(ngModel)]="mixedTab" />
        </div>
        <div *ngIf="mixedTab === 'preview'" class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
          <app-mixed-button-group />
        </div>
        <div *ngIf="mixedTab === 'code'" class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <app-base-editor [code]="mixedCode" language="typescript" />
        </div>
      </div>
    </section>
  `
})
export class ButtonGroupExamplesComponent {
  sourceService = inject(SourceCodeService);

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  basicTab = 'preview';
  mixedTab = 'preview';

  basicCode = '';
  mixedCode = '';

  constructor() {
    this.sourceService.getFile('button-group/basic-button-group.component.ts').subscribe(code => this.basicCode = code);
    this.sourceService.getFile('button-group/mixed-button-group.component.ts').subscribe(code => this.mixedCode = code);
  }
}
