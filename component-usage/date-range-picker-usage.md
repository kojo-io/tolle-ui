# Date Range Picker Component Usage Guide

## Overview

The Date Range Picker component allows users to select a date range with start and end dates. It uses the Calendar component as its base and provides a user-friendly interface for selecting date ranges.

## Import

```typescript
import { DateRangePickerComponent } from '@tolle_/tolle-ui';
```

## Component

### DateRangePickerComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `string` | Auto-generated | Input element ID |
| `label` | `string` | `''` | Label text |
| `hint` | `string` | `''` | Hint text |
| `errorMessage` | `string` | `''` | Error message text |
| `error` | `boolean` | `false` | Error state |
| `hideHintOnFocus` | `boolean` | `true` | Hide hint when focused |
| `placeholder` | `string` | `'Select date range'` | Input placeholder |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Read-only state |
| `size` | `'xs' \| 'sm' \| 'default' \| 'lg'` | `'default'` | Input size |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabledDates` | `Date[]` | `[]` | Array of disabled dates |
| `showRangePreview` | `boolean` | `true` | Show range preview on hover |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `rangeSelect` | `EventEmitter<{start: Date, end: Date}>` | Emitted when a date range is selected |

## Basic Usage

### Simple Date Range Picker

```html
<tolle-date-range-picker
  [label]="'Trip Dates'"
  [(ngModel)]="dateRange"
></tolle-date-range-picker>
```

```typescript
// dateRange structure:
{
  start: Date,
  end: Date
}
```

### With Placeholder

```html
<tolle-date-range-picker
  [label]="'Booking Period'"
  [placeholder]="'MM/DD/YYYY - MM/DD/YYYY'"
  [(ngModel)]="bookingRange"
></tolle-date-range-picker>
```

### Disabled State

```html
<tolle-date-range-picker
  [label]="'Historical Range'"
  [disabled]="true"
></tolle-date-range-picker>
```

## Date Limits

### Minimum Date

```html
<tolle-date-range-picker
  [label]="'Reservation Period'"
  [minDate]="minDate"
  [(ngModel)]="reservationRange"
></tolle-date-range-picker>
```

```typescript
minDate = new Date();
```

### Maximum Date

```html
<tolle-date-range-picker
  [label]="'Project Timeline'"
  [maxDate]="maxDate"
  [(ngModel)]="timelineRange"
></tolle-date-range-picker>
```

```typescript
maxDate = new Date(new Date().setDate(new Date().getDate() + 365));
```

### Disabled Dates

```html
<tolle-date-range-picker
  [label]="'Vacation Dates'"
  [disabledDates]="unavailableDates"
  [(ngModel)]="vacationRange"
></tolle-date-range-picker>
```

```typescript
unavailableDates = [
  new Date(2024, 11, 25), // Christmas
  new Date(2024, 11, 31), // New Year's Eve
];
```

## Form Integration

### Template-Driven Form

```html
<form #form="ngForm">
  <tolle-date-range-picker
    name="dateRange"
    [(ngModel)]="formData.dateRange"
    #range="ngModel"
    [label]="'Date Range'"
    required
  ></tolle-date-range-picker>

  <div *ngIf="range.invalid && range.touched">
    Date range is required
  </div>
</form>
```

### Reactive Form

```typescript
this.form = this.fb.group({
  dateRange: [null, [Validators.required]],
});

// Access the range
get dateRangeValue() {
  return this.form.get('dateRange')?.value;
}
```

## Range Selection Handler

```html
<tolle-date-range-picker
  [label]="'Event Period'"
  (rangeSelect)="onRangeSelect($event)"
></tolle-date-range-picker>
```

```typescript
onRangeSelect(range: { start: Date; end: Date }) {
  console.log('Start:', range.start);
  console.log('End:', range.end);

  // Calculate duration
  const diffTime = Math.abs(range.end.getTime() - range.start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  console.log('Duration:', diffDays, 'days');
}
```

## Size Variants

```html
<!-- Extra Small -->
<tolle-date-range-picker size="xs"></tolle-date-range-picker>

<!-- Small -->
<tolle-date-range-picker size="sm"></tolle-date-range-picker>

<!-- Default -->
<tolle-date-range-picker size="default"></tolle-date-range-picker>

<!-- Large -->
<tolle-date-range-picker size="lg"></tolle-date-range-picker>
```

## With Error State

```html
<tolle-date-range-picker
  [label]="'Booking Period'"
  [error]="hasError"
  [errorMessage]="'Please select a valid date range'"
  [(ngModel)]="bookingRange"
></tolle-date-range-picker>
```

## Date Range Display

The component displays the selected range as:
```
MM/DD/YYYY - MM/DD/YYYY
```

When a date is selected but no end date yet, it shows:
```
MM/DD/YYYY - Select end date
```

## Use Cases

### Hotel Booking

```html
<tolle-date-range-picker
  [label]="'Check-in - Check-out'"
  [minDate]="today"
  [(ngModel)]="bookingDates"
>
</tolle-date-range-picker>
```

```typescript
today = new Date();
```

### Report Period

```html
<tolle-date-range-picker
  [label]="'Report Period'"
  [placeholder]="'Select report period'"
  [(ngModel)]="reportRange"
>
</tolle-date-range-picker>
```

### Availability Check

```html
<tolle-date-range-picker
  [label]="'Request Dates'"
  [disabledDates]="blockedDates"
  [(ngModel)]="requestedDates"
>
</tolle-date-range-picker>
```

### Date Range Validation

```html
<tolle-date-range-picker
  [label]="'Event Dates'"
  [minDate]="minDate"
  [maxDate]="maxDate"
  (rangeSelect)="validateRange($event)"
  [(ngModel)]="eventDates"
>
</tolle-date-range-picker>
```

```typescript
minDate = new Date();
minDate.setDate(minDate.getDate() + 7); // Minimum 7 days from now

maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() + 1); // Maximum 1 year from now

validateRange(range: { start: Date; end: Date }) {
  const diffTime = range.end.getTime() - range.start.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 1) {
    this.errorMessage = 'End date must be after start date';
  } else if (diffDays > 90) {
    this.errorMessage = 'Maximum booking period is 90 days';
  }
}
```

## Accessibility

- Full keyboard navigation (arrow keys, Enter, Escape)
- Focus management
- ARIA attributes for screen readers
- Required and error states announced correctly

## Custom Styling

```html
<tolle-date-range-picker
  class="custom-date-range"
></tolle-date-range-picker>
```

```css
.custom-date-range {
  /* Your custom styles */
}
```
