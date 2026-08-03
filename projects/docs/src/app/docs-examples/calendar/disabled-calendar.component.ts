import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '../../../../../tolle/src/lib/calendar.component';
import { addDays, subDays } from 'date-fns';

@Component({
    selector: 'app-disabled-calendar',
    imports: [CalendarComponent, FormsModule],
    template: `
    <div class="flex flex-wrap gap-8 justify-center p-4 border rounded-lg bg-card">
      <div class="flex flex-col items-center gap-2">
        <span class="text-sm font-medium">Disable Past Dates</span>
        <tolle-calendar [disablePastDates]="true"></tolle-calendar>
      </div>
      
      <div class="flex flex-col items-center gap-2">
        <span class="text-sm font-medium">Min/Max Date (±7 days)</span>
        <tolle-calendar [minDate]="minDate" [maxDate]="maxDate"></tolle-calendar>
      </div>
    </div>
  `
})
export class DisabledCalendarComponent {
    minDate = subDays(new Date(), 7);
    maxDate = addDays(new Date(), 7);
}
