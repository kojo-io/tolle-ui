import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimePickerComponent } from '../../../../../../tolle/src/lib/time-picker.component';

@Component({
    selector: 'app-time-picker-bounded',
    standalone: true,
    imports: [CommonModule, FormsModule, TimePickerComponent],
    templateUrl: './time-picker-bounded.component.html'
})
export class TimePickerBoundedComponent {
    /** Office hours, in quarter-hour steps. */
    slot: string | null = '09:00';

    small: string | null = '08:15';
    large: string | null = '17:45';
    required: string | null = null;
}
