import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicDateTimePickerComponent } from '../../docs-examples/date-time-picker/basic-date-time-picker/basic-date-time-picker.component';
import { DateTimePickerReactiveFormComponent } from '../../docs-examples/date-time-picker/date-time-picker-reactive-form/date-time-picker-reactive-form.component';
import { DateTimePickerBoundedComponent } from '../../docs-examples/date-time-picker/date-time-picker-bounded/date-time-picker-bounded.component';


@Component({
  selector: 'app-date-time-picker-docs',
  standalone: true,
  imports: [
    RouterLink,
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicDateTimePickerComponent,
    DateTimePickerReactiveFormComponent,
    DateTimePickerBoundedComponent
  ],
  templateUrl: './date-time-picker-docs.component.html',
  styleUrl: './date-time-picker-docs.component.css'
})
export class DateTimePickerDocsComponent {
  baseService = inject(BaseService);

  installation = `import { DateTimePickerComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [DateTimePickerComponent]
})`;

  valueContract = `// The control value is a Date, because a date-time genuinely is a moment.
new Date(2026, 2, 14, 9, 30)   // 14 Mar 2026, 09:30 local time
null                           // nothing chosen, or the Clear button was pressed

// Changing the date preserves the chosen time, and changing the time
// preserves the chosen date — the two halves are only ever recombined.
// 14 Mar 09:30 -> pick 20 Mar  -> 20 Mar 09:30   (time kept)
// 20 Mar 09:30 -> pick 17:45   -> 20 Mar 17:45   (date kept)`;

  basicCode = `<span class="text-sm font-medium">Publish at</span>

<tolle-date-time-picker
  [(ngModel)]="moment"
  (valueChange)="onValueChange($event)"
  ariaLabel="Publish at" />

<p>Value: {{ moment ? (moment | date: 'medium') : 'null' }}</p>
<p>Last emitted: {{ lastEmitted }}</p>`;

  basicTs = `import { FormsModule } from '@angular/forms';
import { DateTimePickerComponent } from '@tolle_/tolle-ui';

export class BasicDateTimePickerComponent {
  // The control value is a Date, and null once cleared.
  moment: Date | null = new Date(2026, 2, 14, 9, 30);

  lastEmitted = 'nothing yet';

  onValueChange(value: Date | null): void {
    this.lastEmitted = value ? value.toISOString() : 'null';
  }
}`;

  reactiveCode = `<form [formGroup]="form">
  <span class="text-sm font-medium">Session starts at</span>

  <tolle-date-time-picker
    formControlName="startsAt"
    [use12Hours]="true"
    [minuteStep]="15"
    ariaLabel="Session starts at" />

  <tolle-button variant="outline" size="sm" (click)="toggleDisabled()">
    {{ startsAtControl.disabled ? 'Enable' : 'Disable' }}
  </tolle-button>

  <p>Valid: {{ form.valid }}</p>
</form>`;

  reactiveTs = `import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateTimePickerComponent } from '@tolle_/tolle-ui';

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
}`;

  boundedCode = `<tolle-date-time-picker
  [(ngModel)]="booking"
  [min]="min"
  [max]="max"
  [minuteStep]="30"
  displayFormat="EEE d MMM, HH:mm"
  placeholder="Pick a slot…"
  ariaLabel="Booking" />

<tolle-date-time-picker size="sm" [(ngModel)]="small" placeholder="Small" ariaLabel="Small" />
<tolle-date-time-picker size="lg" [(ngModel)]="large" placeholder="Large" ariaLabel="Large" />
<tolle-date-time-picker [invalid]="true" [(ngModel)]="required" placeholder="Required…" ariaLabel="Invalid" />
<tolle-date-time-picker [disabled]="true" placeholder="Disabled" ariaLabel="Disabled" />`;

  boundedTs = `export class DateTimePickerBoundedComponent {
  private today = new Date();

  // Bookable from 09:00 today until 17:00 a week out.
  min = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0);
  max = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 7, 17, 0);

  booking: Date | null = null;

  small: Date | null = null;
  large: Date | null = null;
  required: Date | null = null;
}`;

  dateTimePickerProps: PropEntry[] = [
    { name: 'placeholder', type: 'string', default: "'Select date and time'", description: 'Text shown on the trigger when nothing is selected.' },
    { name: 'use12Hours', type: 'boolean', default: 'false', description: 'Renders a 12-hour face with an AM/PM column.' },
    { name: 'showSeconds', type: 'boolean', default: 'false', description: 'Adds a seconds column.' },
    { name: 'minuteStep', type: 'number', default: '1', description: 'Interval between minute entries, in minutes.' },
    { name: 'min', type: 'Date', default: 'undefined', description: 'Earliest selectable moment; earlier days and times are disabled. The time half only bites on the boundary day itself.' },
    { name: 'max', type: 'Date', default: 'undefined', description: 'Latest selectable moment; later days and times are disabled. The time half only bites on the boundary day itself.' },
    { name: 'displayFormat', type: 'string', default: "'MMM d, yyyy h:mm a'", description: 'date-fns pattern used to render the value on the trigger. A pattern that throws falls back to a readable default rather than blanking the control.' },
    { name: 'size', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'", description: 'Height and text size of the trigger and entries.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies the destructive border and focus ring.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control. Also set for you by setDisabledState() when a form control is disabled.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name when there is no associated visible label.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the trigger via cn() (last-wins).' }
  ];

  dateTimePickerOutputs: PropEntry[] = [
    { name: 'valueChange', type: 'EventEmitter<Date | null>', description: 'Emitted with the chosen moment, or null when the value is cleared.' },
    { name: 'opened', type: 'EventEmitter<void>', description: 'Emitted when the panel opens.' },
    { name: 'closed', type: 'EventEmitter<void>', description: 'Emitted when the panel closes.' }
  ];
}
