import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TimePickerComponent } from '../../../../../../tolle/src/lib/time-picker.component';

@Component({
  selector: 'app-time-picker-12-hour',
  imports: [FormsModule, TimePickerComponent],
  templateUrl: './time-picker-12-hour.component.html',
})
export class TimePicker12HourComponent {
  /**
   * `use12Hours` only changes the face. The value stays a 24-hour string, and
   * gains a seconds part because `showSeconds` is on.
   */
  time: string | null = '14:05:30';
}
