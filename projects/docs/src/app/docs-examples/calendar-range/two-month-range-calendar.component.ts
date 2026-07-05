import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RangeCalendarComponent } from '../../../../../tolle/src/lib/range-calendar.component';
import { DateRange } from '../../../../../tolle/src/lib/types/date-range';

@Component({
  selector: 'app-two-month-range-calendar',
  standalone: true,
  imports: [RangeCalendarComponent, FormsModule, DatePipe],
  template: `
    <div class="flex flex-col items-center gap-4">
      <tolle-range-calendar [(ngModel)]="range" [numberOfMonths]="2"></tolle-range-calendar>
      <p class="text-sm text-muted-foreground">
        Selected: {{ range.start | date:'mediumDate' }} – {{ range.end | date:'mediumDate' }}
      </p>
    </div>
  `,
})
export class TwoMonthRangeCalendarComponent {
  // A range crossing the month boundary shows the strip spanning both months.
  range: DateRange = { start: new Date(2026, 6, 28), end: new Date(2026, 7, 5) };
}
