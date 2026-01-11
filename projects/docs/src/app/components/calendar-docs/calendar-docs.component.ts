import {Component, inject, OnInit} from '@angular/core';
import {BaseService} from '../../shared/base.service';
import {AnalyticsService} from '../../analytics.service';
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';
import { NgIf} from '@angular/common';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {FormsModule} from '@angular/forms';
import {CalendarComponent} from '../../../../../tolle/src/lib/calendar.component';

@Component({
  selector: 'app-calendar-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    FormsModule,
    CalendarComponent
  ],
  templateUrl: './calendar-docs.component.html',
  styleUrl: './calendar-docs.component.css'
})
export class CalendarDocsComponent implements OnInit {
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

  installation = "import {CalendarComponent} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "    CalendarComponent,\n" +
    "  ]";


  previewCode = "<tolle-calendar></tolle-calendar>";
}
