import { Component } from '@angular/core';
import {DatePickerComponent} from '../../../../../../tolle/src/lib/date-picker.component';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-base-date-picker',
    imports: [
        DatePickerComponent,
        FormsModule
    ],
    templateUrl: './base-date-picker.component.html',
    styleUrl: './base-date-picker.component.css'
})
export class BaseDatePickerComponent {
  date: Date = new Date();
}
