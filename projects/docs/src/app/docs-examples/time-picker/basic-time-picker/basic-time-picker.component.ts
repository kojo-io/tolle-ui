import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TimePickerComponent } from '../../../../../../tolle/src/lib/time-picker.component';

@Component({
  selector: 'app-basic-time-picker',
  imports: [FormsModule, TimePickerComponent],
  templateUrl: './basic-time-picker.component.html',
})
export class BasicTimePickerComponent {
  /** The control value is a plain 24-hour `HH:mm` string — no date, no timezone. */
  time: string | null = '09:30';
}
