import { Component } from '@angular/core';
import {DatePickerComponent} from '../../../../../../tolle/src/lib/date-picker.component';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-year-picker',
    imports: [
        DatePickerComponent,
        FormsModule
    ],
    templateUrl: './year-picker.component.html',
    styleUrl: './year-picker.component.css'
})
export class YearPickerComponent {
  date: Date = new Date();
}
