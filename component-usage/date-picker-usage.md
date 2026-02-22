# Date Picker Component Usage Guide

## Overview

The Date Picker component is a calendar-based date input that allows users to select a single date from a calendar popover. It provides a user-friendly interface for date selection with keyboard navigation support.

## Import

```typescript
import { DatePickerComponent } from '@tolle_/tolle-ui';
```

## Component

### DatePickerComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `string` | Auto-generated | Input element ID |
| `label` | `string` | `''` | Label text |
| `hint` | `string` | `''` | Hint text |
| `errorMessage` | `string` | `''` | Error message text |
| `error` | `boolean` | `false` | Error state |
| `hideHintOnFocus` | `boolean` | `true` | Hide hint when focused |
| `placeholder` | `string` | `'Select date'` | Input placeholder |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |
| `size` | `'xs' \| 'sm' \| 'default' \| 'lg'` | `'default'` | Input size |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabledDates` | `Date[]` | `[]` | Array of disabled dates |
| `format` | `string` | - | Date format pattern |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `dateSelect` | `EventEmitter<Date>` | Emitted when a date is selected |

## Basic Usage

### Simple Date Picker

```html
<tolle-date-picker
  [label]="'Birth Date'"
  [(ngModel)]="date"
></tolle-date-picker>
```

### With Placeholder

```html
<tolle-date-picker
  [label]="'Select Date'"
  [placeholder]="'MM/DD/YYYY'"
  [(ngModel)]="date"
></tolle-date-picker>
```

### Disabled State

```html
<tolle-date-picker
  [label]="'Event Date'"
  [disabled]="true"
></tolle-date-picker>
```

### Read-Only State

```html
<tolle-date-picker
  [label]="'Event Date'"
  [readonly]="true"
></tolle-date-picker>
```

## Date Limits

### Minimum Date

```html
<tolle-date-picker
  [label]="'Start Date'"
  [minDate]="minDate"
  [(ngModel)]="startDate"
></tolle-date-picker>
```

```typescript
minDate = new Date();
```

### Maximum Date

```html
<tolle-date-picker
  [label]="'End Date'"
  [maxDate]="maxDate"
  [(ngModel)]="endDate"
></tolle-date-picker>
```

```typescript
maxDate = new Date(new Date().setDate(new Date().getDate() + 30));
```

### Disabled Dates

```html
<tolle-date-picker
  [label]="'Appointment'"
  [disabledDates]="disabledDates"
  [(ngModel)]="appointmentDate"
></tolle-date-picker>
```

```typescript
disabledDates = [
  new Date(2024, 0, 1),   // New Year's Day
  new Date(2024, 11, 25), // Christmas
  ...this.getSaturdaysAndSundays()
];
```

## Form Integration

### Template-Driven Form

```html
<form #form="ngForm">
  <tolle-date-picker
    name="date"
    [(ngModel)]="formData.date"
    #date="ngModel"
    [label]="'Date'"
    required
  ></tolle-date-picker>

  <div *ngIf="date.invalid && date.touched">
    Date is required
  </div>
</form>
```

### Reactive Form

```typescript
this.form = this.fb.group({
  date: [new Date(), [Validators.required]],
});

// Get the date value
get dateValue() {
  return this.form.get('date')?.value;
}
```

## Date Selection Handler

```html
<tolle-date-picker
  [label]="'Event Date'"
  (dateSelect)="onDateSelect($event)"
></tolle-date-picker>
```

```typescript
onDateSelect(date: Date) {
  console.log('Selected date:', date);
  console.log('Date string:', date.toLocaleDateString());
  console.log('ISO format:', date.toISOString());
}
```

## Size Variants

```html
<!-- Extra Small -->
<tolle-date-picker size="xs"></tolle-date-picker>

<!-- Small -->
<tolle-date-picker size="sm"></tolle-date-picker>

<!-- Default -->
<tolle-date-picker size="default"></tolle-date-picker>

<!-- Large -->
<tolle-date-picker size="lg"></tolle-date-picker>
```

## With Error State

```html
<tolle-date-picker
  [label]="'Date of Birth'"
  [error]="hasError"
  [errorMessage]="'Please select a valid date'"
  [(ngModel)]="date"
></tolle-date-picker>
```

## Custom Input Formatting

```html
<tolle-date-picker
  [label]="'Appointment Date'"
  [placeholder]="'Select a date'"
  [(ngModel)]="date"
></tolle-date-picker>
```

The component uses the browser's default date formatting based on the user's locale.

## Calendar Display

The calendar shows:
- Current month with days of the week
- Previous and next month navigation
- Selected date highlighted
- Today's date marked
- Keyboard navigation support

## Accessibility

- Full keyboard navigation (arrow keys, Enter, Escape)
- Focus management
- ARIA attributes for screen readers
- Required and error states announced correctly

## Date Formats

The component uses native Date objects. To format dates for display:

```typescript
// Using Intl
const formatted = new Intl.DateTimeFormat('en-US').format(date);

// Using toLocaleDateString
const formatted = date.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// ISO 8601
const isoString = date.toISOString();
```

## Use Cases

### Age Verification

```html
<tolle-date-picker
  [label]="'Date of Birth'"
  [maxDate]="maxBirthDate"
  [(ngModel)]="dateOfBirth"
>
</tolle-date-picker>
```

```typescript
maxBirthDate = new Date();
maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18);
```

### Date Range Selection

```html
<div class="flex gap-4">
  <tolle-date-picker
    [label]="'Start Date'"
    [maxDate]="endDate"
    [(ngModel)]="startDate"
  ></tolle-date-picker>

  <tolle-date-picker
    [label]="'End Date'"
    [minDate]="startDate"
    [(ngModel)]="endDate"
  ></tolle-date-picker>
</div>
```

### Past Date Selection

```html
<tolle-date-picker
  [label]="'Date of Birth'"
  [maxDate]="today"
  [(ngModel)]="dateOfBirth"
></tolle-date-picker>
```

```typescript
today = new Date();
```
