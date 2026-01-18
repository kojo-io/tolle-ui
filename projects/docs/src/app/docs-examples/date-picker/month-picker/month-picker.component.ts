import { Component } from '@angular/core';
import {DatePickerComponent} from '../../../../../../tolle/src/lib/date-picker.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-month-picker',
  standalone: true,
  imports: [
    DatePickerComponent,
    FormsModule
  ],
  templateUrl: './month-picker.component.html',
  styleUrl: './month-picker.component.css'
})
export class MonthPickerComponent {
  date: Date = new Date();
}
