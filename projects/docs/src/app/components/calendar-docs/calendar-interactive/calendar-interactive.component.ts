import { Component } from '@angular/core';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarComponent, CalendarMode } from '../../../../../../tolle/src/lib/calendar.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';

@Component({
    selector: 'app-calendar-interactive',
    imports: [
        CommonModule,
        FormsModule,
        CalendarComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent,
        CheckboxComponent
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <div class="flex flex-col items-center gap-4">
            <p class="text-sm text-muted-foreground" *ngIf="date">Selected: {{ date | date:'fullDate' }}</p>
            <tolle-calendar 
              [(ngModel)]="date"
              [mode]="mode" 
              [disablePastDates]="disablePastDates"
              [showQuickActions]="showQuickActions">
            </tolle-calendar>
          </div>
        </div>

        <div controls class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Mode</label>
            <tolle-select [(ngModel)]="mode">
              <tolle-select-item value="date">Date</tolle-select-item>
              <tolle-select-item value="month">Month</tolle-select-item>
              <tolle-select-item value="year">Year</tolle-select-item>
            </tolle-select>
          </div>

          <div class="flex items-center gap-2 py-2">
            <tolle-checkbox [(ngModel)]="disablePastDates" size="sm"></tolle-checkbox>
            <label class="text-sm font-medium cursor-pointer" (click)="disablePastDates = !disablePastDates">Disable Past Dates</label>
          </div>

          <div class="flex items-center gap-2 py-2">
            <tolle-checkbox [(ngModel)]="showQuickActions" size="sm"></tolle-checkbox>
            <label class="text-sm font-medium cursor-pointer" (click)="showQuickActions = !showQuickActions">Show Quick Actions</label>
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class CalendarInteractiveComponent {
  date: Date = new Date();
  mode: CalendarMode = 'date';
  disablePastDates = false;
  showQuickActions = true;

  get playgroundCode() {
    const modeAttr = this.mode !== 'date' ? ` mode="${this.mode}"` : '';
    const disablePastAttr = this.disablePastDates ? ` [disablePastDates]="true"` : '';
    const quickActionsAttr = !this.showQuickActions ? ` [showQuickActions]="false"` : '';

    return `<tolle-calendar [(ngModel)]="selectedDate"${modeAttr}${disablePastAttr}${quickActionsAttr}></tolle-calendar>`;
  }
}
