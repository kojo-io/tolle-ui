# Range Calendar Component Usage Guide

## Overview

The Range Calendar component is a calendar interface for selecting date ranges. It displays a full calendar view with the ability to select both a start and end date, showing the selected range visually.

## Import

```typescript
import { RangeCalendarComponent } from '@tolle_/tolle-ui';
```

## Component

### RangeCalendarComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `string` | Auto-generated | Calendar element ID |
| `label` | `string` | `''` | Label text |
| `class` | `string` | `''` | Additional CSS classes |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabledDates` | `Date[]` | `[]` | Array of disabled dates |
| `initialMonth` | `Date` | Current month | Initial month to display |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `rangeSelect` | `EventEmitter<{start: Date, end: Date}>` | Emitted when a date range is selected |
| `monthChange` | `EventEmitter<Date>` | Emitted when the displayed month changes |

## Basic Usage

### Simple Range Calendar

```html
<tolle-range-calendar
  [label]="'Select Dates'"
  [(ngModel)]="dateRange"
></tolle-range-calendar>
```

```typescript
// dateRange structure:
{
  start: Date,
  end: Date
}
```

### Default Month

```html
<tolle-range-calendar
  [initialMonth]="defaultMonth"
  [(ngModel)]="dateRange"
></tolle-range-calendar>
```

```typescript
defaultMonth = new Date(2024, 5, 1); // June 2024
```

## Date Limits

### Minimum Date

```html
<tolle-range-calendar
  [label]="'Available Dates'"
  [minDate]="minDate"
  [(ngModel)]="availableRange"
></tolle-range-calendar>
```

```typescript
minDate = new Date();
```

### Maximum Date

```html
<tolle-range-calendar
  [label]="'Booking Dates'"
  [maxDate]="maxDate"
  [(ngModel)]="bookingRange"
></tolle-range-picker>
```

```typescript
maxDate = new Date(new Date().setDate(new Date().getDate() + 365));
```

### Disabled Dates

```html
<tolle-range-calendar
  [label]="'Vacation Dates'"
  [disabledDates]="blockedDates"
  [(ngModel)]="vacationRange"
></tolle-range-calendar>
```

```typescript
blockedDates = [
  new Date(2024, 11, 25), // Christmas
  new Date(2024, 11, 31), // New Year's Eve
];
```

## Form Integration

### Template-Driven Form

```html
<form #form="ngForm">
  <tolle-range-calendar
    name="dateRange"
    [(ngModel)]="formData.dateRange"
    #range="ngModel"
    [label]="'Date Range'"
    required
  ></tolle-range-calendar>

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
<tolle-range-calendar
  [label]="'Event Dates'"
  (rangeSelect)="onRangeSelect($event)"
  (monthChange)="onMonthChange($event)"
></tolle-range-calendar>
```

```typescript
onRangeSelect(range: { start: Date; end: Date }) {
  console.log('Start:', range.start);
  console.log('End:', range.end);
}

onMonthChange(month: Date) {
  console.log('New month:', month.toLocaleString('default', { month: 'long', year: 'numeric' }));
}
```

## Range Calendar with Selection

```html
<tolle-range-calendar
  [label]="'Hotel Booking'"
  [minDate]="today"
  [(ngModel)]="bookingRange"
  (rangeSelect)="calculateTotal($event)"
></tolle-range-calendar>

<div *ngIf="bookingRange" class="mt-4">
  <p>Check-in: {{ bookingRange.start | date }}</p>
  <p>Check-out: {{ bookingRange.end | date }}</p>
  <p>Nights: {{ calculateNights(bookingRange) }}</p>
</div>
```

```typescript
today = new Date();

calculateNights(range: { start: Date; end: Date }) {
  const diffTime = Math.abs(range.end.getTime() - range.start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
```

## Navigation Between Months

The component includes navigation buttons to move between months:
- Previous month button
- Next month button
- Current month header

## Visual Indicators

The component shows:
- Selected date range highlighted
- Start and end dates with distinct styling
- Hover states for date selection preview
- Today's date marked
- Disabled dates in gray
- Previous/next month dates in muted color

## Accessibility

- Full keyboard navigation (arrow keys, Enter, Escape)
- Focus management
- ARIA attributes for screen readers
- Required and error states announced correctly

## Custom Styling

```html
<tolle-range-calendar
  class="custom-range-calendar"
></tolle-range-calendar>
```

```css
.custom-range-calendar {
  /* Your custom styles */
}
```

## Use Cases

### Hotel/Rental Booking

```html
<tolle-range-calendar
  [label]="'Check-in - Check-out'"
  [minDate]="tomorrow"
  [(ngModel)]="bookingDates"
>
</tolle-range-calendar>
```

```typescript
tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
```

### Leave Request

```html
<tolle-range-calendar
  [label]="'Leave Period'"
  [disabledDates]="blockedDates"
  [(ngModel)]="leaveDates"
>
</tolle-range-calendar>
```

### Event Planning

```html
<tolle-range-calendar
  [label]="'Event Duration'"
  [minDate]="nextWeek"
  [maxDate]="nextYear"
  [(ngModel)]="eventDates"
>
</tolle-range-calendar>
```

### Data Analysis Period

```html
<tolle-range-calendar
  [label]="'Report Period'"
  [(ngModel)]="reportDates"
>
</tolle-range-calendar>
```
