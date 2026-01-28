import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicRangeCalendarComponent } from '../../../docs-examples/calendar-range/basic-range-calendar.component';

@Component({
    selector: 'app-calendar-range-examples',
    imports: [
    SegmentedComponent,
    FormsModule,
    BaseEditorComponent,
    BasicRangeCalendarComponent
],
    template: `
    <section class="mb-16" id="examples">
      <h2 class="text-2xl font-bold mb-6">Examples</h2>
    
      <div class="space-y-12">
        <div id="basic">
          <h3 class="text-xl font-semibold mb-4">Basic Range</h3>
          <p class="text-muted-foreground mb-4">Select a start and end date to define a range.</p>
          <div class="w-full md:w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="basicView" />
          </div>
          @if (basicView === 'preview') {
            <div class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
              <app-basic-range-calendar />
            </div>
          }
          @if (basicView === 'code') {
            <div class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
              <app-base-editor [code]="basicCode" language="typescript" />
            </div>
          }
        </div>
      </div>
    </section>
    `
})
export class CalendarRangeExamplesComponent {
  sourceService = inject(SourceCodeService);

  basicView = 'preview';

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  basicCode = '';

  constructor() {
    this.sourceService.getFile('calendar-range/basic-range-calendar.component.ts').subscribe(code => this.basicCode = code);
  }
}
