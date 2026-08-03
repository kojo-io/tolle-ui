import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '../../analytics.service';
import { BaseService } from '../../shared/base.service';
import { CalendarOverviewComponent } from './calendar-overview/calendar-overview.component';
import { CalendarInteractiveComponent } from './calendar-interactive/calendar-interactive.component';
import { CalendarExamplesComponent } from './calendar-examples/calendar-examples.component';
import { CalendarApiComponent } from './calendar-api/calendar-api.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-calendar-docs',
    imports: [
        CalendarOverviewComponent,
        CalendarInteractiveComponent,
        CalendarExamplesComponent,
        CalendarApiComponent,
        DocsWrapperComponent
    ],
    templateUrl: './calendar-docs.component.html',
    styleUrl: './calendar-docs.component.css'
})
export class CalendarDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }
}
