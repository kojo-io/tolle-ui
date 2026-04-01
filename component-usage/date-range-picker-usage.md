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

### Basic Range

```html
<div class="max-w-md w-full">
      <tolle-date-range-picker [(ngModel)]="range"></tolle-date-range-picker>
      <p class="mt-4 text-sm text-muted-foreground">
        Selected: {{ range.start | date:'mediumDate' }} - {{ range.end | date:'mediumDate' }}
      </p>
    </div>
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
