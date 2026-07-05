import { Component } from '@angular/core';
import { SegmentedComponent } from '../../../../../../tolle/src/lib/segment.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarComponent, CalendarMode } from '../../../../../../tolle/src/lib/calendar.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { LabelComponent } from '../../../../../../tolle/src/lib/label.component';

@Component({
  selector: 'app-calendar-interactive',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarComponent,
    PlaygroundComponent,
    SelectComponent,
    SelectItemComponent,
    SwitchComponent,
    LabelComponent
  ],
  template: `
    <section class="mb-16" id="playground">
      <h2 class="text-xl font-semibold tracking-tight mb-6">Interactive Playground</h2>
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

        <div controls class="space-y-5">
          <div class="space-y-1.5">
            <tolle-label>Mode</tolle-label>
            <tolle-select [(ngModel)]="mode" size="sm">
              <tolle-select-item value="date">Date</tolle-select-item>
              <tolle-select-item value="month">Month</tolle-select-item>
              <tolle-select-item value="year">Year</tolle-select-item>
            </tolle-select>
          </div>

          <label class="flex items-center justify-between text-sm font-medium">
            <span>Disable Past Dates</span>
            <tolle-switch [(ngModel)]="disablePastDates" size="sm" />
          </label>

          <label class="flex items-center justify-between text-sm font-medium">
            <span>Show Quick Actions</span>
            <tolle-switch [(ngModel)]="showQuickActions" size="sm" />
          </label>
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
