import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateTimePickerComponent } from '../../../../../../tolle/src/lib/date-time-picker.component';

@Component({
    selector: 'app-basic-date-time-picker',
    standalone: true,
    imports: [CommonModule, FormsModule, DateTimePickerComponent],
    templateUrl: './basic-date-time-picker.component.html'
})
export class BasicDateTimePickerComponent {
    /** The control value is a `Date`, and `null` once cleared. */
    moment: Date | null = new Date(2026, 2, 14, 9, 30);

    /** Mirrors `(valueChange)` so the null-on-clear contract is visible. */
    lastEmitted = 'nothing yet';

    onValueChange(value: Date | null): void {
        this.lastEmitted = value ? value.toISOString() : 'null';
    }
}
