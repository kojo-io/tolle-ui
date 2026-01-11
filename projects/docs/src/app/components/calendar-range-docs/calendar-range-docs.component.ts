import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../../shared/base.service';
import {AnalyticsService} from '../../analytics.service';
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';
import {JsonPipe, NgIf} from '@angular/common';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {RangeCalendarComponent} from '../../../../../tolle/src/lib/range-calendar.component';

@Component({
  selector: 'app-calendar-range-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    RangeCalendarComponent,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './calendar-range-docs.component.html',
  styleUrl: './calendar-range-docs.component.css'
})
export class CalendarRangeDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);
  date: any;
  previewDate: any;

  ngOnInit(): void {
    this.analytics.init();
  }
  selectedTab = "preview";
  basicTab = "preview";
  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  installation = "import {RangeCalendarComponent} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "    RangeCalendarComponent,\n" +
    "  ]";


  previewCode = " <tolle-range-calendar [(ngModel)]=\"previewDate\"></tolle-range-calendar>";
}
