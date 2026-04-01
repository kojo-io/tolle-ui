# Calendar Component Usage Guide

## Overview

The Calendar component provides a date picker with date, month, and year views. It supports date selection, range selection, and various formatting options.

## Import

```typescript
import {
  CalendarComponent,
  RangeCalendarComponent,
  DatePickerComponent,
  DateRangePickerComponent,
} from '@tolle_/tolle-ui';
```

## CalendarComponent

**Inputs:**

| Input              | Type                          | Default     | Description                  |
| ------------------ | ----------------------------- | ----------- | ---------------------------- |
| `class`            | `string`                      | `''`        | Additional CSS classes       |
| `mode`             | `'date' \| 'month' \| 'year'` | `'date'`    | Calendar view mode           |
| `disablePastDates` | `boolean`                     | `false`     | Disable past dates selection |
| `showQuickActions` | `boolean`                     | `true`      | Show today/clear buttons     |
| `minDate`          | `Date`                        | `undefined` | Minimum selectable date      |
| `maxDate`          | `Date`                        | `undefined` | Maximum selectable date      |
| `formatMonthFn`    | `(date: Date) => string`      | `undefined` | Custom month formatter       |
| `formatYearFn`     | `(date: Date) => string`      | `undefined` | Custom year formatter        |
| `formatDateFn`     | `(date: Date) => string`      | `undefined` | Custom date formatter        |

**Outputs:**

| Output       | Type                 | Description                   |
| ------------ | -------------------- | ----------------------------- |
| `dateSelect` | `EventEmitter<Date>` | Emitted when date is selected |

## Basic Usage

### Basic Calendar

```html
<div class="flex flex-col items-center gap-4 rounded-lg border bg-card p-4">
  <p class="text-sm text-muted-foreground">Selected: {{ date | date:'fullDate' }}</p>
  <tolle-calendar [(ngModel)]="date"></tolle-calendar>
</div>
```

### Disabled Calendar

```html
<div class="flex flex-wrap justify-center gap-8 rounded-lg border bg-card p-4">
  <div class="flex flex-col items-center gap-2">
    <span class="text-sm font-medium">Disable Past Dates</span>
    <tolle-calendar [disablePastDates]="true"></tolle-calendar>
  </div>

  <div class="flex flex-col items-center gap-2">
    <span class="text-sm font-medium">Min/Max Date (±7 days)</span>
    <tolle-calendar [minDate]="minDate" [maxDate]="maxDate"></tolle-calendar>
  </div>
</div>
```

### Mode Calendar

```html
<div class="flex flex-wrap justify-center gap-8 rounded-lg border bg-card p-4">
  <div class="flex flex-col items-center gap-2">
    <span class="text-sm font-medium">Month Mode</span>
    <tolle-calendar mode="month"></tolle-calendar>
  </div>

  <div class="flex flex-col items-center gap-2">
    <span class="text-sm font-medium">Year Mode</span>
    <tolle-calendar mode="year"></tolle-calendar>
  </div>
</div>
```
