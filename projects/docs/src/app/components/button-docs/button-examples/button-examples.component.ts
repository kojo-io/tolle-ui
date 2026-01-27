import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicButtonComponent } from '../../../docs-examples/button/basic-button.component';
import { DestructiveButtonComponent } from '../../../docs-examples/button/destructive-button.component';
import { IconButtonComponent } from '../../../docs-examples/button/icon-button.component';
import { BusyButtonComponent } from '../../../docs-examples/button/busy-button.component';

@Component({
    selector: 'app-button-examples',
    imports: [
    FormsModule,
    SegmentedComponent,
    BaseEditorComponent,
    BasicButtonComponent,
    DestructiveButtonComponent,
    IconButtonComponent,
    BusyButtonComponent
],
    template: `
    <section class="mb-16" id="examples">
      <h2 class="text-2xl font-bold mb-6 text-foreground">Examples</h2>
    
      <!-- Basic -->
      <div class="space-y-4 mb-12" id="basic">
        <h3 class="text-xl font-semibold text-foreground">Basic</h3>
        <p class="text-muted-foreground">Standard variants and sizes for common use cases.</p>
        <div class="w-full md:w-1/4">
          <tolle-segment [items]="viewOptions" [(ngModel)]="basicTab" />
        </div>
        @if (basicTab === 'preview') {
          <div class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
            <app-basic-button />
          </div>
        }
        @if (basicTab === 'code') {
          <div class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <app-base-editor [code]="basicCode" language="typescript" />
          </div>
        }
      </div>
    
      <!-- Destructive -->
      <div class="space-y-4 mb-12" id="destructive">
        <h3 class="text-xl font-semibold text-foreground">Destructive</h3>
        <p class="text-muted-foreground">Use for actions that result in data loss or other high-risk operations.</p>
        <div class="w-full md:w-1/4">
          <tolle-segment [items]="viewOptions" [(ngModel)]="destructiveTab" />
        </div>
        @if (destructiveTab === 'preview') {
          <div class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
            <app-destructive-button />
          </div>
        }
        @if (destructiveTab === 'code') {
          <div class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <app-base-editor [code]="destructiveCode" language="typescript" />
          </div>
        }
      </div>
    
      <!-- Icon -->
      <div class="space-y-4 mb-12" id="icon">
        <h3 class="text-xl font-semibold text-foreground">Icons</h3>
        <p class="text-muted-foreground">Buttons can contain icons alongside text or as standalone icon buttons.</p>
        <div class="w-full md:w-1/4">
          <tolle-segment [items]="viewOptions" [(ngModel)]="iconTab" />
        </div>
        @if (iconTab === 'preview') {
          <div class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
            <app-icon-button />
          </div>
        }
        @if (iconTab === 'code') {
          <div class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <app-base-editor [code]="iconCode" language="typescript" />
          </div>
        }
      </div>
    
      <!-- Busy -->
      <div class="space-y-4 mb-12" id="busy">
        <h3 class="text-xl font-semibold text-foreground">Busy State</h3>
        <p class="text-muted-foreground">Indicate an ongoing process by setting the <code>busy</code> prop.</p>
        <div class="w-full md:w-1/4">
          <tolle-segment [items]="viewOptions" [(ngModel)]="busyTab" />
        </div>
        @if (busyTab === 'preview') {
          <div class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
            <app-busy-button />
          </div>
        }
        @if (busyTab === 'code') {
          <div class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <app-base-editor [code]="busyCode" language="typescript" />
          </div>
        }
      </div>
    </section>
    `
})
export class ButtonExamplesComponent {
  sourceService = inject(SourceCodeService);

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  basicTab = 'preview';
  destructiveTab = 'preview';
  iconTab = 'preview';
  busyTab = 'preview';

  basicCode = '';
  destructiveCode = '';
  iconCode = '';
  busyCode = '';

  constructor() {
    this.sourceService.getFile('button/basic-button.component.ts').subscribe(code => this.basicCode = code);
    this.sourceService.getFile('button/destructive-button.component.ts').subscribe(code => this.destructiveCode = code);
    this.sourceService.getFile('button/icon-button.component.ts').subscribe(code => this.iconCode = code);
    this.sourceService.getFile('button/busy-button.component.ts').subscribe(code => this.busyCode = code);
  }
}
