import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateRangePickerComponent } from '../../../../../../tolle/src/lib/date-range-picker.component';
import { DateRange } from '../../../../../../tolle/src/lib/types/date-range';

@Component({
  selector: 'app-two-month-range',
  standalone: true,
  imports: [DateRangePickerComponent, FormsModule, DatePipe],
  template: `
    <div class="w-full max-w-md">
      <tolle-date-range-picker
        [(ngModel)]="range"
        [numberOfMonths]="2"
        placeholder="Pick a date range">
      </tolle-date-range-picker>
      <p class="mt-4 text-sm text-muted-foreground">
        Selected: {{ range.start | date:'mediumDate' }} – {{ range.end | date:'mediumDate' }}
      </p>
    </div>
  `,
})
export class TwoMonthRangeComponent {
  // A range that crosses the month boundary shows the strip spanning both months.
  range: DateRange = { start: new Date(2026, 6, 28), end: new Date(2026, 7, 5) };
}
