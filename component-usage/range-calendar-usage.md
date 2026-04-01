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

```html
### Basic Range Calendar

```html
<div class="flex flex-col items-center gap-4 p-4 border rounded-lg bg-card">
  <pre class="text-xs bg-muted p-2 rounded w-full overflow-auto">{{ range | json }}</pre>
  <tolle-range-calendar [(ngModel)]="range"></tolle-range-calendar>
</div>
```

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
