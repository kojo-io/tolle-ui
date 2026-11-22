import type { RegistrySidecar } from '../../../registry/src/types';

export const datePickerRegistry: RegistrySidecar = {
  description: 'A date input that opens a calendar popover; also supports month and year modes.',
  whenToUse: 'Picking a single date in a form.',
  alternatives: [
    { name: 'date-range-picker', when: 'the user picks a start and end date.' },
    { name: 'date-time-picker', when: 'a time of day is needed too.' },
    { name: 'calendar', when: 'the calendar should be shown inline, not in a popover.' },
  ],
  forms: {
    DatePickerComponent: {
      valueType: 'Date | null',
      notes: 'It accepts a `Date` or a date string and writes back a `Date` at the start of the day (local time).',
    },
  },
  pitfalls: [
    'Limit the range with `[minDate]` / `[maxDate]` (Date objects) or `[disablePastDates]="true"`.',
    'Change the display text with `[displayFormat]`; the bound value stays a `Date`.',
    'Its error flag is `[invalid]` (not `error`); pair it with `errorMessage`. `label` and `hint` work like on `tolle-input`.',
  ],
  keywords: ['date', 'calendar', 'datepicker', 'day'],
};
