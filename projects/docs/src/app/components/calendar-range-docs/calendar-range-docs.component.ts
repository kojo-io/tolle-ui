import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { CalendarRangeOverviewComponent } from './calendar-range-overview/calendar-range-overview.component';
import { CalendarRangeInteractiveComponent } from './calendar-range-interactive/calendar-range-interactive.component';
import { CalendarRangeExamplesComponent } from './calendar-range-examples/calendar-range-examples.component';
import { CalendarRangeApiComponent } from './calendar-range-api/calendar-range-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
  selector: 'app-calendar-range-docs',
  standalone: true,
  imports: [
    CalendarRangeOverviewComponent,
    CalendarRangeInteractiveComponent,
    CalendarRangeExamplesComponent,
    CalendarRangeApiComponent,
    DocsWrapperComponent

  ],
  templateUrl: './calendar-range-docs.component.html',
  styleUrl: './calendar-range-docs.component.css'
})
export class CalendarRangeDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }
}
