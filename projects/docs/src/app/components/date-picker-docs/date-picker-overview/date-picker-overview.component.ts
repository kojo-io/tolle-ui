import { Component } from '@angular/core';
import { DocHeroComponent } from '../../../shared/doc-hero/doc-hero.component';

@Component({
    selector: 'app-date-picker-overview',
    standalone: true,
    imports: [DocHeroComponent],
    templateUrl: './date-picker-overview.component.html'
})
export class DatePickerOverviewComponent { }
