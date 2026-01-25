import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateRangePickerComponent } from '../../../../../../tolle/src/lib/date-range-picker.component';
import { DateRange } from '../../../../../../tolle/src/lib/types/date-range';

@Component({
    selector: 'app-basic-range',
    standalone: true,
    imports: [DateRangePickerComponent, FormsModule, DatePipe],
    template: `
    <div class="max-w-md w-full">
      <tolle-date-range-picker [(ngModel)]="range"></tolle-date-range-picker>
      <p class="mt-4 text-sm text-muted-foreground">
        Selected: {{ range.start | date:'mediumDate' }} - {{ range.end | date:'mediumDate' }}
      </p>
    </div>
  `
})
export class BasicRangeComponent {
    range: DateRange = { start: new Date(), end: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) };
}
