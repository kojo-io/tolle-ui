import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicCalendarComponent } from '../../../docs-examples/calendar/basic-calendar.component';
import { ModeCalendarComponent } from '../../../docs-examples/calendar/mode-calendar.component';
import { DisabledCalendarComponent } from '../../../docs-examples/calendar/disabled-calendar.component';

@Component({
  selector: 'app-calendar-examples',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SegmentedComponent,
    BaseEditorComponent,
    BasicCalendarComponent,
    ModeCalendarComponent,
    DisabledCalendarComponent
  ],
  template: `
    <section class="mb-16" id="examples">
      <h2 class="text-2xl font-bold mb-6">Examples</h2>

      <div class="space-y-12">
        <div id="basic">
          <h3 class="text-xl font-semibold mb-4">Basic</h3>
          <p class="text-muted-foreground mb-4">The default single-date selection calendar.</p>
          <div class="w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="basicView" />
          </div>
          <div *ngIf="basicView === 'preview'" class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
            <app-basic-calendar />
          </div>
          <div *ngIf="basicView === 'code'" class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <app-base-editor [code]="basicCode" language="typescript" />
          </div>
        </div>

        <div id="modes">
          <h3 class="text-xl font-semibold mb-4">Different Modes</h3>
          <p class="text-muted-foreground mb-4">Switch between date, month, and year selection modes.</p>
          <div class="w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="modeView" />
          </div>
          <div *ngIf="modeView === 'preview'" class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
            <app-mode-calendar />
          </div>
          <div *ngIf="modeView === 'code'" class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <app-base-editor [code]="modeCode" language="typescript" />
          </div>
        </div>

        <div id="disabled">
          <h3 class="text-xl font-semibold mb-4">Disabled & Restrictions</h3>
          <p class="text-muted-foreground mb-4">Restrict date selection using past date disabling or min/max bounds.</p>
          <div class="w-1/4 mb-4">
            <tolle-segment [items]="viewOptions" [(ngModel)]="disabledView" />
          </div>
          <div *ngIf="disabledView === 'preview'" class="p-10 rounded-xl bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
            <app-disabled-calendar />
          </div>
          <div *ngIf="disabledView === 'code'" class="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
            <app-base-editor [code]="disabledCode" language="typescript" />
          </div>
        </div>
      </div>
    </section>
  `
})
export class CalendarExamplesComponent {
  sourceService = inject(SourceCodeService);

  basicView = 'preview';
  modeView = 'preview';
  disabledView = 'preview';

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  basicCode = '';
  modeCode = '';
  disabledCode = '';

  constructor() {
    this.sourceService.getFile('calendar/basic-calendar.component.ts').subscribe(code => this.basicCode = code);
    this.sourceService.getFile('calendar/mode-calendar.component.ts').subscribe(code => this.modeCode = code);
    this.sourceService.getFile('calendar/disabled-calendar.component.ts').subscribe(code => this.disabledCode = code);
  }
}
