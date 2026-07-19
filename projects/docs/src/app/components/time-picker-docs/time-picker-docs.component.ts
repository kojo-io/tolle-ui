import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicTimePickerComponent } from '../../docs-examples/time-picker/basic-time-picker/basic-time-picker.component';
import { TimePicker12HourComponent } from '../../docs-examples/time-picker/time-picker-12-hour/time-picker-12-hour.component';
import { TimePickerBoundedComponent } from '../../docs-examples/time-picker/time-picker-bounded/time-picker-bounded.component';


@Component({
  selector: 'app-time-picker-docs',
  standalone: true,
  imports: [
    RouterLink,
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicTimePickerComponent,
    TimePicker12HourComponent,
    TimePickerBoundedComponent
  ],
  templateUrl: './time-picker-docs.component.html',
  styleUrl: './time-picker-docs.component.css'
})
export class TimePickerDocsComponent {
  baseService = inject(BaseService);

  installation = `import { TimePickerComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [TimePickerComponent]
})`;

  valueContract = `// The control value is a 24-hour string — never a Date.
'09:30'      // HH:mm
'14:05:30'   // HH:mm:ss, when [showSeconds]="true"
null         // nothing chosen yet

// Rendering a 12-hour face does not change the value:
// <tolle-time-picker [use12Hours]="true" /> still writes '14:05'.`;

  helpers = `import {
  parseTimeString,   // 'HH:mm' | 'HH:mm:ss' -> TimeParts | null (null when malformed)
  formatTimeString,  // TimeParts, withSeconds? -> 'HH:mm' | 'HH:mm:ss'
  to12Hour,          // 14 -> { hour12: 2, meridiem: 'PM' }
  from12Hour,        // (12, 'AM') -> 0
  timePartsToSeconds // { hour, minute, second } -> seconds since midnight
} from '@tolle_/tolle-ui';

interface TimeParts { hour: number; minute: number; second: number }

parseTimeString('09:30');          // { hour: 9, minute: 30, second: 0 }
parseTimeString('25:00');          // null — out of range
formatTimeString({ hour: 9, minute: 5, second: 0 });        // '09:05'
formatTimeString({ hour: 9, minute: 5, second: 7 }, true);  // '09:05:07'
timePartsToSeconds({ hour: 9, minute: 30, second: 0 });     // 34200`;

  basicCode = `<span class="text-sm font-medium">Start time</span>

<tolle-time-picker [(ngModel)]="time" ariaLabel="Start time" />

<p>Value: {{ time || 'null' }}</p>`;

  basicTs = `import { FormsModule } from '@angular/forms';
import { TimePickerComponent } from '@tolle_/tolle-ui';

export class BasicTimePickerComponent {
  // A plain 24-hour HH:mm string — no date, no timezone.
  time: string | null = '09:30';
}`;

  twelveHourCode = `<span class="text-sm font-medium">Broadcast at</span>

<tolle-time-picker
  [(ngModel)]="time"
  [use12Hours]="true"
  [showSeconds]="true"
  [secondStep]="10"
  ariaLabel="Broadcast at" />

<p>Value: {{ time || 'null' }}</p>`;

  twelveHourTs = `export class TimePicker12HourComponent {
  // use12Hours only changes the face; the value stays 24-hour and gains
  // a seconds part because showSeconds is on.
  time: string | null = '14:05:30';
}`;

  boundedCode = `<tolle-time-picker
  [(ngModel)]="slot"
  min="09:00"
  max="17:30"
  [minuteStep]="15"
  placeholder="Pick a slot…"
  ariaLabel="Appointment slot" />

<tolle-time-picker size="sm" [(ngModel)]="small" ariaLabel="Small" />
<tolle-time-picker size="lg" [(ngModel)]="large" ariaLabel="Large" />
<tolle-time-picker [invalid]="true" [(ngModel)]="required" placeholder="Required…" ariaLabel="Invalid" />
<tolle-time-picker [disabled]="true" placeholder="Disabled" ariaLabel="Disabled" />`;

  boundedTs = `export class TimePickerBoundedComponent {
  slot: string | null = '09:00';

  small: string | null = '08:15';
  large: string | null = '17:45';
  required: string | null = null;
}`;

  reactiveCode = `import { FormControl, FormGroup, Validators } from '@angular/forms';

form = new FormGroup({
  openAt: new FormControl<string | null>('09:00', Validators.required)
});

// <tolle-time-picker formControlName="openAt" min="06:00" max="22:00" />
// form.value -> { openAt: '09:00' }
// control.disable() reaches the picker through setDisabledState().`;

  columnsCode = `import { TimeColumnsComponent, TimeParts } from '@tolle_/tolle-ui';

// <tolle-time-columns
//   [hour]="hour" [minute]="minute" [second]="second"
//   [use12Hours]="true"
//   [minSeconds]="9 * 3600" [maxSeconds]="17 * 3600"
//   (timeChange)="onTimeChange($event)" />

onTimeChange(parts: TimeParts): void {
  this.hour = parts.hour;
  this.minute = parts.minute;
  this.second = parts.second;
}`;

  timePickerProps: PropEntry[] = [
    { name: 'placeholder', type: 'string', default: "'Select a time'", description: 'Text shown on the trigger when no time is selected.' },
    { name: 'use12Hours', type: 'boolean', default: 'false', description: 'Renders a 12-hour face with an AM/PM column. The emitted value stays 24-hour.' },
    { name: 'showSeconds', type: 'boolean', default: 'false', description: 'Adds a seconds column and emits HH:mm:ss.' },
    { name: 'minuteStep', type: 'number', default: '1', description: 'Interval between minute entries, in minutes.' },
    { name: 'secondStep', type: 'number', default: '1', description: 'Interval between second entries, in seconds.' },
    { name: 'min', type: 'string', default: 'undefined', description: 'Earliest selectable time as a 24-hour HH:mm string; earlier entries are disabled.' },
    { name: 'max', type: 'string', default: 'undefined', description: 'Latest selectable time as a 24-hour HH:mm string; later entries are disabled.' },
    { name: 'size', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'", description: 'Height and text size of the trigger and entries.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies the destructive border and focus ring.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control. Also set for you by setDisabledState() when a form control is disabled.' },
    { name: 'valueType', type: "'string' | 'date'", default: "'string'", description: 'Exchange Date objects instead of HH:mm strings through the form control. The time is written onto today’s date, or onto the date already held by the control.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name when there is no associated visible label.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the trigger via cn() (last-wins).' }
  ];

  timePickerOutputs: PropEntry[] = [
    { name: 'valueChange', type: 'EventEmitter<string | Date | null>', description: 'Emitted with the chosen time whenever it changes — an HH:mm string by default, a Date when valueType is "date".' },
    { name: 'opened', type: 'EventEmitter<void>', description: 'Emitted when the panel opens.' },
    { name: 'closed', type: 'EventEmitter<void>', description: 'Emitted when the panel closes.' }
  ];

  timeColumnsProps: PropEntry[] = [
    { name: 'hour', type: 'number | null', default: 'null', description: 'Selected hour in 24-hour form, or null when nothing is chosen yet.' },
    { name: 'minute', type: 'number | null', default: 'null', description: 'Selected minute, or null when nothing is chosen yet.' },
    { name: 'second', type: 'number | null', default: 'null', description: 'Selected second, or null when nothing is chosen yet.' },
    { name: 'use12Hours', type: 'boolean', default: 'false', description: 'Renders a 12-hour clock face with an AM/PM column.' },
    { name: 'showSeconds', type: 'boolean', default: 'false', description: 'Adds the seconds column.' },
    { name: 'minuteStep', type: 'number', default: '1', description: 'Interval between minute entries, in minutes.' },
    { name: 'secondStep', type: 'number', default: '1', description: 'Interval between second entries, in seconds.' },
    { name: 'minSeconds', type: 'number', default: '0', description: 'Earliest selectable time, as seconds since midnight.' },
    { name: 'maxSeconds', type: 'number', default: '86399', description: 'Latest selectable time, as seconds since midnight.' },
    { name: 'size', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'", description: 'Row height and text size of the entries.' },
    { name: 'class', type: 'string', default: "''", description: 'Extra Tailwind classes merged onto the column strip via cn() (last-wins).' }
  ];

  timeColumnsOutputs: PropEntry[] = [
    { name: 'timeChange', type: 'EventEmitter<TimeParts>', description: 'Emitted with the full wall-clock time whenever an entry is chosen.' }
  ];
}
