import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../../../../../tolle/src/lib/calendar.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-basic-calendar',
  standalone: true,
  imports: [CalendarComponent, FormsModule, DatePipe],
  template: `
    <div class="flex flex-col items-center gap-4 p-4 border rounded-lg bg-card">
      <p class="text-sm text-muted-foreground">Selected: {{ date | date:'fullDate' }}</p>
      <tolle-calendar [(ngModel)]="date"></tolle-calendar>
    </div>
  `
})
export class BasicCalendarComponent {
  date: Date = new Date();
}
