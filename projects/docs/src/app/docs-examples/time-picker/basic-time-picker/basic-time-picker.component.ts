import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimePickerComponent } from '../../../../../../tolle/src/lib/time-picker.component';

@Component({
    selector: 'app-basic-time-picker',
    standalone: true,
    imports: [CommonModule, FormsModule, TimePickerComponent],
    templateUrl: './basic-time-picker.component.html'
})
export class BasicTimePickerComponent {
    /** The control value is a plain 24-hour `HH:mm` string — no date, no timezone. */
    time: string | null = '09:30';
}
