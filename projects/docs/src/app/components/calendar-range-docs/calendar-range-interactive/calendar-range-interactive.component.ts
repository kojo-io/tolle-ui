import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RangeCalendarComponent } from '../../../../../../tolle/src/lib/range-calendar.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';

@Component({
    selector: 'app-calendar-range-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RangeCalendarComponent,
        PlaygroundComponent,
        SwitchComponent,
        JsonPipe
    ],
    template: `
    <section class="mb-16" id="playground">
      <h2 class="text-xl font-semibold tracking-tight mb-6">Interactive Playground</h2>
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

        <div controls class="space-y-5">
          <label class="flex items-center justify-between text-sm font-medium">
            <span>Disable Past Dates</span>
            <tolle-switch [(ngModel)]="disablePastDates" size="sm" />
          </label>
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
