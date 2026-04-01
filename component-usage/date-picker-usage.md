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

### Base Date Picker

```html
<tolle-date-picker [(ngModel)]="date"></tolle-date-picker>
```

### Month Picker

```html
<tolle-date-picker mode="month" [(ngModel)]="date"></tolle-date-picker>
```

### Year Picker

```html
<tolle-date-picker mode="year" [(ngModel)]="date"></tolle-date-picker>
```

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
