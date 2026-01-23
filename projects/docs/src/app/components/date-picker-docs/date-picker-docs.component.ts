import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DatePickerOverviewComponent } from './date-picker-overview/date-picker-overview.component';
import { DatePickerInteractiveComponent } from './date-picker-interactive/date-picker-interactive.component';
import { DatePickDocComponent } from './date-pick-doc/date-pick-doc.component';
import { MonthPickDocComponent } from './month-pick-doc/month-pick-doc.component';
import { YearPickDocComponent } from './year-pick-doc/year-pick-doc.component';
import { DatePickerApiComponent } from './date-picker-api/date-picker-api.component';

@Component({
  selector: 'app-date-picker-docs',
  standalone: true,
  imports: [
    DatePickerOverviewComponent,
    DatePickerInteractiveComponent,
    DatePickDocComponent,
    MonthPickDocComponent,
    YearPickDocComponent,
    DatePickerApiComponent
  ],
  templateUrl: './date-picker-docs.component.html',
  styleUrl: './date-picker-docs.component.css'
})
export class DatePickerDocsComponent {
  baseService = inject(BaseService);
}
