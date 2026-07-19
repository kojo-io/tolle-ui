import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateTimePickerComponent } from '../../../../../../tolle/src/lib/date-time-picker.component';

@Component({
    selector: 'app-date-time-picker-bounded',
    standalone: true,
    imports: [CommonModule, FormsModule, DateTimePickerComponent],
    templateUrl: './date-time-picker-bounded.component.html'
})
export class DateTimePickerBoundedComponent {
    private today = new Date();

    /** Bookable from 09:00 today until 17:00 a week out. */
    min = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0);
    max = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 7, 17, 0);

    booking: Date | null = null;

    small: Date | null = null;
    large: Date | null = null;
    required: Date | null = null;
}
