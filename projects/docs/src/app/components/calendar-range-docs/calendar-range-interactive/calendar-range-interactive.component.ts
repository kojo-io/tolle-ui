import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RangeCalendarComponent } from '../../../../../../tolle/src/lib/range-calendar.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';

@Component({
    selector: 'app-calendar-range-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RangeCalendarComponent,
        PlaygroundComponent,
        CheckboxComponent,
        JsonPipe
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-2xl font-bold mb-6">Interactive Playground</h2>
      <app-playground [code]="playgroundCode" language="angular">
        <div preview>
          <div class="flex flex-col items-center gap-4">
            <pre class="text-xs bg-muted p-2 rounded w-full overflow-auto">{{ range | json }}</pre>
            <tolle-range-calendar 
              [(ngModel)]="range"
              [disablePastDates]="disablePastDates">
            </tolle-range-calendar>
          </div>
        </div>

        <div controls class="space-y-4">
          <div class="flex items-center gap-2 py-2">
            <tolle-checkbox [(ngModel)]="disablePastDates" size="sm"></tolle-checkbox>
            <label class="text-sm font-medium cursor-pointer" (click)="disablePastDates = !disablePastDates">Disable Past Dates</label>
          </div>
        </div>
      </app-playground>
    </section>
  `
})
export class CalendarRangeInteractiveComponent {
    range = { start: null, end: null };
    disablePastDates = false;

    get playgroundCode() {
        const disablePastAttr = this.disablePastDates ? ` [disablePastDates]="true"` : '';
        return `<tolle-range-calendar [(ngModel)]="dateRange"${disablePastAttr}></tolle-range-calendar>`;
    }
}
