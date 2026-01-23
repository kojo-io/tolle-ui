import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { RangeCalendarComponent } from '../../../../../tolle/src/lib/range-calendar.component';

@Component({
    selector: 'app-basic-range-calendar',
    standalone: true,
    imports: [RangeCalendarComponent, FormsModule, JsonPipe],
    template: `
    <div class="flex flex-col items-center gap-4 p-4 border rounded-lg bg-card">
      <pre class="text-xs bg-muted p-2 rounded w-full overflow-auto">{{ range | json }}</pre>
      <tolle-range-calendar [(ngModel)]="range"></tolle-range-calendar>
    </div>
  `
})
export class BasicRangeCalendarComponent {
    range = { start: null, end: null };
}
