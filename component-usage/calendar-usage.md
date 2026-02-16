# Calendar Component Usage Guide

## Overview

The Calendar component provides a date picker with date, month, and year views. It supports date selection, range selection, and various formatting options.

## Import

```typescript
import { CalendarComponent, RangeCalendarComponent, DatePickerComponent, DateRangePickerComponent } from '@tolle_/tolle-ui';
```

## CalendarComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `mode` | `'date'\|'month'\|'year'` | `'date'` | Calendar mode |
| `disablePastDates` | `boolean` | `false` | Disable past dates |
| `showQuickActions` | `boolean` | `false` | Show today/clear buttons |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `formatMonthFn` | `function` | - | Custom month formatter |
| `formatYearFn` | `function` | - | Custom year formatter |
| `formatDateFn` | `function` | - | Custom date formatter |
| `ngModel` | `Date` | `null` | Two-way binding value |
| `formControlName` | `string` | - | Form control name |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `dateSelect` | `EventEmitter<Date>` | Emitted when date is selected |

## Basic Usage

### Simple Calendar

```html
<calendar-component [(ngModel)]="selectedDate" />
<p>Selected: {{ selectedDate | date }}</p>
```

### Calendar with Quick Actions

```html
<calendar-component
  [(ngModel)]="selectedDate"
  [showQuickActions]="true"
/>
```

### Calendar with Date Range

```html
<calendar-component
  [(ngModel)]="selectedDate"
  [minDate]="minDate"
  [maxDate]="maxDate"
/>
```

```typescript
minDate = new Date(2023, 0, 1);
maxDate = new Date(2023, 11, 31);
```

## Calendar Modes

### Date Mode (Default)

```html
<calendar-component [(ngModel)]="selectedDate" mode="date" />
```

### Month Mode

```html
<calendar-component [(ngModel)]="selectedMonth" mode="month" />
```

### Year Mode

```html
<calendar-component [(ngModel)]="selectedYear" mode="year" />
```

## Calendar with Disable Past Dates

```html
<calendar-component
  [(ngModel)]="selectedDate"
  [disablePastDates]="true"
/>
```

## Calendar with Custom Formatting

### Custom Month Formatter

```html
<calendar-component
  [(ngModel)]="selectedDate"
  [formatMonthFn]="formatMonth"
  [formatYearFn]="formatYear"
/>
```

```typescript
formatMonth(month: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month];
}

formatYear(year: number): string {
  return year.toString();
}
```

### Custom Date Formatter

```html
<calendar-component
  [(ngModel)]="selectedDate"
  [formatDateFn]="formatDate"
/>
```

```typescript
formatDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
```

## Calendar in Modal

```html
<tolle-alert-dialog>
  <tolle-alert-dialog-trigger>
    <button>Select Date</button>
  </tolle-alert-dialog-trigger>

  <tolle-alert-dialog-portal>
    <tolle-alert-dialog-content>
      <tolle-alert-dialog-header>
        <tolle-alert-dialog-title>Select a Date</tolle-alert-dialog-title>
      </tolle-alert-dialog-header>

      <tolle-alert-dialog-content>
        <calendar-component [(ngModel)]="selectedDate" />
      </tolle-alert-dialog-content>

      <tolle-alert-dialog-footer>
        <tolle-alert-dialog-cancel>
          <button variant="outline">Cancel</button>
        </tolle-alert-dialog-cancel>
        <tolle-alert-dialog-action>
          <button (click)="confirmDate()">Confirm</button>
        </tolle-alert-dialog-action>
      </tolle-alert-dialog-footer>
    </tolle-alert-dialog-content>
  </tolle-alert-dialog-portal>
</tolle-alert-dialog>
```

## Calendar with Event Emitter

```html
<calendar-component
  [(ngModel)]="selectedDate"
  (dateSelect)="onDateSelect($event)"
/>
```

```typescript
onDateSelect(date: Date) {
  console.log('Date selected:', date);
  // Perform action
}
```

## Calendar with Selected State

### Programmatically Setting Date

```typescript
ngOnInit() {
  this.selectedDate = new Date();
}
```

```html
<calendar-component [(ngModel)]="selectedDate" />
```

## Calendar in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Calendar</tolle-card-title>
    <tolle-card-description>Select a date</tolle-card-description>
  </tolle-card-header>
  <tolle-card-content>
    <calendar-component [(ngModel)]="selectedDate" />
  </tolle-card-content>
</tolle-card>
```

## RangeCalendarComponent

### Date Range Selection

```html
<range-calendar-component [(ngModel)]="dateRange" />
<p>Range: {{ dateRange?.start | date }} - {{ dateRange?.end | date }}</p>
```

```typescript
dateRange = { start: null, end: null };
```

### Range Calendar with Disable Past Dates

```html
<range-calendar-component
  [(ngModel)]="dateRange"
  [disablePastDates]="true"
/>
```

## DatePickerComponent

### Date Picker Input

```html
<date-picker-component [(ngModel)]="selectedDate" />
```

## DateRangePickerComponent

### Date Range Picker Input

```html
<date-range-picker-component [(ngModel)]="dateRange" />
```

## Calendar with Time

### Date and Time Picker

```html
<!-- Note: This may require custom implementation or a different component -->
<calendar-component [(ngModel)]="selectedDateTime" />
```

## Calendar with Disabled Dates

### Custom Disabled Dates

```html
<calendar-component
  [(ngModel)]="selectedDate"
  [disabledDates]="disabledDates"
/>
```

```typescript
disabledDates = [
  new Date(2023, 0, 1),
  new Date(2023, 0, 15),
  new Date(2023, 1, 1)
];
```

## Calendar with Custom Styling

```html
<calendar-component
  [(ngModel)]="selectedDate"
  class="calendar-custom"
/>
```

```css
.calendar-custom {
  --calendar-bg: #f9fafb;
  --calendar-border: #e5e7eb;
  --calendar-text: #1f2937;
  --calendar-accent: #3b82f6;
}

.calendar-custom .selected {
  background-color: var(--calendar-accent);
  color: white;
}
```
