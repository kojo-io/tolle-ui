import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '../../../../../../tolle/src/lib/date-picker.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { CheckboxComponent } from '../../../../../../tolle/src/lib/checkbox.component';
import { CalendarMode } from '../../../../../../tolle/src/lib/calendar.component';

@Component({
    selector: 'app-date-picker-interactive',
    imports: [
        CommonModule,
        FormsModule,
        DatePickerComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent,
        CheckboxComponent
    ],
    templateUrl: './date-picker-interactive.component.html'
})
export class DatePickerInteractiveComponent {
    date: Date | null = null;
    mode: CalendarMode = 'date';
    disabled = false;
    showClear = true;
    disablePastDates = false;
    showQuickActions = true;

    get playgroundCode() {
        return `<tolle-date-picker
  [(ngModel)]="date"
  mode="${this.mode}"
  [disabled]="${this.disabled}"
  [showClear]="${this.showClear}"
  [disablePastDates]="${this.disablePastDates}"
  [showQuickActions]="${this.showQuickActions}"
></tolle-date-picker>`;
    }
}
