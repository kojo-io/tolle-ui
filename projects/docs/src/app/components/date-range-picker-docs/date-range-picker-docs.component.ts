import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangePickerOverviewComponent } from './date-range-picker-overview/date-range-picker-overview.component';
import { DateRangePickerInteractiveComponent } from './date-range-picker-interactive/date-range-picker-interactive.component';
import { DateRangePickerApiComponent } from './date-range-picker-api/date-range-picker-api.component';
import { BaseService } from '../../shared/base.service';

@Component({
    selector: 'app-date-range-picker-docs',
    standalone: true,
    imports: [
        CommonModule,
        DateRangePickerOverviewComponent,
        DateRangePickerInteractiveComponent,
        DateRangePickerApiComponent
    ],
    templateUrl: './date-range-picker-docs.component.html'
})
export class DateRangePickerDocsComponent {
    baseService = inject(BaseService);
}
