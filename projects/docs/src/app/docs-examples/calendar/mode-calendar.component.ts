import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '../../../../../tolle/src/lib/calendar.component';

@Component({
    selector: 'app-mode-calendar',
    imports: [CalendarComponent, FormsModule],
    template: `
    <div class="flex flex-wrap gap-8 justify-center p-4 border rounded-lg bg-card">
      <div class="flex flex-col items-center gap-2">
        <span class="text-sm font-medium">Month Mode</span>
        <tolle-calendar mode="month"></tolle-calendar>
      </div>
      
      <div class="flex flex-col items-center gap-2">
        <span class="text-sm font-medium">Year Mode</span>
        <tolle-calendar mode="year"></tolle-calendar>
      </div>
    </div>
  `
})
export class ModeCalendarComponent { }
