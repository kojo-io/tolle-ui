import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateTimePickerComponent } from '../../../../../../tolle/src/lib/date-time-picker.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-date-time-picker-reactive-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DateTimePickerComponent, ButtonComponent],
    templateUrl: './date-time-picker-reactive-form.component.html'
})
export class DateTimePickerReactiveFormComponent {
    form = new FormGroup({
        startsAt: new FormControl<Date | null>(new Date(2026, 2, 14, 14, 0), Validators.required)
    });

    get startsAtControl(): FormControl<Date | null> {
        return this.form.controls.startsAt;
    }

    toggleDisabled(): void {
        if (this.startsAtControl.disabled) {
            this.startsAtControl.enable();
        } else {
            this.startsAtControl.disable();
        }
    }
}
