import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseEditorComponent } from '../base-editor/base-editor.component';
import { SegmentedComponent } from '../../../../../tolle/src/lib/segment.component';

@Component({
    selector: 'app-playground',
    imports: [CommonModule, BaseEditorComponent, SegmentedComponent, FormsModule],
    template: `
    <div class="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 overflow-hidden my-8">
      <!-- Tabs -->
      <div class="flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2">
        <div class="w-full max-w-[240px]">
          <tolle-segment [items]="tabItems" [(ngModel)]="activeTab" />
        </div>
      </div>

      <div class="flex flex-col lg:flex-row min-h-[400px]">
        <!-- Main Area (Preview or Code) -->
        <div class="flex-1 relative bg-white dark:bg-neutral-950 overflow-hidden">
          
          <!-- Preview Area -->
          <div *ngIf="activeTab === 'preview'" class="w-full h-full p-4 md:p-8 overflow-auto flex items-center justify-center">
            <div class="w-full h-fit min-h-full">
               <ng-content select="[preview]"></ng-content>
            </div>
          </div>

          <!-- Code Area -->
          <div *ngIf="activeTab === 'code'" class="absolute inset-0">
            <app-base-editor [code]="code" [language]="language" />
          </div>

        </div>

        <!-- Controls Area -->
        <div class="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-6">
          <h4 class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Configuration</h4>
          <div class="space-y-6">
            <ng-content select="[controls]"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PlaygroundComponent {
  @Input() code: string = '';
  @Input() language: any = 'html';

  activeTab: 'preview' | 'code' = 'preview';

  tabItems = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];
}
