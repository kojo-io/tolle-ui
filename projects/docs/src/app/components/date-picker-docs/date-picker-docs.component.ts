import {Component, inject} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {BaseEditorComponent} from '../../shared/base-editor/base-editor.component';
import {
  DataTableStandardComponent
} from '../../docs-examples/data-table/data-table-standard/data-table-standard.component';
import {SegmentedComponent} from '../../../../../tolle/src/lib/segment.component';
import {BasePickerComponent} from './base-picker/base-picker.component';
import {BaseService} from '../../shared/base.service';
import {DatePickDocComponent} from './date-pick-doc/date-pick-doc.component';
import {MonthPickDocComponent} from './month-pick-doc/month-pick-doc.component';
import {YearPickDocComponent} from './year-pick-doc/year-pick-doc.component';

@Component({
  selector: 'app-date-picker-docs',
  standalone: true,
  imports: [
    BasePickerComponent,
    DatePickDocComponent,
    MonthPickDocComponent,
    YearPickDocComponent
  ],
  templateUrl: './date-picker-docs.component.html',
  styleUrl: './date-picker-docs.component.css'
})
export class DatePickerDocsComponent {
  baseService = inject(BaseService);
}
